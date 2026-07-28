// autocompleteUI.js — read-only completion popup.
//
// Wires the existing pieces together for DISPLAY ONLY:
//     #latexInput  →  ContextEngine  →  AutocompleteEngine.complete  →  popup
// It shows ranked results near the caret. It does NOT accept completions, insert
// text, move the caret, change history, or alter the renderer. Enter/Tab are
// deliberately left untouched for the future acceptance phase.
//
// It adds its own listeners; it never modifies existing ones. No external libs.
// Introduces no new global (self-contained IIFE).

(function () {
  if (typeof ContextEngine === 'undefined' || typeof AutocompleteEngine === 'undefined') return;

  var MAX_ROWS = 50;

  var ta = null;         // the textarea
  var popup = null;      // popup container (created lazily)
  var rowsEl = null;
  var results = [];      // current CompletionItems (kept for later phases)
  var active = -1;       // highlighted index
  var visible = false;

  // ── caret pixel coordinates via the mirror-div technique ────────────────────
  var MIRROR_PROPS = [
    'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize',
    'fontSizeAdjust', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform',
    'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing', 'tabSize',
  ];

  function caretCoords(el, position) {
    var computed = window.getComputedStyle(el);
    var div = document.createElement('div');
    var s = div.style;
    s.position = 'absolute';
    s.visibility = 'hidden';
    s.whiteSpace = 'pre-wrap';
    s.wordWrap = 'break-word';
    s.overflow = 'hidden';
    for (var i = 0; i < MIRROR_PROPS.length; i++) {
      s[MIRROR_PROPS[i]] = computed[MIRROR_PROPS[i]];
    }
    div.textContent = el.value.substring(0, position);
    var span = document.createElement('span');
    span.textContent = el.value.substring(position) || '.';
    div.appendChild(span);
    document.body.appendChild(div);
    var top = span.offsetTop, left = span.offsetLeft;
    document.body.removeChild(div);
    return { top: top, left: left, height: parseFloat(computed.lineHeight) || 18 };
  }

  // ── popup element ───────────────────────────────────────────────────────────
  function ensurePopup() {
    if (popup) return;
    popup = document.createElement('div');
    popup.className = 'ac-popup';
    popup.setAttribute('role', 'listbox');
    rowsEl = document.createElement('div');
    popup.appendChild(rowsEl);
    // Keep textarea focus: never let a click on the popup blur the editor.
    popup.addEventListener('mousedown', function (e) { e.preventDefault(); });
    document.body.appendChild(popup);
  }

  function hide() {
    if (!visible) return;
    visible = false;
    active = -1;
    results = [];
    if (popup) popup.style.display = 'none';
  }

  function renderRows() {
    rowsEl.innerHTML = '';
    for (var i = 0; i < results.length; i++) {
      var item = results[i];
      var row = document.createElement('div');
      row.className = 'ac-row' + (i === active ? ' ac-active' : '');
      row.setAttribute('data-idx', String(i));

      // optional preview (read-only use of the existing renderer)
      if (item.previewSource) {
        var pv = document.createElement('span');
        pv.className = 'ac-preview';
        try {
          pv.innerHTML = renderer.render(item.previewSource, {
            throwOnError: false, displayMode: false, strict: false,
          });
        } catch (_) { pv.textContent = ''; }
        row.appendChild(pv);
      }

      var main = document.createElement('span');
      main.className = 'ac-main';
      var cmd = document.createElement('span');
      cmd.className = 'ac-cmd';
      cmd.textContent = item.label != null ? item.label : item.insertText;
      main.appendChild(cmd);
      if (item.detail) {
        var det = document.createElement('span');
        det.className = 'ac-detail';
        det.textContent = item.detail;
        main.appendChild(det);
      }
      row.appendChild(main);

      if (item.category) {
        var cat = document.createElement('span');
        cat.className = 'ac-cat';
        cat.textContent = item.category;
        row.appendChild(cat);
      }

      // hover changes selection (no insertion)
      row.addEventListener('mouseenter', onRowHover);
      // click selects internally only (no insertion this phase)
      row.addEventListener('click', onRowClick);

      rowsEl.appendChild(row);
    }
  }

  function updateActiveClasses() {
    var children = rowsEl.children;
    for (var i = 0; i < children.length; i++) {
      if (i === active) children[i].classList.add('ac-active');
      else children[i].classList.remove('ac-active');
    }
    ensureRowVisible();
  }

  function ensureRowVisible() {
    if (active < 0) return;
    var el = rowsEl.children[active];
    if (!el) return;
    var top = el.offsetTop, bottom = top + el.offsetHeight;
    if (top < popup.scrollTop) popup.scrollTop = top;
    else if (bottom > popup.scrollTop + popup.clientHeight) popup.scrollTop = bottom - popup.clientHeight;
  }

  function position() {
    var coords = caretCoords(ta, ta.selectionStart);
    var rect = ta.getBoundingClientRect();
    var left = rect.left + window.pageXOffset + coords.left - ta.scrollLeft;
    var top = rect.top + window.pageYOffset + coords.top - ta.scrollTop + coords.height + 4;

    popup.style.display = 'block';   // measure before clamping
    var pw = popup.offsetWidth, ph = popup.offsetHeight;
    var maxLeft = window.pageXOffset + document.documentElement.clientWidth - pw - 8;
    if (left > maxLeft) left = Math.max(window.pageXOffset + 8, maxLeft);

    // flip above the caret if it would overflow the viewport bottom
    var viewportBottom = window.pageYOffset + document.documentElement.clientHeight;
    if (top + ph > viewportBottom - 8) {
      var above = rect.top + window.pageYOffset + coords.top - ta.scrollTop - ph - 4;
      if (above > window.pageYOffset + 8) top = above;
    }
    popup.style.left = Math.round(left) + 'px';
    popup.style.top = Math.round(top) + 'px';
  }

  // ── lifecycle ───────────────────────────────────────────────────────────────
  function recompute() {
    if (document.activeElement !== ta) { hide(); return; }
    var ctx = ContextEngine.fromTextarea(ta);
    var found = AutocompleteEngine.complete(ctx);
    if (!found || found.length === 0) { hide(); return; }
    results = found.length > MAX_ROWS ? found.slice(0, MAX_ROWS) : found;
    active = 0;
    visible = true;
    ensurePopup();
    renderRows();
    position();
  }

  function move(delta) {
    if (!visible || results.length === 0) return;
    active = (active + delta + results.length) % results.length;
    updateActiveClasses();
  }

  // ── event handlers ──────────────────────────────────────────────────────────
  function onInput() { recompute(); }

  function onClick() { recompute(); }   // caret moved by mouse

  function onKeydown(e) {
    if (!visible) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Escape') { e.preventDefault(); hide(); }
    // Enter / Tab intentionally NOT handled — reserved for the acceptance phase.
  }

  function onBlur() { hide(); }

  function onRowHover(e) {
    var idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
    if (!isNaN(idx) && idx !== active) { active = idx; updateActiveClasses(); }
  }

  function onRowClick(e) {
    // Read-only phase: select internally, keep the popup open, do NOT insert.
    var idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
    if (!isNaN(idx)) { active = idx; updateActiveClasses(); }
  }

  // ── init ────────────────────────────────────────────────────────────────────
  function init() {
    ta = document.getElementById('latexInput');
    if (!ta) return;
    ta.addEventListener('input', onInput);
    ta.addEventListener('click', onClick);
    ta.addEventListener('keydown', onKeydown);
    ta.addEventListener('blur', onBlur);
    window.addEventListener('resize', hide);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
