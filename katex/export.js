// export.js — export subsystem extracted verbatim from katex.html (Phase 5).
// Classic script loaded after templates.js and before the app script. Contains
// share-link (encode + on-load #share decode), Copy LaTeX, PNG/JPG image export,
// Copy-Image-to-clipboard, and PDF export (jsPDF lazy loader). Two runtime
// dependencies stay in the app script: loadH2C() (html2canvas loader, shared with
// Paper export) and applyShortcuts() — both resolved on button click. Unchanged.

// ── Share link ────────────────────────────────────────────────────────────────
document.getElementById('latexShareBtn').addEventListener('click', async () => {
  const btn = document.getElementById('latexShareBtn');
  const src = document.getElementById('latexInput').value;
  if (!src.trim()) { btn.textContent = 'Nothing to share'; setTimeout(() => { btn.innerHTML = '&#128279; Share'; }, 1500); return; }
  const encoded = btoa(unescape(encodeURIComponent(src)));
  const url = location.origin + location.pathname + '#share=' + encoded;
  const orig = btn.innerHTML;
  try {
    await navigator.clipboard.writeText(url);
    btn.textContent = '✓ Link copied!';
  } catch {
    prompt('Copy this link:', url);
    btn.textContent = '✓ Done';
  }
  setTimeout(() => { btn.innerHTML = orig; }, 2000);
});

// On load: restore from share hash
(function () {
  const hash = location.hash;
  if (hash.startsWith('#share=')) {
    try {
      const src = decodeURIComponent(escape(atob(hash.slice(7))));
      const ta = document.getElementById('latexInput');
      if (ta) { ta.value = src; }
      // Clear hash so it doesn't persist on reload
      history.replaceState(null, '', location.pathname);
    } catch(e) {}
  }
})();

// ── LaTeX tab: copy source + save output as image ─────────────────────────────
document.getElementById('latexCopyBtn').addEventListener('click', async () => {
  const btn = document.getElementById('latexCopyBtn');
  const src = applyShortcuts(document.getElementById('latexInput').value);
  if (!src.trim()) return;
  try {
    await navigator.clipboard.writeText(src);
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = orig; }, 1500);
  } catch {
    prompt('Copy this LaTeX:', src);
  }
});

async function downloadLatexOutput(fmt) {
  const btn = document.getElementById(fmt === 'png' ? 'latexDlPng' : 'latexDlJpg');
  const orig = btn.textContent;
  btn.textContent = 'Loading…'; btn.disabled = true;
  try {
    const h2c = await loadH2C();
    const output = document.getElementById('output');
    const canvas = await h2c(output, {
      scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false,
    });
    const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/png';
    const url  = canvas.toDataURL(mime, 0.95);
    const a    = document.createElement('a');
    a.href = url; a.download = 'latex.' + fmt; a.click();
  } catch(err) {
    alert(err.message);
  } finally {
    btn.textContent = orig; btn.disabled = false;
  }
}

document.getElementById('latexDlPng').addEventListener('click', () => downloadLatexOutput('png'));
document.getElementById('latexDlJpg').addEventListener('click', () => downloadLatexOutput('jpg'));

// ── Copy output as image to clipboard ────────────────────────────────────────
document.getElementById('latexCopyImg').addEventListener('click', async () => {
  const btn = document.getElementById('latexCopyImg');
  const orig = btn.textContent;
  btn.textContent = 'Copying…'; btn.disabled = true;
  try {
    const h2c = await loadH2C();
    const canvas = await h2c(document.getElementById('output'), {
      scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false,
    });
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1800);
  } catch(err) {
    // Fallback: trigger download instead
    try {
      const h2c = await loadH2C();
      const canvas = await h2c(document.getElementById('output'), {
        scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false,
      });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'latex.png'; a.click();
    } catch(_) { alert('Copy failed — try PNG instead.'); }
    btn.textContent = orig; btn.disabled = false;
  }
});

// ── PDF export ────────────────────────────────────────────────────────────────
let _jspdf = null;
function loadJsPDF() {
  if (_jspdf) return _jspdf;
  _jspdf = new Promise((res, rej) => {
    if (window.jspdf) { res(window.jspdf.jsPDF); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = () => res(window.jspdf.jsPDF);
    s.onerror = () => rej(new Error('jsPDF failed to load'));
    document.head.appendChild(s);
  });
  return _jspdf;
}

document.getElementById('latexDlPdf').addEventListener('click', async () => {
  const btn = document.getElementById('latexDlPdf');
  const orig = btn.textContent;
  btn.textContent = 'Loading…'; btn.disabled = true;
  try {
    const [h2c, jsPDF] = await Promise.all([loadH2C(), loadJsPDF()]);
    const canvas = await h2c(document.getElementById('output'), {
      scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false,
    });
    const imgData = canvas.toDataURL('image/png');
    const pw = canvas.width / 2;
    const ph = canvas.height / 2;
    const pdf = new jsPDF({
      orientation: pw >= ph ? 'landscape' : 'portrait',
      unit: 'px',
      format: [pw, ph],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, pw, ph);
    pdf.save('latex.pdf');
  } catch(err) {
    alert(err.message);
  } finally {
    btn.textContent = orig; btn.disabled = false;
  }
});

