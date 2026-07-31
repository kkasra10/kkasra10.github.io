# legacy/ — Frozen KaTeX editor snapshot

This folder is a **frozen backup** of the working KaTeX editor, taken *before*
pseudo‑LaTeXification (structured‑command / full‑LaTeX work) continues past
**Phase 6 (Command Registry bridge)**.

## Status — read only, not executed
- These files are **copies only**. They are **NOT loaded or run by the app.**
  The live editor loads its scripts from `katex/` (the parent folder); nothing
  ever references anything inside `legacy/`.
- **Do not edit these files.** They exist so we can diff against — or roll back
  to — this known‑good state if later LaTeXification work breaks something.

## What the editor could do at this snapshot
- **Rendering:** KaTeX 0.17.0 (engine + fonts inlined in `index.html`),
  multi‑line input, `\begin{}…\end{}` environment patches, renderer abstraction.
- **Symbols:** sidebar with 1526 entries / 90 categories, search, recently‑used.
- **Editing:** color / size / alignment / per‑line‑gap toolbars, snapshot
  undo/redo with `Cmd/Ctrl+Z`, unified `applyEdit()` insertion seam.
- **Shortcuts:** editable live replacements, JSON import/export, autosave‑gated.
- **Modes:** Calculator (mathjs + nerdamer CAS), Animate DSL, Paper multi‑block
  document mode.
- **Export:** share links, Copy LaTeX, PNG / JPG / PDF, Copy Image.
- **Settings:** autosave, dark mode, background color, RTL, i18n (8 languages),
  line spacing.
- **Autocomplete pipeline:** ContextEngine → AutocompleteEngine (provider
  registry) → katexProvider (from SYMBOLS) → matcher (prefix / fuzzy / keyword
  ranking) → read‑only popup UI → acceptance via `applyEdit`.
- **CommandRegistry bridge (Phase 6):** structured command objects adapted from
  SYMBOLS + manual argument metadata for `\frac`, `\sqrt`, `\sum`.
- **TROLL MODE:** cosmetic easter eggs triggered by secret words.

## Archived files (17)
`index.html` + `symbols.js`, `settings.js`, `templates.js`, `export.js`,
`i18n.js`, `shortcuts.js`, `calculator.js`, `animation.js`, `paper.js`,
`context.js`, `autocomplete.js`, `katexProvider.js`, `commandRegistry.js`,
`matcher.js`, `autocompleteUI.js`, `troll.js`.

## Rule for future work
Future LaTeXification **must not modify anything in this folder.** Treat it as
read‑only history — a fallback, not a working copy.
