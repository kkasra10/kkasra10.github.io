// calculator.js — calculator subsystem extracted verbatim from katex.html (Phase 8).
// Two source blocks joined: (A) mathjs/nerdamer lazy loaders, calc state, keypad data
// (CALC_*), evaluation + symbolic ops, panel/button wiring, calcToLatex/Wolfram, and
// (B) the global calc keydown listener. Classic script loaded after shortcuts.js and
// before the app script. Shared utilities stay in the app script and resolve at runtime:
//   outbound: render, setActiveTab, histPush, renderer.render (app)
//   inbound : buildCalcGrid + buildCalcSymBar (called from app init)
// Calc state is fully self-contained. Behaviour unchanged.

// ── Calculator ────────────────────────────────────────────────────────────────
let _mathjs = null;
function loadMathJS() {
  if (_mathjs) return _mathjs;
  _mathjs = new Promise((res, rej) => {
    if (window.math) { res(window.math); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.3/math.min.js';
    s.onload = () => res(window.math);
    s.onerror = () => rej(new Error('math.js failed to load'));
    document.head.appendChild(s);
  });
  return _mathjs;
}

let calcExprStr = '';
let calcDegMode = true;
let calcAlgMode = false;

// Left function sidebar — scientific extras
const CALC_FN_BTNS = [
  // Variables (highlighted row)
  { lx:'x', cv:'x', cls:'var' },
  { lx:'y', cv:'y', cls:'var' },
  { lx:'n', cv:'n', cls:'var' },
  { lx:'t', cv:'t', cls:'var' },
  { lx:'a', cv:'a', cls:'var' },
  { lx:'k', cv:'k', cls:'var' },
  // Scientific functions
  { lx:'\\sin',              cv:'sin(',  cls:'fn' },
  { lx:'\\cos',              cv:'cos(',  cls:'fn' },
  { lx:'\\tan',              cv:'tan(',  cls:'fn' },
  { lx:'\\sin^{-1}',         cv:'asin(', cls:'fn' },
  { lx:'\\cos^{-1}',         cv:'acos(', cls:'fn' },
  { lx:'\\tan^{-1}',         cv:'atan(', cls:'fn' },
  { lx:'\\ln',               cv:'ln(',   cls:'fn' },
  { lx:'\\log_{10}',         cv:'log(',  cls:'fn' },
  { lx:'\\log_2',            cv:'log2(', cls:'fn' },
  { lx:'e^x',                cv:'exp(',  cls:'fn' },
  { lx:'\\sqrt{x}',          cv:'sqrt(', cls:'fn' },
  { lx:'\\sqrt[3]{x}',       cv:'cbrt(', cls:'fn' },
  { lx:'|x|',                cv:'abs(',  cls:'fn' },
  { lx:'\\sinh',             cv:'sinh(', cls:'fn' },
  { lx:'\\cosh',             cv:'cosh(', cls:'fn' },
  { lx:'\\tanh',             cv:'tanh(', cls:'fn' },
  { lx:'\\cot',              cv:'cot(',  cls:'fn' },
  { lx:'n!',                 cv:'!',     cls:'fn' },
  { lx:'\\lfloor x\\rfloor', cv:'floor(',cls:'fn' },
  { lx:'\\lceil x\\rceil',   cv:'ceil(', cls:'fn' },
  { lx:'\\text{round}',      cv:'round(',cls:'fn' },
  { lx:'\\sec',              cv:'sec(',  cls:'fn' },
  { lx:'\\csc',              cv:'csc(',  cls:'fn' },
  { lx:'\\Gamma',            cv:'gamma(',cls:'fn' },
  { lx:'10^x',               cv:'10^',   cls:'fn' },
  { lx:'\\bmod',             cv:' mod ', cls:'fn' },
  { lx:'{}^nC_r',            cv:'combinations(', cls:'fn' },
  { lx:'{}^nP_r',            cv:'permutations(', cls:'fn' },
  { lx:'\\gcd',              cv:'gcd(',  cls:'fn' },
  { lx:'\\text{lcm}',        cv:'lcm(',  cls:'fn' },
];

// Right main pad — everyday use
const CALC_BTNS = [
  { text:'DEG', ca:'deg', cls:'deg', id:'calcDegBtn' },
  { lx:'\\pi',     cv:'pi',   cls:'fn' },
  { lx:'e',        cv:'e',    cls:'fn' },
  { text:'⌫',      ca:'back', cls:'clr' },

  { lx:'(\\,)',    ca:'paren',cls:'fn' },
  { lx:'x^n',     cv:'^',    cls:'fn' },
  { lx:'x^2',     cv:'^2',   cls:'fn' },
  { lx:'\\pm',    ca:'sign', cls:'fn' },

  { text:'AC',     ca:'clear',cls:'clr' },
  { text:'ALG',   ca:'alg',  cls:'deg' },
  { lx:'x\\%',    cv:'%',    cls:'fn' },
  { lx:'\\div',   cv:'/',    cls:'op' },

  { lx:'7', cv:'7', cls:'num' }, { lx:'8', cv:'8', cls:'num' },
  { lx:'9', cv:'9', cls:'num' }, { lx:'\\times', cv:'*', cls:'op' },
  { lx:'4', cv:'4', cls:'num' }, { lx:'5', cv:'5', cls:'num' },
  { lx:'6', cv:'6', cls:'num' }, { lx:'-', cv:'-', cls:'op' },
  { lx:'1', cv:'1', cls:'num' }, { lx:'2', cv:'2', cls:'num' },
  { lx:'3', cv:'3', cls:'num' }, { lx:'+', cv:'+', cls:'op' },

  { lx:'0', cv:'0', cls:'num', span:2 },
  { lx:'.', cv:'.', cls:'num' },
  { lx:'=', ca:'eval', cls:'eq' },
];

const CALC_SYM_BTNS = [
  { lx:'\\text{Simplify}', op:'simplify' },
  { lx:'\\text{Factor}',   op:'factor'   },
  { lx:'\\text{Expand}',   op:'expand'   },
  { lx:'\\dfrac{d}{dx}',   op:'diff'     },
  { lx:'\\int dx',         op:'integrate'},
  { lx:'\\text{Solve }x',  op:'solve'    },
  { lx:'\\text{Taylor}',   op:'taylor'   },
  { lx:'\\gcd',            op:'gcd'      },
];

// ── nerdamer (CAS) ────────────────────────────────────────────────────────────
let _nerdamer = null;
function loadNerdamer() {
  if (_nerdamer) return _nerdamer;
  _nerdamer = new Promise((res, rej) => {
    if (window.nerdamer) { res(window.nerdamer); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/nerdamer@1.1.13/all.min.js';
    s.onload = () => res(window.nerdamer);
    s.onerror = () => rej(new Error('nerdamer failed to load'));
    document.head.appendChild(s);
  });
  return _nerdamer;
}

// Pick the variable to differentiate/integrate/solve against.
// Prefers x, then y, n, t, a, k — matched as standalone letters so the
// 'n' inside "sin" or 'a' inside "tan" is never picked up.
function calcMainVar(e) {
  for (const v of ['x','y','n','t','a','k']) {
    if (new RegExp('(?<![A-Za-z])' + v + '(?![A-Za-z])').test(e)) return v;
  }
  return 'x';
}

async function applySymbolic(op, btn) {
  if (!calcExprStr) return;
  const origHTML = btn.innerHTML;
  btn.textContent = '…'; btn.classList.add('loading');
  try {
    const nd = await loadNerdamer();
    let result;
    const e = calcExprStr;
    const v = calcMainVar(e);
    switch (op) {
      case 'simplify':  result = nd('simplify(' + e + ')').toString(); break;
      case 'factor':    result = nd('factor(' + e + ')').toString(); break;
      case 'expand':    result = nd('expand(' + e + ')').toString(); break;
      case 'diff':      result = nd('diff(' + e + ', ' + v + ')').toString(); break;
      case 'integrate': result = nd('integrate(' + e + ', ' + v + ')').toString(); break;
      case 'solve':     result = nd.solve(e, v).toString(); break;
      case 'taylor':    result = nd('taylor(' + e + ', ' + v + ', 0, 5)').toString(); break;
      case 'gcd': {
        // gcd needs two args: prompt for second
        const b = prompt('GCD of ' + e + ' and:', 'x^2-1');
        if (!b) { btn.innerHTML = origHTML; btn.classList.remove('loading'); return; }
        result = nd('gcd(' + e + ', ' + b + ')').toString(); break;
      }
    }
    if (result) {
      addCalcHistItem(e + ' [' + op + ']', result);
      calcExprStr = result; updateCalcDisplay();
    }
  } catch(err) {
    const el = document.getElementById('calcResult');
    el.textContent = 'Cannot ' + op; el.classList.add('error');
  } finally {
    btn.innerHTML = origHTML; btn.classList.remove('loading');
  }
}

function buildCalcSymBar() {
  const bar = document.getElementById('calcSymBar');
  bar.innerHTML = '';
  CALC_SYM_BTNS.forEach(def => {
    const btn = document.createElement('button');
    btn.className = 'csb';
    btn.dataset.op = def.op;
    if (typeof katex !== 'undefined') {
      try { btn.innerHTML = renderer.render(def.lx, { throwOnError:false, strict:false }); }
      catch(_) { btn.textContent = def.op; }
    } else { btn.textContent = def.op; }
    btn.addEventListener('click', () => applySymbolic(def.op, btn));
    bar.appendChild(btn);
  });
}

function makeCalcBtn(def) {
  const btn = document.createElement('button');
  btn.className = 'cb ' + def.cls;
  if (def.id)   btn.id = def.id;
  if (def.cv !== undefined) btn.dataset.cv = def.cv;
  if (def.ca)   btn.dataset.ca = def.ca;
  if (def.span) btn.style.gridColumn = 'span ' + def.span;
  if (def.lx && typeof katex !== 'undefined') {
    try { btn.innerHTML = renderer.render(def.lx, { throwOnError:false, strict:false, displayMode:false }); }
    catch(_) { btn.textContent = def.text || def.lx; }
  } else { btn.textContent = def.text || def.lx || ''; }
  return btn;
}

function buildCalcGrid() {
  const grid = document.getElementById('calcGrid');
  const fns  = document.getElementById('calcFnsCol');
  if (grid) { grid.innerHTML = ''; CALC_BTNS.forEach(d => grid.appendChild(makeCalcBtn(d))); }
  if (fns)  { fns.innerHTML  = ''; CALC_FN_BTNS.forEach(d => fns.appendChild(makeCalcBtn(d))); }
}

function calcExtraScope() {
  return {
    log2: x => Math.log2(x),
    cot:  x => 1 / Math.tan(x),
    sec:  x => 1 / Math.cos(x),
    csc:  x => 1 / Math.sin(x),
  };
}
function calcDegScope() {
  const D = Math.PI / 180, R = 180 / Math.PI;
  return {
    sin:  x => Math.sin(x * D),
    cos:  x => Math.cos(x * D),
    tan:  x => Math.tan(x * D),
    asin: x => Math.asin(x) * R,
    acos: x => Math.acos(x) * R,
    atan: x => Math.atan(x) * R,
    sinh: x => Math.sinh(x * D),
    cosh: x => Math.cosh(x * D),
    tanh: x => Math.tanh(x * D),
    cot:  x => 1 / Math.tan(x * D),
    sec:  x => 1 / Math.cos(x * D),
    csc:  x => 1 / Math.sin(x * D),
    log2: x => Math.log2(x),
  };
}

function fmtCalcNum(n) {
  if (typeof n !== 'number' && typeof n !== 'bigint') return String(n);
  if (!isFinite(n)) return n > 0 ? '∞' : '-∞';
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
  return String(parseFloat(n.toPrecision(10)));
}

async function evalCalcExpr(expr) {
  if (calcAlgMode) {
    const nd = await loadNerdamer();
    return nd(expr).toString();
  }
  const m = await loadMathJS();
  return m.evaluate(expr, calcDegMode ? calcDegScope() : calcExtraScope());
}

function calcToLatexStr(expr) {
  if (!expr) return '';
  // Algebra mode: use nerdamer's toTeX if available
  if (calcAlgMode && window.nerdamer) {
    try { return window.nerdamer(expr).toTeX(); } catch(_) {}
  }
  try { if (window.math && window.math.parse) return window.math.parse(expr).toTex({ parenthesis:'auto' }); } catch(_) {}
  return expr.replace(/\bpi\b/g,'\\pi').replace(/\bsqrt\(/g,'\\sqrt{')
    .replace(/\bsin\(/g,'\\sin(').replace(/\bcos\(/g,'\\cos(').replace(/\btan\(/g,'\\tan(')
    .replace(/\bln\(/g,'\\ln(').replace(/\blog\(/g,'\\log(').replace(/\*/g,'\\cdot').replace(/\//g,'\\div');
}

function updateCalcDisplay() {
  document.getElementById('calcExpr').textContent = calcExprStr || '0';
  const kw = document.getElementById('calcKatex');
  if (kw && calcExprStr && typeof katex !== 'undefined') {
    try { kw.innerHTML = renderer.render(calcToLatexStr(calcExprStr), { throwOnError:false, strict:false }); }
    catch(_) { kw.textContent = ''; }
  } else if (kw) { kw.textContent = ''; }
  if (!calcExprStr) { document.getElementById('calcResult').textContent = ''; return; }
  evalCalcExpr(calcExprStr).then(r => {
    const el = document.getElementById('calcResult');
    el.textContent = fmtCalcNum(r); el.classList.remove('error');
  }).catch(() => { document.getElementById('calcResult').textContent = ''; });
}

function addCalcHistItem(expr, result) {
  const hist = document.getElementById('calcHistory');
  const item = document.createElement('div');
  item.className = 'calc-hist-item';
  item.innerHTML = expr.replace(/</g,'&lt;') + '<span class="calc-hist-eq">=</span>' + String(result);
  item.addEventListener('click', () => { calcExprStr = String(result); updateCalcDisplay(); });
  hist.insertBefore(item, hist.firstChild);
}

function openParenCount() {
  let n = 0; for (const c of calcExprStr) { if (c==='(') n++; else if (c===')') n--; } return n;
}

// Single delegated listener on the grid
document.getElementById('calcLayout').addEventListener('click', async e => {
  const btn = e.target.closest('.cb'); if (!btn) return;
  const cv = btn.dataset.cv, ca = btn.dataset.ca;
  if (ca === 'deg') {
    calcDegMode = !calcDegMode;
    btn.textContent = calcDegMode ? 'DEG' : 'RAD';
    updateCalcDisplay(); return;
  }
  if (ca === 'alg') {
    calcAlgMode = !calcAlgMode;
    btn.textContent = calcAlgMode ? 'ALG ✓' : 'ALG';
    btn.style.background = calcAlgMode ? '#3b6ef5' : '';
    btn.style.color       = calcAlgMode ? '#fff'    : '';
    btn.style.borderColor = calcAlgMode ? '#3b6ef5' : '';
    if (calcAlgMode) loadNerdamer(); // preload
    updateCalcDisplay(); return;
  }
  if (cv !== undefined) {
    if (calcExprStr === '0' && /^\d$/.test(cv)) calcExprStr = cv; else calcExprStr += cv;
    updateCalcDisplay();
  } else if (ca) {
    switch(ca) {
      case 'clear': calcExprStr = ''; updateCalcDisplay(); break;
      case 'back':  calcExprStr = calcExprStr.slice(0, -1); updateCalcDisplay(); break;
      case 'sign':  calcExprStr = calcExprStr.startsWith('-') ? calcExprStr.slice(1) : '-'+calcExprStr; updateCalcDisplay(); break;
      case 'paren': calcExprStr += openParenCount() > 0 ? ')' : '('; updateCalcDisplay(); break;
      case 'eval':
        if (!calcExprStr) break;
        try {
          let result;
          if (calcAlgMode) {
            const nd = await loadNerdamer();
            result = nd(calcExprStr).toString();
          } else {
            const m = await loadMathJS();
            result = m.evaluate(calcExprStr, calcDegMode ? calcDegScope() : calcExtraScope());
          }
          addCalcHistItem(calcExprStr, result);
          calcExprStr = fmtCalcNum(result); updateCalcDisplay();
        } catch(_) {
          const el = document.getElementById('calcResult');
          el.textContent = 'Error'; el.classList.add('error');
        }
        break;
    }
  }
});

document.getElementById('calcToLatex').addEventListener('click', () => {
  const result = document.getElementById('calcResult').textContent;
  if (!calcExprStr) return;
  const ta = document.getElementById('latexInput');
  const insert = result || calcExprStr;
  const start = ta.selectionStart;
  ta.value = ta.value.slice(0, start) + insert + ta.value.slice(ta.selectionEnd);
  ta.setSelectionRange(start + insert.length, start + insert.length);
  setActiveTab('Latex'); ta.focus(); render(); histPush(ta.value);
});

document.getElementById('calcWolfram').addEventListener('click', () => {
  window.open('https://www.wolframalpha.com/input?i=' + encodeURIComponent(calcExprStr || '1+1'), '_blank');
});

document.getElementById('tabCalc').addEventListener('click', () => loadMathJS(), { once: true });


// ── Calculator keyboard shortcuts ─────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (document.getElementById('panelCalc').classList.contains('hidden')) return;
  // Don't intercept while typing in a text field
  var tag = document.activeElement && document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  var k = e.key, ctrl = e.ctrlKey || e.metaKey, shift = e.shiftKey;
  if (ctrl) return;
  var handled = true;
  // Digits and decimal
  if (/^[0-9]$/.test(k))         { if (calcExprStr === '0') calcExprStr = k; else calcExprStr += k; }
  else if (k === '.')             { calcExprStr += '.'; }
  // Operators
  else if (k === '+')             { calcExprStr += '+'; }
  else if (k === '-')             { calcExprStr += '-'; }
  else if (k === '*')             { calcExprStr += '*'; }
  else if (k === '/')             { calcExprStr += '/'; }
  else if (k === '^')             { calcExprStr += '^'; }
  else if (k === '%')             { calcExprStr += '%'; }
  else if (k === '(' || k === ')') { calcExprStr += k; }
  // Actions
  else if (k === 'Enter' || k === '=') {
    document.querySelector('#calcGrid .cb.eq')?.click(); e.preventDefault(); return;
  }
  else if (k === 'Backspace')     { calcExprStr = calcExprStr.slice(0, -1); }
  else if (k === 'Escape')        { calcExprStr = ''; }
  // Letter shortcuts (no shift = lowercase fn, shift = variant)
  else if (k === 's' && !shift)   { calcExprStr += 'sin('; }
  else if (k === 'S')             { calcExprStr += 'sqrt('; }
  else if (k === 'c' && !shift)   { calcExprStr += 'cos('; }
  else if (k === 'C')             { calcExprStr += 'cos('; }
  else if (k === 't' && !shift)   { calcExprStr += 'tan('; }
  else if (k === 'l' && !shift)   { calcExprStr += 'ln('; }
  else if (k === 'L')             { calcExprStr += 'log('; }
  else if (k === 'q')             { calcExprStr += 'sqrt('; }
  else if (k === 'p')             { calcExprStr += 'pi'; }
  else if (k === 'e' && !shift)   { calcExprStr += 'e'; }
  else if (k === 'a')             { calcExprStr += 'abs('; }
  else { handled = false; }
  if (handled) { updateCalcDisplay(); e.preventDefault(); }
});
