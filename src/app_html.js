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
<script src="https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js"></script>
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
  --bg:#121316;
  --panel:#1B1D21;
  --panel-2:#242628;
  --panel-raised:#2B2E33;
  --line:#34373C;
  --line-soft:rgba(255,255,255,0.05);
  --accent:#E8A13C;
  --accent-2:#C97A24;
  --accent-dim:#7C5A25;
  --accent-ink:#231904;
  --accent-glow:rgba(232,161,60,0.35);
  --text:#F2EFE7;
  --text-dim:#C9C5BA;
  --muted:#8D9096;
  --ok:#5AB97C;
  --ok-dim:#2F6B46;
  --danger:#E1604C;
  --danger-dim:#7C3226;
  --off:#63666D;
  --radius-s:9px;
  --radius-m:14px;
  --radius-l:20px;
  --font-head:'Space Grotesk',system-ui,sans-serif;
  --font-body:'IBM Plex Sans',system-ui,sans-serif;
  --font-mono:'IBM Plex Mono',monospace;
}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;height:100%;}
body{
  background:
    radial-gradient(900px 480px at 12% -8%, rgba(232,161,60,0.07), transparent 60%),
    radial-gradient(700px 420px at 100% 0%, rgba(90,185,124,0.045), transparent 55%),
    var(--bg);
  color:var(--text);
  font-family:var(--font-body);
  -webkit-font-smoothing:antialiased;
  overscroll-behavior-y:none;
}
button{font-family:inherit;}
h1,h2,h3,.headline{font-family:var(--font-head);letter-spacing:-0.01em;}
::selection{background:var(--accent);color:var(--accent-ink);}

.topbar{
  position:sticky;top:0;z-index:20;
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 18px;
  background:linear-gradient(180deg, var(--bg) 75%, rgba(18,19,22,0));
  border-bottom:1px solid var(--line-soft);
}
.brand{display:flex;align-items:center;gap:11px;font-family:var(--font-head);font-size:14.5px;text-transform:uppercase;letter-spacing:0.06em;}
.brand b{color:var(--accent);font-weight:600;letter-spacing:0.06em;}
.brand-mark{
  width:20px;height:20px;border-radius:6px;position:relative;flex:none;
  background:linear-gradient(155deg, var(--accent) 0%, var(--accent-2) 100%);
  box-shadow:0 0 0 1px rgba(0,0,0,0.25) inset, 0 2px 6px -1px var(--accent-glow);
}
.brand-mark::after{
  content:"";position:absolute;inset:5px 4px;border-radius:2px;
  background:repeating-linear-gradient(90deg, rgba(20,14,3,0.85) 0 1.5px, transparent 1.5px 3.4px);
}
.badge{font-size:10.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted);border:1px solid var(--line);padding:4px 9px;border-radius:20px;}
.badge.live{color:var(--ok);border-color:var(--ok-dim);background:rgba(90,185,124,0.08);}

.app{padding:18px 16px 100px;max-width:640px;margin:0 auto;min-height:calc(100vh - 60px);}

.tabbar{
  position:fixed;bottom:0;left:0;right:0;z-index:30;
  display:flex;background:var(--panel);border-top:1px solid var(--line-soft);
  padding:7px 6px calc(7px + env(safe-area-inset-bottom));
  box-shadow:0 -8px 24px -18px rgba(0,0,0,0.7);
}
.tab{
  flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;
  background:none;border:none;color:var(--muted);padding:7px 2px 6px;border-radius:12px;
  font-size:10.5px;text-transform:uppercase;letter-spacing:0.04em;font-weight:500;
  transition:color .15s ease;
}
.tab svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.7;transition:transform .15s ease;}
.tab.active{color:var(--accent);}
.tab.active svg{transform:translateY(-1px);}
.tab.active::before{
  content:"";display:block;width:4px;height:4px;border-radius:50%;background:var(--accent);
  box-shadow:0 0 6px 1px var(--accent-glow);margin-bottom:2px;
}

.section-title{font-size:20px;font-weight:600;margin:2px 0 14px;letter-spacing:-0.01em;}
.hint{color:var(--muted);font-size:13px;line-height:1.55;margin-bottom:16px;}

.card{
  background:linear-gradient(180deg, var(--panel-raised) 0%, var(--panel) 100%);
  border:1px solid var(--line);border-radius:var(--radius-m);
  padding:16px;margin-bottom:12px;
  box-shadow:0 1px 0 rgba(255,255,255,0.03) inset, 0 10px 24px -18px rgba(0,0,0,0.7);
}
.card + .card{margin-top:12px;}

.field{margin-bottom:14px;}
.field label{display:block;font-size:11.5px;color:var(--muted);margin-bottom:7px;text-transform:uppercase;letter-spacing:0.05em;font-weight:500;}
.field input[type=text],.field input[type=number],.field input[type=date],.field select,.field textarea{
  width:100%;background:var(--panel-2);border:1px solid var(--line);color:var(--text);
  border-radius:var(--radius-s);padding:11px 12px;font-size:15px;font-family:var(--font-body);
  box-shadow:0 1px 0 rgba(255,255,255,0.02) inset;
  transition:border-color .15s ease, box-shadow .15s ease;
}
.field textarea{resize:vertical;min-height:60px;}
.field input:focus,.field select:focus,.field textarea:focus{
  outline:none;border-color:var(--accent-dim);
  box-shadow:0 0 0 3px var(--accent-glow);
}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  background:linear-gradient(180deg, var(--accent) 0%, var(--accent-2) 100%);
  color:var(--accent-ink);border:none;border-radius:var(--radius-s);
  padding:13px 18px;font-weight:600;font-size:14.5px;width:100%;cursor:pointer;
  font-family:var(--font-head);text-transform:uppercase;letter-spacing:0.04em;
  box-shadow:0 1px 0 rgba(255,255,255,0.25) inset, 0 6px 14px -6px var(--accent-glow);
  transition:transform .1s ease, box-shadow .1s ease;
}
.btn:active{transform:translateY(1px);box-shadow:0 1px 0 rgba(255,255,255,0.15) inset;}
.btn:disabled{opacity:.5;cursor:default;}
.btn.secondary{
  background:var(--panel-raised);color:var(--text);border:1px solid var(--line);
  box-shadow:0 1px 0 rgba(255,255,255,0.04) inset;
}
.btn.danger{background:transparent;color:var(--danger);border:1px solid var(--danger-dim);box-shadow:none;}
.btn.ghost{background:transparent;color:var(--accent);border:1px solid var(--accent-dim);box-shadow:none;}
.btn-row{display:flex;gap:10px;}
.btn-row .btn{width:auto;flex:1;}

.chip-group{display:flex;flex-wrap:wrap;gap:8px;}
.chip{
  border:1px solid var(--line);background:var(--panel-2);color:var(--text-dim);
  border-radius:20px;padding:9px 14px 9px 12px;font-size:13.5px;cursor:pointer;
  display:inline-flex;align-items:center;gap:7px;transition:all .15s ease;
}
.chip::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--line);flex:none;transition:background .15s ease;}
.chip.active{border-color:var(--accent-dim);color:var(--accent);background:rgba(232,161,60,0.1);}
.chip.active::before{background:var(--accent);box-shadow:0 0 5px 1px var(--accent-glow);}

.scanbox{
  position:relative;border-radius:var(--radius-l);overflow:hidden;background:#000;
  aspect-ratio:4/3;border:1px solid var(--line);margin-bottom:14px;
  box-shadow:0 20px 40px -28px rgba(0,0,0,0.8);
}
.scanbox video{width:100%;height:100%;object-fit:cover;display:block;}
.scan-frame{
  position:absolute;inset:16%;border-radius:14px;pointer-events:none;
  box-shadow:0 0 0 999px rgba(8,9,11,0.55);
  background:
    linear-gradient(var(--accent),var(--accent)) top left/26px 3px no-repeat,
    linear-gradient(var(--accent),var(--accent)) top left/3px 26px no-repeat,
    linear-gradient(var(--accent),var(--accent)) top right/26px 3px no-repeat,
    linear-gradient(var(--accent),var(--accent)) top right/3px 26px no-repeat,
    linear-gradient(var(--accent),var(--accent)) bottom left/26px 3px no-repeat,
    linear-gradient(var(--accent),var(--accent)) bottom left/3px 26px no-repeat,
    linear-gradient(var(--accent),var(--accent)) bottom right/26px 3px no-repeat,
    linear-gradient(var(--accent),var(--accent)) bottom right/3px 26px no-repeat;
}
.scan-frame::after{
  content:"";position:absolute;left:5%;right:5%;height:2px;top:8%;
  background:linear-gradient(90deg, transparent, var(--accent), transparent);
  box-shadow:0 0 10px 1px var(--accent-glow);
  animation:scanline 2.4s ease-in-out infinite;
}
@keyframes scanline{
  0%,100%{top:8%;opacity:.9;}
  50%{top:86%;opacity:.4;}
}
.scan-placeholder{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  color:var(--muted);font-size:13px;text-align:center;padding:20px;line-height:1.5;
}

.number-label{
  font-family:var(--font-mono);font-size:22px;font-weight:600;letter-spacing:0.03em;
  color:var(--accent);border:1px solid var(--accent-dim);border-radius:var(--radius-m);
  padding:10px 16px;display:inline-block;
  background:linear-gradient(180deg, rgba(232,161,60,0.1), rgba(232,161,60,0.03));
}

.item-row{
  display:flex;align-items:center;gap:12px;padding:13px 4px;border-bottom:1px solid var(--line-soft);
  cursor:pointer;transition:background .12s ease;
}
.item-row:active{background:rgba(255,255,255,0.02);}
.item-row:last-child{border-bottom:none;}
.status-dot{width:8px;height:8px;border-radius:50%;flex:none;box-shadow:0 0 0 3px rgba(255,255,255,0.03);}
.status-dot.aktiv{background:var(--ok);}
.status-dot.reserviert{background:var(--muted);}
.status-dot.defekt{background:var(--danger);}
.status-dot.ausgemustert{background:var(--off);}
.item-row .num{font-family:var(--font-mono);font-weight:600;font-size:14.5px;letter-spacing:0.01em;}
.item-row .meta{color:var(--muted);font-size:12.5px;margin-top:2px;}
.item-row .grow{flex:1;min-width:0;}

.status-pill{
  font-size:10.5px;text-transform:uppercase;letter-spacing:0.04em;
  padding:3px 9px;border-radius:20px;border:1px solid var(--line);color:var(--muted);
}
.status-pill.aktiv{color:var(--ok);border-color:var(--ok-dim);}
.status-pill.reserviert{color:var(--muted);}
.status-pill.defekt{color:var(--danger);border-color:var(--danger-dim);}
.status-pill.ausgemustert{color:var(--off);border-color:var(--off);}

.filters{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;}
.filters select,.filters input{
  background:var(--panel-2);border:1px solid var(--line);color:var(--text);
  border-radius:var(--radius-s);padding:8px 10px;font-size:13px;
}

.empty{
  text-align:center;color:var(--muted);padding:44px 20px;font-size:14px;
}

.copy-row{
  display:flex;align-items:center;justify-content:space-between;gap:10px;
  padding:13px 4px;border-bottom:1px solid var(--line-soft);
}
.copy-row:last-child{border-bottom:none;}
.copy-row .copy-text{font-family:var(--font-mono);font-weight:600;font-size:15px;letter-spacing:0.02em;}

.toast{
  position:fixed;left:50%;bottom:92px;transform:translateX(-50%);
  background:var(--panel-raised);border:1px solid var(--line);color:var(--text);
  padding:11px 18px;border-radius:var(--radius-m);font-size:13.5px;z-index:50;
  max-width:85vw;text-align:center;box-shadow:0 12px 30px -12px rgba(0,0,0,0.6);
  animation:toast-in .2s ease;
}
@keyframes toast-in{ from{ transform:translate(-50%,8px); opacity:0; } to{ transform:translate(-50%,0); opacity:1; } }
.toast.error{border-color:var(--danger-dim);color:var(--danger);}

.progress-bar{height:6px;background:var(--panel-2);border-radius:4px;overflow:hidden;margin-top:10px;}
.progress-fill{height:100%;background:linear-gradient(90deg, var(--accent-2), var(--accent));}
.event-card{cursor:pointer;}
.badge-row{display:flex;align-items:center;gap:8px;margin:-4px 0 14px;flex-wrap:wrap;}

.patch-brand{
  text-align:center;font-family:var(--font-head);letter-spacing:0.18em;text-transform:uppercase;
  font-size:11.5px;color:var(--muted);border:1px solid var(--line);border-radius:var(--radius-s);
  padding:9px;margin-bottom:16px;background:var(--panel-2);
}
.patch-section-label{font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:10px;}
.patch-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px 8px;margin-bottom:18px;}
.patch-channel{display:flex;flex-direction:column;align-items:center;gap:6px;}
.patch-jack{
  width:32px;height:32px;border-radius:50%;flex:none;
  background:radial-gradient(circle at 35% 30%, #3c3f45, #17181b 72%);
  border:2px solid var(--line);position:relative;
}
.patch-jack::before{
  content:"";position:absolute;inset:0;
  background:
    radial-gradient(circle 2px at 50% 32%, var(--accent-dim) 99%, transparent 100%),
    radial-gradient(circle 2px at 33% 64%, var(--accent-dim) 99%, transparent 100%),
    radial-gradient(circle 2px at 67% 64%, var(--accent-dim) 99%, transparent 100%);
}
.patch-num{font-family:var(--font-mono);font-size:10px;color:var(--muted);font-weight:600;letter-spacing:0.02em;}
.patch-input{
  width:100%;background:var(--panel-2);border:1px solid var(--line);color:var(--text);
  border-radius:6px;padding:6px 3px;font-size:11px;text-align:center;
}
.patch-input:focus{outline:none;border-color:var(--accent-dim);box-shadow:0 0 0 2px var(--accent-glow);}
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

// Piepton bei erfolgreichem Scan (wie an der Supermarktkasse). Der AudioContext
// wird beim ersten Öffnen des Scanners angelegt (im Klick auf den Tab, also
// innerhalb einer Nutzer-Geste) — sonst blockt iOS Safari später gestartete Töne.
let audioCtx = null;
function unlockAudio(){
  if(!audioCtx){
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
  }
  if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
}
function playBeep(){
  if(!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1800;
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.13);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.14);
  } catch(e){}
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
  let lastCandidate = null, candidateCount = 0;

  activeScanner = {
    stop(){
      stopped = true;
      if(raf) cancelAnimationFrame(raf);
      if(stream) stream.getTracks().forEach(t => t.stop());
    }
  };

  // Mehrere Constraint-Varianten durchprobieren. 1280x720 ist ein Kompromiss:
  // genug Detail für kleine/nahe Codes, aber deutlich schneller pro Bild
  // auszuwerten als 1920x1080 (das den Scanner spürbar langsamer gemacht hat,
  // da ZXing dann mehr Pixel pro Versuch durchsuchen musste).
  async function openCameraStream(){
    const attempts = [
      { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 }, advanced: [{ focusMode: 'continuous' }] } },
      { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } },
      { video: { facingMode: 'environment' } },
    ];
    let lastErr;
    for(const c of attempts){
      try { return await navigator.mediaDevices.getUserMedia(c); }
      catch(e){ lastErr = e; }
    }
    throw lastErr;
  }

  openCameraStream()
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
            if(val){
              if(val === lastCandidate) candidateCount++;
              else { lastCandidate = val; candidateCount = 1; }
              // Erst nach zwei übereinstimmenden Lesungen in Folge übernehmen —
              // filtert einmalige Fehllesungen bei kleinen/unscharfen Codes raus.
              if(candidateCount >= 2){ playBeep(); stopScanner(); onDetect(val); return; }
            }
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

// ================= TEXTERKENNUNG (OCR) =================
// Für Labels ohne Barcode/QR, nur mit reinem Text bedruckt. Läuft NICHT
// kontinuierlich wie die Barcode-Erkennung (dafür ist OCR zu langsam/unsicher),
// sondern auf Knopfdruck: ein Foto wird aufgenommen und einmalig erkannt.
// Ergebnis landet im manuellen Eingabefeld zum Prüfen/Korrigieren, statt
// blind nachzuschlagen.
let ocrWorker = null;
async function getOcrWorker(){
  if(ocrWorker) return ocrWorker;
  ocrWorker = await Tesseract.createWorker('eng');
  await ocrWorker.setParameters({ tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-' });
  return ocrWorker;
}

// Gibt einen sauberen "PREFIX-###"-Code zurück, wenn der erkannte Text eindeutig
// danach aussieht, sonst null (dann lieber zur Korrektur ins Eingabefeld statt
// blind auf einen vermutlich falschen Code nachzuschlagen).
function cleanOcrGuess(raw){
  const s = (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const m = s.match(/^([A-Z]{2,6})(\d{1,6})$/);
  return m ? (m[1] + '-' + m[2]) : null;
}

function buildScanner(onDetect){
  unlockAudio();
  const wrap = el('<div></div>');
  const box = el('<div class="scanbox"><div class="scan-placeholder">Kamera wird gestartet …</div></div>');
  wrap.appendChild(box);

  const ocrBtn = el('<button type="button" class="btn secondary" style="margin-bottom:14px;">Foto aufnehmen &amp; Text lesen</button>');
  wrap.appendChild(ocrBtn);
  const ocrStatus = el('<p class="hint" style="display:none;">Erkenne Text …</p>');
  wrap.appendChild(ocrStatus);

  const manualWrap = el('<div class="field"><label>Nummer manuell eingeben (oder Vorschlag oben prüfen)</label><input type="text" placeholder="z. B. MIK-001" autocapitalize="characters" /></div>');
  wrap.appendChild(manualWrap);
  const goBtn = el('<button class="btn secondary">Nachschlagen</button>');
  wrap.appendChild(goBtn);
  const input = manualWrap.querySelector('input');
  goBtn.addEventListener('click', () => {
    const v = input.value.trim().toUpperCase();
    if(v){ stopScanner(); onDetect(v); }
  });
  input.addEventListener('keydown', (e) => { if(e.key === 'Enter') goBtn.click(); });

  ocrBtn.addEventListener('click', async () => {
    const video = box.querySelector('video');
    if(!video || !video.videoWidth){ toast('Kamera noch nicht bereit.', true); return; }
    ocrBtn.disabled = true;
    ocrStatus.style.display = 'block';
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const worker = await getOcrWorker();
      const { data } = await worker.recognize(canvas);
      const guess = cleanOcrGuess(data.text);
      if(guess){
        playBeep();
        toast('Erkannt: ' + guess);
        stopScanner();
        onDetect(guess);
        return;
      } else {
        const raw = (data.text || '').trim();
        if(raw) input.value = raw.toUpperCase().replace(/[^A-Z0-9-]/g, '');
        toast(raw ? 'Nicht eindeutig erkannt — bitte prüfen/korrigieren.' : 'Kein Text erkannt, bitte manuell eingeben.', true);
      }
    } catch(e){
      toast('Texterkennung fehlgeschlagen: ' + e.message, true);
    } finally {
      ocrBtn.disabled = false;
      ocrStatus.style.display = 'none';
    }
  });

  runScanner(box, onDetect);
  return wrap;
}

views.scan = async function(){
  app.innerHTML = '';
  app.appendChild(el('<h2 class="section-title">Scannen</h2>'));
  app.appendChild(el('<p class="hint">Kamera auf den Code auf dem Kabel/Gerät richten (Barcode/QR wird sofort erkannt). Bei reinem Text-Label: „Foto aufnehmen" tippen, Vorschlag prüfen. Sonst Nummer unten eintippen.</p>'));
  app.appendChild(buildScanner(lookupNumber));
};

// ================= LABELS =================
// Die App erzeugt selbst kein druckbares Bild — der Code wird als Text
// gezeigt und per Klick kopiert, zum Einfügen in die externe Label-App, die
// das eigentliche Label (inkl. eines eventuellen QR-Codes) druckt. Gescannt
// wird trotzdem per Kamera: die Bibliothek ZXing erkennt, was auch immer auf
// dem physisch aufgeklebten Label landet (QR-Code, Barcode, …).
function copyRow(text){
  const row = el('<div class="copy-row"><span class="copy-text"></span><button type="button" class="btn ghost" style="width:auto;padding:6px 12px;font-size:12.5px;">Kopieren</button></div>');
  row.querySelector('.copy-text').textContent = text;
  const btn = row.querySelector('button');
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast('Kopiert: ' + text);
    } catch(e){ toast('Kopieren nicht möglich.', true); }
  });
  return row;
}

// Beschreibung, die neben dem Code steht: bei Geräten Marke+Modell (sobald
// erfasst), bei Kabeln Kabeltyp + Länge — sonst die Kategorie-Bezeichnung,
// damit man das Teil auch ohne Scan erkennt.
function labelText(item, info){
  if(info.kind === 'kabel'){
    const c = item.cable || {};
    const parts = [info.cat.label, c.cable_type, c.length_m ? c.length_m + 'm' : null].filter(Boolean);
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
    const cableTypeField = fieldSelect('Kabeltyp', 'cable_type', c.cable_type, ['XLR-Kabel','Klinke-Kabel','Speakon-Kabel','Cinch-Kabel','Verlängerung','Sonstiges']);
    form.appendChild(cableTypeField);
    const row = el('<div class="row2"></div>');
    const connAField = fieldSelect('Stecker A', 'connector_a', c.connector_a, info.cat.connectors);
    const connBField = fieldSelect('Stecker B', 'connector_b', c.connector_b, info.cat.connectors);
    row.appendChild(connAField);
    row.appendChild(connBField);
    form.appendChild(row);
    form.appendChild(fieldNumber('Länge (m)', 'length_m', c.length_m));
    wireCableTypeAutofill(cableTypeField.querySelector('select'), connAField.querySelector('select'), connBField.querySelector('select'), info.cat.connectors);
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

  app.appendChild(el('<h3 class="section-title" style="font-size:16px;margin-top:22px;">Code</h3>'));
  const codeCard = el('<div class="card"></div>');
  codeCard.appendChild(copyRow(item.number));
  codeCard.appendChild(copyRow(labelText(item, info)));
  app.appendChild(codeCard);

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

// Kabeltyp → naheliegende Stecker A/B (z. B. "XLR-Kabel" → XLR male/female).
// Findet passende Einträge in der Steckerliste der jeweiligen Kategorie über
// ein Stichwort; bei "Verlängerung"/"Sonstiges" bleibt es leer (zu uneindeutig).
const CABLE_TYPE_CONNECTOR_KEYWORD = {
  'XLR-Kabel': 'xlr',
  'Klinke-Kabel': 'klinke',
  'Speakon-Kabel': 'speakon',
  'Cinch-Kabel': 'cinch',
};
function defaultConnectorsForCableType(cableType, connectorOptions){
  const keyword = CABLE_TYPE_CONNECTOR_KEYWORD[cableType];
  if(!keyword) return null;
  const matches = connectorOptions.filter(c => c.toLowerCase().includes(keyword));
  if(!matches.length) return null;
  const male = matches.find(c => /male/i.test(c));
  const female = matches.find(c => /female/i.test(c));
  if(male && female) return [male, female];
  return [matches[0], matches[0]];
}
// Verdrahtet die Auto-Vorbelegung: bei Kabeltyp-Wechsel Stecker A/B passend
// setzen (bleibt danach normal änderbar, für Adapterkabel mit gemischten
// Steckern an beiden Enden).
function wireCableTypeAutofill(cableTypeSelect, connAField, connBField, connectorOptions){
  cableTypeSelect.addEventListener('change', () => {
    const defaults = defaultConnectorsForCableType(cableTypeSelect.value, connectorOptions);
    if(!defaults) return;
    connAField.value = defaults[0];
    connBField.value = defaults[1];
  });
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
  app.appendChild(el('<p class="hint">Kategorie wählen, Anzahl festlegen, Nummern reservieren. Codes kopieren und in eurer Label-Drucker-App aufs Etikett setzen, aufkleben, dann über „Scannen" die Daten erfassen.</p>'));

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
  let selectedCatKey = null;

  const detailsWrap = el('<div></div>');

  function renderDetailFields(){
    detailsWrap.innerHTML = '';
    if(itemType !== 'kabel' || !selectedCatKey) return;
    const cat = cfg.cableCategories[selectedCatKey];
    const card = el('<div class="card"></div>');
    card.appendChild(el('<p class="hint" style="margin-bottom:12px;">Details gleich hier angeben (gelten für alle reservierten Nummern dieser Runde) — dann steht z. B. die Länge direkt in der kopierbaren Beschreibung.</p>'));
    card.appendChild(fieldChips('Bereich', 'bereich', cat.defaultBereich, ['licht','ton','allgemein'], cfg.bereichLabels));
    const cableTypeField = fieldSelect('Kabeltyp', 'cable_type', null, ['XLR-Kabel','Klinke-Kabel','Speakon-Kabel','Cinch-Kabel','Verlängerung','Sonstiges']);
    card.appendChild(cableTypeField);
    const row = el('<div class="row2"></div>');
    const connAField = fieldSelect('Stecker A', 'connector_a', null, cat.connectors);
    const connBField = fieldSelect('Stecker B', 'connector_b', null, cat.connectors);
    row.appendChild(connAField);
    row.appendChild(connBField);
    card.appendChild(row);
    card.appendChild(fieldNumber('Länge (m)', 'length_m', null));
    detailsWrap.appendChild(card);
    wireCableTypeAutofill(cableTypeField.querySelector('select'), connAField.querySelector('select'), connBField.querySelector('select'), cat.connectors);
  }

  function renderCatChips(){
    catWrap.innerHTML = '';
    selectedPrefix = null;
    selectedCatKey = null;
    const source = itemType === 'kabel' ? cfg.cableCategories : cfg.deviceTypes;
    Object.entries(source).forEach(([key, v], idx) => {
      const chip = el('<button type="button" class="chip">' + v.label + '</button>');
      chip.addEventListener('click', () => {
        [...catWrap.children].forEach(c=>c.classList.remove('active'));
        chip.classList.add('active');
        selectedPrefix = v.prefix;
        selectedCatKey = key;
        renderDetailFields();
      });
      catWrap.appendChild(chip);
      if(idx===0){ chip.classList.add('active'); selectedPrefix = v.prefix; selectedCatKey = key; }
    });
    renderDetailFields();
  }
  renderCatChips();
  app.appendChild(detailsWrap);

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
      let details = null;
      if(itemType === 'kabel' && detailsWrap.firstChild){
        details = collectFormValues(detailsWrap.firstChild);
        await Promise.all(res.numbers.map(num => api('/items/' + encodeURIComponent(num), { method:'PATCH', body: JSON.stringify(details) })));
      }
      renderCodeList(resultWrap, res.numbers, selectedPrefix, cfg, details);
    } catch(e){ toast(e.message, true); }
  });
};

function renderCodeList(container, numbers, prefix, cfg, details){
  const info = Object.values(cfg.cableCategories).concat(Object.values(cfg.deviceTypes)).find(v => v.prefix === prefix);
  container.innerHTML = '';
  container.appendChild(el('<h3 class="section-title" style="font-size:16px;">' + numbers.length + ' Nummer(n) reserviert' + (info ? ' — ' + esc(info.label) : '') + '</h3>'));

  if(details){
    const descParts = [info ? info.label : null, details.cable_type, details.length_m ? details.length_m + 'm' : null].filter(Boolean);
    if(descParts.length) container.appendChild(copyRow(descParts.join(' · ')));
  }

  const listCard = el('<div class="card" style="padding:4px 12px;"></div>');
  numbers.forEach(num => listCard.appendChild(copyRow(num)));
  container.appendChild(listCard);

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

  const cfg = await loadConfig();
  if(item.prefix === cfg.deviceTypes.kiste.prefix){
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
  const cfg = await loadConfig();
  app.innerHTML = '';

  const backBtn = el('<button class="btn ghost" style="margin-bottom:12px;">← Alle Events</button>');
  backBtn.addEventListener('click', () => goTo('events'));
  app.appendChild(backBtn);

  app.appendChild(el('<h2 class="section-title" style="margin-bottom:2px;">' + esc(ev.name) + '</h2>'));
  app.appendChild(el('<p class="hint">' + formatDate(ev.event_date) + (ev.location ? ' · ' + esc(ev.location) : '') + '</p>'));

  // Unter-Tabs innerhalb des Events
  const subTabs = el('<div class="chip-group" style="margin-bottom:16px;"></div>');
  const tabOverview = el('<button type="button" class="chip active">Übersicht</button>');
  const tabPatch = el('<button type="button" class="chip">Patchplan Rack</button>');
  subTabs.appendChild(tabOverview);
  subTabs.appendChild(tabPatch);
  app.appendChild(subTabs);

  const overviewSection = el('<div></div>');
  const patchSection = el('<div></div>');
  patchSection.hidden = true;
  app.appendChild(overviewSection);
  app.appendChild(patchSection);

  tabOverview.addEventListener('click', () => {
    tabOverview.classList.add('active'); tabPatch.classList.remove('active');
    overviewSection.hidden = false; patchSection.hidden = true;
  });
  tabPatch.addEventListener('click', () => {
    tabPatch.classList.add('active'); tabOverview.classList.remove('active');
    patchSection.hidden = false; overviewSection.hidden = true;
    stopScanner();
  });

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
  overviewSection.appendChild(editCard);

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

  overviewSection.appendChild(el('<h3 class="section-title" style="font-size:16px;margin-top:22px;">Packliste (' + ev.progress.packed + '/' + ev.progress.total + ')</h3>'));

  const addRow = el('<div class="btn-row" style="margin-bottom:14px;"></div>');
  const addInput = el('<input type="text" placeholder="Nummer, z. B. KIS-001" autocapitalize="characters" style="flex:1;background:var(--panel-2);border:1px solid var(--line);color:var(--text);border-radius:8px;padding:11px 12px;font-size:15px;">');
  const addPBtn = el('<button class="btn" style="width:auto;">+</button>');
  addRow.appendChild(addInput); addRow.appendChild(addPBtn);
  overviewSection.appendChild(addRow);
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
    const isKiste = it.prefix === cfg.deviceTypes.kiste.prefix;
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
  overviewSection.appendChild(listWrap);

  overviewSection.appendChild(el('<h3 class="section-title" style="font-size:16px;margin-top:22px;">Zum Abhaken scannen</h3>'));
  const scanWrap = el('<div></div>');
  scanWrap.appendChild(buildScanner((number) => handleEventScan(ev.id, number)));
  overviewSection.appendChild(scanWrap);

  // ---- Patchplan Rack (Inhalt folgt) ----
  renderPatchplan(patchSection, ev.id);
};

// ================= PATCHPLAN (Behringer S16 Stagebox) =================
async function renderPatchplan(container, eventId){
  container.innerHTML = '<div class="empty">Lädt …</div>';
  let data;
  try { data = await api('/events/' + eventId + '/patch'); }
  catch(e){
    container.innerHTML = '';
    container.appendChild(el('<div class="empty">Patchplan ist noch nicht eingerichtet.<br/>(' + esc(e.message) + ')</div>'));
    return;
  }

  container.innerHTML = '';
  const panel = el('<div class="card"></div>');
  panel.appendChild(el('<div class="patch-brand">Stagebox · Behringer S16</div>'));

  panel.appendChild(el('<div class="patch-section-label">Inputs (Mikrofone/Instrumente)</div>'));
  const inGrid = el('<div class="patch-grid"></div>');
  data.ins.forEach(ch => inGrid.appendChild(patchChannelField('in', ch, eventId)));
  panel.appendChild(inGrid);

  panel.appendChild(el('<div class="patch-section-label">Outputs (Monitore/IEM/…)</div>'));
  const outGrid = el('<div class="patch-grid"></div>');
  data.outs.forEach(ch => outGrid.appendChild(patchChannelField('out', ch, eventId)));
  panel.appendChild(outGrid);

  container.appendChild(panel);
  container.appendChild(el('<p class="hint">Tippen, Gerät/Instrument eintragen, Feld verlassen zum Speichern.</p>'));
}

function patchChannelField(io, ch, eventId){
  const cell = el('<div class="patch-channel"><div class="patch-jack"></div><div class="patch-num">' + (io === 'in' ? 'IN' : 'OUT') + ' ' + ch.channel + '</div></div>');
  const input = el('<input type="text" class="patch-input" placeholder="—">');
  input.value = ch.label || '';
  cell.appendChild(input);
  let lastSaved = input.value;
  input.addEventListener('change', async () => {
    const val = input.value.trim();
    if(val === lastSaved) return;
    try {
      await api('/events/' + eventId + '/patch', { method:'PATCH', body: JSON.stringify({ io, channel: ch.channel, label: val }) });
      lastSaved = val;
      toast((io === 'in' ? 'IN ' : 'OUT ') + ch.channel + ' gespeichert.');
    } catch(e){ toast(e.message, true); input.value = lastSaved; }
  });
  return cell;
}

// ---------- Start ----------
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').catch(()=>{});
}
if(navigator.onLine === false){ onlineBadge.textContent = 'offline'; } else { onlineBadge.textContent = 'bereit'; onlineBadge.classList.add('live'); }
window.addEventListener('online', ()=>{ onlineBadge.textContent='bereit'; onlineBadge.classList.add('live'); });
window.addEventListener('offline', ()=>{ onlineBadge.textContent='offline'; onlineBadge.classList.remove('live'); });

goTo('scan');
`;
