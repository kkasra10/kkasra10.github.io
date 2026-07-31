// autocomplete.js — the completion core (infrastructure only).
//
// A tiny, standalone engine that turns (context, providers) into a flat list of
// completion items. It knows NOTHING about KaTeX, LaTeX, the renderer, the DOM,
// the textarea, the cursor, the keyboard, or any popup. It operates purely on:
//   • context objects   (opaque — passed straight through to providers)
//   • providers          (registered knowledge sources)
//   • completion items   (plain data objects)
//
// This phase deliberately has NO fuzzy search, NO ranking, NO dedup, NO
// filtering, NO caching, NO async, and NO providers. It only proves the
// registration + query architecture.
//
// Classic script: exposes exactly ONE global, `AutocompleteEngine`.
//
// ── Provider contract ────────────────────────────────────────────────────────
//   id            : string   — unique identifier (required)
//   priority      : number   — higher runs earlier (optional, default 0)
//   appliesTo(ctx): boolean  — may this provider answer here? (optional → true)
//   getItems(ctx) : Item[]   — candidate items for this context (optional → [])
//
// ── CompletionItem contract ──────────────────────────────────────────────────
//   Language-independent:
//     id          : string   — stable identity within its provider
//     label       : string   — primary display text
//     insertText  : string   — what would be inserted on accept
//     detail      : string   — short human description (optional)
//     kind        : string   — e.g. "command" | "symbol" | ... (optional)
//     category    : string   — grouping key (optional)
//   Provider-attributed (stamped by the engine, not the provider):
//     providerId  : string   — id of the provider that produced the item
//   Preview-related:
//     previewSource : string — opaque token for a future preview layer (optional)
//
//   (No snippet/placeholder fields yet — intentionally deferred.)

const AutocompleteEngine = (function () {

  // Registered providers, each wrapped with its registration order (`seq`) so
  // equal priorities fall back to a stable, predictable order.
  var entries = [];
  var seqCounter = 0;

  var Registry = {
    // Add a provider. Re-registering an existing id replaces it in place.
    register: function (provider) {
      if (!provider || typeof provider.id !== 'string' || provider.id === '') {
        throw new Error('AutocompleteEngine: provider must have a non-empty string id');
      }
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].provider.id === provider.id) {
          entries[i] = { provider: provider, seq: entries[i].seq };
          return;
        }
      }
      entries.push({ provider: provider, seq: seqCounter++ });
    },

    // Remove a provider by id. Returns true if one was removed.
    unregister: function (id) {
      var before = entries.length;
      entries = entries.filter(function (e) { return e.provider.id !== id; });
      return entries.length < before;
    },

    // Snapshot of the registered providers (registration order).
    listProviders: function () {
      return entries.map(function (e) { return e.provider; });
    },
  };

  function providerApplies(provider, context) {
    if (typeof provider.appliesTo !== 'function') return true;
    return !!provider.appliesTo(context);
  }

  function providerItems(provider, context) {
    if (typeof provider.getItems !== 'function') return [];
    var items = provider.getItems(context);
    return Array.isArray(items) ? items : [];
  }

  // Shallow copy an item and stamp its origin, without mutating the source.
  function withProviderId(item, providerId) {
    var copy = {};
    for (var k in item) {
      if (Object.prototype.hasOwnProperty.call(item, k)) copy[k] = item[k];
    }
    copy.providerId = providerId;
    return copy;
  }

  // Ask every applicable provider, in priority order, and concatenate their
  // items. Sorting is by PROVIDER PRIORITY ONLY — no item-level ranking.
  function query(context) {
    var applicable = entries.filter(function (e) {
      return providerApplies(e.provider, context);
    });

    applicable.sort(function (a, b) {
      var pa = typeof a.provider.priority === 'number' ? a.provider.priority : 0;
      var pb = typeof b.provider.priority === 'number' ? b.provider.priority : 0;
      if (pb !== pa) return pb - pa;   // higher priority first
      return a.seq - b.seq;            // ties → earlier registration first
    });

    var out = [];
    for (var i = 0; i < applicable.length; i++) {
      var provider = applicable[i].provider;
      var items = providerItems(provider, context);
      for (var j = 0; j < items.length; j++) {
        out.push(withProviderId(items[j], provider.id));
      }
    }
    return out;
  }

  return {
    Registry: Registry,
    query: query,
  };
})();
