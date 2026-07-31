// commandRegistry.js — structured command layer (bridge only, no UI, no editor
// changes). It lets the editor eventually treat LaTeX/KaTeX constructs as
// structured commands (name + category + package + preview + typed arguments)
// instead of opaque autocomplete strings.
//
// It is strictly additive: it READS the existing SYMBOLS palette to seed itself
// and never mutates it, never touches rendering, autocomplete, or the DOM. The
// autocomplete pipeline (katexProvider → matcher → popup) is unaffected — it
// still reads SYMBOLS directly and knows nothing about this registry.
//
// Classic script. Exposes ONE global, `CommandRegistry` (declared const, so it
// isn't even attached to window). All helpers stay private in the IIFE.
//
// Command object:
//   { name, category, package, preview, arguments: Argument[] }
// Argument object:
//   { type, required, syntax, placeholder }
//
// No package/document/macro parsing yet — this only establishes the abstraction.

const CommandRegistry = (function () {

  var byName = {};   // name -> command object
  var order = [];    // registration order for stable listing

  // ── shape helpers (apply sensible defaults) ─────────────────────────────────
  function makeArgument(a) {
    a = a || {};
    return {
      type: a.type || 'math',        // math | limit | text | …  (free-form for now)
      required: !!a.required,
      syntax: a.syntax || '{}',      // how the arg is delimited, e.g. "{}" or "[]"
      placeholder: a.placeholder || '',
    };
  }

  function makeCommand(o) {
    o = o || {};
    return {
      name: o.name,
      category: o.category || '',
      package: o.package || 'katex',
      preview: o.preview || o.name,
      arguments: (o.arguments || []).map(makeArgument),
    };
  }

  // ── public API ──────────────────────────────────────────────────────────────
  function register(command) {
    if (!command || typeof command.name !== 'string' || command.name === '') return null;
    var cmd = makeCommand(command);
    if (!(cmd.name in byName)) order.push(cmd.name);
    byName[cmd.name] = cmd;
    return cmd;
  }

  function get(name) { return Object.prototype.hasOwnProperty.call(byName, name) ? byName[name] : null; }
  function has(name) { return Object.prototype.hasOwnProperty.call(byName, name); }
  function list() { return order.map(function (n) { return byName[n]; }); }
  function size() { return order.length; }

  // ── adapter: SYMBOLS → command objects (read-only, default arguments []) ─────
  function adaptFromSymbols() {
    if (typeof SYMBOLS === 'undefined' || !Array.isArray(SYMBOLS)) return;
    for (var c = 0; c < SYMBOLS.length; c++) {
      var cat = SYMBOLS[c];
      if (cat.isCreate) continue;                 // skip Animate-DSL helper categories
      var items = cat.items || [];
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        if (!it || typeof it.cmd !== 'string') continue;
        register({
          name: it.cmd,
          category: cat.name,
          package: 'katex',
          preview: it.render || it.cmd,
          arguments: [],                          // structured args unknown for palette entries
        });
      }
    }
  }

  // ── manual metadata for a few test commands (the abstraction, not full LaTeX) ─
  var MANUAL = [
    {
      name: '\\frac', category: 'Structures', package: 'katex', preview: '\\frac{a}{b}',
      arguments: [
        { type: 'math', required: true, syntax: '{}', placeholder: 'numerator' },
        { type: 'math', required: true, syntax: '{}', placeholder: 'denominator' },
      ],
    },
    {
      name: '\\sqrt', category: 'Structures', package: 'katex', preview: '\\sqrt{x}',
      arguments: [
        { type: 'math', required: false, syntax: '[]', placeholder: 'index' },
        { type: 'math', required: true,  syntax: '{}', placeholder: 'radicand' },
      ],
    },
    {
      name: '\\sum', category: 'Big Operators', package: 'katex', preview: '\\sum_{i=1}^{n}',
      arguments: [
        { type: 'limit', required: false, syntax: '_{}', placeholder: 'lower limit' },
        { type: 'limit', required: false, syntax: '^{}', placeholder: 'upper limit' },
      ],
    },
  ];

  // Seed from SYMBOLS first, then apply manual metadata (authoritative for its
  // base names — e.g. "\frac" alongside any "\frac{}{}" palette variant).
  adaptFromSymbols();
  for (var m = 0; m < MANUAL.length; m++) register(MANUAL[m]);

  return {
    register: register,
    get: get,
    has: has,
    list: list,
    size: size,
  };
})();
