import { SPECIES, ALL_SPECIES, STATUS_INFO, CARDS, NODE_INFO, CHARMS } from './data.js';
import { G, esc, caughtCount, runCaughtCount } from './store.js';
import { creatureArt, icon } from './sprites.js';
import { cardHTML, speciesTile, hpBar, charmChip, elementChip } from './cards.js';
import { sound } from './audio.js';

const S = () => G.state;

function shell(title, body, opts = {}) {
  return `<div class="modal-backdrop" data-act="backdrop-close">
    <div class="modal ${opts.wide ? 'wide' : ''} ${opts.className || ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="modal-head">
        <div class="eyebrow">${opts.eyebrow || 'WILDBOUND'}</div>
        <h2>${esc(title)}</h2>
        <button class="modal-close" data-act="close-modal" type="button" aria-label="Close">${icon('close')}</button>
      </div>
      <div class="modal-body">${body}</div>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Deck
// ---------------------------------------------------------------------------

function deckModal() {
  const s = S();
  if (!s) return '';
  const mode = G.ui.deckMode;
  const title = mode === 'upgrade' ? 'Refine a card' : mode === 'remove' ? 'Release a card' : 'Your deck';
  const hint = mode === 'upgrade'
    ? 'Choose one card to upgrade permanently. Upgraded cards gain stronger numbers.'
    : mode === 'remove'
      ? `Choose one card to remove permanently.${G.ui.deckContext === 'shop' ? ` Cost: ${s.shop?.removePrice || 60} gold.` : ''}`
      : `${s.deck.length} cards. Attacks, skills, and bond moves.`;
  const cards = [...s.deck].sort((a, b) => {
    const da = CARDS[a.id], db = CARDS[b.id];
    const rank = { attack: 0, skill: 1 };
    if (da.rarity === 'signature' && db.rarity !== 'signature') return 1;
    if (db.rarity === 'signature' && da.rarity !== 'signature') return -1;
    if (rank[da.type] !== rank[db.type]) return rank[da.type] - rank[db.type];
    return da.name.localeCompare(db.name);
  });
  return shell(title, `
    <div class="modal-note">${esc(hint)}</div>
    <div class="deck-grid">
      ${cards.map(card => {
        const act = mode === 'view' ? '' : 'deck-card';
        return `<div class="deck-cell ${mode === 'upgrade' && card.upgraded ? 'maxed' : ''} ${mode === 'remove' && s.deck.length <= 5 ? 'locked' : ''}">
          ${cardHTML(card, {
            act, attrs: `data-uid="${card.uid}"`, compact: true,
            playable: mode === 'view' || (mode === 'upgrade' && !card.upgraded) || (mode === 'remove' && s.deck.length > 5),
          })}
          ${mode === 'upgrade' && card.upgraded ? '<span class="cell-tag">REFINED</span>' : ''}
        </div>`;
      }).join('')}
    </div>
  `, { wide: true, eyebrow: 'DECK · ' + s.deck.length + ' CARDS' });
}

// ---------------------------------------------------------------------------
// Bond archive
// ---------------------------------------------------------------------------

function dexModal() {
  const meta = G.meta;
  const caught = Object.keys(meta.caught || {});
  const runCaught = S()?.caught || {};
  const tiers = { normal: 'WILD KIN', elite: 'ELITE KIN', boss: 'THE SUNSTAG' };
  const order = ['normal', 'elite', 'boss'];
  return shell('Bond Archive', `
    <div class="dex-head">
      <div class="dex-count"><b>${caught.length}</b><span>/ ${ALL_SPECIES.length} kin bonded across all expeditions</span></div>
      <div class="dex-total">${icon('paw')} ${meta.totalCatches || 0} total bonds</div>
    </div>
    ${order.map(tier => {
      const list = ALL_SPECIES.filter(id => SPECIES[id].tier === tier);
      if (!list.length) return '';
      return `<div class="dex-tier">
        <div class="eyebrow">${tiers[tier]}</div>
        <div class="dex-grid">
          ${list.map(id => {
            const n = meta.caught[id] || 0;
            return speciesTile(id, { locked: !n, count: n, trait: true });
          }).join('')}
        </div>
      </div>`;
    }).join('')}
    ${!caught.length ? `<div class="empty-note center">No bonds yet. Weaken a wild kin below its catch line and offer the orb, or visit a Bond Glade.</div>` : ''}
  `, { wide: true, eyebrow: 'POCKET-KIN FIELD RECORDS' });
}

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------

function helpModal() {
  return shell('How to play', `
    <div class="help-intro">
      <p><b>Wildbound</b> is a deckbuilding climb. Build a deck, battle wild pocket-kin, and <em>catch</em> them to learn signature cards. Reach the summit and decide what to do with the Sunstag.</p>
    </div>
    <div class="help-grid">
      <section class="help-sec">
        <h3>${icon('map')} The climb</h3>
        <p>Choose one of three paths each floor. There are eight floors and a summit. Wild Kin give cards and gold. Elites give sigils. Campfires heal or refine cards. The Wayfarer sells both.</p>
      </section>
      <section class="help-sec">
        <h3>${icon('sword')} Battle</h3>
        <p>You draw <b>5 cards</b> and get <b>3 Energy</b> each turn. Play cards by tapping them. <b>Block</b> is spent before HP and resets at the start of your turn. End your turn to let the foe act.</p>
        <p>Enemy intent is always visible. Attack, defend, or set up accordingly.</p>
      </section>
      <section class="help-sec catch-help">
        <h3>${icon('orb')} The catch</h3>
        <p>Weaken a kin until its HP is under the <b>catch line</b> on its health bar (30% normally, 22% elite, 12% the Sunstag). Then spend <b>1 Energy</b> to offer the orb.</p>
        <p>Catching always succeeds below the line. It gives a <b>signature card</b>, heals you, and grants <b>+4 max HP</b> the first time. Killing instead gives more gold and a normal card reward.</p>
      </section>
      <section class="help-sec">
        <h3>${icon('star')} Sigils</h3>
        <p>Sigils are permanent relics for the run. They start battles with Strength or Block, draw extra cards, make catching easier, and more. Duplicates are never offered.</p>
      </section>
    </div>
    <div class="catch-diagram">
      <div class="catch-diagram-bar"><span style="width:30%"></span><i style="left:30%">CATCH LINE</i></div>
      <div class="catch-diagram-text">Below this line the orb opens. Above it, the bond is not yet ready.</div>
    </div>
    <div class="help-statuses">
      <div class="eyebrow">STATUS GLOSSARY</div>
      <div class="status-glossary">
        ${Object.entries(STATUS_INFO).map(([k, v]) => `<span class="gloss" style="--c:${v.color}">${icon(v.icon)}<b>${esc(v.name)}</b><i>${esc(v.desc)}</i></span>`).join('')}
      </div>
    </div>
    <div class="help-keys">
      <span><kbd>1</kbd>–<kbd>9</kbd> play card</span>
      <span><kbd>E</kbd> end turn</span>
      <span><kbd>D</kbd> deck</span>
      <span><kbd>Esc</kbd> menu / close</span>
    </div>
  `, { wide: true, eyebrow: 'FIELD MANUAL' });
}

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------

function menuModal() {
  const s = S();
  const muted = sound.muted;
  return shell('Paused', `
    <div class="menu-run">
      <div class="menu-run-line"><span>Expedition seed</span><b>${s ? s.seed.toString(16).toUpperCase() : '—'}</b></div>
      <div class="menu-run-line"><span>Floor</span><b>${s ? `${s.map.visited.length + (s.screen === 'map' ? 1 : 1)} / 9` : '—'}</b></div>
      <div class="menu-run-line"><span>Bonds</span><b>${s ? runCaughtCount() : 0}</b></div>
    </div>
    <div class="menu-buttons">
      <button class="btn big" data-act="close-modal" type="button">${icon('play')} Resume</button>
      <button class="btn" data-act="open-deck" type="button">${icon('deck')} View deck</button>
      <button class="btn" data-act="open-dex" type="button">${icon('paw')} Bond archive</button>
      <button class="btn" data-act="open-help" type="button">${icon('scroll')} How to play</button>
      <button class="btn" data-act="toggle-sound" type="button">${icon(muted ? 'close' : 'spark')} Sound: ${muted ? 'off' : 'on'}</button>
      <button class="btn" data-act="save-title" type="button">${icon('moon')} Save & return to title</button>
      <button class="btn danger" data-act="abandon" type="button">${icon('flame')} Abandon expedition</button>
    </div>
    <p class="menu-note">The run is saved automatically after every action. Abandoning deletes the current save.</p>
  `, { eyebrow: 'THE EMBER ROAD' });
}

// ---------------------------------------------------------------------------
// Confirm
// ---------------------------------------------------------------------------

function confirmModal() {
  const d = G.ui.modalData || {};
  return shell(d.title || 'Are you sure?', `
    <p class="confirm-copy">${esc(d.message || '')}</p>
    <div class="confirm-actions">
      <button class="btn ${d.danger ? 'danger' : 'primary'}" data-act="confirm-yes" type="button">${esc(d.confirmLabel || 'Confirm')}</button>
      <button class="btn quiet" data-act="close-modal" type="button">${esc(d.cancelLabel || 'Cancel')}</button>
    </div>
  `, { eyebrow: d.eyebrow || 'CONFIRM', className: 'confirm-modal' });
}

// ---------------------------------------------------------------------------
// Tutorial card (optional first-map note)
// ---------------------------------------------------------------------------

function notesModal() {
  return shell('Field notes', `
    <div class="notes-grid">
      <div class="note-item"><span>${icon('map')}</span><b>Pick a path</b><p>Each floor offers up to three nodes. You cannot go back. The summit is nine floors up.</p></div>
      <div class="note-item"><span>${icon('orb')}</span><b>Weaken, then catch</b><p>Drop a kin below its catch line and spend 1 Energy. Signature cards are permanent.</p></div>
      <div class="note-item"><span>${icon('heart')}</span><b>Block is temporary</b><p>Block disappears at the start of your turn. Guard on the turn the enemy attacks.</p></div>
    </div>
    <div class="confirm-actions"><button class="btn primary" data-act="close-modal" type="button">Got it</button></div>
  `, { eyebrow: 'A WARDEN’S FIRST LESSON' });
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

export function modalHTML() {
  switch (G.ui.modal) {
    case 'deck': return deckModal();
    case 'dex': return dexModal();
    case 'help': return helpModal();
    case 'menu': return menuModal();
    case 'confirm': return confirmModal();
    case 'notes': return notesModal();
    default: return '';
  }
}
