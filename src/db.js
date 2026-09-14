import { prefixInfo, defaultBereichFor } from "./config.js";

// Reserviert count Nummern für ein Präfix in genau zwei Queries (statt 2*count):
// einmal den Zähler per RETURNING um count erhöhen, dann alle Items in einem
// Multi-Row-INSERT anlegen.
export async function reserveNumbers(db, prefix, count, itemType) {
  const row = await db
    .prepare(`UPDATE counters SET next_value = next_value + ? WHERE prefix = ? RETURNING next_value - ? AS start`)
    .bind(count, prefix, count)
    .first();
  if (!row) throw new Error(`Unbekanntes Präfix: ${prefix}`);

  const numbers = [];
  const placeholders = [];
  const binds = [];
  for (let i = 0; i < count; i++) {
    const num = `${prefix}-${String(row.start + i).padStart(3, "0")}`;
    numbers.push(num);
    placeholders.push(`(?, ?, ?, 'reserviert')`);
    binds.push(num, prefix, itemType);
  }
  await db
    .prepare(`INSERT INTO items (number, prefix, item_type, status) VALUES ${placeholders.join(",")}`)
    .bind(...binds)
    .run();
  return numbers;
}

export async function getItemByNumber(db, number) {
  const item = await db.prepare(`SELECT * FROM items WHERE number = ?`).bind(number).first();
  if (!item) return null;
  const [result] = await attachDetailsBatch(db, [item]);
  return result;
}

// Hängt Kabel-/Geräte-/Rack-/Kisteninhalt-Details an eine Liste von Item-Zeilen
// an — in einer festen, kleinen Anzahl Batch-Queries statt einer pro Item.
// Wird von jedem Endpunkt genutzt, der Items zurückgibt (Einzel-Lookup, Liste,
// Event-Packliste), damit es nur eine Stelle mit dieser Logik gibt.
async function attachDetailsBatch(db, items) {
  if (!items.length) return [];
  const ids = items.map((i) => i.id);
  const ph = ids.map(() => "?").join(",");

  const [{ results: cables }, { results: devices }] = await Promise.all([
    db.prepare(`SELECT * FROM cables WHERE item_id IN (${ph})`).bind(...ids).all(),
    db.prepare(`SELECT * FROM devices WHERE item_id IN (${ph})`).bind(...ids).all(),
  ]);
  const cableByItemId = new Map(cables.map((c) => [c.item_id, c]));
  const deviceByItemId = new Map(devices.map((d) => [d.item_id, d]));

  const rackIds = [...new Set(devices.map((d) => d.rack_id).filter(Boolean))];
  let rackById = new Map();
  if (rackIds.length) {
    const rph = rackIds.map(() => "?").join(",");
    const { results: racks } = await db.prepare(`SELECT * FROM racks WHERE id IN (${rph})`).bind(...rackIds).all();
    rackById = new Map(racks.map((r) => [r.id, r]));
  }

  const containerIds = [...new Set(items.map((i) => i.container_item_id).filter(Boolean))];
  let containerNumberById = new Map();
  if (containerIds.length) {
    const cph = containerIds.map(() => "?").join(",");
    const { results: containers } = await db.prepare(`SELECT id, number FROM items WHERE id IN (${cph})`).bind(...containerIds).all();
    containerNumberById = new Map(containers.map((c) => [c.id, c.number]));
  }

  // Kisten-Inhalt bewusst nur eine Ebene tief (keine Rekursion) — verschachtelte
  // Kisten sind kein unterstützter Anwendungsfall, und so bleibt die Anzahl der
  // Queries für den ganzen Batch konstant statt von der Verschachtelungstiefe
  // abzuhängen.
  const kisteIds = new Set(
    items.filter((i) => { const info = prefixInfo(i.prefix); return info && info.kind === "geraet" && info.key === "kiste"; }).map((i) => i.id)
  );
  const contentsByContainerId = new Map();
  if (kisteIds.size) {
    const kph = [...kisteIds].map(() => "?").join(",");
    const { results: contentItems } = await db
      .prepare(`SELECT * FROM items WHERE container_item_id IN (${kph}) ORDER BY number`)
      .bind(...kisteIds)
      .all();
    if (contentItems.length) {
      const cIds = contentItems.map((c) => c.id);
      const cph2 = cIds.map(() => "?").join(",");
      const [{ results: cCables }, { results: cDevices }] = await Promise.all([
        db.prepare(`SELECT * FROM cables WHERE item_id IN (${cph2})`).bind(...cIds).all(),
        db.prepare(`SELECT * FROM devices WHERE item_id IN (${cph2})`).bind(...cIds).all(),
      ]);
      const cCableByItemId = new Map(cCables.map((c) => [c.item_id, c]));
      const cDeviceByItemId = new Map(cDevices.map((d) => [d.item_id, d]));
      for (const ci of contentItems) {
        const detail = ci.item_type === "kabel"
          ? { ...ci, cable: cCableByItemId.get(ci.id) || null, device: null }
          : { ...ci, cable: null, device: cDeviceByItemId.get(ci.id) || null };
        if (!contentsByContainerId.has(ci.container_item_id)) contentsByContainerId.set(ci.container_item_id, []);
        contentsByContainerId.get(ci.container_item_id).push(detail);
      }
    }
  }

  return items.map((item) => {
    let result;
    if (item.item_type === "kabel") {
      result = { ...item, cable: cableByItemId.get(item.id) || null, device: null };
    } else {
      const device = deviceByItemId.get(item.id) || null;
      const rack = device && device.rack_id ? (rackById.get(device.rack_id) || null) : null;
      result = { ...item, cable: null, device: device ? { ...device, rack } : null };
    }
    result.container = item.container_item_id ? (containerNumberById.get(item.container_item_id) || null) : null;
    if (kisteIds.has(item.id)) {
      result.contents = contentsByContainerId.get(item.id) || [];
    }
    return result;
  });
}

export async function listItems(db, { status, item_type, prefix, bereich, container, q, limit = 200 } = {}) {
  let sql = `SELECT items.* FROM items WHERE 1=1`;
  const binds = [];
  if (status) { sql += ` AND status = ?`; binds.push(status); }
  if (item_type) { sql += ` AND item_type = ?`; binds.push(item_type); }
  if (prefix) { sql += ` AND prefix = ?`; binds.push(prefix); }
  if (bereich) { sql += ` AND bereich = ?`; binds.push(bereich); }
  if (container) {
    sql += ` AND container_item_id = (SELECT id FROM items WHERE number = ?)`;
    binds.push(container);
  }
  if (q) { sql += ` AND (number LIKE ? OR notes LIKE ?)`; binds.push(`%${q}%`, `%${q}%`); }
  sql += ` ORDER BY created_at DESC LIMIT ?`;
  binds.push(limit);
  const { results } = await db.prepare(sql).bind(...binds).all();
  return attachDetailsBatch(db, results);
}

export async function saveItemDetails(db, number, payload) {
  const item = await db.prepare(`SELECT * FROM items WHERE number = ?`).bind(number).first();
  if (!item) throw new Error("Nummer nicht gefunden. Bitte zuerst eine Nummer reservieren/drucken.");

  const info = prefixInfo(item.prefix);
  if (!info) throw new Error("Unbekanntes Präfix.");

  const bereich = payload.bereich || defaultBereichFor(info.kind, info.key) || null;
  // Nur beim allerersten Speichern (aus "reserviert" heraus) automatisch auf
  // aktiv setzen — ein späteres Bearbeiten (z.B. Notiz korrigieren) an einem als
  // defekt/ausgemustert markierten Item soll dessen Status nicht überschreiben.
  const newStatus = item.status === "reserviert" ? "aktiv" : item.status;

  const now = new Date().toISOString();
  await db
    .prepare(`UPDATE items SET notes = ?, bereich = ?, status = ?, updated_at = ? WHERE id = ?`)
    .bind(payload.notes || null, bereich, newStatus, now, item.id)
    .run();

  if (item.item_type === "kabel") {
    const cat = info.key;
    await db
      .prepare(
        `INSERT INTO cables (item_id, category, cable_type, connector_a, connector_b, length_m)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(item_id) DO UPDATE SET category=excluded.category, cable_type=excluded.cable_type,
           connector_a=excluded.connector_a, connector_b=excluded.connector_b, length_m=excluded.length_m`
      )
      .bind(item.id, cat, payload.cable_type || null, payload.connector_a || null, payload.connector_b || null, payload.length_m ?? null)
      .run();
  } else {
    const deviceType = info.key;
    await db
      .prepare(
        `INSERT INTO devices (item_id, device_type, active_passive, brand, model, details, rack_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(item_id) DO UPDATE SET device_type=excluded.device_type, active_passive=excluded.active_passive,
           brand=excluded.brand, model=excluded.model, details=excluded.details, rack_id=excluded.rack_id`
      )
      .bind(
        item.id,
        deviceType,
        payload.active_passive || null,
        payload.brand || null,
        payload.model || null,
        payload.details || null,
        payload.rack_id || null
      )
      .run();
  }
  return getItemByNumber(db, number);
}

export async function setItemStatus(db, number, status) {
  await db.prepare(`UPDATE items SET status = ?, updated_at = ? WHERE number = ?`).bind(status, new Date().toISOString(), number).run();
  return getItemByNumber(db, number);
}

export async function deleteItem(db, number) {
  await db.prepare(`DELETE FROM items WHERE number = ?`).bind(number).run();
}

// ---------- Kisten / Container ----------
export async function setItemContainer(db, number, containerNumber) {
  const item = await db.prepare(`SELECT * FROM items WHERE number = ?`).bind(number).first();
  if (!item) throw new Error("Nummer nicht gefunden.");

  if (!containerNumber) {
    await db.prepare(`UPDATE items SET container_item_id = NULL, updated_at = ? WHERE id = ?`).bind(new Date().toISOString(), item.id).run();
    return getItemByNumber(db, number);
  }

  if (containerNumber === number) throw new Error("Ein Item kann sich nicht selbst enthalten.");

  const container = await db.prepare(`SELECT * FROM items WHERE number = ?`).bind(containerNumber).first();
  if (!container) throw new Error("Kiste (" + containerNumber + ") nicht gefunden.");
  const containerInfo = prefixInfo(container.prefix);
  if (!containerInfo || containerInfo.kind !== "geraet" || containerInfo.key !== "kiste") {
    throw new Error(containerNumber + " ist keine Kiste.");
  }

  await db
    .prepare(`UPDATE items SET container_item_id = ?, updated_at = ? WHERE id = ?`)
    .bind(container.id, new Date().toISOString(), item.id)
    .run();
  return getItemByNumber(db, number);
}

// ---------- Racks ----------
export async function listRacks(db) {
  const { results } = await db.prepare(`SELECT * FROM racks ORDER BY name`).all();
  return results;
}

export async function createRack(db, name, location, notes) {
  const res = await db
    .prepare(`INSERT INTO racks (name, location, notes) VALUES (?, ?, ?) RETURNING *`)
    .bind(name, location || null, notes || null)
    .first();
  return res;
}

export async function deleteRack(db, id) {
  await db.prepare(`DELETE FROM racks WHERE id = ?`).bind(id).run();
}

// ---------- Events ----------
export async function listEvents(db) {
  const { results } = await db.prepare(`SELECT * FROM events ORDER BY event_date ASC`).all();
  if (!results.length) return [];
  const ids = results.map((e) => e.id);
  const ph = ids.map(() => "?").join(",");
  const { results: rows } = await db
    .prepare(`SELECT event_id, COUNT(*) AS total, SUM(packed) AS packed FROM event_items WHERE event_id IN (${ph}) GROUP BY event_id`)
    .bind(...ids)
    .all();
  const progressById = new Map(rows.map((r) => [r.event_id, { total: r.total, packed: r.packed || 0 }]));
  return results.map((ev) => ({ ...ev, progress: progressById.get(ev.id) || { total: 0, packed: 0 } }));
}

async function attachEventProgress(db, ev) {
  const row = await db
    .prepare(`SELECT COUNT(*) AS total, SUM(packed) AS packed FROM event_items WHERE event_id = ?`)
    .bind(ev.id)
    .first();
  return { ...ev, progress: { total: row.total || 0, packed: row.packed || 0 } };
}

export async function createEvent(db, { name, event_date, location, notes }) {
  const ev = await db
    .prepare(`INSERT INTO events (name, event_date, location, notes) VALUES (?, ?, ?, ?) RETURNING *`)
    .bind(name, event_date, location || null, notes || null)
    .first();
  return attachEventProgress(db, ev);
}

export async function updateEvent(db, id, { name, event_date, location, notes }) {
  await db
    .prepare(`UPDATE events SET name = ?, event_date = ?, location = ?, notes = ?, updated_at = ? WHERE id = ?`)
    .bind(name, event_date, location || null, notes || null, new Date().toISOString(), id)
    .run();
  return getEvent(db, id);
}

export async function deleteEvent(db, id) {
  await db.prepare(`DELETE FROM events WHERE id = ?`).bind(id).run();
}

export async function getEvent(db, id) {
  const ev = await db.prepare(`SELECT * FROM events WHERE id = ?`).bind(id).first();
  if (!ev) return null;
  const { results } = await db
    .prepare(
      `SELECT event_items.packed, event_items.packed_at, items.* FROM event_items
       JOIN items ON items.id = event_items.item_id
       WHERE event_items.event_id = ? ORDER BY items.number`
    )
    .bind(id)
    .all();
  const packedById = new Map(results.map((r) => [r.id, { packed: !!r.packed, packed_at: r.packed_at }]));
  const itemRows = results.map(({ packed, packed_at, ...itemRow }) => itemRow);
  const details = await attachDetailsBatch(db, itemRows);
  const packlist = details.map((d) => ({ ...d, ...packedById.get(d.id) }));
  const progress = { total: packlist.length, packed: packlist.filter((p) => p.packed).length };
  return { ...ev, packlist, progress };
}

async function itemIdByNumber(db, number) {
  const row = await db.prepare(`SELECT id, container_item_id FROM items WHERE number = ?`).bind(number).first();
  if (!row) throw new Error("Nummer nicht gefunden: " + number);
  return row;
}

export async function addEventItem(db, eventId, number) {
  const item = await itemIdByNumber(db, number);
  await db
    .prepare(`INSERT OR IGNORE INTO event_items (event_id, item_id) VALUES (?, ?)`)
    .bind(eventId, item.id)
    .run();
  return getEvent(db, eventId);
}

export async function removeEventItem(db, eventId, number) {
  const item = await itemIdByNumber(db, number);
  await db.prepare(`DELETE FROM event_items WHERE event_id = ? AND item_id = ?`).bind(eventId, item.id).run();
  return getEvent(db, eventId);
}

export async function setEventItemPacked(db, eventId, number, packed) {
  const item = await itemIdByNumber(db, number);
  await db
    .prepare(`INSERT INTO event_items (event_id, item_id, packed, packed_at) VALUES (?, ?, ?, ?)
      ON CONFLICT(event_id, item_id) DO UPDATE SET packed = excluded.packed, packed_at = excluded.packed_at`)
    .bind(eventId, item.id, packed ? 1 : 0, packed ? new Date().toISOString() : null)
    .run();
  return getEvent(db, eventId);
}

// Kiste + kompletten aktuellen Inhalt fürs Event abhaken (fügt fehlende automatisch zur Packliste hinzu).
export async function packContainerForEvent(db, eventId, containerNumber) {
  const container = await db.prepare(`SELECT * FROM items WHERE number = ?`).bind(containerNumber).first();
  if (!container) throw new Error("Nummer nicht gefunden: " + containerNumber);
  const containerInfo = prefixInfo(container.prefix);
  if (!containerInfo || containerInfo.kind !== "geraet" || containerInfo.key !== "kiste") {
    throw new Error(containerNumber + " ist keine Kiste.");
  }

  const { results: contents } = await db.prepare(`SELECT id FROM items WHERE container_item_id = ?`).bind(container.id).all();
  const ids = [container.id, ...contents.map((c) => c.id)];
  const now = new Date().toISOString();
  const placeholders = ids.map(() => `(?, ?, 1, ?)`).join(",");
  const binds = ids.flatMap((id) => [eventId, id, now]);
  await db
    .prepare(
      `INSERT INTO event_items (event_id, item_id, packed, packed_at) VALUES ${placeholders}
       ON CONFLICT(event_id, item_id) DO UPDATE SET packed = 1, packed_at = excluded.packed_at`
    )
    .bind(...binds)
    .run();
  return getEvent(db, eventId);
}
