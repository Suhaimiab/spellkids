// js/pictures.js
const PICTURES = {
  cat: `<svg viewBox="0 0 200 200"><g data-anim>
    <ellipse cx="100" cy="130" rx="55" ry="40" style="fill:var(--papaya)"/>
    <circle cx="100" cy="80" r="38" style="fill:var(--papaya)"/>
    <polygon points="72,55 82,20 92,58" style="fill:var(--papaya-deep)"/>
    <polygon points="108,58 118,20 128,55" style="fill:var(--papaya-deep)"/>
    <circle cx="88" cy="78" r="5" style="fill:var(--ink)"/>
    <circle cx="112" cy="78" r="5" style="fill:var(--ink)"/>
    <polygon points="95,92 105,92 100,100" style="fill:var(--berry)"/>
  </g></svg>`,

  dog: `<svg viewBox="0 0 200 200"><g data-anim>
    <ellipse cx="100" cy="130" rx="55" ry="42" style="fill:var(--sun)"/>
    <circle cx="100" cy="82" r="36" style="fill:var(--sun)"/>
    <ellipse cx="68" cy="80" rx="14" ry="28" style="fill:var(--sun-deep)"/>
    <ellipse cx="132" cy="80" rx="14" ry="28" style="fill:var(--sun-deep)"/>
    <circle cx="88" cy="82" r="5" style="fill:var(--ink)"/>
    <circle cx="112" cy="82" r="5" style="fill:var(--ink)"/>
    <ellipse cx="100" cy="96" rx="8" ry="6" style="fill:var(--ink)"/>
  </g></svg>`,

  sun: `<svg viewBox="0 0 200 200"><g data-anim>
    <g style="fill:var(--sun-deep)">
      <rect x="96" y="20" width="8" height="26" rx="4"/>
      <rect x="96" y="154" width="8" height="26" rx="4"/>
      <rect x="20" y="96" width="26" height="8" rx="4"/>
      <rect x="154" y="96" width="26" height="8" rx="4"/>
      <rect x="40" y="40" width="8" height="26" rx="4" transform="rotate(45 44 53)"/>
      <rect x="152" y="40" width="8" height="26" rx="4" transform="rotate(-45 156 53)"/>
      <rect x="40" y="134" width="8" height="26" rx="4" transform="rotate(-45 44 147)"/>
      <rect x="152" y="134" width="8" height="26" rx="4" transform="rotate(45 156 147)"/>
    </g>
    <circle cx="100" cy="100" r="48" style="fill:var(--sun)"/>
  </g></svg>`,

  bee: `<svg viewBox="0 0 200 200"><g data-anim>
    <ellipse cx="68" cy="98" rx="32" ry="20" style="fill:var(--sky)" opacity="0.7"/>
    <ellipse cx="132" cy="98" rx="32" ry="20" style="fill:var(--sky)" opacity="0.7"/>
    <ellipse cx="100" cy="120" rx="38" ry="30" style="fill:var(--sun)"/>
    <path d="M64,96 Q100,88 136,96 L136,102 Q100,94 64,102 Z" style="fill:var(--ink)"/>
    <path d="M62,116 Q100,108 138,116 L138,122 Q100,114 62,122 Z" style="fill:var(--ink)"/>
    <path d="M66,136 Q100,128 134,136 L134,142 Q100,134 66,142 Z" style="fill:var(--ink)"/>
    <circle cx="100" cy="82" r="16" style="fill:var(--ink)"/>
    <path d="M92,68 Q86,52 76,48" style="fill:none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
    <path d="M108,68 Q114,52 124,48" style="fill:none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
  </g></svg>`,

  cup: `<svg viewBox="0 0 200 200"><g data-anim>
    <path d="M70,70 L130,70 L122,150 Q100,162 78,150 Z" style="fill:var(--leaf)"/>
    <path d="M130,85 Q158,85 158,110 Q158,132 130,128" style="fill:none" stroke="var(--leaf-deep)" stroke-width="8"/>
    <rect x="66" y="62" width="68" height="12" rx="6" style="fill:var(--leaf-deep)"/>
  </g></svg>`,

  bat: `<svg viewBox="0 0 200 200"><g data-anim>
    <ellipse cx="100" cy="105" rx="18" ry="26" style="fill:var(--berry-deep)"/>
    <path d="M82,95 Q40,70 30,110 Q60,105 84,115 Z" style="fill:var(--berry)"/>
    <path d="M118,95 Q160,70 170,110 Q140,105 116,115 Z" style="fill:var(--berry)"/>
    <circle cx="94" cy="92" r="4" style="fill:var(--ink)"/>
    <circle cx="106" cy="92" r="4" style="fill:var(--ink)"/>
  </g></svg>`,

  pig: `<svg viewBox="0 0 200 200"><g data-anim>
    <ellipse cx="100" cy="120" rx="52" ry="40" style="fill:var(--berry)"/>
    <polygon points="72,88 62,68 84,80" style="fill:var(--berry-deep)"/>
    <polygon points="128,88 138,68 116,80" style="fill:var(--berry-deep)"/>
    <ellipse cx="100" cy="122" rx="18" ry="12" style="fill:var(--berry-deep)"/>
    <circle cx="94" cy="122" r="3" style="fill:var(--ink)"/>
    <circle cx="106" cy="122" r="3" style="fill:var(--ink)"/>
    <circle cx="84" cy="105" r="4" style="fill:var(--ink)"/>
    <circle cx="116" cy="105" r="4" style="fill:var(--ink)"/>
  </g></svg>`,

  box: `<svg viewBox="0 0 200 200"><g data-anim>
    <rect x="55" y="80" width="90" height="80" rx="6" style="fill:var(--leaf)"/>
    <polygon points="55,80 75,58 165,58 145,80" style="fill:var(--leaf-deep)"/>
    <rect x="95" y="80" width="10" height="80" style="fill:var(--berry)"/>
    <rect x="55" y="112" width="90" height="10" style="fill:var(--berry)"/>
  </g></svg>`,

  hat: `<svg viewBox="0 0 200 200"><g data-anim>
    <ellipse cx="100" cy="140" rx="70" ry="14" style="fill:var(--sky-deep)"/>
    <path d="M70,140 Q70,80 100,70 Q130,80 130,140 Z" style="fill:var(--sky)"/>
    <rect x="72" y="118" width="56" height="10" style="fill:var(--sky-deep)"/>
  </g></svg>`,

  bus: `<svg viewBox="0 0 200 200"><g data-anim>
    <rect x="35" y="70" width="130" height="60" rx="10" style="fill:var(--papaya)"/>
    <rect x="48" y="82" width="30" height="22" rx="4" style="fill:var(--sky)"/>
    <rect x="88" y="82" width="30" height="22" rx="4" style="fill:var(--sky)"/>
    <rect x="128" y="82" width="26" height="22" rx="4" style="fill:var(--sky)"/>
    <circle cx="62" cy="134" r="12" style="fill:var(--ink)"/>
    <circle cx="138" cy="134" r="12" style="fill:var(--ink)"/>
  </g></svg>`,
};

if (typeof window !== 'undefined') {
  window.PICTURES = PICTURES;
}
