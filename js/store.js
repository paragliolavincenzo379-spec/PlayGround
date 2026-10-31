import {
  CARDS, CHARMS, REWARD_POOL, CARD_RARITY_WEIGHTS, MAP_TYPES, SPECIES, NORMAL_SPECIES,
} from './data.js';

// ---------------------------------------------------------------------------
// Global runtime
// ---------------------------------------------------------------------------

export const G = {
  state: null,
  rng: makeRng(1),
  meta: null,
  ui: {
    modal: null,
    modalData: null,
    deckMode: 'view',
    deckContext: null,
    busy: false,
    catchAnim: null,
    hintDismissed: false,
  },
  view: {
    render: () => {},
    toast: () => {},
    playEvents: async () => {},
    castCard: () => {},
  },
};

const SAVE_KEY = 'wildbound.run.v1';
const META_KEY = 'wildbound.meta.v1';

export const $ = (sel, root = document) => root.querySelector(sel);
export const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export const wait = ms => new Promise(r => setTimeout(r, ms));
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------------------------------------------------------------------------
// RNG
// ---------------------------------------------------------------------------

export function makeRng(seed) {
  let a = seed >>> 0;
  return {
    get state() { return a >>> 0; },
    set state(v) { a = v >>> 0; },
    next() {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    int(n) { return Math.floor(this.next() * n); },
    range(lo, hi) { return lo + Math.floor(this.next() * (hi - lo + 1)); },
    pick(arr) { return arr[Math.floor(this.next() * arr.length)]; },
    shuffle(arr) {
      const a2 = [...arr];
      for (let i = a2.length - 1; i > 0; i--) {
        const j = Math.floor(this.next() * (i + 1));
        [a2[i], a2[j]] = [a2[j], a2[i]];
      }
      return a2;
    },
  };
}

// ---------------------------------------------------------------------------
// Meta progression (persists across expeditions)
// ---------------------------------------------------------------------------

function defaultMeta() {
  return { caught: {}, runs: 0, wins: 0, bestFloor: 0, totalCatches: 0, seed: null };
}

export function loadMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) {
      const m = JSON.parse(raw);
      return { ...defaultMeta(), ...m, caught: m.caught || {} };
    }
  } catch {}
  return defaultMeta();
}

export function saveMeta() {
  try { localStorage.setItem(META_KEY, JSON.stringify(G.meta)); } catch {}
}

G.meta = loadMeta();

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

export function makeCard(id, upgraded = false) {
  const s = G.state;
  const uid = s ? `c${s.nextUid++}` : `x${Math.random().toString(36).slice(2)}`;
  return { uid, id, upgraded: !!upgraded };
}

export function cardData(card) {
  return CARDS[card.id] || CARDS.tackle;
}

export function cardName(card) {
  const d = cardData(card);
  return d.name + (card.upgraded ? '+' : '');
}

export function cardText(card) {
  const d = cardData(card);
  try { return d.text(card.upgraded); } catch { return ''; }
}

export function cardCost(card, { discount = true } = {}) {
  const d = cardData(card);
  let cost = d.cost;
  const c = G.state?.combat;
  if (discount && c && hasCharm('crystal_sigil') && !c.crystalUsed && G.state?.screen === 'combat') {
    cost = Math.max(0, cost - 1);
  }
  return cost;
}

export function addCardToDeck(card) {
  G.state.deck.push(card);
}

export function starterDeck(s) {
  const ids = ['tackle', 'tackle', 'tackle', 'tackle', 'brace', 'brace', 'brace', 'brace', 'kindle', 'study'];
  return ids.map(id => ({ uid: `c${s.nextUid++}`, id, upgraded: false }));
}

// ---------------------------------------------------------------------------
// Charms
// ---------------------------------------------------------------------------

export function hasCharm(id) {
  return !!G.state?.charms.includes(id);
}

export function unownedCharms() {
  if (!G.state) return Object.keys(CHARMS);
  return Object.keys(CHARMS).filter(id => !G.state.charms.includes(id));
}

export function acquireCharm(id) {
  const s = G.state;
  if (!s || s.charms.includes(id)) return false;
  s.charms.push(id);
  if (id === 'stone_sigil') {
    s.player.maxHp += 15;
    s.player.hp += 15;
  }
  return true;
}

export function charmInfo(id) {
  return CHARMS[id] || null;
}

// ---------------------------------------------------------------------------
// Catch + map helpers
// ---------------------------------------------------------------------------

export function catchThreshold(enemy = G.state?.combat?.enemy) {
  if (!enemy) return 0.3;
  let t = enemy.tier === 'elite' ? 0.22 : enemy.tier === 'boss' ? 0.12 : 0.3;
  if (hasCharm('shiny_sigil')) t += 0.15;
  return Math.min(t, 0.65);
}

export function isWeakened(enemy = G.state?.combat?.enemy) {
  if (!enemy) return false;
  return enemy.hp / enemy.maxHp <= catchThreshold(enemy);
}

export function canCatch() {
  const s = G.state;
  if (!s || s.screen !== 'combat' || !s.combat || s.combat.result) return false;
  const c = s.combat;
  return c.enemy.hp > 0 && isWeakened(c.enemy) && c.energy >= 1;
}

export function nodeKey(row, col) { return `${row}-${col}`; }

export function availableNodes() {
  const s = G.state;
  if (!s) return [];
  if (!s.map.visited.length) return s.map.rows[0].map((_, c) => nodeKey(0, c));
  const [r, c] = s.map.visited[s.map.visited.length - 1].split('-').map(Number);
  const node = s.map.rows[r]?.[c];
  if (!node) return [];
  const nextRow = s.map.rows[r + 1] || [];
  const keys = (node.edges || [])
    .filter(col => nextRow[col])
    .map(col => nodeKey(r + 1, col));
  if (keys.length) return keys;
  // Safety net for old saves or malformed edges (notably the single boss row).
  return nextRow.map((_, col) => nodeKey(r + 1, col));
}

export function isNodeVisited(row, col) {
  return G.state?.map.visited.includes(nodeKey(row, col));
}

export function floorReached() {
  const s = G.state;
  if (!s) return 1;
  return clamp(s.map.visited.length + 1, 1, 9);
}

export function genMap() {
  const rows = [];
  for (let r = 0; r < 8; r++) {
    const types = G.rng.shuffle([...MAP_TYPES[r]]);
    rows.push(types.map((type, col) => ({ row: r, col, type, edges: [] })));
  }
  rows.push([{ row: 8, col: 0, type: 'boss', edges: [] }]);

  for (let r = 0; r < 7; r++) {
    const next = rows[r + 1];
    for (const node of rows[r]) {
      const cols = new Set([node.col]);
      if (G.rng.next() < 0.72) {
        const dir = node.col === 0 ? 1 : node.col === 2 ? -1 : (G.rng.next() < 0.5 ? -1 : 1);
        cols.add(clamp(node.col + dir, 0, 2));
      }
      if (G.rng.next() < 0.22) {
        const far = node.col === 1 ? (G.rng.next() < 0.5 ? 0 : 2) : (node.col === 0 ? 2 : 0);
        cols.add(far);
      }
      node.edges = [...cols].filter(c => next[c]).sort();
    }
  }
  // make sure every node is reachable
  for (let r = 1; r < 8; r++) {
    for (const node of rows[r]) {
      if (!rows[r - 1].some(p => p.edges.includes(node.col))) {
        rows[r - 1][node.col].edges.push(node.col);
        rows[r - 1][node.col].edges.sort();
      }
    }
  }
  rows[7].forEach(n => { n.edges = [0]; });
  return { rows, visited: [], active: null };
}

// ---------------------------------------------------------------------------
// Fresh state
// ---------------------------------------------------------------------------

export function freshState(seed) {
  G.rng = makeRng(seed);
  const s = {
    v: 1,
    seed,
    nextUid: 1,
    screen: 'prologue',
    startedAt: Date.now(),
    player: { name: 'Warden', hp: 72, maxHp: 72, gold: 80 },
    deck: [],
    charms: [],
    caught: {},
    stats: { battles: 0, wins: 0, catches: 0, kills: 0, turns: 0, cardsPlayed: 0, goldEarned: 0 },
    map: null,
    combat: null,
    pending: null,
    shop: null,
    rest: null,
    lastSpecies: null,
    lastEnemy: null,
    ended: null,
  };
  s.deck = starterDeck(s);
  s.map = genMap();
  return s;
}

// ---------------------------------------------------------------------------
// Save / load
// ---------------------------------------------------------------------------

export function hasSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return data && data.state && typeof data.state.screen === 'string';
  } catch { return false; }
}

export function saveGame() {
  const s = G.state;
  if (!s) return;
  if (['prologue', 'map', 'combat', 'reward', 'catch', 'glade', 'catchGlade', 'charm', 'shop', 'rest'].includes(s.screen)) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 1, state: s, rngState: G.rng.state }));
    } catch {}
  }
}

export function loadSavedGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data?.state?.player || !data.state.map) return false;
    G.state = data.state;
    G.rng = makeRng(data.rngState || data.state.seed || 1);
    G.ui.modal = null;
    G.ui.modalData = null;
    G.ui.deckMode = 'view';
    G.ui.busy = false;
    G.ui.catchAnim = null;
    G.ui.hintDismissed = false;
    if (!['prologue', 'map', 'combat', 'reward', 'catch', 'glade', 'catchGlade', 'charm', 'shop', 'rest'].includes(G.state.screen)) {
      G.state.screen = 'map';
    }
    return true;
  } catch { return false; }
}

export function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch {}
}

// ---------------------------------------------------------------------------
// Rewards
// ---------------------------------------------------------------------------

function weightedRarity(weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let roll = G.rng.next() * total;
  for (const [k, v] of Object.entries(weights)) {
    roll -= v;
    if (roll <= 0) return k;
  }
  return 'common';
}

export function rollCardOffer(n, mode = 'normal', exclude = []) {
  const weights = CARD_RARITY_WEIGHTS[mode] || CARD_RARITY_WEIGHTS.normal;
  const used = new Set(exclude);
  const out = [];
  for (let i = 0; i < n; i++) {
    let rarity = weightedRarity(weights);
    let pool = REWARD_POOL.filter(c => c.rarity === rarity && !used.has(c.id));
    if (!pool.length) pool = REWARD_POOL.filter(c => !used.has(c.id));
    if (!pool.length) break;
    const d = G.rng.pick(pool);
    used.add(d.id);
    out.push(makeCard(d.id));
  }
  return out;
}

export function randomSignature(speciesId) {
  const sp = SPECIES[speciesId];
  return makeCard(sp.sig);
}

export function recordCatch(speciesId) {
  const s = G.state;
  const sp = SPECIES[speciesId];
  const isNew = !s.caught[speciesId];
  s.caught[speciesId] = (s.caught[speciesId] || 0) + 1;
  s.stats.catches++;
  G.meta.caught[speciesId] = (G.meta.caught[speciesId] || 0) + 1;
  G.meta.totalCatches = (G.meta.totalCatches || 0) + 1;
  if (isNew) {
    s.player.maxHp += 4;
    s.player.hp = Math.min(s.player.maxHp, s.player.hp + 4);
  } else {
    s.player.gold += 15;
    s.stats.goldEarned += 15;
  }
  saveMeta();
  return isNew;
}

export function caughtCount() {
  return G.meta ? Object.keys(G.meta.caught).length : 0;
}

export function runCaughtCount() {
  return G.state ? Object.keys(G.state.caught).length : 0;
}
