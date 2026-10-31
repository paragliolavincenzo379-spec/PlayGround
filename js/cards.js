import { CARDS, ELEMENTS, RARITIES, STATUS_INFO, CHARMS, SPECIES } from './data.js';
import { cardData, cardText, cardCost, esc, clamp } from './store.js';
import { creatureArt, icon } from './sprites.js';
import { intentSummary, intentKind } from './combat.js';

const CARD_ICONS = {
  tackle: 'sword', brace: 'shield', kindle: 'flame', study: 'book',
  quick_jab: 'feather', rock_throw: 'rock', harden: 'shield', aqua_veil: 'drop',
  vine_whip: 'leaf', spark: 'bolt', bite: 'fang', berry: 'heart',
  focus_punch: 'sword', double_team: 'wind', swords_dance: 'sword', ice_shard: 'snow',
  gust: 'wind', recycle: 'deck', smoke: 'swirl', petal_storm: 'leaf',
  thunder_crash: 'bolt', second_wind: 'feather', toxic: 'mushroom', leech: 'fang',
  mind_spike: 'eye', mirror_scale: 'shield', last_stand: 'flame', hex: 'eye',
  bulwark: 'rock', venom_fang: 'fang', overgrowth: 'leaf', phoenix: 'flame',
  meteor: 'rock', bond_surge: 'orb', primal_surge: 'bolt', pack_tactics: 'paw', aegis: 'sun',
};

const EL_ICONS = {
  Ember: 'flame', Tide: 'drop', Verdant: 'leaf', Volt: 'bolt', Stone: 'rock',
  Psy: 'eye', Dark: 'moon', Frost: 'snow', Venom: 'mushroom', Gale: 'wind', Light: 'sun',
};

export function cardIcon(d) {
  return CARD_ICONS[d.id] || EL_ICONS[d.el] || (d.type === 'attack' ? 'sword' : 'spark');
}

export function cardHTML(card, opts = {}) {
  const d = cardData(card);
  const up = card.upgraded;
  const el = d.el ? ELEMENTS[d.el] : null;
  const color = el?.color || (d.type === 'attack' ? '#ffb26b' : '#7fd8d2');
  const deep = el?.deep || (d.type === 'attack' ? '#6b3724' : '#1d4f4c');
  const rarity = RARITIES[d.rarity] || RARITIES.common;
  const cost = opts.cost !== undefined ? opts.cost : cardCost(card, { discount: opts.discount !== false });
  const playable = opts.playable !== false;
  const act = opts.act;
  const tag = act ? 'button' : 'div';
  const attrs = act ? `data-act="${act}"` : '';
  const extra = opts.attrs || '';
  const sig = d.rarity === 'signature';
  const art = sig && d.species
    ? `<div class="card-kin">${creatureArt(d.species)}</div>`
    : `<div class="card-glyph">${icon(cardIcon(d))}</div>`;
  const classes = [
    'card', `rarity-${d.rarity}`, opts.compact ? 'compact' : '', playable ? '' : 'unplayable',
    up ? 'upgraded' : '', opts.className || '',
  ].filter(Boolean).join(' ');
  return `<${tag} class="${classes}" ${attrs} ${extra} ${act ? 'type="button"' : ''}
    style="--el:${color};--el-deep:${deep};--rot:${opts.rot || 0}deg;--rarity:${rarity.color}"
    aria-label="${esc(d.name)}${up ? ' plus' : ''}: ${esc(cardText(card))}">
    ${opts.badge ? `<span class="key-badge">${opts.badge}</span>` : ''}
    <span class="card-cost ${cost === 0 ? 'free' : ''}">${cost}</span>
    <div class="card-art">
      <span class="art-glow"></span><span class="art-ring"></span><span class="art-ring r2"></span>
      <span class="art-stars"></span>
      ${art}
      ${sig ? '<span class="sig-tag">BOND</span>' : ''}
    </div>
    <div class="card-body">
      <div class="card-name">${esc(d.name)}${up ? '<span class="plus">+</span>' : ''}</div>
      <div class="card-type">${d.type === 'attack' ? 'ATTACK' : 'SKILL'}${d.el ? ` · ${d.el.toUpperCase()}` : ''}</div>
      <div class="card-desc">${esc(cardText(card))}</div>
    </div>
    <div class="card-foot"><span class="rarity-gem"></span><span>${rarity.name}</span>${d.el ? `<span class="foot-el">${d.el}</span>` : ''}</div>
  </${tag}>`;
}

export function hpBar(cur, max, opts = {}) {
  const pct = clamp((cur / Math.max(1, max)) * 100, 0, 100);
  const threshold = opts.threshold;
  return `<div class="hpbar ${opts.className || ''}" role="progressbar" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${cur}" style="--hp:${pct}%">
    <span class="hpbar-fill"></span>
    <span class="hpbar-shine"></span>
    <span class="hpbar-text">${cur}<i>/</i>${max}</span>
    ${threshold ? `<span class="hpbar-mark" style="left:${threshold * 100}%"><i>CATCH</i></span>` : ''}
  </div>`;
}

export function statusChips(entity, opts = {}) {
  if (!entity) return '';
  const chips = [];
  const delta = opts.compact ? '' : '';
  if (entity.str) chips.push(chip('str', entity.str, 'sword', '#ffbd6b', 'Strength', 'Adds damage to each attack.'));
  if (entity.dex) chips.push(chip('dex', entity.dex, 'shield', '#7fc8ff', 'Dexterity', 'Adds Block to each Block card.'));
  for (const [key, n] of Object.entries(entity.statuses || {})) {
    if (!n) continue;
    const info = STATUS_INFO[key];
    if (!info) continue;
    chips.push(chip(key, n, info.icon, info.color, info.name, info.desc));
  }
  return `<div class="status-row">${chips.join('')}${delta}</div>`;
}

function chip(key, n, ic, color, name, desc) {
  return `<span class="status-chip" style="--c:${color}" tabindex="0">
    ${icon(ic)}<b>${n}</b><span class="status-tip"><strong>${esc(name)}</strong>${esc(desc)}</span>
  </span>`;
}

export function elementChip(el, small = false) {
  const info = ELEMENTS[el];
  if (!info) return '';
  return `<span class="el-chip ${small ? 'small' : ''}" style="--c:${info.color}">${icon(EL_ICONS[el] || 'spark')}<span>${esc(el)}</span></span>`;
}

export function intentBubble(move, opts = {}) {
  if (!move) return '';
  const kind = intentKind(move);
  const ic = kind === 'attack' ? 'sword' : kind === 'defend' ? 'shield' : kind === 'buff' ? 'arrowUp' : kind === 'debuff' ? 'swirl' : 'spark';
  return `<div class="intent ${kind} ${opts.second ? 'second' : ''}" title="${esc(intentSummary(move))}">
    <span class="intent-icon">${icon(ic)}</span>
    <span class="intent-text"><b>${opts.second ? 'NEXT: ' : ''}${esc(move.name)}</b><i>${esc(intentSummary(move))}</i></span>
  </div>`;
}

export function charmChip(id, opts = {}) {
  const c = CHARMS[id];
  if (!c) return '';
  const el = ELEMENTS[c.el] || ELEMENTS.Light;
  const inner = `<span class="charm-ic" style="--c:${el.color}">${icon(c.icon)}</span>
    <span class="charm-txt"><b>${esc(c.name)}</b><i>${esc(c.desc)}</i></span>`;
  if (opts.act) {
    return `<button class="charm-chip actionable" data-act="${opts.act}" ${opts.attrs || ''} type="button" style="--c:${el.color}">
      ${inner}${opts.price ? `<span class="charm-price">${opts.price}g</span>` : ''}
    </button>`;
  }
  return `<span class="charm-chip" style="--c:${el.color}" tabindex="0">${inner}</span>`;
}

export function charmTile(id, opts = {}) {
  const c = CHARMS[id];
  if (!c) return '';
  const el = ELEMENTS[c.el] || ELEMENTS.Light;
  return `<button class="charm-tile" data-act="${opts.act || ''}" ${opts.attrs || ''} type="button" style="--c:${el.color}" ${opts.disabled ? 'disabled' : ''}>
    <span class="charm-halo"></span>
    <span class="charm-big">${icon(c.icon)}</span>
    <span class="charm-name">${esc(c.name)}</span>
    <span class="charm-desc">${esc(c.desc)}</span>
    <span class="charm-flavor">${esc(c.flavor)}</span>
    ${opts.price ? `<span class="price-tag">${opts.price}g</span>` : ''}
    ${opts.price ? '' : '<span class="free-tag">BOND</span>'}
  </button>`;
}

export function speciesTile(id, opts = {}) {
  const sp = SPECIES[id];
  if (!sp) return '';
  return `<div class="species-tile ${opts.locked ? 'locked' : ''}">
    <div class="species-art">${creatureArt(id)}</div>
    <div class="species-info">
      <div class="species-name">${opts.locked ? '???' : esc(sp.name)}</div>
      <div class="species-sub">${opts.locked ? 'Not yet bonded' : `${esc(sp.epithet)}`}</div>
      ${!opts.locked ? elementChip(sp.el, true) : ''}
      ${opts.trait && !opts.locked ? `<div class="species-trait"><b>${esc(sp.trait.name)}</b>${esc(sp.trait.desc)}</div>` : ''}
      ${opts.count ? `<div class="species-count">Bonded ×${opts.count}</div>` : ''}
    </div>
  </div>`;
}

export function miniKin(id, cls = '') {
  return `<div class="mini-kin ${cls}">${creatureArt(id)}</div>`;
}

export function cardCounts(deck) {
  const counts = { attack: 0, skill: 0, signature: 0 };
  for (const c of deck) {
    const d = CARDS[c.id];
    if (!d) continue;
    if (d.rarity === 'signature') counts.signature++;
    else if (d.type === 'attack') counts.attack++;
    else counts.skill++;
  }
  return counts;
}
