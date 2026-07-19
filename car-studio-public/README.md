# StudioTheMobile Public — Parametric Car Design Studio

**Live at [`/car-studio-public/`](https://kkasra10.github.io/car-studio-public/)** · runs entirely in the browser · zero dependencies beyond the vendored three.js

> **This is the public build** — open to everyone, indexable, free to play with.
> It is fully independent from the private studio at `/car-studio/`: a separate copy of the code
> with separate browser storage (`studiothemobile.public.*` keys), so nothing done here can ever
> touch the private library, and the two can evolve apart.

StudioTheMobile lets a designer with **no 3D-modelling background** produce a dimensionally credible car
concept in minutes and hand it to a senior team as real geometry. You never sculpt — you make
*engineering decisions* (wheelbase, overhangs, greenhouse, stance) and the studio lofts the surfaces.

## The three pillars

| Pillar | How it shows up |
|---|---|
| **Customisability** | 29 live parameters in real millimetres/degrees (chassis, body, greenhouse, wheels), a swappable parts kit (fascias, wheels, spoilers, splitters, rails…), character-line controls and a paint system. Two designers starting from the same template end up somewhere completely different. |
| **Informativeness** | Every slider carries a glossary tooltip (what it is *and why a designer cares*), the engineering copilot computes live metrics (frontal area, Cd estimate, approach/departure angles, turning circle, concept mass) with their formulas disclosed, and a design-review engine warns when a choice leaves the realistic envelope of the chosen segment. Using the tool **is** the training. |
| **Scalability** | Designs are plain JSON spec sheets and shareable URLs; meshes export to OBJ for Blender/Maya/CAD; blueprints export as PNG. The studio itself is static files on GitHub Pages — rolling it out to 5 or 500 recruits costs the same: nothing. |

## Segments — grounded in real published dimensions

Seven templates, each seeded from manufacturer-published exterior specs of benchmark vehicles:

| Segment | Topology | Benchmarks (published dims) |
|---|---|---|
| Sports coupé | three-box | Porsche 911 (992), Toyota GR Supra, Porsche 718 Cayman |
| Sedan (D-seg) | three-box | BMW 530i (G30), Toyota Camry, Tesla Model 3 |
| SUV / Crossover | two-box | Toyota RAV4, Tesla Model Y, Honda CR-V |
| Hatchback (C-seg) | two-box | VW Golf Mk8, Honda Civic, Hyundai i30 |
| Estate / Wagon | two-box | Audi A4 Avant, Volvo V60, VW Passat Variant |
| Pickup | cab + bed | Toyota Hilux DC, Ford Ranger, Ford F-150 |
| Roadster | open cockpit | Mazda MX-5 (ND), Porsche 718 Boxster, BMW Z4 |

Benchmark figures are used as **dimensional ground truth only** — no manufacturer geometry is
included; every surface is generated parametrically.

## Features

- **Parametric body generation** — a 96-ring loft over four topologies (three-box, two-box,
  pickup, roadster) with beltline/greenhouse two-tier sections, tumblehome, wheel-arch cutouts,
  fender flares and character lines.
- **Engineering copilot** — live derived metrics, ~13 design-review rules with per-segment norm
  bands, and a benchmark table that highlights the closest real car to your concept.
- **Exports** — Wavefront OBJ (metres, opens in any DCC/CAD), JSON spec sheet (re-importable,
  the save/share interchange format), dimensioned blueprint PNG (side/plan/front/rear on a
  blueprint grid), and share links that encode the entire design in the URL.
- **Studio library** — named saves with thumbnails in localStorage, plus import/export for moving
  designs between machines.
- **Ownership hierarchy** — set your designer name (👤) and every design you save is owned by it.
  Designs shared by link or spec file fork into the recipient's own credited copy when they save
  (`based on …` lineage), and an owner can hand a design to a new maintainer with **Transfer** in
  the Library. Cooperative workflow, not cryptographic security.
- **Private / offline use** — `offline.html` is the entire studio in one self-contained file:
  download it, double-click it, design with no server, CDN, or network at all. Regenerate it after
  source edits with `node car-studio/build-offline.mjs`.
- **Viewport** — orbit/pan/zoom, orthographic side/front/top/rear views, turntable, 1.75 m scale
  figure, live dimension lines, 1 m floor grid. Keyboard: `1–5` views, `T` turntable,
  `H` figure, `D` dimensions, `G` grid.

## Extending (for the tools team)

Everything is data-driven from `data.js`:

- **New segment** → one object in `SEGMENTS` (defaults + benchmarks + norm bands).
- **New parameter** → one row in `PARAM_GROUPS`; the UI, glossary, spec sheets and share links
  pick it up automatically.
- **New part option** → one entry in `PART_OPTIONS` plus a builder case in `app.js`.

No build step. `index.html` + `style.css` + `data.js` + `app.js` + vendored `three.min.js` is the
entire deployment.

## Verification

Tested with an automated Playwright suite (25 checks): every segment builds NaN-free geometry with
sane metrics, every parameter survives min/max extremes, all wheel/spoiler/fascia options build,
OBJ/spec/blueprint/share-link exports round-trip, the library persists and reloads, tooltips and
design review respond, ownership stamping and fork-with-lineage behave, the offline single-file build boots from file://, and the layout holds on narrow viewports — all with zero console errors.
