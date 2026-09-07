// Mascot — Ceria Kids: Spelling's signature character, shown on the title,
// game, and end screens. Plain inline SVG (no image requests) recolored via
// spellkids' own design-token palette (papaya/sky/sun/leaf/berry) and
// animated purely through CSS classes.
//
// API:
//   Mascot.mount(el)      -> mounts the mascot SVG inside `el`, returns the <svg>
//   Mascot.react(state)   -> plays a reaction animation on the mounted mascot
//                            state: 'idle' (default/neutral), 'happy' (cheer,
//                            used on correct answers / completion), or
//                            'soft' (gentle, encouraging nudge — never sad or
//                            scolding — used for a mild "try again" moment)

const MASCOT_SVG = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <ellipse cx="60" cy="98" rx="26" ry="6" fill="var(--ink)" opacity="0.08"/>
  <path d="M60 20 C86 20 100 42 96 66 C93 86 78 100 60 100 C42 100 27 86 24 66 C20 42 34 20 60 20 Z" fill="var(--leaf)"/>
  <path d="M60 20 C74 20 85 30 90 44 C78 38 68 36 60 36 C52 36 42 38 30 44 C35 30 46 20 60 20 Z" fill="var(--sun)"/>
  <circle cx="46" cy="58" r="8" fill="#fff"/>
  <circle cx="47" cy="59" r="4.2" fill="var(--ink)"/>
  <circle cx="74" cy="58" r="8" fill="#fff"/>
  <circle cx="75" cy="59" r="4.2" fill="var(--ink)"/>
  <path d="M56 68 L64 68 L60 76 Z" fill="var(--papaya)"/>
  <path d="M18 62 C10 60 8 70 16 74 C22 77 30 74 30 68 C30 64 24 63 18 62 Z" fill="var(--sky)"/>
  <path d="M102 62 C110 60 112 70 104 74 C98 77 90 74 90 68 C90 64 96 63 102 62 Z" fill="var(--sky)"/>
</svg>`;

const Mascot = {
  _svg: null,

  mount(el) {
    if (!el) return null;
    el.innerHTML = MASCOT_SVG;
    const svg = el.querySelector('svg');
    svg.classList.add('mascot');
    this._svg = svg;
    return svg;
  },

  react(state) {
    const svg = this._svg;
    if (!svg) return;
    svg.classList.remove('mascot-happy', 'mascot-soft', 'mascot-idle');
    void svg.offsetWidth; // restart animation
    if (state === 'happy') {
      svg.classList.add('mascot-happy');
    } else if (state === 'soft') {
      svg.classList.add('mascot-soft');
    } else {
      svg.classList.add('mascot-idle');
    }
  },
};
