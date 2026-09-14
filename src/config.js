// Zentrale Konfiguration: Kategorien, Präfixe, Felder.
// Das ist die "single source of truth" - Frontend holt sich das über /api/config.

export const CABLE_CATEGORIES = {
  mikrofon:   { prefix: "MKB", label: "Mikrofonkabel",     connectors: ["XLR male", "XLR female", "Klinke 6.3mm", "Klinke 3.5mm", "Mini-XLR"], defaultBereich: "ton" },
  strom:      { prefix: "STR", label: "Strom",              connectors: ["Schuko", "Kaltgeräte C13", "Kaltgeräte C14", "PowerCon", "Verteiler/Steckerleiste"], defaultBereich: "allgemein" },
  boxen:      { prefix: "BXK", label: "Boxenkabel",         connectors: ["Speakon NL2", "Speakon NL4", "Klinke 6.3mm", "Bananenstecker"], defaultBereich: "ton" },
  instrument: { prefix: "INS", label: "Instrumentenkabel",  connectors: ["Klinke 6.3mm mono", "Klinke 6.3mm stereo", "Cinch/RCA", "MIDI"], defaultBereich: "ton" },
};

// Bereich pro Gerätetyp: "fixed" -> immer dieser Wert (nur Anzeige als Tag),
// "choice" -> Nutzer wählt aus den angegebenen Optionen, "none" -> kein Bereich (z.B. Kiste).
export const DEVICE_TYPES = {
  pult:             { prefix: "PLT", label: "Pult",               hasActivePassive: false, hasRack: true, bereich: { mode: "choice", options: ["licht", "ton"] } },
  lampe:            { prefix: "LMP", label: "Lampe",               hasActivePassive: false, hasRack: true, bereich: { mode: "fixed", value: "licht" } },
  box:              { prefix: "BOX", label: "Box (Lautsprecher)",  hasActivePassive: true,  hasRack: true, bereich: { mode: "fixed", value: "ton" } },
  mikrofon:         { prefix: "MIK", label: "Mikrofon",             hasActivePassive: false, hasRack: true, bereich: { mode: "fixed", value: "ton" } },
  mikrofonstaender: { prefix: "MST", label: "Mikroständer",         hasActivePassive: false, hasRack: true, bereich: { mode: "fixed", value: "ton" } },
  funkmikro:        { prefix: "FNK", label: "Funkmikrofon",         hasActivePassive: false, hasRack: true,  bereich: { mode: "fixed", value: "ton" } },
  kiste:            { prefix: "KIS", label: "Kiste",                hasActivePassive: false, hasRack: true, bereich: { mode: "none" }, isContainer: true },
  sonstiges:        { prefix: "GER", label: "Sonstiges Gerät",      hasActivePassive: false, hasRack: true, bereich: { mode: "choice", options: ["licht", "ton", "allgemein"] } },
};

export const BEREICH_LABELS = { licht: "Licht", ton: "Ton", allgemein: "Allgemein" };

export const ALL_PREFIXES = {
  ...Object.fromEntries(Object.entries(CABLE_CATEGORIES).map(([key, v]) => [v.prefix, { kind: "kabel", key, label: v.label }])),
  ...Object.fromEntries(Object.entries(DEVICE_TYPES).map(([key, v]) => [v.prefix, { kind: "geraet", key, label: v.label }])),
};

export function prefixInfo(prefix) {
  return ALL_PREFIXES[prefix] || null;
}

export function defaultBereichFor(kind, key) {
  if (kind === "kabel") return CABLE_CATEGORIES[key]?.defaultBereich || null;
  const b = DEVICE_TYPES[key]?.bereich;
  if (!b) return null;
  if (b.mode === "fixed") return b.value;
  return null;
}
