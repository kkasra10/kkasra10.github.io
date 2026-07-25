// shortcuts.js — custom-shortcut subsystem extracted verbatim from katex.html (Phase 7).
// Data + logic + editor UI + import/export, moved as one cohesive unit. Classic
// script loaded after i18n.js and before the app script. Runtime cross-references
// stay resolvable in the shared global scope:
//   outbound (this -> others): render (app), autoSaveInput + loadSettings (settings.js)
//   inbound  (others -> this): render()->applyShortcuts, init->buildShortcutsPanel,
//     export.js->applyShortcuts, settings.js->syncShortcutPersistence (typeof-guarded)
// All are function-body/event-handler calls (never parse-time). Behaviour unchanged.

// ── Custom shortcuts (user-defined trigger → LaTeX expansion) ──────────────────
const SHORTCUTS_KEY = 'lx_shortcuts';
let scCache = null;   // in-memory working set for the session

function autoSaveOn() { return !!loadSettings().autoSave; }

function getShortcuts() {
  if (scCache) return scCache;
  // Only remember across sessions when Auto-save is on (same rule as the input).
  if (autoSaveOn()) {
    try { const v = JSON.parse(localStorage.getItem(SHORTCUTS_KEY) || '[]'); scCache = Array.isArray(v) ? v : []; }
    catch { scCache = []; }
  } else {
    localStorage.removeItem(SHORTCUTS_KEY);
    scCache = [];
  }
  return scCache;
}
function saveShortcuts(list) {
  scCache = list;
  if (autoSaveOn()) localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(list));
  else localStorage.removeItem(SHORTCUTS_KEY);
}
// Called when the Auto-save toggle flips: start (or stop) remembering shortcuts.
function syncShortcutPersistence() {
  if (autoSaveOn()) localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(getShortcuts()));
  else localStorage.removeItem(SHORTCUTS_KEY);
}
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Non-destructive expansion: replace every trigger in one simultaneous pass
// (longer triggers first) so replacements never cascade into one another.
function applyShortcuts(src) {
  const list = getShortcuts();
  if (!list.length) return src;
  const sorted = [...list].sort((a, b) => b.trigger.length - a.trigger.length);
  const map = {};
  sorted.forEach(s => { map[s.trigger] = s.replacement; });
  const re = new RegExp(sorted.map(s => escapeRegex(s.trigger)).join('|'), 'g');
  return src.replace(re, m => (m in map ? map[m] : m));
}

function scRerender() { render(); autoSaveInput(document.getElementById('latexInput').value); }

function showScErr(msg, color) {
  const e = document.getElementById('scErr');
  if (!e) return;
  e.style.color = color || '';
  e.textContent = msg;
  if (msg) setTimeout(() => { if (e.textContent === msg) { e.textContent = ''; e.style.color = ''; } }, 2500);
}

function renderShortcutList() {
  const listEl = document.getElementById('scList');
  if (!listEl) return;
  const list = getShortcuts();
  listEl.innerHTML = '';
  if (!list.length) { listEl.innerHTML = '<div class="sc-empty">No shortcuts yet. Add one above.</div>'; return; }
  list.forEach((s, idx) => {
    const row = document.createElement('div'); row.className = 'sc-item';
    const trig = document.createElement('input');
    trig.className = 'sc-input sc-edit-trig'; trig.value = s.trigger; trig.spellcheck = false;
    trig.autocomplete = 'off'; trig.title = 'Trigger — edit and press Enter';
    const repl = document.createElement('input');
    repl.className = 'sc-input sc-edit-repl'; repl.value = s.replacement; repl.spellcheck = false;
    repl.autocomplete = 'off'; repl.title = s.replacement;
    const del = document.createElement('button'); del.className = 'sc-del'; del.textContent = '×'; del.title = 'Delete';

    // Edit the trigger in place (reject empty / duplicate of another row).
    const commitTrig = () => {
      const cur = getShortcuts(); const v = trig.value.trim();
      if (!v) { trig.value = cur[idx].trigger; return; }
      if (v !== cur[idx].trigger && cur.some((x, i) => i !== idx && x.trigger === v)) {
        showScErr('“' + v + '” already exists.'); trig.value = cur[idx].trigger; return;
      }
      if (v !== cur[idx].trigger) { cur[idx].trigger = v; saveShortcuts(cur); scRerender(); }
    };
    // Edit the replacement LaTeX in place.
    const commitRepl = () => {
      const cur = getShortcuts(); const v = repl.value;
      if (!v.trim()) { repl.value = cur[idx].replacement; return; }
      if (v !== cur[idx].replacement) { cur[idx].replacement = v; repl.title = v; saveShortcuts(cur); scRerender(); }
    };
    trig.addEventListener('blur', commitTrig);
    trig.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); trig.blur(); } });
    repl.addEventListener('blur', commitRepl);
    repl.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); repl.blur(); } });
    del.addEventListener('click', () => { const cur = getShortcuts(); cur.splice(idx, 1); saveShortcuts(cur); renderShortcutList(); scRerender(); });

    row.append(trig, repl, del);
    listEl.appendChild(row);
  });
}

function addShortcutFromInputs() {
  const trigEl = document.getElementById('scTrig');
  const replEl = document.getElementById('scRepl');
  const errEl  = document.getElementById('scErr');
  errEl.style.color = ''; errEl.textContent = '';
  const trigger = trigEl.value.trim();
  const replacement = replEl.value;
  if (!trigger) { errEl.textContent = 'Enter a trigger.'; return; }
  if (!replacement.trim()) { errEl.textContent = 'Enter a replacement.'; return; }
  const list = getShortcuts();
  if (list.some(x => x.trigger === trigger)) { errEl.textContent = 'That trigger already exists.'; return; }
  list.push({ trigger, replacement });
  saveShortcuts(list);
  trigEl.value = ''; replEl.value = '';
  renderShortcutList(); scRerender(); trigEl.focus();
}

function exportShortcuts() {
  const data = JSON.stringify({ version: 1, shortcuts: getShortcuts() }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'latex-shortcuts.json'; a.click();
  URL.revokeObjectURL(a.href);
}

function importShortcuts(file) {
  const errEl = document.getElementById('scErr');
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const incoming = Array.isArray(parsed) ? parsed : (parsed && parsed.shortcuts);
      if (!Array.isArray(incoming)) throw new Error('bad format');
      const list = getShortcuts();
      let added = 0, skipped = 0;
      incoming.forEach(item => {
        if (!item || typeof item.trigger !== 'string' || typeof item.replacement !== 'string') return;
        const trigger = item.trigger.trim();
        if (!trigger || !item.replacement.trim()) return;
        if (list.some(x => x.trigger === trigger)) { skipped++; return; }
        list.push({ trigger, replacement: item.replacement }); added++;
      });
      saveShortcuts(list); renderShortcutList(); scRerender();
      errEl.style.color = '#059669';
      errEl.textContent = 'Imported ' + added + (skipped ? ', skipped ' + skipped + ' duplicate(s)' : '') + '.';
      setTimeout(() => { errEl.textContent = ''; errEl.style.color = ''; }, 2500);
    } catch { errEl.style.color = ''; errEl.textContent = 'Invalid JSON file.'; }
  };
  reader.readAsText(file);
}

function buildShortcutsPanel() {
  const panel = document.getElementById('shortcutsPanel');
  if (!panel) return;
  panel.innerHTML =
    '<div class="sc-title">Custom Shortcuts</div>' +
    '<div class="sc-hint">Type a trigger in the editor and it renders as your LaTeX — live, and it never rewrites your text. Use a distinctive trigger like <b>;int</b> or <b>@sum</b> so it doesn’t clash with normal typing.</div>' +
    '<div class="sc-addrow">' +
      '<input class="sc-input" id="scTrig" placeholder="trigger  e.g. ;int" autocomplete="off" spellcheck="false">' +
      '<input class="sc-input" id="scRepl" placeholder="LaTeX  e.g. \\int_0^\\infty" autocomplete="off" spellcheck="false">' +
      '<button class="sc-add-btn" id="scAdd">Add</button>' +
    '</div>' +
    '<div class="sc-err" id="scErr"></div>' +
    '<div class="sc-list" id="scList"></div>' +
    '<div class="sc-io">' +
      '<button class="sc-io-btn" id="scExport">↓ Export JSON</button>' +
      '<button class="sc-io-btn" id="scImport">↑ Import JSON</button>' +
      '<input type="file" id="scFile" accept="application/json,.json" style="display:none">' +
    '</div>';
  document.getElementById('scAdd').addEventListener('click', addShortcutFromInputs);
  document.getElementById('scTrig').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('scRepl').focus(); });
  document.getElementById('scRepl').addEventListener('keydown', e => { if (e.key === 'Enter') addShortcutFromInputs(); });
  document.getElementById('scExport').addEventListener('click', exportShortcuts);
  document.getElementById('scImport').addEventListener('click', () => document.getElementById('scFile').click());
  document.getElementById('scFile').addEventListener('change', e => { if (e.target.files[0]) importShortcuts(e.target.files[0]); e.target.value = ''; });
  renderShortcutList();
}

document.getElementById('shortcutsBtn').addEventListener('click', function(e) {
  e.stopPropagation();
  document.getElementById('shortcutsPanel').classList.toggle('hidden');
});
document.addEventListener('click', function(e) {
  const panel = document.getElementById('shortcutsPanel');
  if (!panel.classList.contains('hidden') && !panel.contains(e.target) && e.target.id !== 'shortcutsBtn' && !panel.contains(e.target)) {
    panel.classList.add('hidden');
  }
});

