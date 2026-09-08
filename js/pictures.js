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
    <path d="M85,95 L45,60 L50,82 L22,75 L30,100 L10,102 L24,122 L52,116 L58,138 L85,118 Z" style="fill:var(--ink)"/>
    <path d="M115,95 L155,60 L150,82 L178,75 L170,100 L190,102 L176,122 L148,116 L142,138 L115,118 Z" style="fill:var(--ink)"/>
    <ellipse cx="100" cy="122" rx="17" ry="24" style="fill:var(--ink)"/>
    <circle cx="100" cy="86" r="22" style="fill:var(--ink)"/>
    <polygon points="82,72 74,48 94,74" style="fill:var(--ink)"/>
    <polygon points="118,72 126,48 106,74" style="fill:var(--ink)"/>
    <polygon points="83,68 78,54 90,70" style="fill:var(--berry-deep)"/>
    <polygon points="117,68 122,54 110,70" style="fill:var(--berry-deep)"/>
    <circle cx="91" cy="84" r="4" style="fill:var(--sun)"/>
    <circle cx="109" cy="84" r="4" style="fill:var(--sun)"/>
    <polygon points="94,96 98,96 96,102" style="fill:var(--bg)"/>
    <polygon points="102,96 106,96 104,102" style="fill:var(--bg)"/>
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
    <rect x="55" y="80" width="90" height="80" rx="4" style="fill:var(--sun)"/>
    <polygon points="55,80 75,58 165,58 145,80" style="fill:var(--sun-deep)"/>
    <path d="M75,58 L110,80 L165,58" style="fill:none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
    <rect x="95" y="80" width="10" height="80" style="fill:var(--sun-deep)"/>
    <rect x="55" y="80" width="90" height="6" style="fill:var(--sun-deep)" opacity="0.6"/>
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

  fish: `<svg viewBox="0 0 200 200"><g data-anim>
    <ellipse cx="95" cy="105" rx="48" ry="32" style="fill:var(--sky)"/>
    <polygon points="140,105 175,75 175,135" style="fill:var(--sky-deep)"/>
    <polygon points="80,75 95,55 105,78" style="fill:var(--sky-deep)"/>
    <circle cx="65" cy="98" r="6" style="fill:var(--ink)"/>
    <path d="M70,120 Q95,128 118,120" style="fill:none" stroke="var(--sky-deep)" stroke-width="4" stroke-linecap="round"/>
  </g></svg>`,

  duck: `<svg viewBox="0 0 200 200"><g data-anim>
    <ellipse cx="95" cy="130" rx="50" ry="35" style="fill:var(--sun)"/>
    <ellipse cx="85" cy="130" rx="20" ry="14" style="fill:var(--sun-deep)"/>
    <circle cx="135" cy="90" r="28" style="fill:var(--sun)"/>
    <polygon points="158,90 182,84 182,98" style="fill:var(--papaya-deep)"/>
    <circle cx="142" cy="82" r="4" style="fill:var(--ink)"/>
  </g></svg>`,

  frog: `<svg viewBox="0 0 200 200"><g data-anim>
    <ellipse cx="100" cy="128" rx="50" ry="34" style="fill:var(--leaf)"/>
    <ellipse cx="55" cy="145" rx="14" ry="9" style="fill:var(--leaf-deep)"/>
    <ellipse cx="145" cy="145" rx="14" ry="9" style="fill:var(--leaf-deep)"/>
    <circle cx="72" cy="88" r="18" style="fill:var(--leaf)"/>
    <circle cx="128" cy="88" r="18" style="fill:var(--leaf)"/>
    <circle cx="72" cy="88" r="8" style="fill:var(--ink)"/>
    <circle cx="128" cy="88" r="8" style="fill:var(--ink)"/>
    <path d="M75,132 Q100,145 125,132" style="fill:none" stroke="var(--leaf-deep)" stroke-width="4" stroke-linecap="round"/>
  </g></svg>`,

  star: `<svg viewBox="0 0 200 200"><g data-anim>
    <polygon points="100,20 122,74 180,78 135,114 150,172 100,140 50,172 65,114 20,78 78,74" style="fill:var(--sun)"/>
    <polygon points="168,40 172,50 182,54 172,58 168,68 164,58 154,54 164,50" style="fill:var(--sun-deep)"/>
    <polygon points="35,140 38,147 45,150 38,153 35,160 32,153 25,150 32,147" style="fill:var(--sun-deep)"/>
  </g></svg>`,

  moon: `<svg viewBox="0 0 200 200"><g data-anim>
    <path d="M40,100 A60,60 0 1,0 160,100 A60,60 0 1,0 40,100 M75,88 A50,50 0 1,0 175,88 A50,50 0 1,0 75,88" style="fill:var(--sun)" fill-rule="evenodd"/>
    <circle cx="62" cy="90" r="5" style="fill:var(--sun-deep)" opacity="0.6"/>
    <circle cx="55" cy="120" r="7" style="fill:var(--sun-deep)" opacity="0.6"/>
  </g></svg>`,

  cow: `<svg viewBox="0 0 200 200"><g data-anim>
    <ellipse cx="100" cy="128" rx="52" ry="35" style="fill:var(--card)" stroke="var(--ink)" stroke-width="4"/>
    <circle cx="100" cy="82" r="30" style="fill:var(--card)" stroke="var(--ink)" stroke-width="4"/>
    <ellipse cx="75" cy="115" rx="14" ry="18" style="fill:var(--ink)"/>
    <ellipse cx="125" cy="140" rx="16" ry="12" style="fill:var(--ink)"/>
    <polygon points="82,58 76,42 90,60" style="fill:var(--ink)"/>
    <polygon points="118,58 124,42 110,60" style="fill:var(--ink)"/>
    <ellipse cx="66" cy="80" rx="10" ry="14" style="fill:var(--card)" stroke="var(--ink)" stroke-width="3"/>
    <ellipse cx="134" cy="80" rx="10" ry="14" style="fill:var(--card)" stroke="var(--ink)" stroke-width="3"/>
    <ellipse cx="100" cy="100" rx="18" ry="12" style="fill:var(--berry)"/>
    <circle cx="93" cy="100" r="2.5" style="fill:var(--ink)"/>
    <circle cx="107" cy="100" r="2.5" style="fill:var(--ink)"/>
    <circle cx="88" cy="80" r="4" style="fill:var(--ink)"/>
    <circle cx="112" cy="80" r="4" style="fill:var(--ink)"/>
  </g></svg>`,

  owl: `<svg viewBox="0 0 200 200"><g data-anim>
    <ellipse cx="60" cy="130" rx="14" ry="24" style="fill:var(--papaya-deep)"/>
    <ellipse cx="140" cy="130" rx="14" ry="24" style="fill:var(--papaya-deep)"/>
    <ellipse cx="100" cy="120" rx="48" ry="42" style="fill:var(--papaya)"/>
    <polygon points="64,68 60,44 82,70" style="fill:var(--papaya-deep)"/>
    <polygon points="136,68 140,44 118,70" style="fill:var(--papaya-deep)"/>
    <circle cx="80" cy="102" r="22" style="fill:var(--card)"/>
    <circle cx="120" cy="102" r="22" style="fill:var(--card)"/>
    <circle cx="80" cy="102" r="9" style="fill:var(--ink)"/>
    <circle cx="120" cy="102" r="9" style="fill:var(--ink)"/>
    <polygon points="94,118 106,118 100,132" style="fill:var(--sun-deep)"/>
  </g></svg>`,

  ball: `<svg viewBox="0 0 200 200"><g data-anim>
    <circle cx="100" cy="100" r="70" style="fill:var(--berry)"/>
    <path d="M100,30 Q142,65 100,100 Q58,135 100,170" style="fill:none" stroke="var(--berry-deep)" stroke-width="7" stroke-linecap="round"/>
    <path d="M30,100 Q65,58 100,100 Q135,142 170,100" style="fill:none" stroke="var(--berry-deep)" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="76" cy="70" rx="16" ry="10" style="fill:var(--card)" opacity="0.55"/>
  </g></svg>`,

  kite: `<svg viewBox="0 0 200 200"><g data-anim>
    <polygon points="100,30 150,80 50,80" style="fill:var(--berry)"/>
    <polygon points="150,80 100,150 50,80" style="fill:var(--sky)"/>
    <line x1="100" y1="30" x2="100" y2="150" stroke="var(--ink)" stroke-width="2" opacity="0.35"/>
    <line x1="50" y1="80" x2="150" y2="80" stroke="var(--ink)" stroke-width="2" opacity="0.35"/>
    <path d="M100,150 Q92,165 100,178 Q108,191 100,195" style="fill:none" stroke="var(--berry-deep)" stroke-width="3" stroke-linecap="round"/>
    <polygon points="88,163 98,163 93,173" style="fill:var(--sun)"/>
    <polygon points="104,183 114,183 109,193" style="fill:var(--sun)"/>
  </g></svg>`,

  book: `<svg viewBox="0 0 200 200"><g data-anim>
    <rect x="42" y="45" width="116" height="140" rx="8" style="fill:var(--berry)"/>
    <polygon points="152,45 166,55 166,175 152,185" style="fill:var(--card)"/>
    <line x1="152" y1="68" x2="164" y2="66" stroke="var(--ink)" stroke-width="2" opacity="0.25"/>
    <line x1="152" y1="90" x2="164" y2="88" stroke="var(--ink)" stroke-width="2" opacity="0.25"/>
    <line x1="152" y1="112" x2="164" y2="110" stroke="var(--ink)" stroke-width="2" opacity="0.25"/>
    <line x1="152" y1="134" x2="164" y2="132" stroke="var(--ink)" stroke-width="2" opacity="0.25"/>
    <rect x="66" y="70" width="60" height="8" rx="4" style="fill:var(--card)"/>
    <rect x="66" y="88" width="44" height="8" rx="4" style="fill:var(--card)"/>
    <polygon points="88,45 88,95 100,82 112,95 112,45" style="fill:var(--sun)"/>
  </g></svg>`,
};

if (typeof window !== 'undefined') {
  window.PICTURES = PICTURES;
}
