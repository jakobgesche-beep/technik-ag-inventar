# Technik-AG Inventar

Eine PWA + Cloudflare-Worker-Backend zur Inventarverwaltung für eure Technik-AG.
Alles läuft in **einem Worker** mit **D1** (SQLite bei Cloudflare) als Datenbank —
kein Supabase, keine Accounts, kein separates Hosting nötig.

## Wie die App gedacht ist

1. **„Neu"**: Kategorie wählen (z. B. Mikrofonkabel, Boxen, Funkmikro, Kiste …),
   Anzahl festlegen → die App reserviert die nächsten freien Nummern (z. B.
   `MIK-004`, `MIK-005`) und zeigt sie als druckbare Labels mit QR-Code an.
   Diese Labels ausdrucken/mit dem Beschriftungsgerät übertragen und aufkleben.
   Nach dem Erfassen der Details lässt sich auf der Item-Seite jederzeit ein
   aktuelles Label nachdrucken, das dann auch Marke/Modell (bzw. bei Kabeln
   den Kabeltyp) mit anzeigt.
2. **„Scanner"**: Kamera auf den aufgeklebten QR-Code halten (oder Nummer
   eintippen, falls Kamera-Scan nicht möglich ist). Die App erkennt am Präfix
   automatisch die Kategorie und zeigt die passenden Felder (bei Kabeln:
   Bereich, Kabeltyp, Stecker A/B, Länge; bei Geräten: Bereich, Marke, Modell,
   aktiv/passiv, Rack-Zuordnung bei Funkmikros). Ein neu erfasstes Item wird
   automatisch „aktiv" (grüner Status).
3. **„Liste"**: Alles durchsuchen/filtern (Status, Typ, Bereich, Text),
   Eintrag antippen zum Bearbeiten, als defekt markieren, ausmustern oder
   löschen.
4. **Kisten** (Kategorie „Kiste", Präfix `KIS`): eigene Nummer wie jedes
   andere Item. Auf der Kisten-Detailseite können andere Items per Scan in
   die Kiste gelegt werden (setzt deren Zuordnung); „Inhalt prüfen" zeigt den
   erwarteten Inhalt zur Bestätigung — praktisch für die Bestandskontrolle
   nach einem Event.
5. **„Events"**: Events mit Datum, Ort und Bemerkung anlegen. Packliste
   zusammenstellen (Nummer eintragen oder direkt scannen). Beim Packen im
   Event einfach scannen: normales Item → wird abgehakt; Kiste → kompletter
   Inhalt wird auf einmal abgehakt (nach Bestätigung, dass alles drin ist).
6. **„Racks"**: Racks anlegen (z. B. „Funk-Case 1"), damit Funkmikrofone einem
   Standort zugeordnet werden können.

### Nummernschema (Präfixe pro Kategorie)

| Präfix | Bedeutung           |
|--------|---------------------|
| MIK    | Mikrofonkabel        |
| STR    | Strom (Kabel/Leisten)|
| BXK    | Boxenkabel            |
| INS    | Instrumentenkabel     |
| PLT    | Pult (Licht/Ton wählbar) |
| LMP    | Lampe (Bereich: Licht) |
| BOX    | Box (Lautsprecher, aktiv/passiv, Bereich: Ton) |
| MIC    | Mikrofon (Bereich: Ton) |
| MST    | Mikroständer (Bereich: Ton) |
| FNK    | Funkmikrofon (+ Rack, Bereich: Ton) |
| KIS    | Kiste (Behälter für andere Items) |
| GER    | Sonstiges Gerät (Bereich frei wählbar) |

Format: `PREFIX-###`, z. B. `MIK-001`. Kategorien/Felder lassen sich in
`src/config.js` anpassen oder erweitern. Kabel bekommen zusätzlich ein
**Bereich**-Feld (Licht / Ton / Allgemein), das auch als Filter in der Liste
zur Verfügung steht.

### Codes

Jede Nummer wird als **QR-Code** gedruckt (Bibliothek `qrcode-generator`) und
per Kamera mit `qr-scanner` erkannt — beide laufen als reines JavaScript im
Browser (Canvas-Dekodierung über einen Web Worker), nicht über die native
`BarcodeDetector`-API. Das ist bewusst so gewählt, weil Safari auf dem iPhone
`BarcodeDetector` nicht unterstützt; mit QR-Codes funktioniert die
Kamera-Erkennung zuverlässig auch auf iOS. Fällt die Kamera-Erkennung trotzdem
aus (kein Kamerazugriff erlaubt o. Ä.), kann die Nummer jederzeit manuell
eingetippt werden.

## Setup

```bash
npm install
```

### 1. D1-Datenbank anlegen

```bash
npx wrangler d1 create technik_ag_db
```

Das gibt dir eine `database_id` aus — die trägst du in `wrangler.toml`
anstelle von `REPLACE_MIT_DEINER_DATABASE_ID` ein.

### 2. Schema anlegen

```bash
npm run db:init
```

### 3. Lokal testen

```bash
npm run dev
```

Dann `http://localhost:8787` öffnen.

### 4. Deployen

```bash
npm run deploy
```

Wrangler gibt dir danach eine `*.workers.dev`-URL — die kannst du direkt auf
dem Handy öffnen und über den Browser („Zum Home-Bildschirm hinzufügen") als
App installieren.

## Struktur

```
src/
  index.js      Worker-Einstiegspunkt, Routing + API-Endpunkte
  db.js         Alle D1-Datenbankzugriffe
  config.js     Kategorien, Präfixe, Steckertypen — hier anpassen/erweitern
  app_html.js   Die komplette PWA (HTML + CSS + JS) als ein String
  sw.js         Service Worker (Offline-Shell-Caching)
  icons.js      App-Icons als Base64 (generiert, gerne durch eigenes Logo ersetzen)
schema.sql      D1-Datenbankschema
wrangler.toml   Worker-Konfiguration (D1-Binding)
```

## Erweitern

- **Neue Kategorie/Gerätetyp**: in `src/config.js` unter `CABLE_CATEGORIES`
  bzw. `DEVICE_TYPES` ergänzen (Präfix muss eindeutig sein) und in
  `schema.sql` in der `INSERT OR IGNORE INTO counters` Zeile das neue Präfix
  ergänzen (bzw. einmalig per `wrangler d1 execute` nachtragen).
- **Eigenes Logo**: `icon-192.png` / `icon-512.png` selbst erzeugen, als
  Base64 in `src/icons.js` einsetzen.
- **Zugriffsschutz**: aktuell bewusst ohne Accounts/Login gebaut. Falls doch
  gewünscht (z. B. nur AG-Mitglieder sollen ändern können), ließe sich ein
  einfacher gemeinsamer PIN-Code am Anfang der `fetch`-Funktion in
  `src/index.js` ergänzen.
