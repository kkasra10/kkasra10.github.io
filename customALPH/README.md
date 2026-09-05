# customALPH

A single-page tool for sketching a custom alphabet: one box per letter, named
however you like, saved as images.

Live at <https://kkasra10.github.io/customALPH/>.

## What it does

- **Add boxes as you go.** The `+` tile at the end of the grid adds one more
  box; typing in the *Add boxes* field appends a batch (`ABC` adds three,
  `alef beh pe` adds one box per word); the presets append A–Z, a–z, 0–9 or
  punctuation. *Replace all* swaps the whole set out instead, keeping the
  drawings whose names still match.
- **Name them anything.** Every box's name is an editable field under the box —
  a character, a word, a phrase. Duplicates are fine, and a box can stay
  unnamed. The name is also what the exported file is called.
- **Draw.** Sketch directly in a box with a mouse, finger or stylus — pen
  pressure varies the stroke weight. Double-click a box (or the ⛶ button) for
  a large editor with Prev/Next so you can work through the alphabet.
- **Guides.** Cap-height, x-height, baseline and descender lines, plus a
  ghost of the name to trace. Neither is exported.
- **Save.** Every box as a PNG in a `.zip`, a single box as PNG or SVG, or a
  contact sheet of the whole alphabet. Export size, background
  (transparent / white / paper) and trim-to-ink are configurable.

## Notes on the implementation

Plain HTML/CSS/JS in one file — no build step, no dependencies, no network
calls.

- Strokes are stored as **normalised vector paths** (0..1 coordinates, width as
  a fraction of the box), so a box can be re-rendered crisply at any pixel size
  and undo/redo is per-box. Eraser strokes are replayed with
  `destination-out`, which keeps transparent PNGs correct.
- The `.zip` is written by a small **stored-method ZIP encoder** (`makeZip`)
  with a CRC-32 table, so no library is needed.
- Work autosaves to `localStorage`; `Save .json` / `Load .json` move a project
  between browsers.
- File names come from the box name: used directly when it is filesystem-safe,
  otherwise sanitised (`my glyph` → `my-glyph.png`) or, failing that, written
  as codepoints (`ا` → `U+0627.png`). Unnamed boxes become `box-07.png`,
  repeated names get a `-2` suffix, and all-lowercase names get an `_lc` suffix
  so `a.png` and `A.png` survive case-insensitive filesystems.
