// symbols.js — palette data extracted verbatim from latex.html (Phase 2).
// Classic script: `const SYMBOLS` lives in the shared global lexical scope,
// so the main script sees it exactly as before. Behaviour unchanged.

const SYMBOLS = [

  // ── With Limits ──────────────────────────────────────────────────────────
  {
    name: 'With Limits', wide: true,
    items: [
      { cmd: '\\sum_{n=}^{}',                         render: '\\textstyle\\sum_{n=}^{}',                         label: 'Σ  n= to …'       },
      { cmd: '\\sum_{n=0}^{\\infty}',                 render: '\\textstyle\\sum_{n=0}^{\\infty}',                 label: 'Σ  n=0 to ∞'      },
      { cmd: '\\sum_{k=1}^{}',                        render: '\\textstyle\\sum_{k=1}^{}',                        label: 'Σ  k=1 to …'      },
      { cmd: '\\sum_{i=0}^{}',                        render: '\\textstyle\\sum_{i=0}^{}',                        label: 'Σ  i=0 to …'      },
      { cmd: '\\int_{}^{}',                           render: '\\textstyle\\int_{}^{}',                           label: '∫  from … to …'   },
      { cmd: '\\int_{0}^{\\infty}',                   render: '\\textstyle\\int_{0}^{\\infty}',                   label: '∫  0 to ∞'        },
      { cmd: '\\int_{-\\infty}^{\\infty}',            render: '\\textstyle\\int_{-\\infty}^{\\infty}',            label: '∫  -∞ to ∞'       },
      { cmd: '\\int_{0}^{}',                          render: '\\textstyle\\int_{0}^{}',                          label: '∫  0 to …'        },
      { cmd: '\\oint_{}^{}',                          render: '\\textstyle\\oint_{}^{}',                          label: '∮  from … to …'   },
      { cmd: '\\iint_{}',                             render: '\\textstyle\\iint_{}',                             label: '∬  over …'        },
      { cmd: '\\iiint_{}',                            render: '\\textstyle\\iiint_{}',                            label: '∭  over …'        },
      { cmd: '\\iiint\\!\\int_{}',                    render: '\\text{⨌}',                                       label: '⨌  over …'        },
      { cmd: '\\prod_{n=}^{}',                        render: '\\textstyle\\prod_{n=}^{}',                        label: '∏  n= to …'       },
      { cmd: '\\prod_{n=1}^{\\infty}',                render: '\\textstyle\\prod_{n=1}^{\\infty}',                label: '∏  n=1 to ∞'      },
      { cmd: '\\prod_{k=0}^{}',                       render: '\\textstyle\\prod_{k=0}^{}',                       label: '∏  k=0 to …'      },
      { cmd: '\\coprod_{n=}^{}',                      render: '\\textstyle\\coprod_{n=}^{}',                      label: '∐  n= to …'       },
      { cmd: '\\lim_{x \\to }',                       render: '\\textstyle\\lim_{x \\to {}}',                     label: 'lim  x→…'         },
      { cmd: '\\lim_{n \\to \\infty}',                render: '\\textstyle\\lim_{n \\to \\infty}',                label: 'lim  n→∞'         },
      { cmd: '\\lim_{x \\to 0}',                      render: '\\textstyle\\lim_{x \\to 0}',                      label: 'lim  x→0'         },
      { cmd: '\\lim_{x \\to 0^+}',                    render: '\\textstyle\\lim_{x \\to 0^+}',                    label: 'lim  x→0⁺'        },
      { cmd: '\\lim_{x \\to 0^-}',                    render: '\\textstyle\\lim_{x \\to 0^-}',                    label: 'lim  x→0⁻'        },
      { cmd: '\\lim_{h \\to 0}',                      render: '\\textstyle\\lim_{h \\to 0}',                      label: 'lim  h→0'         },
      { cmd: '\\limsup_{n \\to \\infty}',             render: '\\textstyle\\limsup_{n \\to \\infty}',             label: 'limsup n→∞'       },
      { cmd: '\\liminf_{n \\to \\infty}',             render: '\\textstyle\\liminf_{n \\to \\infty}',             label: 'liminf n→∞'       },
      { cmd: '\\max_{}',                              render: '\\textstyle\\max_{}',                              label: 'max  …'           },
      { cmd: '\\min_{}',                              render: '\\textstyle\\min_{}',                              label: 'min  …'           },
      { cmd: '\\sup_{}',                              render: '\\textstyle\\sup_{}',                              label: 'sup  …'           },
      { cmd: '\\inf_{}',                              render: '\\textstyle\\inf_{}',                              label: 'inf  …'           },
      { cmd: '\\bigcup_{i=1}^{}',                     render: '\\textstyle\\bigcup_{i=1}^{}',                     label: '⋃  i=1 to …'      },
      { cmd: '\\bigcap_{i=1}^{}',                     render: '\\textstyle\\bigcap_{i=1}^{}',                     label: '⋂  i=1 to …'      },
      { cmd: '\\bigoplus_{i=1}^{}',                   render: '\\textstyle\\bigoplus_{i=1}^{}',                   label: '⊕  i=1 to …'      },
      { cmd: '\\bigotimes_{i=1}^{}',                  render: '\\textstyle\\bigotimes_{i=1}^{}',                  label: '⊗  i=1 to …'      },
      { cmd: '\\bigsqcup_{i=1}^{}',                   render: '\\textstyle\\bigsqcup_{i=1}^{}',                   label: '⊔  i=1 to …'      },
      { cmd: '\\bigvee_{i=1}^{}',                     render: '\\textstyle\\bigvee_{i=1}^{}',                     label: '⋁  i=1 to …'      },
      { cmd: '\\bigwedge_{i=1}^{}',                   render: '\\textstyle\\bigwedge_{i=1}^{}',                   label: '⋀  i=1 to …'      },
      { cmd: '\\frac{d}{dx}',                         render: '\\textstyle\\frac{d}{dx}',                         label: 'd/dx'             },
      { cmd: '\\frac{d^{}}{dx^{}}',                   render: '\\textstyle\\frac{d^n}{dx^n}',                     label: 'dⁿ/dxⁿ'           },
      { cmd: '\\frac{\\partial}{\\partial }',         render: '\\textstyle\\frac{\\partial}{\\partial x}',        label: '∂/∂x'             },
      { cmd: '\\frac{\\partial^{}}{\\partial {}^{}}', render: '\\textstyle\\frac{\\partial^n}{\\partial x^n}',    label: '∂ⁿ/∂xⁿ'           },
    ]
  },

  // ── Greek (lower) ────────────────────────────────────────────────────────
  {
    name: 'Greek (lower)',
    items: [
      { cmd: '\\alpha',      render: '\\alpha'      },
      { cmd: '\\beta',       render: '\\beta'       },
      { cmd: '\\gamma',      render: '\\gamma'      },
      { cmd: '\\delta',      render: '\\delta'      },
      { cmd: '\\epsilon',    render: '\\epsilon'    },
      { cmd: '\\varepsilon', render: '\\varepsilon' },
      { cmd: '\\zeta',       render: '\\zeta'       },
      { cmd: '\\eta',        render: '\\eta'        },
      { cmd: '\\theta',      render: '\\theta'      },
      { cmd: '\\vartheta',   render: '\\vartheta'   },
      { cmd: '\\iota',       render: '\\iota'       },
      { cmd: '\\kappa',      render: '\\kappa'      },
      { cmd: '\\varkappa',   render: '\\varkappa'   },
      { cmd: '\\lambda',     render: '\\lambda'     },
      { cmd: '\\mu',         render: '\\mu'         },
      { cmd: '\\nu',         render: '\\nu'         },
      { cmd: '\\xi',         render: '\\xi'         },
      { cmd: '\\pi',         render: '\\pi'         },
      { cmd: '\\varpi',      render: '\\varpi'      },
      { cmd: '\\rho',        render: '\\rho'        },
      { cmd: '\\varrho',     render: '\\varrho'     },
      { cmd: '\\sigma',      render: '\\sigma'      },
      { cmd: '\\varsigma',   render: '\\varsigma'   },
      { cmd: '\\tau',        render: '\\tau'        },
      { cmd: '\\upsilon',    render: '\\upsilon'    },
      { cmd: '\\phi',        render: '\\phi'        },
      { cmd: '\\varphi',     render: '\\varphi'     },
      { cmd: '\\chi',        render: '\\chi'        },
      { cmd: '\\psi',        render: '\\psi'        },
      { cmd: '\\omega',      render: '\\omega'      },
      { cmd: '\\digamma',    render: '\\digamma'    },
    ]
  },

  // ── Greek (upper) ────────────────────────────────────────────────────────
  {
    name: 'Greek (upper)',
    items: [
      { cmd: '\\Gamma',   render: '\\Gamma'   },
      { cmd: '\\Delta',   render: '\\Delta'   },
      { cmd: '\\Theta',   render: '\\Theta'   },
      { cmd: '\\Lambda',  render: '\\Lambda'  },
      { cmd: '\\Xi',      render: '\\Xi'      },
      { cmd: '\\Pi',      render: '\\Pi'      },
      { cmd: '\\Sigma',   render: '\\Sigma'   },
      { cmd: '\\Upsilon', render: '\\Upsilon' },
      { cmd: '\\Phi',     render: '\\Phi'     },
      { cmd: '\\Psi',     render: '\\Psi'     },
      { cmd: '\\Omega',   render: '\\Omega'   },
      { cmd: '\\varGamma',   render: '\\varGamma'   },
      { cmd: '\\varDelta',   render: '\\varDelta'   },
      { cmd: '\\varTheta',   render: '\\varTheta'   },
      { cmd: '\\varLambda',  render: '\\varLambda'  },
      { cmd: '\\varPi',      render: '\\varPi'      },
      { cmd: '\\varSigma',   render: '\\varSigma'   },
      { cmd: '\\varPhi',     render: '\\varPhi'     },
      { cmd: '\\varPsi',     render: '\\varPsi'     },
      { cmd: '\\varOmega',   render: '\\varOmega'   },
    ]
  },

  // ── Binary Operators ─────────────────────────────────────────────────────
  {
    name: 'Binary Operators',
    items: [
      { cmd: '\\pm',              render: '\\pm'              },
      { cmd: '\\mp',              render: '\\mp'              },
      { cmd: '\\times',           render: '\\times'           },
      { cmd: '\\div',             render: '\\div'             },
      { cmd: '\\cdot',            render: '\\cdot'            },
      { cmd: '\\centerdot',       render: '\\centerdot'       },
      { cmd: '\\circ',            render: '\\circ'            },
      { cmd: '\\bullet',          render: '\\bullet'          },
      { cmd: '\\ast',             render: '\\ast'             },
      { cmd: '\\star',            render: '\\star'            },
      { cmd: '\\dagger',          render: '\\dagger'          },
      { cmd: '\\ddagger',         render: '\\ddagger'         },
      { cmd: '\\oplus',           render: '\\oplus'           },
      { cmd: '\\ominus',          render: '\\ominus'          },
      { cmd: '\\otimes',          render: '\\otimes'          },
      { cmd: '\\oslash',          render: '\\oslash'          },
      { cmd: '\\odot',            render: '\\odot'            },
      { cmd: '\\circledast',      render: '\\circledast'      },
      { cmd: '\\circledcirc',     render: '\\circledcirc'     },
      { cmd: '\\circleddash',     render: '\\circleddash'     },
      { cmd: '\\boxplus',         render: '\\boxplus'         },
      { cmd: '\\boxminus',        render: '\\boxminus'        },
      { cmd: '\\boxtimes',        render: '\\boxtimes'        },
      { cmd: '\\boxdot',          render: '\\boxdot'          },
      { cmd: '\\wedge',           render: '\\wedge'           },
      { cmd: '\\vee',             render: '\\vee'             },
      { cmd: '\\curlywedge',      render: '\\curlywedge'      },
      { cmd: '\\curlyvee',        render: '\\curlyvee'        },
      { cmd: '\\barwedge',        render: '\\barwedge'        },
      { cmd: '\\veebar',          render: '\\veebar'          },
      { cmd: '\\doublebarwedge',  render: '\\doublebarwedge'  },
      { cmd: '\\cap',             render: '\\cap'             },
      { cmd: '\\cup',             render: '\\cup'             },
      { cmd: '\\sqcap',           render: '\\sqcap'           },
      { cmd: '\\sqcup',           render: '\\sqcup'           },
      { cmd: '\\uplus',           render: '\\uplus'           },
      { cmd: '\\setminus',        render: '\\setminus'        },
      { cmd: '\\smallsetminus',   render: '\\smallsetminus'   },
      { cmd: '\\wr',              render: '\\wr'              },
      { cmd: '\\ltimes',          render: '\\ltimes'          },
      { cmd: '\\rtimes',          render: '\\rtimes'          },
      { cmd: '\\leftthreetimes',  render: '\\leftthreetimes'  },
      { cmd: '\\rightthreetimes', render: '\\rightthreetimes' },
      { cmd: '\\divideontimes',   render: '\\divideontimes'   },
      { cmd: '\\dotplus',         render: '\\dotplus'         },
      { cmd: '\\intercal',        render: '\\intercal'        },
    ]
  },

  // ── Relations ─────────────────────────────────────────────────────────────
  {
    name: 'Relations',
    items: [
      { cmd: '\\leq',         render: '\\leq'         },
      { cmd: '\\geq',         render: '\\geq'         },
      { cmd: '\\leqq',        render: '\\leqq'        },
      { cmd: '\\geqq',        render: '\\geqq'        },
      { cmd: '\\leqslant',    render: '\\leqslant'    },
      { cmd: '\\geqslant',    render: '\\geqslant'    },
      { cmd: '\\eqslantless', render: '\\eqslantless' },
      { cmd: '\\eqslantgtr',  render: '\\eqslantgtr'  },
      { cmd: '\\lesssim',     render: '\\lesssim'     },
      { cmd: '\\gtrsim',      render: '\\gtrsim'      },
      { cmd: '\\lessapprox',  render: '\\lessapprox'  },
      { cmd: '\\gtrapprox',   render: '\\gtrapprox'   },
      { cmd: '\\lessdot',     render: '\\lessdot'     },
      { cmd: '\\gtrdot',      render: '\\gtrdot'      },
      { cmd: '\\lll',         render: '\\lll'         },
      { cmd: '\\ggg',         render: '\\ggg'         },
      { cmd: '\\ll',          render: '\\ll'          },
      { cmd: '\\gg',          render: '\\gg'          },
      { cmd: '\\lessgtr',     render: '\\lessgtr'     },
      { cmd: '\\gtrless',     render: '\\gtrless'     },
      { cmd: '\\lesseqgtr',   render: '\\lesseqgtr'   },
      { cmd: '\\gtreqless',   render: '\\gtreqless'   },
      { cmd: '\\lesseqqgtr',  render: '\\lesseqqgtr'  },
      { cmd: '\\gtreqqless',  render: '\\gtreqqless'  },
      { cmd: '\\neq',         render: '\\neq'         },
      { cmd: '\\equiv',       render: '\\equiv'       },
      { cmd: '\\approx',      render: '\\approx'      },
      { cmd: '\\approxeq',    render: '\\approxeq'    },
      { cmd: '\\thickapprox', render: '\\thickapprox' },
      { cmd: '\\sim',         render: '\\sim'         },
      { cmd: '\\thicksim',    render: '\\thicksim'    },
      { cmd: '\\simeq',       render: '\\simeq'       },
      { cmd: '\\backsim',     render: '\\backsim'     },
      { cmd: '\\backsimeq',   render: '\\backsimeq'   },
      { cmd: '\\cong',        render: '\\cong'        },
      { cmd: '\\ncong',       render: '\\ncong'       },
      { cmd: '\\propto',      render: '\\propto'      },
      { cmd: '\\varpropto',   render: '\\varpropto'   },
      { cmd: '\\doteq',       render: '\\doteq'       },
      { cmd: '\\doteqdot',    render: '\\doteqdot'    },
      { cmd: '\\circeq',      render: '\\circeq'      },
      { cmd: '\\triangleq',   render: '\\triangleq'   },
      { cmd: '\\bumpeq',      render: '\\bumpeq'      },
      { cmd: '\\Bumpeq',      render: '\\Bumpeq'      },
      { cmd: '\\between',     render: '\\between'     },
      { cmd: '\\pitchfork',   render: '\\pitchfork'   },
      { cmd: '\\asymp',       render: '\\asymp'       },
      { cmd: '\\bowtie',      render: '\\bowtie'      },
      { cmd: '\\prec',        render: '\\prec'        },
      { cmd: '\\succ',        render: '\\succ'        },
      { cmd: '\\preceq',      render: '\\preceq'      },
      { cmd: '\\succeq',      render: '\\succeq'      },
      { cmd: '\\preccurlyeq', render: '\\preccurlyeq' },
      { cmd: '\\succcurlyeq', render: '\\succcurlyeq' },
      { cmd: '\\precsim',     render: '\\precsim'     },
      { cmd: '\\succsim',     render: '\\succsim'     },
      { cmd: '\\precapprox',  render: '\\precapprox'  },
      { cmd: '\\succapprox',  render: '\\succapprox'  },
      { cmd: '\\perp',        render: '\\perp'        },
      { cmd: '\\parallel',    render: '\\parallel'    },
      { cmd: '\\mid',         render: '\\mid'         },
      { cmd: '\\shortmid',    render: '\\shortmid'    },
      { cmd: '\\shortparallel',render: '\\shortparallel'},
      { cmd: '\\vdash',       render: '\\vdash'       },
      { cmd: '\\dashv',       render: '\\dashv'       },
      { cmd: '\\Vdash',       render: '\\Vdash'       },
      { cmd: '\\vDash',       render: '\\vDash'       },
      { cmd: '\\Vvdash',      render: '\\Vvdash'      },
      { cmd: '\\models',      render: '\\models'      },
      { cmd: '\\smallsmile',  render: '\\smallsmile'  },
      { cmd: '\\smallfrown',  render: '\\smallfrown'  },
      { cmd: '\\smile',       render: '\\smile'       },
      { cmd: '\\frown',       render: '\\frown'       },
    ]
  },

  // ── Negated Relations ─────────────────────────────────────────────────────
  {
    name: 'Negated Relations',
    items: [
      { cmd: '\\nleq',          render: '\\nleq'          },
      { cmd: '\\ngeq',          render: '\\ngeq'          },
      { cmd: '\\nleqq',         render: '\\nleqq'         },
      { cmd: '\\ngeqq',         render: '\\ngeqq'         },
      { cmd: '\\nleqslant',     render: '\\nleqslant'     },
      { cmd: '\\ngeqslant',     render: '\\ngeqslant'     },
      { cmd: '\\nless',         render: '\\nless'         },
      { cmd: '\\ngtr',          render: '\\ngtr'          },
      { cmd: '\\nprec',         render: '\\nprec'         },
      { cmd: '\\nsucc',         render: '\\nsucc'         },
      { cmd: '\\npreceq',       render: '\\npreceq'       },
      { cmd: '\\nsucceq',       render: '\\nsucceq'       },
      { cmd: '\\nsim',          render: '\\nsim'          },
      { cmd: '\\ncong',         render: '\\ncong'         },
      { cmd: '\\nmid',          render: '\\nmid'          },
      { cmd: '\\nparallel',     render: '\\nparallel'     },
      { cmd: '\\nshortmid',     render: '\\nshortmid'     },
      { cmd: '\\nshortparallel',render: '\\nshortparallel'},
      { cmd: '\\nvdash',        render: '\\nvdash'        },
      { cmd: '\\nvDash',        render: '\\nvDash'        },
      { cmd: '\\nVdash',        render: '\\nVdash'        },
      { cmd: '\\nVDash',        render: '\\nVDash'        },
      { cmd: '\\nsubseteq',     render: '\\nsubseteq'     },
      { cmd: '\\nsupseteq',     render: '\\nsupseteq'     },
      { cmd: '\\nsubseteqq',    render: '\\nsubseteqq'    },
      { cmd: '\\nsupseteqq',    render: '\\nsupseteqq'    },
      { cmd: '\\subsetneq',     render: '\\subsetneq'     },
      { cmd: '\\supsetneq',     render: '\\supsetneq'     },
      { cmd: '\\subsetneqq',    render: '\\subsetneqq'    },
      { cmd: '\\supsetneqq',    render: '\\supsetneqq'    },
      { cmd: '\\not\\equiv',    render: '\\not\\equiv'    },
      { cmd: '\\not\\approx',   render: '\\not\\approx'   },
      { cmd: '\\not\\sim',      render: '\\not\\sim'      },
    ]
  },

  // ── Triangle / Order Relations ────────────────────────────────────────────
  {
    name: 'Triangle Relations',
    items: [
      { cmd: '\\vartriangleleft',   render: '\\vartriangleleft'   },
      { cmd: '\\vartriangleright',  render: '\\vartriangleright'  },
      { cmd: '\\trianglelefteq',    render: '\\trianglelefteq'    },
      { cmd: '\\trianglerighteq',   render: '\\trianglerighteq'   },
      { cmd: '\\ntriangleleft',     render: '\\ntriangleleft'     },
      { cmd: '\\ntriangleright',    render: '\\ntriangleright'    },
      { cmd: '\\ntrianglelefteq',   render: '\\ntrianglelefteq'   },
      { cmd: '\\ntrianglerighteq',  render: '\\ntrianglerighteq'  },
      { cmd: '\\blacktriangleleft', render: '\\blacktriangleleft' },
      { cmd: '\\blacktriangleright',render: '\\blacktriangleright'},
    ]
  },

  // ── Sets ──────────────────────────────────────────────────────────────────
  {
    name: 'Sets',
    items: [
      { cmd: '\\in',         render: '\\in'         },
      { cmd: '\\notin',      render: '\\notin'      },
      { cmd: '\\ni',         render: '\\ni'         },
      { cmd: '\\not\\ni',    render: '\\not\\ni'    },
      { cmd: '\\subset',     render: '\\subset'     },
      { cmd: '\\supset',     render: '\\supset'     },
      { cmd: '\\Subset',     render: '\\Subset'     },
      { cmd: '\\Supset',     render: '\\Supset'     },
      { cmd: '\\subseteq',   render: '\\subseteq'   },
      { cmd: '\\supseteq',   render: '\\supseteq'   },
      { cmd: '\\subseteqq',  render: '\\subseteqq'  },
      { cmd: '\\supseteqq',  render: '\\supseteqq'  },
      { cmd: '\\sqsubset',   render: '\\sqsubset'   },
      { cmd: '\\sqsupset',   render: '\\sqsupset'   },
      { cmd: '\\sqsubseteq', render: '\\sqsubseteq' },
      { cmd: '\\sqsupseteq', render: '\\sqsupseteq' },
      { cmd: '\\emptyset',   render: '\\emptyset'   },
      { cmd: '\\varnothing', render: '\\varnothing' },
      { cmd: '\\complement', render: '\\complement' },
      { cmd: '\\mathbb{N}',  render: '\\mathbb{N}'  },
      { cmd: '\\mathbb{Z}',  render: '\\mathbb{Z}'  },
      { cmd: '\\mathbb{Q}',  render: '\\mathbb{Q}'  },
      { cmd: '\\mathbb{R}',  render: '\\mathbb{R}'  },
      { cmd: '\\mathbb{C}',  render: '\\mathbb{C}'  },
      { cmd: '\\mathbb{H}',  render: '\\mathbb{H}'  },
      { cmd: '\\mathbb{P}',  render: '\\mathbb{P}'  },
      { cmd: '\\mathbb{F}',  render: '\\mathbb{F}'  },
    ]
  },

  // ── Arrows ────────────────────────────────────────────────────────────────
  {
    name: 'Arrows',
    items: [
      { cmd: '\\to',                  render: '\\to'                  },
      { cmd: '\\leftarrow',           render: '\\leftarrow'           },
      { cmd: '\\leftrightarrow',      render: '\\leftrightarrow'      },
      { cmd: '\\uparrow',             render: '\\uparrow'             },
      { cmd: '\\downarrow',           render: '\\downarrow'           },
      { cmd: '\\updownarrow',         render: '\\updownarrow'         },
      { cmd: '\\Rightarrow',          render: '\\Rightarrow'          },
      { cmd: '\\Leftarrow',           render: '\\Leftarrow'           },
      { cmd: '\\Leftrightarrow',      render: '\\Leftrightarrow'      },
      { cmd: '\\Uparrow',             render: '\\Uparrow'             },
      { cmd: '\\Downarrow',           render: '\\Downarrow'           },
      { cmd: '\\Updownarrow',         render: '\\Updownarrow'         },
      { cmd: '\\iff',                 render: '\\iff'                 },
      { cmd: '\\implies',             render: '\\implies'             },
      { cmd: '\\impliedby',           render: '\\impliedby'           },
      { cmd: '\\mapsto',              render: '\\mapsto'              },
      { cmd: '\\longmapsto',          render: '\\longmapsto'          },
      { cmd: '\\longleftarrow',       render: '\\longleftarrow'       },
      { cmd: '\\longrightarrow',      render: '\\longrightarrow'      },
      { cmd: '\\longleftrightarrow',  render: '\\longleftrightarrow'  },
      { cmd: '\\Longleftarrow',       render: '\\Longleftarrow'       },
      { cmd: '\\Longrightarrow',      render: '\\Longrightarrow'      },
      { cmd: '\\Longleftrightarrow',  render: '\\Longleftrightarrow'  },
      { cmd: '\\nearrow',             render: '\\nearrow'             },
      { cmd: '\\searrow',             render: '\\searrow'             },
      { cmd: '\\swarrow',             render: '\\swarrow'             },
      { cmd: '\\nwarrow',             render: '\\nwarrow'             },
      { cmd: '\\hookrightarrow',      render: '\\hookrightarrow'      },
      { cmd: '\\hookleftarrow',       render: '\\hookleftarrow'       },
      { cmd: '\\rightharpoonup',      render: '\\rightharpoonup'      },
      { cmd: '\\rightharpoondown',    render: '\\rightharpoondown'    },
      { cmd: '\\leftharpoonup',       render: '\\leftharpoonup'       },
      { cmd: '\\leftharpoondown',     render: '\\leftharpoondown'     },
      { cmd: '\\upharpoonleft',       render: '\\upharpoonleft'       },
      { cmd: '\\upharpoonright',      render: '\\upharpoonright'      },
      { cmd: '\\downharpoonleft',     render: '\\downharpoonleft'     },
      { cmd: '\\downharpoonright',    render: '\\downharpoonright'    },
      { cmd: '\\rightleftharpoons',   render: '\\rightleftharpoons'   },
      { cmd: '\\leftrightharpoons',   render: '\\leftrightharpoons'   },
      { cmd: '\\twoheadrightarrow',   render: '\\twoheadrightarrow'   },
      { cmd: '\\twoheadleftarrow',    render: '\\twoheadleftarrow'    },
      { cmd: '\\rightarrowtail',      render: '\\rightarrowtail'      },
      { cmd: '\\leftarrowtail',       render: '\\leftarrowtail'       },
      { cmd: '\\curvearrowleft',      render: '\\curvearrowleft'      },
      { cmd: '\\curvearrowright',     render: '\\curvearrowright'     },
      { cmd: '\\circlearrowleft',     render: '\\circlearrowleft'     },
      { cmd: '\\circlearrowright',    render: '\\circlearrowright'    },
      { cmd: '\\looparrowleft',       render: '\\looparrowleft'       },
      { cmd: '\\looparrowright',      render: '\\looparrowright'      },
      { cmd: '\\Lsh',                 render: '\\Lsh'                 },
      { cmd: '\\Rsh',                 render: '\\Rsh'                 },
      { cmd: '\\multimap',            render: '\\multimap'            },
      { cmd: '\\nrightarrow',         render: '\\nrightarrow'         },
      { cmd: '\\nleftarrow',          render: '\\nleftarrow'          },
      { cmd: '\\nRightarrow',         render: '\\nRightarrow'         },
      { cmd: '\\nLeftarrow',          render: '\\nLeftarrow'          },
      { cmd: '\\nleftrightarrow',     render: '\\nleftrightarrow'     },
      { cmd: '\\nLeftrightarrow',     render: '\\nLeftrightarrow'     },
      { cmd: '\\xleftarrow[]{}',      render: '\\xleftarrow[b]{a}'    },
      { cmd: '\\xrightarrow[]{}',     render: '\\xrightarrow[b]{a}'   },
      { cmd: '\\xLeftarrow[]{}',      render: '\\xLeftarrow[b]{a}'    },
      { cmd: '\\xRightarrow[]{}',     render: '\\xRightarrow[b]{a}'   },
      { cmd: '\\xLeftrightarrow[]{}', render: '\\xLeftrightarrow[b]{a}'},
      { cmd: '\\xmapsto[]{}',         render: '\\xmapsto[b]{a}'       },
    ]
  },

  // ── Structures ────────────────────────────────────────────────────────────
  {
    name: 'Structures',
    items: [
      { cmd: '\\frac{}{}',            render: '\\frac{a}{b}'          },
      { cmd: '\\dfrac{}{}',           render: '\\dfrac{a}{b}'         },
      { cmd: '\\tfrac{}{}',           render: '\\tfrac{a}{b}'         },
      { cmd: '\\cfrac{}{}',           render: '\\cfrac{a}{b}'         },
      { cmd: '\\sqrt{}',              render: '\\sqrt{x}'             },
      { cmd: '\\sqrt[]{}',            render: '\\sqrt[n]{x}'          },
      { cmd: '^{}',                   render: 'x^{n}'                 },
      { cmd: '_{}',                   render: 'x_{n}'                 },
      { cmd: '\\binom{}{}',           render: '\\binom{n}{k}'         },
      { cmd: '\\dbinom{}{}',          render: '\\dbinom{n}{k}'        },
      { cmd: '\\tbinom{}{}',          render: '\\tbinom{n}{k}'        },
      { cmd: '\\overline{}',          render: '\\overline{x}'         },
      { cmd: '\\underline{}',         render: '\\underline{x}'        },
      { cmd: '\\overbrace{}^{}',      render: '\\overbrace{x+y}^{n}'  },
      { cmd: '\\underbrace{}_{}',     render: '\\underbrace{x+y}_{n}' },
      { cmd: '\\overset{}{}',         render: '\\overset{a}{b}'       },
      { cmd: '\\underset{}{}',        render: '\\underset{a}{b}'      },
      { cmd: '\\stackrel{}{}',        render: '\\stackrel{a}{=}'      },
      { cmd: '{}_{}^{}\\sum',           render: '{}_{a}^{b}\\textstyle\\sum'},
    ]
  },

  // ── Accents ───────────────────────────────────────────────────────────────
  {
    name: 'Accents',
    items: [
      // ── Math accents ──
      { cmd: '\\vec{}',       render: '\\vec{v}'       },
      { cmd: '\\hat{}',       render: '\\hat{v}'       },
      { cmd: '\\bar{}',       render: '\\bar{x}'       },
      { cmd: '\\tilde{}',     render: '\\tilde{x}'     },
      { cmd: '\\dot{}',       render: '\\dot{x}'       },
      { cmd: '\\ddot{}',      render: '\\ddot{x}'      },
      { cmd: '\\dddot{}',     render: '\\dddot{x}'     },
      { cmd: '\\ddddot{}',    render: '\\ddddot{x}'    },
      { cmd: '\\acute{}',     render: '\\acute{a}'     },
      { cmd: '\\grave{}',     render: '\\grave{a}'     },
      { cmd: '\\breve{}',     render: '\\breve{a}'     },
      { cmd: '\\check{}',     render: '\\check{a}'     },
      { cmd: '\\mathring{}',  render: '\\mathring{a}'  },
      { cmd: '\\widehat{}',   render: '\\widehat{xy}'  },
      { cmd: '\\widetilde{}', render: '\\widetilde{xy}'},
      { cmd: '\\overline{}',  render: '\\overline{xy}' },
      { cmd: '\\overleftarrow{}',       render: '\\overleftarrow{ab}'       },
      { cmd: '\\overrightarrow{}',      render: '\\overrightarrow{ab}'      },
      { cmd: '\\overleftrightarrow{}',  render: '\\overleftrightarrow{ab}'  },
      { cmd: '\\underleftarrow{}',      render: '\\underleftarrow{ab}'      },
      { cmd: '\\underrightarrow{}',     render: '\\underrightarrow{ab}'     },
      { cmd: '\\underleftrightarrow{}', render: '\\underleftrightarrow{ab}' },
      { cmd: '\\overbracket{}',         render: '\\overbracket{ab}'         },
      { cmd: '\\underbracket{}',        render: '\\underbracket{ab}'        },
      // ── Text diacritics (inside \text{}) ──
      { cmd: "\\text{\\'{}}",  render: "\\text{\\'{e}}"  },
      { cmd: "\\text{\\`{}}",  render: "\\text{\\`{e}}"  },
      { cmd: "\\text{\\^{}}",  render: "\\text{\\^{e}}"  },
      { cmd: "\\text{\\~{}}",  render: "\\text{\\~{n}}"  },
      { cmd: "\\text{\\\"{}}",  render: "\\text{\\\"u}"   },
      { cmd: "\\text{\\c{}}",  render: "\\text{\\c{c}}"  },
      { cmd: "\\text{\\u{}}",  render: "\\text{\\u{a}}"  },
      { cmd: "\\text{\\v{}}",  render: "\\text{\\v{s}}"  },
      { cmd: "\\text{\\H{}}",  render: "\\text{\\H{o}}"  },
      { cmd: "\\underline{\\text{a}}", render: "\\underline{\\text{a}}"  },
      { cmd: "\\widehat{}",            render: "\\widehat{ae}"            },
    ]
  },

  // ── Font Styles ───────────────────────────────────────────────────────────
  {
    name: 'Font Styles',
    items: [
      { cmd: '\\mathbf{}',    render: '\\mathbf{A}'    },
      { cmd: '\\mathit{}',    render: '\\mathit{A}'    },
      { cmd: '\\mathrm{}',    render: '\\mathrm{A}'    },
      { cmd: '\\mathsf{}',    render: '\\mathsf{A}'    },
      { cmd: '\\mathtt{}',    render: '\\mathtt{A}'    },
      { cmd: '\\mathbb{}',    render: '\\mathbb{A}'    },
      { cmd: '\\mathcal{}',   render: '\\mathcal{A}'   },
      { cmd: '\\mathfrak{}',  render: '\\mathfrak{A}'  },
      { cmd: '\\mathscr{}',   render: '\\mathscr{A}'   },
      { cmd: '\\boldsymbol{}',render: '\\boldsymbol{A}'},
      { cmd: '\\text{}',      render: '\\text{abc}'    },
      { cmd: '\\textbf{}',    render: '\\textbf{abc}'  },
      { cmd: '\\textit{}',    render: '\\textit{abc}'  },
    ]
  },

  // ── Blackboard Bold ───────────────────────────────────────────────────────
  {
    name: 'Blackboard Bold',
    items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => ({
      cmd: `\\mathbb{${c}}`, render: `\\mathbb{${c}}`
    }))
  },

  // ── Calligraphic ──────────────────────────────────────────────────────────
  {
    name: 'Calligraphic',
    items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => ({
      cmd: `\\mathcal{${c}}`, render: `\\mathcal{${c}}`
    }))
  },

  // ── Fraktur ───────────────────────────────────────────────────────────────
  {
    name: 'Fraktur',
    items: [
      ...('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('').map(c => ({
        cmd: `\\mathfrak{${c}}`, render: `\\mathfrak{${c}}`
      })))
    ]
  },

  // ── Brackets & Delimiters ─────────────────────────────────────────────────
  {
    name: 'Brackets',
    items: [
      { cmd: '\\{\\}',                  render: '\\{x\\}'                  },
      { cmd: '\\{',                    render: '\\{'                       },
      { cmd: '\\}',                    render: '\\}'                       },
      { cmd: '\\left( \\right)',       render: '\\left( x \\right)'       },
      { cmd: '\\left[ \\right]',       render: '\\left[ x \\right]'       },
      { cmd: '\\left\\{ \\right\\}',   render: '\\left\\{ x \\right\\}'   },
      { cmd: '\\left| \\right|',       render: '\\left| x \\right|'       },
      { cmd: '\\left\\| \\right\\|',   render: '\\left\\| x \\right\\|'   },
      { cmd: '\\langle \\rangle',      render: '\\langle x \\rangle'      },
      { cmd: '\\lfloor \\rfloor',      render: '\\lfloor x \\rfloor'      },
      { cmd: '\\lceil \\rceil',        render: '\\lceil x \\rceil'        },
      { cmd: '\\lVert \\rVert',        render: '\\lVert x \\rVert'        },
      { cmd: '\\lgroup \\rgroup',      render: '\\lgroup x \\rgroup'      },
      { cmd: '\\ulcorner \\urcorner',  render: '\\ulcorner x \\urcorner'  },
      { cmd: '\\llcorner \\lrcorner',  render: '\\llcorner x \\lrcorner'  },
      { cmd: '\\left. \\right|',       render: '\\left. f \\right|'       },
      { cmd: '\\big( \\big)',          render: '\\big( x \\big)'          },
      { cmd: '\\Big( \\Big)',          render: '\\Big( x \\Big)'          },
      { cmd: '\\bigg( \\bigg)',        render: '\\bigg( x \\bigg)'        },
      { cmd: '\\Bigg( \\Bigg)',        render: '\\Bigg( x \\Bigg)'        },
    ]
  },

  // ── Matrices ──────────────────────────────────────────────────────────────
  {
    name: 'Matrices', wide: true,
    items: [
      { cmd: '\\begin{pmatrix} {} & {} \\\\ {} & {} \\end{pmatrix}',  render: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',  label: '(  matrix  )' },
      { cmd: '\\begin{bmatrix} {} & {} \\\\ {} & {} \\end{bmatrix}',  render: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',  label: '[  matrix  ]' },
      { cmd: '\\begin{vmatrix} {} & {} \\\\ {} & {} \\end{vmatrix}',  render: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}',  label: '|  matrix  |' },
      { cmd: '\\begin{Vmatrix} {} & {} \\\\ {} & {} \\end{Vmatrix}',  render: '\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}',  label: '‖  matrix  ‖' },
      { cmd: '\\begin{pmatrix} {} \\\\ {} \\end{pmatrix}',            render: '\\begin{pmatrix} a \\\\ b \\end{pmatrix}',           label: '( col vector )' },
      { cmd: '\\begin{bmatrix} {} \\\\ {} \\end{bmatrix}',            render: '\\begin{bmatrix} a \\\\ b \\end{bmatrix}',           label: '[ col vector ]' },
      { cmd: '\\begin{cases} {} & \\text{if } \\\\ {} & \\text{if } \\end{cases}', render: '\\begin{cases} a & \\text{if }x>0 \\\\ b & \\text{if }x<0 \\end{cases}', label: 'cases  { … }' },
      { cmd: '\\begin{aligned} {} &= {} \\\\ &= {} \\end{aligned}',   render: '\\begin{aligned} x &= a \\\\ &= b \\end{aligned}',   label: 'aligned  = …' },
      { cmd: '\\begin{matrix} \\end{matrix}',   render: '\\begin{matrix} a & b \\\\ c & d \\end{matrix}', label: 'matrix' },
      { cmd: '\\begin{smallmatrix} \\end{smallmatrix}', render: '\\bigl( \\begin{smallmatrix} a & b \\\\ c & d \\end{smallmatrix} \\bigr)', label: 'smallmatrix' },
    ]
  },

  // ── Alignment ─────────────────────────────────────────────────────────────
  {
    name: 'Alignment', wide: true,
    items: [
      { cmd: '\\begin{aligned} {} &= {} \\\\ {} &= {} \\end{aligned}',                          render: '\\begin{aligned} f &= a \\\\ g &= b \\end{aligned}',                                label: 'align at  ='       },
      { cmd: '\\begin{aligned} {} &\\approx {} \\\\ {} &\\approx {} \\end{aligned}',            render: '\\begin{aligned} f &\\approx a \\\\ g &\\approx b \\end{aligned}',                  label: 'align at  ≈'       },
      { cmd: '\\begin{aligned} {} &\\leq {} \\\\ {} &\\leq {} \\end{aligned}',                  render: '\\begin{aligned} f &\\leq a \\\\ g &\\leq b \\end{aligned}',                        label: 'align at  ≤'       },
      { cmd: '\\begin{aligned} {} & {} \\\\ {} & {} \\end{aligned}',                            render: '\\begin{aligned} f & a \\\\ g & b \\end{aligned}',                                  label: 'align  (free)'     },
      { cmd: '\\begin{array}{ll} {} & {} \\\\ {} & {} \\end{array}',                            render: '\\begin{array}{ll} a & b \\\\ c & d \\end{array}',                                  label: 'array  ll'         },
      { cmd: '\\begin{array}{rl} {} & {} \\\\ {} & {} \\end{array}',                            render: '\\begin{array}{rl} a & b \\\\ c & d \\end{array}',                                  label: 'array  rl'         },
      { cmd: '\\begin{array}{lr} {} & {} \\\\ {} & {} \\end{array}',                            render: '\\begin{array}{lr} a & b \\\\ c & d \\end{array}',                                  label: 'array  lr'         },
      { cmd: '\\begin{array}{cc} {} & {} \\\\ {} & {} \\end{array}',                            render: '\\begin{array}{cc} a & b \\\\ c & d \\end{array}',                                  label: 'array  cc'         },
      { cmd: '\\begin{array}{lll} {} & {} & {} \\\\ {} & {} & {} \\end{array}',                 render: '\\begin{array}{lll} a & b & c \\\\ d & e & f \\end{array}',                         label: 'array  3 cols'     },
      { cmd: '\\begin{array}{c|c} {} & {} \\\\ \\hline {} & {} \\end{array}',                   render: '\\begin{array}{c|c} a & b \\\\ \\hline c & d \\end{array}',                         label: 'array  col line'   },
      { cmd: '\\begin{array}{c} {} \\\\ \\hline {} \\end{array}',                               render: '\\begin{array}{c} a \\\\ \\hline b \\end{array}',                                   label: 'array  row line'   },
      { cmd: '\\begin{cases} {} & \\text{if } {} \\\\ {} & \\text{if } {} \\end{cases}',        render: '\\begin{cases} a & \\text{if }x>0 \\\\ b & \\text{if }x\\leq 0 \\end{cases}',      label: 'cases  if …'       },
      { cmd: '\\begin{rcases} {} & \\text{if } {} \\\\ {} & \\text{if } {} \\end{rcases}',      render: '\\begin{rcases} a & \\text{if }x>0 \\\\ b & \\text{if }x\\leq 0 \\end{rcases}',    label: 'rcases  } if …'    },
      { cmd: '\\underbrace{}_{}',                                                                render: '\\underbrace{x+y}_{\\text{label}}',                                                 label: 'underbrace label'  },
      { cmd: '\\overbrace{}^{}',                                                                 render: '\\overbrace{x+y}^{\\text{label}}',                                                  label: 'overbrace label'   },
      { cmd: '\\underset{\\text{}}{} ',                                                          render: '\\underset{\\text{label}}{=}',                                                      label: 'label below sym'   },
      { cmd: '\\overset{\\text{}}{} ',                                                           render: '\\overset{\\text{label}}{=}',                                                       label: 'label above sym'   },
      { cmd: '{}\\phantom{} ',                                                                   render: 'a\\phantom{+}b',                                                                    label: 'phantom  (space)'  },
      { cmd: '\\hphantom{} ',                                                                    render: 'a\\hphantom{+}b',                                                                   label: 'hphantom  (width)' },
      { cmd: '\\vphantom{} ',                                                                    render: '\\vphantom{X}a',                                                                    label: 'vphantom  (height)'},
      { cmd: '\\mathrlap{} ',                                                                    render: '\\mathrlap{=}\\quad',                                                               label: 'rlap  (overlap r)' },
      { cmd: '\\mathllap{} ',                                                                    render: '\\mathllap{=}\\quad',                                                               label: 'llap  (overlap l)' },
      { cmd: '\\mathclap{} ',                                                                    render: '\\mathclap{=}',                                                                     label: 'clap  (no width)'  },
      { cmd: '\\tag{}',                                                                          render: '\\text{(1)}',                                                                       label: 'tag  (equation #)' },
      { cmd: '\\notag',                                                                          render: '\\notag',                                                                           label: 'notag  (no #)'     },
    ]
  },

  // ── Functions ─────────────────────────────────────────────────────────────
  {
    name: 'Functions',
    items: [
      { cmd: '\\sin',    render: '\\sin'    },
      { cmd: '\\cos',    render: '\\cos'    },
      { cmd: '\\tan',    render: '\\tan'    },
      { cmd: '\\cot',    render: '\\cot'    },
      { cmd: '\\sec',    render: '\\sec'    },
      { cmd: '\\csc',    render: '\\csc'    },
      { cmd: '\\arcsin', render: '\\arcsin' },
      { cmd: '\\arccos', render: '\\arccos' },
      { cmd: '\\arctan', render: '\\arctan' },
      { cmd: '\\sinh',   render: '\\sinh'   },
      { cmd: '\\cosh',   render: '\\cosh'   },
      { cmd: '\\tanh',   render: '\\tanh'   },
      { cmd: '\\coth',   render: '\\coth'   },
      { cmd: '\\ln',     render: '\\ln'     },
      { cmd: '\\log',    render: '\\log'    },
      { cmd: '\\log_{}', render: '\\log_b'  },
      { cmd: '\\lg',     render: '\\lg'     },
      { cmd: '\\exp',    render: '\\exp'    },
      { cmd: '\\lim',    render: '\\lim'    },
      { cmd: '\\limsup', render: '\\limsup' },
      { cmd: '\\liminf', render: '\\liminf' },
      { cmd: '\\max',    render: '\\max'    },
      { cmd: '\\min',    render: '\\min'    },
      { cmd: '\\sup',    render: '\\sup'    },
      { cmd: '\\inf',    render: '\\inf'    },
      { cmd: '\\gcd',    render: '\\gcd'    },
      { cmd: '\\deg',    render: '\\deg'    },
      { cmd: '\\det',    render: '\\det'    },
      { cmd: '\\dim',    render: '\\dim'    },
      { cmd: '\\ker',    render: '\\ker'    },
      { cmd: '\\hom',    render: '\\hom'    },
      { cmd: '\\arg',    render: '\\arg'    },
      { cmd: '\\Pr',     render: '\\Pr'     },
      { cmd: '\\operatorname{sgn}',  render: '\\operatorname{sgn}' },
      { cmd: '\\operatorname{tr}',   render: '\\operatorname{tr}'  },
      { cmd: '\\operatorname{rank}', render: '\\operatorname{rank}'},
      { cmd: '\\operatorname{}', render: '\\operatorname{f}' },
    ]
  },

  // ── Logic ────────────────────────────────────────────────────────────────
  {
    name: 'Logic',
    items: [
      { cmd: '\\forall',    render: '\\forall'    },
      { cmd: '\\exists',    render: '\\exists'    },
      { cmd: '\\nexists',   render: '\\nexists'   },
      { cmd: '\\neg',       render: '\\neg'       },
      { cmd: '\\land',      render: '\\land'      },
      { cmd: '\\lor',       render: '\\lor'       },
      { cmd: '\\top',       render: '\\top'       },
      { cmd: '\\bot',       render: '\\bot'       },
      { cmd: '\\vdash',     render: '\\vdash'     },
      { cmd: '\\nvdash',    render: '\\nvdash'    },
      { cmd: '\\Vdash',     render: '\\Vdash'     },
      { cmd: '\\vDash',     render: '\\vDash'     },
      { cmd: '\\models',    render: '\\models'    },
      { cmd: '\\mathrel{\\not\\models}',   render: '\\mathrel{\\not\\models}'   },
      { cmd: '\\therefore', render: '\\therefore' },
      { cmd: '\\because',   render: '\\because'   },
      { cmd: '\\Box',       render: '\\Box'       },
      { cmd: '\\Diamond',   render: '\\Diamond'   },
    ]
  },

  // ── Geometric Shapes ─────────────────────────────────────────────────────
  {
    name: 'Shapes',
    items: [
      { cmd: '\\triangle',           render: '\\triangle'           },
      { cmd: '\\triangledown',       render: '\\triangledown'       },
      { cmd: '\\triangleleft',       render: '\\triangleleft'       },
      { cmd: '\\triangleright',      render: '\\triangleright'      },
      { cmd: '\\blacktriangle',      render: '\\blacktriangle'      },
      { cmd: '\\blacktriangledown',  render: '\\blacktriangledown'  },
      { cmd: '\\blacktriangleleft',  render: '\\blacktriangleleft'  },
      { cmd: '\\blacktriangleright', render: '\\blacktriangleright' },
      { cmd: '\\square',             render: '\\square'             },
      { cmd: '\\blacksquare',        render: '\\blacksquare'        },
      { cmd: '\\square',              render: '\\square'             },
      { cmd: '\\lozenge',            render: '\\lozenge'            },
      { cmd: '\\blacklozenge',       render: '\\blacklozenge'       },
      { cmd: '\\diamond',            render: '\\diamond'            },
      { cmd: '\\Diamond',            render: '\\Diamond'            },
      { cmd: '\\bigstar',            render: '\\bigstar'            },
      { cmd: '\\star',               render: '\\star'               },
      { cmd: '\\bigcirc',            render: '\\bigcirc'            },
      { cmd: '\\circ',               render: '\\circ'               },
      { cmd: '\\bullet',             render: '\\bullet'             },
      { cmd: '\\circ',                render: '\\circ'               },
      { cmd: '\\angle',              render: '\\angle'              },
      { cmd: '\\measuredangle',      render: '\\measuredangle'      },
      { cmd: '\\sphericalangle',     render: '\\sphericalangle'     },
    ]
  },

  // ── Big Operators ────────────────────────────────────────────────────────
  {
    name: 'Big Operators',
    items: [
      { cmd: '\\sum',      render: '\\sum'      },
      { cmd: '\\prod',     render: '\\prod'     },
      { cmd: '\\coprod',   render: '\\coprod'   },
      { cmd: '\\int',      render: '\\int'      },
      { cmd: '\\iint',     render: '\\iint'     },
      { cmd: '\\iiint',    render: '\\iiint'    },
      { cmd: '\\iiint\\!\\int', render: '\\text{⨌}'  },
      { cmd: '\\oint',     render: '\\oint'     },
      { cmd: '\\oiint',    render: '\\oiint'    },
      { cmd: '\\bigcup',   render: '\\bigcup'   },
      { cmd: '\\bigcap',   render: '\\bigcap'   },
      { cmd: '\\bigsqcup', render: '\\bigsqcup' },
      { cmd: '\\bigvee',   render: '\\bigvee'   },
      { cmd: '\\bigwedge', render: '\\bigwedge' },
      { cmd: '\\bigodot',  render: '\\bigodot'  },
      { cmd: '\\bigoplus', render: '\\bigoplus' },
      { cmd: '\\bigotimes',render: '\\bigotimes'},
      { cmd: '\\biguplus', render: '\\biguplus' },
    ]
  },

  // ── Number Theory ─────────────────────────────────────────────────────────
  {
    name: 'Number Theory',
    items: [
      { cmd: '\\mid',        render: '\\mid'           },
      { cmd: '\\nmid',       render: '\\nmid'          },
      { cmd: '\\gcd',        render: '\\gcd'           },
      { cmd: '\\bmod',       render: 'a\\bmod b'       },
      { cmd: '\\pmod{}',     render: 'a\\pmod{n}'      },
      { cmd: '\\equiv',      render: '\\equiv'         },
      { cmd: '\\not\\equiv', render: '\\not\\equiv'    },
      { cmd: '\\phi',        render: '\\phi'           },
      { cmd: '\\varphi',     render: '\\varphi'        },
      { cmd: '\\mu',         render: '\\mu'            },
      { cmd: '\\lfloor \\rfloor', render: '\\lfloor x \\rfloor' },
      { cmd: '\\lceil \\rceil',   render: '\\lceil x \\rceil'   },
    ]
  },

  // ── Calculus / Analysis ───────────────────────────────────────────────────
  {
    name: 'Calculus',
    items: [
      { cmd: "f'",                 render: "f'"                  },
      { cmd: "f''",                render: "f''"                 },
      { cmd: '\\dot{}',            render: '\\dot{x}'            },
      { cmd: '\\ddot{}',           render: '\\ddot{x}'           },
      { cmd: '\\dot{\\dot{\\dot{}}}',    render: '\\dot{\\dot{\\dot{x}}}'  },
      { cmd: '\\partial',          render: '\\partial'           },
      { cmd: '\\nabla',            render: '\\nabla'             },
      { cmd: '\\nabla^2',          render: '\\nabla^2'           },
      { cmd: '\\Delta',            render: '\\Delta'             },
      { cmd: '\\infty',            render: '\\infty'             },
      { cmd: '\\frac{dy}{dx}',     render: '\\frac{dy}{dx}'      },
      { cmd: '\\frac{d^2y}{dx^2}', render: '\\frac{d^2y}{dx^2}' },
    ]
  },

  // ── Physics ───────────────────────────────────────────────────────────────
  {
    name: 'Physics',
    items: [
      { cmd: '\\hbar',              render: '\\hbar'              },
      { cmd: '\\hslash',            render: '\\hslash'            },
      { cmd: '\\ell',               render: '\\ell'               },
      { cmd: '\\Re',                render: '\\Re'                },
      { cmd: '\\Im',                render: '\\Im'                },
      { cmd: '\\vec{}',             render: '\\vec{F}'            },
      { cmd: '\\hat{}',             render: '\\hat{n}'            },
      { cmd: '|\\rangle',           render: '|\\psi\\rangle'      },
      { cmd: '\\langle|',           render: '\\langle\\psi|'      },
      { cmd: '\\langle \\rangle',   render: '\\langle A \\rangle' },
      { cmd: '\\langle | \\rangle', render: '\\langle a | b \\rangle' },
      { cmd: '\\otimes',            render: '\\otimes'            },
      { cmd: '\\oplus',             render: '\\oplus'             },
      { cmd: '\\nabla^2',           render: '\\nabla^2'           },
      { cmd: '\\partial_{}',        render: '\\partial_\\mu'      },
    ]
  },

  // ── Probability / Statistics ──────────────────────────────────────────────
  {
    name: 'Probability',
    items: [
      { cmd: '\\mathbb{E}[{}]',         render: '\\mathbb{E}[X]'               },
      { cmd: '\\mathbb{P}({})',         render: '\\mathbb{P}(A)'               },
      { cmd: '\\operatorname{Var}({})', render: '\\operatorname{Var}(X)'       },
      { cmd: '\\operatorname{Cov}({})', render: '\\operatorname{Cov}(X,Y)'     },
      { cmd: '\\operatorname{Std}({})', render: '\\operatorname{Std}(X)'       },
      { cmd: '\\sim',                   render: 'X\\sim Y'                      },
      { cmd: '\\overset{d}{=}',         render: '\\overset{d}{=}'              },
      { cmd: '\\overset{p}{\\to}',      render: '\\overset{p}{\\to}'           },
      { cmd: '\\overset{a.s.}{\\to}',   render: '\\overset{a.s.}{\\to}'        },
      { cmd: '\\mathcal{N}({})',        render: '\\mathcal{N}(\\mu,\\sigma^2)' },
      { cmd: '\\mid',                   render: '\\mid'                         },
      { cmd: '\\perp',                  render: '\\perp'                        },
      { cmd: '\\Pr',                    render: '\\Pr'                          },
    ]
  },

  // ── AMS Misc ─────────────────────────────────────────────────────────────
  {
    name: 'AMS Misc',
    items: [
      { cmd: '\\mho',         render: '\\mho'         },
      { cmd: '\\Finv',        render: '\\Finv'        },
      { cmd: '\\Game',        render: '\\Game'        },
      { cmd: '\\eth',         render: '\\eth'         },
      { cmd: '\\diagup',      render: '\\diagup'      },
      { cmd: '\\diagdown',    render: '\\diagdown'    },
      { cmd: '\\backprime',   render: '\\backprime'   },
      { cmd: '\\varnothing',  render: '\\varnothing'  },
      { cmd: '\\complement',  render: '\\complement'  },
      { cmd: '\\checkmark',   render: '\\checkmark'   },
      { cmd: '\\circledS',    render: '\\circledS'    },
      { cmd: '\\circledR',    render: '\\circledR'    },
      { cmd: '\\yen',         render: '\\yen'         },
      { cmd: '\\maltese',     render: '\\maltese'     },
    ]
  },

  // ── Spacing ───────────────────────────────────────────────────────────────
  {
    name: 'Spacing',
    items: [
      { cmd: '\\,',      render: 'a\\,b'     },
      { cmd: '\\:',      render: 'a\\:b'     },
      { cmd: '\\;',      render: 'a\\;b'     },
      { cmd: '\\!',      render: 'a\\!b'     },
      { cmd: '\\ ',      render: 'a\\ b'     },
      { cmd: '\\quad',   render: 'a\\quad b' },
      { cmd: '\\qquad',  render: 'a\\qquad b'},
      { cmd: '\\enspace',render: 'a\\enspace b'},
    ]
  },

  // ── Misc ─────────────────────────────────────────────────────────────────
  {
    name: 'Misc',
    items: [
      { cmd: '\\ldots',         render: '\\ldots'         },
      { cmd: '\\cdots',         render: '\\cdots'         },
      { cmd: '\\vdots',         render: '\\vdots'         },
      { cmd: '\\ddots',         render: '\\ddots'         },
      { cmd: '\\prime',         render: '\\prime'         },
      { cmd: '\\backslash',     render: '\\backslash'     },
      { cmd: '\\sharp',         render: '\\sharp'         },
      { cmd: '\\flat',          render: '\\flat'          },
      { cmd: '\\natural',       render: '\\natural'       },
      { cmd: '\\surd',          render: '\\surd'          },
      { cmd: '\\wp',            render: '\\wp'            },
      { cmd: '\\aleph',         render: '\\aleph'         },
      { cmd: '\\infty',         render: '\\infty'         },
      { cmd: '\\partial',       render: '\\partial'       },
      { cmd: '\\nabla',         render: '\\nabla'         },
      { cmd: '\\hbar',          render: '\\hbar'          },
      { cmd: '\\imath',         render: '\\imath'         },
      { cmd: '\\jmath',         render: '\\jmath'         },
      { cmd: '\\ell',           render: '\\ell'           },
      { cmd: '\\Re',            render: '\\Re'            },
      { cmd: '\\Im',            render: '\\Im'            },
      { cmd: '\\angle',         render: '\\angle'         },
      { cmd: '\\measuredangle', render: '\\measuredangle' },
      { cmd: '\\sphericalangle',render: '\\sphericalangle'},
      { cmd: '\\perp',          render: '\\perp'          },
      { cmd: '\\parallel',      render: '\\parallel'      },
      { cmd: '\\therefore',     render: '\\therefore'     },
      { cmd: '\\because',       render: '\\because'       },
      { cmd: '\\checkmark',     render: '\\checkmark'     },
      { cmd: '\\dagger',        render: '\\dagger'        },
      { cmd: '\\ddagger',       render: '\\ddagger'       },
      { cmd: '\\S',             render: '\\S'             },
      { cmd: '\\P',             render: '\\P'             },
      { cmd: '\\#',             render: '\\#'             },
      { cmd: '\\%',             render: '\\%'             },
      { cmd: '\\&',             render: '\\&'             },
      { cmd: '\\copyright',     render: '\\copyright'     },
      { cmd: '\\text{}',        render: '\\text{abc}'     },
    ]
  },

  // ── Extensible Arrows ─────────────────────────────────────────────────────
  {
    name: 'Ext. Arrows',
    items: [
      { cmd: '\\dashrightarrow',         render: '\\dashrightarrow'         },
      { cmd: '\\dashleftarrow',          render: '\\dashleftarrow'          },
      { cmd: '\\rightsquigarrow',        render: '\\rightsquigarrow'        },
      { cmd: '\\leftrightsquigarrow',    render: '\\leftrightsquigarrow'    },
      { cmd: '\\Rrightarrow',            render: '\\Rrightarrow'            },
      { cmd: '\\Lleftarrow',             render: '\\Lleftarrow'             },
      { cmd: '\\upuparrows',             render: '\\upuparrows'             },
      { cmd: '\\downdownarrows',         render: '\\downdownarrows'         },
      { cmd: '\\leftrightarrows',        render: '\\leftrightarrows'        },
      { cmd: '\\rightleftarrows',        render: '\\rightleftarrows'        },
      { cmd: '\\rightrightarrows',       render: '\\rightrightarrows'       },
      { cmd: '\\leftleftarrows',         render: '\\leftleftarrows'         },
      { cmd: '\\restriction',            render: '\\restriction'            },
      { cmd: '\\xleftrightarrow[]{}',    render: '\\xleftrightarrow[b]{a}'  },
      { cmd: '\\xhookrightarrow[]{}',    render: '\\xhookrightarrow[b]{a}'  },
      { cmd: '\\xhookleftarrow[]{}',     render: '\\xhookleftarrow[b]{a}'   },
      { cmd: '\\xtwoheadrightarrow[]{}', render: '\\xtwoheadrightarrow[b]{a}'},
      { cmd: '\\xmapsto[]{}',            render: '\\xmapsto[b]{a}'          },
      { cmd: '\\leadsto',                render: '\\leadsto'                },
      { cmd: '\\nearrow',                render: '\\nearrow'                },
      { cmd: '\\searrow',                render: '\\searrow'                },
      { cmd: '\\nwarrow',                render: '\\nwarrow'                },
      { cmd: '\\swarrow',                render: '\\swarrow'                },
    ]
  },

  // ── Category Theory ───────────────────────────────────────────────────────
  {
    name: 'Category Theory',
    items: [
      { cmd: '\\to',                              render: '\\to'                              },
      { cmd: '\\xrightarrow{}',                   render: '\\xrightarrow{f}'                  },
      { cmd: '\\hookrightarrow',                  render: '\\hookrightarrow'                  },
      { cmd: '\\twoheadrightarrow',               render: '\\twoheadrightarrow'               },
      { cmd: '\\rightarrowtail',                  render: '\\rightarrowtail'                  },
      { cmd: '\\leftrightarrow',                  render: '\\leftrightarrow'                  },
      { cmd: '\\cong',                            render: '\\cong'                            },
      { cmd: '\\simeq',                           render: '\\simeq'                           },
      { cmd: '\\circ',                            render: '\\circ'                            },
      { cmd: '\\operatorname{Hom}({},{})',         render: '\\operatorname{Hom}(A,B)'          },
      { cmd: '\\operatorname{Mor}({},{})',         render: '\\operatorname{Mor}(A,B)'          },
      { cmd: '\\operatorname{Ob}({})',             render: '\\operatorname{Ob}(\\mathcal{C})'  },
      { cmd: '\\operatorname{id}_{}',             render: '\\operatorname{id}_A'              },
      { cmd: '\\operatorname{colim}',             render: '\\operatorname{colim}'             },
      { cmd: '\\varinjlim',                       render: '\\varinjlim'                       },
      { cmd: '\\varprojlim',                      render: '\\varprojlim'                      },
      { cmd: '\\otimes',                          render: '\\otimes'                          },
      { cmd: '\\oplus',                           render: '\\oplus'                           },
      { cmd: '\\times',                           render: '\\times'                           },
      { cmd: '\\sqcup',                           render: '\\sqcup'                           },
      { cmd: '\\mathcal{C}',                      render: '\\mathcal{C}'                      },
      { cmd: '\\mathcal{D}',                      render: '\\mathcal{D}'                      },
      { cmd: '\\mathcal{F}',                      render: '\\mathcal{F}'                      },
      { cmd: '\\eta',                             render: '\\eta'                             },
      { cmd: '\\varepsilon',                      render: '\\varepsilon'                      },
      { cmd: '\\mathbf{1}',                       render: '\\mathbf{1}'                       },
      { cmd: '\\mathbf{0}',                       render: '\\mathbf{0}'                       },
      { cmd: '\\dashv',                           render: '\\dashv'                           },
      { cmd: '\\vdash',                           render: '\\vdash'                           },
      { cmd: '\\adjunction',                      render: '\\dashv'                           },
      { cmd: '\\operatorname{Nat}({},{})',         render: '\\operatorname{Nat}(F,G)'          },
      { cmd: '\\operatorname{Fun}({},{})',         render: '\\operatorname{Fun}(\\mathcal{C},\\mathcal{D})' },
    ]
  },

  // ── Linear Algebra ────────────────────────────────────────────────────────
  {
    name: 'Linear Algebra',
    items: [
      { cmd: '\\operatorname{tr}({})',       render: '\\operatorname{tr}(A)'                 },
      { cmd: '\\operatorname{det}({})',      render: '\\operatorname{det}(A)'                },
      { cmd: '\\operatorname{rank}({})',     render: '\\operatorname{rank}(A)'               },
      { cmd: '\\operatorname{null}({})',     render: '\\operatorname{null}(A)'               },
      { cmd: '\\operatorname{col}({})',      render: '\\operatorname{col}(A)'                },
      { cmd: '\\operatorname{row}({})',      render: '\\operatorname{row}(A)'                },
      { cmd: '\\operatorname{span}\\{{}\\}', render: '\\operatorname{span}\\{v_1,v_2\\}'    },
      { cmd: '\\operatorname{ker}({})',      render: '\\operatorname{ker}(T)'                },
      { cmd: '\\operatorname{im}({})',       render: '\\operatorname{im}(T)'                 },
      { cmd: '\\dim({})',                   render: '\\dim(V)'                              },
      { cmd: '\\langle , \\rangle',         render: '\\langle u, v \\rangle'                },
      { cmd: '\\|{}\\|',                    render: '\\|v\\|'                               },
      { cmd: '\\|{}\\|_{}',                 render: '\\|v\\|_2'                             },
      { cmd: 'A^{\\top}',                   render: 'A^{\\top}'                             },
      { cmd: 'A^{-1}',                      render: 'A^{-1}'                                },
      { cmd: 'A^{\\dagger}',                render: 'A^{\\dagger}'                          },
      { cmd: 'A^{*}',                       render: 'A^{*}'                                 },
      { cmd: '\\operatorname{diag}({})',     render: '\\operatorname{diag}(d_1,\\ldots,d_n)'},
      { cmd: 'I_{}',                        render: 'I_n'                                   },
      { cmd: 'O_{}',                        render: 'O_n'                                   },
      { cmd: '\\mathbb{I}',                 render: '\\mathbb{I}'                           },
      { cmd: '\\lambda_{}',                 render: '\\lambda_i'                            },
      { cmd: '\\sigma_{}',                  render: '\\sigma_i'                             },
      { cmd: '\\Sigma',                     render: '\\Sigma'                               },
      { cmd: '\\begin{pmatrix} {} & {} \\\\ {} & {} \\end{pmatrix}', render: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
      { cmd: '\\begin{bmatrix} {} \\\\ {} \\end{bmatrix}', render: '\\begin{bmatrix} x \\\\ y \\end{bmatrix}' },
      { cmd: '\\begin{pmatrix} {} \\\\ \\vdots \\\\ {} \\end{pmatrix}', render: '\\begin{pmatrix} x_1 \\\\ \\vdots \\\\ x_n \\end{pmatrix}' },
    ]
  },

  // ── Complex Analysis ──────────────────────────────────────────────────────
  {
    name: 'Complex Analysis',
    items: [
      { cmd: '\\Re',                          render: '\\Re'                          },
      { cmd: '\\Im',                          render: '\\Im'                          },
      { cmd: '\\overline{}',                  render: '\\overline{z}'                 },
      { cmd: '|{}|',                          render: '|z|'                           },
      { cmd: 'e^{i{}}',                       render: 'e^{i\\theta}'                  },
      { cmd: 'e^{i\\pi}+1=0',                 render: 'e^{i\\pi}+1=0'                 },
      { cmd: '\\arg({})',                     render: '\\arg(z)'                      },
      { cmd: '\\operatorname{Res}_{{}={}}({})', render: '\\operatorname{Res}_{z=z_0}f(z)' },
      { cmd: '\\oint_{}',                     render: '\\oint_C'                      },
      { cmd: '\\oint_{|{}|={}}',              render: '\\oint_{|z|=r}'                },
      { cmd: '\\wp',                          render: '\\wp'                          },
      { cmd: '\\zeta({})',                    render: '\\zeta(s)'                     },
      { cmd: '\\Gamma({})',                   render: '\\Gamma(z)'                    },
      { cmd: '\\operatorname{Log}({})',        render: '\\operatorname{Log}(z)'        },
      { cmd: 're^{i\\theta}',                 render: 're^{i\\theta}'                 },
      { cmd: '\\operatorname{Arg}({})',        render: '\\operatorname{Arg}(z)'        },
      { cmd: '\\operatorname{Ln}({})',         render: '\\operatorname{Ln}(z)'         },
      { cmd: '\\cos\\theta + i\\sin\\theta',  render: '\\cos\\theta + i\\sin\\theta'  },
      { cmd: '\\frac{1}{2\\pi i}\\oint_{}', render: '\\frac{1}{2\\pi i}\\oint_C'    },
    ]
  },

  // ── Differential Geometry ─────────────────────────────────────────────────
  {
    name: 'Diff. Geometry',
    items: [
      { cmd: 'd{}',                         render: 'dx'                           },
      { cmd: '\\partial_{}',                render: '\\partial_\\mu'               },
      { cmd: '\\nabla_{}',                  render: '\\nabla_X'                    },
      { cmd: '\\wedge',                     render: '\\wedge'                      },
      { cmd: '\\bigwedge^{}',               render: '\\bigwedge^k'                 },
      { cmd: '\\star',                      render: '\\star'                       },
      { cmd: '\\iota_{}',                   render: '\\iota_X'                     },
      { cmd: '\\mathcal{L}_{}',             render: '\\mathcal{L}_X'               },
      { cmd: '\\Gamma^{}_{}',               render: '\\Gamma^\\lambda_{\\mu\\nu}'  },
      { cmd: 'g_{\\mu\\nu}',                render: 'g_{\\mu\\nu}'                 },
      { cmd: 'g^{\\mu\\nu}',                render: 'g^{\\mu\\nu}'                 },
      { cmd: 'T^{\\mu}{}_{}',               render: 'T^{\\mu}{}_{\\nu}'            },
      { cmd: '\\sqrt{|g|}',                 render: '\\sqrt{|g|}'                  },
      { cmd: '\\int_{}\\sqrt{|g|}\\,d^{}x', render: '\\int_M\\sqrt{|g|}\\,d^4x'   },
      { cmd: 'R^{}_{}',                     render: 'R^\\lambda{}_{\\mu\\nu\\sigma}'},
      { cmd: 'R_{\\mu\\nu}',                render: 'R_{\\mu\\nu}'                 },
      { cmd: '\\operatorname{div}({})',      render: '\\operatorname{div}(F)'       },
      { cmd: '\\operatorname{grad}({})',     render: '\\operatorname{grad}(f)'      },
      { cmd: '\\operatorname{curl}({})',     render: '\\operatorname{curl}(F)'      },
      { cmd: '\\nabla \\cdot {}',           render: '\\nabla \\cdot F'             },
      { cmd: '\\nabla \\times {}',          render: '\\nabla \\times F'            },
      { cmd: 'dx\\wedge dy',                render: 'dx\\wedge dy'                 },
      { cmd: '\\omega^{}',                  render: '\\omega^k'                    },
    ]
  },

  // ── Combinatorics ─────────────────────────────────────────────────────────
  {
    name: 'Combinatorics',
    items: [
      { cmd: 'n!',                          render: 'n!'                           },
      { cmd: '(n)_{}',                      render: '(n)_k'                        },
      { cmd: '\\binom{}{}',                 render: '\\binom{n}{k}'                },
      { cmd: '\\dbinom{}{}',                render: '\\dbinom{n}{k}'               },
      { cmd: '\\left\\langle{}\\atop{}\\right\\rangle', render: '\\left\\langle n\\atop k\\right\\rangle' },
      { cmd: '2^{}',                        render: '2^n'                          },
      { cmd: '\\prod_{k=1}^{}(1-q^{})',     render: '\\prod_{k=1}^n(1-q^k)'       },
      { cmd: '\\mathfrak{S}_{}',            render: '\\mathfrak{S}_n'              },
      { cmd: 'n \\bmod m',                  render: 'n \\bmod m'                   },
      { cmd: '\\operatorname{lcm}({},{})',   render: '\\operatorname{lcm}(a,b)'     },
      { cmd: '\\gcd({},{})',                render: '\\gcd(a,b)'                   },
      { cmd: 'S(n,k)',                      render: 'S(n,k)'                       },
      { cmd: 'c(n,k)',                      render: 'c(n,k)'                       },
      { cmd: '\\operatorname{Cat}_{}',      render: '\\operatorname{Cat}_n'        },
      { cmd: 'B_{}',                        render: 'B_n'                          },
      { cmd: 'F_{}',                        render: 'F_n'                          },
      { cmd: '\\varphi',                    render: '\\varphi'                     },
      { cmd: '\\mu({})',                    render: '\\mu(n)'                      },
      { cmd: '\\Lambda({})',                render: '\\Lambda(n)'                  },
      { cmd: '\\tau({})',                   render: '\\tau(n)'                     },
      { cmd: '\\sigma({})',                 render: '\\sigma(n)'                   },
      { cmd: '\\begin{bmatrix} n \\\\ k \\end{bmatrix}', render: '\\begin{bmatrix} n \\\\ k \\end{bmatrix}', label: 'Stirling 1st' },
      { cmd: '\\begin{Bmatrix} n \\\\ k \\end{Bmatrix}', render: '\\begin{Bmatrix} n \\\\ k \\end{Bmatrix}', label: 'Stirling 2nd' },
      { cmd: '\\left\\langle \\begin{matrix} n \\\\ k \\end{matrix} \\right\\rangle', render: '\\left\\langle \\begin{matrix} n \\\\ k \\end{matrix} \\right\\rangle', label: 'Eulerian' },
      { cmd: 'p(n)',                        render: 'p(n)',          label: 'partition' },
      { cmd: '(a; q)_n',                   render: '(a; q)_n',      label: 'q-Pochhammer' },
      { cmd: '{}_2F_1(a,b;c;z)',           render: '{}_2F_1(a,b;c;z)', label: 'hypergeometric' },
    ]
  },

  // ── Type Theory / CS ──────────────────────────────────────────────────────
  {
    name: 'Type Theory',
    items: [
      { cmd: '\\vdash',                     render: '\\vdash'                      },
      { cmd: '\\Gamma \\vdash {}:{}',       render: '\\Gamma \\vdash e:\\tau'       },
      { cmd: '\\to',                        render: '\\to'                         },
      { cmd: '\\times',                     render: '\\times'                      },
      { cmd: '\\lambda {}.{}',              render: '\\lambda x.t'                 },
      { cmd: '\\forall {}.{}',              render: '\\forall x.P'                 },
      { cmd: '\\exists {}.{}',              render: '\\exists x.P'                 },
      { cmd: '\\top',                       render: '\\top'                        },
      { cmd: '\\bot',                       render: '\\bot'                        },
      { cmd: '\\neg',                       render: '\\neg'                        },
      { cmd: '\\land',                      render: '\\land'                       },
      { cmd: '\\lor',                       render: '\\lor'                        },
      { cmd: '\\mathbb{B}',                 render: '\\mathbb{B}'                  },
      { cmd: '\\tau',                       render: '\\tau'                        },
      { cmd: '\\Rightarrow',                render: '\\Rightarrow'                 },
      { cmd: '\\Leftrightarrow',            render: '\\Leftrightarrow'             },
      { cmd: '\\mathtt{}',                  render: '\\mathtt{T}'                  },
      { cmd: '\\operatorname{Bool}',        render: '\\operatorname{Bool}'         },
      { cmd: '\\operatorname{Nat}',         render: '\\operatorname{Nat}'          },
      { cmd: '\\operatorname{List}({})',     render: '\\operatorname{List}(A)'      },
      { cmd: '\\operatorname{Unit}',        render: '\\operatorname{Unit}'         },
      { cmd: '\\operatorname{Void}',        render: '\\operatorname{Void}'         },
      { cmd: '\\star',                      render: '\\star'                       },
      { cmd: '\\square',                    render: '\\square'                     },
      { cmd: '\\equiv',                     render: '\\equiv'                      },
      { cmd: '\\cong',                      render: '\\cong'                       },
    ]
  },

  // ── Distributions ─────────────────────────────────────────────────────────
  {
    name: 'Distributions',
    items: [
      { cmd: '\\mathcal{N}({})',             render: '\\mathcal{N}(\\mu,\\sigma^2)'  },
      { cmd: '\\mathcal{U}({})',             render: '\\mathcal{U}(a,b)'             },
      { cmd: '\\operatorname{Bin}({})',       render: '\\operatorname{Bin}(n,p)'      },
      { cmd: '\\operatorname{Pois}({})',      render: '\\operatorname{Pois}(\\lambda)'},
      { cmd: '\\operatorname{Exp}({})',       render: '\\operatorname{Exp}(\\lambda)' },
      { cmd: '\\operatorname{Geom}({})',      render: '\\operatorname{Geom}(p)'       },
      { cmd: '\\operatorname{Beta}({})',      render: '\\operatorname{Beta}(\\alpha,\\beta)' },
      { cmd: '\\operatorname{Gamma}({})',     render: '\\operatorname{Gamma}(k,\\theta)' },
      { cmd: '\\operatorname{Cauchy}({})',    render: '\\operatorname{Cauchy}(x_0,\\gamma)' },
      { cmd: '\\operatorname{Laplace}({})',   render: '\\operatorname{Laplace}(\\mu,b)' },
      { cmd: '\\chi^2_{}',                  render: '\\chi^2_k'                     },
      { cmd: 't_{}',                        render: 't_\\nu'                        },
      { cmd: 'F_{{},{}}',                   render: 'F_{d_1,d_2}'                   },
      { cmd: '\\bar{}',                     render: '\\bar{X}'                      },
      { cmd: '\\hat{}',                     render: '\\hat{\\theta}'                },
      { cmd: 'p\\text{-value}',             render: 'p\\text{-value}'               },
      { cmd: '\\alpha',                     render: '\\alpha'                       },
      { cmd: '\\beta',                      render: '\\beta'                        },
      { cmd: 'X \\overset{d}{=} Y',         render: 'X \\overset{d}{=} Y'           },
      { cmd: 'X \\overset{p}{\\to} Y',      render: 'X \\overset{p}{\\to} Y'        },
      { cmd: 'X \\overset{a.s.}{\\to} Y',   render: 'X \\overset{a.s.}{\\to} Y'     },
    ]
  },

  // ── Information Theory ────────────────────────────────────────────────────
  {
    name: 'Info. Theory',
    items: [
      { cmd: 'H({})',                       render: 'H(X)'                         },
      { cmd: 'H({},{})',                    render: 'H(X,Y)'                       },
      { cmd: 'H({}|{})',                    render: 'H(X|Y)'                       },
      { cmd: 'I({};{})',                    render: 'I(X;Y)'                       },
      { cmd: 'D_{\\mathrm{KL}}({}\\|{})',   render: 'D_{\\mathrm{KL}}(P\\|Q)'      },
      { cmd: 'D_{\\mathrm{JS}}({}\\|{})',   render: 'D_{\\mathrm{JS}}(P\\|Q)'      },
      { cmd: '\\log_2',                     render: '\\log_2'                      },
      { cmd: '-\\sum_{}p\\log p',           render: '-\\sum_x p(x)\\log p(x)'      },
      { cmd: '\\mathbb{E}[\\log {}]',       render: '\\mathbb{E}[\\log p]'         },
      { cmd: '\\text{nats}',                render: '\\text{nats}'                 },
      { cmd: '\\text{bits}',                render: '\\text{bits}'                 },
      { cmd: '\\operatorname{MI}({};{})',    render: '\\operatorname{MI}(X;Y)'      },
      { cmd: '\\mathcal{H}({})',             render: '\\mathcal{H}(p)'              },
    ]
  },

  // ── Geometry ──────────────────────────────────────────────────────────────
  {
    name: 'Geometry',
    items: [
      { cmd: '\\angle',                     render: '\\angle'                      },
      { cmd: '\\measuredangle',             render: '\\measuredangle'              },
      { cmd: '\\sphericalangle',            render: '\\sphericalangle'             },
      { cmd: '\\perp',                      render: '\\perp'                       },
      { cmd: '\\parallel',                  render: '\\parallel'                   },
      { cmd: '\\sim',                       render: '\\sim'                        },
      { cmd: '\\cong',                      render: '\\cong'                       },
      { cmd: '\\triangle',                  render: '\\triangle'                   },
      { cmd: '\\square',                    render: '\\square'                     },
      { cmd: '\\overline{}',                render: '\\overline{AB}'               },
      { cmd: '\\overrightarrow{}',          render: '\\overrightarrow{AB}'         },
      { cmd: '\\widehat{}',                 render: '\\widehat{ABC}'               },
      { cmd: '\\overset{\\frown}{}',        render: '\\overset{\\frown}{AB}'       },
      { cmd: '{}^{\\circ}',                 render: '\\theta^{\\circ}'             },
      { cmd: '180^{\\circ}',                render: '180^{\\circ}'                 },
      { cmd: '\\pi',                        render: '\\pi'                         },
      { cmd: '\\operatorname{Area}({})',     render: '\\operatorname{Area}(\\triangle)' },
      { cmd: '\\operatorname{dist}({},{})',  render: '\\operatorname{dist}(A,B)'    },
      { cmd: 'd(P,Q)',                      render: 'd(P,Q)'                       },
      { cmd: '\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}', render: '\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}' },
    ]
  },

  // ── Physics+ ──────────────────────────────────────────────────────────────
  {
    name: 'Physics+',
    items: [
      { cmd: '\\hat{H}',                    render: '\\hat{H}'                     },
      { cmd: '\\hat{p}',                    render: '\\hat{p}'                     },
      { cmd: '\\hat{x}',                    render: '\\hat{x}'                     },
      { cmd: '\\hat{L}',                    render: '\\hat{L}'                     },
      { cmd: '|{}\\rangle',                 render: '|\\psi\\rangle'               },
      { cmd: '\\langle{}|',                 render: '\\langle\\psi|'               },
      { cmd: '\\langle{}|{}\\rangle',       render: '\\langle\\phi|\\psi\\rangle'  },
      { cmd: '\\langle{}|\\hat{}|{}\\rangle',render: '\\langle\\phi|\\hat{O}|\\psi\\rangle' },
      { cmd: 'i\\hbar\\frac{\\partial}{\\partial t}', render: 'i\\hbar\\frac{\\partial}{\\partial t}' },
      { cmd: '\\Box',                       render: '\\Box'                        },
      { cmd: 'F_{\\mu\\nu}',                render: 'F_{\\mu\\nu}'                 },
      { cmd: '\\partial_\\mu',              render: '\\partial_\\mu'               },
      { cmd: '\\epsilon_0',                 render: '\\epsilon_0'                  },
      { cmd: '\\mu_0',                      render: '\\mu_0'                       },
      { cmd: '\\hbar',                      render: '\\hbar'                       },
      { cmd: 'k_B',                         render: 'k_B'                          },
      { cmd: '|\\psi|^2',                   render: '|\\psi|^2'                    },
      { cmd: '\\psi',                       render: '\\psi'                        },
      { cmd: '\\Psi',                       render: '\\Psi'                        },
      { cmd: '\\sigma_x',                   render: '\\sigma_x'                    },
      { cmd: '\\sigma_y',                   render: '\\sigma_y'                    },
      { cmd: '\\sigma_z',                   render: '\\sigma_z'                    },
    ]
  },

  // ── Operators+ ────────────────────────────────────────────────────────────
  {
    name: 'Operators+',
    items: [
      { cmd: '\\unlhd',              render: '\\unlhd'              },
      { cmd: '\\unrhd',              render: '\\unrhd'              },
      { cmd: '\\lhd',                render: '\\lhd'                },
      { cmd: '\\rhd',                render: '\\rhd'                },
      { cmd: '\\trianglelefteq',     render: '\\trianglelefteq'     },
      { cmd: '\\trianglerighteq',    render: '\\trianglerighteq'    },
      { cmd: '\\between',            render: '\\between'            },
      { cmd: '\\pitchfork',          render: '\\pitchfork'          },
      { cmd: '\\bowtie',             render: '\\bowtie'             },
      { cmd: '\\Join',               render: '\\Join'               },
      { cmd: '\\Cap',                render: '\\Cap'                },
      { cmd: '\\Cup',                render: '\\Cup'                },
      { cmd: '\\sqcap',              render: '\\sqcap'              },
      { cmd: '\\sqcup',              render: '\\sqcup'              },
      { cmd: '\\veebar',             render: '\\veebar'             },
      { cmd: '\\barwedge',           render: '\\barwedge'           },
      { cmd: '\\doublebarwedge',     render: '\\doublebarwedge'     },
      { cmd: '\\curlyvee',           render: '\\curlyvee'           },
      { cmd: '\\curlywedge',         render: '\\curlywedge'         },
      { cmd: '\\circledast',         render: '\\circledast'         },
      { cmd: '\\circledcirc',        render: '\\circledcirc'        },
      { cmd: '\\circleddash',        render: '\\circleddash'        },
    ]
  },

  // ── Script (lowercase) ────────────────────────────────────────────────────
  {
    name: 'Script (lower)',
    items: 'abcdefghijklmnopqrstuvwxyz'.split('').map(c => ({
      cmd: `\\mathscr{${c}}`, render: `\\mathscr{${c}}`
    }))
  },

  // ── Bold Symbols ──────────────────────────────────────────────────────────
  {
    name: 'Bold Symbols',
    items: [
      ...('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('').map(c => ({
        cmd: `\\boldsymbol{${c}}`, render: `\\boldsymbol{${c}}`
      }))),
      { cmd: '\\boldsymbol{\\alpha}',  render: '\\boldsymbol{\\alpha}'  },
      { cmd: '\\boldsymbol{\\beta}',   render: '\\boldsymbol{\\beta}'   },
      { cmd: '\\boldsymbol{\\gamma}',  render: '\\boldsymbol{\\gamma}'  },
      { cmd: '\\boldsymbol{\\delta}',  render: '\\boldsymbol{\\delta}'  },
      { cmd: '\\boldsymbol{\\mu}',     render: '\\boldsymbol{\\mu}'     },
      { cmd: '\\boldsymbol{\\nu}',     render: '\\boldsymbol{\\nu}'     },
      { cmd: '\\boldsymbol{\\xi}',     render: '\\boldsymbol{\\xi}'     },
      { cmd: '\\boldsymbol{\\pi}',     render: '\\boldsymbol{\\pi}'     },
      { cmd: '\\boldsymbol{\\sigma}',  render: '\\boldsymbol{\\sigma}'  },
      { cmd: '\\boldsymbol{\\phi}',    render: '\\boldsymbol{\\phi}'    },
      { cmd: '\\boldsymbol{\\psi}',    render: '\\boldsymbol{\\psi}'    },
      { cmd: '\\boldsymbol{\\omega}',  render: '\\boldsymbol{\\omega}'  },
      { cmd: '\\boldsymbol{\\nabla}',  render: '\\boldsymbol{\\nabla}'  },
      { cmd: '\\boldsymbol{\\partial}',render: '\\boldsymbol{\\partial}'},
      { cmd: '\\boldsymbol{\\infty}',  render: '\\boldsymbol{\\infty}'  },
    ]
  },

  // ── Dots & Ellipses ───────────────────────────────────────────────────────
  {
    name: 'Dots',
    items: [
      { cmd: '\\ldots',                      render: '\\ldots'                      },
      { cmd: '\\cdots',                      render: '\\cdots'                      },
      { cmd: '\\vdots',                      render: '\\vdots'                      },
      { cmd: '\\ddots',                      render: '\\ddots'                      },
      { cmd: 'a_1, \\ldots, a_n',            render: 'a_1, \\ldots, a_n'            },
      { cmd: 'a_1 + \\cdots + a_n',          render: 'a_1 + \\cdots + a_n'          },
      { cmd: '\\underbrace{a+\\cdots+a}_{n}', render: '\\underbrace{a+\\cdots+a}_{n}'},
    ]
  },

  // ── Currency ──────────────────────────────────────────────────────────────
  {
    name: 'Currency',
    items: [
      { cmd: '\\$',           render: '\\$'           },
      { cmd: '\\text{£}',     render: '\\text{£}'     },
      { cmd: '\\yen',         render: '\\yen'         },
    ]
  },


  // ── Paper Constructs ─────────────────────────────────────────────────────────
  {
    name: 'Paper', wide: true,
    items: [
      { cmd: '\\begin{theorem}\n\n\\end{theorem}',          render: '\\text{Theorem}',       label: 'Theorem env' },
      { cmd: '\\begin{proof}\n\n\\end{proof}',              render: '\\text{Proof}',          label: 'Proof env' },
      { cmd: '\\begin{definition}\n\n\\end{definition}',    render: '\\text{Definition}',     label: 'Definition env' },
      { cmd: '\\begin{lemma}\n\n\\end{lemma}',              render: '\\text{Lemma}',          label: 'Lemma env' },
      { cmd: '\\begin{corollary}\n\n\\end{corollary}',      render: '\\text{Corollary}',      label: 'Corollary env' },
      { cmd: '\\begin{proposition}\n\n\\end{proposition}',  render: '\\text{Prop.}',          label: 'Proposition env' },
      { cmd: '\\begin{remark}\n\n\\end{remark}',            render: '\\text{Remark}',         label: 'Remark env' },
      { cmd: '\\begin{example}\n\n\\end{example}',          render: '\\text{Example}',        label: 'Example env' },
      { cmd: '\\therefore',    render: '\\therefore',    label: '∴ therefore' },
      { cmd: '\\because',      render: '\\because',      label: '∵ because' },
      { cmd: '\\square',       render: '\\square',       label: '□ QED' },
      { cmd: '\\blacksquare',  render: '\\blacksquare',  label: '■ QED filled' },
      { cmd: '\\qquad\\square', render: '\\square',   label: '□ end align' },
      { cmd: '\\forall',       render: '\\forall',       label: '∀ for all' },
      { cmd: '\\exists',       render: '\\exists',       label: '∃ there exists' },
      { cmd: '\\nexists',      render: '\\nexists',      label: '∄ does not exist' },
      { cmd: '\\implies',      render: '\\implies',      label: '⟹ implies' },
      { cmd: '\\iff',          render: '\\iff',          label: '⟺ iff' },
      { cmd: '\\text{WLOG }',  render: '\\text{WLOG}',   label: 'WLOG' },
      { cmd: '\\text{s.t. }',  render: '\\text{s.t.}',   label: 's.t.' },
      { cmd: '\\text{Proof: }',render: '\\text{Proof:}',  label: 'Proof:' },
      { cmd: '\\begin{aligned}\n &= \\\\\n &= \\end{aligned}', render: '\\begin{aligned}a&=b\\\\&=c\\end{aligned}', label: 'Aligned eq' },
      { cmd: '\\begin{cases}\n & \\text{if }\\\\\n & \\text{if }\n\\end{cases}', render: '\\begin{cases}a&\\text{if }x>0\\\\b&\\text{if }x\\leq 0\\end{cases}', label: 'Cases' },
    ]
  },

  // ── Topology & Shapes (SPECIAL: inserts create command) ──
  {
    name: 'Topology',
    isCreate: true,
    items: [
      { cmd: 'create square',       render: '\\square',      label: 'Square' },
      { cmd: 'create triangle',     render: '\\triangle',    label: 'Triangle' },
      { cmd: 'create circle',       render: '\\bigcirc',     label: 'Circle' },
      { cmd: 'create ngon 5',       render: '\\text{⬠}',     label: 'Pentagon' },
      { cmd: 'create ngon 6',       render: '\\text{⬡}',     label: 'Hexagon' },
      { cmd: 'create ngon 8',       render: '\\text{⯃}',     label: 'Octagon' },
      { cmd: 'polygon 1 10 10 90 10 50 90', render: '\\square', label: 'Custom' },
    ]
  },


  // ── Cancel / Strikethrough ────────────────────────────────────────────────
  {
    name: 'Cancel',
    items: [
      { cmd: '\\cancel{}',      render: '\\cancel{x}'      },
      { cmd: '\\bcancel{}',     render: '\\bcancel{x}'     },
      { cmd: '\\xcancel{}',     render: '\\xcancel{x}'     },
      { cmd: '\\sout{}',        render: '\\sout{x}'        },
    ]
  },

  // ── Extended Accents+ ─────────────────────────────────────────────────────
  {
    name: 'Accents+',
    items: [
      { cmd: '\\widecheck{}',           render: '\\widecheck{xy}'           },
      { cmd: '\\overleftharpoon{}',     render: '\\overleftharpoon{ab}'     },
      { cmd: '\\overrightharpoon{}',    render: '\\overrightharpoon{ab}'    },
      { cmd: '\\overgroup{}',           render: '\\overgroup{ab}'           },
      { cmd: '\\undergroup{}',          render: '\\undergroup{ab}'          },
      { cmd: '\\overlinesegment{}',     render: '\\overlinesegment{ab}'     },
      { cmd: '\\underlinesegment{}',    render: '\\underlinesegment{ab}'    },
      { cmd: '\\Overrightarrow{}',      render: '\\Overrightarrow{ab}'      },
      { cmd: '\\phase{}',               render: '\\phase{30}'               },
    ]
  },

  // ── Special Brackets ──────────────────────────────────────────────────────
  {
    name: 'Special Brackets',
    items: [
      { cmd: '\\llbracket \\rrbracket',     render: '\\llbracket x \\rrbracket'     },
      { cmd: '\\llbracket',                 render: '\\llbracket'                   },
      { cmd: '\\rrbracket',                 render: '\\rrbracket'                   },
      { cmd: '\\lBrace \\rBrace',           render: '\\lBrace x \\rBrace'           },
      { cmd: '\\lBrace',                    render: '\\lBrace'                      },
      { cmd: '\\rBrace',                    render: '\\rBrace'                      },
      { cmd: '\\lmoustache \\rmoustache',   render: '\\lmoustache x \\rmoustache'   },
      { cmd: '\\lmoustache',                render: '\\lmoustache'                  },
      { cmd: '\\rmoustache',                render: '\\rmoustache'                  },
    ]
  },

  // ── New Relations ─────────────────────────────────────────────────────────
  {
    name: 'Relations+',
    items: [
      { cmd: '\\eqcirc',        render: '\\eqcirc'        },
      { cmd: '\\risingdotseq',  render: '\\risingdotseq'  },
      { cmd: '\\fallingdotseq', render: '\\fallingdotseq' },
      { cmd: '\\eqsim',         render: '\\eqsim'         },
      { cmd: '\\curlyeqprec',   render: '\\curlyeqprec'   },
      { cmd: '\\curlyeqsucc',   render: '\\curlyeqsucc'   },
      { cmd: '\\backepsilon',   render: '\\backepsilon'   },
      { cmd: '\\multimap',      render: '\\multimap'      },
    ]
  },

  // ── Abstract Algebra+ ─────────────────────────────────────────────────────
  {
    name: 'Algebra+',
    items: [
      { cmd: '\\amalg',         render: '\\amalg'         },
      { cmd: '\\Bbbk',          render: '\\Bbbk'          },
      { cmd: '\\vartriangle',   render: '\\vartriangle'   },
      { cmd: '\\bigtriangleup', render: '\\bigtriangleup' },
      { cmd: '\\bigtriangledown',render: '\\bigtriangledown'},
      { cmd: '\\intercal',      render: '\\intercal'      },
      { cmd: '\\smallsetminus', render: '\\smallsetminus' },
    ]
  },

  // ── Limits+ ───────────────────────────────────────────────────────────────
  {
    name: 'Limits+',
    items: [
      { cmd: '\\varlimsup_{n \\to \\infty}', render: '\\textstyle\\varlimsup_{n \\to \\infty}', label: 'varlimsup' },
      { cmd: '\\varliminf_{n \\to \\infty}', render: '\\textstyle\\varliminf_{n \\to \\infty}', label: 'varliminf' },
      { cmd: '\\plim',                       render: '\\plim',                                   label: 'plim'      },
      { cmd: '\\xlongequal[]{}',             render: '\\xlongequal[b]{a}',                       label: '══ equal'  },
      { cmd: '\\xtofrom[]{}',                render: '\\xtofrom[b]{a}',                          label: '⇄ tofrom' },
    ]
  },

  // ── Colonequals (Definitions) ─────────────────────────────────────────────
  {
    name: 'Colonequals',
    items: [
      { cmd: '\\coloneqq',   render: '\\coloneqq'   },
      { cmd: '\\Coloneqq',   render: '\\Coloneqq'   },
      { cmd: '\\eqqcolon',   render: '\\eqqcolon'   },
      { cmd: '\\Eqqcolon',   render: '\\Eqqcolon'   },
      { cmd: '\\coloneq',    render: '\\coloneq'    },
      { cmd: '\\eqcolon',    render: '\\eqcolon'    },
      { cmd: '\\colonapprox',render: '\\colonapprox'},
      { cmd: '\\Colonapprox',render: '\\Colonapprox'},
      { cmd: '\\colonsim',   render: '\\colonsim'   },
      { cmd: '\\Colonsim',   render: '\\Colonsim'   },
    ]
  },

  // ── Degree & Special ──────────────────────────────────────────────────────
  {
    name: 'Degree & Special',
    items: [
      { cmd: '\\degree',     render: '\\degree'                    },
      { cmd: '{}^{\\circ}',  render: '90^{\\circ}'                 },
      { cmd: '\\oiiint',     render: '\\oiiint'                    },
      { cmd: '\\smallint',   render: '\\smallint'                  },
      { cmd: '\\angl{}',     render: '\\angl{30}'                  },
      { cmd: '\\hslash',     render: '\\hslash'                    },
      { cmd: '\\pounds',     render: '\\pounds'                    },
      { cmd: '\\mathsterling',render: '\\mathsterling'             },
    ]
  },

  // ── Shorthand Sets ────────────────────────────────────────────────────────
  {
    name: 'Shorthand Sets',
    items: [
      { cmd: '\\N',      render: '\\N'      },
      { cmd: '\\Z',      render: '\\Z'      },
      { cmd: '\\mathbb{Q}', render: '\\mathbb{Q}', label: 'ℚ' },
      { cmd: '\\R',      render: '\\R'      },
      { cmd: '\\mathbb{C}', render: '\\mathbb{C}', label: 'ℂ' },
      { cmd: '\\natnums',render: '\\natnums'},
      { cmd: '\\reals',  render: '\\reals'  },
      { cmd: '\\cnums',  render: '\\cnums'  },
      { cmd: '\\Reals',  render: '\\Reals'  },
      { cmd: '\\Complex',render: '\\Complex'},
    ]
  },

  // ── Trig & Hyperbolic ─────────────────────────────────────────────────────
  {
    name: 'Trig & Hyp',
    items: [
      { cmd: '\\arcsin',                     render: '\\arcsin' },
      { cmd: '\\arccos',                     render: '\\arccos' },
      { cmd: '\\arctan',                     render: '\\arctan' },
      { cmd: '\\sinh',                       render: '\\sinh' },
      { cmd: '\\cosh',                       render: '\\cosh' },
      { cmd: '\\tanh',                       render: '\\tanh' },
      { cmd: '\\coth',                       render: '\\coth' },
      { cmd: '\\operatorname{sech}',         render: '\\operatorname{sech}' },
      { cmd: '\\operatorname{csch}',         render: '\\operatorname{csch}' },
      { cmd: '\\operatorname{arsinh}',       render: '\\operatorname{arsinh}' },
      { cmd: '\\operatorname{arcosh}',       render: '\\operatorname{arcosh}' },
      { cmd: '\\operatorname{artanh}',       render: '\\operatorname{artanh}' },
      { cmd: '\\operatorname{arcsec}',       render: '\\operatorname{arcsec}' },
      { cmd: '\\operatorname{arccsc}',       render: '\\operatorname{arccsc}' },
      { cmd: '\\operatorname{arccot}',       render: '\\operatorname{arccot}' },
      // ── European trig/hyperbolic operator names ──
      { cmd: '\\tg',                         render: '\\tg',    label: 'tg (tan)'   },
      { cmd: '\\ctg',                        render: '\\ctg',   label: 'ctg (cot)'  },
      { cmd: '\\cotg',                       render: '\\cotg',  label: 'cotg'       },
      { cmd: '\\arctg',                      render: '\\arctg', label: 'arctg'      },
      { cmd: '\\arcctg',                     render: '\\arcctg',label: 'arcctg'     },
      { cmd: '\\cosec',                      render: '\\cosec', label: 'cosec (csc)'},
      { cmd: '\\sh',                         render: '\\sh',    label: 'sh (sinh)'  },
      { cmd: '\\ch',                         render: '\\ch',    label: 'ch (cosh)'  },
      { cmd: '\\th',                         render: '\\th',    label: 'th (tanh)'  },
      { cmd: '\\cth',                        render: '\\cth',   label: 'cth (coth)' },
    ]
  },

  // ── Hebrew Letters (full 22-letter alphabet) ─────────────────────────────
  {
    name: 'Hebrew',
    items: [
      { cmd: '\\aleph',          render: '\\aleph',          label: 'א aleph'  },
      { cmd: '\\beth',           render: '\\beth',           label: 'ב beth'   },
      { cmd: '\\gimel',          render: '\\gimel',          label: 'ג gimel'  },
      { cmd: '\\daleth',         render: '\\daleth',         label: 'ד daleth' },
    ]
  },


  // ── Text Modes ────────────────────────────────────────────────────────────
  {
    name: 'Text Modes',
    items: [
      { cmd: '\\text{}',                     render: '\\text{text}' },
      { cmd: '\\textrm{}',                   render: '\\textrm{roman}' },
      { cmd: '\\textbf{}',                   render: '\\textbf{bold}' },
      { cmd: '\\textit{}',                   render: '\\textit{italic}' },
      { cmd: '\\textsf{}',                   render: '\\textsf{sans}' },
      { cmd: '\\texttt{}',                   render: '\\texttt{mono}' },
      { cmd: '\\lq',                         render: '\\lq\\lq', label: 'left quote'  },
      { cmd: '\\rq',                         render: '\\rq\\rq', label: 'right quote' },
    ]
  },

  // ── Colors ────────────────────────────────────────────────────────────────
  {
    name: 'Colors',
    items: [
      { cmd: '\\textcolor{red}{}',           render: '\\textcolor{red}{text}' },
      { cmd: '\\textcolor{blue}{}',          render: '\\textcolor{blue}{text}' },
      { cmd: '\\textcolor{green}{}',         render: '\\textcolor{green}{text}' },
      { cmd: '\\colorbox{yellow}{}',         render: '\\colorbox{yellow}{text}' },
      { cmd: '\\fcolorbox{red}{white}{}',    render: '\\fcolorbox{red}{white}{text}' },
    ]
  },

  // ── Size Commands ─────────────────────────────────────────────────────────
  {
    name: 'Size',
    items: [
      { cmd: '\\tiny',                       render: '\\text{\\tiny tiny}' },
      { cmd: '\\scriptsize',                 render: '\\text{\\scriptsize script}' },
      { cmd: '\\footnotesize',               render: '\\text{\\footnotesize footnote}' },
      { cmd: '\\small',                      render: '\\text{\\small small}' },
      { cmd: '\\normalsize',                 render: '\\text{\\normalsize normal}' },
      { cmd: '\\large',                      render: '\\text{\\large large}' },
      { cmd: '\\Large',                      render: '\\text{\\Large Large}' },
      { cmd: '\\LARGE',                      render: '\\text{\\LARGE LARGE}' },
      { cmd: '\\huge',                       render: '\\text{\\huge huge}' },
      { cmd: '\\Huge',                       render: '\\text{\\Huge Huge}' },
    ]
  },

  // ── Diagonal Arrows ───────────────────────────────────────────────────────
  {
    name: 'Diag Arrows',
    items: [
      { cmd: '\\nearrow',                    render: '\\nearrow' },
      { cmd: '\\nwarrow',                    render: '\\nwarrow' },
      { cmd: '\\searrow',                    render: '\\searrow' },
      { cmd: '\\swarrow',                    render: '\\swarrow' },
      { cmd: '\\nRightarrow',                render: '\\nRightarrow' },
      { cmd: '\\nLeftarrow',                 render: '\\nLeftarrow' },
      { cmd: '\\nLeftrightarrow',            render: '\\nLeftrightarrow' },
      { cmd: '\\Lsh',                        render: '\\Lsh' },
      { cmd: '\\Rsh',                        render: '\\Rsh' },
      { cmd: '\\circlearrowleft',            render: '\\circlearrowleft' },
      { cmd: '\\circlearrowright',           render: '\\circlearrowright' },
      { cmd: '\\curvearrowleft',             render: '\\curvearrowleft' },
      { cmd: '\\curvearrowright',            render: '\\curvearrowright' },
      { cmd: '\\dashleftarrow',              render: '\\dashleftarrow' },
      { cmd: '\\dashrightarrow',             render: '\\dashrightarrow' },
    ]
  },

  // ── Stacked & Extensible ──────────────────────────────────────────────────
  {
    name: 'Stacked',
    items: [
      { cmd: '\\overset{}{}',                render: '\\overset{a}{=}' },
      { cmd: '\\underset{}{}',               render: '\\underset{a}{=}' },
      { cmd: '\\stackrel{}{}',               render: '\\stackrel{a}{=}' },
      { cmd: '\\xleftarrow{}',               render: '\\xleftarrow{a}' },
      { cmd: '\\xrightarrow{}',              render: '\\xrightarrow{a}' },
    ]
  },


  // ── Fractions & Binomials ─────────────────────────────────────────────────
  {
    name: 'Fractions',
    items: [
      { cmd: '\\frac{}{}',                   render: '\\frac{a}{b}' },
      { cmd: '\\dfrac{}{}',                  render: '\\dfrac{a}{b}' },
      { cmd: '\\tfrac{}{}',                  render: '\\tfrac{a}{b}' },
      { cmd: '\\cfrac{}{}',                  render: '\\cfrac{a}{b}' },
      { cmd: '\\binom{}{}',                  render: '\\binom{n}{k}' },
      { cmd: '\\dbinom{}{}',                 render: '\\dbinom{n}{k}' },
      { cmd: '\\tbinom{}{}',                 render: '\\tbinom{n}{k}' },
      { cmd: '\\genfrac{}{}{}{}{}{}',        render: '\\genfrac{[}{]}{0pt}{}{a}{b}', label: 'genfrac' },
    ]
  },

  // ── Diff. Geometry & Tensors ──────────────────────────────────────────────
  {
    name: 'Tensors',
    items: [
      { cmd: '\\Gamma^{}_{}',                render: '\\Gamma^k_{ij}' },
      { cmd: '\\star',                       render: '\\star' },
      { cmd: '\\nabla_{}',                   render: '\\nabla_X Y' },
      { cmd: '\\mathcal{L}_{}',              render: '\\mathcal{L}_X Y' },
      { cmd: '\\wedge',                      render: '\\wedge' },
      { cmd: '\\otimes',                     render: '\\otimes' },
      { cmd: '\\square',                     render: '\\square' },
    ]
  },

  // ── Category Theory (Adv) ─────────────────────────────────────────────────
  {
    name: 'Category (Adv)',
    items: [
      { cmd: '\\operatorname{Nat}({},{})',   render: '\\operatorname{Nat}(F, G)' },
      { cmd: '\\Rightarrow',                 render: '\\Rightarrow' },
      { cmd: '^{\\text{op}}',                render: '\\mathcal{C}^{\\text{op}}' },
      { cmd: '\\dashv',                      render: 'F \\dashv G' },
      { cmd: '\\ulcorner',                   render: '\\ulcorner' },
      { cmd: '\\lrcorner',                   render: '\\lrcorner' },
      { cmd: '\\llcorner',                   render: '\\llcorner' },
      { cmd: '\\urcorner',                   render: '\\urcorner' },
    ]
  },

  // ── Actuarial Notation ────────────────────────────────────────────────────
  {
    name: 'Actuarial',
    items: [
      { cmd: 'a_{\\overline{n|}}',           render: 'a_{\\overline{n|}}' },
      { cmd: '\\ddot{a}_x',                  render: '\\ddot{a}_x' },
      { cmd: '\\mu_x',                       render: '\\mu_x' },
      { cmd: 'A^1_{x:\\overline{n|}}',       render: 'A^1_{x:\\overline{n|}}' },
      { cmd: 'A_{x:\\overline{n|}}',         render: 'A_{x:\\overline{n|}}' },
      { cmd: '{}_np_x',                      render: '{}_np_x' },
      { cmd: '{}_nq_x',                      render: '{}_nq_x' },
    ]
  },

  // ── Abstract Algebra (Adv) ────────────────────────────────────────────────
  {
    name: 'Algebra (Adv)',
    items: [
      { cmd: '\\wr',                         render: 'G \\wr H' },
      { cmd: '\\rtimes',                     render: 'N \\rtimes H' },
      { cmd: '\\ltimes',                     render: 'H \\ltimes N' },
      { cmd: '\\triangleleft',               render: 'N \\triangleleft G' },
      { cmd: '[{},{}]',                      render: '[x, y]' },
      { cmd: '\\operatorname{Z}({})',        render: '\\operatorname{Z}(G)' },
      { cmd: '\\operatorname{char}({})',     render: '\\operatorname{char}(F)' },
      { cmd: '\\operatorname{Syl}_p({})',    render: '\\operatorname{Syl}_p(G)' },
      { cmd: '\\operatorname{Aut}({})',      render: '\\operatorname{Aut}(G)' },
      { cmd: '\\operatorname{Gal}({}/{})',   render: '\\operatorname{Gal}(E/F)' },
    ]
  },

  // ── Advanced Logic ────────────────────────────────────────────────────────
  {
    name: 'Logic (Adv)',
    items: [
      { cmd: '\\Vdash',                      render: 'p \\Vdash \\phi' },
      { cmd: '\\models',                     render: 'M \\models \\phi' },
      { cmd: '\\vdash',                      render: '\\Gamma \\vdash \\phi' },
      { cmd: '\\operatorname{Con}({})',      render: '\\operatorname{Con}(T)' },
      { cmd: '\\aleph_{}',                   render: '\\aleph_0' },
      { cmd: '\\beth_{}',                    render: '\\beth_1' },
      { cmd: '\\mathcal{P}({})',             render: '\\mathcal{P}(S)' },
    ]
  },

  // ── Number Theory (Adv) ───────────────────────────────────────────────────
  {
    name: 'Number Theory+',
    items: [
      { cmd: '\\left(\\frac{a}{p}\\right)',  render: '\\left(\\frac{a}{p}\\right)' },
      { cmd: '\\mu(n)',                      render: '\\mu(n)' },
      { cmd: '\\varphi(n)',                  render: '\\varphi(n)' },
      { cmd: '\\zeta(s)',                    render: '\\zeta(s)' },
      { cmd: 'L(s, \\chi)',                  render: 'L(s, \\chi)' },
      { cmd: '\\sigma_k(n)',                 render: '\\sigma_k(n)' },
      { cmd: '\\operatorname{li}(x)',        render: '\\operatorname{li}(x)' },
      { cmd: '\\operatorname{Li}(x)',        render: '\\operatorname{Li}(x)' },
    ]
  },

  // ── Knot Theory ───────────────────────────────────────────────────────────
  {
    name: 'Knot Theory',
    items: [
      { cmd: '\\operatorname{cr}({})',       render: '\\operatorname{cr}(K)' },
      { cmd: '\\bigcirc',                    render: '\\bigcirc' },
      { cmd: '3_1',                          render: '3_1' },
      { cmd: '4_1',                          render: '4_1' },
      { cmd: 'V_K(t)',                       render: 'V_K(t)' },
      { cmd: '\\Delta_K(t)',                 render: '\\Delta_K(t)' },
      { cmd: '\\nabla_K(z)',                 render: '\\nabla_K(z)' },
    ]
  },

  // ── Fluid Dynamics & Meteorology ──────────────────────────────────────────
  {
    name: 'Fluid & Geo',
    items: [
      { cmd: '\\frac{D}{Dt}',                render: '\\frac{D}{Dt}' },
      { cmd: '\\operatorname{Re}',           render: '\\operatorname{Re}' },
      { cmd: '\\operatorname{Ma}',           render: '\\operatorname{Ma}' },
      { cmd: '\\operatorname{Pr}',           render: '\\operatorname{Pr}' },
      { cmd: 'f = 2\\Omega\\sin\\phi',       render: 'f = 2\\Omega\\sin\\phi', label: 'Coriolis' },
      { cmd: '\\nabla \\cdot \\mathbf{v}',   render: '\\nabla \\cdot \\mathbf{v}' },
      { cmd: '\\nabla \\times \\mathbf{u}',  render: '\\nabla \\times \\mathbf{u}' },
      { cmd: '\\nu = \\mu/\\rho',            render: '\\nu = \\mu/\\rho' },
    ]
  },

  // ── Quantum Field Theory ──────────────────────────────────────────────────
  {
    name: 'QFT',
    items: [
      { cmd: '\\not{p}',                     render: '\\not{p}' },
      { cmd: '\\not{\\partial}',             render: '\\not{\\partial}' },
      { cmd: 'D_F(x-y)',                     render: 'D_F(x-y)' },
      { cmd: '\\mathcal{D}\\phi',            render: '\\mathcal{D}\\phi' },
      { cmd: ': \\phi(x)\\phi(y) :',         render: ': \\phi(x)\\phi(y) :' },
      { cmd: '\\mathcal{T}\\{ \\phi(x) \\phi(y) \\}', render: '\\mathcal{T}\\{ \\phi(x) \\phi(y) \\}' },
      { cmd: '[\\phi(x), \\pi(y)]',          render: '[\\phi(x), \\pi(y)]' },
    ]
  },

  // ── Machine Learning & Stats ──────────────────────────────────────────────
  {
    name: 'Machine Learning',
    items: [
      { cmd: '\\|\\mathbf{x}\\|_p',          render: '\\|\\mathbf{x}\\|_p' },
      { cmd: '\\mathbf{A} \\odot \\mathbf{B}',render: '\\mathbf{A} \\odot \\mathbf{B}' },
      { cmd: '\\mathbb{1}_{\\{\\text{cond}\\}}', render: '\\mathbb{1}_{\\{\\text{cond}\\}}' },
      { cmd: '\\operatorname*{arg\\,max}_{\\theta}', render: '\\operatorname*{arg\\,max}_{\\theta}' },
      { cmd: '\\mathbb{E}[X]',               render: '\\mathbb{E}[X]' },
      { cmd: '\\operatorname{Var}(X)',       render: '\\operatorname{Var}(X)' },
      { cmd: 'X \\sim \\mathcal{N}(0,1)',    render: 'X \\sim \\mathcal{N}(0,1)' },
      { cmd: 'X \\perp\\!\\!\\!\\perp Y',    render: 'X \\perp\\!\\!\\!\\perp Y', label: 'Independence' },
    ]
  },

  // ── Cryptography ──────────────────────────────────────────────────────────
  {
    name: 'Cryptography',
    items: [
      { cmd: '\\oplus',                      render: '\\oplus' },
      { cmd: 'H(M)',                         render: 'H(M)' },
      { cmd: '\\operatorname{Sign}_{sk}(m)', render: '\\operatorname{Sign}_{sk}(m)' },
      { cmd: '\\operatorname{Verify}_{pk}(m, \\sigma)', render: '\\operatorname{Verify}_{pk}(m, \\sigma)' },
      { cmd: '1^\\lambda',                   render: '1^\\lambda' },
      { cmd: '\\operatorname{Adv}^{\\text{IND-CPA}}_{\\mathcal{A}}(\\lambda)', render: '\\operatorname{Adv}^{\\text{IND-CPA}}_{\\mathcal{A}}(\\lambda)', label: 'Advantage' },
      { cmd: '\\parallel',                   render: 'x \\parallel y', label: 'Concat' },
    ]
  },

  // ── Astrophysics & Astronomy ──────────────────────────────────────────────
  {
    name: 'Astrophysics',
    items: [
      { cmd: 'M_{\\odot}',                   render: 'M_{\\odot}' },
      { cmd: 'R_{\\odot}',                   render: 'R_{\\odot}' },
      { cmd: 'L_{\\odot}',                   render: 'L_{\\odot}' },
      { cmd: 'M_{\\oplus}',                  render: 'M_{\\oplus}' },
      { cmd: 'H_0',                          render: 'H_0' },
      { cmd: '\\Lambda',                     render: '\\Lambda' },
      { cmd: '\\text{pc}',                   render: '\\text{pc}' },
      { cmd: 'z = \\frac{\\lambda_{\\text{obs}}}{\\lambda_{\\text{emit}}} - 1', render: 'z = \\frac{\\lambda_{\\text{obs}}}{\\lambda_{\\text{emit}}} - 1', label: 'Redshift' },
    ]
  },


  // ── Latin Extended ────────────────────────────────────────────────────────
  {
    name: 'Latin Ext.',
    items: [
      { cmd: '\\AA',          render: '\\AA',          label: 'Å angstrom'  },
      { cmd: '\\aa',          render: '\\aa',          label: 'å'           },
      { cmd: '\\text{Æ}',    render: '\\text{Æ}',    label: 'Æ'           },
      { cmd: '\\text{æ}',    render: '\\text{æ}',    label: 'æ'           },
      { cmd: '\\text{Œ}',    render: '\\text{Œ}',    label: 'Œ'           },
      { cmd: '\\text{œ}',    render: '\\text{œ}',    label: 'œ'           },
      { cmd: '\\text{Ø}',    render: '\\text{Ø}',    label: 'Ø'           },
      { cmd: '\\text{ø}',    render: '\\text{ø}',    label: 'ø'           },
      { cmd: '\\text{ß}',    render: '\\text{ß}',    label: 'ß eszett'    },
      { cmd: '\\imath',       render: '\\imath',       label: 'ı dotless i' },
      { cmd: '\\jmath',       render: '\\jmath',       label: 'ȷ dotless j' },
    ]
  },

  // ── Colon Relations+ ──────────────────────────────────────────────────────
  {
    name: 'Colon+',
    items: [
      { cmd: '\\coloncolon',        render: '\\coloncolon'        },
      { cmd: '\\colonminus',        render: '\\colonminus'        },
      { cmd: '\\equalscolon',       render: '\\equalscolon'       },
      { cmd: '\\equalscoloncolon',  render: '\\equalscoloncolon'  },
      { cmd: '\\minuscolon',        render: '\\minuscolon'        },
      { cmd: '\\minuscoloncolon',   render: '\\minuscoloncolon'   },
      { cmd: '\\approxcolon',       render: '\\approxcolon'       },
      { cmd: '\\approxcoloncolon',  render: '\\approxcoloncolon'  },
      { cmd: '\\coloncolonapprox',  render: '\\coloncolonapprox'  },
      { cmd: '\\coloncolonequals',  render: '\\coloncolonequals'  },
      { cmd: '\\coloncolonminus',   render: '\\coloncolonminus'   },
      { cmd: '\\coloncolonsim',     render: '\\coloncolonsim'     },
      { cmd: '\\Eqcolon',           render: '\\Eqcolon'           },
    ]
  },


  // ── Environments ──────────────────────────────────────────────────────────
  {
    name: 'Environments', wide: true,
    items: [
      { cmd: '\\begin{dcases} f(x) & x>0 \\\\ 0 & x=0 \\end{dcases}',           render: '\\begin{dcases} f(x) & x>0 \\\\ 0 & x=0 \\end{dcases}',           label: 'dcases'   },
      { cmd: '\\begin{drcases} f(x) & x>0 \\\\ 0 & x=0 \\end{drcases}',         render: '\\begin{drcases} f(x) & x>0 \\\\ 0 & x=0 \\end{drcases}',         label: 'drcases'  },
      { cmd: '\\begin{gather} a = b \\\\ c = d \\end{gather}',                   render: '\\begin{gather} a = b \\\\ c = d \\end{gather}',                   label: 'gather',  dm: true },
      { cmd: '\\begin{alignat}{2} a &= b & \\quad c &= d \\end{alignat}',        render: '\\begin{alignat}{2} a &= b & \\quad c &= d \\end{alignat}',        label: 'alignat', dm: true },
      { cmd: '\\begin{CD} A @>>> B \\\\ @VVV @VVV \\\\ C @>>> D \\end{CD}',      render: '\\begin{CD} A @>>> B \\\\ @VVV @VVV \\\\ C @>>> D \\end{CD}',      label: 'CD diag', dm: true },
    ]
  },

  // ── Greek Variants (remaining) ────────────────────────────────────────────
  {
    name: 'Greek Var+',
    items: [
      { cmd: '\\varXi',       render: '\\varXi',       label: 'var Ξ'       },
      { cmd: '\\varUpsilon',  render: '\\varUpsilon',  label: 'var Υ'       },
      { cmd: '\\thetasym',    render: '\\thetasym',    label: 'ϑ alias'     },
      { cmd: '\\omicron',     render: '\\omicron',     label: 'ο omicron'   },
      { cmd: '\\Omicron',     render: '\\Omicron',     label: 'Ο Omicron'   },
      { cmd: '\\digamma',     render: '\\digamma',     label: 'ϝ digamma'   },
    ]
  },

  // ── Aliases & Alternates ──────────────────────────────────────────────────
  {
    name: 'Aliases',
    items: [
      { cmd: '\\alef',        render: '\\alef',        label: 'alef=ℵ'      },
      { cmd: '\\alefsym',     render: '\\alefsym',     label: 'alefsym=ℵ'  },
      { cmd: '\\weierp',      render: '\\weierp',      label: 'wp=℘'        },
      { cmd: '\\infin',       render: '\\infin',       label: 'infty=∞'     },
      { cmd: '\\doublecap',   render: '\\doublecap',   label: 'doublecap=⋒' },
      { cmd: '\\doublecup',   render: '\\doublecup',   label: 'doublecup=⋓' },
    ]
  },

  // ── Ellipsis Variants ─────────────────────────────────────────────────────
  {
    name: 'Dots+',
    items: [
      { cmd: '\\dotsb',        render: '\\dotsb',        label: 'between ops'   },
      { cmd: '\\dotsc',        render: '\\dotsc',        label: 'for commas'    },
      { cmd: '\\dotsi',        render: '\\dotsi',        label: 'for integrals' },
      { cmd: '\\dotsm',        render: '\\dotsm',        label: 'for mult'      },
      { cmd: '\\dotso',        render: '\\dotso',        label: 'other'         },
      { cmd: '\\mathellipsis', render: '\\mathellipsis', label: 'math …'        },
    ]
  },

  // ── Colon & Ratio Relations ───────────────────────────────────────────────
  {
    name: 'Ratio Rel.',
    items: [
      { cmd: '\\ratio',          render: '\\ratio',          label: 'ratio ∶'     },
      { cmd: '\\vcentcolon',     render: '\\vcentcolon',     label: 'vcentcolon'  },
      { cmd: '\\dblcolon',       render: '\\dblcolon',       label: 'dblcolon ∷'  },
      { cmd: '\\simcolon',       render: '\\simcolon',       label: '∼∶'          },
      { cmd: '\\simcoloncolon',  render: '\\simcoloncolon',  label: '∼∷'          },
      { cmd: '\\notni',          render: '\\notni',          label: '∌'           },
    ]
  },


  // ── Dirac & Set Builder ───────────────────────────────────────────────────
  {
    name: 'Dirac+',
    items: [
      { cmd: '\\braket{}',  render: '\\braket{\\psi}',  label: '⟨ψ⟩'          },
      { cmd: '\\Ket{}',     render: '\\Ket{\\psi}',     label: '|ψ⟩ large'    },
      { cmd: '\\Braket{}',  render: '\\Braket{\\psi}',  label: '⟨ψ⟩ large'    },
      { cmd: '\\Set{}',     render: '\\Set{ x \\mid x^2 = 1 }', label: '{ x | P(x) }' },
    ]
  },

  // ── Style Switches ────────────────────────────────────────────────────────
  {
    name: 'Style',
    items: [
      { cmd: '\\displaystyle',      render: '\\displaystyle \\sum_{n=0}^{\\infty}',  label: 'display'      },
      { cmd: '\\textstyle',         render: '\\textstyle \\sum_{n=0}^{\\infty}',     label: 'text'         },
      { cmd: '\\scriptstyle',       render: '\\scriptstyle \\sum_{n=0}^{\\infty}',   label: 'script'       },
      { cmd: '\\scriptscriptstyle', render: '\\scriptscriptstyle \\sum',             label: 'scriptscript' },
    ]
  },

  // ── Math Class Overrides ──────────────────────────────────────────────────
  {
    name: 'Math Class',
    items: [
      { cmd: '\\mathbin{}',    render: '\\mathbin{\\star}',  label: 'binary op'   },
      { cmd: '\\mathopen{}',   render: '\\mathopen{[}',      label: 'open delim'  },
      { cmd: '\\mathclose{}',  render: '\\mathclose{]}',     label: 'close delim' },
      { cmd: '\\mathord{}',    render: '\\mathord{x}',       label: 'ordinary'    },
      { cmd: '\\mathpunct{}',  render: '\\mathpunct{,}',     label: 'punctuation' },
      { cmd: '\\mathinner{}',  render: '\\mathinner{x}',     label: 'inner'       },
    ]
  },

  // ── Limit Control ─────────────────────────────────────────────────────────
  {
    name: 'Limit Ctrl',
    items: [
      { cmd: '\\limits',    render: '\\sum\\limits_{n=0}^{\\infty}', label: 'force above/below' },
      { cmd: '\\nolimits',  render: '\\sum\\nolimits_{n=0}^{\\infty}', label: 'force inline'   },
      { cmd: '\\intop',     render: '\\intop_{0}^{1}',                label: 'intop'           },
      { cmd: '\\argmax',    render: '\\argmax_{x}',                   label: 'argmax'          },
      { cmd: '\\argmin',    render: '\\argmin_{x}',                   label: 'argmin'          },
    ]
  },


  // ── Delimiter Sizing Roles ────────────────────────────────────────────────
  {
    name: 'Delim Size',
    wide: true,
    items: [
      { cmd: '\\bigl( \\bigr)',   render: '\\bigl( x \\bigr)',   label: 'bigl/r'   },
      { cmd: '\\Bigl( \\Bigr)',   render: '\\Bigl( x \\Bigr)',   label: 'Bigl/r'   },
      { cmd: '\\biggl( \\biggr)', render: '\\biggl( x \\biggr)', label: 'biggl/r'  },
      { cmd: '\\Biggl( \\Biggr)', render: '\\Biggl( x \\Biggr)', label: 'Biggl/r'  },
      { cmd: '\\bigl',            render: '\\bigl(',             label: 'bigl'      },
      { cmd: '\\bigr',            render: '\\bigr)',             label: 'bigr'      },
      { cmd: '\\Bigl',            render: '\\Bigl(',             label: 'Bigl'      },
      { cmd: '\\Bigr',            render: '\\Bigr)',             label: 'Bigr'      },
      { cmd: '\\biggl',           render: '\\biggl(',            label: 'biggl'     },
      { cmd: '\\biggr',           render: '\\biggr)',            label: 'biggr'     },
      { cmd: '\\Biggl',           render: '\\Biggl(',            label: 'Biggl'     },
      { cmd: '\\Biggr',           render: '\\Biggr)',            label: 'Biggr'     },
      { cmd: '\\lparen',          render: '\\lparen',            label: '( name'    },
      { cmd: '\\rparen',          render: '\\rparen',            label: ') name'    },
      { cmd: '\\lbrace',          render: '\\lbrace',            label: '{ name'    },
    ]
  },


  // ── TeX Primitives ────────────────────────────────────────────────────────
  {
    name: 'TeX Prim.',
    wide: true,
    items: [
      { cmd: '{n \\choose k}',    render: '{n \\choose k}',        label: '\\choose'    },
      { cmd: '{a \\over b}',      render: '{a \\over b}',          label: '\\over'      },
      { cmd: '{a \\atop b}',      render: '{a \\atop b}',          label: '\\atop'      },
      { cmd: '{n \\brace k}',     render: '{n \\brace k}',         label: '\\brace'     },
      { cmd: '{n \\brack k}',     render: '{n \\brack k}',         label: '\\brack'     },
    ]
  },

  // ── Macros & HTML Extensions ──────────────────────────────────────────────
  {
    name: 'Macros',
    wide: true,
    items: [
      { cmd: '\\newcommand{\\f}[1]{#1^2}',   render: '\\newcommand{\\f}[1]{#1^2} \\f{x}', label: '\\newcommand' },
      { cmd: '\\renewcommand{\\f}[1]{#1^3}',  render: '\\newcommand{\\g}[1]{#1^3} \\g{x}', label: '\\renewcommand' },
      { cmd: '\\href{url}{text}',            render: '\\href{https://katex.org}{KaTeX}',   label: '\\href (trust)' },
      { cmd: '\\htmlClass{cls}{}',           render: '\\htmlClass{red}{x}',                label: '\\htmlClass (trust)' },
      { cmd: '\\htmlStyle{color:red;}{}',    render: '\\htmlStyle{color:red;}{x}',         label: '\\htmlStyle (trust)' },
      { cmd: '\\htmlId{myid}{}',             render: '\\htmlId{eq1}{x}',                   label: '\\htmlId (trust)' },
    ]
  },

];
