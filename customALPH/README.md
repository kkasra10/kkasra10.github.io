# customALPH

A single-page tool for sketching a custom alphabet: one box per character, then
save the whole set as images.

Live at <https://kkasra10.github.io/customALPH/>.

## What it does

- **Define the set.** Type the characters you want (`ABC…`), use a preset
  (A–Z, a–z, 0–9, punctuation), or type space-separated words to get
  named boxes (`alef beh pe`). Re-applying a set keeps the drawings that
  already belong to matching labels.
- **Draw.** Sketch directly in a box with a mouse, finger or stylus — pen
  pressure varies the stroke weight. Double-click a box (or the ⛶ button)
  for a large editor with Prev/Next so you can work through the alphabet.
- **Guides.** Cap-height, x-height, baseline and descender lines, plus a
  ghost of the character to trace. Neither is exported.
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
- File names use the label when it is filesystem-safe, `U+XXXX` otherwise, and
  lowercase labels get an `_lc` suffix so `a.png` and `A.png` survive
  case-insensitive filesystems.
