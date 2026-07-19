/* StudioTheMobile — engine.
   Parametric body generation, viewport, engineering copilot, exports.
   Depends on data.js (segments, params, parts, rules) and three.min.js. */

"use strict";

/* ═══════════════════════════ helpers ═══════════════════════════ */

const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const clamp01 = v => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => { t = clamp01(t); return t * t * (3 - 2 * t); };           // smoothstep
const cosEase = t => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(t));               // cosine ease
const deg = d => d * Math.PI / 180;
const fmtMM = v => Math.round(v).toLocaleString("en-US") + " mm";

function download(filename, blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

let toastTimer = null;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add("hidden"), 2600);
}

/* ═══════════════════════════ state ═══════════════════════════ */

const IDENT_KEY = "studiothemobile.public.identity";
const getIdentity = () => localStorage.getItem(IDENT_KEY) || "";

const state = {
  name: "Untitled Concept",
  segment: "sports",
  params: {},
  parts: {},
  paint: {},
  meta: { owner: "", created: null, basedOn: null },
};

function applySegment(segId, keepName) {
  const seg = SEGMENT_INDEX[segId];
  state.segment = segId;
  state.params = Object.assign({}, seg.defaults);
  state.parts = Object.assign({}, seg.parts);
  state.paint = Object.assign({}, DEFAULT_PAINT[segId]);
  state.meta = { owner: getIdentity(), created: new Date().toISOString(), basedOn: null };
  if (!keepName) state.name = "Untitled " + seg.name;
}

function serializeDesign() {
  return {
    app: "StudioTheMobile", version: 1, units: "mm",
    name: state.name, segment: state.segment,
    date: new Date().toISOString().slice(0, 10),
    meta: Object.assign({}, state.meta),
    params: Object.assign({}, state.params),
    parts: Object.assign({}, state.parts),
    paint: Object.assign({}, state.paint),
    metrics: computeMetrics(state.params, SEGMENT_INDEX[state.segment]).sheet,
  };
}

function loadDesign(d) {
  if (!d || !d.params || !SEGMENT_INDEX[d.segment]) throw new Error("Not a StudioTheMobile spec sheet");
  applySegment(d.segment, true);
  state.name = d.name || "Imported concept";
  for (const k in d.params) if (k in PARAM_INDEX) {
    const def = PARAM_INDEX[k];
    state.params[k] = clamp(+d.params[k], def.min, def.max);
  }
  for (const k in d.parts || {}) if (k in PART_OPTIONS) state.parts[k] = d.parts[k];
  Object.assign(state.paint, d.paint || {});
  state.meta = Object.assign({ owner: "", created: null, basedOn: null }, d.meta || {});
  $("#design-name").value = state.name;
  refreshAllControls();
  rebuild();
}

/* ═══════════════════════════ profile curves ═══════════════════════════
   All curve functions work in metres. x runs from 0 (nose tip) to L (tail). */

function buildCurves(p, topology) {
  const mm = v => v / 1000;
  const L   = mm(p.frontOverhang + p.wheelbase + p.rearOverhang);
  const xFA = mm(p.frontOverhang), xRA = xFA + mm(p.wheelbase);
  const hw0 = mm(p.bodyWidth) / 2;
  const c   = mm(p.groundClearance);
  const tireR = mm(p.wheelDiameter) / 2;
  const archR = tireR + mm(p.archGap);
  const flare = mm(p.fenderFlare);

  const noseH = mm(p.noseHeight), hoodH = mm(p.hoodHeight), roofH = mm(p.roofHeight);
  const beltH = mm(p.beltHeight), beltRise = mm(p.beltRise);
  const tailH = mm(p.tailHeight);
  const crown = mm(p.roofCrown);
  const cowlH = Math.min(hoodH + 0.025, roofH - 0.15);

  /* key stations of the top curve */
  const xC  = clamp(xFA + mm(p.cowlOffset), xFA + 0.15, L * 0.55);           // cowl
  const rakeRun = Math.max(0.06, (roofH - cowlH) * Math.tan(deg(clamp(p.windshieldRake, 20, 74))));
  const xRF = clamp(xC + rakeRun, xC + 0.06, L - 0.55);                       // roof front
  let xRR = clamp(xRF + mm(p.roofLength), xRF + 0.15, L - 0.30);             // roof rear
  if (topology === "roadster") xRR = xRF + 0.02;                              // open top: header only

  const bedRail = beltH + 0.06;
  let glassBaseH, xGE;                                                        // rear-glass base height / end x
  if (topology === "threebox" || topology === "roadster") {
    glassBaseH = clamp(mm(p.deckHeight), beltH - 0.05, roofH - 0.08);
  } else if (topology === "pickup") {
    glassBaseH = bedRail;
  } else {
    glassBaseH = Math.max(tailH, beltH - 0.02) + 0.02;
  }
  const rearRun = Math.max(0.04, (roofH - glassBaseH) * Math.tan(deg(clamp(p.rearGlassAngle, 5, 76))));
  xGE = clamp(xRR + rearRun, xRR + 0.04, L - 0.10);

  function topY(x) {
    if (x <= xFA) return lerp(noseH, hoodH, cosEase(x / xFA));
    if (x <= xC)  return lerp(hoodH, cowlH, cosEase((x - xFA) / (xC - xFA)));
    if (x <= xRF) return lerp(cowlH, roofH, (x - xC) / (xRF - xC));           // windshield: straight
    if (x <= xRR) {                                                           // roof plateau, slight arc
      const t = (x - xRF) / (xRR - xRF);
      return roofH - 0.010 * (2 * t - 1) * (2 * t - 1);
    }
    if (x <= xGE) return lerp(roofH - 0.010, glassBaseH, (x - xRR) / (xGE - xRR)); // backlight: straight
    if (topology === "pickup") return bedRail;                                // bed rail to tail
    return lerp(glassBaseH, tailH, cosEase((x - xGE) / Math.max(0.05, L - xGE)));
  }

  /* 1 across glazing bands (windshield + backlight), for the canopy surface */
  function glassTop(x) {
    if (x > xC + 0.02 && x < xRF - 0.02) return 1;
    if (topology === "roadster") return 0;                    // nothing behind the windscreen
    if (x > xRR + 0.02 && x < xGE - 0.02 && (topology !== "pickup" || xGE - xRR > 0.10)) return 1;
    return 0;
  }
  /* 0→1 where the two-tier (belt + greenhouse) section applies */
  function glassness(x) {
    if (x < xC || x > xGE) return 0;
    const inRamp  = smooth((x - xC) / Math.max(0.05, (xRF - xC) * 0.5));
    const outRamp = smooth((xGE - x) / Math.max(0.05, (xGE - xRR) * 0.6));
    return Math.min(inRamp, outRamp);
  }

  const beltY = x => Math.min(beltH + beltRise * clamp01((x - xFA) / Math.max(0.1, L - xFA)), roofH - 0.10);

  function baseBottom(x) {
    let y = c;
    const noseLift = c * 0.55 + 0.030, tailLift = c * 0.50 + 0.045;
    if (x < xFA * 0.55) y += noseLift * cosEase(1 - x / (xFA * 0.55));
    const tz = L - mm(p.rearOverhang) * 0.60;
    if (x > tz) y += tailLift * cosEase((x - tz) / (L - tz));
    return y;
  }
  function archLift(x) {
    let y = 0;
    for (const xA of [xFA, xRA]) {
      const dx = x - xA;
      if (Math.abs(dx) < archR) y = Math.max(y, tireR + Math.sqrt(Math.max(0, archR * archR - dx * dx)) - 0.01);
    }
    return y;
  }
  const bottomSide   = x => Math.max(baseBottom(x), archLift(x));
  const bottomCenter = x => baseBottom(x);

  function halfW(x) {
    const noseW = 1 - p.noseTaper / 100, tailW = 1 - p.tailTaper / 100;
    let f;
    if (x < xFA * 1.05)      f = lerp(noseW, 1, cosEase(x / (xFA * 1.05)));
    else if (x > xRA * 0.98) f = lerp(1, tailW, cosEase((x - xRA * 0.98) / Math.max(0.05, L - xRA * 0.98)));
    else f = 1;
    /* rounded plan corners at the very ends */
    f *= (0.62 + 0.38 * smooth(x / 0.14)) * (0.68 + 0.32 * smooth((L - x) / 0.17));
    let w = hw0 * f;
    for (const xA of [xFA, xRA]) {                                            // fender flares
      const dx = (x - xA) / (archR * 1.15);
      w += flare * Math.exp(-dx * dx * 2.2);
    }
    return w;
  }

  return { L, xFA, xRA, xC, xRF, xRR, xGE, hw0, tireR, archR, roofH, beltH,
           glassBaseH, bedRail, topY, beltY, bottomSide, bottomCenter, halfW,
           glassness, glassTop, crown, topology };
}

/* ═══════════════════════════ body mesh ═══════════════════════════ */

const RINGS = 96, RING_PTS = 16;

/* half-profile: 9 points from bottom-centre to top-centre */
function halfProfile(x, p, C) {
  const hw = C.halfW(x);
  const yT = C.topY(x);
  const yBC = C.bottomCenter(x), yBS = Math.min(C.bottomSide(x), yT - 0.05);
  const gl = C.glassness(x);
  const yBelt = Math.min(C.beltY(x), yT - 0.045);
  const crown = C.crown;
  const tumble = Math.tan(deg(state.params.tumblehome));

  const yShoulder = lerp(yT - 0.018 - crown * 0.5, yBelt, gl);
  let gz = hw - tumble * Math.max(0, yT - yShoulder) * gl;
  const tRear = clamp01((x - C.xRF) / Math.max(0.05, C.xGE - C.xRF));
  gz *= 1 - (state.params.greenhouseTaper / 100) * tRear * gl;
  gz = Math.max(gz, hw * 0.45);
  const rz = Math.max(gz * 0.86 - 0.008, hw * 0.25);

  const crease = (state.params.creaseDepth || 0) / 1000;
  const creaseT = clamp((state.params.creasePos || 55) / 100, 0.2, 0.8);
  return [
    [0,                      yBC],
    [hw * 0.62,              yBC + 0.004],
    [hw * 0.985,             yBS + 0.014],
    [hw + crease,            lerp(yBS, yShoulder, creaseT)],
    [hw,                     yShoulder],
    [lerp(hw - 0.008, gz, gl), yShoulder + lerp(0.012, 0.03, gl)],
    [lerp(hw * 0.60, rz, gl),  yT - crown * 0.42],
    [lerp(hw * 0.32, rz * 0.55, gl), yT - crown * 0.10],
    [0,                      yT],
  ];
}

function ringPoints(x, p, C) {
  const h = halfProfile(x, p, C);
  const ring = [];
  for (let i = 0; i < 9; i++)  ring.push([x, h[i][1],  h[i][0]]);   // +z side, bottom→top
  for (let i = 7; i >= 1; i--) ring.push([x, h[i][1], -h[i][0]]);   // mirrored back down
  return ring;                                                       // 16 points
}

/* edge k of the ring loop → material bucket, given band flags */
function edgeMaterial(k, gl, gTop) {
  if ((k === 5 || k === 10) && gl > 0.45) return 1;                  // side glass
  if (k >= 6 && k <= 9 && gTop > 0.5) return 1;                      // windshield / backlight canopy
  if (k <= 1 || k >= 14) return 2;                                   // underbody + rocker trim
  return 0;                                                          // paint
}

function buildBodyGeometry(p, C) {
  const pos = [];
  const rings = [];
  const glArr = [], gtArr = [];
  for (let i = 0; i < RINGS; i++) {
    const t = i / (RINGS - 1);
    const x = t * C.L;
    rings.push(ringPoints(x, p, C));
    glArr.push(C.glassness(x));
    gtArr.push(C.glassTop(x));
    for (const pt of rings[i]) pos.push(pt[0], pt[1], pt[2]);
  }
  const idxByMat = [[], [], []];
  for (let i = 0; i < RINGS - 1; i++) {
    for (let k = 0; k < RING_PTS; k++) {
      const k2 = (k + 1) % RING_PTS;
      const a = i * RING_PTS + k, b = i * RING_PTS + k2;
      const cIdx = (i + 1) * RING_PTS + k2, d = (i + 1) * RING_PTS + k;
      const m = edgeMaterial(k, Math.min(glArr[i], glArr[i + 1]), Math.min(gtArr[i], gtArr[i + 1]));
      idxByMat[m].push(a, cIdx, b, a, d, cIdx);
    }
  }
  /* nose & tail caps: fan to centroid */
  for (const [ringIdx, flip] of [[0, false], [RINGS - 1, true]]) {
    const ring = rings[ringIdx];
    let cy = 0, cz = 0;
    for (const pt of ring) { cy += pt[1]; cz += pt[2]; }
    const centIdx = pos.length / 3;
    pos.push(ring[0][0], cy / RING_PTS, cz / RING_PTS);
    for (let k = 0; k < RING_PTS; k++) {
      const a = ringIdx * RING_PTS + k, b = ringIdx * RING_PTS + (k + 1) % RING_PTS;
      if (flip) idxByMat[0].push(centIdx, b, a);
      else      idxByMat[0].push(centIdx, a, b);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  const index = [];
  let offset = 0;
  idxByMat.forEach((arr, m) => {
    index.push(...arr);
    geo.addGroup(offset, arr.length, m);
    offset += arr.length;
  });
  geo.setIndex(index);
  geo.computeVertexNormals();
  return geo;
}

/* ═══════════════════════════ wheels & parts ═══════════════════════════ */

function buildWheel(styleId, tireR, rimR, width, mats) {
  const g = new THREE.Group();
  const tireGeo = new THREE.CylinderGeometry(tireR, tireR, width, 36);
  tireGeo.rotateX(Math.PI / 2);
  const tire = new THREE.Mesh(tireGeo, mats.tire);
  tire.castShadow = true;
  g.add(tire);

  const face = width * 0.5;
  const disc = new THREE.CylinderGeometry(rimR, rimR, width * 0.55, 28);
  disc.rotateX(Math.PI / 2);

  /* rim assembly sits slightly proud of the tyre face so it reads from the side */
  const addSpokes = (n, wFrac, lFrac) => {
    const backing = new THREE.Mesh(
      new THREE.CylinderGeometry(rimR * 0.97, rimR * 0.97, width * 0.30, 28).rotateX(Math.PI / 2),
      mats.rimDark);
    backing.position.z = face * 0.92;
    g.add(backing);
    for (let i = 0; i < n; i++) {
      const sp = new THREE.Mesh(
        new THREE.BoxGeometry(rimR * lFrac, rimR * wFrac, width * 0.18), mats.rim);
      const a = (i / n) * Math.PI * 2;
      sp.position.set(Math.cos(a) * rimR * 0.48, Math.sin(a) * rimR * 0.48, face * 1.04);
      sp.rotation.z = a;
      g.add(sp);
    }
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(rimR * 0.95, rimR * 0.06, 8, 32), mats.rim);
    ring.position.z = face * 1.04;
    g.add(ring);
  };

  switch (styleId) {
    case "sport5": addSpokes(5, 0.34, 0.99); break;
    case "multi":  addSpokes(10, 0.16, 0.99); break;
    case "mesh":   addSpokes(14, 0.10, 0.99); break;
    case "aero": {
      const d = new THREE.Mesh(disc, mats.rim);
      d.position.z = face * 0.80;
      g.add(d);
      break;
    }
    case "steel": {
      const d = new THREE.Mesh(
        new THREE.CylinderGeometry(rimR * 0.82, rimR * 0.82, width * 0.55, 24).rotateX(Math.PI / 2),
        mats.rimDark);
      d.position.z = face * 0.78;
      g.add(d);
      break;
    }
  }
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(rimR * 0.18, rimR * 0.18, width * 0.55, 16).rotateX(Math.PI / 2), mats.rimDark);
  hub.position.z = face * 0.88;
  g.add(hub);
  if (styleId !== "steel") {                                          // painted brake caliper
    const cal = new THREE.Mesh(new THREE.BoxGeometry(rimR * 0.34, rimR * 0.42, width * 0.16), mats.caliper);
    cal.position.set(rimR * 0.55, 0.02, face * 0.30);
    g.add(cal);
  }
  return g;
}

function box(w, h, d, mat, x, y, z, ry, rx) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  if (ry) m.rotation.y = ry;
  if (rx) m.rotation.x = rx;
  m.castShadow = true;
  return m;
}

function buildParts(p, parts, C, mats) {
  const g = new THREE.Group();
  const L = C.L;

  /* lights — the details that make it read as a car */
  const hlX = 0.16, hlZ = C.halfW(hlX) * 0.55, hlY = Math.min(C.topY(hlX) - 0.055, p.noseHeight / 1000 - 0.01);
  for (const s of [1, -1])
    g.add(box(0.11, 0.05, 0.26, mats.headlight, hlX, hlY, s * hlZ, s * deg(-p.noseTaper * 1.2)));
  const tlZ = C.halfW(L - 0.07) - 0.10, tlY = C.topY(L - 0.05) - 0.09;
  for (const s of [1, -1])
    g.add(box(0.07, 0.06, 0.32, mats.taillight, L - 0.055, tlY, s * tlZ, s * deg(p.tailTaper * 0.8)));

  /* front fascia — the car's face */
  const nH = p.noseHeight / 1000, fw = C.halfW(0.06) * 2;
  if (parts.fascia === "bar") {
    g.add(box(0.05, 0.085, fw * 0.56, mats.trim, 0.012, nH * 0.66, 0));
  } else if (parts.fascia === "hex") {
    g.add(box(0.05, Math.min(0.17, nH * 0.36), fw * 0.36, mats.trim, 0.012, nH * 0.58, 0));
  } else if (parts.fascia === "split") {
    for (const s of [1, -1]) g.add(box(0.05, 0.10, fw * 0.17, mats.trim, 0.012, nH * 0.48, s * fw * 0.30));
    g.add(box(0.05, 0.045, fw * 0.30, mats.trim, 0.012, nH * 0.70, 0));
  }
  if (parts.fascia !== "ev") {                                        // lower cooling intake
    g.add(box(0.05, 0.055, fw * 0.44, mats.trim, 0.012, C.bottomCenter(0.04) + 0.055, 0));
  }

  /* interior mass — dash + seats silhouette, visible through the glazing */
  const ti0 = C.xC + 0.06, ti1 = Math.min(C.xRR + 0.55, C.xGE - 0.02, L - 0.30);
  if (ti1 > ti0 + 0.25) {
    const tmid = (ti0 + ti1) / 2;
    const tub = box(ti1 - ti0, 0.34, C.halfW(tmid) * 2 * 0.70, mats.bed, tmid, C.beltH - 0.11, 0);
    tub.castShadow = false;
    g.add(tub);
  }

  if (parts.splitter) {
    const w = C.halfW(0.15) * 2;
    g.add(box(0.34, 0.018, w * 0.94, mats.trim, 0.12, C.bottomCenter(0.05) - 0.002, 0));
  }
  const deckY = C.topY(L - 0.10), deckW = C.halfW(L - 0.12) * 2;
  if (parts.spoiler === "lip") {
    g.add(box(0.10, 0.02, deckW * 0.86, mats.paint, L - 0.07, deckY + 0.015, 0));
  } else if (parts.spoiler === "ducktail") {
    const dt = box(0.20, 0.024, deckW * 0.88, mats.paint, L - 0.11, deckY + 0.035, 0);
    dt.rotation.z = deg(-16);
    g.add(dt);
  } else if (parts.spoiler === "wing") {
    const wy = deckY + 0.16;
    const wing = box(0.24, 0.022, deckW * 0.94, mats.trim, L - 0.16, wy, 0);
    wing.rotation.z = deg(-8);
    g.add(wing);
    for (const s of [1, -1]) g.add(box(0.16, 0.14, 0.02, mats.trim, L - 0.14, wy - 0.075, s * deckW * 0.33));
  }
  if (parts.mirrors) {
    const mz = C.halfW(C.xC) - 0.01, my = C.beltY(C.xC) + 0.035;
    for (const s of [1, -1]) {
      g.add(box(0.05, 0.014, 0.09, mats.trim, C.xC + 0.02, my - 0.01, s * (mz + 0.045)));
      g.add(box(0.11, 0.075, 0.055, mats.paint, C.xC + 0.03, my + 0.02, s * (mz + 0.085)));
    }
  }
  if (parts.roofRails) {
    const len = C.xRR - C.xRF - 0.10, cx = (C.xRR + C.xRF) / 2;
    for (const s of [1, -1])
      g.add(box(len, 0.035, 0.045, mats.trim, cx, C.topY(cx) + 0.012, s * C.halfW(cx) * 0.62));
  }
  if (parts.sharkFin) {
    const fx = C.xRR - 0.10;
    const fin = box(0.17, 0.055, 0.045, mats.trim, fx, C.topY(fx) + 0.015, 0);
    fin.rotation.z = deg(9);
    g.add(fin);
  }
  if (parts.exhaust !== "none") {
    const ey = C.bottomCenter(L - 0.02) + 0.045, ex = L - 0.015;
    const zs = { single: [0.32], dual: [0.32, -0.32], quad: [0.30, 0.42, -0.30, -0.42] }[parts.exhaust] || [];
    for (const zf of zs) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.10, 16), mats.rim);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(ex, ey, zf * C.halfW(L - 0.1) * 2 * 0.7);
      g.add(pipe);
    }
  }
  if (C.topology === "pickup") {                                     /* open-bed illusion */
    const bx0 = C.xGE + 0.10, bx1 = L - 0.12;
    if (bx1 > bx0 + 0.2) {
      const bw = C.halfW((bx0 + bx1) / 2) * 2 - 0.20;
      g.add(box(bx1 - bx0, 0.008, bw, mats.bed, (bx0 + bx1) / 2, C.bedRail + 0.006, 0));
    }
  }
  return g;
}

function buildHuman(mats) {
  const g = new THREE.Group();
  const leg = new THREE.CylinderGeometry(0.07, 0.06, 0.82, 10);
  for (const s of [1, -1]) {
    const l = new THREE.Mesh(leg, mats.human);
    l.position.set(0, 0.41, s * 0.10);
    g.add(l);
  }
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.76, 12), mats.human);
  torso.position.y = 1.16;
  g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 12), mats.human);
  head.position.y = 1.64;
  g.add(head);
  g.traverse(o => { o.castShadow = true; });
  return g;
}

/* ═══════════════════════════ metrics ═══════════════════════════ */

const MASS_K = { sports: 138, sedan: 119, suv: 111, hatch: 118, pickup: 118, roadster: 129, wagon: 120 };

function computeMetrics(p, seg) {
  const L = p.frontOverhang + p.wheelbase + p.rearOverhang;
  const W = p.bodyWidth + 2 * p.fenderFlare;
  const H = p.roofHeight;
  const track = p.bodyWidth - 2 * p.wheelInset - p.tireWidth;
  const wbRatio = p.wheelbase / L;
  const frontal = 0.85 * (W / 1000) * (H / 1000);

  let cd = 0.26;
  cd += Math.max(0, (65 - p.windshieldRake)) * 0.0016;
  if (seg.topology === "threebox") {
    cd += (p.rearGlassAngle > 22 && p.rearGlassAngle < 52) ? 0.030 : 0.010;
  } else if (seg.topology === "roadster") cd += 0.065;        // open cockpit
  else cd += 0.055;
  cd += (p.groundClearance - 110) * 0.00025;
  cd -= (p.noseTaper + p.tailTaper) * 0.0012;
  cd -= p.tumblehome * 0.0015;
  if (p.roofCrown < 15) cd += 0.010;
  const parts = state.parts;
  if (parts.spoiler === "wing") cd += 0.020;
  if (parts.spoiler === "ducktail") cd += 0.004;
  if (parts.splitter) cd += 0.004;
  cd = clamp(cd, 0.20, 0.55);

  const noseLow = p.groundClearance * 1.55 + 30;
  const tailLow = p.groundClearance * 1.50 + 45;
  const approachDeg  = Math.atan2(noseLow, p.frontOverhang) * 180 / Math.PI;
  const departureDeg = Math.atan2(tailLow, p.rearOverhang) * 180 / Math.PI;
  const turningM = 2 * (p.wheelbase / Math.sin(deg(33)) + track / 2) / 1000;
  const massKg = (L / 1000) * (W / 1000) * (H / 1000) * (MASS_K[seg.id] || 118);

  let bedLen = 0;
  if (seg.topology === "pickup") {
    const C = buildCurves(p, seg.topology);
    bedLen = Math.max(0, (C.L - C.xGE - 0.20) * 1000);
  }

  const m = { L, W, H, track, wbRatio, frontal, cd, cda: cd * frontal,
              approachDeg, departureDeg, turningM, massKg, bedLen };
  m.sheet = {
    overallLength_mm: Math.round(L), overallWidth_mm: Math.round(W), overallHeight_mm: Math.round(H),
    wheelbase_mm: p.wheelbase, track_mm: Math.round(track),
    wheelbaseToLength: +wbRatio.toFixed(3),
    frontalArea_m2: +frontal.toFixed(2), dragCoeffEst: +cd.toFixed(3), dragAreaCdA_m2: +(cd * frontal).toFixed(3),
    approachAngle_deg: +approachDeg.toFixed(1), departureAngle_deg: +departureDeg.toFixed(1),
    turningCircleEst_m: +turningM.toFixed(1), conceptMassEst_kg: Math.round(massKg),
  };
  if (seg.topology === "pickup") m.sheet.bedLength_mm = Math.round(bedLen);
  return m;
}

/* ═══════════════════════════ three.js scene ═══════════════════════════ */

let renderer, scene, perspCam, activeCam, carGroup, bodyMesh, groundMesh, groundGrid, humanFig, dimGroup;
let mats = {};
const disposables = [];
let currentView = "persp";
let turntable = false, showHuman = false, showDims = false, showGrid = true;
const orbit = { theta: 0.85, phi: 1.12, radius: 9, target: new THREE.Vector3(0, 0.62, 0) };
let orthoCams = {};
let dimDefs = [];

function makeEnvCube() {
  const faces = [];
  for (let i = 0; i < 6; i++) {
    const cnv = document.createElement("canvas");
    cnv.width = cnv.height = 64;
    const ctx = cnv.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 64);
    if (i === 2) { grad.addColorStop(0, "#e8ecf2"); grad.addColorStop(1, "#aab4c2"); }        // top: soft skylight
    else if (i === 3) { grad.addColorStop(0, "#23262c"); grad.addColorStop(1, "#101216"); }    // bottom
    else { grad.addColorStop(0, "#b9c2ce"); grad.addColorStop(0.55, "#4a515c"); grad.addColorStop(1, "#181b20"); }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    if (i !== 3) {                                                    // studio strip lights
      ctx.fillStyle = "rgba(255,255,255,.75)";
      ctx.fillRect(6, 8, 52, 5);
    }
    faces.push(cnv);
  }
  const tex = new THREE.CubeTexture(faces);
  tex.needsUpdate = true;
  return tex;
}

function makeMaterials() {
  const env = makeEnvCube();
  mats.paint = new THREE.MeshPhysicalMaterial({
    color: state.paint.body, metalness: 0.25, roughness: 0.30,
    clearcoat: 1.0, clearcoatRoughness: 0.12, envMap: env, envMapIntensity: 0.9 });
  mats.glass = new THREE.MeshPhysicalMaterial({
    color: state.paint.glass, metalness: 0.35, roughness: 0.05,
    transparent: true, opacity: 0.80, side: THREE.DoubleSide,
    envMap: env, envMapIntensity: 1.6 });
  mats.trim = new THREE.MeshStandardMaterial({ color: state.paint.accent, metalness: 0.1, roughness: 0.7 });
  mats.tire = new THREE.MeshStandardMaterial({ color: "#17181a", roughness: 0.92 });
  mats.rim  = new THREE.MeshStandardMaterial({ color: "#b9bec8", metalness: 0.85, roughness: 0.3, envMap: env });
  mats.rimDark = new THREE.MeshStandardMaterial({ color: "#3a3e45", metalness: 0.6, roughness: 0.5 });
  mats.headlight = new THREE.MeshStandardMaterial({ color: "#cfd8e2", emissive: "#9fb6cf", emissiveIntensity: 0.7, roughness: 0.2 });
  mats.taillight = new THREE.MeshStandardMaterial({ color: "#7a1420", emissive: "#c22333", emissiveIntensity: 0.6, roughness: 0.25 });
  mats.bed  = new THREE.MeshStandardMaterial({ color: "#1c1e21", roughness: 0.95 });
  mats.caliper = new THREE.MeshStandardMaterial({ color: "#b8342c", metalness: 0.4, roughness: 0.4 });
  mats.human = new THREE.MeshStandardMaterial({ color: "#8b93a1", roughness: 0.8 });
}

function applyFinish() {
  const f = state.paint.finish;
  const cfg = { gloss: [0.28, 0.28, 1.0], satin: [0.15, 0.52, 0.5], matte: [0.04, 0.85, 0.0] }[f] || [0.28, 0.28, 1.0];
  mats.paint.metalness = cfg[0];
  mats.paint.roughness = cfg[1];
  mats.paint.clearcoat = cfg[2];
  mats.paint.color.set(state.paint.body);
  mats.glass.color.set(state.paint.glass);
  mats.trim.color.set(state.paint.accent);
}

function initScene() {
  const canvas = $("#viewport");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;

  scene = new THREE.Scene();
  scene.background = new THREE.Color("#101318");
  scene.fog = new THREE.Fog("#101318", 20, 48);

  perspCam = new THREE.PerspectiveCamera(33, 1, 0.1, 200);
  activeCam = perspCam;

  scene.add(new THREE.HemisphereLight("#9db4d0", "#20221c", 0.85));
  const key = new THREE.DirectionalLight("#ffffff", 0.95);
  key.position.set(5, 7, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, far: 30 });
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key);
  const rim = new THREE.DirectionalLight("#5a78a0", 0.4);
  rim.position.set(-6, 4, -5);
  scene.add(rim);

  groundMesh = new THREE.Mesh(
    new THREE.CircleGeometry(40, 48).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: "#14171c", roughness: 1 }));
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);
  groundGrid = new THREE.GridHelper(40, 40, 0x2e3542, 0x1c212a);
  groundGrid.position.y = 0.002;
  scene.add(groundGrid);

  carGroup = new THREE.Group();
  scene.add(carGroup);
  makeMaterials();
  humanFig = buildHuman(mats);
  humanFig.visible = false;
  scene.add(humanFig);
  dimGroup = new THREE.Group();
  dimGroup.visible = false;
  scene.add(dimGroup);

  initOrbit(canvas);
  new ResizeObserver(resize).observe($("#viewport-wrap"));
  resize();
  requestAnimationFrame(tick);
}

function resize() {
  const wrap = $("#viewport-wrap");
  const w = wrap.clientWidth, h = wrap.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  perspCam.aspect = w / h;
  perspCam.updateProjectionMatrix();
  fitOrthoCams();
}

let lastT = 0;
function tick(t) {
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, (t - lastT) / 1000);
  lastT = t;
  if (turntable && currentView === "persp") carGroup.rotation.y += dt * 0.35;
  updateOrbitCam();
  renderer.render(scene, activeCam);
  if (showDims) placeDimLabels();
}

/* ── custom orbit controls ── */
function initOrbit(canvas) {
  let dragging = false, panning = false, px = 0, py = 0;
  canvas.addEventListener("contextmenu", e => e.preventDefault());
  canvas.addEventListener("pointerdown", e => {
    dragging = true;
    panning = e.button === 2 || e.shiftKey;
    px = e.clientX; py = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - px, dy = e.clientY - py;
    px = e.clientX; py = e.clientY;
    if (currentView !== "persp") {
      if (dragging) panOrtho(dx, dy);
      return;
    }
    if (panning) {
      const s = orbit.radius * 0.0011;
      const right = new THREE.Vector3().setFromSphericalCoords(1, Math.PI / 2, orbit.theta + Math.PI / 2);
      orbit.target.addScaledVector(right, -dx * s);
      orbit.target.y = clamp(orbit.target.y + dy * s, 0, 4);
    } else {
      orbit.theta -= dx * 0.006;
      orbit.phi = clamp(orbit.phi - dy * 0.005, 0.12, Math.PI / 2 - 0.02);
    }
  });
  canvas.addEventListener("pointerup", () => { dragging = false; });
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    const f = Math.pow(1.001, e.deltaY);
    if (currentView === "persp") orbit.radius = clamp(orbit.radius * f, 2.2, 40);
    else zoomOrtho(f);
  }, { passive: false });
}
function updateOrbitCam() {
  if (currentView !== "persp") return;
  const p = new THREE.Vector3().setFromSphericalCoords(orbit.radius, orbit.phi, orbit.theta);
  perspCam.position.copy(p).add(orbit.target);
  perspCam.lookAt(orbit.target);
}
function panOrtho(dx, dy) {
  const cam = activeCam;
  const s = (cam.right - cam.left) / renderer.domElement.clientWidth;
  cam.position.addScaledVector(new THREE.Vector3().setFromMatrixColumn(cam.matrix, 0), -dx * s);
  cam.position.addScaledVector(new THREE.Vector3().setFromMatrixColumn(cam.matrix, 1), dy * s);
}
function zoomOrtho(f) {
  const cam = activeCam;
  cam.zoom = clamp(cam.zoom / f, 0.3, 6);
  cam.updateProjectionMatrix();
}

function fitOrthoCams() {
  if (!renderer) return;
  const w = renderer.domElement.clientWidth || 1, h = renderer.domElement.clientHeight || 1;
  const aspect = w / h;
  const m = computeMetrics(state.params, SEGMENT_INDEX[state.segment]);
  const Lm = m.L / 1000, Wm = m.W / 1000, Hm = m.H / 1000;
  const defs = {
    side:  { pos: [0, Hm / 2, 12],  up: [0, 1, 0], span: Lm * 1.25, cy: Hm / 2 },
    front: { pos: [-12, Hm / 2, 0], up: [0, 1, 0], span: Math.max(Wm * 2.2, Hm * 2.0 * aspect), cy: Hm / 2 },
    rear:  { pos: [12, Hm / 2, 0],  up: [0, 1, 0], span: Math.max(Wm * 2.2, Hm * 2.0 * aspect), cy: Hm / 2 },
    top:   { pos: [0, 12, 0],       up: [0, 0, -1], span: Math.max(Lm * 1.25, Wm * 1.3 * aspect), cy: 0 },
  };
  for (const id in defs) {
    const d = defs[id];
    const halfW = d.span / 2, halfH = halfW / aspect;
    const cam = orthoCams[id] || new THREE.OrthographicCamera();
    cam.left = -halfW; cam.right = halfW; cam.top = halfH; cam.bottom = -halfH;
    cam.near = 0.1; cam.far = 60;
    cam.position.set(...d.pos);
    cam.up.set(...d.up);
    cam.lookAt(0, d.cy, 0);
    cam.zoom = cam.zoom || 1;
    cam.updateProjectionMatrix();
    orthoCams[id] = cam;
  }
}

function setView(id) {
  currentView = id;
  $$("#hud-views button").forEach(b => b.classList.toggle("active", b.dataset.view === id));
  if (id === "persp") activeCam = perspCam;
  else {
    carGroup.rotation.y = 0;
    fitOrthoCams();
    orthoCams[id].zoom = 1;
    orthoCams[id].updateProjectionMatrix();
    activeCam = orthoCams[id];
  }
}

/* ── dimension lines ── */
function rebuildDims(C, m) {
  while (dimGroup.children.length) {
    const c = dimGroup.children.pop();
    if (c.geometry) c.geometry.dispose();
  }
  dimDefs = [];
  const lineMat = new THREE.LineBasicMaterial({ color: 0x58a6ff });
  const halfL = C.L / 2;
  const zOff = C.hw0 + 0.5;
  const addLine = pts => {
    const g = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(...p)));
    dimGroup.add(new THREE.Line(g, lineMat));
  };
  const tick = 0.09;
  /* overall length at ground, +z side */
  addLine([[-halfL, 0.02, zOff], [halfL, 0.02, zOff]]);
  addLine([[-halfL, 0.02, zOff - tick], [-halfL, 0.02, zOff + tick]]);
  addLine([[halfL, 0.02, zOff - tick], [halfL, 0.02, zOff + tick]]);
  dimDefs.push({ pos: [0, 0.06, zOff + 0.16], text: "L " + fmtMM(m.L) });
  /* wheelbase, slightly inboard */
  const wb0 = C.xFA - halfL, wb1 = C.xRA - halfL;
  addLine([[wb0, 0.26, zOff], [wb1, 0.26, zOff]]);
  addLine([[wb0, 0.26 - tick, zOff], [wb0, 0.26 + tick, zOff]]);
  addLine([[wb1, 0.26 - tick, zOff], [wb1, 0.26 + tick, zOff]]);
  dimDefs.push({ pos: [(wb0 + wb1) / 2, 0.34, zOff], text: "WB " + fmtMM(state.params.wheelbase) });
  /* height at tail */
  const hx = halfL + 0.45;
  addLine([[hx, 0, 0], [hx, C.roofH, 0]]);
  addLine([[hx - tick, C.roofH, 0], [hx + tick, C.roofH, 0]]);
  addLine([[hx - tick, 0, 0], [hx + tick, 0, 0]]);
  dimDefs.push({ pos: [hx + 0.12, C.roofH / 2, 0], text: "H " + fmtMM(m.H) });
  /* width across the nose */
  const wx = -halfL - 0.45, hw = m.W / 2000;
  addLine([[wx, 0.02, -hw], [wx, 0.02, hw]]);
  addLine([[wx, 0.02 - 0, -hw], [wx, 0.14, -hw]]);
  addLine([[wx, 0.02, hw], [wx, 0.14, hw]]);
  dimDefs.push({ pos: [wx, 0.24, 0], text: "W " + fmtMM(m.W) });
}

function placeDimLabels() {
  const holder = $("#dim-labels");
  const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
  let html = "";
  for (const d of dimDefs) {
    const v = new THREE.Vector3(...d.pos).applyMatrix4(carGroup.matrix).project(activeCam);
    if (v.z > 1) continue;
    const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h;
    html += `<div class="dim-label" style="left:${x}px;top:${y}px">${d.text}</div>`;
  }
  holder.innerHTML = html;
}

/* ═══════════════════════════ rebuild ═══════════════════════════ */

let rebuildQueued = false;
function queueRebuild() {
  if (rebuildQueued) return;
  rebuildQueued = true;
  requestAnimationFrame(() => { rebuildQueued = false; rebuild(); });
}

function rebuild() {
  const p = state.params;
  const seg = SEGMENT_INDEX[state.segment];
  const C = buildCurves(p, seg.topology);

  while (disposables.length) disposables.pop().dispose();
  while (carGroup.children.length) carGroup.remove(carGroup.children[0]);

  const bodyGeo = buildBodyGeometry(p, C);
  disposables.push(bodyGeo);
  bodyMesh = new THREE.Mesh(bodyGeo, [mats.paint, mats.glass, mats.trim]);
  bodyMesh.castShadow = true;
  carGroup.add(bodyMesh);

  const tireR = C.tireR, rimR = p.rimDiameter * 25.4 / 2000, tw = p.tireWidth / 1000;
  for (const [xA, name] of [[C.xFA, "front"], [C.xRA, "rear"]]) {
    for (const s of [1, -1]) {
      const wheel = buildWheel(state.parts.wheelStyle, tireR, rimR, tw, mats);
      wheel.position.set(xA, tireR, s * (C.halfW(xA) - p.wheelInset / 1000 - tw / 2));
      if (s < 0) wheel.rotation.y = Math.PI;
      wheel.name = "wheel_" + name + (s > 0 ? "L" : "R");
      wheel.traverse(o => { if (o.geometry) disposables.push(o.geometry); });
      carGroup.add(wheel);
    }
  }

  const partsGroup = buildParts(p, state.parts, C, mats);
  partsGroup.traverse(o => { if (o.geometry) disposables.push(o.geometry); });
  carGroup.add(partsGroup);

  /* everything is built in car coords (nose at x=0); centre the car on origin */
  carGroup.children.forEach(ch => { ch.position.x -= C.L / 2; });

  humanFig.position.set(C.L * 0.30, 0, -(C.hw0 + 0.75));

  const m = computeMetrics(p, seg);
  rebuildDims(C, m);
  renderEngineering(m, seg, p);
  fitOrthoCams();
}

/* ═══════════════════════════ engineering panel ═══════════════════════════ */

function renderEngineering(m, seg, p) {
  const dims = [
    ["Length", fmtMM(m.L)], ["Width", fmtMM(m.W)],
    ["Height", fmtMM(m.H)], ["Wheelbase", fmtMM(p.wheelbase)],
    ["Track", fmtMM(m.track)], ["Clearance", fmtMM(p.groundClearance)],
  ];
  $("#eng-dims").innerHTML = dims.map(d =>
    `<div class="eng-dim"><span class="k">${d[0]}</span><span class="v">${d[1]}</span></div>`).join("");

  const rows = [
    ["wbRatio", m.wbRatio.toFixed(3)],
    ["dashAxle", fmtMM(p.cowlOffset)],
    ["frontal", m.frontal.toFixed(2) + " m²"],
    ["cd", "≈ " + m.cd.toFixed(2)],
    ["cda", m.cda.toFixed(2) + " m²"],
    ["approach", m.approachDeg.toFixed(0) + "°"],
    ["departure", m.departureDeg.toFixed(0) + "°"],
    ["turning", m.turningM.toFixed(1) + " m"],
    ["mass", "≈ " + Math.round(m.massKg).toLocaleString("en-US") + " kg"],
  ];
  if (seg.topology === "pickup") rows.push(["bed", fmtMM(m.bedLen)]);
  $("#eng-metrics").innerHTML = rows.map(r => {
    const def = METRIC_DEFS[r[0]];
    return `<div class="metric-row"><span class="k">${def.label}</span>` +
           `<span class="param-info" data-tiptitle="${def.label}" data-tip="${def.info.replace(/"/g, "&quot;")}">i</span>` +
           `<span class="v">${r[1]}</span></div>`;
  }).join("");

  const findings = [];
  for (const rule of REVIEW_RULES) {
    const r = rule(p, m, seg);
    if (r) findings.push(r);
  }
  $("#eng-warnings").innerHTML = findings.length
    ? findings.map(f => `<div class="chip ${f.level}"><span class="dot"></span><span>${f.msg}</span></div>`).join("")
    : `<div class="chip good"><span class="dot"></span><span>No review findings — this design sits inside the realistic envelope of its segment. Now break a rule on purpose.</span></div>`;

  /* benchmark table with closest-match highlight */
  let bestI = 0, bestD = Infinity;
  seg.benchmarks.forEach((b, i) => {
    const d = Math.abs(b.L - m.L) / 400 + Math.abs(b.WB - p.wheelbase) / 250 +
              Math.abs(b.W - m.W) / 120 + Math.abs(b.H - m.H) / 120;
    if (d < bestD) { bestD = d; bestI = i; }
  });
  $("#eng-bench").innerHTML =
    `<table class="bench-table"><tr><th>Vehicle</th><th>L</th><th>WB</th><th>W</th><th>H</th></tr>` +
    seg.benchmarks.map((b, i) =>
      `<tr class="${i === bestI ? "closest" : ""}"><td>${b.name}</td><td>${b.L}</td><td>${b.WB}</td><td>${b.W}</td><td>${b.H}</td></tr>`).join("") +
    `<tr><td>— your concept</td><td>${Math.round(m.L)}</td><td>${p.wheelbase}</td><td>${Math.round(m.W)}</td><td>${Math.round(m.H)}</td></tr></table>`;
}

/* ═══════════════════════════ UI construction ═══════════════════════════ */

function buildSegmentCards() {
  $("#segment-cards").innerHTML = SEGMENTS.map(s =>
    `<button class="seg-card ${s.id === state.segment ? "active" : ""}" data-seg="${s.id}" ` +
    `data-tiptitle="${s.name}" data-tip="${s.blurb.replace(/"/g, "&quot;")}">` +
    `<span class="seg-name">${s.name}</span><span class="seg-desc">${s.desc}</span></button>`).join("");
  $$("#segment-cards .seg-card").forEach(b => b.addEventListener("click", () => {
    applySegment(b.dataset.seg);
    $("#design-name").value = state.name;
    buildSegmentCards();
    buildSeedSelect();
    refreshAllControls();
    rebuild();
    toast(SEGMENT_INDEX[b.dataset.seg].name + " template loaded — dimensions from its benchmark class");
  }));
}

function buildSeedSelect() {
  const seg = SEGMENT_INDEX[state.segment];
  $("#seed-select").innerHTML = `<option value="">Segment defaults</option>` +
    seg.benchmarks.map((b, i) => `<option value="${i}">${b.name} — ${b.L} / ${b.WB} / ${b.H}</option>`).join("");
}

function seedFromBenchmark(i) {
  const seg = SEGMENT_INDEX[state.segment];
  const b = seg.benchmarks[i];
  if (!b) { applySegment(state.segment, true); refreshAllControls(); rebuild(); return; }
  const p = state.params;
  const scaleOH = (b.L - b.WB) / (seg.defaults.frontOverhang + seg.defaults.rearOverhang);
  p.wheelbase = b.WB;
  p.frontOverhang = Math.round(seg.defaults.frontOverhang * scaleOH / 5) * 5;
  p.rearOverhang = (b.L - b.WB) - p.frontOverhang;
  p.bodyWidth = b.W;
  const dH = b.H - seg.defaults.roofHeight;
  p.roofHeight = b.H;
  p.beltHeight = seg.defaults.beltHeight + Math.round(dH * 0.55 / 5) * 5;
  p.hoodHeight = seg.defaults.hoodHeight + Math.round(dH * 0.5 / 5) * 5;
  refreshAllControls();
  rebuild();
  toast(`Seeded from ${b.name} (published dims) — now make it yours`);
}

function buildParamSections() {
  const holder = $("#param-sections");
  holder.innerHTML = "";
  const topo = SEGMENT_INDEX[state.segment].topology;
  for (const grp of PARAM_GROUPS) {
    const sec = document.createElement("section");
    sec.className = "ctl-section open";
    sec.innerHTML = `<h3 class="ctl-title">${grp.title} <span class="hint">— ${grp.hint}</span></h3><div class="ctl-body"></div>`;
    const body = sec.querySelector(".ctl-body");
    for (const def of grp.params) {
      if (def.topo && !def.topo.includes(topo)) continue;
      const row = document.createElement("div");
      row.className = "param-row";
      row.innerHTML =
        `<div class="param-top"><span class="param-label">${def.label}</span>` +
        `<span class="param-info" data-tiptitle="${def.label}" data-tip="${def.info.replace(/"/g, "&quot;")}">i</span>` +
        `<span class="param-val"><input type="number" data-num="${def.key}" min="${def.min}" max="${def.max}" step="${def.step}">` +
        `<span class="param-unit">${def.unit}</span></span></div>` +
        `<input type="range" data-key="${def.key}" min="${def.min}" max="${def.max}" step="${def.step}">`;
      body.appendChild(row);
    }
    holder.appendChild(sec);
  }
  $$("#param-sections input[type=range]").forEach(sl => {
    sl.addEventListener("input", () => {
      state.params[sl.dataset.key] = +sl.value;
      const num = $(`input[data-num="${sl.dataset.key}"]`);
      if (num) num.value = sl.value;
      queueRebuild();
    });
  });
  $$("#param-sections input[type=number]").forEach(num => {
    num.addEventListener("change", () => {
      const def = PARAM_INDEX[num.dataset.num];
      const v = clamp(+num.value || def.min, def.min, def.max);
      num.value = v;
      state.params[num.dataset.num] = v;
      const sl = $(`input[data-key="${num.dataset.num}"]`);
      if (sl) sl.value = v;
      queueRebuild();
    });
  });
}

function buildPartsUI() {
  const holder = $("#parts-body");
  holder.innerHTML = "";
  for (const key in PART_OPTIONS) {
    const def = PART_OPTIONS[key];
    const row = document.createElement("div");
    row.className = "part-row";
    if (def.type === "select") {
      row.innerHTML = `<label><span>${def.label}</span>` +
        `<span class="param-info" data-tiptitle="${def.label}" data-tip="${def.info.replace(/"/g, "&quot;")}">i</span></label>` +
        `<select data-part="${key}">` +
        def.options.map(o => `<option value="${o.id}">${o.name}</option>`).join("") + `</select>`;
      holder.appendChild(row);
      row.querySelector("select").addEventListener("change", e => {
        state.parts[key] = e.target.value;
        queueRebuild();
      });
    } else {
      row.innerHTML = `<label><span>${def.label}</span>` +
        `<span class="param-info" data-tiptitle="${def.label}" data-tip="${def.info.replace(/"/g, "&quot;")}">i</span></label>` +
        `<button class="check" data-part="${key}" aria-label="${def.label}"></button>`;
      holder.appendChild(row);
      row.querySelector(".check").addEventListener("click", e => {
        state.parts[key] = !state.parts[key];
        e.currentTarget.classList.toggle("on", state.parts[key]);
        queueRebuild();
      });
    }
  }
}

function buildPaintUI() {
  const holder = $("#paint-body");
  holder.innerHTML = "";
  for (const key in PAINT_OPTIONS) {
    const def = PAINT_OPTIONS[key];
    const row = document.createElement("div");
    row.className = "paint-row";
    if (def.type === "color") {
      row.innerHTML = `<label>${def.label}</label><input type="color" data-paint="${key}">`;
      holder.appendChild(row);
      row.querySelector("input").addEventListener("input", e => {
        state.paint[key] = e.target.value;
        applyFinish();
      });
    } else {
      row.innerHTML = `<label>${def.label}</label><select data-paint="${key}">` +
        def.options.map(o => `<option value="${o.id}">${o.name}</option>`).join("") + `</select>`;
      holder.appendChild(row);
      row.querySelector("select").addEventListener("change", e => {
        state.paint[key] = e.target.value;
        applyFinish();
      });
    }
  }
}

function refreshAllControls() {
  buildParamSections();
  for (const key in state.params) {
    const sl = $(`input[data-key="${key}"]`), num = $(`input[data-num="${key}"]`);
    if (sl) sl.value = state.params[key];
    if (num) num.value = state.params[key];
  }
  for (const key in PART_OPTIONS) {
    const el = $(`[data-part="${key}"]`);
    if (!el) continue;
    if (el.tagName === "SELECT") el.value = state.parts[key];
    else el.classList.toggle("on", !!state.parts[key]);
  }
  for (const key in PAINT_OPTIONS) {
    const el = $(`[data-paint="${key}"]`);
    if (!el) continue;
    el.value = state.paint[key];
  }
  buildSeedSelect();
  applyFinish();
  bindTooltips();
}

/* ═══════════════════════════ tooltip ═══════════════════════════ */

function bindTooltips() {
  const tip = $("#tooltip");
  $$("[data-tip]").forEach(el => {
    if (el._ttBound) return;
    el._ttBound = true;
    el.addEventListener("mouseenter", () => {
      tip.innerHTML = (el.dataset.tiptitle ? `<div class="tt-title">${el.dataset.tiptitle}</div>` : "") + el.dataset.tip;
      tip.classList.remove("hidden");
      const r = el.getBoundingClientRect();
      tip.style.left = Math.min(window.innerWidth - 300, r.right + 10) + "px";
      tip.style.top = clamp(r.top - 8, 8, window.innerHeight - 120) + "px";
    });
    el.addEventListener("mouseleave", () => tip.classList.add("hidden"));
  });
}

/* ═══════════════════════════ exports ═══════════════════════════ */

function exportOBJ() {
  const lines = ["# StudioTheMobile concept — " + state.name,
                 "# Units: metres. Generated " + new Date().toISOString(), ""];
  let vOff = 1, nOff = 1;
  const v3 = new THREE.Vector3(), n3 = new THREE.Vector3();
  const nm = new THREE.Matrix3();
  carGroup.updateMatrixWorld(true);
  let meshI = 0;
  carGroup.traverse(obj => {
    if (!obj.isMesh) return;
    const geo = obj.geometry;
    const posA = geo.attributes.position, norA = geo.attributes.normal;
    if (!posA) return;
    lines.push("o " + (obj.name || "part_" + (meshI++)));
    nm.getNormalMatrix(obj.matrixWorld);
    for (let i = 0; i < posA.count; i++) {
      v3.fromBufferAttribute(posA, i).applyMatrix4(obj.matrixWorld);
      lines.push(`v ${v3.x.toFixed(5)} ${v3.y.toFixed(5)} ${v3.z.toFixed(5)}`);
    }
    for (let i = 0; i < norA.count; i++) {
      n3.fromBufferAttribute(norA, i).applyMatrix3(nm).normalize();
      lines.push(`vn ${n3.x.toFixed(4)} ${n3.y.toFixed(4)} ${n3.z.toFixed(4)}`);
    }
    const idx = geo.index;
    const face = (a, b, c) =>
      lines.push(`f ${a + vOff}//${a + nOff} ${b + vOff}//${b + nOff} ${c + vOff}//${c + nOff}`);
    if (idx) for (let i = 0; i < idx.count; i += 3) face(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2));
    else for (let i = 0; i < posA.count; i += 3) face(i, i + 1, i + 2);
    vOff += posA.count; nOff += norA.count;
  });
  const name = state.name.replace(/[^\w\-]+/g, "_").toLowerCase() || "concept";
  download(name + ".obj", new Blob([lines.join("\n")], { type: "text/plain" }));
  toast("OBJ exported — opens straight in Blender / Maya / CAD");
}

function exportJSON() {
  const name = state.name.replace(/[^\w\-]+/g, "_").toLowerCase() || "concept";
  download(name + ".spec.json",
    new Blob([JSON.stringify(serializeDesign(), null, 2)], { type: "application/json" }));
  toast("Spec sheet exported — every dimension in real millimetres");
}

function shareLink() {
  const d = serializeDesign();
  delete d.metrics;
  const enc = btoa(unescape(encodeURIComponent(JSON.stringify(d))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const url = location.origin + location.pathname + "#d=" + enc;
  navigator.clipboard.writeText(url).then(
    () => toast("Design link copied — anyone who opens it sees this exact concept"),
    () => { prompt("Copy this design link:", url); });
}

function tryLoadHash() {
  const m = location.hash.match(/#d=([A-Za-z0-9\-_]+)/);
  if (!m) return false;
  try {
    const json = decodeURIComponent(escape(atob(m[1].replace(/-/g, "+").replace(/_/g, "/"))));
    loadDesign(JSON.parse(json));
    toast("Shared design loaded");
    return true;
  } catch (e) {
    console.warn("Bad share link", e);
    return false;
  }
}

/* ── blueprint ── */
function makeBlueprint() {
  const p = state.params;
  const seg = SEGMENT_INDEX[state.segment];
  const m = computeMetrics(p, seg);
  const C = buildCurves(p, seg.topology);
  const W = 2200, H = 1560;
  const cnv = document.createElement("canvas");
  cnv.width = W; cnv.height = H;
  const ctx = cnv.getContext("2d");

  /* blueprint background */
  ctx.fillStyle = "#123a5e";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(255,255,255,.07)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 44) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.strokeStyle = "rgba(255,255,255,.13)";
  for (let x = 0; x <= W; x += 220) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 220) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.strokeStyle = "rgba(255,255,255,.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, W - 52, H - 52);

  /* off-screen render helper */
  const rr = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  rr.setSize(1100, 700);
  const wasBG = scene.background, wasFog = scene.fog;
  const hidden = [groundMesh, groundGrid, humanFig, dimGroup];
  const wasVis = hidden.map(o => o.visible);
  hidden.forEach(o => { o.visible = false; });
  scene.background = null; scene.fog = null;
  const wasRotY = carGroup.rotation.y;
  carGroup.rotation.y = 0;

  const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const wire = new THREE.MeshBasicMaterial({ color: 0xdfeaf5, wireframe: true, transparent: true, opacity: 0.16 });

  function renderView(camPos, up, spanM, wPx, hPx, lookY) {
    const aspect = wPx / hPx;
    const cam = new THREE.OrthographicCamera(-spanM / 2, spanM / 2, spanM / 2 / aspect, -spanM / 2 / aspect, 0.1, 60);
    cam.position.set(...camPos);
    cam.up.set(...up);
    cam.lookAt(0, lookY, 0);
    rr.setSize(wPx, hPx);
    const out = document.createElement("canvas");
    out.width = wPx; out.height = hPx;
    const octx = out.getContext("2d");
    scene.overrideMaterial = white;
    rr.render(scene, cam);
    octx.globalAlpha = 0.92;
    octx.drawImage(rr.domElement, 0, 0);
    scene.overrideMaterial = wire;
    rr.render(scene, cam);
    octx.globalAlpha = 1;
    octx.drawImage(rr.domElement, 0, 0);
    scene.overrideMaterial = null;
    return out;
  }

  const Lm = m.L / 1000, Wm = m.W / 1000, Hm = m.H / 1000;
  const sideSpan = Lm * 1.14;
  const sidePx = 1240, sidePy = Math.round(sidePx / 2.6);
  const sideImg = renderView([0, Hm / 2, 12], [0, 1, 0], sideSpan, sidePx, sidePy, Hm / 2);
  const topImg  = renderView([0, 12, 0], [0, 0, -1], sideSpan, sidePx, Math.round(sidePx * (Wm * 1.35) / sideSpan), 0);
  const fSpan = Math.max(Wm, Hm) * 1.45;
  const fw = 560, fh = 560;
  const frontImg = renderView([-12, Hm / 2, 0], [0, 1, 0], fSpan, fw, fh, Hm / 2);
  const rearImg  = renderView([12, Hm / 2, 0], [0, 1, 0], fSpan, fw, fh, Hm / 2);

  scene.background = wasBG; scene.fog = wasFog;
  hidden.forEach((o, i) => { o.visible = wasVis[i]; });
  carGroup.rotation.y = wasRotY;
  rr.dispose();

  /* compose */
  ctx.fillStyle = "#fff";
  ctx.font = "600 40px system-ui, sans-serif";
  ctx.fillText(state.name.toUpperCase(), 70, 96);
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,.75)";
  ctx.fillText(`${seg.name}  ·  StudioTheMobile parametric study` +
    (state.meta.owner ? `  ·  ${state.meta.owner}` : "") +
    `  ·  ${new Date().toISOString().slice(0, 10)}  ·  all dimensions in mm`, 70, 132);

  const sideX = 70, sideY = 190;
  ctx.drawImage(sideImg, sideX, sideY);
  const topY0 = sideY + sidePy + 100;
  ctx.drawImage(topImg, sideX, topY0);
  const colX = sideX + sidePx + 60;
  ctx.drawImage(frontImg, colX, 190, 470, 470);
  ctx.drawImage(rearImg, colX, 700, 470, 470);
  ctx.font = "20px system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,.7)";
  ctx.fillText("SIDE ELEVATION", sideX, sideY - 12);
  ctx.fillText("PLAN VIEW", sideX, topY0 - 12);
  ctx.fillText("FRONT", colX, 178);
  ctx.fillText("REAR", colX, 688);

  /* dimension callouts on the side view */
  const pxPerM = sidePx / sideSpan;
  const groundYpx = sideY + sidePy / 2 + (Hm / 2) * pxPerM;   // world y=0 in the ortho frame
  const noseXpx = sideX + sidePx / 2 - (Lm / 2) * pxPerM;
  const dimLine = (x0, x1, y, label) => {
    ctx.strokeStyle = "#ffd47e"; ctx.fillStyle = "#ffd47e"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    for (const x of [x0, x1]) { ctx.beginPath(); ctx.moveTo(x, y - 9); ctx.lineTo(x, y + 9); ctx.stroke(); }
    ctx.font = "600 21px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, (x0 + x1) / 2, y + 30);
    ctx.textAlign = "left";
  };
  dimLine(noseXpx, noseXpx + Lm * pxPerM, groundYpx + 46, Math.round(m.L) + "");
  dimLine(noseXpx + C.xFA * pxPerM, noseXpx + C.xRA * pxPerM, groundYpx + 104, "WB " + p.wheelbase);
  /* height dim, right of side view */
  const hx = noseXpx + Lm * pxPerM + 40;
  ctx.strokeStyle = "#ffd47e"; ctx.fillStyle = "#ffd47e"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(hx, groundYpx); ctx.lineTo(hx, groundYpx - Hm * pxPerM); ctx.stroke();
  for (const y of [groundYpx, groundYpx - Hm * pxPerM]) {
    ctx.beginPath(); ctx.moveTo(hx - 9, y); ctx.lineTo(hx + 9, y); ctx.stroke();
  }
  ctx.save();
  ctx.translate(hx + 26, groundYpx - Hm * pxPerM / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.font = "600 21px system-ui, sans-serif";
  ctx.fillText("" + Math.round(m.H), 0, 0);
  ctx.restore();

  /* spec table */
  const spec = [
    ["Wheelbase / length", m.wbRatio.toFixed(3)],
    ["Track", Math.round(m.track) + " mm"],
    ["Frontal area", m.frontal.toFixed(2) + " m²"],
    ["Cd (est.) / CdA", m.cd.toFixed(2) + " / " + m.cda.toFixed(2) + " m²"],
    ["Approach / departure", m.approachDeg.toFixed(0) + "° / " + m.departureDeg.toFixed(0) + "°"],
    ["Turning circle (est.)", m.turningM.toFixed(1) + " m"],
    ["Concept mass (est.)", Math.round(m.massKg) + " kg"],
  ];
  let ty = H - 88 - spec.length * 34;
  ctx.font = "600 22px system-ui, sans-serif";
  ctx.fillStyle = "#fff";
  ctx.fillText("DERIVED METRICS", colX, ty - 16);
  ctx.font = "20px system-ui, sans-serif";
  for (const row of spec) {
    ctx.fillStyle = "rgba(255,255,255,.65)";
    ctx.fillText(row[0], colX, ty + 16);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "right";
    ctx.fillText(row[1], W - 80, ty + 16);
    ctx.textAlign = "left";
    ty += 34;
  }
  return cnv;
}

let bpCanvas = null;
function showBlueprint() {
  bpCanvas = makeBlueprint();
  const holder = $("#bp-holder");
  holder.innerHTML = "";
  holder.appendChild(bpCanvas);
  $("#modal-blueprint").classList.remove("hidden");
}

/* ═══════════════════════════ library ═══════════════════════════ */

const LIB_KEY = "studiothemobile.public.designs.v1";
const libAll = () => { try { return JSON.parse(localStorage.getItem(LIB_KEY)) || []; } catch { return []; } };
const libWrite = list => localStorage.setItem(LIB_KEY, JSON.stringify(list));

function thumbnail() {
  renderer.render(scene, activeCam);
  const src = renderer.domElement;
  const t = document.createElement("canvas");
  t.width = 192; t.height = 108;
  t.getContext("2d").drawImage(src, 0, 0, src.width, src.height, 0, 0, 192, 108);
  return t.toDataURL("image/jpeg", 0.7);
}

function saveDesign() {
  state.name = $("#design-name").value.trim() || "Untitled Concept";
  const identity = getIdentity() || "guest";
  let forkedFrom = null;
  if (!state.meta.owner) state.meta.owner = identity;
  if (state.meta.owner !== identity) {                     // not yours: fork with credit
    forkedFrom = `${state.name} — ${state.meta.owner}`;
    state.meta.basedOn = forkedFrom;
    state.meta.owner = identity;
    if (!/\(copy\)$/i.test(state.name)) state.name += " (copy)";
    $("#design-name").value = state.name;
  }
  const list = libAll();
  const entry = {
    id: Date.now().toString(36),
    name: state.name,
    seg: SEGMENT_INDEX[state.segment].name,
    date: new Date().toISOString(),
    thumb: thumbnail(),
    data: (() => { const d = serializeDesign(); delete d.metrics; return d; })(),
  };
  const i = list.findIndex(e => e.name === entry.name);
  if (i >= 0) list[i] = entry; else list.unshift(entry);
  libWrite(list.slice(0, 60));
  toast(forkedFrom
    ? `Saved as your own copy — lineage credits “${forkedFrom}”`
    : `“${state.name}” saved to the studio library (owner: ${state.meta.owner})`);
}

function renderLibrary() {
  const list = libAll();
  const me = getIdentity() || "guest";
  $("#library-list").innerHTML = list.length ? list.map(e => {
    const owner = (e.data.meta && e.data.meta.owner) || "unowned";
    const basedOn = e.data.meta && e.data.meta.basedOn;
    return `<div class="lib-item" data-id="${e.id}">
       <img src="${e.thumb}" alt="">
       <div class="lib-meta"><div class="n">${e.name}</div>
       <div class="d">${e.seg} · owner: ${owner}${basedOn ? " · based on " + basedOn : ""} · ${new Date(e.date).toLocaleDateString()}</div></div>
       <button class="tb" data-act="load">Open</button>
       <button class="tb" data-act="export">Spec</button>` +
       (owner === me ? `<button class="tb" data-act="own" title="Hand this design to a new owner">Transfer</button>` : "") +
       `<button class="tb" data-act="del">✕</button>
     </div>`;
  }).join("")
    : `<div class="lib-empty">No designs saved yet. Shape something, hit Save, and it appears here for the whole team using this machine.</div>`;
  $$("#library-list .lib-item button").forEach(b => b.addEventListener("click", () => {
    const id = b.closest(".lib-item").dataset.id;
    const list2 = libAll();
    const entry = list2.find(e => e.id === id);
    if (!entry) return;
    if (b.dataset.act === "load") {
      loadDesign(entry.data);
      $("#modal-library").classList.add("hidden");
      toast(`“${entry.name}” loaded`);
    } else if (b.dataset.act === "export") {
      download(entry.name.replace(/[^\w\-]+/g, "_") + ".spec.json",
        new Blob([JSON.stringify(entry.data, null, 2)], { type: "application/json" }));
    } else if (b.dataset.act === "own") {
      const next = prompt(`Transfer “${entry.name}” to which designer?`, "");
      if (next && next.trim()) {
        entry.data.meta = Object.assign({ created: null, basedOn: null }, entry.data.meta, { owner: next.trim() });
        libWrite(list2);
        renderLibrary();
        toast(`“${entry.name}” is now owned by ${next.trim()}`);
      }
    } else {
      libWrite(list2.filter(e => e.id !== id));
      renderLibrary();
    }
  }));
}

/* ═══════════════════════════ wiring ═══════════════════════════ */

function wireUI() {
  $$(".ctl-title").forEach(t => t.addEventListener("click", () => t.parentElement.classList.toggle("open")));
  $("#design-name").addEventListener("change", e => { state.name = e.target.value; });

  $("#ident-label").textContent = getIdentity() || "guest";
  $("#btn-identity").addEventListener("click", () => {
    const v = prompt("Your designer name (owns everything you save):", getIdentity());
    if (v === null) return;
    localStorage.setItem(IDENT_KEY, v.trim());
    $("#ident-label").textContent = v.trim() || "guest";
    if (!state.meta.owner) state.meta.owner = v.trim();
    toast(v.trim() ? `Signed in as ${v.trim()}` : "Identity cleared — saving as guest");
  });

  $("#seed-select").addEventListener("change", e =>
    seedFromBenchmark(e.target.value === "" ? -1 : +e.target.value));

  $$("#hud-views button").forEach(b => b.addEventListener("click", () => setView(b.dataset.view)));
  $("#tgl-turntable").addEventListener("click", e => {
    turntable = !turntable;
    e.currentTarget.classList.toggle("active", turntable);
  });
  $("#tgl-human").addEventListener("click", e => {
    showHuman = !showHuman;
    humanFig.visible = showHuman;
    e.currentTarget.classList.toggle("active", showHuman);
  });
  $("#tgl-dims").addEventListener("click", e => {
    showDims = !showDims;
    dimGroup.visible = showDims;
    if (!showDims) $("#dim-labels").innerHTML = "";
    e.currentTarget.classList.toggle("active", showDims);
  });
  $("#tgl-grid").addEventListener("click", e => {
    showGrid = !showGrid;
    groundGrid.visible = showGrid;
    e.currentTarget.classList.toggle("active", showGrid);
  });

  $("#btn-export").addEventListener("click", () => $("#export-menu").classList.toggle("hidden"));
  document.addEventListener("click", e => {
    if (!e.target.closest(".export-wrap")) $("#export-menu").classList.add("hidden");
  });
  $$("#export-menu button").forEach(b =>
    b.addEventListener("click", () => $("#export-menu").classList.add("hidden")));
  $("#exp-obj").addEventListener("click", exportOBJ);
  $("#exp-json").addEventListener("click", exportJSON);
  $("#exp-bp").addEventListener("click", showBlueprint);
  $("#exp-import").addEventListener("click", () => $("#import-file").click());
  $("#import-file").addEventListener("change", e => {
    const f = e.target.files[0];
    if (!f) return;
    f.text().then(txt => {
      try { loadDesign(JSON.parse(txt)); toast("Spec sheet imported"); }
      catch (err) { toast("Import failed: " + err.message); }
    });
    e.target.value = "";
  });

  $("#btn-share").addEventListener("click", shareLink);
  $("#btn-save").addEventListener("click", saveDesign);
  $("#btn-library").addEventListener("click", () => { renderLibrary(); $("#modal-library").classList.remove("hidden"); });
  $("#btn-manual").addEventListener("click", () => $("#modal-manual").classList.remove("hidden"));
  $("#bp-download").addEventListener("click", () => {
    if (!bpCanvas) return;
    bpCanvas.toBlob(b => download(state.name.replace(/[^\w\-]+/g, "_") + ".blueprint.png", b));
  });
  $$(".modal").forEach(mo => {
    mo.addEventListener("click", e => {
      if (e.target === mo || e.target.hasAttribute("data-close")) mo.classList.add("hidden");
    });
  });

  document.addEventListener("keydown", e => {
    if (e.target.matches("input, select, textarea")) return;
    const views = { "1": "persp", "2": "side", "3": "front", "4": "top", "5": "rear" };
    if (views[e.key]) setView(views[e.key]);
    else if (e.key === "t" || e.key === "T") $("#tgl-turntable").click();
    else if (e.key === "h" || e.key === "H") $("#tgl-human").click();
    else if (e.key === "d" || e.key === "D") $("#tgl-dims").click();
    else if (e.key === "g" || e.key === "G") $("#tgl-grid").click();
  });
}

/* ═══════════════════════════ boot ═══════════════════════════ */

applySegment("sports");
initScene();
buildSegmentCards();
buildPartsUI();
buildPaintUI();
wireUI();
if (!tryLoadHash()) {
  $("#design-name").value = state.name;
  refreshAllControls();
  rebuild();
}
const startL = computeMetrics(state.params, SEGMENT_INDEX[state.segment]).L / 1000;
orbit.radius = startL * 1.9;

/* debug / test hooks */
window.CarStudio = {
  state,
  setSegment: id => { applySegment(id); $("#design-name").value = state.name; buildSegmentCards(); refreshAllControls(); rebuild(); },
  setParam: (k, v) => { state.params[k] = v; refreshAllControls(); rebuild(); },
  metrics: () => computeMetrics(state.params, SEGMENT_INDEX[state.segment]),
  serialize: serializeDesign,
  setView,
};
