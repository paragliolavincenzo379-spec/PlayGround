import { CARDS, CHARMS, SPECIES, NORMAL_SPECIES, ELITE_SPECIES, NODE_INFO } from './data.js';
import {
  G, freshState, saveGame, clearSave, saveMeta, makeCard, rollCardOffer, recordCatch,
  unownedCharms, acquireCharm, hasCharm, availableNodes, nodeKey, floorReached, clamp,
} from './store.js';
import { startCombat } from './combat.js';
import { sound } from './audio.js';

const S = () => G.state;

// ---------------------------------------------------------------------------
// Run lifecycle
// ---------------------------------------------------------------------------

export function startNewRun() {
  const seed = (Math.random() * 0xffffffff) >>> 0;
  G.state = freshState(seed);
  G.ui.modal = null;
  G.ui.modalData = null;
  G.ui.deckMode = 'view';
  G.ui.busy = false;
  G.ui.catchAnim = null;
  G.ui.hintDismissed = false;
  saveGame();
  sound.map();
  G.view.render();
}

export function beginExpedition() {
  const s = S();
  if (!s || s.screen !== 'prologue') return;
  s.screen = 'map';
  saveGame();
  sound.map();
  G.view.render();
}

export function abandonRun() {
  clearSave();
  G.state = null;
  G.ui.modal = null;
  G.ui.modalData = null;
  G.ui.busy = false;
  G.ui.catchAnim = null;
  G.view.render();
}

export function saveAndTitle() {
  saveGame();
  G.state = null;
  G.ui.modal = null;
  G.ui.modalData = null;
  G.ui.busy = false;
  G.ui.catchAnim = null;
  G.view.render();
}

export function currentFloor() {
  return floorReached();
}

// ---------------------------------------------------------------------------
// Map
// ---------------------------------------------------------------------------

export function enterNode(row, col) {
  const s = S();
  if (!s || G.ui.busy) return;
  if (!availableNodes().includes(nodeKey(row, col))) return;
  const node = s.map.rows[row]?.[col];
  if (!node) return;
  s.map.active = { row, col };
  if (node.type === 'battle') {
    const pool = NORMAL_SPECIES.filter(id => id !== s.lastSpecies);
    const speciesId = G.rng.pick(pool.length ? pool : NORMAL_SPECIES);
    s.lastSpecies = speciesId;
    startCombat({ speciesId, mode: 'normal', row });
  } else if (node.type === 'elite') {
    const speciesId = G.rng.pick(ELITE_SPECIES);
    s.lastSpecies = speciesId;
    startCombat({ speciesId, mode: 'elite', row });
  } else if (node.type === 'boss') {
    s.lastSpecies = 'aurelion';
    startCombat({ speciesId: 'aurelion', mode: 'boss', row });
  } else if (node.type === 'catch') {
    startGlade();
  } else if (node.type === 'shop') {
    startShop();
  } else if (node.type === 'rest') {
    startRest();
  }
}

export function completeNode() {
  const s = S();
  if (!s) return;
  const active = s.map.active;
  if (active) {
    const key = nodeKey(active.row, active.col);
    if (!s.map.visited.includes(key)) s.map.visited.push(key);
  }
  s.map.active = null;
  s.combat = null;
  s.pending = null;
  s.shop = null;
  s.rest = null;
  s.screen = 'map';
  G.meta.bestFloor = Math.max(G.meta.bestFloor || 0, s.map.visited.length + 1);
  saveMeta();
  saveGame();
  sound.map();
  G.view.render();
}

// ---------------------------------------------------------------------------
// Combat outcomes
// ---------------------------------------------------------------------------

export function handleCombatWin(mode) {
  const s = S();
  const c = s?.combat;
  if (!s || !c) return;
  const enemy = c.enemy;
  s.stats.wins++;
  s.stats.kills++;
  s.lastEnemy = enemy.speciesId;

  if (mode === 'boss') {
    finishRun(true, false);
    return;
  }

  const row = c.row || 0;
  let gold = mode === 'elite' ? 48 + row * 2 + G.rng.range(0, 7) : 22 + row * 2 + G.rng.range(0, 7);
  if (hasCharm('hunter_sigil')) gold += 15;
  s.player.gold += gold;
  s.stats.goldEarned += gold;
  if (hasCharm('verdant_sigil')) s.player.hp = Math.min(s.player.maxHp, s.player.hp + 4);

  s.combat = null;
  s.pending = {
    kind: 'reward',
    mode,
    speciesId: enemy.speciesId,
    enemyName: enemy.name,
    gold,
    cards: rollCardOffer(3, mode === 'elite' ? 'elite' : 'normal'),
    next: mode === 'elite' ? 'charm' : null,
  };
  s.screen = 'reward';
  saveGame();
  sound.coin();
  G.view.render();
}

export function handleCombatLose() {
  finishRun(false, false);
}

export function handleCatch(enemy) {
  const s = S();
  if (!s || !enemy) return;
  const sp = SPECIES[enemy.speciesId];
  const isNew = recordCatch(enemy.speciesId);
  s.player.hp = Math.min(s.player.maxHp, s.player.hp + 8);
  s.player.gold += 10;
  s.stats.goldEarned += 10;
  s.lastEnemy = enemy.speciesId;

  if (enemy.tier === 'boss') {
    s.deck.push(makeCard(sp.sig));
    finishRun(true, true);
    return;
  }

  const cards = [makeCard(sp.sig), ...rollCardOffer(2, 'catch')];
  s.combat = null;
  s.pending = {
    kind: 'catch',
    speciesId: enemy.speciesId,
    isNew,
    cards,
    gold: 10,
  };
  s.screen = 'catch';
  saveGame();
  sound.coin();
  G.view.render();
}

// ---------------------------------------------------------------------------
// Rewards
// ---------------------------------------------------------------------------

export function chooseReward(index) {
  const s = S();
  const p = s?.pending;
  if (!p || p.kind !== 'reward') return;
  const card = p.cards[index];
  if (card) {
    s.deck.push(card);
    sound.upgrade();
    G.view.toast(`${CARDS[card.id].name} added to your deck.`, 'good');
  }
  afterCardReward();
}

export function skipReward() {
  afterCardReward();
}

function afterCardReward() {
  const s = S();
  const p = s.pending;
  if (p.next === 'charm') {
    showCharmReward('elite');
  } else {
    completeNode();
  }
}

export function showCharmReward(source) {
  const s = S();
  const pool = G.rng.shuffle(unownedCharms()).slice(0, 3);
  if (!pool.length) {
    s.player.gold += 50;
    s.stats.goldEarned += 50;
    G.view.toast('No new sigils remain. +50 gold.', 'good');
    completeNode();
    return;
  }
  s.pending = { kind: 'charm', source, charms: pool };
  s.screen = 'charm';
  saveGame();
  sound.buff();
  G.view.render();
}

export function chooseCharm(id) {
  const s = S();
  if (!s || s.screen !== 'charm') return;
  const charm = CHARMS[id];
  if (!charm) return;
  acquireCharm(id);
  sound.upgrade();
  G.view.toast(`${charm.name} bonded.`, 'good');
  completeNode();
}

export function skipCharm() {
  const s = S();
  if (!s || s.screen !== 'charm') return;
  s.player.gold += 20;
  s.stats.goldEarned += 20;
  completeNode();
}

// ---------------------------------------------------------------------------
// Catch rewards
// ---------------------------------------------------------------------------

export function chooseCatchCard(index) {
  const s = S();
  const p = s?.pending;
  if (!p || p.kind !== 'catch') return;
  const card = p.cards[index];
  if (card) {
    s.deck.push(card);
    sound.upgrade();
    G.view.toast(`${CARDS[card.id].name} added to your deck.`, 'good');
  }
  completeNode();
}

export function skipCatchCard() {
  const s = S();
  if (!s || s.pending?.kind !== 'catch') return;
  s.player.gold += 20;
  s.stats.goldEarned += 20;
  G.view.toast('You travel lighter. +20 gold.', 'good');
  completeNode();
}

// ---------------------------------------------------------------------------
// Bond glade
// ---------------------------------------------------------------------------

function startGlade() {
  const s = S();
  const options = G.rng.shuffle(NORMAL_SPECIES).slice(0, 3);
  s.pending = { kind: 'glade', species: options };
  s.screen = 'glade';
  saveGame();
  sound.map();
  G.view.render();
}

export function chooseGlade(speciesId) {
  const s = S();
  if (!s || s.pending?.kind !== 'glade') return;
  const sp = SPECIES[speciesId];
  const isNew = recordCatch(speciesId);
  s.deck.push(makeCard(sp.sig));
  s.player.hp = Math.min(s.player.maxHp, s.player.hp + 10);
  s.player.gold += 10;
  s.stats.goldEarned += 10;
  s.lastSpecies = speciesId;
  s.pending = { kind: 'gladeCatch', speciesId, isNew, sigId: sp.sig };
  s.screen = 'catchGlade';
  saveGame();
  sound.catch();
  G.view.render();
}

export function leaveGlade() {
  const s = S();
  if (!s || s.pending?.kind !== 'glade') return;
  s.player.gold += 35;
  s.stats.goldEarned += 35;
  G.view.toast('You leave the glade with 35 gold.', 'good');
  completeNode();
}

export function continueGlade() {
  completeNode();
}

// ---------------------------------------------------------------------------
// Shop
// ---------------------------------------------------------------------------

const CARD_BASE_PRICE = { common: 45, uncommon: 68, rare: 96 };

function startShop() {
  const s = S();
  const cards = rollCardOffer(3, 'normal').map(card => {
    const d = CARDS[card.id];
    const upgraded = G.rng.next() < 0.2;
    const base = CARD_BASE_PRICE[d.rarity] || 45;
    const price = Math.round((base + (upgraded ? 25 : 0)) * (0.9 + G.rng.next() * 0.2));
    return { id: card.id, upgraded, price, sold: false };
  });
  const charms = G.rng.shuffle(unownedCharms()).slice(0, 2).map(id => ({
    id, price: CHARMS[id].cost, sold: false,
  }));
  s.shop = {
    cards,
    charms,
    removeUsed: false,
    healUsed: false,
    removePrice: 60,
    healPrice: 35,
    greeting: G.rng.pick([
      'Gold for stories. Stories for gold.',
      'The road is long. Buy something that shortens it.',
      'Every sigil has a previous owner. Best not to ask.',
    ]),
  };
  s.screen = 'shop';
  saveGame();
  sound.map();
  G.view.render();
}

export function buyShopCard(index) {
  const s = S();
  const item = s?.shop?.cards[index];
  if (!item || item.sold) return;
  if (s.player.gold < item.price) {
    sound.error();
    G.view.toast('Not enough gold.', 'bad');
    return;
  }
  s.player.gold -= item.price;
  s.deck.push(makeCard(item.id, item.upgraded));
  item.sold = true;
  sound.coin();
  G.view.toast(`${CARDS[item.id].name} purchased.`, 'good');
  saveGame();
  G.view.render();
}

export function buyShopCharm(index) {
  const s = S();
  const item = s?.shop?.charms[index];
  if (!item || item.sold) return;
  if (s.player.gold < item.price) {
    sound.error();
    G.view.toast('Not enough gold.', 'bad');
    return;
  }
  s.player.gold -= item.price;
  acquireCharm(item.id);
  item.sold = true;
  sound.upgrade();
  G.view.toast(`${CHARMS[item.id].name} bonded.`, 'good');
  saveGame();
  G.view.render();
}

export function buyShopHeal() {
  const s = S();
  if (!s?.shop || s.shop.healUsed) return;
  if (s.player.gold < s.shop.healPrice) {
    sound.error();
    G.view.toast('Not enough gold.', 'bad');
    return;
  }
  if (s.player.hp >= s.player.maxHp) {
    G.view.toast('You are already at full health.', 'bad');
    return;
  }
  s.player.gold -= s.shop.healPrice;
  s.player.hp = Math.min(s.player.maxHp, s.player.hp + Math.ceil(s.player.maxHp * 0.3));
  s.shop.healUsed = true;
  sound.heal();
  G.view.toast('The Wayfarer patches you up.', 'good');
  saveGame();
  G.view.render();
}

export function openShopRemove() {
  const s = S();
  if (!s?.shop) return;
  if (s.shop.removeUsed) return;
  if (s.player.gold < s.shop.removePrice) {
    sound.error();
    G.view.toast('Not enough gold.', 'bad');
    return;
  }
  if (s.deck.length <= 5) {
    G.view.toast('Your deck is too small to release a card.', 'bad');
    return;
  }
  G.ui.modal = 'deck';
  G.ui.deckMode = 'remove';
  G.ui.deckContext = 'shop';
  G.view.render();
}

export function leaveShop() {
  completeNode();
}

// ---------------------------------------------------------------------------
// Camp
// ---------------------------------------------------------------------------

function startRest() {
  const s = S();
  s.rest = { used: false, result: null };
  s.screen = 'rest';
  saveGame();
  sound.map();
  G.view.render();
}

export function restHeal() {
  const s = S();
  if (!s?.rest || s.rest.used) return;
  const amount = Math.min(s.player.maxHp - s.player.hp, Math.ceil(s.player.maxHp * 0.32));
  s.player.hp += amount;
  s.rest.used = true;
  s.rest.result = { title: 'You rest by the fire.', text: amount > 0 ? `Recovered ${amount} HP.` : 'You were already whole.' };
  sound.heal();
  saveGame();
  G.view.render();
}

export function restForage() {
  const s = S();
  if (!s?.rest || s.rest.used) return;
  const gold = 30 + G.rng.range(0, 10);
  s.player.gold += gold;
  s.stats.goldEarned += gold;
  s.rest.used = true;
  s.rest.result = { title: 'You forage the trailside.', text: `Found ${gold} gold in a hollow stump.` };
  sound.coin();
  saveGame();
  G.view.render();
}

export function restForge() {
  const s = S();
  if (!s?.rest || s.rest.used) return;
  if (!s.deck.some(c => !c.upgraded)) {
    G.view.toast('Every card is already refined.', 'bad');
    return;
  }
  G.ui.modal = 'deck';
  G.ui.deckMode = 'upgrade';
  G.ui.deckContext = 'rest';
  G.view.render();
}

export function restContinue() {
  completeNode();
}

// ---------------------------------------------------------------------------
// Deck actions (modal)
// ---------------------------------------------------------------------------

export function chooseDeckCard(uid) {
  const s = S();
  if (!s) return;
  const card = s.deck.find(c => c.uid === uid);
  if (!card) return;

  if (G.ui.deckMode === 'upgrade') {
    if (card.upgraded) {
      G.view.toast('This card is already refined.', 'bad');
      return;
    }
    card.upgraded = true;
    sound.upgrade();
    G.ui.modal = null;
    if (G.ui.deckContext === 'rest' && s.rest) {
      s.rest.used = true;
      s.rest.result = { title: 'You refine a card.', text: `${CARDS[card.id].name}+ is sharper now.` };
    }
    G.ui.deckMode = 'view';
    G.ui.deckContext = null;
    saveGame();
    G.view.render();
    return;
  }

  if (G.ui.deckMode === 'remove') {
    if (s.deck.length <= 5) {
      G.view.toast('Your deck is too small.', 'bad');
      return;
    }
    if (G.ui.deckContext === 'shop') {
      if (!s.shop || s.shop.removeUsed) return;
      if (s.player.gold < s.shop.removePrice) {
        G.view.toast('Not enough gold.', 'bad');
        return;
      }
      s.player.gold -= s.shop.removePrice;
      s.shop.removeUsed = true;
      G.view.toast(`${CARDS[card.id].name} released.`, 'good');
    }
    s.deck = s.deck.filter(c => c.uid !== uid);
    sound.status();
    G.ui.modal = null;
    G.ui.deckMode = 'view';
    G.ui.deckContext = null;
    saveGame();
    G.view.render();
  }
}

// ---------------------------------------------------------------------------
// End of run
// ---------------------------------------------------------------------------

function finishRun(win, caughtBoss) {
  const s = S();
  if (!s) return;
  s.ended = {
    win,
    caughtBoss: !!caughtBoss,
    floor: win ? 9 : s.map.visited.length,
    battles: s.stats.battles,
    wins: s.stats.wins,
    catches: s.stats.catches,
    kills: s.stats.kills,
    deckSize: s.deck.length,
    gold: s.player.gold,
    turns: s.stats.turns,
    cardsPlayed: s.stats.cardsPlayed,
    caught: { ...s.caught },
    seed: s.seed,
  };
  G.meta.runs = (G.meta.runs || 0) + 1;
  if (win) G.meta.wins = (G.meta.wins || 0) + 1;
  G.meta.bestFloor = Math.max(G.meta.bestFloor || 0, win ? 9 : s.map.visited.length);
  saveMeta();
  clearSave();
  s.combat = null;
  s.pending = null;
  s.shop = null;
  s.rest = null;
  s.screen = win ? 'victory' : 'gameover';
  G.ui.busy = false;
  G.ui.catchAnim = null;
  G.ui.modal = null;
  if (win) sound.victory();
  else sound.defeat();
  G.view.render();
}
