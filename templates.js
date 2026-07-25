// templates.js — starter-template data extracted verbatim from katex.html (Phase 4).
// Classic script loaded after symbols.js/settings.js and before the app script,
// so `const TEMPLATES` stays a shared global. buildTemplatesPanel() consumes it
// exactly as before. Behaviour unchanged.

const TEMPLATES = [
  { name: 'Fraction',       src: '\\frac{a}{b}',                                              preview: '\\frac{a}{b}' },
  { name: 'Integral',       src: '\\int_{0}^{\\infty} f(x)\\,dx',                             preview: '\\int_0^\\infty f(x)\\,dx' },
  { name: 'Sum',            src: '\\sum_{n=1}^{\\infty} a_n',                                 preview: '\\sum_{n=1}^\\infty a_n' },
  { name: 'Limit',          src: '\\lim_{x \\to 0} \\frac{\\sin x}{x}',                      preview: '\\lim_{x\\to 0}\\frac{\\sin x}{x}' },
  { name: 'Matrix 2×2',     src: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',          preview: '\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}' },
  { name: 'System',         src: '\\begin{cases} f(x) & \\text{if } x > 0 \\\\ g(x) & \\text{if } x \\leq 0 \\end{cases}', preview: '\\begin{cases}f(x)&x>0\\\\g(x)&x\\leq0\\end{cases}' },
  { name: 'Piecewise',      src: '|x| = \\begin{cases} x & x \\geq 0 \\\\ -x & x < 0 \\end{cases}', preview: '|x|=\\begin{cases}x&x\\ge0\\\\-x&x<0\\end{cases}' },
  { name: 'Aligned eqs',    src: '\\begin{aligned} f(x) &= x^2 + 1 \\\\ g(x) &= 2x - 3 \\end{aligned}', preview: '\\begin{aligned}f(x)&=x^2+1\\\\g(x)&=2x-3\\end{aligned}' },
];
