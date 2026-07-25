// paper.js — Paper (block document) subsystem extracted verbatim from katex.html (Phase 10).
// Three source regions joined as one cohesive unit: (A) panel — paperBlocks/PB_LABELS
// state, pb* render helpers, buildPaperDoc, addPaperBlock, insertIntoPaperBlock, add/type
// bindings; (B/C) click-outside + preview/edit toggle; (D) downloadPaper (PNG/JPG) + its
// bindings. Classic script loaded after animation.js and before the app script.
// Shared utilities stay in the app script and resolve at runtime:
//   renderer.render (LaTeX in blocks), global render(), loadH2C (html2canvas loader,
//   shared with export.js). Inbound: sidebar -> insertIntoPaperBlock. Self-contained state.

// ── Paper panel ───────────────────────────────────────────────────────────────
let paperBlocks      = [];
let paperBlockId     = 0;
let activePBId       = null;
let paperPreviewMode = false;

const PB_LABELS = {
  title: 'Title', author: 'Author', abstract: 'Abstract',
  section: 'Section', subsection: 'Subsection',
  theorem: 'Theorem', definition: 'Definition', lemma: 'Lemma',
  proof: 'Proof', corollary: 'Corollary', proposition: 'Proposition',
  remark: 'Remark', example: 'Example', equation: 'Equation', text: 'Text'
};

// A line is "text-like" if it contains plain English words (3+ letter tokens not starting with \)
function pbHasPlainText(line) {
  const stripped = line.replace(/\$[^$]+\$/g, '');
  // split on whitespace + braces, look for standalone alphabetic words with no backslash
  return stripped.split(/[\s\{\}\(\)\[\]]+/).some(t => /^[A-Za-z]{3,}$/.test(t));
}

// Render a line as mixed text + inline $math$, or display mode if no plain English
function pbRenderMixedLine(line) {
  // $$...$$ → display math
  if (/^\$\$.+\$\$$/.test(line.trim())) {
    const math = line.trim().slice(2, -2);
    return renderer.render(math, { throwOnError: false, displayMode: true, strict: false });
  }
  // No $...$ and no plain words → pure LaTeX, render display
  const hasDollar = line.includes('$');
  if (!hasDollar && !pbHasPlainText(line) && line.includes('\\')) {
    return renderer.render(line.trim(), { throwOnError: false, displayMode: true, strict: false });
  }
  // Mixed: split on $...$ inline math
  const parts = line.split(/(\$[^$]+\$)/g);
  return parts.map(part => {
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      return renderer.render(part.slice(1,-1), { throwOnError: false, displayMode: false, strict: false });
    }
    return part.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }).join('');
}

// Render block content: equation blocks use pure display math; all others use smart mixed mode
function pbRenderContent(content, displayMode) {
  if (!content.trim()) return '';
  let out = '';
  const lines = content.split('\n');
  lines.forEach(line => {
    if (!line.trim()) { out += '<div style="height:6px"></div>'; return; }
    if (displayMode) {
      out += renderer.render(line, { throwOnError: false, displayMode: true, strict: false });
    } else {
      out += '<div style="line-height:1.8">' + pbRenderMixedLine(line) + '</div>';
    }
  });
  return out;
}

function pbRenderBlock(b, isFocused) {
  const PB_COLORS = {
    abstract:'#8b5cf6', section:'#3b6ef5', subsection:'#93c5fd',
    theorem:'#3b6ef5',  definition:'#f97316', lemma:'#0891b2',
    proof:'#16a34a',    corollary:'#7c3aed',  proposition:'#db2777',
    remark:'#b45309',   example:'#059669',    equation:'#4f46e5',
  };
  const PB_EMOJIS = {
    title:'📄', author:'✍️', abstract:'📋',
    section:'§', subsection:'¶',
    theorem:'🔷', definition:'📖', lemma:'💡',
    proof:'✅', corollary:'🔵', proposition:'📐',
    remark:'💬', example:'🔍', equation:'∑', text:'📝'
  };

  const el = document.createElement('div');
  const accentClass = PB_COLORS[b.type] ? ` pb-accent-${b.type}` : '';
  el.className = 'paper-block' + accentClass + (isFocused ? ' pb-focused' : '');
  el.dataset.pbid = b.id;

  // Action buttons
  const actions = document.createElement('div');
  actions.className = 'paper-block-actions';
  actions.innerHTML =
    '<button class="pb-action-btn move" data-action="up" title="Move up">↑</button>' +
    '<button class="pb-action-btn move" data-action="down" title="Move down">↓</button>' +
    '<button class="pb-action-btn" data-action="del" title="Delete">✕</button>';
  el.appendChild(actions);

  // Type badge (skip for title/author/text/section/subsection)
  const showBadge = PB_COLORS[b.type] && !['section','subsection'].includes(b.type);
  if (showBadge) {
    const badge = document.createElement('div');
    badge.className = 'pb-type-badge';
    badge.style.background = PB_COLORS[b.type];
    badge.innerHTML = (PB_EMOJIS[b.type] || '') + ' ' + (PB_LABELS[b.type] || b.type).toUpperCase();
    el.appendChild(badge);
  }

  // Rendered content
  const rendered = document.createElement('div');
  rendered.className = 'pb-rendered';

  switch (b.type) {
    case 'title':
      rendered.innerHTML = `<div class="pb-title-render">${b.content || '<span style="color:#d1d5db">Paper Title</span>'}</div>`;
      break;
    case 'author':
      rendered.innerHTML = `<div class="pb-author-render">${b.content || '<span style="color:#d1d5db">Author name(s)</span>'}</div>`;
      break;
    case 'abstract':
      rendered.innerHTML = `<div class="pb-abstract-wrap"><div class="pb-abstract-heading">Abstract</div><div class="pb-abstract-body">${pbRenderContent(b.content, false) || '<span style="color:#d1d5db">Abstract text…</span>'}</div></div><hr class="pb-divider">`;
      break;
    case 'section': {
      const nums = paperBlocks.filter(x => x.type==='section').indexOf(b) + 1;
      rendered.innerHTML = `<div class="pb-section-num"><span style="color:#3b6ef5">${nums}.</span> ${b.title || '<span style="color:#d1d5db">Section Title</span>'}</div>`;
      break;
    }
    case 'subsection': {
      const secIdx = (() => { let s=0; for(const x of paperBlocks){if(x===b)break; if(x.type==='section')s++;} return s; })();
      const subIdx = (() => { let s=0,inSec=false; for(const x of paperBlocks){if(x.type==='section'){inSec=true;s=0;}if(inSec&&x.type==='subsection'){s++;if(x===b)break;}} return s; })();
      rendered.innerHTML = `<div class="pb-subsec-num"><span style="color:#93c5fd">${secIdx}.${subIdx}</span> ${b.title || '<span style="color:#d1d5db">Subsection Title</span>'}</div>`;
      break;
    }
    case 'proof': {
      const body = pbRenderContent(b.content, false);
      rendered.innerHTML = `<span class="pb-proof-label">Proof.</span>${body ? '<div class="pb-env-content normal-style">' + body + '</div>' : ''}<div class="pb-proof-end" style="color:#16a34a">&#9632;</div>`;
      break;
    }
    case 'remark':
    case 'text': {
      rendered.innerHTML = `<div class="pb-text-body">${pbRenderContent(b.content, false) || '<span style="color:#d1d5db">Text content…</span>'}</div>`;
      break;
    }
    case 'equation': {
      const n = paperBlocks.filter(x=>x.type==='equation').indexOf(b)+1;
      const eqHtml = b.content ? pbRenderContent(b.content, true) : '<span style="color:#d1d5db">equation…</span>';
      rendered.innerHTML = `<div class="pb-eq-wrap"><div class="pb-eq-content">${eqHtml}</div><div class="pb-eq-num" style="color:#4f46e5">(${n})</div></div>`;
      break;
    }
    default: {
      const n = paperBlocks.filter(x=>x.type===b.type).indexOf(b)+1;
      const colorClass = `color-${b.type}`;
      const lbl = `${PB_LABELS[b.type] || b.type} ${n}${b.title ? ' (' + b.title + ')' : ''}.`;
      const body = pbRenderContent(b.content, false);
      rendered.innerHTML = `<span class="pb-env-label ${colorClass}">${lbl}</span>${body ? '<div class="pb-env-content">' + body + '</div>' : '<div style="color:#d1d5db;font-style:italic;font-size:13px;padding-left:16px">Content…</div>'}`;
      break;
    }
  }

  el.appendChild(rendered);

  // Editor (shown when focused and not in preview mode)
  if (isFocused && !paperPreviewMode) {
    const edRow = document.createElement('div');
    edRow.className = 'pb-editor-row';

    if (['section','subsection','theorem','definition','lemma','corollary','proposition','example'].includes(b.type)) {
      const ti = document.createElement('input');
      ti.className = 'pb-title-input'; ti.type = 'text';
      ti.placeholder = 'Optional title / label…';
      ti.value = b.title || '';
      ti.addEventListener('input', () => { b.title = ti.value; refreshPaperBlock(b.id); });
      ti.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); activePBId = null; buildPaperDoc(); }
        if (e.key === 'Escape') { activePBId = null; buildPaperDoc(); }
      });
      edRow.appendChild(ti);
    }

    if (!['section','subsection'].includes(b.type)) {
      const ta = document.createElement('textarea');
      ta.className = 'pb-editor-input';
      ta.spellcheck = false;
      ta.placeholder = b.type === 'equation'  ? 'LaTeX equation body…' :
                       b.type === 'title'     ? 'Paper title…' :
                       b.type === 'author'    ? 'Author name(s)…' :
                       b.type === 'abstract'  ? 'Abstract text (LaTeX ok)…' :
                                                'LaTeX content…';
      ta.value = b.content || '';
      ta.addEventListener('input', () => { b.content = ta.value; refreshPaperBlock(b.id); });
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { activePBId = null; buildPaperDoc(); }
      });
      ta.dataset.paperta = b.id;
      edRow.appendChild(ta);
    }

    el.appendChild(edRow);
  }

  if (!paperPreviewMode) {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.pb-action-btn')) return;
      e.stopPropagation();
      if (activePBId === b.id) return; // already active, don't rebuild and kill focus
      activePBId = b.id;
      buildPaperDoc();
    });
  }

  actions.querySelectorAll('.pb-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const idx = paperBlocks.findIndex(x => x.id === b.id);
      if (action === 'del') {
        paperBlocks.splice(idx, 1);
        if (activePBId === b.id) activePBId = null;
        buildPaperDoc();
      } else if (action === 'up' && idx > 0) {
        [paperBlocks[idx-1], paperBlocks[idx]] = [paperBlocks[idx], paperBlocks[idx-1]];
        buildPaperDoc();
      } else if (action === 'down' && idx < paperBlocks.length-1) {
        [paperBlocks[idx], paperBlocks[idx+1]] = [paperBlocks[idx+1], paperBlocks[idx]];
        buildPaperDoc();
      }
    });
  });

  return el;
}

function refreshPaperBlock(id) {
  const blockEl = document.querySelector(`.paper-block[data-pbid="${id}"]`);
  if (!blockEl) return;
  const b = paperBlocks.find(x => x.id === id);
  const renderedEl = blockEl.querySelector('.pb-rendered');
  if (!renderedEl) return;
  const tmpBlock = pbRenderBlock(b, activePBId === id);
  const newRendered = tmpBlock.querySelector('.pb-rendered');
  if (newRendered) renderedEl.replaceWith(newRendered);
}

function buildPaperDoc() {
  const doc = document.getElementById('paperDoc');
  doc.classList.toggle('preview-mode', paperPreviewMode);
  if (paperBlocks.length === 0) {
    doc.innerHTML = '';
    const phEl = document.createElement('div');
    phEl.id = 'paperPlaceholder';
    phEl.className = 'paper-welcome';
    phEl.innerHTML = '<div class="paper-welcome-emoji">📄</div><div class="paper-welcome-title">Start your paper</div><div class="paper-welcome-sub">Add blocks to build a beautifully formatted academic document — theorems, proofs, definitions, and more.</div><div class="paper-welcome-hint"><div class="paper-welcome-hint-item">🔷 <span>Coloured blocks for theorems, lemmas, definitions</span></div><div class="paper-welcome-hint-item">∑ <span>Numbered equations with KaTeX math</span></div><div class="paper-welcome-hint-item">✅ <span>Proofs with automatic ■ end marker</span></div></div>';
    doc.appendChild(phEl);
    return;
  }
  doc.innerHTML = '';
  paperBlocks.forEach(b => doc.appendChild(pbRenderBlock(b, activePBId === b.id)));
  if (activePBId) {
    const el = doc.querySelector(`.paper-block[data-pbid="${activePBId}"]`);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function addPaperBlock(type) {
  const b = { id: ++paperBlockId, type, content: '', title: '' };
  paperBlocks.push(b);
  activePBId = b.id;
  buildPaperDoc();
  document.getElementById('paperTypePicker').style.display = 'none';
  // focus the textarea in the new block
  setTimeout(() => {
    const ta = document.querySelector(`textarea[data-paperta="${b.id}"]`);
    if (ta) ta.focus();
  }, 50);
}

document.getElementById('paperAddBtn').addEventListener('click', () => {
  const picker = document.getElementById('paperTypePicker');
  picker.style.display = picker.style.display === 'none' ? 'flex' : 'none';
});

document.getElementById('paperTypePicker').querySelectorAll('[data-ptype]').forEach(btn => {
  btn.addEventListener('click', () => addPaperBlock(btn.dataset.ptype));
});

// Insert symbol into active paper block textarea
function insertIntoPaperBlock(cmd) {
  const ta = document.querySelector(`textarea[data-paperta="${activePBId}"]`);
  if (!ta) return;
  const start = ta.selectionStart, end = ta.selectionEnd;
  ta.value = ta.value.slice(0, start) + cmd + ta.value.slice(end);
  const braceIdx = cmd.indexOf('{}');
  const pos = braceIdx !== -1 ? start + braceIdx + 1 : start + cmd.length;
  ta.setSelectionRange(pos, pos);
  ta.focus();
  const b = paperBlocks.find(x => x.id === activePBId);
  if (b) { b.content = ta.value; refreshPaperBlock(activePBId); }
}


// ── Paper: click outside block to close editor ────────────────────────────────
document.getElementById('paperDocArea').addEventListener('click', () => {
  if (!paperPreviewMode && activePBId !== null) {
    activePBId = null;
    buildPaperDoc();
  }
});

// ── Paper: preview / edit mode toggle ────────────────────────────────────────
document.getElementById('paperModeEdit').addEventListener('click', () => {
  paperPreviewMode = false;
  document.getElementById('paperModeEdit').classList.add('active');
  document.getElementById('paperModePreview').classList.remove('active');
  document.getElementById('paperDlPng').style.display = 'none';
  document.getElementById('paperDlJpg').style.display = 'none';
  document.getElementById('paper-controls-bar-inner') && (document.getElementById('paper-controls-bar-inner').style.display = '');
  buildPaperDoc();
});

document.getElementById('paperModePreview').addEventListener('click', () => {
  paperPreviewMode = true;
  activePBId = null;
  document.getElementById('paperModePreview').classList.add('active');
  document.getElementById('paperModeEdit').classList.remove('active');
  document.getElementById('paperDlPng').style.display = '';
  document.getElementById('paperDlJpg').style.display = '';
  buildPaperDoc();
});


async function downloadPaper(fmt) {
  const btn = document.getElementById(fmt === 'png' ? 'paperDlPng' : 'paperDlJpg');
  const orig = btn.textContent;
  btn.textContent = 'Loading…';
  btn.disabled = true;
  try {
    const h2c = await loadH2C();
    const paperDoc = document.getElementById('paperDoc');
    const wasPreview = paperPreviewMode;
    paperPreviewMode = true; activePBId = null; buildPaperDoc();
    const canvas = await h2c(paperDoc, {
      scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false,
    });
    paperPreviewMode = wasPreview; buildPaperDoc();
    const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/png';
    const url  = canvas.toDataURL(mime, 0.95);
    const a    = document.createElement('a');
    a.href = url; a.download = 'paper.' + fmt; a.click();
  } catch(err) {
    alert(err.message);
  } finally {
    btn.textContent = orig; btn.disabled = false;
  }
}

document.getElementById('paperDlPng').addEventListener('click', () => downloadPaper('png'));
document.getElementById('paperDlJpg').addEventListener('click', () => downloadPaper('jpg'));

