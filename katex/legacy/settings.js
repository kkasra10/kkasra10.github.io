// settings.js — settings subsystem extracted verbatim from katex.html (Phase 3).
// Classic script loaded after symbols.js and before the app script, so all
// globals (SETTINGS_KEY, loadSettings, saveSettings, applyLineSpacing,
// applySettings, autoSaveInput) and the DOM event bindings behave identically.
// applySettings() is still invoked from the app's init sequence, not here.

// ── Settings ──────────────────────────────────────────────────────────────────
const SETTINGS_KEY = 'lx_settings';

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch(e) { return {}; }
}
function saveSettings(patch) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(Object.assign(loadSettings(), patch)));
}

function applyLineSpacing(val) {
  // gap can't go negative in CSS; negative slider values instead shrink the
  // per-line min-height AND pull lines together with a negative margin that
  // reclaims displayMode's intrinsic vertical whitespace — up to ~3x tighter.
  const gap     = Math.max(0, val) + 'px';
  const minH    = Math.max(8, 36 + val * 0.67) + 'px';
  const tighten = Math.min(0, val) * 0.22 + 'px';
  document.documentElement.style.setProperty('--line-gap', gap);
  document.documentElement.style.setProperty('--line-min-h', minH);
  document.documentElement.style.setProperty('--line-tighten', tighten);
}

function applySettings() {
  const s = loadSettings();
  // Dark mode
  document.body.classList.toggle('dark', !!s.darkMode);
  document.getElementById('settingDarkMode').checked = !!s.darkMode;
  // Auto-save: restore saved input
  document.getElementById('settingAutoSave').checked = !!s.autoSave;
  if (s.autoSave && s.savedInput) {
    document.getElementById('latexInput').value = s.savedInput;
  }
  // RTL
  document.getElementById('settingRTL').checked = !!s.rtl;
  document.documentElement.setAttribute('dir', s.rtl ? 'rtl' : 'ltr');
  // Language
  const lang = s.lang || 'en';
  document.getElementById('settingLang').value = lang;
  if (lang !== 'en') applyLanguage(lang);
  // Line spacing
  const spacing = s.lineSpacing !== undefined ? s.lineSpacing : 12;
  document.getElementById('spacingSlider').value = spacing;
  applyLineSpacing(spacing);
  // Background color of the output area
  const bg = s.bgColor || '';
  document.getElementById('settingBgColor').value = bg || '#ffffff';
  document.getElementById('output').style.background = bg;
}

document.getElementById('spacingSlider').addEventListener('input', function() {
  const val = parseInt(this.value, 10);
  applyLineSpacing(val);
  saveSettings({ lineSpacing: val });
});

document.getElementById('settingDarkMode').addEventListener('change', function() {
  saveSettings({ darkMode: this.checked });
  document.body.classList.toggle('dark', this.checked);
});

document.getElementById('settingRTL').addEventListener('change', function() {
  saveSettings({ rtl: this.checked });
  document.documentElement.setAttribute('dir', this.checked ? 'rtl' : 'ltr');
});

document.getElementById('settingLang').addEventListener('change', function() {
  saveSettings({ lang: this.value });
  applyLanguage(this.value);
});

document.getElementById('settingAutoSave').addEventListener('change', function() {
  saveSettings({ autoSave: this.checked });
  if (!this.checked) saveSettings({ savedInput: '' });
  if (typeof syncShortcutPersistence === 'function') syncShortcutPersistence();
});

document.getElementById('settingBgColor').addEventListener('input', function() {
  document.getElementById('output').style.background = this.value;
  saveSettings({ bgColor: this.value });
});

document.getElementById('settingBgReset').addEventListener('click', function() {
  document.getElementById('output').style.background = '';
  document.getElementById('settingBgColor').value = '#ffffff';
  saveSettings({ bgColor: '' });
});

// Toggle settings panel open/close
document.getElementById('settingsBtn').addEventListener('click', function(e) {
  e.stopPropagation();
  document.getElementById('settingsPanel').classList.toggle('hidden');
});
document.addEventListener('click', function(e) {
  const panel = document.getElementById('settingsPanel');
  if (!panel.classList.contains('hidden') && !panel.contains(e.target) && e.target.id !== 'settingsBtn') {
    panel.classList.add('hidden');
  }
});

// Auto-save: persist input on each change when enabled
function autoSaveInput(val) {
  if (loadSettings().autoSave) saveSettings({ savedInput: val });
}

