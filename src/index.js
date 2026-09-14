import { getAppHtml } from "./app_html.js";
import { SW_JS } from "./sw.js";
import { ICON_192_BASE64, ICON_512_BASE64 } from "./icons.js";
import { CABLE_CATEGORIES, DEVICE_TYPES, BEREICH_LABELS, prefixInfo } from "./config.js";
import {
  reserveNumbers,
  getItemByNumber,
  listItems,
  saveItemDetails,
  setItemStatus,
  deleteItem,
  setItemContainer,
  listRacks,
  createRack,
  deleteRack,
  listEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  addEventItem,
  removeEventItem,
  setEventItemPacked,
  packContainerForEvent,
  getEventPatch,
  setEventPatchChannel,
} from "./db.js";

const MANIFEST = {
  name: "Technik-AG Inventar",
  short_name: "Technik-AG",
  description: "Scanner & Inventarverwaltung für die Technik-AG",
  start_url: "/",
  display: "standalone",
  background_color: "#17181A",
  theme_color: "#17181A",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
  ],
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
function err(message, status = 400) {
  return json({ error: message }, status);
}
function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const db = env.DB;

    try {
      // ---------- statische PWA-Dateien ----------
      if (pathname === "/" && request.method === "GET") {
        return new Response(getAppHtml(), { headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
      if (pathname === "/manifest.webmanifest") {
        return json(MANIFEST);
      }
      if (pathname === "/sw.js") {
        return new Response(SW_JS, { headers: { "Content-Type": "application/javascript; charset=utf-8" } });
      }
      if (pathname === "/icon-192.png") {
        return new Response(base64ToBytes(ICON_192_BASE64), { headers: { "Content-Type": "image/png" } });
      }
      if (pathname === "/icon-512.png") {
        return new Response(base64ToBytes(ICON_512_BASE64), { headers: { "Content-Type": "image/png" } });
      }

      // ---------- API: Konfiguration ----------
      if (pathname === "/api/config" && request.method === "GET") {
        return json({ cableCategories: CABLE_CATEGORIES, deviceTypes: DEVICE_TYPES, bereichLabels: BEREICH_LABELS });
      }

      if (pathname === "/api/allocate" && request.method === "POST") {
        const body = await request.json();
        const { prefix, item_type, count } = body || {};
        if (!prefix || !prefixInfo(prefix)) return err("Unbekanntes Präfix.");
        if (!["kabel", "geraet"].includes(item_type)) return err("Ungültiger item_type.");
        const n = Math.min(Math.max(parseInt(count, 10) || 1, 1), 50);
        const numbers = await reserveNumbers(db, prefix, n, item_type);
        return json({ numbers });
      }

      // ---------- API: Items ----------
      if (pathname === "/api/items" && request.method === "GET") {
        const status = url.searchParams.get("status") || undefined;
        const item_type = url.searchParams.get("item_type") || undefined;
        const bereich = url.searchParams.get("bereich") || undefined;
        const container = url.searchParams.get("container") || undefined;
        const q = url.searchParams.get("q") || undefined;
        const items = await listItems(db, { status, item_type, bereich, container, q });
        return json(items);
      }

      const containerMatch = pathname.match(/^\/api\/items\/([^/]+)\/container$/);
      if (containerMatch && request.method === "PATCH") {
        const number = decodeURIComponent(containerMatch[1]).toUpperCase();
        const body = await request.json();
        const item = await setItemContainer(db, number, body.container ? String(body.container).toUpperCase() : null);
        return json(item);
      }

      const itemMatch = pathname.match(/^\/api\/items\/([^/]+)(\/status)?$/);
      if (itemMatch) {
        const number = decodeURIComponent(itemMatch[1]).toUpperCase();
        const isStatus = !!itemMatch[2];

        if (!isStatus && request.method === "GET") {
          const item = await getItemByNumber(db, number);
          if (!item) return err("Nummer nicht gefunden.", 404);
          return json(item);
        }
        if (!isStatus && request.method === "PATCH") {
          const body = await request.json();
          const item = await saveItemDetails(db, number, body);
          return json(item);
        }
        if (!isStatus && request.method === "DELETE") {
          await deleteItem(db, number);
          return json({ ok: true });
        }
        if (isStatus && request.method === "PATCH") {
          const body = await request.json();
          if (!["reserviert", "aktiv", "defekt", "ausgemustert"].includes(body.status)) {
            return err("Ungültiger Status.");
          }
          const item = await setItemStatus(db, number, body.status);
          return json(item);
        }
      }

      // ---------- API: Racks ----------
      if (pathname === "/api/racks" && request.method === "GET") {
        return json(await listRacks(db));
      }
      if (pathname === "/api/racks" && request.method === "POST") {
        const body = await request.json();
        if (!body.name) return err("Name ist erforderlich.");
        const rack = await createRack(db, body.name, body.location, body.notes);
        return json(rack, 201);
      }
      const rackMatch = pathname.match(/^\/api\/racks\/(\d+)$/);
      if (rackMatch && request.method === "DELETE") {
        await deleteRack(db, parseInt(rackMatch[1], 10));
        return json({ ok: true });
      }

      // ---------- API: Events ----------
      if (pathname === "/api/events" && request.method === "GET") {
        return json(await listEvents(db));
      }
      if (pathname === "/api/events" && request.method === "POST") {
        const body = await request.json();
        if (!body.name || !body.event_date) return err("Name und Datum sind erforderlich.");
        const ev = await createEvent(db, body);
        return json(ev, 201);
      }

      const eventMatch = pathname.match(/^\/api\/events\/(\d+)$/);
      if (eventMatch) {
        const id = parseInt(eventMatch[1], 10);
        if (request.method === "GET") {
          const ev = await getEvent(db, id);
          if (!ev) return err("Event nicht gefunden.", 404);
          return json(ev);
        }
        if (request.method === "PATCH") {
          const body = await request.json();
          if (!body.name || !body.event_date) return err("Name und Datum sind erforderlich.");
          return json(await updateEvent(db, id, body));
        }
        if (request.method === "DELETE") {
          await deleteEvent(db, id);
          return json({ ok: true });
        }
      }

      const eventItemsMatch = pathname.match(/^\/api\/events\/(\d+)\/items$/);
      if (eventItemsMatch && request.method === "POST") {
        const id = parseInt(eventItemsMatch[1], 10);
        const body = await request.json();
        if (!body.number) return err("Nummer ist erforderlich.");
        return json(await addEventItem(db, id, String(body.number).toUpperCase()));
      }

      const eventItemMatch = pathname.match(/^\/api\/events\/(\d+)\/items\/([^/]+)$/);
      if (eventItemMatch) {
        const id = parseInt(eventItemMatch[1], 10);
        const number = decodeURIComponent(eventItemMatch[2]).toUpperCase();
        if (request.method === "DELETE") {
          return json(await removeEventItem(db, id, number));
        }
        if (request.method === "PATCH") {
          const body = await request.json();
          return json(await setEventItemPacked(db, id, number, !!body.packed));
        }
      }

      const packContainerMatch = pathname.match(/^\/api\/events\/(\d+)\/pack-container$/);
      if (packContainerMatch && request.method === "POST") {
        const id = parseInt(packContainerMatch[1], 10);
        const body = await request.json();
        if (!body.number) return err("Nummer ist erforderlich.");
        return json(await packContainerForEvent(db, id, String(body.number).toUpperCase()));
      }

      const patchMatch = pathname.match(/^\/api\/events\/(\d+)\/patch$/);
      if (patchMatch) {
        const id = parseInt(patchMatch[1], 10);
        if (request.method === "GET") {
          return json(await getEventPatch(db, id));
        }
        if (request.method === "PATCH") {
          const body = await request.json();
          if (!["in", "out"].includes(body.io) || !Number.isInteger(body.channel)) {
            return err("Ungültiger Kanal.");
          }
          return json(await setEventPatchChannel(db, id, body.io, body.channel, body.label));
        }
      }

      return err("Not found", 404);
    } catch (e) {
      return err(e.message || "Interner Fehler", 500);
    }
  },
};
