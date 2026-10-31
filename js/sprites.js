// Hand-authored SVG pocket-kin. Everything is inline so the game runs offline.
let uid = 0;
const nid = () => `wb${++uid}`;

const OUTLINE = '#211a2d';
const EYE = '#241b30';

function wrap(body, defs = '', vb = '0 0 200 200') {
  return `<svg class="art-svg" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs>${defs}</defs>${body}</svg>`;
}

function grad(id, a, b, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
}

function radial(id, a, b, cx = '50%', cy = '40%', r = '65%') {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
}

function eye(cx, cy, rx = 5.2, ry = 7, iris = null, glow = false) {
  const g = glow ? ` filter="url(#glow)"` : '';
  return `<g class="eye"${g}><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${EYE}"/>${
    iris ? `<ellipse cx="${cx}" cy="${cy + 1}" rx="${rx * .55}" ry="${ry * .6}" fill="${iris}"/>` : ''
  }<circle cx="${cx - rx * .3}" cy="${cy - ry * .38}" r="${Math.max(1.2, rx * .26)}" fill="#fff" opacity=".9"/></g>`;
}

function shadow(cx = 100, cy = 182, rx = 56, ry = 8) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#05060c" opacity=".45"/>`;
}

function glowDef(id = 'glow', color = '#ffd27a', dev = 3) {
  return `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${dev}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
}

// --- Emberling -------------------------------------------------------------
function emberling() {
  const b = nid(), f = nid(), i = nid(), g = nid();
  const defs = grad(b, '#ffb066', '#e2612f') + grad(f, '#ffe17a', '#ff8b3d') + grad(i, '#ffdca8', '#f5b77a') + glowDef(g, '#ff9a4a', 3);
  return wrap(`
    ${shadow()}
    <g filter="url(#${g})" opacity=".95">
      <path d="M143 145c20-5 30-22 25-42 16 9 22 31 9 46-10 12-26 15-38 8z" fill="url(#${f})" stroke="${OUTLINE}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M151 146c12-4 16-14 13-25 9 8 10 20 1 28-6 6-12 6-17 3z" fill="#fff0a8" opacity=".85"/>
    </g>
    <path d="M64 88 57 42l37 31z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M70 78 66 56l18 16z" fill="#7f2d24" opacity=".8"/>
    <path d="M136 88 143 42l-37 31z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M130 78 134 56l-18 16z" fill="#7f2d24" opacity=".8"/>
    <path d="M51 143c0-41 20-62 49-62s49 21 49 62c0 26-21 36-49 36s-49-10-49-36z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M66 151c0-21 14-33 34-33s34 12 34 33c0 18-15 24-34 24s-34-6-34-24z" fill="url(#${i})" opacity=".95"/>
    <ellipse cx="100" cy="121" rx="36" ry="25" fill="#ffe7bd"/>
    <path d="M91 88c0-14 9-19 14-30 4 14 14 18 9 32z" fill="url(#${f})" stroke="${OUTLINE}" stroke-width="3.5"/>
    ${eye(82, 106, 6, 8, '#ffb347')}${eye(118, 106, 6, 8, '#ffb347')}
    <ellipse cx="100" cy="126" rx="8" ry="5" fill="#3a2330"/>
    <path d="M100 131v5m0 0c-3 5-8 5-11 2m11-2c3 5 8 5 11 2" fill="none" stroke="#5c3438" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M63 119c3 5 7 7 11 5m52-5c-3 5-7 7-11 5" fill="none" stroke="#b95231" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>
    <circle cx="67" cy="146" r="4" fill="#d65a32" opacity=".65"/><circle cx="139" cy="142" r="3" fill="#d65a32" opacity=".55"/><circle cx="127" cy="158" r="2.5" fill="#d65a32" opacity=".5"/>
    <ellipse cx="72" cy="172" rx="15" ry="8" fill="#d65a32" stroke="${OUTLINE}" stroke-width="4"/>
    <ellipse cx="128" cy="172" rx="15" ry="8" fill="#d65a32" stroke="${OUTLINE}" stroke-width="4"/>
    <path d="M86 175h-8m44 0h-8" stroke="#f7c07c" stroke-width="2" stroke-linecap="round"/>
  `, defs);
}

// --- Aquapup ---------------------------------------------------------------
function aquapup() {
  const b = nid(), l = nid(), g = nid();
  const defs = grad(b, '#83dcff', '#2a8fc9') + grad(l, '#d8f6ff', '#8cd8f2') + glowDef(g, '#8fe7ff', 2.5);
  return wrap(`
    ${shadow()}
    <path d="M146 132c20-8 35 0 32 16 14 3 12 22-4 24-14 2-24-9-22-23z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M154 143c10-2 16 4 15 11m-9 6c7 0 10 5 10 9" fill="none" stroke="#d9f8ff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
    <ellipse cx="60" cy="113" rx="14" ry="23" transform="rotate(26 60 113)" fill="#4fb2df" stroke="${OUTLINE}" stroke-width="5"/>
    <ellipse cx="140" cy="113" rx="14" ry="23" transform="rotate(-26 140 113)" fill="#4fb2df" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M55 144c0-39 19-58 45-58s45 19 45 58c0 25-19 34-45 34s-45-9-45-34z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M68 150c0-19 13-31 32-31s32 12 32 31c0 17-14 23-32 23s-32-6-32-23z" fill="url(#${l})"/>
    <ellipse cx="100" cy="120" rx="38" ry="25" fill="#c9f2ff"/>
    ${eye(84, 103, 6, 8, '#3fa9d8')}${eye(116, 103, 6, 8, '#3fa9d8')}
    <ellipse cx="100" cy="124" rx="7" ry="4.8" fill="#2e4058"/>
    <path d="M100 129v4c-2 4-7 4-9 1m9-1c2 4 7 4 9 1" fill="none" stroke="#4d6b82" stroke-width="2.4" stroke-linecap="round"/>
    <g fill="none" stroke="#2f6f8e" stroke-width="1.8" stroke-linecap="round" opacity=".65">
      <path d="M68 122h-11m14 5-10 4m76-9h11m-14 5 10 4"/>
    </g>
    <circle cx="159" cy="91" r="3.5" fill="#bdefff" opacity=".8"/><circle cx="169" cy="80" r="6" fill="none" stroke="#bdefff" stroke-width="1.6" opacity=".65"/><circle cx="179" cy="68" r="2.5" fill="none" stroke="#bdefff" stroke-width="1.4" opacity=".5"/>
    <ellipse cx="73" cy="171" rx="15" ry="8" fill="#2d7fa9" stroke="${OUTLINE}" stroke-width="4"/>
    <ellipse cx="127" cy="171" rx="15" ry="8" fill="#2d7fa9" stroke="${OUTLINE}" stroke-width="4"/>
    <circle cx="100" cy="143" r="3" fill="#7fd7f4" opacity=".7"/>
  `, defs);
}

// --- Leafling --------------------------------------------------------------
function leafling() {
  const b = nid(), l = nid(), d = nid();
  const defs = grad(b, '#a8ed8e', '#4fae5b') + grad(l, '#d8ffb0', '#7edb76') + grad(d, '#3b8b4b', '#26693d');
  return wrap(`
    ${shadow()}
    <path d="M101 83C91 64 95 47 109 32c9 16 6 36-2 51z" fill="url(#${l})" stroke="${OUTLINE}" stroke-width="4"/>
    <path d="M104 81C119 65 135 62 151 69c-9 15-27 21-44 17z" fill="url(#${l})" stroke="${OUTLINE}" stroke-width="4"/>
    <path d="M98 79C83 65 69 64 57 72c10 14 27 18 41 12z" fill="url(#${l})" stroke="${OUTLINE}" stroke-width="4" opacity=".9"/>
    <path d="M105 50c-3-8-3-14 1-21m25 37c7-3 12-7 16-13m-56 11c-5-2-9-5-12-9" fill="none" stroke="#3f8f4c" stroke-width="2" stroke-linecap="round" opacity=".8"/>
    <path d="M53 139c0-38 20-56 47-56s47 18 47 56c0 24-20 35-47 35s-47-11-47-35z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M64 146c0-20 15-31 36-31s36 11 36 31c0 17-16 24-36 24s-36-7-36-24z" fill="#c8f7a5" opacity=".75"/>
    <path d="M51 139c9 8 16 8 24 0m50 0c8 8 15 8 24 0" fill="none" stroke="#3f9850" stroke-width="3" stroke-linecap="round" opacity=".55"/>
    ${eye(83, 113, 7, 9, '#396f3c')}${eye(117, 113, 7, 9, '#396f3c')}
    <path d="M100 127c-3 3-3 6 0 8 3-2 3-5 0-8z" fill="#356b3d"/>
    <path d="M100 135c-2 4-7 4-9 1m9-1c2 4 7 4 9 1" fill="none" stroke="#356b3d" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="69" cy="130" r="6" fill="#f6a2a2" opacity=".55"/><circle cx="131" cy="130" r="6" fill="#f6a2a2" opacity=".55"/>
    <circle cx="73" cy="154" r="2" fill="#2f7c40" opacity=".6"/><circle cx="127" cy="157" r="2.5" fill="#2f7c40" opacity=".5"/>
    <path d="M62 168c-8 5-12 9-13 16m18-17c-4 6-4 11-2 16" stroke="${OUTLINE}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M138 168c8 5 12 9 13 16m-18-17c4 6 4 11 2 16" stroke="${OUTLINE}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M57 172c-3 2-5 5-6 8m112-8c3 2 5 5 6 8" stroke="#7ad177" stroke-width="2" stroke-linecap="round"/>
  `, defs);
}

// --- Voltkit ---------------------------------------------------------------
function voltkit() {
  const b = nid(), y = nid(), g = nid();
  const defs = grad(b, '#ffe873', '#e8a92f') + grad(y, '#fff4ad', '#ffd24a') + glowDef(g, '#ffe66b', 2.5);
  return wrap(`
    ${shadow()}
    <path d="M142 142c13 6 18 18 14 30l13-3-8 13 15 1-12 12c-12 9-27 2-29-11-2-10 1-18 7-25-5-4-5-11 0-17z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M147 165l8-2-5 8 9 1-8 7" fill="none" stroke="#fff3a3" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>
    <path d="M64 92 52 40l36 27z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M60 75 55 51l17 14z" fill="#373041"/>
    <path d="M136 92 148 40l-36 27z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M140 75 145 51l-17 14z" fill="#373041"/>
    <path d="M53 144c0-40 20-60 47-60s47 20 47 60c0 25-20 35-47 35s-47-10-47-35z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M66 151c0-20 14-32 34-32s34 12 34 32c0 17-15 23-34 23s-34-6-34-23z" fill="#fff0a9"/>
    ${eye(82, 110, 6.5, 8.5, '#6a4a1c')}${eye(118, 110, 6.5, 8.5, '#6a4a1c')}
    <ellipse cx="100" cy="126" rx="6.5" ry="4.5" fill="#4a3525"/>
    <path d="M100 131v4m0 0c-2 4-6 4-8 1m8-1c2 4 6 4 8 1" fill="none" stroke="#5b412d" stroke-width="2.3" stroke-linecap="round"/>
    <rect x="95" y="135" width="10" height="9" rx="2.5" fill="#fffdf0" stroke="#7e6239" stroke-width="1.2"/>
    <circle cx="70" cy="125" r="6.5" fill="#f07b62" opacity=".8"/><circle cx="130" cy="125" r="6.5" fill="#f07b62" opacity=".8"/>
    <path d="M69 72c-1-6 1-10 4-13m58 13c1-6-1-10-4-13" stroke="#fff2a6" stroke-width="2.4" stroke-linecap="round"/>
    <ellipse cx="73" cy="172" rx="15" ry="8" fill="#d79b2b" stroke="${OUTLINE}" stroke-width="4"/>
    <ellipse cx="127" cy="172" rx="15" ry="8" fill="#d79b2b" stroke="${OUTLINE}" stroke-width="4"/>
    <circle cx="100" cy="87" r="3" fill="#fff6b7" opacity=".8"/>
  `, defs);
}

// --- Pebblit ---------------------------------------------------------------
function pebblit() {
  const b = nid(), d = nid(), g = nid();
  const defs = grad(b, '#d9c8af', '#8d7a64') + grad(d, '#a38f77', '#635545') + glowDef(g, '#ffc26b', 3);
  return wrap(`
    ${shadow()}
    <path d="M114 66 124 37l20 25 15-8-13 29z" fill="#b7c9d1" stroke="${OUTLINE}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M124 43l4 22 12-9z" fill="#e6f4f8" opacity=".7"/>
    <path d="M57 139 64 101l25-25 38-3 23 24 8 41-23 29-44 6-29-15z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M64 101l25 13 20-38-20-3z" fill="#e7d8c1" opacity=".45"/>
    <path d="M109 76l23 24-31 15z" fill="#7d6a56" opacity=".4"/>
    <path d="M64 101l25 13-19 33-13-8z" fill="#a9937b" opacity=".35"/>
    <path d="M56 153l30-6 19 17 34-12 15 13-23 16-44 5-29-14z" fill="url(#${d})" opacity=".9"/>
    <g filter="url(#${g})">
      <path d="M79 119l8-2 3 9-10 3zM113 111l9 3-2 9-9-2z" fill="#ffbf60"/>
      <circle cx="86" cy="123" r="4" fill="#ffe4a8"/><circle cx="119" cy="116" r="4" fill="#ffe4a8"/>
      <circle cx="86" cy="123" r="1.6" fill="#3c2a1c"/><circle cx="119" cy="116" r="1.6" fill="#3c2a1c"/>
    </g>
    <path d="M95 142c4 4 10 4 14 0" fill="none" stroke="#4c3e32" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M74 150l-3 12 8 5m46-21 5 12-8 6" fill="none" stroke="${OUTLINE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M64 113l-15 5" stroke="${OUTLINE}" stroke-width="7" stroke-linecap="round"/>
    <path d="M137 107l14 4" stroke="${OUTLINE}" stroke-width="7" stroke-linecap="round"/>
    <path d="M59 89c5-5 11-7 17-6m-9 26 8 3m42-15c5 1 8 4 10 8" fill="none" stroke="#c7b39a" stroke-width="2" stroke-linecap="round" opacity=".7"/>
    <path d="M74 102c3-2 6-2 9-1l-2 5z" fill="#78a05f" opacity=".8"/>
    <circle cx="131" cy="136" r="2.4" fill="#5b4a39" opacity=".6"/>
  `, defs);
}

// --- Wispurr ---------------------------------------------------------------
function wispurr() {
  const b = nid(), g = nid(), glow = nid();
  const defs = grad(b, '#d9b6ff', '#8b5bc7') + radial(g, '#f4e6ff', '#b98ce6') + glowDef(glow, '#c99bff', 4);
  return wrap(`
    <ellipse cx="100" cy="179" rx="44" ry="7" fill="#05060c" opacity=".3"/>
    <g filter="url(#${glow})" opacity=".65">
      <circle cx="55" cy="74" r="3" fill="#e6cfff"/><circle cx="148" cy="61" r="2.2" fill="#e6cfff"/><circle cx="160" cy="119" r="3.2" fill="#e6cfff"/><circle cx="38" cy="129" r="2" fill="#e6cfff"/>
    </g>
    <path d="M65 84 56 45l33 26z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M135 84 144 45l-33 26z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M67 77 63 57l17 13z" fill="#654087" opacity=".7"/><path d="M133 77l4-20-17 13z" fill="#654087" opacity=".7"/>
    <path d="M55 136c0-37 18-57 45-57s45 20 45 57c0 8-3 16-8 22 9 7 5 19-6 18-7-1-10-6-10-12-7 4-14 6-21 6s-14-2-21-6c0 6-3 11-10 12-11 1-15-11-6-18-5-6-8-14-8-22z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M62 141c0-24 17-38 38-38s38 14 38 38c0 9-5 17-13 21-8 5-16 4-25 4s-17 1-25-4c-8-4-13-12-13-21z" fill="url(#${g})" opacity=".9"/>
    ${eye(83, 110, 6.5, 8.5, '#6e3e9e')}${eye(117, 110, 6.5, 8.5, '#6e3e9e')}
    <path d="M100 92c6-5 12-5 17 0-5 5-12 5-17 0z" fill="#f1ddff" opacity=".8"/>
    <ellipse cx="100" cy="94" rx="2.6" ry="4.2" fill="#f7ecff"/><circle cx="100" cy="93" r="1" fill="#6e3e9e"/>
    <path d="M100 128c-3 3-3 6 0 8 3-2 3-5 0-8z" fill="#5e3585"/>
    <path d="M100 136c-2 4-7 4-9 1m9-1c2 4 7 4 9 1" fill="none" stroke="#5e3585" stroke-width="2.3" stroke-linecap="round"/>
    <path d="M151 128c15 3 20 16 13 26-6 8-18 7-22-1 9 2 13-4 11-10-1-5-5-8-9-8z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="4" stroke-linejoin="round" opacity=".9"/>
    <path d="M64 152c0 8 4 16 12 21m60-21c0 8-4 16-12 21" fill="none" stroke="#a574d4" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>
    <circle cx="72" cy="133" r="2" fill="#f0d9ff" opacity=".7"/><circle cx="130" cy="139" r="1.5" fill="#f0d9ff" opacity=".6"/>
  `, defs);
}

// --- Nocturne --------------------------------------------------------------
function nocturne() {
  const b = nid(), w = nid(), g = nid();
  const defs = grad(b, '#6d58a8', '#2d214d') + grad(w, '#5d4b91', '#1e1738') + glowDef(g, '#ffe28a', 3);
  return wrap(`
    ${shadow(100, 181, 52, 7)}
    <path d="M78 118C46 104 26 78 36 63c15 12 31 17 46 31z" fill="url(#${w})" stroke="${OUTLINE}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M122 118c32-14 52-40 42-55-15 12-31 17-46 31z" fill="url(#${w})" stroke="${OUTLINE}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M48 76c13 8 24 13 34 23m-32-24 8 11m94 13c-13 8-24 13-34 23m32-24-8 11" fill="none" stroke="#8a76c2" stroke-width="2" stroke-linecap="round" opacity=".55"/>
    <path d="M64 86 55 47l31 24z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M136 86 145 47l-31 24z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M55 141c0-40 19-61 45-61s45 21 45 61c0 25-19 35-45 35s-45-10-45-35z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M66 150c0-20 14-32 34-32s34 12 34 32c0 17-15 23-34 23s-34-6-34-23z" fill="#433568" opacity=".85"/>
    ${eye(83, 107, 6.5, 9, '#ffe27a', true)}${eye(117, 107, 6.5, 9, '#ffe27a', true)}
    <path d="M100 83c8-5 15-3 18 3-6 2-12 1-18-3z" fill="#f0e3a8" opacity=".9"/>
    <path d="M92 124c2 4 6 4 8 0M100 124c2 4 6 4 8 0" fill="none" stroke="#cfc3e8" stroke-width="2.3" stroke-linecap="round"/>
    <path d="M94 129v5h12v-5" fill="#f7e9d1" opacity=".9"/>
    <path d="M95 134l-1 4m11-4 1 4" stroke="#f7e9d1" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M100 86c5-8 12-11 20-10-4 7-10 11-20 10z" fill="#f4dd8e" opacity=".8"/>
    <path d="M146 140c14 0 22 8 20 19-2 10-13 13-20 7 7-1 9-5 8-10-1-5-4-8-8-9z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="4"/>
    <ellipse cx="76" cy="171" rx="15" ry="7" fill="#241b3c" stroke="${OUTLINE}" stroke-width="4"/>
    <ellipse cx="124" cy="171" rx="15" ry="7" fill="#241b3c" stroke="${OUTLINE}" stroke-width="4"/>
    <circle cx="65" cy="117" r="2" fill="#9480c8" opacity=".7"/><circle cx="137" cy="130" r="1.6" fill="#9480c8" opacity=".6"/>
  `, defs);
}

// --- Frostfin --------------------------------------------------------------
function frostfin() {
  const b = nid(), l = nid(), i = nid();
  const defs = grad(b, '#b8fbff', '#3ca7ba') + grad(l, '#efffff', '#a6edf2') + grad(i, '#d8ffff', '#86dbe6');
  return wrap(`
    ${shadow(100, 181, 54, 7)}
    <path d="M143 137c17-5 29 2 31 15 14-1 19 13 8 22-12 10-30 3-36-7-5-8-7-18-3-30z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M61 160c-18 2-27-7-25-17 13 4 21 7 28 13z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="4.5"/>
    <path d="M77 82 66 59l21 7 10-18 9 18 22-7-12 23z" fill="url(#${i})" stroke="${OUTLINE}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M74 68l8 10-13-2zm49 0-8 10 13-2z" fill="#e9ffff" opacity=".7"/>
    <path d="M52 145c0-38 19-57 48-57s48 19 48 57c0 23-20 33-48 33s-48-10-48-33z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M64 151c0-20 14-31 36-31s36 11 36 31c0 16-16 22-36 22s-36-6-36-22z" fill="url(#${l})"/>
    ${eye(83, 112, 6.5, 8.5, '#2f7e91')}${eye(117, 112, 6.5, 8.5, '#2f7e91')}
    <ellipse cx="100" cy="128" rx="6.5" ry="4.5" fill="#2f5364"/>
    <path d="M100 132v4m0 0c-2 4-7 4-9 1m9-1c2 4 7 4 9 1" fill="none" stroke="#4c7a88" stroke-width="2.3" stroke-linecap="round"/>
    <path d="M100 142c8 0 13 3 13 3s-5 3-13 3-13-3-13-3 5-3 13-3z" fill="#8fdce8" opacity=".7"/>
    <path d="M66 145c-7 9-9 18-6 26m74-26c7 9 9 18 6 26" fill="none" stroke="${OUTLINE}" stroke-width="6" stroke-linecap="round"/>
    <path d="M57 169c-4-1-8 0-11 3m97-3c4-1 8 0 11 3" stroke="#b7f4f7" stroke-width="2" stroke-linecap="round"/>
    <g fill="#e9ffff" opacity=".7"><circle cx="52" cy="95" r="2.5"/><circle cx="45" cy="82" r="1.7"/><circle cx="156" cy="98" r="2"/><circle cx="163" cy="84" r="1.4"/></g>
    <path d="M126 152l4 8 8 1-6 6 2 8-8-4-7 4 1-8-6-6 8-1z" fill="#e9ffff" opacity=".45"/>
  `, defs);
}

// --- Toxipod ---------------------------------------------------------------
function toxipod() {
  const b = nid(), c = nid(), s = nid();
  const defs = grad(b, '#b07bd6', '#5e3d81') + grad(c, '#d8b16b', '#8e6a3b') + radial(s, '#d9ff8f', '#7fae44');
  return wrap(`
    ${shadow(100, 180, 55, 7)}
    <path d="M53 101c0-33 23-52 51-52 31 0 53 21 53 52 0 10-46 16-53 16s-51-6-51-16z" fill="url(#${s})" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M62 94c4-20 21-33 42-33 22 0 38 12 42 32-25 8-59 8-84 1z" fill="#c5ef7d" opacity=".55"/>
    <g fill="#f0ffd1" opacity=".8"><circle cx="79" cy="80" r="5"/><circle cx="110" cy="68" r="4"/><circle cx="130" cy="88" r="6"/><circle cx="94" cy="95" r="3"/></g>
    <path d="M69 109c0-9 14-15 31-15s31 6 31 15v25c0 9-14 15-31 15s-31-6-31-15z" fill="url(#${c})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M68 137c0-7 15-12 32-12s32 5 32 12v17c0 8-14 14-32 14s-32-6-32-14z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M68 151c0-6 15-10 32-10s32 4 32 10v9c0 7-14 12-32 12s-32-5-32-12z" fill="#7a4e9e" stroke="${OUTLINE}" stroke-width="4"/>
    ${eye(87, 125, 5.5, 7, '#f5d85c')}${eye(113, 125, 5.5, 7, '#f5d85c')}
    <path d="M96 137c2 4 6 4 8 0" fill="none" stroke="#3e2a1e" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M100 116c-2 6-2 10 0 14 2-4 2-8 0-14z" fill="#70513a" opacity=".7"/>
    <g stroke="${OUTLINE}" stroke-width="3.5" stroke-linecap="round">
      <path d="M76 161l-7 11m18-9-4 13m34-13 4 13m10-15 7 11"/>
    </g>
    <path d="M58 105c-5 0-9 3-10 8s3 8 7 7" fill="none" stroke="#8fbe55" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
    <circle cx="143" cy="116" r="2.6" fill="#c7ef84" opacity=".9"/><circle cx="151" cy="131" r="1.8" fill="#c7ef84" opacity=".7"/>
    <path d="M63 160c-2 5-1 9 2 12" fill="none" stroke="#d6ff9d" stroke-width="2" stroke-linecap="round" opacity=".45"/>
  `, defs);
}

// --- Gustling --------------------------------------------------------------
function gustling() {
  const b = nid(), w = nid(), g = nid();
  const defs = grad(b, '#eafcff', '#9ed7e8') + grad(w, '#d8f5ff', '#79c4df') + glowDef(g, '#dff8ff', 2.5);
  return wrap(`
    ${shadow(100, 181, 46, 6)}
    <path d="M68 121C45 116 27 102 24 85c15-2 23 5 31 13 5 6 10 13 13 23z" fill="url(#${w})" stroke="${OUTLINE}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M132 121c23-5 41-19 44-36-15-2-23 5-31 13-5 6-10 13-13 23z" fill="url(#${w})" stroke="${OUTLINE}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M40 91c10 7 18 16 25 28m-27-20c8 4 15 12 21 22m101-30c-10 7-18 16-25 28m27-20c-8 4-15 12-21 22" fill="none" stroke="#a9e2f2" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>
    <path d="M100 68c4-12 9-17 15-20-2 9 0 15 5 19z" fill="#8fd7ec" stroke="${OUTLINE}" stroke-width="3.5"/>
    <path d="M69 140c0-38 14-59 31-59s31 21 31 59c0 23-14 33-31 33s-31-10-31-33z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M78 145c0-18 10-28 22-28s22 10 22 28c0 14-10 19-22 19s-22-5-22-19z" fill="#f7ffff" opacity=".85"/>
    ${eye(88, 112, 5.5, 7.5, '#3d8ba4')}${eye(112, 112, 5.5, 7.5, '#3d8ba4')}
    <path d="M94 128l6-5 6 5-6 8z" fill="#f4a64f" stroke="#8a5d28" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M62 149c-8 4-12 9-14 15m90-15c8 4 12 9 14 15" fill="none" stroke="${OUTLINE}" stroke-width="5" stroke-linecap="round"/>
    <path d="M70 172l-5 7m-3-5 2 7m4-8-8 2m73-3 5 7m3-5-2 7m-4-8 8 2" stroke="#f4a64f" stroke-width="3" stroke-linecap="round"/>
    <g fill="none" stroke="#dff8ff" stroke-width="2.2" stroke-linecap="round" opacity=".7">
      <path d="M30 128c12-4 20 0 24 8s0 15-8 16"/>
      <path d="M166 126c-12-3-19 2-22 10s1 14 9 14"/>
    </g>
    <g filter="url(#${g})" opacity=".8"><circle cx="53" cy="119" r="1.8" fill="#fff"/><circle cx="150" cy="112" r="1.4" fill="#fff"/></g>
  `, defs);
}

// --- Boulderon -------------------------------------------------------------
function boulderon() {
  const b = nid(), d = nid(), g = nid();
  const defs = grad(b, '#ab9a83', '#5a4b3d') + grad(d, '#8c7a65', '#40362c') + glowDef(g, '#ff9b45', 4);
  return wrap(`
    ${shadow(100, 184, 62, 7)}
    <path d="M46 134c-9-3-17 2-18 12-1 9 6 15 14 14l12-5z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M154 134c9-3 17 2 18 12 1 9-6 15-14 14l-12-5z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M52 132 57 82l24-23 40-2 24 24 7 51-18 35-46 6-30-17z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M57 82l24 20 12-45-12-2z" fill="#c2b19a" opacity=".35"/>
    <path d="M121 57l24 24-34 19z" fill="#4c4034" opacity=".35"/>
    <path d="M81 102l18 17-30 18-16-9z" fill="#907e69" opacity=".4"/>
    <path d="M99 119l29-17 14 30-20 27-31-5z" fill="#c0ad95" opacity=".32"/>
    <g filter="url(#${g})">
      <path d="M82 147l-8 12 15 3 5-12zm26 8 4 12 15-4-3-13z" fill="#ff9b45" opacity=".9"/>
      <path d="M88 155c6 0 10 3 12 8" fill="none" stroke="#ffd08a" stroke-width="2" stroke-linecap="round"/>
    </g>
    <path d="M68 75 85 44l25 14-9 22z" fill="#7b8f99" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M85 48l-5 22 15-7z" fill="#c7e0e8" opacity=".5"/>
    <ellipse cx="100" cy="177" rx="17" ry="8" fill="#4a3e33" stroke="${OUTLINE}" stroke-width="4"/>
    <ellipse cx="126" cy="177" rx="17" ry="8" fill="#4a3e33" stroke="${OUTLINE}" stroke-width="4"/>
    <g filter="url(#${g})"><circle cx="84" cy="111" r="4.5" fill="#ffe0a3"/><circle cx="118" cy="111" r="4.5" fill="#ffe0a3"/><circle cx="84" cy="111" r="1.8" fill="#5c3019"/><circle cx="118" cy="111" r="1.8" fill="#5c3019"/></g>
    <path d="M61 118c10-3 18-2 25 3m52-3c-10-3-18-2-25 3" fill="none" stroke="#3f342b" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
    <path d="M93 131c4 3 9 3 13 0" fill="none" stroke="#392f26" stroke-width="3" stroke-linecap="round"/>
    <path d="M58 99c4-5 9-7 14-7m57 7c-4-5-9-7-14-7" fill="none" stroke="#8a7862" stroke-width="2" stroke-linecap="round"/>
    <path d="M88 168c3-2 7-2 10 0m10 0c3-2 7-2 10 0" stroke="#7da56a" stroke-width="2" stroke-linecap="round" opacity=".7"/>
  `, defs);
}

// --- Stormroc --------------------------------------------------------------
function stormroc() {
  const b = nid(), w = nid(), g = nid();
  const defs = grad(b, '#5f86bc', '#243b69') + grad(w, '#5f86bc', '#1a2848') + glowDef(g, '#ffe16e', 3);
  return wrap(`
    ${shadow(100, 183, 50, 6)}
    <path d="M78 120C47 103 24 75 30 52c21 9 35 22 47 43z" fill="url(#${w})" stroke="${OUTLINE}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M122 120c31-17 54-45 48-68-21 9-35 22-47 43z" fill="url(#${w})" stroke="${OUTLINE}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M38 62c15 10 27 21 36 38m-30-26c13 7 23 17 30 30m90-42c-15 10-27 21-36 38m30-26c-13 7-23 17-30 30" fill="none" stroke="#8fb0d8" stroke-width="1.8" stroke-linecap="round" opacity=".55"/>
    <path d="M92 58 83 30l14 9 8-21 7 21 16-9-9 28z" fill="#ffe16e" stroke="${OUTLINE}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M69 140c0-42 14-64 31-64s31 22 31 64c0 24-14 34-31 34s-31-10-31-34z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M77 145c0-19 11-30 23-30s23 11 23 30c0 14-11 20-23 20s-23-6-23-20z" fill="#8aa9ce" opacity=".6"/>
    ${eye(87, 108, 5.5, 7.5, '#ffe16e', true)}${eye(113, 108, 5.5, 7.5, '#ffe16e', true)}
    <path d="M92 124l8-6 8 6-8 9z" fill="#eab44c" stroke="#73531d" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M63 150c-7 3-11 7-14 13m88-13c7 3 11 7 14 13" fill="none" stroke="${OUTLINE}" stroke-width="5" stroke-linecap="round"/>
    <path d="M72 174l-5 8m-3-6 1 8m5-8-8 2m66-4 5 8m3-6-1 8m-5-8 8 2" stroke="#eab44c" stroke-width="3" stroke-linecap="round"/>
    <g filter="url(#${g})" opacity=".9">
      <path d="M42 112l-9 3 7 4-7 7 12-2zM158 99l9 3-6 5 8 6-13-1z" fill="#ffe16e"/>
    </g>
    <path d="M79 78c5-4 11-5 17-4m8 0c6-1 12 0 17 4" fill="none" stroke="#9cc3e8" stroke-width="2" stroke-linecap="round" opacity=".6"/>
    <circle cx="100" cy="146" r="3" fill="#3e5f8c" opacity=".8"/>
  `, defs);
}

// --- Elderwood -------------------------------------------------------------
function elderwood() {
  const b = nid(), l = nid(), g = nid();
  const defs = grad(b, '#a47c55', '#5b402d') + grad(l, '#8fdb6f', '#3b8b4a') + glowDef(g, '#9dffa0', 3);
  return wrap(`
    ${shadow(100, 184, 62, 7)}
    <path d="M45 150c-15-6-24 4-21 17 3 12 17 14 25 5l8-12zM155 150c15-6 24 4 21 17-3 12-17 14-25 5l-8-12z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M54 139 58 83l20-25 44-2 20 25 4 56-15 31-46 6-30-19z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5.5" stroke-linejoin="round"/>
    <path d="M80 72c-4-15 3-25 15-31 7 13 3 24-6 33z" fill="url(#${l})" stroke="${OUTLINE}" stroke-width="4"/>
    <path d="M108 68c1-17 11-25 24-26 1 15-7 25-20 31z" fill="url(#${l})" stroke="${OUTLINE}" stroke-width="4"/>
    <path d="M68 79c-8-10-6-21 3-29 8 10 7 21 1 31z" fill="url(#${l})" stroke="${OUTLINE}" stroke-width="3.5"/>
    <path d="M127 80c8-10 6-21-3-29-8 10-7 21-1 31z" fill="url(#${l})" stroke="${OUTLINE}" stroke-width="3.5"/>
    <path d="M64 91c-9-9-11-19-6-29m41 32c-2-13 4-22 14-28" fill="none" stroke="#3f7e44" stroke-width="2" stroke-linecap="round" opacity=".7"/>
    <path d="M63 98c10 12 20 15 32 9m14-9c9 11 18 14 29 8" fill="none" stroke="#8c6750" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>
    <g filter="url(#${g})">${eye(86, 113, 5.5, 7.5, '#a8ff9b', true)}${eye(114, 113, 5.5, 7.5, '#a8ff9b', true)}</g>
    <path d="M100 124c-2 6-2 10 0 14 2-4 2-8 0-14z" fill="#3c2b20"/>
    <path d="M100 138c-3 5-8 5-11 2m11-2c3 5 8 5 11 2" fill="none" stroke="#3c2b20" stroke-width="2.4" stroke-linecap="round"/>
    <g fill="none" stroke="#3f2c20" stroke-width="2.2" stroke-linecap="round" opacity=".65">
      <path d="M83 92c6 4 8 10 6 17m30-17c-6 4-8 10-6 17M75 132c8 3 15 2 22-2m6 0c7 4 14 5 22 2"/>
    </g>
    <path d="M72 166c-5 4-7 9-6 14m62-14c5 4 7 9 6 14" stroke="${OUTLINE}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M80 165c-3 4-4 8-3 12m46-12c3 4 4 8 3 12" stroke="#6f513a" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M62 146c3-2 6-2 9 0l-2 8c-3 1-6 0-8-2z" fill="#e6a05c" stroke="#5a3820" stroke-width="1.5"/>
    <path d="M137 136c3-2 6-2 9 0l-1 8c-3 1-6 0-8-2z" fill="#d98652" stroke="#5a3820" stroke-width="1.5"/>
    <path d="M59 159c-3 5-8 7-13 7m95-7c3 5 8 7 13 7" stroke="#7ca768" stroke-width="2" stroke-linecap="round" opacity=".7"/>
  `, defs);
}

// --- Aurelion --------------------------------------------------------------
function aurelion() {
  const b = nid(), m = nid(), g = nid(), h = nid();
  const defs = grad(b, '#fff6d9', '#e9bd63') + grad(m, '#ffe38b', '#d98a2b') + radial(g, '#fff7cc', '#f2b64e') + glowDef(h, '#ffe08a', 5);
  return wrap(`
    <circle cx="100" cy="96" r="76" fill="url(#${g})" opacity=".16"/>
    <g filter="url(#${h})">
      <circle cx="100" cy="96" r="70" fill="none" stroke="#ffe7a4" stroke-width="2" opacity=".4"/>
      <circle cx="100" cy="96" r="80" fill="none" stroke="#ffe7a4" stroke-width="1" opacity=".2"/>
    </g>
    <g fill="url(#${m})" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round">
      <path d="M100 26l10 34h-20zM100 166l10-34h-20zM30 96l34-10v20zM170 96l-34-10v20zM51 51l28 20-14 14zM149 51l-28 20 14 14zM51 141l28-20-14-14zM149 141l-28-20 14-14z"/>
    </g>
    <g fill="#fff2b8" opacity=".75">
      <circle cx="42" cy="78" r="2"/><circle cx="157" cy="76" r="2.5"/><circle cx="65" cy="39" r="1.6"/><circle cx="135" cy="39" r="1.8"/><circle cx="158" cy="132" r="1.5"/><circle cx="42" cy="132" r="2"/>
    </g>
    ${shadow(100, 180, 52, 7)}
    <path d="M73 84 65 55l26 16zM127 84l8-31-26 16z" fill="#fff4d4" stroke="${OUTLINE}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M69 66l3 14 10-7zm62 0-3 14-10-7z" fill="#d69a43" opacity=".65"/>
    <path d="M52 143c0-42 21-64 48-64s48 22 48 64c0 26-21 37-48 37s-48-11-48-37z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="5"/>
    <path d="M65 151c0-20 15-32 35-32s35 12 35 32c0 17-16 24-35 24s-35-7-35-24z" fill="#fff9e7" opacity=".9"/>
    <path d="M100 82c-9-11-6-20 3-26 8 8 10 17 5 25z" fill="url(#${m})" stroke="${OUTLINE}" stroke-width="3"/>
    ${eye(83, 107, 5.5, 7.5, '#f2b64e', true)}${eye(117, 107, 5.5, 7.5, '#f2b64e', true)}
    <path d="M100 117c-4 4-4 8 0 11 4-3 4-7 0-11z" fill="#b57a2b"/>
    <path d="M100 128v5m0 0c-3 4-8 4-11 1m11-1c3 4 8 4 11 1" fill="none" stroke="#9d6e2f" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M92 138c5 3 11 3 16 0" fill="none" stroke="#d4a85a" stroke-width="2" stroke-linecap="round"/>
    <path d="M76 145c7-4 14-4 20-1m28 1c-7-4-14-4-20-1" fill="none" stroke="#d9a94a" stroke-width="2" stroke-linecap="round" opacity=".7"/>
    <g fill="#ffe9a8" opacity=".9">
      <circle cx="72" cy="128" r="4"/><circle cx="128" cy="128" r="4"/><circle cx="100" cy="100" r="2.2"/>
    </g>
    <path d="M61 169c-6 2-9 5-10 9m98-9c6 2 9 5 10 9" fill="none" stroke="${OUTLINE}" stroke-width="5" stroke-linecap="round"/>
    <path d="M64 175c-3 2-5 4-6 6m84-6c3 2 5 4 6 6" stroke="#e8bc64" stroke-width="2" stroke-linecap="round"/>
    <path d="M141 138c14 5 20 16 17 28-3 11-14 15-21 9 8-1 11-6 10-12-1-6-4-10-9-12z" fill="url(#${b})" stroke="${OUTLINE}" stroke-width="4"/>
    <path d="M146 147c7 5 9 12 7 19" fill="none" stroke="#dca84d" stroke-width="2" stroke-linecap="round" opacity=".7"/>
  `, defs);
}

const CREATURES = {
  emberling, aquapup, leafling, voltkit, pebblit, wispurr, nocturne,
  frostfin, toxipod, gustling, boulderon, stormroc, elderwood, aurelion,
};

export function creatureArt(id) {
  return (CREATURES[id] || emberling)();
}

// --- The Warden (player) ---------------------------------------------------
export function wardenArt() {
  const c = nid(), h = nid(), g = nid(), o = nid();
  const defs = grad(c, '#2f4d5c', '#132530') + grad(h, '#223b48', '#0d1b24') +
    `<filter id="${g}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
    radial(o, '#fff6c9', '#f2a93e');
  return wrap(`
    <ellipse cx="110" cy="287" rx="51" ry="8" fill="#05060c" opacity=".5"/>
    <path d="M89 239c2 15 1 29-7 44l21 3 6-26 8 26 20-4c-9-15-10-28-8-44z" fill="#1a2b34" stroke="#0c141a" stroke-width="4"/>
    <path d="M80 152c-13 22-20 53-18 91l30 4 12-63 11 63 30-3c2-39-5-70-18-92z" fill="url(#${c})" stroke="#0b141b" stroke-width="5" stroke-linejoin="round"/>
    <path d="M101 182c-7 7-9 19-8 33m15-34c6 9 8 21 7 36" fill="none" stroke="#426779" stroke-width="2" stroke-linecap="round" opacity=".65"/>
    <path d="M66 213c-13 9-17 24-12 33 5 8 15 7 19-3l7-22z" fill="url(#${c})" stroke="#0b141b" stroke-width="5" stroke-linejoin="round"/>
    <path d="M148 209c13 8 19 22 15 32-4 9-14 9-19-1l-8-22z" fill="url(#${c})" stroke="#0b141b" stroke-width="5" stroke-linejoin="round"/>
    <path d="M58 150c0-36 18-58 43-58s44 22 44 58c0 23-19 34-43 34s-44-11-44-34z" fill="url(#${h})" stroke="#0b141b" stroke-width="5"/>
    <path d="M72 151c0-24 12-39 29-39s29 15 29 39c0 15-13 23-29 23s-29-8-29-23z" fill="#0a131a"/>
    <g filter="url(#${g})"><ellipse cx="89" cy="139" rx="3.6" ry="2.4" fill="#ffe19a"/><ellipse cx="113" cy="139" rx="3.6" ry="2.4" fill="#ffe19a"/></g>
    <path d="M63 156c9 10 17 11 25 5m60-5c-9 10-17 11-25 5" fill="none" stroke="#3b5b6a" stroke-width="3" stroke-linecap="round" opacity=".7"/>
    <path d="M78 164c-7 4-12 9-14 16M122 164c7 4 12 9 14 16" fill="none" stroke="#8c5a3c" stroke-width="3" stroke-linecap="round"/>
    <path d="M74 180c17 8 34 8 51 0" fill="none" stroke="#9b6a45" stroke-width="3" stroke-linecap="round"/>
    <path d="M95 186h10v7H95z" fill="#c99b4b" opacity=".8"/>
    <path d="M84 192c0 20-5 36-14 52m46-52c0 20 5 36 14 52" fill="none" stroke="#1c303b" stroke-width="3" opacity=".5"/>
    <path d="M160 172v88" stroke="#573c29" stroke-width="6" stroke-linecap="round"/>
    <path d="M158 163c0-10 15-10 15 0v8c0 11-15 11-15 0z" fill="#3a2a1c" stroke="#17110c" stroke-width="3"/>
    <g filter="url(#${g})"><circle cx="165.5" cy="167" r="4.5" fill="#ffd971"/></g>
    <path d="M146 231c-7-2-12 3-13 10-1 9 7 15 15 13 9-2 13-11 9-18-2-4-6-6-11-5z" fill="#101b22" stroke="#0b141b" stroke-width="3"/>
    <g filter="url(#${g})"><circle cx="149" cy="240" r="9" fill="url(#${o})" opacity=".92"/><circle cx="146" cy="237" r="3" fill="#fffbe8"/></g>
    <path d="M149 228c-3-6 0-12 5-14 1 5 0 10-5 14z" fill="#ffd971" opacity=".8"/>
    <g opacity=".5" fill="#7fd8d2"><circle cx="72" cy="127" r="1.5"/><circle cx="132" cy="120" r="1.2"/><circle cx="58" cy="196" r="1.4"/></g>
  `, defs, '0 0 220 300');
}

// --- Wayfarer (shop keeper) ------------------------------------------------
export function wayfarerArt() {
  const c = nid(), g = nid(), w = nid();
  const defs = grad(c, '#5a3f6b', '#2a1c38') +
    `<filter id="${g}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
    grad(w, '#e0c79c', '#a77b4e');
  return wrap(`
    <ellipse cx="110" cy="270" rx="55" ry="8" fill="#05060c" opacity=".45"/>
    <path d="M73 152c-17 25-23 57-20 99l43 5 12-69 13 69 42-4c1-44-7-77-24-100z" fill="url(#${c})" stroke="#120d1a" stroke-width="5"/>
    <path d="M120 190c-18 9-27 30-23 53 4 20 20 28 36 17 11-8 13-25 5-37-7-11-17-17-28-15z" fill="url(#${w})" opacity=".18"/>
    <path d="M55 153c0-39 22-61 55-61s55 22 55 61c0 20-24 31-55 31s-55-11-55-31z" fill="url(#${c})" stroke="#120d1a" stroke-width="5"/>
    <path d="M63 141c15-24 37-36 62-32 14 2 24 9 30 19-27-4-61 2-92 13z" fill="#3a2848" stroke="#120d1a" stroke-width="4"/>
    <path d="M68 153c0-26 18-42 42-42s42 16 42 42c0 18-19 27-42 27s-42-9-42-27z" fill="#0b0711"/>
    <g filter="url(#${g})"><ellipse cx="89" cy="149" rx="4" ry="2.6" fill="#ffd27a"/><ellipse cx="131" cy="149" rx="4" ry="2.6" fill="#ffd27a"/></g>
    <path d="M77 164c8 6 17 7 25 2m18 0c8 5 17 4 24-2" fill="none" stroke="#4b3560" stroke-width="3" stroke-linecap="round"/>
    <path d="M96 172c9 4 18 4 27 0" fill="none" stroke="#4b3560" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M65 171c-6 19-7 36-4 52m90-52c6 19 7 36 4 52" fill="none" stroke="#2a1c38" stroke-width="3" opacity=".7"/>
    <path d="M42 233c8-15 24-19 35-9 10 9 8 26-4 33-13 7-29 0-33-11z" fill="#3a2a1c" stroke="#17110c" stroke-width="3"/>
    <g stroke="#6b5232" stroke-width="3"><path d="M44 235l26-6m-29 12 30-4m-27 12 24-4"/></g>
    <path d="M170 140c8-6 17-2 17 7 0 8-9 12-16 8-6-3-7-10-1-15z" fill="#dfb15e" opacity=".9"/>
    <path d="M164 129c8 3 14 9 16 17" fill="none" stroke="#e9cf8a" stroke-width="2" stroke-linecap="round"/>
    <g fill="#ffd27a" opacity=".6"><circle cx="53" cy="113" r="2"/><circle cx="171" cy="176" r="1.6"/><circle cx="37" cy="190" r="1.4"/></g>
  `, defs, '0 0 220 280');
}

// --- One-off illustrations -------------------------------------------------
export function campfireArt() {
  const g = nid();
  return wrap(`
    <ellipse cx="100" cy="168" rx="64" ry="9" fill="#05060c" opacity=".5"/>
    <path d="M48 160l35-15 17 8 18-8 34 15-19 12H67z" fill="#4d3526" stroke="#24180f" stroke-width="4" stroke-linejoin="round"/>
    <path d="M62 157l27-9m49 9-25-9" stroke="#7c5638" stroke-width="3" stroke-linecap="round"/>
    <g filter="url(#${g})">
      <path d="M100 43c8 28 31 32 28 62-2 24-16 38-28 38s-27-15-28-38c-1-22 12-32 16-50 3 12 6 19 13 25 3-15 1-25-1-37z" fill="#ff9a3d"/>
      <path d="M100 89c5 17 17 19 15 38-1 14-8 23-15 23s-14-9-15-23c-1-13 6-20 9-30 2 7 4 11 8 15 1-9 0-15-2-23z" fill="#ffd66b"/>
      <path d="M100 130c2 8 7 10 6 18-1 7-3 10-6 10s-5-3-6-10c0-7 4-10 6-18z" fill="#fff3bd"/>
    </g>
    <g fill="#ffb44f" opacity=".8"><circle cx="61" cy="76" r="2"/><circle cx="140" cy="66" r="1.6"/><circle cx="151" cy="102" r="2.2"/><circle cx="48" cy="104" r="1.4"/></g>
  `, `<filter id="${g}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`, '0 0 200 200');
}

export function moonArt() {
  const g = nid();
  return wrap(`
    <circle cx="100" cy="100" r="68" fill="#ffe9b0" opacity=".09"/>
    <circle cx="100" cy="100" r="54" fill="#ffe9b0" opacity=".14"/>
    <path d="M124 38a64 64 0 1 0 0 124 52 52 0 1 1 0-124z" fill="#f6e4bd"/>
    <g fill="#d9c193" opacity=".45"><circle cx="91" cy="75" r="9"/><circle cx="76" cy="114" r="6"/><circle cx="101" cy="139" r="4"/><circle cx="112" cy="98" r="7"/></g>
    <g filter="url(#${g})" fill="#fff6d6"><circle cx="158" cy="52" r="2.4"/><circle cx="169" cy="78" r="1.6"/><circle cx="43" cy="48" r="2"/><circle cx="35" cy="88" r="1.4"/></g>
  `, `<filter id="${g}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`, '0 0 200 200');
}

export const ICONS = {
  sword: '<path d="M14.5 3.5 20 3l-.5 5.5L9 19l-4-4z"/><path d="m5 15-2 6 6-2M13 6l5 5"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2.5-7 1 2 1.5 3 2.5 4 .5-2 0-4 0-7z"/><path d="M12 13c1 2 2 2.5 2 4a2 2 0 0 1-4 0c0-1.5 1-2 2-4z"/>',
  drop: '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/><path d="M9 14a3 3 0 0 0 3 3"/>',
  leaf: '<path d="M20 4C10 4 4 9 4 16c0 2 1 4 2 5 0-8 5-12 14-17z"/><path d="M6 20c2-5 6-9 11-11"/>',
  bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
  rock: '<path d="m12 3 8 5 1 8-6 5-8-2-4-7z"/><path d="m4 12 8-1 9 5M12 11l-1-8M12 11l7-3"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  moon: '<path d="M20 15A9 9 0 0 1 9 4a8 8 0 1 0 11 11z"/><path d="M17 4v3m0 0v3m0-3h3m-3 0h-3"/>',
  fang: '<path d="M5 5c4 1 6 4 7 9 1-5 3-8 7-9-1 7-3 12-7 14-4-2-6-7-7-14z"/><path d="M9 10c2 1 4 1 6 0"/>',
  heart: '<path d="M12 20S3 14 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14 12 20 12 20z"/>',
  snow: '<path d="M12 2v20M3 7l18 10M21 7 3 17"/><path d="m9 4 3 3 3-3M9 20l3-3 3 3"/>',
  skull: '<path d="M12 3a8 8 0 0 0-8 8c0 3 1 4 2 5v4h12v-4c1-1 2-2 2-5a8 8 0 0 0-8-8z"/><circle cx="9" cy="11" r="1.6"/><circle cx="15" cy="11" r="1.6"/><path d="M9 17v3m3-3v3m3-3v3"/>',
  wind: '<path d="M3 8h12a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h9a3 3 0 1 1-3 3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  star: '<path d="m12 2 3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
  book: '<path d="M4 4h7a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H4z"/><path d="M20 4h-3a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h4z"/>',
  orb: '<circle cx="12" cy="12" r="8"/><path d="M6 10a7 7 0 0 1 5-4M18 14a7 7 0 0 1-5 4"/><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/>',
  feather: '<path d="M20 4c-8 0-13 5-13 12l-3 4"/><path d="M8 15h6M10 11h5M12 7h4"/><path d="M19 5c-2 5-5 8-10 10"/>',
  mushroom: '<path d="M3 12c0-5 4-8 9-8s9 3 9 8c-6 2-12 2-18 0z"/><path d="M9 12v6a3 3 0 0 0 6 0v-6"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="15" cy="7" r="1.2" fill="currentColor"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-1-1-5-1-5 1s5 1 5 3-4 2-5 1"/><path d="M12 6v12"/>',
  campfire: '<path d="M12 3c1 4 5 6 5 10a5 5 0 0 1-10 0c0-3 2-5 3-8 0 2 1 3 2 4z"/><path d="m4 21 16-5M4 16l16 5"/>',
  crown: '<path d="m3 8 4 3 5-6 5 6 4-3-2 11H5z"/><path d="M6 16h12"/>',
  chest: '<path d="M3 9h18v11H3z"/><path d="M3 9a9 9 0 0 1 18 0"/><path d="M3 13h18"/><path d="M10 13h4v4h-4z"/>',
  deck: '<rect x="4" y="6" width="10" height="15" rx="1.5" transform="rotate(-8 4 6)"/><rect x="9" y="4" width="10" height="15" rx="1.5"/><path d="M12 8h4M12 11h4"/>',
  paw: '<circle cx="7" cy="9" r="2"/><circle cx="12" cy="7" r="2"/><circle cx="17" cy="9" r="2"/><path d="M6 15c0-3 3-5 6-5s6 2 6 5-3 5-6 5-6-2-6-5z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  swirl: '<path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M20 4v6h-6"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M9 12h6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/>',
  scroll: '<path d="M6 3h12v16a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2z"/><path d="M6 3a2 2 0 0 0-2 2v2h4M10 8h6M10 12h6M10 16h4"/>',
  arrowUp: '<path d="M12 20V4m0 0-6 6m6-6 6 6"/>',
  arrowDown: '<path d="M12 4v16m0 0 6-6m-6 6-6-6"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>',
  play: '<path d="M7 4v16l13-8z"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/>',
  hourglass: '<path d="M6 3h12M6 21h12M7 3v4l5 5-5 5v4m10-18v4l-5 5 5 5v4"/>',
  spark: '<path d="m12 2 2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/>',
  pawprint: '<circle cx="7" cy="8" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="17" cy="8" r="2"/><path d="M6 15c0-3 3-5 6-5s6 2 6 5-3 5-6 5-6-2-6-5z"/>',
};

export function icon(name, cls = '') {
  const path = ICONS[name] || ICONS.star;
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}
