// animation.js — Animate subsystem extracted verbatim from katex.html (Phase 9).
// Two source blocks joined as one cohesive unit: (1) BG controls (canvas background /
// grid popover, setAnimBg) and (2) the Animate DSL interpreter — sprite registry
// (animObjs/animNextId), stop state (animStopFlag/animResolveStop), laser, animExecLine
// parser, runAnimation timeline, updateNumberLine/updatePlane, play/stop/reset/help
// bindings, and the laser keydown. Classic script loaded after calculator.js and before
// the app script. Only outbound dep is renderer.render (app, runtime, for LaTeX sprites).
// No inbound calls (fully self-triggered). State is self-contained. Behaviour unchanged.

// ── BG controls ───────────────────────────────────────────────────────────────
const animBgBtn     = document.getElementById('animBgBtn');
const animBgPopover = document.getElementById('animBgPopover');

animBgBtn.addEventListener('click', e => {
  e.stopPropagation();
  animBgPopover.classList.toggle('open');
});

document.addEventListener('click', e => {
  if (!animBgPopover.contains(e.target) && e.target !== animBgBtn) {
    animBgPopover.classList.remove('open');
  }
});

function setAnimBg(value) {
  const wrap = document.querySelector('.anim-canvas-wrap');
  if (value === 'transparent') {
    wrap.style.background = 'repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 0 0/16px 16px';
  } else {
    wrap.style.background = value;
  }
  document.querySelectorAll('.anim-bg-swatch').forEach(s =>
    s.classList.toggle('active', s.dataset.bg === value)
  );
}

document.querySelectorAll('.anim-bg-swatch').forEach(swatch => {
  swatch.addEventListener('click', () => setAnimBg(swatch.dataset.bg));
});

document.getElementById('animBgCustomPicker').addEventListener('input', function() {
  document.querySelectorAll('.anim-bg-swatch').forEach(s => s.classList.remove('active'));
  setAnimBg(this.value);
});

document.getElementById('animGridToggle').addEventListener('change', function() {
  document.getElementById('animCanvas').classList.toggle('no-grid', !this.checked);
});


// ── Animate interpreter ───────────────────────────────────────────────────────
let animObjs = {};      // id -> { el, x, y, scale }
let animNextId = 1;
let animStopFlag = false;
let animResolveStop = null;
let animLaserDot = null;
let animLaserEnabled = false;
let animLaserFollow = false;

window.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'l' && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
    animLaserFollow = !animLaserFollow;
    if (animLaserFollow && !animLaserDot) {
      animExecLine('laser 50 50');
    }
  }
});

document.addEventListener('mousemove', e => {
  if (animLaserFollow && animLaserDot) {
    const canvas = document.getElementById('animCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    animLaserDot.style.left = x + '%';
    animLaserDot.style.top = y + '%';
  }
});

function animStopPromise() {
  return new Promise(resolve => { animResolveStop = resolve; });
}

function animDelay(ms) {
  return Promise.race([
    new Promise(r => setTimeout(r, Math.max(ms, 0))),
    animStopPromise()
  ]);
}

function animGetObj(id) { return animObjs[parseInt(id)]; }

function animClear() {
  document.getElementById('animCanvas').innerHTML = '';
  animObjs = {};
  animNextId = 1;
  animLaserFollow = false;
  animLaserDot = null;
}

async function animExecLine(line) {
  if (animStopFlag) return;
  const raw = line.trim();
  if (!raw || raw.startsWith('#')) return;

  // Tokenize: quoted strings stay together, rest split by whitespace
  const tokens = raw.match(/"[^"]*"|\S+/g) || [];
  if (!tokens.length) return;
  const op = tokens[0].toLowerCase();
  const canvas = document.getElementById('animCanvas');

  switch (op) {

    case 'show': {
      // show <latex...>  [at <x> <y>]
      let x = 50, y = 50;
      let latexTokens = tokens.slice(1);
      
      // Find 'at' by looking for common pattern from the end to avoid matching 'at' inside LaTeX if possible
      let atIdx = -1;
      for (let i = latexTokens.length - 3; i >= 0; i--) {
        if (latexTokens[i].toLowerCase() === 'at' && !isNaN(parseFloat(latexTokens[i+1]))) {
          atIdx = i;
          break;
        }
      }

      if (atIdx !== -1) {
        x = parseFloat(latexTokens[atIdx + 1]) ?? 50;
        y = parseFloat(latexTokens[atIdx + 2]) ?? 50;
        latexTokens = latexTokens.slice(0, atIdx);
      }
      const latex = latexTokens.join(' ').replace(/^"|"$/g, '');
      const el = document.createElement('div');
      el.className = 'anim-element';
      el.style.left = x + '%';
      el.style.top  = y + '%';
      el.style.opacity = '1';
      el.style.fontSize = '1em';
      el.style.transform = `translate(-50%,-50%) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)`;
      
      try {
        el.innerHTML = renderer.render(latex, { throwOnError: false, displayMode: false, strict: false });
      } catch(_) { el.textContent = latex; }
      // ID badge
      const badge = document.createElement('div');
      badge.className = 'anim-id-badge';
      badge.textContent = '#' + animNextId;
      el.appendChild(badge);
      canvas.appendChild(el);
      animObjs[animNextId++] = { el, x, y, baseScale: 1, rx:0, ry:0, rz:0, type: 'latex' };
      break;
    }

    case 'create': {
      // create <type> [at <x> <y>]
      const type = tokens[1]?.toLowerCase();
      let x = 50, y = 50;
      const atIdx = tokens.findIndex(t => t.toLowerCase() === 'at');
      if (atIdx !== -1 && tokens.length > atIdx + 2) {
        x = parseFloat(tokens[atIdx + 1]);
        y = parseFloat(tokens[atIdx + 2]);
      }
      
      const el = document.createElement('div');
      el.className = 'anim-element';
      el.style.left = x + '%';
      el.style.top  = y + '%';
      el.style.transform = 'translate(-50%,-50%)';
      
      let objData = { el, x, y, baseScale: 1, type };

      if (type === 'numberline') {
        el.innerHTML = `<svg class="sprite-svg" width="400" height="60" viewBox="0 0 400 60">
          <line class="sprite-axis" x1="20" y1="30" x2="380" y2="30" />
          <g class="ticks"></g>
          <g class="labels"></g>
        </svg>`;
        objData.min = -5; objData.max = 5; objData.step = 1;
        updateNumberLine(objData);
      } else if (type === 'plane' || type === 'complexplane') {
        el.innerHTML = `<svg class="sprite-svg" width="300" height="300" viewBox="0 0 300 300">
          <rect x="0" y="0" width="300" height="300" fill="none" class="sprite-grid-bg" />
          <g class="grid-lines"></g>
          <line class="sprite-axis" x1="0" y1="150" x2="300" y2="150" />
          <line class="sprite-axis" x1="150" y1="0" x2="150" y2="300" />
          <g class="labels"></g>
        </svg>`;
        objData.size = 300; objData.range = 5;
        updatePlane(objData);
      } else if (['square', 'triangle', 'circle', 'polygon'].includes(type)) {
        let path = '';
        if (type === 'square')   path = 'M20,20 L80,20 L80,80 L20,80 Z';
        if (type === 'triangle') path = 'M50,20 L85,80 L15,80 Z';
        if (type === 'circle')   path = 'M50,50 m-35,0 a35,35 0 1,0 70,0 a35,35 0 1,0 -70,0';
        if (type === 'polygon')  path = 'M50,15 L80,35 L75,75 L25,75 L20,35 Z';
        el.innerHTML = `<svg class="sprite-svg" width="100" height="100" viewBox="0 0 100 100">
          <path class="sprite-path" d="${path}" fill="rgba(59,110,245,0.2)" stroke="#3b6ef5" stroke-width="2" />
        </svg>`;
      } else if (type === 'ngon') {
        const n = parseInt(tokens[2]) || 5;
        let points = '';
        for (let i = 0; i < n; i++) {
          const angle = (i * 2 * Math.PI / n) - (Math.PI / 2);
          const px = 50 + 40 * Math.cos(angle);
          const py = 50 + 40 * Math.sin(angle);
          points += `${px},${py} `;
        }
        el.innerHTML = `<svg class="sprite-svg" width="100" height="100" viewBox="0 0 100 100">
          <polygon class="sprite-path" points="${points}" fill="rgba(59,110,245,0.2)" stroke="#3b6ef5" stroke-width="2" />
        </svg>`;
      }

      const badge = document.createElement('div');
      badge.className = 'anim-id-badge';
      badge.textContent = '#' + animNextId;
      el.appendChild(badge);
      canvas.appendChild(el);
      animObjs[animNextId++] = objData;
      break;
    }

    case 'line':
    case 'arrow':
    case 'polygon': {
      // line/arrow id x1 y1 x2 y2 [color] [ms]
      // polygon id x1 y1 x2 y2 x3 y3... [color] [ms]
      const id = tokens[1];
      const coords = [];
      let color = '#374151';
      let ms = 0;
      
      let nextIdx = 2;
      while (nextIdx < tokens.length && !isNaN(parseFloat(tokens[nextIdx]))) {
        coords.push(parseFloat(tokens[nextIdx]));
        nextIdx++;
      }
      if (nextIdx < tokens.length && tokens[nextIdx].startsWith('#')) {
        color = tokens[nextIdx];
        nextIdx++;
      }
      if (nextIdx < tokens.length && !isNaN(parseFloat(tokens[nextIdx]))) {
        ms = parseFloat(tokens[nextIdx]);
      }
      
      const el = document.createElement('div');
      el.className = 'anim-element';
      el.style.left = '0'; el.style.top = '0';
      el.style.transform = 'none';
      
      if (op === 'polygon') {
        let points = '';
        for (let i = 0; i < coords.length; i += 2) {
          points += `${coords[i]},${coords[i+1]} `;
        }
        el.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute; width:100%; height:100%; pointer-events:none">
          <polygon class="sprite-path" points="${points}" fill="rgba(59,110,245,0.2)" stroke="${color}" stroke-width="0.5" />
        </svg>`;
      } else {
        const x1 = coords[0], y1 = coords[1], x2 = coords[2], y2 = coords[3];
        const dx = x2 - x1, dy = y2 - y1;
        const length = Math.sqrt(dx*dx + dy*dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        el.innerHTML = `<div class="line-inner" style="position:absolute; left:${x1}%; top:${y1}%; width:0%; height:2px; background:${color}; transform:rotate(${angle}deg); transform-origin:left center; transition: width ${ms}ms ease"></div>`;
        if (op === 'arrow') {
          const head = document.createElement('div');
          head.style.cssText = `position:absolute; right:0; top:50%; transform:translate(0,-50%); border-left:8px solid ${color}; border-top:5px solid transparent; border-bottom:5px solid transparent;`;
          el.querySelector('.line-inner').appendChild(head);
        }
        setTimeout(() => { if (el.querySelector('.line-inner')) el.querySelector('.line-inner').style.width = length + '%'; }, 20);
      }
      
      canvas.appendChild(el);
      animObjs[parseInt(id) || animNextId++] = { el, x: coords[0]||0, y: coords[1]||0, type: op };
      break;
    }

    case 'set': {
      // set id property value
      const obj = animGetObj(tokens[1]);
      const prop = tokens[2]?.toLowerCase();
      const val = tokens.slice(3).join(' '); // handle colors or spaces
      if (!obj) break;
      
      if (obj.type === 'numberline') {
        if (prop === 'min') obj.min = parseFloat(val);
        if (prop === 'max') obj.max = parseFloat(val);
        if (prop === 'step') obj.step = parseFloat(val);
        updateNumberLine(obj);
      } else if (obj.type === 'plane' || obj.type === 'complexplane') {
        if (prop === 'range') obj.range = parseFloat(val);
        updatePlane(obj);
      } else {
        const path = obj.el.querySelector('.sprite-path');
        const circle = obj.el.querySelector('circle');
        const faces = obj.el.querySelectorAll('.poly-face');
        
        if (prop === 'fill') {
          if (path) path.setAttribute('fill', val);
          if (circle) circle.setAttribute('fill', val);
          faces.forEach(f => f.style.background = val);
        }
        if (prop === 'stroke' || prop === 'color') {
          obj.el.style.color = val;
          if (path) path.setAttribute('stroke', val);
          if (circle) circle.setAttribute('stroke', val);
          faces.forEach(f => f.style.borderColor = val);
        }
        if (prop === 'linewidth') {
          if (path) path.setAttribute('stroke-width', val);
          if (circle) circle.setAttribute('stroke-width', val);
        }
        if (prop === 'shading') {
          const isOn = val === 'on' || val === 'true';
          faces.forEach((f, i) => {
            const opacity = isOn ? (0.3 + (i % 5) * 0.1) : 0.4;
            f.style.opacity = String(opacity);
          });
        }
      }
      break;
    }

    case 'laser': {
      // laser [x y | off | follow]
      if (tokens[1] === 'off') {
        animLaserEnabled = false;
        animLaserFollow = false;
        if (animLaserDot) { animLaserDot.remove(); animLaserDot = null; }
        break;
      }
      if (tokens[1] === 'follow') {
        animLaserFollow = true;
        if (!animLaserDot) animExecLine('laser 50 50');
        break;
      }
      const lx = parseFloat(tokens[1]) ?? 50;
      const ly = parseFloat(tokens[2]) ?? 50;
      if (!animLaserDot) {
        animLaserDot = document.createElement('div');
        animLaserDot.className = 'laser-dot';
        canvas.appendChild(animLaserDot);
      }
      animLaserDot.style.left = lx + '%';
      animLaserDot.style.top  = ly + '%';
      animLaserEnabled = true;
      break;
    }

    case 'wait': {
      await animDelay(parseFloat(tokens[1]) || 1000);
      break;
    }

    case 'hide': {
      const obj = animGetObj(tokens[1]);
      if (!obj) break;
      obj.el.style.transition = '';
      obj.el.style.opacity = '0';
      break;
    }

    case 'unhide': {
      const obj = animGetObj(tokens[1]);
      if (!obj) break;
      obj.el.style.transition = '';
      obj.el.style.opacity = '1';
      break;
    }

    case 'fadein': {
      const obj = animGetObj(tokens[1]);
      const ms = parseFloat(tokens[2]) || 500;
      if (!obj) break;
      obj.el.style.transition = 'none';
      obj.el.style.opacity = '0';
      await animDelay(20);
      obj.el.style.transition = `opacity ${ms}ms ease`;
      obj.el.style.opacity = '1';
      await animDelay(ms);
      break;
    }

    case 'fadeout': {
      const obj = animGetObj(tokens[1]);
      const ms = parseFloat(tokens[2]) || 500;
      if (!obj) break;
      obj.el.style.transition = `opacity ${ms}ms ease`;
      obj.el.style.opacity = '0';
      await animDelay(ms);
      break;
    }

    case 'opacity': {
      const obj = animGetObj(tokens[1]);
      const val = parseFloat(tokens[2]) ?? 1;
      const ms  = parseFloat(tokens[3]) || 300;
      if (!obj) break;
      obj.el.style.transition = `opacity ${ms}ms ease`;
      obj.el.style.opacity = String(val);
      await animDelay(ms);
      break;
    }

    case 'move': {
      // move id x y ms
      const obj = animGetObj(tokens[1]);
      const x   = parseFloat(tokens[2]) ?? 50;
      const y   = parseFloat(tokens[3]) ?? 50;
      const ms  = parseFloat(tokens[4]) || 600;
      if (!obj) break;
      obj.el.style.transition = `left ${ms}ms cubic-bezier(.4,0,.2,1), top ${ms}ms cubic-bezier(.4,0,.2,1)`;
      obj.el.style.left = x + '%';
      obj.el.style.top  = y + '%';
      obj.x = x; obj.y = y;
      await animDelay(ms);
      break;
    }

    case 'slide': {
      // slide id direction ms
      const obj = animGetObj(tokens[1]);
      const dir = (tokens[2] || 'left').toLowerCase();
      const ms  = parseFloat(tokens[3]) || 500;
      if (!obj) break;
      obj.el.style.transition = 'none';
      if (dir === 'left')        { obj.el.style.left = '-25%'; }
      else if (dir === 'right')  { obj.el.style.left = '125%'; }
      else if (dir === 'top')    { obj.el.style.top  = '-25%'; }
      else if (dir === 'bottom') { obj.el.style.top  = '125%'; }
      else if (dir === 'topleft')     { obj.el.style.left = '-25%'; obj.el.style.top = '-25%'; }
      else if (dir === 'topright')    { obj.el.style.left = '125%'; obj.el.style.top = '-25%'; }
      else if (dir === 'bottomleft')  { obj.el.style.left = '-25%'; obj.el.style.top = '125%'; }
      else if (dir === 'bottomright') { obj.el.style.left = '125%'; obj.el.style.top = '125%'; }
      
      await animDelay(30);
      obj.el.style.transition = `left ${ms}ms cubic-bezier(.4,0,.2,1), top ${ms}ms cubic-bezier(.4,0,.2,1)`;
      obj.el.style.left = obj.x + '%';
      obj.el.style.top  = obj.y + '%';
      await animDelay(ms);
      break;
    }

    case 'exit': {
      // exit id direction ms
      const obj = animGetObj(tokens[1]);
      const dir = (tokens[2] || 'right').toLowerCase();
      const ms  = parseFloat(tokens[3]) || 500;
      if (!obj) break;
      obj.el.style.transition = `left ${ms}ms cubic-bezier(.4,0,.2,1), top ${ms}ms cubic-bezier(.4,0,.2,1)`;
      if (dir === 'left')        { obj.el.style.left = '-25%'; }
      else if (dir === 'right')  { obj.el.style.left = '125%'; }
      else if (dir === 'top')    { obj.el.style.top  = '-25%'; }
      else if (dir === 'bottom') { obj.el.style.top  = '125%'; }
      else if (dir === 'topleft')     { obj.el.style.left = '-25%'; obj.el.style.top = '-25%'; }
      else if (dir === 'topright')    { obj.el.style.left = '125%'; obj.el.style.top = '-25%'; }
      else if (dir === 'bottomleft')  { obj.el.style.left = '-25%'; obj.el.style.top = '125%'; }
      else if (dir === 'bottomright') { obj.el.style.left = '125%'; obj.el.style.top = '125%'; }
      await animDelay(ms);
      break;
    }

    case 'scale': {
      const obj    = animGetObj(tokens[1]);
      const factor = parseFloat(tokens[2]) || 1.5;
      const ms     = parseFloat(tokens[3]) || 300;
      if (!obj) break;
      obj.el.style.transition = `transform ${ms}ms cubic-bezier(.4,0,.2,1)`;
      obj.el.style.transform  = `translate(-50%,-50%) scale(${factor})`;
      obj.baseScale = factor;
      await animDelay(ms);
      break;
    }

    case 'color': {
      const obj = animGetObj(tokens[1]);
      const hex = tokens[2] || '#000000';
      const ms  = parseFloat(tokens[3]) || 300;
      if (!obj) break;
      obj.el.style.transition = `color ${ms}ms ease`;
      obj.el.style.color = hex;
      await animDelay(ms);
      break;
    }

    case 'size': {
      const obj = animGetObj(tokens[1]);
      const px  = parseFloat(tokens[2]) || 24;
      if (!obj) break;
      obj.el.style.fontSize = px + 'px';
      break;
    }

    case 'glow': {
      const obj = animGetObj(tokens[1]);
      const hex = tokens[2] || '#3b82f6';
      if (!obj) break;
      obj.el.style.textShadow = `0 0 16px ${hex}, 0 0 32px ${hex}, 0 0 48px ${hex}`;
      break;
    }

    case 'unglow': {
      const obj = animGetObj(tokens[1]);
      if (!obj) break;
      obj.el.style.textShadow = '';
      break;
    }

    case 'blink': {
      const obj   = animGetObj(tokens[1]);
      const times = parseInt(tokens[2]) || 3;
      const ms    = parseFloat(tokens[3]) || 200;
      if (!obj) break;
      for (let i = 0; i < times; i++) {
        if (animStopFlag) break;
        obj.el.style.opacity = '0';
        await animDelay(ms);
        if (animStopFlag) break;
        obj.el.style.opacity = '1';
        await animDelay(ms);
      }
      break;
    }

    // ── CSS keyframe effects (generic helper) ──
    case 'spin': {
      const obj = animGetObj(tokens[1]);
      const deg = parseFloat(tokens[2]) || 360;
      const axis = (tokens[3] || 'z').toLowerCase();
      const ms  = parseFloat(tokens[4]) || 1000;
      if (!obj) break;
      obj.el.style.transition = `transform ${ms}ms ease-in-out`;
      if (axis === 'x') obj.rx += deg;
      else if (axis === 'y') obj.ry += deg;
      else obj.rz += deg;
      obj.el.style.transform = `translate(-50%,-50%) rotateX(${obj.rx}deg) rotateY(${obj.ry}deg) rotateZ(${obj.rz}deg) scale(${obj.baseScale})`;
      await animDelay(ms);
      break;
    }

    case 'shake':
    case 'bounce':
    case 'pulse':
    case 'wobble':
    case 'flip':
    case 'swing':
    case 'jello':
    case 'rubberband':
    case 'flash':
    case 'heartbeat': {
      const obj = animGetObj(tokens[1]);
      const ms  = parseFloat(tokens[2]) || 600;
      if (!obj) break;
      obj.el.style.transition = 'none';
      obj.el.style.animation  = `anim-${op} ${ms}ms ease both`;
      await animDelay(ms + 20);
      obj.el.style.animation  = '';
      // restore state
      obj.el.style.transform  = `translate(-50%,-50%) rotateX(${obj.rx}deg) rotateY(${obj.ry}deg) rotateZ(${obj.rz}deg) scale(${obj.baseScale || 1})`;
      break;
    }

    case 'clear':
    case 'reset': {
      animClear();
      break;
    }
  }
}

async function runAnimation() {
  if (animStopFlag) return;
  animClear();
  animStopFlag  = false;
  animResolveStop = null;

  const lines = document.getElementById('animCode').value.split('\n');
  for (const line of lines) {
    if (animStopFlag) break;
    await animExecLine(line);
  }
}

function updateNumberLine(obj) {
  const gTicks = obj.el.querySelector('.ticks');
  const gLabels = obj.el.querySelector('.labels');
  gTicks.innerHTML = ''; gLabels.innerHTML = '';
  const range = obj.max - obj.min;
  for (let v = obj.min; v <= obj.max; v += obj.step) {
    const x = 20 + (v - obj.min) / range * 360;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x); line.setAttribute('y1', 25); line.setAttribute('x2', x); line.setAttribute('y2', 35);
    line.setAttribute('class', 'sprite-tick');
    gTicks.appendChild(line);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x); text.setAttribute('y', 50);
    text.setAttribute('class', 'sprite-label');
    text.textContent = v;
    gLabels.appendChild(text);
  }
}

function updatePlane(obj) {
  const gGrid = obj.el.querySelector('.grid-lines');
  const gLabels = obj.el.querySelector('.labels');
  gGrid.innerHTML = ''; gLabels.innerHTML = '';
  const step = obj.size / (obj.range * 2);
  for (let i = 0; i <= obj.range * 2; i++) {
    const pos = i * step;
    const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l1.setAttribute('x1', pos); l1.setAttribute('y1', 0); l1.setAttribute('x2', pos); l1.setAttribute('y2', obj.size);
    l1.setAttribute('class', 'sprite-grid');
    gGrid.appendChild(l1);
    const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l2.setAttribute('x1', 0); l2.setAttribute('y1', pos); l2.setAttribute('x2', obj.size); l2.setAttribute('y2', pos);
    l2.setAttribute('class', 'sprite-grid');
    gGrid.appendChild(l2);
  }
}

document.getElementById('animPlayBtn').addEventListener('click', () => {
  animStopFlag = false;
  animResolveStop = null;
  runAnimation();
});

document.getElementById('animStopBtn').addEventListener('click', () => {
  animStopFlag = true;
  if (animResolveStop) animResolveStop();
});

document.getElementById('animResetBtn').addEventListener('click', () => {
  animStopFlag = true;
  if (animResolveStop) animResolveStop();
  setTimeout(animClear, 50);
});

document.getElementById('animHelpBtn').addEventListener('click', () => {
  document.getElementById('helpOverlay').classList.add('visible');
});

document.getElementById('helpCloseBtn').addEventListener('click', () => {
  document.getElementById('helpOverlay').classList.remove('visible');
});

document.getElementById('helpOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('helpOverlay'))
    document.getElementById('helpOverlay').classList.remove('visible');
});

