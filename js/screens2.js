import { SPECIES, CARDS, CHARMS, NODE_INFO, ELEMENTS } from './data.js';
import { G, esc, cardData, catchThreshold } from './store.js';
import { creatureArt, wardenArt, wayfarerArt, campfireArt, icon } from './sprites.js';
import { cardHTML, hpBar, charmTile, statusChips, elementChip, miniKin, charmChip } from './cards.js';

const S = () => G.state;

// ---------------------------------------------------------------------------
// Battle rewards
// ---------------------------------------------------------------------------

export function rewardScreen() {
  const s = S();
  const p = s.pending;
  if (!p) return '';
  const sp = SPECIES[p.speciesId];
  const elite = p.mode === 'elite';
  return `<div class="result-screen reward-screen">
    <div class="result-head">
      <div class="eyebrow">${elite ? 'ELITE KIN FELLED' : 'BATTLE WON'}</div>
      <h1 class="display">${elite ? 'The trail opens.' : 'The wild grows quiet.'}</h1>
      <p>${esc(p.enemyName || sp?.name || 'The kin')} fades into embers. Take something with you.</p>
    </div>
    <div class="result-hero">
      <div class="result-kin">${creatureArt(p.speciesId)}</div>
      <div class="result-summary">
        <div class="reward-gold">${icon('coin')} <b>+${p.gold}</b><span>gold</span></div>
        <div class="result-note">${elite ? 'An elite sigil waits after you choose a card.' : 'Cards are permanent. Choose with the summit in mind.'}</div>
      </div>
    </div>
    <div class="reward-heading"><span>CHOOSE A CARD</span><i>or travel lighter</i></div>
    <div class="card-offer">
      ${p.cards.map((card, i) => cardHTML(card, {
        act: 'choose-reward', attrs: `data-index="${i}"`, playable: true,
      })).join('')}
    </div>
    <div class="result-actions">
      <button class="btn quiet" data-act="skip-reward" type="button">Skip the card</button>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Catch result
// ---------------------------------------------------------------------------

export function catchScreen() {
  const s = S();
  const p = s.pending;
  if (!p) return '';
  const sp = SPECIES[p.speciesId];
  return `<div class="result-screen catch-screen">
    <div class="catch-hero">
      <div class="catch-rings"><span></span><span></span><span></span></div>
      <div class="catch-kin">${creatureArt(p.speciesId)}</div>
      <div class="catch-badge">${icon('orb')} ${p.isNew ? 'NEW BOND' : 'BOND DEEPENED'}</div>
      <div class="eyebrow">${esc(sp.epithet)}</div>
      <h1 class="display">${esc(sp.name)}</h1>
      <div class="catch-tags">${elementChip(sp.el)}<span class="trait-pill">${esc(sp.trait.name)}</span></div>
      <p class="catch-lore">${esc(sp.lore)}</p>
    </div>
    <div class="catch-bonuses">
      <span>${icon('heart')} ${p.isNew ? '+4 max HP' : '+15 gold'}</span>
      <span>${icon('heart')} Healed 8 HP</span>
      <span>${icon('coin')} +10 gold</span>
      <span>${icon('paw')} ${sp.trait.desc}</span>
    </div>
    <div class="reward-heading"><span>REMEMBER ONE MOVE</span><i>signature moves are exclusive to bonds</i></div>
    <div class="card-offer">
      ${p.cards.map((card, i) => cardHTML(card, {
        act: 'choose-catch', attrs: `data-index="${i}"`, playable: true,
      })).join('')}
    </div>
    <div class="result-actions">
      <button class="btn quiet" data-act="skip-catch" type="button">Take 20 gold instead</button>
    </div>
  </div>`;
}

export function catchGladeScreen() {
  const s = S();
  const p = s.pending;
  if (!p) return '';
  const sp = SPECIES[p.speciesId];
  const sig = { uid: 'glade-preview', id: p.sigId, upgraded: false };
  return `<div class="result-screen catch-screen glade-catch">
    <div class="catch-hero">
      <div class="catch-rings"><span></span><span></span><span></span></div>
      <div class="catch-kin">${creatureArt(p.speciesId)}</div>
      <div class="catch-badge">${icon('orb')} ${p.isNew ? 'NEW BOND' : 'BOND DEEPENED'}</div>
      <div class="eyebrow">${esc(sp.epithet)}</div>
      <h1 class="display">${esc(sp.name)}</h1>
      <div class="catch-tags">${elementChip(sp.el)}<span class="trait-pill">${esc(sp.trait.name)}</span></div>
      <p class="catch-lore">${esc(sp.lore)}</p>
    </div>
    <div class="catch-bonuses">
      <span>${icon('spark')} Signature move learned</span>
      <span>${icon('heart')} ${p.isNew ? '+4 max HP' : '+15 gold'}</span>
      <span>${icon('heart')} Healed 10 HP</span>
      <span>${icon('coin')} +10 gold</span>
    </div>
    <div class="reward-heading"><span>THE BOND GIVES YOU</span><i>permanently added to your deck</i></div>
    <div class="single-card-offer">
      ${cardHTML(sig, { playable: true })}
    </div>
    <div class="result-actions">
      <button class="btn primary" data-act="continue-glade" type="button">${icon('check')} Carry the bond</button>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Charm reward
// ---------------------------------------------------------------------------

export function charmScreen() {
  const s = S();
  const p = s.pending;
  if (!p) return '';
  return `<div class="result-screen charm-screen">
    <div class="result-head">
      <div class="eyebrow">${p.source === 'elite' ? 'ELITE SIGIL' : 'SIGIL FOUND'}</div>
      <h1 class="display">A small power,<br/>carried close.</h1>
      <p>Sigils are permanent for this expedition. Choose one.</p>
    </div>
    <div class="charm-offer">
      ${p.charms.map(id => charmTile(id, { act: 'choose-charm', attrs: `data-id="${id}"` })).join('')}
    </div>
    <div class="result-actions">
      <button class="btn quiet" data-act="skip-charm" type="button">Leave it · +20 gold</button>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Shop
// ---------------------------------------------------------------------------

export function shopScreen() {
  const s = S();
  const shop = s.shop;
  if (!shop) return '';
  const canAfford = (price) => s.player.gold >= price;
  return `<div class="shop-screen">
    <div class="shop-head">
      <div class="shop-keeper">${wayfarerArt()}</div>
      <div class="shop-talk">
        <div class="eyebrow">THE WAYFARER</div>
        <h1 class="display small">Stories and stock.</h1>
        <p class="shop-greeting">“${esc(shop.greeting)}”</p>
        <div class="shop-wallet">${icon('coin')} <b>${s.player.gold}</b> gold</div>
      </div>
    </div>

    <section class="shop-section">
      <div class="shop-section-head"><h2>${icon('deck')} Cards</h2><span>Permanent additions</span></div>
      <div class="shop-cards">
        ${shop.cards.map((item, i) => {
          const card = { uid: `shop-${i}`, id: item.id, upgraded: item.upgraded };
          return `<div class="shop-item ${item.sold ? 'sold' : ''} ${canAfford(item.price) ? '' : 'unaffordable'}">
            ${cardHTML(card, {
              act: 'buy-shop-card', attrs: `data-index="${i}"`,
              playable: !item.sold && canAfford(item.price),
            })}
            <span class="shop-price">${item.price}g</span>
            ${item.sold ? '<span class="sold-tag">SOLD</span>' : ''}
          </div>`;
        }).join('')}
      </div>
    </section>

    <section class="shop-section">
      <div class="shop-section-head"><h2>${icon('star')} Sigils</h2><span>One per bond</span></div>
      <div class="shop-charms">
        ${shop.charms.length ? shop.charms.map((item, i) => {
          const charm = CHARMS[item.id];
          return `<div class="shop-charm-item ${item.sold ? 'sold' : ''}">
            ${charmTile(item.id, {
              act: 'buy-shop-charm', attrs: `data-index="${i}"`, price: item.price,
              disabled: item.sold || !canAfford(item.price),
            })}
            ${item.sold ? '<span class="sold-tag">SOLD</span>' : ''}
          </div>`;
        }).join('') : '<p class="empty-note">The Wayfarer has no new sigils today.</p>'}
      </div>
    </section>

    <section class="shop-section">
      <div class="shop-section-head"><h2>${icon('campfire')} Services</h2><span>While the lantern burns</span></div>
      <div class="service-list">
        <div class="service-item ${shop.removeUsed ? 'sold' : ''}">
          <span class="service-ic">${icon('deck')}</span>
          <span class="service-txt"><b>Release a card</b><i>Remove one card from your deck permanently.</i></span>
          <button class="btn small" data-act="shop-remove" type="button" ${shop.removeUsed ? 'disabled' : ''}>${shop.removeUsed ? 'Used' : `${shop.removePrice}g`}</button>
        </div>
        <div class="service-item ${shop.healUsed ? 'sold' : ''}">
          <span class="service-ic">${icon('heart')}</span>
          <span class="service-txt"><b>Field remedy</b><i>Recover 30% of your maximum HP.</i></span>
          <button class="btn small" data-act="shop-heal" type="button" ${shop.healUsed ? 'disabled' : ''}>${shop.healUsed ? 'Used' : `${shop.healPrice}g`}</button>
        </div>
      </div>
    </section>

    <div class="shop-footer">
      <button class="btn primary" data-act="leave-shop" type="button">Leave the cart ${icon('play')}</button>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Camp
// ---------------------------------------------------------------------------

export function restScreen() {
  const s = S();
  const rest = s.rest;
  if (!rest) return '';
  const canForge = s.deck.some(c => !c.upgraded);
  return `<div class="result-screen rest-screen">
    <div class="rest-scene">
      <div class="campfire">${campfireArt()}</div>
      <div class="rest-glow"></div>
    </div>
    <div class="result-head">
      <div class="eyebrow">CAMPFIRE</div>
      <h1 class="display">A breath before<br/>the dark.</h1>
      <p>The fire is small, but it is yours. What will you do with the hour?</p>
    </div>
    ${hpBar(s.player.hp, s.player.maxHp, { className: 'wide' })}
    ${rest.used ? `
      <div class="rest-result">
        <div class="eyebrow">${esc(rest.result?.title || 'You rest.')}</div>
        <p>${esc(rest.result?.text || '')}</p>
        <button class="btn primary" data-act="rest-continue" type="button">Back to the trail ${icon('play')}</button>
      </div>
    ` : `
      <div class="rest-options">
        <button class="rest-option" data-act="rest-heal" type="button" ${s.player.hp >= s.player.maxHp ? 'disabled' : ''}>
          <span class="rest-ic">${icon('heart')}</span><b>Rest</b><i>Heal 32% of max HP.</i>
        </button>
        <button class="rest-option" data-act="rest-forge" type="button" ${canForge ? '' : 'disabled'}>
          <span class="rest-ic">${icon('spark')}</span><b>Refine</b><i>Upgrade one card permanently.</i>
        </button>
        <button class="rest-option" data-act="rest-forage" type="button">
          <span class="rest-ic">${icon('coin')}</span><b>Forage</b><i>Find 30–40 gold nearby.</i>
        </button>
      </div>
    `}
  </div>`;
}

// ---------------------------------------------------------------------------
// Bond glade
// ---------------------------------------------------------------------------

export function gladeScreen() {
  const s = S();
  const p = s.pending;
  if (!p) return '';
  return `<div class="result-screen glade-screen">
    <div class="glade-head">
      <div class="glade-glow"></div>
      <div class="eyebrow">BOND GLADE</div>
      <h1 class="display">Three wild hearts,<br/>open to a promise.</h1>
      <p>A quiet clearing between the pines. No battle here — only a choice of who walks with you.</p>
    </div>
    <div class="glade-options">
      ${p.species.map(id => {
        const sp = SPECIES[id];
        return `<button class="glade-option" data-act="choose-glade" data-id="${id}" type="button">
          <span class="glade-figure">${creatureArt(id)}</span>
          <span class="glade-info">
            <span class="eyebrow">${esc(sp.epithet)}</span>
            <b class="glade-name">${esc(sp.name)}</b>
            ${elementChip(sp.el, true)}
            <span class="glade-lore">${esc(sp.lore)}</span>
            <span class="glade-trait"><b>${esc(sp.trait.name)}</b>${esc(sp.trait.desc)}</span>
            <span class="glade-sig">${icon('spark')} Signature: <b>${esc(CARDS[sp.sig].name)}</b></span>
          </span>
        </button>`;
      }).join('')}
    </div>
    <div class="result-actions">
      <button class="btn quiet" data-act="leave-glade" type="button">Leave the glade · +35 gold</button>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// End states
// ---------------------------------------------------------------------------

export function victoryScreen() {
  const s = S();
  const e = s.ended || {};
  const caught = Object.keys(e.caught || {});
  return `<div class="end-screen victory-screen ${e.caughtBoss ? 'pact-end' : ''}">
    <div class="end-sky"></div>
    <div class="end-creature">${creatureArt('aurelion')}</div>
    <div class="end-glow"></div>
    <div class="end-content">
      <div class="eyebrow">${e.caughtBoss ? 'THE TRUE ENDING' : 'THE SUMMIT'}</div>
      <h1 class="display">${e.caughtBoss ? 'The pact<br/>is made.' : 'Aurelion<br/>falls.'}</h1>
      <p class="end-flavor">${e.caughtBoss
        ? 'You do not take the crown. You offer the orb. The Sunstag bows its antlered head, and the Ember Road remembers a Warden who asked instead of taking.'
        : 'The Sunstag’s light dims into embers. The road is quiet. Somewhere below, your lantern is still burning.'}</p>
      <div class="end-stats">
        <div><b>9</b><span>Floors climbed</span></div>
        <div><b>${e.wins || 0}</b><span>Kin defeated</span></div>
        <div><b>${e.catches || 0}</b><span>Bonds formed</span></div>
        <div><b>${e.deckSize || 0}</b><span>Cards carried</span></div>
      </div>
      ${caught.length ? `<div class="end-caught">
        <div class="eyebrow">BONDS THAT WALKED WITH YOU</div>
        <div class="caught-row">${caught.map(id => `<span class="caught-mini">${creatureArt(id)}<i>${esc(SPECIES[id]?.name || id)}</i></span>`).join('')}</div>
      </div>` : ''}
      <div class="end-actions">
        <button class="btn primary big" data-act="new-run" type="button">${icon('spark')} New expedition</button>
        <button class="btn quiet" data-act="title-after-run" type="button">Return to title</button>
      </div>
    </div>
  </div>`;
}

export function gameoverScreen() {
  const s = S();
  const e = s.ended || {};
  const caught = Object.keys(e.caught || {});
  const tip = e.floor <= 2
    ? 'Tip: Block resets each turn. Play guards on the turn the foe attacks, not before.'
    : e.floor <= 5
      ? 'Tip: catching a kin costs a turn but adds a signature card and max HP. Weigh the hit.'
      : 'Tip: upgrades are stronger than extra cards. Refine your best attacks at camp.';
  return `<div class="end-screen gameover-screen">
    <div class="end-sky"></div>
    <div class="end-creature dim">${wardenArt()}</div>
    <div class="end-glow red"></div>
    <div class="end-content">
      <div class="eyebrow">THE LANTERN GOES DARK</div>
      <h1 class="display">Your light<br/>fades.</h1>
      <p class="end-flavor">The Ember Road keeps what it is given. Your deck scatters into the dark, but the bonds you made are remembered.</p>
      <div class="end-stats">
        <div><b>${e.floor || 0}</b><span>Floors climbed</span></div>
        <div><b>${e.wins || 0}</b><span>Kin defeated</span></div>
        <div><b>${e.catches || 0}</b><span>Bonds formed</span></div>
        <div><b>${e.deckSize || 0}</b><span>Cards carried</span></div>
      </div>
      ${caught.length ? `<div class="end-caught">
        <div class="eyebrow">THEY REMEMBER YOU</div>
        <div class="caught-row">${caught.map(id => `<span class="caught-mini">${creatureArt(id)}<i>${esc(SPECIES[id]?.name || id)}</i></span>`).join('')}</div>
      </div>` : ''}
      <div class="end-tip">${icon('scroll')} ${esc(tip)}</div>
      <div class="end-actions">
        <button class="btn primary big" data-act="new-run" type="button">${icon('spark')} Try again</button>
        <button class="btn quiet" data-act="title-after-run" type="button">Return to title</button>
      </div>
    </div>
  </div>`;
}
