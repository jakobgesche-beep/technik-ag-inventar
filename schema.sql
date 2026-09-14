-- Technik-AG Inventar — D1 Schema
-- Ausführen mit: wrangler d1 execute technik_ag_db --file=./schema.sql

CREATE TABLE IF NOT EXISTS racks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS counters (
  prefix TEXT PRIMARY KEY,
  next_value INTEGER NOT NULL DEFAULT 1
);

INSERT OR IGNORE INTO counters (prefix, next_value) VALUES
  ('MKB', 1), ('STR', 1), ('BXK', 1), ('INS', 1),
  ('PLT', 1), ('LMP', 1), ('BOX', 1), ('FNK', 1), ('GER', 1),
  ('KIS', 1), ('MIK', 1), ('MST', 1);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number TEXT UNIQUE NOT NULL,
  prefix TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('kabel','geraet')),
  status TEXT NOT NULL DEFAULT 'reserviert' CHECK (status IN ('reserviert','aktiv','defekt','ausgemustert')),
  bereich TEXT CHECK (bereich IN ('licht','ton','allgemein')),
  notes TEXT,
  container_item_id INTEGER REFERENCES items(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_items_container ON items(container_item_id);

CREATE INDEX IF NOT EXISTS idx_items_prefix ON items(prefix);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_type ON items(item_type);

CREATE TABLE IF NOT EXISTS cables (
  item_id INTEGER PRIMARY KEY REFERENCES items(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('mikrofon','strom','boxen','instrument')),
  cable_type TEXT,
  connector_a TEXT,
  connector_b TEXT,
  length_m REAL
);

CREATE TABLE IF NOT EXISTS devices (
  item_id INTEGER PRIMARY KEY REFERENCES items(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL CHECK (device_type IN ('pult','lampe','box','funkmikro','sonstiges','kiste','mikrofon','mikrofonstaender')),
  active_passive TEXT CHECK (active_passive IN ('aktiv','passiv')),
  brand TEXT,
  model TEXT,
  details TEXT,
  rack_id INTEGER REFERENCES racks(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS event_items (
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  packed INTEGER NOT NULL DEFAULT 0,
  packed_at TEXT,
  PRIMARY KEY (event_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_event_items_event ON event_items(event_id);

-- Patchplan der Behringer S16-Stagebox, pro Event: welches Gerät/Instrument
-- hängt an welchem Ein-/Ausgang. Eigenständige Tabelle, wird nur von den
-- /api/events/:id/patch-Endpunkten genutzt — falls sie mal fehlt, ist nur
-- der Patchplan-Tab betroffen, nicht der Rest der App.
CREATE TABLE IF NOT EXISTS event_patch (
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  io TEXT NOT NULL CHECK (io IN ('in','out')),
  channel INTEGER NOT NULL,
  label TEXT,
  PRIMARY KEY (event_id, io, channel)
);
CREATE INDEX IF NOT EXISTS idx_event_items_item ON event_items(item_id);
CREATE INDEX IF NOT EXISTS idx_devices_rack ON devices(rack_id);
