import {
  SPECIES, NODE_INFO, ELEMENTS, STATUS_INFO, CARDS,
} from './data.js';
import {
  G, esc, clamp, availableNodes, nodeKey, floorReached, runCaughtCount, caughtCount,
  cardData, catchThreshold, isWeakened, canCatch,
} from './store.js';
import { creatureArt, wardenArt, wayfarerArt, campfireArt, moonArt, icon } from './sprites.js';
import {
  cardHTML, hpBar, statusChips, elementChip, intentBubble, charmChip, miniKin, cardCounts,
} from './cards.js';
import { peekIntent, intentSummary, intentHits, catchReady } from './combat.js';

const S = () => G.state;

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

export function topbarHTML() {
  const s = S();
  if (!s) return '';
  const p = s.player;
  const floor = floorReached();
  return `<header class="topbar">
    <button class="brand" data-act="title" type="button" aria-label="Return to title">
      <span class="brand-mark">${icon('orb')}</span>
      <span class="brand-word">WILDBOUND</span>
    </button>
    <div class="hud">
      <div class="hud-hp" title="Health">
        ${icon('heart')}
        <div class="hud-hpbar"><span style="width:${clamp(p.hp / p.maxHp * 100, 0, 100)}%"></span></div>
        <b>${p.hp}<i>/${p.maxHp}</i></b>
      </div>
      <div class="hud-gold" title="Gold">${icon('coin')}<b>${p.gold}</b></div>
      <div class="hud-floor" title="Floor">${icon('map')}<b>${floor}<i>/9</i></b></div>
    </div>
    <div class="hud-actions">
      <button class="hud-btn" data-act="open-deck" type="button" title="Your deck (D)">
        ${icon('deck')}<span>Deck</span><b>${s.deck.length}</b>
      </button>
      <button class="hud-btn" data-act="open-dex" type="button" title="Bond archive">
        ${icon('paw')}<span>Bonds</span><b>${runCaughtCount()}/${Object.keys(SPECIES).length}</b>
      </button>
      <button class="hud-btn icon-only" data-act="open-menu" type="button" title="Menu (Esc)" aria-label="Menu">${icon('settings')}</button>
    </div>
  </header>`;
}

function fireflies(n = 16) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const left = (i * 37 + 11) % 100;
    const top = (i * 61 + 7) % 100;
    const delay = ((i * 1.3) % 9).toFixed(2);
    const dur = (7 + (i % 6) * 1.7).toFixed(1);
    out += `<i class="firefly" style="left:${left}%;top:${top}%;animation-delay:-${delay}s;animation-duration:${dur}s"></i>`;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Title
// ---------------------------------------------------------------------------

export function titleScreen() {
  const saved = (() => { try { return localStorage.getItem('wildbound.run.v1'); } catch { return null; } })();
  const caught = caughtCount();
  const total = Object.keys(SPECIES).length;
  return `<div class="title-screen">
    <div class="title-sky">
      <div class="title-moon">${moonArt()}</div>
      <div class="title-cloud c1"></div><div class="title-cloud c2"></div><div class="title-cloud c3"></div>
      ${fireflies(22)}
      <div class="title-ridge r1"></div><div class="title-ridge r2"></div><div class="title-ridge r3"></div>
      <div class="title-trees"></div>
    </div>
    <div class="title-creature left">${creatureArt('emberling')}</div>
    <div class="title-creature right">${creatureArt('aquapup')}</div>
    <div class="title-creature small">${creatureArt('leafling')}</div>
    <div class="title-content">
      <div class="title-eyebrow">AN ORIGINAL POCKET-KIN ADVENTURE</div>
      <h1 class="logo">WILDBOUND</h1>
      <div class="logo-rule"><span></span>${icon('orb')}<span></span></div>
      <p class="title-sub">PACT OF THE EMBER ROAD</p>
      <p class="title-lede">Build your deck. Weaken wild kin.<br/>Offer the bond.</p>
      <div class="title-buttons">
        ${saved ? `<button class="btn primary big" data-act="continue" type="button">${icon('play')} Continue expedition</button>` : ''}
        <button class="btn ${saved ? 'ghost' : 'primary'} big" data-act="new-run" type="button">${icon('spark')} ${saved ? 'New expedition' : 'Begin the climb'}</button>
        <div class="title-small-buttons">
          <button class="btn quiet" data-act="open-help" type="button">${icon('scroll')} How to play</button>
          <button class="btn quiet" data-act="open-dex" type="button">${icon('paw')} Bond archive</button>
        </div>
      </div>
      <div class="title-meta">
        <span><b>${caught}</b> / ${total} kin bonded</span>
        <span class="dot"></span>
        <span>Best climb <b>${G.meta.bestFloor || 0}</b> / 9</span>
        ${G.meta.wins ? `<span class="dot"></span><span><b>${G.meta.wins}</b> summit${G.meta.wins === 1 ? '' : 's'}</span>` : ''}
      </div>
    </div>
    <footer class="title-footer">
      <span>${icon('feather')} Original pocket-kin · handmade in SVG · no accounts, no ads</span>
      <span class="title-version">v1.0 · ${new Date().getFullYear()}</span>
    </footer>
  </div>`;
}

// ---------------------------------------------------------------------------
// Prologue
// ---------------------------------------------------------------------------

export function prologueScreen() {
  return `<div class="prologue-screen">
    <div class="prologue-sky">${moonArt()}<div class="prologue-ridge"></div></div>
    ${fireflies(14)}
    <div class="prologue-inner">
      <div class="eyebrow">THE EMBER ROAD · YEAR 100</div>
      <h1 class="display">The Sunstag<br/>is waiting.</h1>
      <p class="prologue-copy">At the summit of the Ashen Spire, Aurelion crowns one Warden each century. You carry a lantern, a deck of pact-cards, and an empty orb.</p>
      <div class="prologue-steps">
        <div class="pstep"><span class="pstep-ic">${icon('deck')}</span><b>Build</b><i>Shape a deck of strikes, guards, and strange wild tricks.</i></div>
        <div class="pstep"><span class="pstep-ic">${icon('sword')}</span><b>Weaken</b><i>Battle kin without snuffing them out. The trail is a conversation.</i></div>
        <div class="pstep"><span class="pstep-ic">${icon('orb')}</span><b>Bond</b><i>Offer the orb below the catch line to learn a signature move.</i></div>
      </div>
      <div class="prologue-actions">
        <button class="btn primary big" data-act="begin-expedition" type="button">${icon('spark')} Step onto the road</button>
        <span class="fine">Your choices, deck, and catches are saved automatically.</span>
      </div>
    </div>
    <div class="prologue-creature">${creatureArt('aurelion')}</div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Map
// ---------------------------------------------------------------------------

export function mapScreen() {
  const s = S();
  const avail = new Set(availableNodes());
  const visited = new Set(s.map.visited);
  const rows = s.map.rows.map((row, r) => {
    const nodes = row.map((node, c) => {
      const key = nodeKey(r, c);
      const info = NODE_INFO[node.type];
      const isAvail = avail.has(key);
      const isVisited = visited.has(key);
      const cls = [
        'map-node', `type-${node.type}`, isAvail ? 'available' : '', isVisited ? 'visited' : '',
        node.type === 'boss' ? 'boss-node' : '',
      ].filter(Boolean).join(' ');
      return `<div class="map-slot ${row.length === 1 ? 'single' : ''}">
        <button class="${cls}" data-act="node" data-row="${r}" data-col="${c}" type="button"
          aria-label="${esc(info.name)} — ${esc(info.blurb)}" ${isAvail ? '' : 'aria-disabled="true"'}>
          <span class="node-pulse"></span>
          <span class="node-disc">${icon(info.icon)}</span>
          <span class="node-name">${esc(info.name)}</span>
          <span class="node-tip">${esc(info.blurb)}</span>
          ${isVisited ? `<span class="node-check">${icon('check')}</span>` : ''}
        </button>
      </div>`;
    }).join('');
    return `<div class="map-row ${row.some((n, c) => avail.has(nodeKey(r, c))) ? 'has-available' : ''} ${r === 8 ? 'boss-row' : ''}" data-row="${r}">
      <span class="floor-tag">${r === 8 ? 'SUMMIT' : String(r + 1).padStart(2, '0')}</span>
      ${nodes}
    </div>`;
  }).join('');

  const counts = cardCounts(s.deck);
  const caught = Object.keys(s.caught);

  return `<div class="map-screen">
    <section class="map-panel">
      <div class="map-head">
        <div>
          <div class="eyebrow">THE EMBER ROAD</div>
          <h1 class="display small">Choose your path.</h1>
          <p>Three ways forward. No way back. The Sunstag waits at the summit.</p>
        </div>
        <div class="map-progress"><b>${floorReached()}</b><span>/ 9</span><i>FLOOR</i></div>
      </div>
      <div class="map-scroll" id="mapScroll">
        <div class="map-canvas" id="mapCanvas">
          <svg class="map-edges" id="mapEdges" aria-hidden="true"></svg>
          <div class="map-rows">${rows}</div>
        </div>
      </div>
    </section>
    <aside class="map-side">
      <div class="side-card warden-card">
        <div class="warden-figure">${wardenArt()}</div>
        <div class="warden-info">
          <div class="eyebrow">WARDEN</div>
          <div class="warden-name">Keeper of the Lantern</div>
          ${hpBar(s.player.hp, s.player.maxHp)}
          <div class="warden-stats">
            <span>${icon('coin')} ${s.player.gold} gold</span>
            <span>${icon('paw')} ${caught.length} bonds</span>
          </div>
        </div>
      </div>
      <div class="side-card">
        <div class="side-title">${icon('deck')} DECK <b>${s.deck.length}</b></div>
        <div class="deck-breakdown">
          <span><i class="sword-dot"></i>${counts.attack} attacks</span>
          <span><i class="skill-dot"></i>${counts.skill} skills</span>
          ${counts.signature ? `<span><i class="bond-dot"></i>${counts.signature} bonds</span>` : ''}
        </div>
        <button class="text-btn" data-act="open-deck" type="button">View deck ${icon('play')}</button>
      </div>
      <div class="side-card">
        <div class="side-title">${icon('star')} SIGILS</div>
        ${s.charms.length
          ? `<div class="side-charms">${s.charms.map(id => charmChip(id)).join('')}</div>`
          : `<p class="empty-note">No sigils yet. Elites and the Wayfarer can help.</p>`}
      </div>
      <div class="side-card legend-card">
        <div class="side-title">${icon('map')} TRAIL LEGEND</div>
        <div class="legend-grid">
          ${['battle', 'catch', 'elite', 'shop', 'rest', 'boss'].map(t => `<span>${icon(NODE_INFO[t].icon)}<i>${NODE_INFO[t].name}</i></span>`).join('')}
        </div>
      </div>
    </aside>
  </div>`;
}

// ---------------------------------------------------------------------------
// Combat
// ---------------------------------------------------------------------------

export function combatScreen() {
  const s = S();
  const c = s.combat;
  if (!c) return '';
  const e = c.enemy;
  const p = s.player;
  const threshold = catchThreshold(e);
  const weakened = isWeakened(e);
  const ready = canCatch();
  const oracle = s.charms.includes('oracle_sigil');
  const second = oracle ? peekIntent(1) : null;
  const n = c.hand.length;
  const playable = card => !G.ui.busy && !c.result && c.energy >= (function () {
    let cost = cardData(card).cost;
    if (s.charms.includes('crystal_sigil') && !c.crystalUsed) cost = Math.max(0, cost - 1);
    return cost;
  })();

  const hand = c.hand.map((card, i) => {
    const mid = (n - 1) / 2;
    const rot = clamp((i - mid) * 3.1, -9, 9);
    const lift = Math.abs(i - mid) * 1.6;
    const cost = (() => {
      let val = cardData(card).cost;
      if (s.charms.includes('crystal_sigil') && !c.crystalUsed) val = Math.max(0, val - 1);
      return val;
    })();
    return `<div class="hand-slot" style="--rot:${rot}deg;--lift:${lift}px;z-index:${i + 1}">
      ${cardHTML(card, {
        act: 'play-card', attrs: `data-uid="${card.uid}"`, badge: i + 1,
        playable: playable(card), cost, discount: false,
      })}
    </div>`;
  }).join('');

  const intent = e.intent;
  const hpPct = clamp(p.hp / p.maxHp * 100, 0, 100);

  return `<div class="combat-screen">
    <div class="arena" id="arena">
      <div class="arena-sky"></div>
      <div class="arena-moon">${moonArt()}</div>
      <div class="arena-mist m1"></div><div class="arena-mist m2"></div>
      <div class="arena-ground"></div>
      ${fireflies(10)}
      <div class="arena-topline">
        <span class="turn-pill">TURN ${c.turn} <i>·</i> YOUR MOVE</span>
        <span class="combat-mode">${c.mode === 'boss' ? 'SUMMIT' : c.mode === 'elite' ? 'ELITE KIN' : 'WILD KIN'}</span>
      </div>

      <div class="combatant player-side" id="playerPanel">
        <div class="player-nameplate">
          <span class="eyebrow">WARDEN</span>
          <b>${esc(p.name)}</b>
        </div>
        ${statusChips(c.player)}
        <div class="player-figure" id="playerFigure">
          ${wardenArt()}
          ${c.player.block ? `<span class="block-badge">${icon('shield')}<b>${c.player.block}</b></span>` : ''}
        </div>
        <div class="player-hp">
          ${hpBar(p.hp, p.maxHp, { className: 'small' })}
        </div>
      </div>

      <div class="enemy-side" id="enemyPanel">
        <div class="intent-wrap">
          ${intentBubble(intent)}
          ${second ? `<div class="intent-second">${intentBubble(second, { second: true })}</div>` : ''}
        </div>
        <div class="enemy-nameplate">
          <span class="eyebrow">${e.tier === 'boss' ? 'THE SUNSTAG' : e.tier === 'elite' ? 'ELITE KIN' : 'WILD KIN'}</span>
          <b>${esc(e.name)}</b>
          <i>${esc(e.epithet)}</i>
          ${elementChip(e.el, true)}
        </div>
        <div class="enemy-figure" id="enemyFigure">
          ${creatureArt(e.speciesId)}
          ${e.block ? `<span class="block-badge">${icon('shield')}<b>${e.block}</b></span>` : ''}
          ${weakened ? `<span class="weakened-badge">${icon('orb')} WEAKENED</span>` : ''}
        </div>
        <div class="enemy-hp">
          ${hpBar(e.hp, e.maxHp, { threshold })}
        </div>
        ${statusChips(e)}
        <div class="trait-line" title="${esc(e.trait.desc)}"><b>${esc(e.trait.name)}</b><span>${esc(e.trait.desc)}</span></div>
      </div>

      <div class="arena-center">
        ${weakened && !c.result ? `
          <button class="catch-orb ${ready ? 'ready' : ''}" data-act="catch" type="button" ${ready ? '' : 'disabled'}
            title="${ready ? 'Spend 1 Energy to catch' : 'Need 1 Energy to catch'}">
            <span class="orb-ring"></span>
            <span class="orb-core">${icon('orb')}</span>
            <span class="orb-label">CATCH<i>1 energy</i></span>
          </button>` : `<div class="catch-hint">${icon('orb')}<span>Weaken below <b>${Math.round(threshold * 100)}%</b> to open a bond</span></div>`}
      </div>

      <div class="combat-log" aria-live="polite">
        ${c.log.slice(0, 2).map(line => `<span>${esc(line)}</span>`).join('')}
      </div>
    </div>

    ${s.stats.battles === 1 && !G.ui.hintDismissed ? `<div class="combat-hint">
      <span>${icon('scroll')} <b>Field note:</b> weaken a kin below the catch line, then spend 1 Energy to bond with it. Bond cards are permanent.</span>
      <button data-act="dismiss-hint" type="button" aria-label="Dismiss hint">${icon('close')}</button>
    </div>` : ''}

    <div class="combat-bottom">
      <div class="hand-zone">
        <div class="pile draw-pile" title="Draw pile">
          ${icon('deck')}<b>${c.drawPile.length}</b><span>DRAW</span>
        </div>
        <div class="energy-orb ${c.energy === 0 ? 'empty' : ''}" title="Energy">
          <span class="energy-ring"></span>
          <b>${c.energy}</b><i>/${c.baseEnergy}</i>
          <span>ENERGY</span>
          ${s.charms.includes('crystal_sigil') && !c.crystalUsed ? '<em>−1 first card</em>' : ''}
        </div>
        <div class="hand ${n > 5 ? 'many' : ''}" style="--n:${n || 1}">
          ${hand || `<div class="empty-hand">${icon('deck')}<span>No cards in hand. End your turn.</span></div>`}
        </div>
        <div class="turn-controls">
          <button class="btn end-turn" data-act="end-turn" type="button" ${G.ui.busy || c.result ? 'disabled' : ''}>
            <span>End turn</span><kbd>E</kbd>
          </button>
          <div class="pile discard-pile" title="Discard pile">
            ${icon('deck')}<b>${c.discard.length}</b><span>DISCARD</span>
          </div>
          ${c.exhaust.length ? `<div class="pile exhaust-pile" title="Exhausted">${icon('flame')}<b>${c.exhaust.length}</b><span>EXHAUST</span></div>` : ''}
        </div>
      </div>
    </div>
  </div>`;
}
