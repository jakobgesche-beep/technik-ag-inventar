export function getAppHtml() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>Technik-AG · Inventar</title>
<meta name="theme-color" content="#17181A" />
<link rel="manifest" href="/manifest.webmanifest" />
<link rel="apple-touch-icon" href="/icon-192.png" />
<link rel="icon" href="/icon-192.png" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@zxing/library@0.23.0/umd/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
<style>
${CSS}
</style>
</head>
<body>
  <header class="topbar">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-text">Technik-AG <b>Inventar</b></span>
    </div>
    <div id="online-badge" class="badge">bereit</div>
  </header>

  <main id="app" class="app"></main>

  <nav class="tabbar" id="tabbar">
    <button class="tab" data-view="scan" aria-label="Scanner">
      <svg viewBox="0 0 24 24"><path d="M4 7V5a1 1 0 0 1 1-1h2M4 17v2a1 1 0 0 0 1 1h2M20 7V5a1 1 0 0 0-1-1h-2M20 17v2a1 1 0 0 1-1 1h-2M4 12h16" stroke-linecap="round"/></svg>
      <span>Scanner</span>
    </button>
    <button class="tab" data-view="neu" aria-label="Neue Nummern">
      <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
      <span>Neu</span>
    </button>
    <button class="tab" data-view="liste" aria-label="Liste">
      <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/></svg>
      <span>Liste</span>
    </button>
    <button class="tab" data-view="events" aria-label="Events">
      <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="1.5"/><path d="M4 10h16M8 3v4M16 3v4" stroke-linecap="round"/></svg>
      <span>Events</span>
    </button>
    <button class="tab" data-view="racks" aria-label="Racks">
      <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M4 9h16M4 15h16" stroke-linecap="round"/></svg>
      <span>Racks</span>
    </button>
  </nav>

<script>
${JS}
</script>
</body>
</html>`;
}

const CSS = `
:root{
  --bg:#17181A;
  --panel:#202226;
  --panel-2:#26282c;
  --line:#33353a;
  --accent:#E3A72E;
  --accent-dim:#8a6a29;
  --text:#EDEAE2;
  --muted:#93979f;
  --ok:#4C9A5B;
  --danger:#C1503D;
  --off:#5B5F66;
  --radius-label:14px;
  --font-head:'Space Grotesk',system-ui,sans-serif;
  --font-body:'IBM Plex Sans',system-ui,sans-serif;
  --font-mono:'IBM Plex Mono',monospace;
}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;height:100%;}
body{
  background:var(--bg);
  color:var(--text);
  font-family:var(--font-body);
  -webkit-font-smoothing:antialiased;
  overscroll-behavior-y:none;
}
button{font-family:inherit;}
h1,h2,h3,.headline{font-family:var(--font-head);letter-spacing:-0.01em;}

.topbar{
  position:sticky;top:0;z-index:20;
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 16px;
  background:linear-gradient(180deg, var(--bg) 80%, rgba(23,24,26,0));
  border-bottom:1px solid var(--line);
}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--font-head);font-size:15px;}
.brand b{color:var(--accent);font-weight:600;}
.brand-mark{
  width:18px;height:18px;border:2px solid var(--accent);border-radius:4px;
  position:relative;flex:none;
}
.brand-mark::after{
  content:"";position:absolute;inset:4px 3px;
  background:repeating-linear-gradient(90deg, var(--accent) 0 1.5px, transparent 1.5px 3px);
}
.badge{font-size:11px;color:var(--muted);border:1px solid var(--line);padding:3px 8px;border-radius:20px;}
.badge.live{color:var(--ok);border-color:var(--ok);}

.app{padding:16px 16px 96px;max-width:640px;margin:0 auto;min-height:calc(100vh - 60px);}

.tabbar{
  position:fixed;bottom:0;left:0;right:0;z-index:30;
  display:flex;background:var(--panel);border-top:1px solid var(--line);
  padding:6px 6px calc(6px + env(safe-area-inset-bottom));
}
.tab{
  flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;
  background:none;border:none;color:var(--muted);padding:8px 4px 6px;border-radius:10px;
  font-size:11px;
}
.tab svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;}
.tab.active{color:var(--accent);background:rgba(227,167,46,0.08);}

.section-title{font-size:19px;font-weight:600;margin:2px 0 14px;}
.hint{color:var(--muted);font-size:13px;line-height:1.5;margin-bottom:16px;}

.card{
  background:var(--panel);border:1px solid var(--line);border-radius:12px;
  padding:16px;margin-bottom:12px;
}
.card + .card{margin-top:12px;}

.field{margin-bottom:14px;}
.field label{display:block;font-size:12.5px;color:var(--muted);margin-bottom:6px;}
.field input[type=text],.field input[type=number],.field select,.field textarea{
  width:100%;background:var(--panel-2);border:1px solid var(--line);color:var(--text);
  border-radius:8px;padding:11px 12px;font-size:15px;font-family:var(--font-body);
}
.field textarea{resize:vertical;min-height:60px;}
.field input:focus,.field select:focus,.field textarea:focus{outline:2px solid var(--accent-dim);outline-offset:1px;}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  background:var(--accent);color:#1a1500;border:none;border-radius:9px;
  padding:13px 18px;font-weight:600;font-size:15px;width:100%;cursor:pointer;
  font-family:var(--font-head);
}
.btn:active{transform:scale(0.98);}
.btn.secondary{background:var(--panel-2);color:var(--text);border:1px solid var(--line);}
.btn.danger{background:transparent;color:var(--danger);border:1px solid var(--danger);}
.btn.ghost{background:transparent;color:var(--accent);border:1px solid var(--accent-dim);}
.btn-row{display:flex;gap:10px;}
.btn-row .btn{width:auto;flex:1;}

.chip-group{display:flex;flex-wrap:wrap;gap:8px;}
.chip{
  border:1px solid var(--line);background:var(--panel-2);color:var(--text);
  border-radius:20px;padding:9px 14px;font-size:13.5px;cursor:pointer;
}
.chip.active{border-color:var(--accent);color:var(--accent);background:rgba(227,167,46,0.1);}

.scanbox{
  position:relative;border-radius:14px;overflow:hidden;background:#000;
  aspect-ratio:4/3;border:1px solid var(--line);margin-bottom:14px;
}
.scanbox video{width:100%;height:100%;object-fit:cover;display:block;}
.scan-frame{
  position:absolute;inset:18%;border:2px solid var(--accent);border-radius:10px;
  box-shadow:0 0 0 999px rgba(0,0,0,0.35);pointer-events:none;
}
.scan-placeholder{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  color:var(--muted);font-size:13px;text-align:center;padding:20px;
}

.divider-or{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:12px;margin:14px 0;}
.divider-or::before,.divider-or::after{content:"";flex:1;height:1px;background:var(--line);}

.number-label{
  font-family:var(--font-mono);font-size:22px;font-weight:600;letter-spacing:0.02em;
  color:var(--accent);border:2px dashed var(--accent-dim);border-radius:var(--radius-label);
  padding:10px 16px;display:inline-block;background:rgba(227,167,46,0.06);
}

.item-row{
  display:flex;align-items:center;gap:12px;padding:12px 4px;border-bottom:1px solid var(--line);
  cursor:pointer;
}
.item-row:last-child{border-bottom:none;}
.status-dot{width:9px;height:9px;border-radius:50%;flex:none;}
.status-dot.aktiv{background:var(--ok);}
.status-dot.reserviert{background:var(--muted);}
.status-dot.defekt{background:var(--danger);}
.status-dot.ausgemustert{background:var(--off);}
.item-row .num{font-family:var(--font-mono);font-weight:600;font-size:14.5px;}
.item-row .meta{color:var(--muted);font-size:12.5px;margin-top:2px;}
.item-row .grow{flex:1;min-width:0;}

.status-pill{
  font-size:11px;padding:3px 9px;border-radius:20px;border:1px solid var(--line);color:var(--muted);
}
.status-pill.aktiv{color:var(--ok);border-color:var(--ok);}
.status-pill.reserviert{color:var(--muted);}
.status-pill.defekt{color:var(--danger);border-color:var(--danger);}
.status-pill.ausgemustert{color:var(--off);border-color:var(--off);}

.filters{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;}
.filters select,.filters input{
  background:var(--panel-2);border:1px solid var(--line);color:var(--text);
  border-radius:8px;padding:8px 10px;font-size:13px;
}

.empty{
  text-align:center;color:var(--muted);padding:40px 20px;font-size:14px;
}

.label-sheet{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.label-card{
  border:1px dashed var(--accent-dim);border-radius:var(--radius-label);padding:10px;
  display:flex;flex-direction:column;align-items:center;background:var(--panel);
}
.label-card svg{max-width:100%;}
.label-card .cat{font-size:10.5px;color:var(--muted);margin-top:4px;text-align:center;}

@media print{
  body *{visibility:hidden;}
  #print-area, #print-area *{visibility:visible;}
  #print-area{position:absolute;top:0;left:0;width:100%;padding:0;margin:0;}
  .label-card{border:1px dashed #999;color:#000;background:#fff;}
  .label-card .cat{color:#333;}
}

.toast{
  position:fixed;left:50%;bottom:90px;transform:translateX(-50%);
  background:var(--panel-2);border:1px solid var(--line);color:var(--text);
  padding:11px 16px;border-radius:10px;font-size:13.5px;z-index:50;
  max-width:85vw;text-align:center;box-shadow:0 6px 24px rgba(0,0,0,0.4);
}
.toast.error{border-color:var(--danger);color:var(--danger);}

.progress-bar{height:6px;background:var(--panel-2);border-radius:4px;overflow:hidden;margin-top:10px;}
.progress-fill{height:100%;background:var(--accent);}
.event-card{cursor:pointer;}
.badge-row{display:flex;align-items:center;gap:8px;margin:-4px 0 14px;flex-wrap:wrap;}
`;

const JS = `
// ---------- kleine Helfer ----------
const app = document.getElementById('app');
const tabbar = document.getElementById('tabbar');
const onlineBadge = document.getElementById('online-badge');

function el(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstChild; }
function toast(msg, isError){
  const t = el('<div class="toast">' + msg + '</div>');
  if(isError) t.classList.add('error');
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 3200);
}
async function api(path, opts){
  const res = await fetch('/api' + path, Object.assign({headers:{'Content-Type':'application/json'}}, opts||{}));
  let data = null;
  try { data = await res.json(); } catch(e){}
  if(!res.ok){ throw new Error((data && data.error) || ('Fehler ' + res.status)); }
  return data;
}

let CONFIG = null;
async function loadConfig(){
  if(CONFIG) return CONFIG;
  CONFIG = await api('/config');
  return CONFIG;
}

// ---------- Router ----------
const views = {};
let currentView = 'scan';

function setActiveTab(view){
  [...tabbar.querySelectorAll('.tab')].forEach(b => b.classList.toggle('active', b.dataset.view === view));
}

async function goTo(view, params){
  stopScanner();
  currentView = view;
  setActiveTab(view);
  app.innerHTML = '<div class="empty">Lädt …</div>';
  try {
    await views[view](params||{});
  } catch(e){
    app.innerHTML = '<div class="empty">' + e.message + '</div>';
  }
}

tabbar.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab');
  if(!btn) return;
  goTo(btn.dataset.view);
});

// ================= SCANNER =================
// runScanner/buildScanner sind die gemeinsame Kamera-Logik, wiederverwendet vom
// Scan-Tab, dem Kisteninhalt-Scanner und dem Event-Packscanner.
// Kamera-Teil (getUserMedia + <video>) ist komplett selbst gebaut, damit die
// Live-Vorschau garantiert sichtbar ist. Für die eigentliche Barcode-Erkennung
// pro Frame wird ZXing genutzt (unterstützt Code128 + QR, canvas-basiert) statt
// der nativen BarcodeDetector-API, die Safari auf dem iPhone nicht unterstützt.
let activeScanner = null;

function stopScanner(){
  if(activeScanner){ try { activeScanner.stop(); } catch(e){} }
  activeScanner = null;
}

function runScanner(box, onDetect){
  stopScanner();

  if(typeof ZXing === 'undefined' || !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)){
    box.innerHTML = '<div class="scan-placeholder">Kamera-Scan wird von diesem Browser nicht unterstützt.<br/>Bitte Nummer manuell eingeben.</div>';
    return;
  }

  box.innerHTML = '';
  const video = document.createElement('video');
  video.setAttribute('playsinline','');
  video.setAttribute('autoplay','');
  video.setAttribute('muted','');
  video.muted = true;
  box.appendChild(video);
  box.appendChild(el('<div class="scan-frame"></div>'));

  const reader = new ZXing.BrowserMultiFormatReader();
  let stream = null, raf = null, stopped = false, lastScan = 0;

  activeScanner = {
    stop(){
      stopped = true;
      if(raf) cancelAnimationFrame(raf);
      if(stream) stream.getTracks().forEach(t => t.stop());
    }
  };

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then((s) => {
      if(stopped){ s.getTracks().forEach(t => t.stop()); return; }
      stream = s;
      video.srcObject = s;
      return video.play();
    })
    .then(() => {
      if(stopped) return;
      const tick = (ts) => {
        if(stopped) return;
        if(video.readyState >= video.HAVE_ENOUGH_DATA && video.videoWidth && (!lastScan || ts - lastScan > 150)){
          lastScan = ts;
          try {
            const result = reader.decode(video);
            const val = (result.getText() || '').trim().toUpperCase();
            if(val){ stopScanner(); onDetect(val); return; }
          } catch(e){ /* kein Code in diesem Frame erkannt - normal, weiter versuchen */ }
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    })
    .catch((e) => {
      box.innerHTML = '<div class="scan-placeholder">Kein Kamerazugriff (' + (e && e.message) + ').<br/>Bitte Nummer manuell eingeben.</div>';
    });
}

function buildScanner(onDetect){
  const wrap = el('<div></div>');
  const box = el('<div class="scanbox"><div class="scan-placeholder">Kamera wird gestartet …</div></div>');
  wrap.appendChild(box);
  const manualWrap = el('<div class="field"><label>Nummer manuell eingeben</label><input type="text" placeholder="z. B. MIK-001" autocapitalize="characters" /></div>');
  wrap.appendChild(manualWrap);
  const goBtn = el('<button class="btn secondary">Nachschlagen</button>');
  wrap.appendChild(goBtn);
  const input = manualWrap.querySelector('input');
  goBtn.addEventListener('click', () => {
    const v = input.value.trim().toUpperCase();
    if(v){ stopScanner(); onDetect(v); }
  });
  input.addEventListener('keydown', (e) => { if(e.key === 'Enter') goBtn.click(); });
  runScanner(box, onDetect);
  return wrap;
}

views.scan = async function(){
  app.innerHTML = '';
  app.appendChild(el('<h2 class="section-title">Scannen</h2>'));
  app.appendChild(el('<p class="hint">Kamera auf den Code auf dem Kabel/Gerät richten, oder die Nummer unten eintippen.</p>'));
  app.appendChild(buildScanner(lookupNumber));
};

// ================= LABELS =================
// renderBarcodeInto zeichnet einen Code128-Barcode in ein bereits im DOM
// befindliches <svg>-Element (JsBarcode braucht das Element im Dokument, daher
// der setTimeout(...,0) direkt nach dem Einfügen ins DOM).
function renderBarcodeInto(svgEl, text){
  setTimeout(() => {
    try {
      JsBarcode(svgEl, text, {
        format: 'CODE128', displayValue: true, fontSize: 14, height: 36, margin: 4,
        background: 'transparent', lineColor: getComputedStyle(document.body).getPropertyValue('--text') || '#EDEAE2',
      });
    } catch(e){}
  }, 0);
}

// Text, der unter dem Code stehen soll: bei Geräten Marke+Modell (sobald erfasst),
// sonst die Kategorie-Bezeichnung — damit man das Teil auch ohne Scan erkennt.
function labelText(item, info){
  if(info.kind === 'kabel'){
    const parts = [info.cat.label, item.cable && item.cable.cable_type].filter(Boolean);
    return parts.join(' · ');
  }
  const d = item.device || {};
  const name = [d.brand, d.model].filter(Boolean).join(' ').trim();
  return name || info.type.label;
}

async function lookupNumber(number){
  stopScanner();
  app.innerHTML = '<div class="empty">Suche ' + number + ' …</div>';
  try {
    const item = await api('/items/' + encodeURIComponent(number));
    renderItemDetail(item);
  } catch(e){
    renderUnknownNumber(number);
  }
}

function renderUnknownNumber(number){
  app.innerHTML = '';
  app.appendChild(el('<h2 class="section-title">Unbekannte Nummer</h2>'));
  app.appendChild(el('<div class="number-label">' + number + '</div>'));
  app.appendChild(el('<p class="hint" style="margin-top:14px;">Diese Nummer wurde noch nicht in der App reserviert. Neue Nummern werden im Tab „Neu" erzeugt und ausgedruckt.</p>'));
  const back = el('<button class="btn secondary">Zurück zum Scanner</button>');
  back.addEventListener('click', () => goTo('scan'));
  app.appendChild(back);
}

// ================= ITEM-DETAIL / ERFASSEN =================
function categoryFieldsForItem(item, cfg){
  if(item.item_type === 'kabel'){
    const catKey = Object.entries(cfg.cableCategories).find(([k,v]) => v.prefix === item.prefix)[0];
    return { kind:'kabel', catKey, cat: cfg.cableCategories[catKey] };
  } else {
    const typeKey = Object.entries(cfg.deviceTypes).find(([k,v]) => v.prefix === item.prefix)[0];
    return { kind:'geraet', typeKey, type: cfg.deviceTypes[typeKey] };
  }
}

async function renderItemDetail(item){
  const cfg = await loadConfig();
  const info = categoryFieldsForItem(item, cfg);
  app.innerHTML = '';

  const header = el('<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px;"></div>');
  header.appendChild(el('<div class="number-label">' + item.number + '</div>'));
  header.appendChild(el('<span class="status-pill ' + item.status + '">' + statusLabel(item.status) + '</span>'));
  app.appendChild(header);
  app.appendChild(el('<p class="hint">' + (info.kind === 'kabel' ? info.cat.label : info.type.label) + '</p>'));

  if(item.container){
    const cbadge = el('<div class="badge-row"><span class="status-pill">in Kiste ' + esc(item.container) + '</span></div>');
    const rmBtn = el('<button type="button" class="btn ghost" style="width:auto;padding:4px 10px;font-size:12px;">entfernen</button>');
    cbadge.appendChild(rmBtn);
    rmBtn.addEventListener('click', async () => {
      try {
        await api('/items/' + encodeURIComponent(item.number) + '/container', { method:'PATCH', body: JSON.stringify({container:null}) });
        toast('Aus Kiste entfernt.');
        lookupNumber(item.number);
      } catch(e){ toast(e.message, true); }
    });
    app.appendChild(cbadge);
  }

  const form = el('<div class="card"></div>');
  app.appendChild(form);

  if(info.kind === 'kabel'){
    const c = item.cable || {};
    const defaultBereich = item.bereich || info.cat.defaultBereich;
    form.appendChild(fieldChips('Bereich', 'bereich', defaultBereich, ['licht','ton','allgemein'], cfg.bereichLabels));
    form.appendChild(fieldSelectWithOther('Kabeltyp', 'cable_type', c.cable_type, ['XLR-Kabel','Klinke-Kabel','Speakon-Kabel','Cinch-Kabel','Verlängerung','Sonstiges']));
    const row = el('<div class="row2"></div>');
    row.appendChild(fieldSelect('Stecker A', 'connector_a', c.connector_a, info.cat.connectors));
    row.appendChild(fieldSelect('Stecker B', 'connector_b', c.connector_b, info.cat.connectors));
    form.appendChild(row);
    form.appendChild(fieldNumber('Länge (m)', 'length_m', c.length_m));
  } else {
    const d = item.device || {};
    const bereichCfg = info.type.bereich;
    if(bereichCfg && bereichCfg.mode === 'choice'){
      form.appendChild(fieldChips('Bereich', 'bereich', item.bereich, bereichCfg.options, cfg.bereichLabels));
    } else if(bereichCfg && bereichCfg.mode === 'fixed'){
      form.appendChild(el('<div class="field"><label>Bereich</label><span class="status-pill">' + esc(cfg.bereichLabels[bereichCfg.value]) + '</span></div>'));
    }
    if(info.typeKey === 'kiste'){
      form.appendChild(fieldText('Bezeichnung (optional)', 'model', d.model));
    } else {
      if(info.type.hasActivePassive){
        form.appendChild(fieldChips('Aktiv / Passiv', 'active_passive', d.active_passive, ['aktiv','passiv']));
      }
      form.appendChild(fieldText('Marke', 'brand', d.brand));
      form.appendChild(fieldText('Modell', 'model', d.model));
      form.appendChild(fieldTextArea('Details (z. B. Kanäle, Frequenzband)', 'details', d.details));
      if(info.type.hasRack){
        const racks = await api('/racks');
        form.appendChild(fieldRackSelect('Rack', 'rack_id', d.rack_id, racks));
      }
    }
  }
  form.appendChild(fieldTextArea('Notizen', 'notes', item.notes));

  const saveBtn = el('<button class="btn">Speichern</button>');
  app.appendChild(saveBtn);

  const btnRow = el('<div class="btn-row" style="margin-top:10px;"></div>');
  if(item.status !== 'defekt'){
    const defBtn = el('<button class="btn secondary">Als defekt melden</button>');
    defBtn.addEventListener('click', () => changeStatus(item.number, 'defekt'));
    btnRow.appendChild(defBtn);
  }
  if(item.status !== 'aktiv'){
    const okBtn = el('<button class="btn secondary">Als aktiv markieren</button>');
    okBtn.addEventListener('click', () => changeStatus(item.number, 'aktiv'));
    btnRow.appendChild(okBtn);
  }
  app.appendChild(btnRow);

  const dangerRow = el('<div class="btn-row" style="margin-top:10px;"></div>');
  const outBtn = el('<button class="btn secondary">Ausmustern</button>');
  outBtn.addEventListener('click', () => changeStatus(item.number, 'ausgemustert'));
  const delBtn = el('<button class="btn danger">Löschen</button>');
  delBtn.addEventListener('click', () => deleteItemConfirm(item.number));
  dangerRow.appendChild(outBtn);
  dangerRow.appendChild(delBtn);
  app.appendChild(dangerRow);

  app.appendChild(el('<h3 class="section-title" style="font-size:16px;margin-top:22px;">Label</h3>'));
  const labelSheet = el('<div class="label-sheet" id="print-area" style="grid-template-columns:1fr;max-width:220px;"></div>');
  const labelCard = el('<div class="label-card"><svg class="bc"></svg><div class="cat">' + esc(labelText(item, info)) + '</div></div>');
  labelSheet.appendChild(labelCard);
  renderBarcodeInto(labelCard.querySelector('.bc'), item.number);
  app.appendChild(labelSheet);
  const printItemBtn = el('<button class="btn secondary" style="margin-top:10px;">Label drucken</button>');
  printItemBtn.addEventListener('click', () => window.print());
  app.appendChild(printItemBtn);

  if(info.kind === 'geraet' && info.typeKey === 'kiste'){
    app.appendChild(el('<h3 class="section-title" style="font-size:16px;margin-top:22px;">Inhalt</h3>'));
    const contents = item.contents || [];
    const contentsWrap = el('<div class="card" style="padding:4px 12px;"></div>');
    if(!contents.length){
      contentsWrap.appendChild(el('<div class="empty">Noch kein Inhalt erfasst.</div>'));
    }
    contents.forEach(c => {
      const row = el('<div class="item-row"><div class="grow"><div class="num">' + esc(c.number) + '</div></div></div>');
      const rm = el('<button class="btn danger" style="width:auto;padding:8px 12px;">entfernen</button>');
      rm.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await api('/items/' + encodeURIComponent(c.number) + '/container', { method:'PATCH', body: JSON.stringify({container:null}) });
          lookupNumber(item.number);
        } catch(err){ toast(err.message, true); }
      });
      row.appendChild(rm);
      contentsWrap.appendChild(row);
    });
    app.appendChild(contentsWrap);

    const checkBtn = el('<button class="btn secondary" style="margin-top:10px;">Inhalt prüfen</button>');
    checkBtn.addEventListener('click', () => {
      const list = contents.length ? contents.map(c => '- ' + c.number).join('\\n') : '(kein Inhalt erfasst)';
      if(confirm('Inhalt von ' + item.number + ':\\n' + list + '\\n\\nIst alles vorhanden?')){
        toast('Inhalt bestätigt.');
      } else {
        toast('Bitte unten anpassen.');
      }
    });
    app.appendChild(checkBtn);

    const addToggle = el('<button class="btn ghost" style="margin-top:10px;">Scannen zum Hinzufügen</button>');
    const scanSlot = el('<div style="margin-top:12px;"></div>');
    addToggle.addEventListener('click', () => {
      scanSlot.innerHTML = '';
      scanSlot.appendChild(buildScanner(async (num) => {
        try {
          await api('/items/' + encodeURIComponent(num) + '/container', { method:'PATCH', body: JSON.stringify({container: item.number}) });
          toast(num + ' hinzugefügt.');
          lookupNumber(item.number);
        } catch(e){ toast(e.message, true); }
      }));
    });
    app.appendChild(addToggle);
    app.appendChild(scanSlot);
  }

  saveBtn.addEventListener('click', async () => {
    const payload = collectFormValues(form);
    try {
      await api('/items/' + encodeURIComponent(item.number), { method:'PATCH', body: JSON.stringify(payload) });
      toast('Gespeichert: ' + item.number);
      goTo('scan');
    } catch(e){ toast(e.message, true); }
  });
}

async function changeStatus(number, status){
  try {
    await api('/items/' + encodeURIComponent(number) + '/status', { method:'PATCH', body: JSON.stringify({status}) });
    toast(number + ' → ' + statusLabel(status));
    const item = await api('/items/' + encodeURIComponent(number));
    renderItemDetail(item);
  } catch(e){ toast(e.message, true); }
}

async function deleteItemConfirm(number){
  if(!confirm(number + ' wirklich endgültig löschen?')) return;
  try {
    await api('/items/' + encodeURIComponent(number), { method:'DELETE' });
    toast(number + ' gelöscht');
    goTo('liste');
  } catch(e){ toast(e.message, true); }
}

function statusLabel(s){
  return { reserviert:'reserviert', aktiv:'aktiv', defekt:'defekt', ausgemustert:'ausgemustert' }[s] || s;
}

// form field builders
function fieldText(label, name, value){
  return el('<div class="field"><label>' + label + '</label><input type="text" name="' + name + '" value="' + esc(value||'') + '"></div>');
}
function fieldNumber(label, name, value){
  return el('<div class="field"><label>' + label + '</label><input type="number" step="0.1" name="' + name + '" value="' + (value ?? '') + '"></div>');
}
function fieldTextArea(label, name, value){
  return el('<div class="field"><label>' + label + '</label><textarea name="' + name + '">' + esc(value||'') + '</textarea></div>');
}
function fieldSelect(label, name, value, options){
  const opts = options.map(o => '<option value="' + esc(o) + '"' + (o===value?' selected':'') + '>' + esc(o) + '</option>').join('');
  return el('<div class="field"><label>' + label + '</label><select name="' + name + '"><option value="">–</option>' + opts + '</select></div>');
}
function fieldSelectWithOther(label, name, value, options){
  return fieldSelect(label, name, value, options);
}
function fieldRackSelect(label, name, value, racks){
  const opts = racks.map(r => '<option value="' + r.id + '"' + (String(r.id)===String(value)?' selected':'') + '>' + esc(r.name) + '</option>').join('');
  return el('<div class="field"><label>' + label + '</label><select name="' + name + '"><option value="">– kein Rack –</option>' + opts + '</select></div>');
}
function fieldChips(label, name, value, options, labels){
  const wrap = el('<div class="field"><label>' + label + '</label><div class="chip-group" data-name="' + name + '"></div></div>');
  const group = wrap.querySelector('.chip-group');
  options.forEach(o => {
    const text = (labels && labels[o]) ? labels[o] : o;
    const chip = el('<button type="button" class="chip' + (o===value?' active':'') + '" data-value="' + o + '">' + esc(text) + '</button>');
    chip.addEventListener('click', () => {
      [...group.querySelectorAll('.chip')].forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
    group.appendChild(chip);
  });
  return wrap;
}
function collectFormValues(form){
  const payload = {};
  form.querySelectorAll('input,textarea,select').forEach(elm => {
    if(elm.name) payload[elm.name] = elm.value === '' ? null : elm.value;
  });
  form.querySelectorAll('.chip-group').forEach(g => {
    const active = g.querySelector('.chip.active');
    payload[g.dataset.name] = active ? active.dataset.value : null;
  });
  if('length_m' in payload && payload.length_m !== null) payload.length_m = parseFloat(payload.length_m);
  if('rack_id' in payload && payload.rack_id !== null) payload.rack_id = parseInt(payload.rack_id, 10);
  return payload;
}
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// ================= NEU: Nummern erzeugen & drucken =================
views.neu = async function(){
  const cfg = await loadConfig();
  app.innerHTML = '';
  app.appendChild(el('<h2 class="section-title">Neue Nummern</h2>'));
  app.appendChild(el('<p class="hint">Kategorie wählen, Anzahl festlegen, Nummern reservieren und Labels drucken. Danach Labels aufkleben und über „Scannen" die Daten erfassen.</p>'));

  let itemType = 'kabel';
  const typeChips = el('<div class="chip-group" style="margin-bottom:16px;"></div>');
  ['kabel','geraet'].forEach(t => {
    const chip = el('<button type="button" class="chip' + (t===itemType?' active':'') + '">' + (t==='kabel'?'Kabel':'Gerät') + '</button>');
    chip.addEventListener('click', () => { itemType = t; [...typeChips.children].forEach(c=>c.classList.remove('active')); chip.classList.add('active'); renderCatChips(); });
    typeChips.appendChild(chip);
  });
  app.appendChild(typeChips);

  const catWrap = el('<div class="chip-group" style="margin-bottom:16px;"></div>');
  app.appendChild(catWrap);
  let selectedPrefix = null;

  function renderCatChips(){
    catWrap.innerHTML = '';
    selectedPrefix = null;
    const source = itemType === 'kabel' ? cfg.cableCategories : cfg.deviceTypes;
    Object.values(source).forEach((v, idx) => {
      const chip = el('<button type="button" class="chip">' + v.label + '</button>');
      chip.addEventListener('click', () => {
        [...catWrap.children].forEach(c=>c.classList.remove('active'));
        chip.classList.add('active');
        selectedPrefix = v.prefix;
      });
      catWrap.appendChild(chip);
      if(idx===0){ chip.classList.add('active'); selectedPrefix = v.prefix; }
    });
  }
  renderCatChips();

  const qtyField = el('<div class="field"><label>Anzahl Nummern</label><input type="number" id="qty" value="1" min="1" max="50"></div>');
  app.appendChild(qtyField);

  const genBtn = el('<button class="btn">Nummern reservieren</button>');
  app.appendChild(genBtn);

  const resultWrap = el('<div style="margin-top:20px;"></div>');
  app.appendChild(resultWrap);

  genBtn.addEventListener('click', async () => {
    const qty = parseInt(qtyField.querySelector('#qty').value, 10) || 1;
    try {
      const res = await api('/allocate', { method:'POST', body: JSON.stringify({ prefix: selectedPrefix, item_type: itemType, count: qty }) });
      renderLabelSheet(resultWrap, res.numbers, selectedPrefix, cfg);
    } catch(e){ toast(e.message, true); }
  });
};

function renderLabelSheet(container, numbers, prefix, cfg){
  const info = Object.values(cfg.cableCategories).concat(Object.values(cfg.deviceTypes)).find(v => v.prefix === prefix);
  container.innerHTML = '';
  container.appendChild(el('<h3 class="section-title" style="font-size:16px;">' + numbers.length + ' Nummer(n) reserviert</h3>'));
  const printBtn = el('<button class="btn secondary" style="margin-bottom:14px;">Labels drucken</button>');
  printBtn.addEventListener('click', () => window.print());
  container.appendChild(printBtn);

  const sheet = el('<div class="label-sheet" id="print-area"></div>');
  numbers.forEach(num => {
    const card = el('<div class="label-card"><svg class="bc"></svg><div class="cat">' + esc(info ? info.label : '') + '</div></div>');
    sheet.appendChild(card);
    renderBarcodeInto(card.querySelector('.bc'), num);
  });
  container.appendChild(sheet);

  const goScan = el('<button class="btn ghost" style="margin-top:14px;">Zum Scanner</button>');
  goScan.addEventListener('click', () => goTo('scan'));
  container.appendChild(goScan);
}

// ================= LISTE =================
views.liste = async function(){
  app.innerHTML = '';
  app.appendChild(el('<h2 class="section-title">Inventar</h2>'));

  const filters = el('<div class="filters"></div>');
  const statusSel = el('<select id="f-status"><option value="">Alle Status</option><option value="reserviert">reserviert</option><option value="aktiv">aktiv</option><option value="defekt">defekt</option><option value="ausgemustert">ausgemustert</option></select>');
  const typeSel = el('<select id="f-type"><option value="">Alle Typen</option><option value="kabel">Kabel</option><option value="geraet">Geräte</option></select>');
  const bereichSel = el('<select id="f-bereich"><option value="">Alle Bereiche</option><option value="licht">Licht</option><option value="ton">Ton</option><option value="allgemein">Allgemein</option></select>');
  const searchInp = el('<input type="text" id="f-q" placeholder="Suche Nummer/Notiz…" />');
  filters.appendChild(statusSel); filters.appendChild(typeSel); filters.appendChild(bereichSel); filters.appendChild(searchInp);
  app.appendChild(filters);

  const listWrap = el('<div class="card" style="padding:4px 12px;"></div>');
  app.appendChild(listWrap);

  async function refresh(){
    const params = new URLSearchParams();
    if(statusSel.value) params.set('status', statusSel.value);
    if(typeSel.value) params.set('item_type', typeSel.value);
    if(bereichSel.value) params.set('bereich', bereichSel.value);
    if(searchInp.value) params.set('q', searchInp.value);
    const items = await api('/items?' + params.toString());
    listWrap.innerHTML = '';
    if(!items.length){ listWrap.appendChild(el('<div class="empty">Keine Einträge gefunden.</div>')); return; }
    items.forEach(item => {
      const meta = item.item_type === 'kabel'
        ? [item.cable && item.cable.cable_type, item.cable && (item.cable.connector_a || '') + (item.cable.connector_b ? ' → ' + item.cable.connector_b : ''), item.cable && item.cable.length_m ? item.cable.length_m + ' m' : null].filter(Boolean).join(' · ')
        : [item.device && item.device.brand, item.device && item.device.model, item.device && item.device.active_passive].filter(Boolean).join(' · ');
      const extra = item.container ? ('in ' + item.container) : null;
      const metaFull = [meta || null, extra].filter(Boolean).join(' · ') || '–';
      const row = el('<div class="item-row"><span class="status-dot ' + item.status + '"></span><div class="grow"><div class="num">' + item.number + '</div><div class="meta">' + metaFull + '</div></div><span class="status-pill ' + item.status + '">' + item.status + '</span></div>');
      row.addEventListener('click', () => lookupNumber(item.number));
      listWrap.appendChild(row);
    });
  }
  statusSel.addEventListener('change', refresh);
  typeSel.addEventListener('change', refresh);
  bereichSel.addEventListener('change', refresh);
  searchInp.addEventListener('input', debounce(refresh, 300));
  await refresh();
};

function debounce(fn, ms){ let t; return (...a) => { clearTimeout(t); t = setTimeout(()=>fn(...a), ms); }; }

// ================= RACKS =================
views.racks = async function(){
  app.innerHTML = '';
  app.appendChild(el('<h2 class="section-title">Racks (Funkmikros)</h2>'));
  app.appendChild(el('<p class="hint">Racks anlegen, um Funkmikrofone einem Standort/Case zuzuordnen.</p>'));

  const addCard = el('<div class="card"></div>');
  addCard.appendChild(fieldText('Name', 'name', ''));
  addCard.appendChild(fieldText('Standort (optional)', 'location', ''));
  const addBtn = el('<button class="btn">Rack anlegen</button>');
  addCard.appendChild(addBtn);
  app.appendChild(addCard);

  const listWrap = el('<div class="card" style="padding:4px 12px;"></div>');
  app.appendChild(listWrap);

  async function refresh(){
    const racks = await api('/racks');
    listWrap.innerHTML = '';
    if(!racks.length){ listWrap.appendChild(el('<div class="empty">Noch keine Racks angelegt.</div>')); return; }
    racks.forEach(r => {
      const row = el('<div class="item-row"><div class="grow"><div class="num" style="font-family:var(--font-body);">' + esc(r.name) + '</div><div class="meta">' + esc(r.location || '') + '</div></div></div>');
      const del = el('<button class="btn danger" style="width:auto;padding:8px 12px;">×</button>');
      del.addEventListener('click', async (e) => { e.stopPropagation(); if(confirm('Rack löschen?')){ await api('/racks/' + r.id, {method:'DELETE'}); refresh(); } });
      row.appendChild(del);
      listWrap.appendChild(row);
    });
  }

  addBtn.addEventListener('click', async () => {
    const payload = collectFormValues(addCard);
    if(!payload.name){ toast('Bitte einen Namen angeben.', true); return; }
    try { await api('/racks', { method:'POST', body: JSON.stringify(payload) }); addCard.querySelectorAll('input').forEach(i=>i.value=''); refresh(); }
    catch(e){ toast(e.message, true); }
  });

  await refresh();
};

// ================= EVENTS =================
function formatDate(iso){
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric' });
  } catch(e){ return iso; }
}

views.events = async function(){
  app.innerHTML = '';
  app.appendChild(el('<h2 class="section-title">Events</h2>'));
  app.appendChild(el('<p class="hint">Event anlegen, Packliste zusammenstellen und beim Packen einfach scannen.</p>'));

  const addCard = el('<div class="card"></div>');
  addCard.appendChild(fieldText('Name', 'name', ''));
  const row = el('<div class="row2"></div>');
  row.appendChild(el('<div class="field"><label>Datum</label><input type="date" name="event_date"></div>'));
  row.appendChild(fieldText('Ort (optional)', 'location', ''));
  addCard.appendChild(row);
  addCard.appendChild(fieldTextArea('Bemerkung', 'notes', ''));
  const addBtn = el('<button class="btn">Event anlegen</button>');
  addCard.appendChild(addBtn);
  app.appendChild(addCard);

  const listWrap = el('<div style="margin-top:6px;"></div>');
  app.appendChild(listWrap);

  async function refresh(){
    const events = await api('/events');
    listWrap.innerHTML = '';
    if(!events.length){ listWrap.appendChild(el('<div class="empty">Noch keine Events angelegt.</div>')); return; }
    events.forEach(ev => {
      const pct = ev.progress.total ? Math.round(100 * ev.progress.packed / ev.progress.total) : 0;
      const card = el('<div class="card event-card"></div>');
      card.appendChild(el('<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;"><div class="headline" style="font-size:16px;">' + esc(ev.name) + '</div><div class="meta" style="color:var(--muted);font-size:12.5px;white-space:nowrap;">' + formatDate(ev.event_date) + '</div></div>'));
      if(ev.location) card.appendChild(el('<div class="hint" style="margin:2px 0 0;">' + esc(ev.location) + '</div>'));
      card.appendChild(el('<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>'));
      card.appendChild(el('<div class="hint" style="margin:6px 0 0;">' + ev.progress.packed + ' / ' + ev.progress.total + ' gepackt</div>'));
      card.addEventListener('click', () => goTo('event-detail', { id: ev.id }));
      listWrap.appendChild(card);
    });
  }

  addBtn.addEventListener('click', async () => {
    const payload = collectFormValues(addCard);
    if(!payload.name || !payload.event_date){ toast('Name und Datum sind erforderlich.', true); return; }
    try {
      const ev = await api('/events', { method:'POST', body: JSON.stringify(payload) });
      toast('Event angelegt: ' + ev.name);
      goTo('event-detail', { id: ev.id });
    } catch(e){ toast(e.message, true); }
  });

  await refresh();
};

// Gibt true zurück, wenn die Kiste erfolgreich abgehakt wurde (Aufrufer soll dann
// die Event-Ansicht neu laden). Bei "Nein" wird zur Kisten-Detailseite gesprungen
// und false zurückgegeben, damit der Aufrufer diese Navigation nicht überschreibt.
async function handleContainerScan(containerNumber, eventId){
  let container;
  try { container = await api('/items/' + encodeURIComponent(containerNumber)); }
  catch(e){ toast('Unbekannte Nummer: ' + containerNumber, true); return false; }
  const contents = container.contents || [];
  const list = contents.length ? contents.map(c => '- ' + c.number).join('\\n') : '(kein Inhalt erfasst)';
  const ok = confirm('Inhalt von ' + containerNumber + ':\\n' + list + '\\n\\nIst alles vorhanden?');
  if(ok){
    try {
      await api('/events/' + eventId + '/pack-container', { method:'POST', body: JSON.stringify({ number: containerNumber }) });
      toast(containerNumber + ' + Inhalt abgehakt.');
      return true;
    } catch(e){ toast(e.message, true); return false; }
  } else {
    toast('Bitte Inhalt von ' + containerNumber + ' korrigieren.');
    goTo('scan');
    lookupNumber(containerNumber);
    return false;
  }
}

async function handleEventScan(eventId, number){
  let item;
  try { item = await api('/items/' + encodeURIComponent(number)); }
  catch(e){ toast('Unbekannte Nummer: ' + number, true); return; }

  if(item.device && item.device.device_type === 'kiste'){
    const ok = await handleContainerScan(number, eventId);
    if(ok && currentView === 'event-detail') goTo('event-detail', { id: eventId });
    return;
  }

  const ev = await api('/events/' + eventId);
  const onList = ev.packlist.some(p => p.number === number);
  if(!onList){
    if(!confirm(number + ' ist nicht auf der Packliste. Trotzdem hinzufügen und abhaken?')){ return; }
    try { await api('/events/' + eventId + '/items', { method:'POST', body: JSON.stringify({ number }) }); }
    catch(e){ toast(e.message, true); return; }
  }
  try {
    await api('/events/' + eventId + '/items/' + encodeURIComponent(number), { method:'PATCH', body: JSON.stringify({ packed:true }) });
    toast(number + ' abgehakt ✓');
  } catch(e){ toast(e.message, true); return; }
  if(currentView === 'event-detail') goTo('event-detail', { id: eventId });
}

views['event-detail'] = async function(params){
  setActiveTab('events');
  const ev = await api('/events/' + params.id);
  app.innerHTML = '';

  const backBtn = el('<button class="btn ghost" style="margin-bottom:12px;">← Alle Events</button>');
  backBtn.addEventListener('click', () => goTo('events'));
  app.appendChild(backBtn);

  app.appendChild(el('<h2 class="section-title" style="margin-bottom:2px;">' + esc(ev.name) + '</h2>'));
  app.appendChild(el('<p class="hint">' + formatDate(ev.event_date) + (ev.location ? ' · ' + esc(ev.location) : '') + '</p>'));

  const editCard = el('<div class="card"></div>');
  editCard.appendChild(fieldText('Name', 'name', ev.name));
  const erow = el('<div class="row2"></div>');
  erow.appendChild(el('<div class="field"><label>Datum</label><input type="date" name="event_date" value="' + esc(ev.event_date) + '"></div>'));
  erow.appendChild(fieldText('Ort (optional)', 'location', ev.location));
  editCard.appendChild(erow);
  editCard.appendChild(fieldTextArea('Bemerkung', 'notes', ev.notes));
  const saveBtn = el('<button class="btn secondary">Änderungen speichern</button>');
  editCard.appendChild(saveBtn);
  const delEvBtn = el('<button class="btn danger" style="margin-top:10px;">Event löschen</button>');
  editCard.appendChild(delEvBtn);
  app.appendChild(editCard);

  saveBtn.addEventListener('click', async () => {
    const payload = collectFormValues(editCard);
    if(!payload.name || !payload.event_date){ toast('Name und Datum sind erforderlich.', true); return; }
    try { await api('/events/' + ev.id, { method:'PATCH', body: JSON.stringify(payload) }); toast('Gespeichert.'); goTo('event-detail', { id: ev.id }); }
    catch(e){ toast(e.message, true); }
  });
  delEvBtn.addEventListener('click', async () => {
    if(!confirm('Event „' + ev.name + '" wirklich löschen?')) return;
    await api('/events/' + ev.id, { method:'DELETE' });
    toast('Event gelöscht.');
    goTo('events');
  });

  app.appendChild(el('<h3 class="section-title" style="font-size:16px;margin-top:22px;">Packliste (' + ev.progress.packed + '/' + ev.progress.total + ')</h3>'));

  const addRow = el('<div class="btn-row" style="margin-bottom:14px;"></div>');
  const addInput = el('<input type="text" placeholder="Nummer, z. B. KIS-001" autocapitalize="characters" style="flex:1;background:var(--panel-2);border:1px solid var(--line);color:var(--text);border-radius:8px;padding:11px 12px;font-size:15px;">');
  const addPBtn = el('<button class="btn" style="width:auto;">+</button>');
  addRow.appendChild(addInput); addRow.appendChild(addPBtn);
  app.appendChild(addRow);
  addPBtn.addEventListener('click', async () => {
    const num = addInput.value.trim().toUpperCase();
    if(!num) return;
    try { await api('/events/' + ev.id + '/items', { method:'POST', body: JSON.stringify({ number: num }) }); goTo('event-detail', { id: ev.id }); }
    catch(e){ toast(e.message, true); }
  });
  addInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') addPBtn.click(); });

  const listWrap = el('<div class="card" style="padding:4px 12px;"></div>');
  if(!ev.packlist.length){ listWrap.appendChild(el('<div class="empty">Packliste ist leer.</div>')); }
  ev.packlist.forEach(it => {
    const isKiste = it.device && it.device.device_type === 'kiste';
    const row = el('<div class="item-row"></div>');
    row.appendChild(el('<span class="status-dot ' + (it.packed ? 'aktiv' : 'reserviert') + '"></span>'));
    row.appendChild(el('<div class="grow"><div class="num">' + esc(it.number) + (isKiste ? ' 📦' : '') + '</div></div>'));
    const chk = el('<button class="btn secondary" style="width:auto;padding:8px 12px;">' + (it.packed ? '✓ gepackt' : 'abhaken') + '</button>');
    chk.addEventListener('click', async () => {
      try {
        if(isKiste){
          const ok = await handleContainerScan(it.number, ev.id);
          if(ok) goTo('event-detail', { id: ev.id });
        } else {
          await api('/events/' + ev.id + '/items/' + encodeURIComponent(it.number), { method:'PATCH', body: JSON.stringify({ packed: !it.packed }) });
          goTo('event-detail', { id: ev.id });
        }
      } catch(e){ toast(e.message, true); }
    });
    row.appendChild(chk);
    const rm = el('<button class="btn danger" style="width:auto;padding:8px 12px;margin-left:6px;">×</button>');
    rm.addEventListener('click', async (e) => {
      e.stopPropagation();
      await api('/events/' + ev.id + '/items/' + encodeURIComponent(it.number), { method:'DELETE' });
      goTo('event-detail', { id: ev.id });
    });
    row.appendChild(rm);
    listWrap.appendChild(row);
  });
  app.appendChild(listWrap);

  app.appendChild(el('<h3 class="section-title" style="font-size:16px;margin-top:22px;">Zum Abhaken scannen</h3>'));
  const scanWrap = el('<div></div>');
  scanWrap.appendChild(buildScanner((number) => handleEventScan(ev.id, number)));
  app.appendChild(scanWrap);
};

// ---------- Start ----------
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').catch(()=>{});
}
if(navigator.onLine === false){ onlineBadge.textContent = 'offline'; } else { onlineBadge.textContent = 'bereit'; onlineBadge.classList.add('live'); }
window.addEventListener('online', ()=>{ onlineBadge.textContent='bereit'; onlineBadge.classList.add('live'); });
window.addEventListener('offline', ()=>{ onlineBadge.textContent='offline'; onlineBadge.classList.remove('live'); });

goTo('scan');
`;
