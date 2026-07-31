// matcher.js — matching + ranking layer for the autocomplete subsystem.
//
// Sits between raw provider results and the (future) UI. It receives ONLY:
//   • a context object (from ContextEngine — read via context.query / .trigger)
//   • an array of CompletionItems (from AutocompleteEngine.query)
// and returns a filtered, ranked array. It is language-independent: it never
// reads SYMBOLS, never knows KaTeX/LaTeX, never touches the DOM/renderer.
//
// Responsibility split (deliberately not merged):
//   matchItems() → "which items match?"   (classify: exact / prefix / fuzzy / keyword)
//   rankMatches() → "which matches are better?"  (deterministic ordering)
//
// It introduces NO new global — it attaches to the existing AutocompleteEngine.
// No work happens at load time; all work is on-demand inside match().

(function () {
  if (typeof AutocompleteEngine === 'undefined') return;

  // Match-quality tiers (higher is better).  exact > prefix > fuzzy > keyword.
  var QUALITY = { keyword: 0, fuzzy: 1, prefix: 2, exact: 3 };

  // If at least this many strong (exact/prefix) matches already exist, skip the
  // fuzzy scan entirely — "don't scan unnecessarily when prefix is strong."
  var FUZZY_SKIP_THRESHOLD = 25;

  // ── helpers ────────────────────────────────────────────────────────────────

  // Lowercase and strip a single leading trigger char (e.g. "\alpha" -> "alpha").
  function norm(s, trigger) {
    if (s == null) return '';
    s = String(s);
    if (trigger && s.charAt(0) === trigger) s = s.slice(1);
    return s.toLowerCase();
  }

  // Ordered-subsequence test. Returns {ok, first} where `first` is the index of
  // the first matched character (0 when query is empty).
  function subsequence(q, s) {
    if (q === '') return { ok: true, first: 0 };
    var i = 0, first = -1;
    for (var j = 0; j < s.length && i < q.length; j++) {
      if (s.charCodeAt(j) === q.charCodeAt(i)) {
        if (first < 0) first = j;
        i++;
      }
    }
    return { ok: i === q.length, first: first < 0 ? 0 : first };
  }

  // The name candidates an item is matched against: its command / label, each
  // with the leading trigger stripped. (detail is descriptive, not a name.)
  function nameCandidates(item, trigger) {
    var out = [];
    var a = norm(item.insertText, trigger);
    var b = norm(item.label, trigger);
    if (a) out.push(a);
    if (b && b !== a) out.push(b);
    return out;
  }

  // ── classification (matchItems) ─────────────────────────────────────────────

  // Strong pass: exact / prefix on names, plus keyword/synonym matches.
  // Returns {quality, position} or null.
  function classifyStrong(item, q, trigger) {
    var best = null;
    function consider(quality, position) {
      if (best === null || quality > best.quality ||
          (quality === best.quality && position < best.position)) {
        best = { quality: quality, position: position };
      }
    }

    var names = nameCandidates(item, trigger);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (q === '') { consider(QUALITY.prefix, 0); continue; }   // empty query → match all
      if (name === q) consider(QUALITY.exact, 0);
      else if (name.lastIndexOf(q, 0) === 0) consider(QUALITY.prefix, 0);  // startsWith
    }

    if (q !== '') {
      var kws = [];
      if (Array.isArray(item.synonyms)) kws = kws.concat(item.synonyms);
      if (Array.isArray(item.keywords)) kws = kws.concat(item.keywords);
      for (var k = 0; k < kws.length; k++) {
        var kw = norm(kws[k], null);
        if (kw === q || kw.lastIndexOf(q, 0) === 0) consider(QUALITY.keyword, 0);
      }
    }
    return best;
  }

  // Fuzzy pass: subsequence on names. Returns {quality, position} or null.
  function classifyFuzzy(item, q, trigger) {
    var names = nameCandidates(item, trigger);
    var best = null;
    for (var i = 0; i < names.length; i++) {
      var r = subsequence(q, names[i]);
      if (r.ok && (best === null || r.first < best.position)) {
        best = { quality: QUALITY.fuzzy, position: r.first };
      }
    }
    return best;
  }

  // ── ranking (rankMatches) ───────────────────────────────────────────────────

  // Deterministic order:
  //   1. match quality  (exact > prefix > fuzzy > keyword)   — desc
  //   2. match position (earlier match first)                — asc
  //   3. category relevance, if a hint is available          — preferred first
  //   4. provider order (arrival index encodes priority)     — asc  (final, unique)
  function rankMatches(matches, preferredCategory) {
    matches.sort(function (a, b) {
      if (b.quality !== a.quality) return b.quality - a.quality;
      if (a.position !== b.position) return a.position - b.position;
      if (preferredCategory) {
        var ap = a.item.category === preferredCategory ? 0 : 1;
        var bp = b.item.category === preferredCategory ? 0 : 1;
        if (ap !== bp) return ap - bp;
      }
      return a.idx - b.idx;               // stable, fully deterministic
    });
    return matches;
  }

  // Shallow-copy an item and attach ranking metadata (never mutates the input).
  function annotate(m) {
    var copy = {};
    for (var kk in m.item) {
      if (Object.prototype.hasOwnProperty.call(m.item, kk)) copy[kk] = m.item[kk];
    }
    copy.matchQuality = m.quality;   // numeric tier
    copy.matchPosition = m.position;
    return copy;
  }

  // ── public: match(items, context, options) ──────────────────────────────────
  function match(items, context, options) {
    if (!Array.isArray(items) || items.length === 0) return [];
    options = options || {};
    var trigger = (context && context.trigger) || '\\';
    var q = norm(context && context.query, trigger);
    var preferredCategory =
      options.preferredCategory || (context && context.categoryHint) || null;

    var matches = [];
    var weak = [];

    // Pass 1: exact / prefix / keyword.
    for (var i = 0; i < items.length; i++) {
      var b = classifyStrong(items[i], q, trigger);
      if (b) matches.push({ item: items[i], idx: i, quality: b.quality, position: b.position });
      else weak.push({ item: items[i], idx: i });
    }

    // Pass 2: fuzzy — only if prefix results are not already strong.
    var strongCount = 0;
    for (var s = 0; s < matches.length; s++) {
      if (matches[s].quality >= QUALITY.prefix) strongCount++;
    }
    if (q !== '' && strongCount < FUZZY_SKIP_THRESHOLD) {
      for (var w = 0; w < weak.length; w++) {
        var f = classifyFuzzy(weak[w].item, q, trigger);
        if (f) matches.push({ item: weak[w].item, idx: weak[w].idx, quality: f.quality, position: f.position });
      }
    }

    rankMatches(matches, preferredCategory);

    var out = [];
    for (var m = 0; m < matches.length; m++) out.push(annotate(matches[m]));
    return out;
  }

  // Attach to the existing namespace — no new global.
  AutocompleteEngine.Matcher = { match: match, QUALITY: QUALITY };

  // Convenience orchestrator: context → raw query → matched/ranked results.
  AutocompleteEngine.complete = function (context, options) {
    return match(AutocompleteEngine.query(context), context, options);
  };
})();
