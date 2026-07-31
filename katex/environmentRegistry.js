// environmentRegistry.js — structured LaTeX-environment knowledge layer.
//
// A passive registry, parallel to CommandRegistry: where CommandRegistry stores
// structured COMMANDS (\frac, \sqrt, …), this stores structured ENVIRONMENTS
// (equation, align, theorem, itemize — the things wrapped by \begin{}…\end{}).
//
// It is pure knowledge: it stores data only. It does NOT parse LaTeX documents,
// touch rendering, autocomplete, SYMBOLS, or the DOM, and adds no UI. Nothing in
// the app consumes it yet — it's the abstraction foundation for future
// pseudo-LaTeXification work.
//
// Classic script. Exposes ONE global, `EnvironmentRegistry` (declared const, so
// it isn't attached to window). All helpers stay private in the IIFE.
//
// Environment object:
//   { name, category, package, description, allowedContent }
//     name           : identifier WITHOUT \begin/\end (e.g. "equation")
//     category       : broad grouping (math | proof | list | document | …)
//     package        : required package name, or null if built-in/unknown
//     description    : human-readable explanation
//     allowedContent : rough hint of what may appear inside (e.g. "math", "text")

const EnvironmentRegistry = (function () {

  var byName = {};   // name -> environment object
  var order = [];    // registration order for stable listing

  function makeEnvironment(o) {
    o = o || {};
    return {
      name: o.name,
      category: o.category || '',
      package: o.package !== undefined ? o.package : null,
      description: o.description || '',
      allowedContent: o.allowedContent || '',
    };
  }

  // ── public API ──────────────────────────────────────────────────────────────
  function register(environment) {
    if (!environment || typeof environment.name !== 'string' || environment.name === '') return null;
    var env = makeEnvironment(environment);
    if (!(env.name in byName)) order.push(env.name);
    byName[env.name] = env;
    return env;
  }

  function get(name) { return Object.prototype.hasOwnProperty.call(byName, name) ? byName[name] : null; }
  function has(name) { return Object.prototype.hasOwnProperty.call(byName, name); }
  function list() { return order.map(function (n) { return byName[n]; }); }
  function size() { return order.length; }

  // ── initial environments (abstraction only, not an exhaustive list) ──────────
  var INITIAL = [
    {
      name: 'equation', category: 'math', package: null,
      allowedContent: 'math',
      description: 'Numbered mathematical equation environment',
    },
    {
      name: 'align', category: 'math', package: 'amsmath',
      allowedContent: 'math',
      description: 'Multi-line aligned mathematical equations',
    },
    {
      name: 'theorem', category: 'proof', package: 'amsthm',
      allowedContent: 'text+math',
      description: 'Theorem-style statement environment',
    },
    {
      name: 'itemize', category: 'list', package: null,
      allowedContent: 'text',
      description: 'Bulleted list environment',
    },
  ];

  for (var i = 0; i < INITIAL.length; i++) register(INITIAL[i]);

  return {
    register: register,
    get: get,
    has: has,
    list: list,
    size: size,
  };
})();
