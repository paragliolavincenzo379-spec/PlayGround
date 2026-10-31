import { G, availableNodes, nodeKey } from './store.js';
import { titleScreen, prologueScreen, mapScreen, combatScreen, topbarHTML } from './screens.js';
import {
  rewardScreen, catchScreen, catchGladeScreen, charmScreen, shopScreen, restScreen,
  gladeScreen, victoryScreen, gameoverScreen,
} from './screens2.js';
import { modalHTML } from './modals.js';
import { creatureArt } from './sprites.js';

export function render() {
  const screen = G.state?.screen || 'title';
  document.body.dataset.screen = screen;
  document.title = screen === 'title'
    ? 'Wildbound — Pact of the Ember Road'
    : `Wildbound — ${screen[0].toUpperCase()}${screen.slice(1)}`;

  let content = '';
  if (screen === 'title') content = titleScreen();
  else if (screen === 'prologue') content = prologueScreen();
  else if (screen === 'victory') content = victoryScreen();
  else if (screen === 'gameover') content = gameoverScreen();
  else {
    let inner = '';
    switch (screen) {
      case 'map': inner = mapScreen(); break;
      case 'combat': inner = combatScreen(); break;
      case 'reward': inner = rewardScreen(); break;
      case 'catch': inner = catchScreen(); break;
      case 'catchGlade': inner = catchGladeScreen(); break;
      case 'charm': inner = charmScreen(); break;
      case 'shop': inner = shopScreen(); break;
      case 'rest': inner = restScreen(); break;
      case 'glade': inner = gladeScreen(); break;
      default: inner = mapScreen(); break;
    }
    content = `<div class="app-shell">${topbarHTML()}<main class="screen">${inner}</main></div>`;
  }

  const app = document.getElementById('app');
  app.innerHTML = content + modalHTML() + catchOverlay();

  requestAnimationFrame(() => {
    if (screen === 'map') {
      drawMapEdges();
      scrollMap();
    }
  });
}

function catchOverlay() {
  const c = G.ui.catchAnim;
  if (!c) return '';
  return `<div class="catch-overlay ${c.boss ? 'boss' : ''}" aria-live="assertive">
    <div class="catch-overlay-dim"></div>
    <div class="catch-overlay-kin">${creatureArt(c.speciesId)}</div>
    <div class="thrown-orb"><span></span></div>
    <div class="catch-burst"></div>
    <div class="catch-word"><span>BOND FORMED</span><i>the wild heart opens</i></div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Map edge rendering
// ---------------------------------------------------------------------------

export function drawMapEdges() {
  const canvas = document.getElementById('mapCanvas');
  const svg = document.getElementById('mapEdges');
  if (!canvas || !svg) return;
  const s = G.state;
  if (!s) return;
  const cr = canvas.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`);
  svg.setAttribute('width', canvas.clientWidth);
  svg.setAttribute('height', canvas.clientHeight);

  const nodes = new Map();
  canvas.querySelectorAll('.map-node').forEach(el => {
    nodes.set(nodeKey(Number(el.dataset.row), Number(el.dataset.col)), el);
  });
  const visited = new Set(s.map.visited);
  const avail = new Set(availableNodes());
  const last = s.map.visited[s.map.visited.length - 1] || null;

  let paths = '';
  const seen = new Set();
  for (const [key, el] of nodes) {
    const [r, c] = key.split('-').map(Number);
    const node = s.map.rows[r]?.[c];
    if (!node) continue;
    for (const nc of node.edges || []) {
      const t = nodes.get(nodeKey(r + 1, nc));
      if (!t) continue;
      const a = el.getBoundingClientRect();
      const b = t.getBoundingClientRect();
      const x1 = a.left - cr.left + a.width / 2;
      const y1 = a.top - cr.top + a.height - 10;
      const x2 = b.left - cr.left + b.width / 2;
      const y2 = b.top - cr.top + 10;
      const midY = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
      const targetKey = nodeKey(r + 1, nc);
      let cls = 'edge';
      if (visited.has(key) && visited.has(targetKey)) cls += ' walked';
      else if (key === last && avail.has(targetKey)) cls += ' next';
      const id = `${key}-${targetKey}`;
      if (seen.has(id)) continue;
      seen.add(id);
      paths += `<path class="${cls}" d="${d}" />`;
    }
  }
  svg.innerHTML = paths;
}

function scrollMap() {
  const scroll = document.getElementById('mapScroll');
  if (!scroll) return;
  const rows = [...scroll.querySelectorAll('.map-row')];
  if (!rows.length) return;
  const target = rows.find(r => r.classList.contains('has-available')) || rows[0];
  if (!target) return;
  const top = target.offsetTop - scroll.clientHeight / 2 + target.offsetHeight / 2;
  scroll.scrollTop = Math.max(0, top);
}

// Keep edges aligned when the viewport changes.
let resizeTimer = null;
window.addEventListener('resize', () => {
  if (G.state?.screen !== 'map') return;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { drawMapEdges(); }, 120);
});
