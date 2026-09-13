import { CABLE_CATEGORIES, DEVICE_TYPES, prefixInfo, defaultBereichFor } from "./config.js";

// Reserviert die nächste freie Nummer für ein Präfix (atomar via RETURNING)
// und legt direkt einen Item-Datensatz mit Status 'reserviert' an.
export async function reserveNumbers(db, prefix, count, itemType) {
  const numbers = [];
  for (let i = 0; i < count; i++) {
    const row = await db
      .prepare(`UPDATE counters SET next_value = next_value + 1 WHERE prefix = ? RETURNING next_value - 1 AS n`)
      .bind(prefix)
      .first();
    if (!row) throw new Error(`Unbekanntes Präfix: ${prefix}`);
    const num = `${prefix}-${String(row.n).padStart(3, "0")}`;
    await db
      .prepare(`INSERT INTO items (number, prefix, item_type, status) VALUES (?, ?, ?, 'reserviert')`)
      .bind(num, prefix, itemType)
      .run();
    numbers.push(num);
  }
  return numbers;
}

export async function getItemByNumber(db, number) {
  const item = await db.prepare(`SELECT * FROM items WHERE number = ?`).bind(number).first();
  if (!item) return null;
  return attachDetails(db, item);
}

async function attachDetails(db, item) {
  let result;
  if (item.item_type === "kabel") {
    const cable = await db.prepare(`SELECT * FROM cables WHERE item_id = ?`).bind(item.id).first();
    result = { ...item, cable: cable || null, device: null };
  } else {
    const device = await db.prepare(`SELECT * FROM devices WHERE item_id = ?`).bind(item.id).first();
    let rack = null;
    if (device && device.rack_id) {
      rack = await db.prepare(`SELECT * FROM racks WHERE id = ?`).bind(device.rack_id).first();
    }
    result = { ...item, cable: null, device: device ? { ...device, rack } : null };
  }

  if (item.container_item_id) {
    const container = await db.prepare(`SELECT number FROM items WHERE id = ?`).bind(item.container_item_id).first();
    result.container = container ? container.number : null;
  } else {
    result.container = null;
  }

  if (result.device && result.device.device_type === "kiste") {
    const { results } = await db
      .prepare(`SELECT * FROM items WHERE container_item_id = ? ORDER BY number`)
      .bind(item.id)
      .all();
    result.contents = await Promise.all(results.map((r) => attachDetailsShallow(db, r)));
  }

  return result;
}

// Wie attachDetails, aber ohne rekursiv wieder Kisteninhalt zu laden (verhindert Verschachtelung).
async function attachDetailsShallow(db, item) {
  if (item.item_type === "kabel") {
    const cable = await db.prepare(`SELECT * FROM cables WHERE item_id = ?`).bind(item.id).first();
    return { ...item, cable: cable || null, device: null };
  }
  const device = await db.prepare(`SELECT * FROM devices WHERE item_id = ?`).bind(item.id).first();
  return { ...item, cable: null, device: device || null };
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
  const withDetails = await Promise.all(results.map((r) => attachDetails(db, r)));
  return withDetails;
}

export async function saveItemDetails(db, number, payload) {
  const item = await db.prepare(`SELECT * FROM items WHERE number = ?`).bind(number).first();
  if (!item) throw new Error("Nummer nicht gefunden. Bitte zuerst eine Nummer reservieren/drucken.");

  const info = prefixInfo(item.prefix);
  if (!info) throw new Error("Unbekanntes Präfix.");

  const bereich = payload.bereich || defaultBereichFor(info.kind, info.key) || null;

  const now = new Date().toISOString();
  await db
    .prepare(`UPDATE items SET notes = ?, bereich = ?, status = 'aktiv', updated_at = ? WHERE id = ?`)
    .bind(payload.notes || null, bereich, now, item.id)
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

  const container = await db.prepare(`SELECT items.*, devices.device_type FROM items LEFT JOIN devices ON devices.item_id = items.id WHERE items.number = ?`).bind(containerNumber).first();
  if (!container) throw new Error("Kiste (" + containerNumber + ") nicht gefunden.");
  if (container.device_type !== "kiste") throw new Error(containerNumber + " ist keine Kiste.");

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
  return Promise.all(results.map((ev) => attachEventProgress(db, ev)));
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
  const packlist = await Promise.all(
    results.map(async (r) => {
      const { packed, packed_at, ...itemRow } = r;
      const details = await attachDetails(db, itemRow);
      return { ...details, packed: !!packed, packed_at };
    })
  );
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
  const container = await db.prepare(`SELECT items.*, devices.device_type FROM items LEFT JOIN devices ON devices.item_id = items.id WHERE items.number = ?`).bind(containerNumber).first();
  if (!container) throw new Error("Nummer nicht gefunden: " + containerNumber);
  if (container.device_type !== "kiste") throw new Error(containerNumber + " ist keine Kiste.");

  const { results: contents } = await db.prepare(`SELECT id FROM items WHERE container_item_id = ?`).bind(container.id).all();
  const ids = [container.id, ...contents.map((c) => c.id)];
  const now = new Date().toISOString();
  for (const id of ids) {
    await db
      .prepare(`INSERT INTO event_items (event_id, item_id, packed, packed_at) VALUES (?, ?, 1, ?)
        ON CONFLICT(event_id, item_id) DO UPDATE SET packed = 1, packed_at = excluded.packed_at`)
      .bind(eventId, id, now)
      .run();
  }
  return getEvent(db, eventId);
}
