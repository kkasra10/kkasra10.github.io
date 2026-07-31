// katexProvider.js — the first real completion provider.
//
// Adapts the existing SYMBOLS palette metadata (from symbols.js) into the
// CompletionItem shape and registers ONE provider (id "katex") with the
// AutocompleteEngine. That is its entire job.
//
// It treats SYMBOLS as strictly READ-ONLY: it never mutates the source objects,
// never touches the sidebar, and knows nothing about the textarea, popup, DOM,
// keyboard, renderer, ContextEngine internals, or editor state. It reads a
// context object only through the public `context.inCommand` flag.
//
// Classic script. Introduces NO new global: it self-registers inside an IIFE.
//
// Mapping (existing metadata only — nothing invented):
//   category.name  → category
//   item.cmd       → insertText, label, and (prefixed) id
//   item.label     → detail        (when present)
//   item.render    → previewSource (when present)
//   kind           → "command"     (single reasonable kind for now)
//
// Skipped: entries in `isCreate` categories (e.g. "Topology"), whose commands
// are Animate-DSL creation helpers ("create square"), not insertable LaTeX.
// The skip happens here, in the provider — SYMBOLS is not modified.

(function () {

  // Guard: if either dependency is missing, do nothing rather than throw.
  if (typeof SYMBOLS === 'undefined' || !Array.isArray(SYMBOLS)) return;
  if (typeof AutocompleteEngine === 'undefined' || !AutocompleteEngine.Registry) return;

  // Adapted items, built once and held privately — a separate cache that never
  // aliases or mutates SYMBOLS.
  var _cache = null;

  function buildItems() {
    var out = [];
    for (var c = 0; c < SYMBOLS.length; c++) {
      var category = SYMBOLS[c];
      if (category.isCreate) continue;                 // skip creation helpers
      var categoryName = category.name;
      var items = category.items || [];
      for (var i = 0; i < items.length; i++) {
        var src = items[i];
        if (!src || typeof src.cmd !== 'string') continue;  // must be insertable

        var item = {
          id:         'katex:' + src.cmd,
          label:      src.cmd,
          insertText: src.cmd,
          kind:       'command',
          category:   categoryName,
        };
        if (src.label != null)  item.detail = src.label;
        if (src.render != null) item.previewSource = src.render;

        out.push(item);
      }
    }
    return out;
  }

  function getCachedItems() {
    if (_cache === null) _cache = buildItems();
    return _cache;
  }

  var provider = {
    id: 'katex',
    priority: 0,
    appliesTo: function (context) {
      return !!(context && context.inCommand);
    },
    getItems: function (/* context */) {
      return getCachedItems();
    },
  };

  AutocompleteEngine.Registry.register(provider);
})();
