// troll.js — TROLL MODE. Pure chaos, purely cosmetic, opt-in via a secret word.
//
// Type "trollmode" anywhere (cheat-code buffer — it never enters the document)
// and the editor bursts into: TV "no signal" blackouts that randomly freeze the
// screen, rainbow rain, the rendered output exploding into spinning characters,
// a roaming tornado, and an earthquake + emoji storm. There is NO escape — a
// page reload is the only way out (by design). It touches no saved data; the
// document/autosave are untouched, so reloading returns everything to normal.
//
// Fully self-contained: injects its own CSS, adds one keydown listener, and does
// nothing at all until the magic word is typed.

(function () {
  var SECRET = 'trollmode';
  var buf = '';
  var active = false;

  document.addEventListener('keydown', function (e) {
    if (active || !e.key || e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-SECRET.length);
    if (buf === SECRET) activate();
  });

  var EMOJI = ['🎈','🔥','🤡','✨','💥','🌈','🎉','👹','🌀','⚡','😈','🃏','💀','🎪','👽'];
  var GLYPHS = 'αβγπΣ∫∞λθΩ√∂∇≈≠∑ℵ⨌∮ξψφ'.split('');
  var pick = function (a) { return a[(Math.random() * a.length) | 0]; };
  var rand = function (a, b) { return a + Math.random() * (b - a); };

  var layer; // fixed, pointer-events:none overlay host for the cosmetic chaos

  function activate() {
    active = true;
    injectCSS();
    layer = document.createElement('div');
    layer.id = 'troll-layer';
    document.body.appendChild(layer);

    startRainbowRain();
    explodeCharacters();
    startTornado();
    startEmojiStorm();
    document.body.classList.add('troll-quake');
    startTVPause();
  }

  // ── Rainbow rain ─────────────────────────────────────────────────────────────
  function startRainbowRain() {
    var cv = fullscreenCanvas(2);
    var ctx = cv.getContext('2d');
    var drops = [];
    for (var i = 0; i < 160; i++) {
      drops.push({ x: Math.random() * cv.width, y: Math.random() * cv.height,
        len: rand(12, 40), sp: rand(6, 18), hue: Math.random() * 360 });
    }
    (function loop() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.lineWidth = 2.5;
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        ctx.strokeStyle = 'hsl(' + d.hue + ',100%,60%)';
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y + d.len); ctx.stroke();
        d.y += d.sp; d.hue = (d.hue + 6) % 360;
        if (d.y > cv.height) { d.y = -d.len; d.x = Math.random() * cv.width; }
      }
      requestAnimationFrame(loop);
    })();
  }

  // ── Explode the rendered output into spinning characters ─────────────────────
  function explodeCharacters() {
    var chars = [];
    try {
      var out = document.getElementById('output');
      if (out) {
        var walker = document.createTreeWalker(out, NodeFilter.SHOW_TEXT, null, false);
        var node, count = 0;
        while ((node = walker.nextNode()) && count < 320) {
          var txt = node.nodeValue;
          for (var i = 0; i < txt.length && count < 320; i++) {
            if (/\s/.test(txt[i])) continue;
            var range = document.createRange();
            range.setStart(node, i); range.setEnd(node, i + 1);
            var r = range.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            chars.push(spawnChar(txt[i], r.left, r.top, rand(14, 28)));
            count++;
          }
        }
        out.style.visibility = 'hidden'; // the characters "left"
      }
    } catch (_) {}
    // Always add ambient spinners so the effect shows even with empty output.
    for (var k = 0; k < 60; k++) {
      chars.push(spawnChar(pick(GLYPHS), rand(0, innerWidth), rand(0, innerHeight * 0.6), rand(16, 34)));
    }

    (function loop() {
      for (var i = 0; i < chars.length; i++) {
        var c = chars[i];
        c.vy += 0.18; c.x += c.vx; c.y += c.vy; c.rot += c.vr;
        if (c.y > innerHeight + 60) { c.y = -40; c.x = rand(0, innerWidth); c.vy = rand(0, 3); }
        if (c.x < -60) c.x = innerWidth + 40; else if (c.x > innerWidth + 60) c.x = -40;
        c.el.style.transform = 'translate(' + c.x + 'px,' + c.y + 'px) rotate(' + c.rot + 'deg)';
      }
      requestAnimationFrame(loop);
    })();
  }

  function spawnChar(ch, x, y, size) {
    var el = document.createElement('div');
    el.className = 'troll-char';
    el.textContent = ch;
    el.style.fontSize = size + 'px';
    el.style.color = 'hsl(' + (Math.random() * 360) + ',100%,60%)';
    layer.appendChild(el);
    return { el: el, x: x, y: y, vx: rand(-3, 3), vy: rand(-4, 2), rot: rand(0, 360), vr: rand(-18, 18) };
  }

  // ── Tornado vortex ───────────────────────────────────────────────────────────
  function startTornado() {
    var parts = [];
    for (var i = 0; i < 44; i++) {
      var el = document.createElement('div');
      el.className = 'troll-emoji';
      el.textContent = pick(EMOJI);
      el.style.fontSize = rand(16, 40) + 'px';
      layer.appendChild(el);
      parts.push({ el: el, ang: Math.random() * Math.PI * 2, rad: rand(10, 150),
        sp: rand(0.08, 0.22), yoff: rand(-160, 160) });
    }
    var cx = innerWidth / 2, cy = innerHeight / 2, dirx = 1.6, diry = 0.8;
    (function loop() {
      cx += dirx; cy += diry;
      if (cx < 120 || cx > innerWidth - 120) dirx *= -1;
      if (cy < 120 || cy > innerHeight - 120) diry *= -1;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.ang += p.sp;
        var wobble = 1 + 0.3 * Math.sin(p.ang * 0.5);
        var x = cx + Math.cos(p.ang) * p.rad * wobble;
        var y = cy + p.yoff + Math.sin(p.ang) * p.rad * 0.35;
        p.el.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + (p.ang * 60) + 'deg)';
      }
      requestAnimationFrame(loop);
    })();
  }

  // ── Emoji storm (sideways) ───────────────────────────────────────────────────
  function startEmojiStorm() {
    setInterval(function () {
      if (layer.querySelectorAll('.troll-storm').length > 70) return;
      var el = document.createElement('div');
      el.className = 'troll-emoji troll-storm';
      el.textContent = pick(EMOJI);
      el.style.fontSize = rand(18, 44) + 'px';
      var fromLeft = Math.random() < 0.5;
      var y = rand(0, innerHeight);
      var vx = (fromLeft ? 1 : -1) * rand(7, 16);
      var x = fromLeft ? -50 : innerWidth + 50;
      var rot = rand(0, 360), vr = rand(-20, 20);
      layer.appendChild(el);
      (function fly() {
        x += vx; y += Math.sin(x / 40) * 3; rot += vr;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rot + 'deg)';
        if (x < -80 || x > innerWidth + 80) { el.remove(); return; }
        requestAnimationFrame(fly);
      })();
    }, 110);
  }

  // ── TV "no signal" pause — randomly freezes the screen ───────────────────────
  function startTVPause() {
    var tv = document.createElement('div');
    tv.id = 'troll-tv';
    tv.style.display = 'none';
    var cv = document.createElement('canvas');
    tv.appendChild(cv);
    var label = document.createElement('div');
    label.className = 'troll-tv-label';
    label.textContent = '📺 NO SIGNAL';
    tv.appendChild(label);
    document.body.appendChild(tv);
    var ctx = cv.getContext('2d');
    var raf = null;

    function staticLoop() {
      cv.width = innerWidth >> 1; cv.height = innerHeight >> 1;
      var img = ctx.createImageData(cv.width, cv.height);
      var data = img.data;
      for (var i = 0; i < data.length; i += 4) {
        var v = (Math.random() * 255) | 0;
        data[i] = data[i + 1] = data[i + 2] = v; data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(staticLoop);
    }

    function schedule() {
      setTimeout(function () {
        tv.style.display = 'block';
        staticLoop();
        setTimeout(function () {
          tv.style.display = 'none';
          if (raf) cancelAnimationFrame(raf);
          schedule();
        }, rand(700, 2200));
      }, rand(2500, 7000));
    }
    schedule();
  }

  // ── helpers ──────────────────────────────────────────────────────────────────
  function fullscreenCanvas(z) {
    var cv = document.createElement('canvas');
    cv.width = innerWidth; cv.height = innerHeight;
    cv.className = 'troll-canvas';
    cv.style.zIndex = z;
    layer.appendChild(cv);
    addEventListener('resize', function () { cv.width = innerWidth; cv.height = innerHeight; });
    return cv;
  }

  function injectCSS() {
    var s = document.createElement('style');
    s.textContent =
      '#troll-layer{position:fixed;inset:0;pointer-events:none;z-index:999990;overflow:hidden;}' +
      '.troll-canvas{position:fixed;inset:0;}' +
      '.troll-char{position:fixed;left:0;top:0;font-weight:700;font-family:monospace;' +
        'text-shadow:0 0 6px currentColor;will-change:transform;}' +
      '.troll-emoji{position:fixed;left:0;top:0;will-change:transform;}' +
      '#troll-tv{position:fixed;inset:0;z-index:999999;background:#000;pointer-events:auto;}' +
      '#troll-tv canvas{width:100%;height:100%;opacity:.9;}' +
      '.troll-tv-label{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;' +
        'font:700 42px monospace;color:#fff;text-shadow:2px 2px 0 #f00,-2px -2px 0 #0ff;letter-spacing:3px;}' +
      '@keyframes troll-shake{' +
        '0%{transform:translate(0,0)}25%{transform:translate(-7px,5px) rotate(-.6deg)}' +
        '50%{transform:translate(6px,-6px) rotate(.5deg)}75%{transform:translate(-5px,-4px) rotate(-.4deg)}' +
        '100%{transform:translate(5px,6px) rotate(.5deg)}}' +
      'body.troll-quake{animation:troll-shake .12s infinite;}';
    document.head.appendChild(s);
  }
})();
