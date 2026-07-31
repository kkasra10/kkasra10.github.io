// context.js — read-only editing-context analyzer.
//
// Given raw text and a caret/selection, it describes the editing state AROUND
// the caret: the token being typed, the range a replacement would occupy, brace
// nesting, and whether the caret sits inside a command. It performs NO editing,
// NO rendering, and touches NO DOM state it doesn't own.
//
// It is deliberately language-neutral: the command trigger and the "what counts
// as a command-name character" test are options (defaulting to the TeX-family
// "\" + letters convention), so the very same analyzer serves a future full
// LaTeX mode with no rewrite. Nothing here knows what KaTeX is.
//
// Classic script: defines one global, `ContextEngine`. Loading it changes no
// editor behavior — it only makes the analyzer available to be called.

const ContextEngine = (function () {

  const DEFAULTS = {
    // Character that begins a command token (TeX family: backslash).
    trigger: '\\',
    // Predicate: is `ch` allowed inside a command name? (TeX: ASCII letters.)
    isNameChar: function (ch) { return /[A-Za-z]/.test(ch); },
  };

  function clamp(n, lo, hi) {
    n = (typeof n === 'number' && isFinite(n)) ? n : lo;
    return n < lo ? lo : (n > hi ? hi : n);
  }

  // Length of the run of consecutive `trigger` chars ending just before index i.
  // Distinguishes a real command ("\cmd") from an escaped trigger ("\\cmd").
  function triggerRunBefore(text, i, trigger) {
    var n = 0;
    while (i - 1 >= 0 && text[i - 1] === trigger) { n++; i--; }
    return n;
  }

  // Net brace depth (unescaped "{" minus "}") from the start of text to `caret`.
  // A trigger escapes the next character, so "\{" does not open a group.
  function braceDepthAt(text, caret, trigger) {
    var depth = 0;
    for (var i = 0; i < caret; i++) {
      var ch = text[i];
      if (ch === trigger) { i++; continue; }   // skip the escaped next char
      if (ch === '{') depth++;
      else if (ch === '}') depth = depth > 0 ? depth - 1 : 0;
    }
    return depth;
  }

  // Core API: pure, side-effect-free.
  //   analyze(text, selectionStart, selectionEnd [, options]) -> context object
  function analyze(text, selectionStart, selectionEnd, options) {
    text = text == null ? '' : String(text);
    var opts = Object.assign({}, DEFAULTS, options);
    var trigger = opts.trigger;
    var isNameChar = opts.isNameChar;

    var len = text.length;
    var start = clamp(selectionStart, 0, len);
    var end   = clamp(selectionEnd == null ? selectionStart : selectionEnd, 0, len);
    if (start > end) { var t = start; start = end; end = t; }

    var caret = start;                 // the token is measured at the selection's left edge
    var hasSelection = start !== end;

    // Walk left over command-name characters immediately before the caret.
    var i = caret;
    while (i > 0 && isNameChar(text[i - 1])) i--;
    var nameStart = i;                 // index of the first name char (== caret if none)
    var query = text.slice(nameStart, caret);

    // We are inside a command iff an UNESCAPED trigger sits just left of that run.
    var inCommand = false;
    var tokenStart = caret;
    if (nameStart > 0 && text[nameStart - 1] === trigger) {
      var run = triggerRunBefore(text, nameStart, trigger);
      if (run % 2 === 1) {             // odd run → the last trigger is genuine
        inCommand = true;
        tokenStart = nameStart - 1;    // include the trigger character
      }
    }

    // What an accepted replacement would overwrite:
    //   inside a command → the trigger..caret span
    //   otherwise        → the current selection (empty selection = pure insert)
    var replaceStart = inCommand ? tokenStart : start;
    var replaceEnd   = end;

    return {
      // caret / selection
      cursor:         caret,
      selectionStart: start,
      selectionEnd:   end,
      hasSelection:   hasSelection,

      // command state
      inCommand:      inCommand,
      commandPrefix:  inCommand ? text.slice(tokenStart, caret) : null,  // e.g. "\alp"
      query:          inCommand ? query : '',                            // e.g. "alp"

      // structure
      braceDepth:     braceDepthAt(text, caret, trigger),

      // span a replacement would occupy
      replaceStart:   replaceStart,
      replaceEnd:     replaceEnd,

      // echo of the trigger in effect (useful to callers / future modes)
      trigger:        trigger,
    };
  }

  // Read-only convenience wrapper for a <textarea>/<input>. Reads .value and the
  // native selection; never mutates the element.
  function fromTextarea(el, options) {
    return analyze(el.value, el.selectionStart, el.selectionEnd, options);
  }

  return {
    analyze: analyze,
    fromTextarea: fromTextarea,
    DEFAULTS: DEFAULTS,
  };
})();
