/* StudioTheMobile — data layer.
   Everything the studio knows about the real world lives in this file:
   vehicle segments (with defaults derived from manufacturer-published
   dimensions), parameter definitions + glossary, benchmark tables, part
   catalogs, metric explanations and design-review rules' norm bands.

   To add a segment, a parameter or a part option, edit here — the UI,
   spec sheets, share links and copilot pick it up automatically. */

"use strict";

/* ───────────────────────── Parameter definitions ─────────────────────────
   key      → state key (also the spec-sheet field name)
   unit     → mm | ° | % | in
   min/max  → global slider envelope (deliberately wider than any one
              segment; the design review warns when you leave the segment's
              realistic band — freedom with feedback, not a fence)
   topo     → optional list of topologies the parameter applies to
   info     → glossary tooltip: what it is and why a designer cares       */

const PARAM_GROUPS = [
  {
    id: "chassis", title: "Chassis & stance",
    hint: "the skeleton — 80% of a car's character",
    params: [
      { key: "wheelbase", label: "Wheelbase", unit: "mm", min: 2100, max: 3900, step: 5,
        info: "Distance between front and rear axle centres. Long wheelbase = cabin space, stability, limousine calm; short = agility and a compact stance. The single most defining dimension of a car." },
      { key: "frontOverhang", label: "Front overhang", unit: "mm", min: 550, max: 1400, step: 5,
        info: "Nose length ahead of the front axle. Short overhangs read sporty and premium (engine behind the axle line); long ones usually mean a transverse engine and better pedestrian-impact packaging." },
      { key: "rearOverhang", label: "Rear overhang", unit: "mm", min: 450, max: 1600, step: 5,
        info: "Body length behind the rear axle. Carries the trunk (or pickup bed). Too long looks barge-like; too short costs cargo and rear crash structure." },
      { key: "groundClearance", label: "Ground clearance", unit: "mm", min: 70, max: 380, step: 5,
        info: "Underbody height above the road. Sports cars run 90–120 mm for aero and centre of gravity; off-roaders need 200 mm+ to clear obstacles. Directly drives approach/departure angles." },
      { key: "wheelInset", label: "Wheel inset", unit: "mm", min: 10, max: 130, step: 5,
        info: "How far the tyre face sits inboard of the widest bodywork. Small inset = flush, planted, motorsport stance; large inset looks under-tyred (\"lost in the arches\")." },
    ],
  },
  {
    id: "body", title: "Body",
    hint: "volumes and surfaces",
    params: [
      { key: "bodyWidth", label: "Overall width", unit: "mm", min: 1560, max: 2150, step: 5,
        info: "Widest point of the body (mirrors excluded). Width is presence — but above ~1900 mm city parking suffers, and 2000 mm+ exceeds many European lane/garage norms." },
      { key: "beltHeight", label: "Beltline height", unit: "mm", min: 700, max: 1350, step: 5,
        info: "Height of the line where side glass meets sheet metal. A high beltline feels protective and massive; a low one gives visibility and an airy, classic look." },
      { key: "beltRise", label: "Beltline rise", unit: "mm", min: 0, max: 160, step: 5,
        info: "How much the beltline climbs from nose to tail. A rising beltline gives a wedgy, forward-leaping gesture; zero rise reads calm and architectural." },
      { key: "hoodHeight", label: "Hood height", unit: "mm", min: 580, max: 1200, step: 5,
        info: "Fender-top height at the front axle. Low hoods = sports car; high hoods = SUV/truck presence. Pedestrian-impact rules push modern hoods higher than the classics." },
      { key: "noseHeight", label: "Nose height", unit: "mm", min: 420, max: 1000, step: 5,
        info: "Body height at the very front bumper tip. Together with hood height it sets the front-end wedge angle." },
      { key: "tailHeight", label: "Tail height", unit: "mm", min: 550, max: 1300, step: 5,
        info: "Body height at the rear bumper tip. A high tail aids aero (clean kick-off edge) and trunk volume — the classic \"high deck\" look." },
      { key: "deckHeight", label: "Deck height", unit: "mm", min: 650, max: 1300, step: 5, topo: ["threebox", "roadster"],
        info: "Trunk-lid height on a three-box car — the third box (on a roadster: the tonneau deck behind the cockpit). Deck below beltline = classic notchback; deck near roof height = fastback." },
      { key: "noseTaper", label: "Nose taper", unit: "%", min: 0, max: 35, step: 1,
        info: "Plan-view narrowing of the body toward the front bumper. More taper = organic, aerodynamic nose; zero = slab-fronted truck look." },
      { key: "tailTaper", label: "Tail taper", unit: "%", min: 0, max: 35, step: 1,
        info: "Plan-view narrowing toward the rear bumper. Aerodynamically a gently tapered tail (boat-tailing) cuts wake size — but costs trunk width." },
      { key: "fenderFlare", label: "Fender flare", unit: "mm", min: 0, max: 90, step: 5,
        info: "Extra body width blistered around the wheel arches. The universal signal of performance — think widebody. Adds visual muscle at the cost of width." },
      { key: "creaseDepth", label: "Character line depth", unit: "mm", min: 0, max: 35, step: 1,
        info: "How far the side character line (the sculpted crease running along the doors) projects from the body. Zero = soft, minimal surfacing; 20 mm+ = dramatic, chiselled flanks that catch hard light." },
      { key: "creasePos", label: "Character line height", unit: "%", min: 20, max: 80, step: 1,
        info: "Where the character line sits between the rocker (0%) and the beltline (100%). High lines stretch and lower the car visually; low lines add a heavy, planted base." },
    ],
  },
  {
    id: "greenhouse", title: "Greenhouse",
    hint: "the glass volume above the beltline",
    params: [
      { key: "roofHeight", label: "Overall height", unit: "mm", min: 1150, max: 1980, step: 5,
        info: "Roof peak above the road — the car's headline height figure. Every 10 mm lower reads sportier and cuts frontal area; headroom and ingress pay the bill." },
      { key: "cowlOffset", label: "Cowl position", unit: "mm", min: 150, max: 950, step: 10,
        info: "Where the windshield base sits, measured aft of the front axle. A large offset = long \"dash-to-axle\", the classic premium/RWD proportion; cab-forward designs minimise it for cabin space." },
      { key: "windshieldRake", label: "Windshield rake", unit: "°", min: 20, max: 72, step: 1,
        info: "Windshield angle from vertical. More rake = lower drag and a fast silhouette; less = upright, commanding, truck-like. Beyond ~68° glare and glass area become real problems." },
      { key: "roofLength", label: "Roof length", unit: "mm", min: 500, max: 2300, step: 10, topo: ["threebox", "twobox", "pickup"],
        info: "Length of the flat-ish roof plateau between windshield header and rear-glass header. Long roof = wagon/SUV practicality; short roof = coupé." },
      { key: "rearGlassAngle", label: "Rear glass angle", unit: "°", min: 5, max: 75, step: 1,
        info: "Backlight angle from vertical. Near-vertical = hatch/SUV tailgate; ~60–70° = fastback. The angle largely decides whether air stays attached or breaks away cleanly — mid values (30–50°) can be the aero worst case." },
      { key: "tumblehome", label: "Tumblehome", unit: "°", min: 0, max: 18, step: 0.5,
        info: "Inward lean of the side glass from vertical. Generous tumblehome makes a car look grounded and athletic; zero tumblehome is the boxy vintage/G-Wagen look. Also affects shoulder room." },
      { key: "greenhouseTaper", label: "Greenhouse taper", unit: "%", min: 0, max: 28, step: 1,
        info: "Plan-view narrowing of the glass volume toward the rear. Creates broad \"shoulders\" over the rear fenders — a signature of muscular design." },
      { key: "roofCrown", label: "Roof crown", unit: "mm", min: 5, max: 70, step: 5,
        info: "Curvature (rise at centre) of the roof in cross-section. Crown adds structural stiffness and softens the silhouette; near-zero crown reads utilitarian." },
    ],
  },
  {
    id: "wheels", title: "Wheels & tyres",
    hint: "where the design meets the road",
    params: [
      { key: "wheelDiameter", label: "Tyre outer Ø", unit: "mm", min: 540, max: 900, step: 5,
        info: "Overall tyre diameter. Bigger wheels fill the arches and lift visual quality instantly — every concept sketch cheats them large. Ride comfort and unsprung mass push back in production." },
      { key: "rimDiameter", label: "Rim size", unit: "in", min: 14, max: 24, step: 1,
        info: "Rim diameter in inches. The gap between rim and tyre outer Ø is the sidewall: thin = performance look, tall = comfort/off-road." },
      { key: "tireWidth", label: "Tyre width", unit: "mm", min: 155, max: 355, step: 10,
        info: "Tyre section width. Wide tyres = grip and stance; narrow = efficiency. Above ~305 mm you are in supercar territory." },
      { key: "archGap", label: "Arch gap", unit: "mm", min: 25, max: 130, step: 5,
        info: "Radial gap between tyre and wheel-arch lip. Small gaps look planted (show cars run ~30 mm); big gaps allow suspension travel — off-roaders need 80 mm+." },
    ],
  },
];

/* Flat index: key → def */
const PARAM_INDEX = {};
PARAM_GROUPS.forEach(g => g.params.forEach(p => { PARAM_INDEX[p.key] = p; }));

/* ───────────────────────── Component (parts-kit) catalog ───────────────────────── */

const PART_OPTIONS = {
  fascia: {
    label: "Front fascia", type: "select",
    info: "The face of the car. A blanked-off fascia reads EV; a horizontal bar reads executive; a tall central grille reads truck/SUV presence; twin side intakes read motorsport cooling.",
    options: [
      { id: "ev",    name: "Blanked (EV)" },
      { id: "bar",   name: "Horizontal bar" },
      { id: "hex",   name: "Central grille" },
      { id: "split", name: "Twin intakes" },
    ],
  },
  wheelStyle: {
    label: "Wheel design", type: "select",
    info: "Swappable rim designs from the parts kit. Wheels are the jewellery of a car — the fastest way to change its character without touching a surface.",
    options: [
      { id: "sport5",  name: "5-spoke sport" },
      { id: "multi",   name: "10-spoke multi" },
      { id: "mesh",    name: "Motorsport mesh" },
      { id: "aero",    name: "Aero disc (EV)" },
      { id: "steel",   name: "Steel utility" },
    ],
  },
  spoiler: {
    label: "Rear spoiler", type: "select",
    info: "Rear aero from the parts kit. A lip adds subtle intent, a ducktail is retro-motorsport, a wing on struts is maximum attack — and maximum drag if you don't need the downforce.",
    options: [
      { id: "none",     name: "None" },
      { id: "lip",      name: "Lip spoiler" },
      { id: "ducktail", name: "Ducktail" },
      { id: "wing",     name: "Wing on struts" },
    ],
  },
  splitter: { label: "Front splitter", type: "toggle",
    info: "A forward-projecting blade at the front bumper's base. Generates front downforce and visually drops the car onto the road. Hopeless over speed bumps below ~100 mm clearance." },
  mirrors:  { label: "Door mirrors", type: "toggle",
    info: "Regulation door mirrors. Turn them off to preview a camera-mirror (e-mirror) design — legal in a growing number of markets." },
  roofRails: { label: "Roof rails", type: "toggle",
    info: "Longitudinal load rails. Instantly says \"utility\": expected on SUVs and wagons, jarring on a sports coupé." },
  sharkFin: { label: "Shark-fin antenna", type: "toggle",
    info: "The combined GPS/LTE antenna pod at the roof's trailing edge. A small detail that makes a model read \"production-ready\"." },
  exhaust: {
    label: "Exhaust", type: "select",
    info: "Visible exhaust finishers. Dual/quad outlets signal performance; \"hidden\" is the EV / clean-diffuser look.",
    options: [
      { id: "none",   name: "Hidden / EV" },
      { id: "single", name: "Single" },
      { id: "dual",   name: "Dual" },
      { id: "quad",   name: "Quad" },
    ],
  },
};

const PAINT_OPTIONS = {
  body:   { label: "Body paint",  type: "color" },
  finish: { label: "Finish", type: "select",
            options: [ { id: "gloss", name: "Gloss" }, { id: "satin", name: "Satin" }, { id: "matte", name: "Matte" } ] },
  glass:  { label: "Glass tint",  type: "color" },
  accent: { label: "Trim accent", type: "color" },
};

/* ───────────────────────── Vehicle segments ─────────────────────────
   defaults derived from the first benchmark's manufacturer-published
   dimensions; benchmarks are published exterior specs (mm / kg).      */

const SEGMENTS = [
  {
    id: "sports", name: "Sports coupé", topology: "threebox",
    desc: "Low, wide, wheel-at-each-corner",
    blurb: "Proportions of the 911 / Supra class: roof ~1.30 m, generous track, minimal overhangs.",
    benchmarks: [
      { name: "Porsche 911 Carrera (992)", L: 4519, WB: 2450, W: 1852, H: 1298, kg: 1505 },
      { name: "Toyota GR Supra",           L: 4379, WB: 2470, W: 1854, H: 1292, kg: 1570 },
      { name: "Porsche 718 Cayman",        L: 4379, WB: 2475, W: 1801, H: 1295, kg: 1365 },
    ],
    defaults: {
      wheelbase: 2450, frontOverhang: 980, rearOverhang: 1090, groundClearance: 110, wheelInset: 50,
      bodyWidth: 1852, beltHeight: 950, beltRise: 70, hoodHeight: 760, noseHeight: 560,
      tailHeight: 1060, deckHeight: 1090, noseTaper: 16, tailTaper: 10, fenderFlare: 40,
      creaseDepth: 14, creasePos: 60,
      roofHeight: 1298, cowlOffset: 380, windshieldRake: 62, roofLength: 900, rearGlassAngle: 66,
      tumblehome: 12, greenhouseTaper: 14, roofCrown: 30,
      wheelDiameter: 660, rimDiameter: 20, tireWidth: 265, archGap: 45,
    },
    parts: { fascia: "split", wheelStyle: "sport5", spoiler: "ducktail", splitter: true, mirrors: true, roofRails: false, sharkFin: false, exhaust: "dual" },
    norms: { wbRatio: [0.52, 0.58], H: [1230, 1400], clearance: [90, 135], W: [1750, 1950] },
  },
  {
    id: "sedan", name: "Sedan (D-seg)", topology: "threebox",
    desc: "Three-box executive benchmark",
    blurb: "5-series / Camry class: ~4.9 m long, long dash-to-axle, formal three-box silhouette.",
    benchmarks: [
      { name: "BMW 530i (G30)",   L: 4936, WB: 2975, W: 1868, H: 1479, kg: 1620 },
      { name: "Toyota Camry",     L: 4885, WB: 2825, W: 1840, H: 1445, kg: 1550 },
      { name: "Tesla Model 3",    L: 4694, WB: 2875, W: 1849, H: 1443, kg: 1765 },
    ],
    defaults: {
      wheelbase: 2975, frontOverhang: 860, rearOverhang: 1100, groundClearance: 140, wheelInset: 60,
      bodyWidth: 1868, beltHeight: 1010, beltRise: 45, hoodHeight: 810, noseHeight: 620,
      tailHeight: 980, deckHeight: 1060, noseTaper: 14, tailTaper: 12, fenderFlare: 15,
      creaseDepth: 10, creasePos: 62,
      roofHeight: 1479, cowlOffset: 520, windshieldRake: 60, roofLength: 1250, rearGlassAngle: 62,
      tumblehome: 10, greenhouseTaper: 10, roofCrown: 35,
      wheelDiameter: 680, rimDiameter: 18, tireWidth: 245, archGap: 60,
    },
    parts: { fascia: "bar", wheelStyle: "multi", spoiler: "lip", splitter: false, mirrors: true, roofRails: false, sharkFin: true, exhaust: "dual" },
    norms: { wbRatio: [0.57, 0.62], H: [1420, 1520], clearance: [120, 165], W: [1800, 1930] },
  },
  {
    id: "suv", name: "SUV / Crossover", topology: "twobox",
    desc: "High beltline, best-seller class",
    blurb: "RAV4 / Model Y class: tall two-box body, ~200 mm clearance, upright tailgate.",
    benchmarks: [
      { name: "Toyota RAV4",   L: 4600, WB: 2690, W: 1855, H: 1685, kg: 1590 },
      { name: "Tesla Model Y", L: 4751, WB: 2890, W: 1921, H: 1624, kg: 1930 },
      { name: "Honda CR-V",    L: 4694, WB: 2700, W: 1866, H: 1681, kg: 1615 },
    ],
    defaults: {
      wheelbase: 2690, frontOverhang: 920, rearOverhang: 990, groundClearance: 200, wheelInset: 55,
      bodyWidth: 1855, beltHeight: 1090, beltRise: 55, hoodHeight: 950, noseHeight: 720,
      tailHeight: 1130, deckHeight: 1100, noseTaper: 12, tailTaper: 8, fenderFlare: 35,
      creaseDepth: 12, creasePos: 55,
      roofHeight: 1685, cowlOffset: 430, windshieldRake: 50, roofLength: 1650, rearGlassAngle: 22,
      tumblehome: 8, greenhouseTaper: 8, roofCrown: 30,
      wheelDiameter: 720, rimDiameter: 18, tireWidth: 225, archGap: 65,
    },
    parts: { fascia: "hex", wheelStyle: "multi", spoiler: "lip", splitter: false, mirrors: true, roofRails: true, sharkFin: true, exhaust: "single" },
    norms: { wbRatio: [0.56, 0.62], H: [1580, 1780], clearance: [175, 240], W: [1800, 1980] },
  },
  {
    id: "hatch", name: "Hatchback (C-seg)", topology: "twobox",
    desc: "Compact two-box all-rounder",
    blurb: "Golf class: 4.28 m, two-box, upright liftgate — the European packaging masterclass.",
    benchmarks: [
      { name: "VW Golf (Mk8)",      L: 4284, WB: 2636, W: 1789, H: 1456, kg: 1320 },
      { name: "Honda Civic hatch",  L: 4551, WB: 2735, W: 1802, H: 1415, kg: 1385 },
      { name: "Hyundai i30",        L: 4340, WB: 2650, W: 1795, H: 1455, kg: 1345 },
    ],
    defaults: {
      wheelbase: 2636, frontOverhang: 880, rearOverhang: 770, groundClearance: 145, wheelInset: 50,
      bodyWidth: 1789, beltHeight: 1010, beltRise: 60, hoodHeight: 840, noseHeight: 640,
      tailHeight: 1080, deckHeight: 1050, noseTaper: 13, tailTaper: 9, fenderFlare: 20,
      creaseDepth: 9, creasePos: 58,
      roofHeight: 1456, cowlOffset: 430, windshieldRake: 55, roofLength: 1330, rearGlassAngle: 25,
      tumblehome: 9, greenhouseTaper: 9, roofCrown: 30,
      wheelDiameter: 635, rimDiameter: 17, tireWidth: 225, archGap: 55,
    },
    parts: { fascia: "bar", wheelStyle: "multi", spoiler: "lip", splitter: false, mirrors: true, roofRails: false, sharkFin: true, exhaust: "single" },
    norms: { wbRatio: [0.59, 0.63], H: [1400, 1500], clearance: [125, 165], W: [1720, 1830] },
  },
  {
    id: "pickup", name: "Pickup", topology: "pickup",
    desc: "Cab + open bed workhorse",
    blurb: "Hilux / Ranger class: ladder-frame stance, 300 mm clearance, cab plus cargo bed.",
    benchmarks: [
      { name: "Toyota Hilux DC",  L: 5325, WB: 3085, W: 1855, H: 1815, kg: 2110 },
      { name: "Ford Ranger",      L: 5370, WB: 3270, W: 1918, H: 1886, kg: 2245 },
      { name: "Ford F-150",       L: 5885, WB: 3695, W: 2030, H: 1961, kg: 2250 },
    ],
    defaults: {
      wheelbase: 3085, frontOverhang: 900, rearOverhang: 1340, groundClearance: 310, wheelInset: 55,
      bodyWidth: 1855, beltHeight: 1180, beltRise: 20, hoodHeight: 1050, noseHeight: 800,
      tailHeight: 1180, deckHeight: 1180, noseTaper: 10, tailTaper: 4, fenderFlare: 30,
      creaseDepth: 11, creasePos: 48,
      roofHeight: 1815, cowlOffset: 480, windshieldRake: 45, roofLength: 1150, rearGlassAngle: 12,
      tumblehome: 7, greenhouseTaper: 6, roofCrown: 25,
      wheelDiameter: 775, rimDiameter: 17, tireWidth: 265, archGap: 75,
    },
    parts: { fascia: "hex", wheelStyle: "steel", spoiler: "none", splitter: false, mirrors: true, roofRails: false, sharkFin: true, exhaust: "single" },
    norms: { wbRatio: [0.55, 0.63], H: [1750, 2000], clearance: [220, 330], W: [1800, 2060] },
  },
  {
    id: "roadster", name: "Roadster", topology: "roadster",
    desc: "Open-top two-seater",
    blurb: "MX-5 / Boxster class: open cockpit, windscreen and tonneau, tiny footprint, driver-first proportions.",
    benchmarks: [
      { name: "Mazda MX-5 (ND)",     L: 3915, WB: 2310, W: 1735, H: 1235, kg: 1062 },
      { name: "Porsche 718 Boxster", L: 4379, WB: 2475, W: 1801, H: 1280, kg: 1365 },
      { name: "BMW Z4 (G29)",        L: 4324, WB: 2470, W: 1864, H: 1304, kg: 1405 },
    ],
    defaults: {
      wheelbase: 2310, frontOverhang: 815, rearOverhang: 790, groundClearance: 125, wheelInset: 45,
      bodyWidth: 1735, beltHeight: 900, beltRise: 55, hoodHeight: 720, noseHeight: 540,
      tailHeight: 960, deckHeight: 940, noseTaper: 15, tailTaper: 12, fenderFlare: 25,
      creaseDepth: 12, creasePos: 52,
      roofHeight: 1210, cowlOffset: 350, windshieldRake: 58, roofLength: 400, rearGlassAngle: 50,
      tumblehome: 10, greenhouseTaper: 12, roofCrown: 20,
      wheelDiameter: 620, rimDiameter: 17, tireWidth: 205, archGap: 45,
    },
    parts: { fascia: "split", wheelStyle: "sport5", spoiler: "lip", splitter: false, mirrors: true, roofRails: false, sharkFin: false, exhaust: "dual" },
    norms: { wbRatio: [0.54, 0.62], H: [1180, 1320], clearance: [100, 140], W: [1700, 1900] },
  },
  {
    id: "wagon", name: "Estate / Wagon", topology: "twobox",
    desc: "Long-roof cargo athlete",
    blurb: "A4 Avant / V60 class: sedan platform, roof carried to the tail, upright liftgate over a full cargo bay.",
    benchmarks: [
      { name: "Audi A4 Avant (B9)",     L: 4762, WB: 2820, W: 1847, H: 1435, kg: 1520 },
      { name: "Volvo V60",              L: 4761, WB: 2872, W: 1850, H: 1432, kg: 1750 },
      { name: "VW Passat Variant (B8)", L: 4767, WB: 2791, W: 1832, H: 1477, kg: 1462 },
    ],
    defaults: {
      wheelbase: 2820, frontOverhang: 880, rearOverhang: 1062, groundClearance: 140, wheelInset: 55,
      bodyWidth: 1847, beltHeight: 1000, beltRise: 40, hoodHeight: 800, noseHeight: 620,
      tailHeight: 1090, deckHeight: 1050, noseTaper: 13, tailTaper: 8, fenderFlare: 15,
      creaseDepth: 10, creasePos: 62,
      roofHeight: 1435, cowlOffset: 500, windshieldRake: 58, roofLength: 1850, rearGlassAngle: 28,
      tumblehome: 9, greenhouseTaper: 8, roofCrown: 32,
      wheelDiameter: 660, rimDiameter: 17, tireWidth: 225, archGap: 60,
    },
    parts: { fascia: "bar", wheelStyle: "multi", spoiler: "lip", splitter: false, mirrors: true, roofRails: true, sharkFin: true, exhaust: "dual" },
    norms: { wbRatio: [0.57, 0.62], H: [1400, 1500], clearance: [120, 165], W: [1800, 1930] },
  },
];

const SEGMENT_INDEX = {};
SEGMENTS.forEach(s => { SEGMENT_INDEX[s.id] = s; });

const DEFAULT_PAINT = {
  sports:   { body: "#b8342c", finish: "gloss", glass: "#18222c", accent: "#20242a" },
  sedan:    { body: "#3c4757", finish: "gloss", glass: "#18222c", accent: "#20242a" },
  suv:      { body: "#5a6a5d", finish: "satin", glass: "#18222c", accent: "#23262b" },
  hatch:    { body: "#c8c9cc", finish: "gloss", glass: "#18222c", accent: "#202329" },
  pickup:   { body: "#7a3f2a", finish: "satin", glass: "#18222c", accent: "#25272b" },
  roadster: { body: "#a01f2d", finish: "gloss", glass: "#18222c", accent: "#1d2026" },
  wagon:    { body: "#31506e", finish: "gloss", glass: "#18222c", accent: "#20242a" },
};

/* ───────────────────────── Derived-metric explanations ───────────────────────── */

const METRIC_DEFS = {
  wbRatio:   { label: "Wheelbase / length",
    info: "The proportion metric designers check first. Higher = wheels pushed to the corners (premium, planted); lower = big overhangs. Typical: hatch ~0.61, sedan ~0.59, sports ~0.55." },
  dashAxle:  { label: "Dash-to-axle",
    info: "Distance from front-axle centre to the windshield base (cowl). A long dash-to-axle is the classic signal of a longitudinal-engine, rear-drive luxury layout." },
  frontal:   { label: "Frontal area",
    info: "Projected face of the car: A ≈ 0.85 × width × height. Together with Cd it sets aerodynamic drag — the dominant force above ~70 km/h." },
  cd:        { label: "Drag coeff. (est.)",
    info: "Heuristic estimate from windshield rake, backlight angle, ride height, taper and greenhouse shape. Use it to compare your own iterations, not to quote in a press release. Production cars: ~0.22 (EV sedans) to ~0.45 (boxy 4×4s)." },
  cda:       { label: "Drag area CdA",
    info: "Cd × frontal area — the number the wind actually feels. Below ~0.6 m² is slippery; above ~1.0 m² is a brick." },
  approach:  { label: "Approach angle",
    info: "Steepest ramp the nose clears: atan(front lowest point ÷ distance to front tyre contact). Off-road credibility starts ~20°; sports cars with splitters manage ~7°." },
  departure: { label: "Departure angle",
    info: "Same as approach, for the tail. The first thing that scrapes leaving a steep driveway." },
  turning:   { label: "Turning circle (est.)",
    info: "Kerb-to-kerb diameter ≈ 2 × (wheelbase ÷ sin 33° + half track), assuming a typical 33° steering lock. City usability threshold is ~11 m." },
  mass:      { label: "Concept mass (est.)",
    info: "Bounding volume × per-segment density factor, calibrated against the benchmark cars. A packaging-stage guess (±10%) — real mass comes from engineering, not styling." },
  bed:       { label: "Bed length",
    info: "Usable cargo-bed length behind the cab. The reason pickups exist: 1.5 m carries a euro-pallet with the gate up." },
};

/* ───────────────────────── Design-review rules ─────────────────────────
   Each rule returns null (pass) or { level: info|warn|alert, msg }.      */

const REVIEW_RULES = [
  (p, m, seg) => {
    const [lo, hi] = seg.norms.wbRatio;
    if (m.wbRatio < lo - 0.02) return { level: "alert", msg: `Wheelbase/length ${m.wbRatio.toFixed(2)} is far below the ${seg.name} band (${lo}–${hi}) — the overhangs dominate. Stretch the wheelbase or trim the overhangs.` };
    if (m.wbRatio < lo) return { level: "warn", msg: `Wheelbase/length ${m.wbRatio.toFixed(2)} sits below the ${seg.name} norm (${lo}–${hi}) — slightly overhang-heavy.` };
    if (m.wbRatio > hi + 0.02) return { level: "warn", msg: `Wheelbase/length ${m.wbRatio.toFixed(2)} is above the ${seg.name} band (${lo}–${hi}) — dramatic, but check bumper crash structure fits in those tiny overhangs.` };
    return null;
  },
  (p, m, seg) => {
    const [lo, hi] = seg.norms.H;
    if (p.roofHeight < lo || p.roofHeight > hi)
      return { level: "info", msg: `Overall height ${p.roofHeight} mm is outside the typical ${seg.name} window (${lo}–${hi} mm). Deliberate statement or accidental drift?` };
    return null;
  },
  (p, m, seg) => {
    const [lo, hi] = seg.norms.clearance;
    if (p.groundClearance < lo) return { level: "warn", msg: `Ground clearance ${p.groundClearance} mm is below the ${seg.name} norm (${lo}–${hi} mm) — speed bumps and driveways will eat this design.` };
    if (p.groundClearance > hi) return { level: "info", msg: `Ground clearance ${p.groundClearance} mm is above the ${seg.name} norm (${lo}–${hi} mm) — rugged look, but the centre of gravity climbs with it.` };
    return null;
  },
  (p) => {
    if (p.bodyWidth > 2000) return { level: "warn", msg: `Width ${p.bodyWidth} mm exceeds 2000 mm — many European garages, lanes and regulations become hostile past this point.` };
    return null;
  },
  (p, m, seg) => {
    if (seg.topology === "roadster") return null;             // no glasshouse on an open car
    const glasshouse = p.roofHeight - p.beltHeight;
    if (glasshouse < 260) return { level: "alert", msg: `Glasshouse is only ${glasshouse} mm tall (roof − beltline) — a gun-slit cabin. Striking in a render, undriveable in traffic. 300 mm is a practical floor.` };
    if (glasshouse < 320) return { level: "warn", msg: `Shallow glasshouse (${glasshouse} mm). Concept-car drama — check outward visibility targets before committing.` };
    return null;
  },
  (p) => {
    const archR = p.wheelDiameter / 2 + p.archGap;
    if (archR * 1.05 > p.frontOverhang) return { level: "warn", msg: `Front overhang (${p.frontOverhang} mm) barely clears the wheel arch (r≈${Math.round(archR)} mm) — the bumper is almost on the tyre. Bold, but leaves no crush space.` };
    return null;
  },
  (p) => {
    if (p.wheelDiameter / 2 + p.archGap > p.beltHeight * 0.82)
      return { level: "warn", msg: `Wheel arches are cutting very close to the beltline — the tyre package is oversized for the body side, or the beltline is too low for these wheels.` };
    return null;
  },
  (p, m) => {
    if (m.approachDeg < 8 && p.groundClearance >= 140)
      return { level: "info", msg: `Approach angle ${m.approachDeg.toFixed(0)}° is splitter-scraping territory despite the ride height — the front overhang is doing the damage.` };
    return null;
  },
  (p, m, seg) => {
    if (seg.id === "suv" || seg.id === "pickup") {
      if (m.approachDeg < 20) return { level: "warn", msg: `Approach angle ${m.approachDeg.toFixed(0)}° undercuts the ~20° off-road credibility floor for a ${seg.name}. Raise the nose or pull in the front overhang.` };
      if (m.departureDeg < 20) return { level: "warn", msg: `Departure angle ${m.departureDeg.toFixed(0)}° is low for a ${seg.name} — the tail will drag leaving any real trail.` };
    }
    return null;
  },
  (p, m) => {
    if (m.turningM > 13) return { level: "warn", msg: `Estimated turning circle ${m.turningM.toFixed(1)} m — this design will three-point-turn through life. Long wheelbase is the culprit.` };
    return null;
  },
  (p) => {
    if (p.windshieldRake > 66) return { level: "info", msg: `Windshield rake ${p.windshieldRake}° is extreme — expect glare, a huge glass roof load and an A-pillar blind spot. Show-car territory.` };
    return null;
  },
  (p, m, seg) => {
    if (seg.topology === "threebox" && p.deckHeight > p.roofHeight - 120)
      return { level: "info", msg: `Deck height is within 120 mm of the roof — this three-box is reading as a fastback. If that's the intent, also raise the rear-glass angle.` };
    return null;
  },
  (p, m, seg) => {
    if (seg.topology === "pickup" && m.bedLen < 1400)
      return { level: "warn", msg: `Bed length ≈ ${Math.round(m.bedLen)} mm won't take a euro-pallet (1200 mm) with clearance — stretch the rear overhang or shorten the cab.` };
    return null;
  },
];
