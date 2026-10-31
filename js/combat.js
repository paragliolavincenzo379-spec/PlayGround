import { CARDS, SPECIES, STATUS_INFO } from './data.js';
import {
  G, saveGame, cardCost, cardName, hasCharm, isWeakened, catchThreshold, wait, clamp,
} from './store.js';
import { sound } from './audio.js';

const S = () => G.state;
const C = () => S()?.combat;
const E = () => C()?.enemy;

function log(text) {
  const c = C();
  if (!c) return;
  c.log.unshift(text);
  c.log = c.log.slice(0, 4);
}

// ---------------------------------------------------------------------------
// Enemy construction
// ---------------------------------------------------------------------------

function scaledMove(move, scale) {
  const out = { ...move };
  if (out.dmg) out.dmg = Math.max(1, Math.round(out.dmg * scale));
  if (out.block) out.block = Math.max(1, Math.round(out.block * scale));
  if (out.heal) out.heal = Math.max(1, Math.round(out.heal * scale));
  return out;
}

function makeEnemy(speciesId, mode, row) {
  const sp = SPECIES[speciesId];
  let hp = sp.hp;
  if (mode === 'normal') hp = Math.round(hp * (1 + row * 0.062));
  if (mode === 'elite') hp = Math.round(hp * (1 + row * 0.038));
  const dmgScale = mode === 'boss' ? 1.08 : 1 + row * 0.052;
  const moves = sp.moves.map(m => scaledMove(m, dmgScale));
  const moves2 = sp.moves2 ? sp.moves2.map(m => scaledMove(m, dmgScale + 0.08)) : null;
  const enemy = {
    speciesId,
    name: sp.name,
    epithet: sp.epithet,
    el: sp.el,
    tier: sp.tier,
    mode,
    hp,
    maxHp: hp,
    block: 0,
    str: 0,
    dex: 0,
    statuses: {},
    fresh: {},
    firstHitUsed: false,
    phase: 1,
    phaseChanged: false,
    trait: sp.trait,
    moves,
    moves2,
    pattern: [...sp.pattern],
    intentIndex: 0,
    intent: null,
    lore: sp.lore,
    sig: sp.sig,
  };
  if (sp.trait.key === 'stonehide') enemy.block = 8;
  enemy.intent = moves[enemy.pattern[0]];
  return enemy;
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

export function startCombat({ speciesId, mode, row }) {
  const s = S();
  s.stats.battles++;
  const enemy = makeEnemy(speciesId, mode, row);
  const drawPile = G.rng.shuffle(s.deck.map(c => ({ ...c })));
  const combat = {
    mode,
    row,
    enemy,
    player: { block: 0, str: 0, dex: 0, statuses: {}, fresh: {} },
    energy: 3,
    baseEnergy: 3,
    hand: [],
    drawPile,
    discard: [],
    exhaust: [],
    turn: 0,
    round: 1,
    crystalUsed: false,
    result: null,
    log: [],
    startHp: s.player.hp,
  };
  s.combat = combat;

  if (hasCharm('ember_sigil')) combat.player.str += 1;
  if (hasCharm('tide_sigil')) combat.player.block += 8;
  if (hasCharm('volt_sigil')) combat.energy += 1;

  combat.turn = 1;
  s.stats.turns++;
  drawCards(5 + (hasCharm('moon_sigil') ? 1 : 0));
  log(mode === 'boss' ? 'Aurelion descends from the light.' : `${enemy.name} blocks the trail.`);
  s.screen = 'combat';
  saveGame();
  G.view.render();
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

export function drawCards(n) {
  const c = C();
  if (!c) return 0;
  let drawn = 0;
  for (let i = 0; i < n; i++) {
    if (c.hand.length >= 10) break;
    if (!c.drawPile.length) {
      if (!c.discard.length) break;
      c.drawPile = G.rng.shuffle(c.discard);
      c.discard = [];
    }
    c.hand.push(c.drawPile.pop());
    drawn++;
  }
  return drawn;
}

// ---------------------------------------------------------------------------
// Damage & status primitives
// ---------------------------------------------------------------------------

function outgoing(base) {
  const c = C();
  let dmg = base + c.player.str;
  if (c.player.statuses.weak > 0) dmg = Math.floor(dmg * 0.75);
  return Math.max(0, dmg);
}

function incoming(base) {
  const c = C();
  let dmg = base + c.enemy.str;
  if (c.enemy.statuses.weak > 0) dmg = Math.floor(dmg * 0.75);
  if (c.player.statuses.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
  return Math.max(0, dmg);
}

export function intentHits(move = E()?.intent) {
  const c = C();
  if (!c || !move || !move.dmg) return [];
  const enemy = c.enemy;
  let times = move.times || 1;
  if (enemy.trait.key === 'gale' && move.kind === 'attack') times++;
  const hits = [];
  for (let i = 0; i < times; i++) {
    let dmg = incoming(move.dmg);
    if (enemy.trait.key === 'overcharge' && !enemy.firstHitUsed && i === 0) dmg += 3;
    hits.push(dmg);
  }
  return hits;
}

export function incomingAttackDamage() {
  return intentHits().reduce((a, b) => a + b, 0);
}

function damageEnemy(base, events, opts = {}) {
  const c = C();
  const enemy = c.enemy;
  let dmg = base + c.player.str;
  if (c.player.statuses.weak > 0) dmg = Math.floor(dmg * 0.75);
  if (enemy.statuses.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
  dmg = Math.max(0, dmg);
  const blocked = Math.min(enemy.block, dmg);
  enemy.block -= blocked;
  const amount = dmg - blocked;
  enemy.hp = Math.max(0, enemy.hp - amount);
  events.push({ t: 'damage', target: 'enemy', amount, blocked, raw: dmg });
  if (amount > 0) log(`${enemy.name} takes ${amount} damage.`);

  if (enemy.hp <= 0 && !c.result) {
    c.result = 'win';
    log(`${enemy.name} is defeated.`);
  }

  // Thorns still bite the attacker.
  if (opts.card && enemy.trait.key === 'bark' && enemy.hp > 0) {
    c.enemy.block = enemy.block;
    damagePlayerDirect(3, events, 'thorns');
  }

  checkPhase(events);
  return amount;
}

function damagePlayerDirect(n, events, reason = 'burn') {
  const c = C();
  const s = S();
  s.player.hp = Math.max(0, s.player.hp - n);
  events.push({ t: 'direct', target: 'player', amount: n, reason });
  if (s.player.hp <= 0 && !c.result) {
    c.result = 'lose';
    log('Your lantern goes dark.');
  }
}

function damagePlayer(base, events) {
  const c = C();
  const s = S();
  const dmg = Math.max(0, base);
  const blocked = Math.min(c.player.block, dmg);
  c.player.block -= blocked;
  const amount = dmg - blocked;
  s.player.hp = Math.max(0, s.player.hp - amount);
  events.push({ t: 'damage', target: 'player', amount, blocked, raw: dmg });
  if (amount > 0) log(`You take ${amount} damage.`);
  if (s.player.hp <= 0 && !c.result) {
    c.result = 'lose';
    log('Your lantern goes dark.');
  }
}

function healPlayer(n, events) {
  const s = S();
  const before = s.player.hp;
  s.player.hp = Math.min(s.player.maxHp, s.player.hp + n);
  const gained = s.player.hp - before;
  if (gained > 0) events.push({ t: 'heal', target: 'player', amount: gained });
  return gained;
}

function addStatus(entity, key, n, side, events) {
  if (!entity || n <= 0) return;
  entity.statuses[key] = (entity.statuses[key] || 0) + n;
  if (key === 'weak' || key === 'vulnerable') entity.fresh[key] = C().round;
  events.push({ t: 'status', target: side, s: key, n });
  const name = STATUS_INFO[key]?.name || key;
  log(`${side === 'enemy' ? E().name : 'You'} ${side === 'enemy' ? 'gains' : 'gains'} ${n} ${name}.`);
}

function checkPhase(events) {
  const c = C();
  const enemy = c.enemy;
  if (enemy.speciesId === 'nocturne' && enemy.phase === 1 && enemy.hp <= enemy.maxHp * 0.5 && enemy.hp > 0) {
    enemy.phase = 2;
    enemy.str += 3;
    events.push({ t: 'phase', text: 'NIGHTFALL', sub: `${enemy.name} gains 3 Strength.` });
    log(`${enemy.name} is swallowed by night.`);
  }
  if (enemy.speciesId === 'aurelion' && enemy.phase === 1 && enemy.hp <= enemy.maxHp * 0.5 && enemy.hp > 0) {
    enemy.phase = 2;
    enemy.phaseChanged = true;
    enemy.str += 4;
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + 12);
    enemy.moves = enemy.moves2;
    enemy.pattern = [...SPECIES.aurelion.pattern2];
    enemy.intentIndex = 0;
    events.push({ t: 'phase', text: 'RADIANT AWAKENING', sub: 'Aurelion heals 12 and gains 4 Strength.' });
    log('The Sunstag sheds its calm.');
  }
}

// ---------------------------------------------------------------------------
// Status ticks
// ---------------------------------------------------------------------------

function tickStart(side, events) {
  const c = C();
  const entity = side === 'enemy' ? c.enemy : c.player;
  const st = entity.statuses;
  if (st.poison > 0) {
    const n = st.poison;
    if (side === 'enemy') {
      entity.hp = Math.max(0, entity.hp - n);
      events.push({ t: 'direct', target: 'enemy', amount: n, reason: 'poison' });
    } else {
      damagePlayerDirect(n, events, 'poison');
    }
    st.poison--;
    if (st.poison <= 0) delete st.poison;
    log(`${side === 'enemy' ? entity.name : 'You'} suffer${side === 'enemy' ? 's' : ''} ${n} Poison.`);
    if (entity.hp <= 0 && side === 'enemy' && !c.result) {
      c.result = 'win';
      log(`${entity.name} succumbs to poison.`);
    }
  }
  if (side === 'enemy') {
    if (entity.trait.key === 'tidecall') healEnemy(entity, 4, events);
    if (entity.trait.key === 'bark') healEnemy(entity, 4, events);
    if (entity.trait.key === 'photosynth') gainEnemyBlock(entity, 5, events);
    if (entity.trait.key === 'bedrock') gainEnemyBlock(entity, 8, events);
  }
}

function tickEnd(side, events) {
  const c = C();
  const entity = side === 'enemy' ? c.enemy : c.player;
  const st = entity.statuses;
  if (st.burn > 0) {
    const n = st.burn;
    if (side === 'enemy') {
      entity.hp = Math.max(0, entity.hp - n);
      events.push({ t: 'direct', target: 'enemy', amount: n, reason: 'burn' });
      if (entity.hp <= 0 && !c.result) {
        c.result = 'win';
        log(`${entity.name} burns away.`);
      }
    } else {
      damagePlayerDirect(n, events, 'burn');
    }
    st.burn--;
    if (st.burn <= 0) delete st.burn;
    log(`${side === 'enemy' ? entity.name : 'You'} take${side === 'enemy' ? 's' : ''} ${n} Burn.`);
  }
  if (st.regen > 0) {
    const n = st.regen;
    if (side === 'enemy') healEnemy(entity, n, events);
    else healPlayer(n, events);
    st.regen--;
    if (st.regen <= 0) delete st.regen;
  }
}

function tickDurations(entity) {
  const c = C();
  for (const key of ['weak', 'vulnerable']) {
    if (!entity.statuses[key]) continue;
    if (entity.fresh[key] === c.round) {
      delete entity.fresh[key];
    } else {
      entity.statuses[key]--;
      if (entity.statuses[key] <= 0) delete entity.statuses[key];
    }
  }
}

function healEnemy(entity, n, events) {
  const before = entity.hp;
  entity.hp = Math.min(entity.maxHp, entity.hp + n);
  const gained = entity.hp - before;
  if (gained > 0) events.push({ t: 'heal', target: 'enemy', amount: gained });
}

function gainEnemyBlock(entity, n, events) {
  const amount = n + (entity.dex || 0);
  entity.block += amount;
  events.push({ t: 'block', target: 'enemy', amount });
}

// ---------------------------------------------------------------------------
// Card resolution
// ---------------------------------------------------------------------------

function effectValue(e, upgraded) {
  return upgraded && Object.prototype.hasOwnProperty.call(e, 'up') ? e.up : e.n;
}

function applyCard(card, events) {
  const c = C();
  const d = CARDS[card.id];
  const u = card.upgraded;
  for (const e of d.effects) {
    if (e.if === 'weakened' && !isWeakened()) continue;
    if (e.if === 'poisoned' && !(c.enemy.statuses.poison > 0)) continue;
    const n = effectValue(e, u);
    switch (e.t) {
      case 'damage': {
        const times = e.times || 1;
        for (let i = 0; i < times; i++) {
          if (c.enemy.hp <= 0) break;
          damageEnemy(n, events, { card: true });
        }
        break;
      }
      case 'block': {
        const amount = Math.max(0, n + c.player.dex);
        c.player.block += amount;
        events.push({ t: 'block', target: 'player', amount });
        log(`You gain ${amount} Block.`);
        break;
      }
      case 'draw': {
        const got = drawCards(n);
        if (got) events.push({ t: 'draw', n: got });
        break;
      }
      case 'energy':
        c.energy += n;
        events.push({ t: 'energy', n });
        log(`You gain ${n} Energy.`);
        break;
      case 'heal': {
        healPlayer(n, events);
        break;
      }
      case 'loseHp':
        damagePlayerDirect(n, events, 'cost');
        break;
      case 'status':
        addStatus(e.to === 'enemy' ? c.enemy : c.player, e.s, n, e.to, events);
        break;
      case 'buff': {
        if (e.s === 'str') c.player.str += n;
        else c.player.dex += n;
        events.push({ t: 'buff', target: 'player', s: e.s, n });
        log(`You gain ${n} ${e.s === 'str' ? 'Strength' : 'Dexterity'}.`);
        break;
      }
      case 'blockFromIntent': {
        const amount = Math.max(0, incomingAttackDamage() + c.player.dex);
        c.player.block += amount;
        events.push({ t: 'block', target: 'player', amount });
        log(`You gain ${amount} Block from the coming blow.`);
        break;
      }
      case 'lastStand': {
        const missing = S().player.maxHp - S().player.hp;
        const dmg = n + Math.floor(missing / 10);
        damageEnemy(dmg, events, { card: true });
        break;
      }
      default:
        break;
    }
  }
}

// ---------------------------------------------------------------------------
// Enemy intent
// ---------------------------------------------------------------------------

function executeIntent(events) {
  const c = C();
  const enemy = c.enemy;
  const move = enemy.intent;
  if (!move) return;

  const times = move.kind === 'attack' ? (move.times || 1) + (enemy.trait.key === 'gale' ? 1 : 0) : 1;
  for (let i = 0; i < times; i++) {
    if (move.dmg && S().player.hp > 0) {
      let raw = incoming(move.dmg);
      if (enemy.trait.key === 'overcharge' && !enemy.firstHitUsed && i === 0) {
        raw += 3;
        enemy.firstHitUsed = true;
      }
      damagePlayer(raw, events);
    }
  }

  if (move.dmg && enemy.trait.key && S().player.hp > 0) {
    const hitStatus = { cinder: 'burn', hex: 'weak', chill: 'weak', venom: 'poison' }[enemy.trait.key];
    if (hitStatus) addStatus(c.player, hitStatus, 1, 'player', events);
  }

  if (move.status) addStatus(c.player, move.status, move.statusN || 1, 'player', events);
  if (move.status2) addStatus(c.player, move.status2, move.status2N || 1, 'player', events);

  if (move.block) {
    gainEnemyBlock(enemy, move.block, events);
    if (enemy.trait.key === 'tailwind') {
      enemy.dex += 2;
      events.push({ t: 'buff', target: 'enemy', s: 'dex', n: 2 });
    }
  }
  if (move.heal) healEnemy(enemy, move.heal, events);
  if (move.buff) {
    if (move.buff === 'str') enemy.str += move.buffN;
    else enemy.dex += move.buffN;
    events.push({ t: 'buff', target: 'enemy', s: move.buff, n: move.buffN });
  }
  log(`${enemy.name} uses ${move.name}.`);
}

function advanceIntent() {
  const c = C();
  const enemy = c.enemy;
  if (enemy.phaseChanged) {
    enemy.phaseChanged = false;
    enemy.intentIndex = 0;
  } else {
    enemy.intentIndex++;
  }
  const idx = enemy.pattern[enemy.intentIndex % enemy.pattern.length];
  enemy.intent = enemy.moves[idx];
}

export function peekIntent(offset = 1) {
  const c = C();
  if (!c) return null;
  const enemy = c.enemy;
  const idx = enemy.pattern[(enemy.intentIndex + offset) % enemy.pattern.length];
  return enemy.moves[idx] || null;
}

// ---------------------------------------------------------------------------
// End turn
// ---------------------------------------------------------------------------

async function settle() {
  const c = C();
  if (!c?.result || c.result === 'caught') return false;
  if (c.result === 'win') {
    await wait(520);
    G.ui.busy = false;
    G.view.onWin(c.mode);
    return true;
  }
  if (c.result === 'lose') {
    await wait(620);
    G.ui.busy = false;
    G.view.onLose();
    return true;
  }
  return false;
}

export async function endPlayerTurn() {
  const c = C();
  if (!c || G.state.screen !== 'combat' || G.ui.busy || c.result) return;
  G.ui.busy = true;
  sound.endTurn();

  let events = [];
  tickEnd('player', events);
  if (events.length) {
    G.view.render();
    await G.view.playEvents(events);
    if (await settle()) return;
  }

  c.discard.push(...c.hand);
  c.hand = [];
  c.enemy.block = 0;
  c.enemy.firstHitUsed = false;

  events = [];
  tickStart('enemy', events);
  if (events.length) {
    G.view.render();
    await G.view.playEvents(events);
    if (await settle()) return;
  }

  const move = c.enemy.intent;
  G.view.banner(`${c.enemy.name.toUpperCase()} — ${move.name.toUpperCase()}`, intentSummary(move), 'enemy');
  await wait(480);
  events = [];
  executeIntent(events);
  G.view.render();
  await G.view.playEvents(events);
  if (await settle()) return;

  events = [];
  tickEnd('enemy', events);
  if (events.length) {
    G.view.render();
    await G.view.playEvents(events);
    if (await settle()) return;
  }
  tickDurations(c.enemy);
  tickDurations(c.player);

  advanceIntent();
  c.round++;
  c.turn++;
  c.player.block = 0;
  c.energy = c.baseEnergy;
  c.crystalUsed = false;
  S().stats.turns++;

  events = [];
  tickStart('player', events);
  if (events.length) {
    G.view.render();
    await G.view.playEvents(events);
    if (await settle()) return;
  }

  drawCards(5 + (hasCharm('moon_sigil') ? 1 : 0));
  G.view.render();
  saveGame();
  G.ui.busy = false;
}

// ---------------------------------------------------------------------------
// Player cards
// ---------------------------------------------------------------------------

export async function playCard(uid, el) {
  const s = S();
  const c = C();
  if (!s || !c || G.ui.busy || s.screen !== 'combat' || c.result) return;
  const idx = c.hand.findIndex(card => card.uid === uid);
  if (idx < 0) return;
  const card = c.hand[idx];
  const cost = cardCost(card);
  if (c.energy < cost) {
    sound.error();
    G.view.toast('Not enough Energy.', 'bad');
    return;
  }
  G.ui.busy = true;
  sound.card();
  if (el) G.view.castCard(el);

  c.hand.splice(idx, 1);
  c.energy -= cost;
  if (hasCharm('crystal_sigil') && !c.crystalUsed) c.crystalUsed = true;
  s.stats.cardsPlayed++;

  const events = [];
  applyCard(card, events);
  if (CARDS[card.id]?.exhaust) c.exhaust.push(card);
  else c.discard.push(card);
  log(`You play ${cardName(card)}.`);

  G.view.render();
  await G.view.playEvents(events);

  if (!(await settle())) {
    saveGame();
    G.ui.busy = false;
    G.view.render();
  }
}

// ---------------------------------------------------------------------------
// Catching
// ---------------------------------------------------------------------------

export async function attemptCatch() {
  const s = S();
  const c = C();
  if (!s || !c || s.screen !== 'combat' || G.ui.busy || c.result) return;
  if (!isWeakened(c.enemy) || c.energy < 1) {
    sound.error();
    G.view.toast('The bond is not open yet.', 'bad');
    return;
  }
  G.ui.busy = true;
  c.energy -= 1;
  c.result = 'caught';
  G.ui.catchAnim = { speciesId: c.enemy.speciesId, boss: c.enemy.tier === 'boss' };
  sound.catch();
  G.view.render();
  await wait(1750);
  G.ui.catchAnim = null;
  G.ui.busy = false;
  G.view.onCatch(c.enemy);
}

// ---------------------------------------------------------------------------
// Small helpers shared with UI
// ---------------------------------------------------------------------------

export function intentSummary(move) {
  if (!move) return '';
  const parts = [];
  if (move.dmg) {
    const hits = intentHits(move);
    if (hits.length > 1) parts.push(`Attack ${hits[0]} ×${hits.length}`);
    else parts.push(`Attack ${hits[0] ?? move.dmg}`);
  }
  if (move.block) parts.push(`Block ${move.block}`);
  if (move.heal) parts.push(`Heal ${move.heal}`);
  if (move.buff) parts.push(`+${move.buffN} ${move.buff === 'str' ? 'Strength' : 'Dexterity'}`);
  if (move.status) parts.push(`${STATUS_INFO[move.status]?.name || move.status} ${move.statusN || 1}`);
  if (move.status2) parts.push(`${STATUS_INFO[move.status2]?.name || move.status2} ${move.status2N || 1}`);
  return parts.join(' · ');
}

export function intentKind(move) {
  if (!move) return 'neutral';
  if (move.dmg) return 'attack';
  if (move.block) return 'defend';
  if (move.buff) return 'buff';
  if (move.status) return 'debuff';
  return 'neutral';
}

export function catchReady() {
  const c = C();
  return !!c && !c.result && isWeakened(c.enemy);
}
