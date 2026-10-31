// WILDBOUND — content definitions. All creatures are original pocket-kin.

export const ELEMENTS = {
  Ember: { color: '#ff9a5c', deep: '#8f2f1d', glow: '#ffb15e' },
  Tide: { color: '#63c9ff', deep: '#14517a', glow: '#7bdcff' },
  Verdant: { color: '#77d97c', deep: '#1f5c36', glow: '#9cf09b' },
  Volt: { color: '#ffdc63', deep: '#7a5a10', glow: '#fff09a' },
  Stone: { color: '#d0bda2', deep: '#5b4a39', glow: '#ecd9bc' },
  Psy: { color: '#c79bff', deep: '#4d2b7d', glow: '#e0c5ff' },
  Dark: { color: '#9b82e8', deep: '#261c4c', glow: '#c0aaff' },
  Frost: { color: '#93ecec', deep: '#1d6570', glow: '#c2ffff' },
  Venom: { color: '#b9e96b', deep: '#40571d', glow: '#d7ff9a' },
  Gale: { color: '#bce9ff', deep: '#2f607a', glow: '#e2f7ff' },
  Light: { color: '#ffe39a', deep: '#8a651d', glow: '#fff3c4' },
};

export const RARITIES = {
  starter: { name: 'Starter', color: '#9aa3b8' },
  common: { name: 'Common', color: '#74c9c2' },
  uncommon: { name: 'Uncommon', color: '#73a9ff' },
  rare: { name: 'Rare', color: '#e9b95f' },
  signature: { name: 'Bond', color: '#ff9fb5' },
};

// ---------------------------------------------------------------------------
// Species
// ---------------------------------------------------------------------------
// moves: dmg/block/heal/status/buff. `pattern` indexes into moves.
// trait hooks live in game.js and are keyed by `trait.key`.
// ---------------------------------------------------------------------------

export const SPECIES = {
  emberling: {
    id: 'emberling',
    name: 'Emberling',
    epithet: 'the Hearth Fox',
    el: 'Ember',
    tier: 'normal',
    hp: 44,
    trait: { key: 'cinder', name: 'Cinder Coat', desc: 'Its attacks apply 1 Burn.' },
    moves: [
      { name: 'Sly Pounce', kind: 'attack', dmg: 7 },
      { name: 'Warm Sparks', kind: 'attack', dmg: 5, status: 'burn', statusN: 2 },
      { name: 'Tinder Guard', kind: 'block', block: 6, buff: 'str', buffN: 1 },
    ],
    pattern: [0, 1, 0, 2, 1],
    sig: 'sig_emberling',
    lore: 'A fox-shaped coal that sleeps in cold hearths. Its tail reignites when it dreams of the sun.',
  },
  aquapup: {
    id: 'aquapup',
    name: 'Aquapup',
    epithet: 'the River pup',
    el: 'Tide',
    tier: 'normal',
    hp: 48,
    trait: { key: 'tidecall', name: 'Tidecall', desc: 'Heals 4 at the start of its turn.' },
    moves: [
      { name: 'Twin Splash', kind: 'attack', dmg: 5, times: 2 },
      { name: 'River Ward', kind: 'block', block: 9, heal: 4 },
      { name: 'Undertow', kind: 'attack', dmg: 11 },
    ],
    pattern: [0, 1, 2, 0, 2],
    sig: 'sig_aquapup',
    lore: 'It carries a little river in its chest. Where it naps, moss grows in the shape of its paws.',
  },
  leafling: {
    id: 'leafling',
    name: 'Leafling',
    epithet: 'the Sun Seed',
    el: 'Verdant',
    tier: 'normal',
    hp: 50,
    trait: { key: 'photosynth', name: 'Photosynthesis', desc: 'Gains 5 Block at the start of its turn.' },
    moves: [
      { name: 'Vine Snap', kind: 'attack', dmg: 6, status: 'weak', statusN: 1 },
      { name: 'Sunbathe', kind: 'block', block: 8, heal: 5 },
      { name: 'Seed Bomb', kind: 'attack', dmg: 12 },
    ],
    pattern: [0, 1, 2, 0, 2],
    sig: 'sig_leafling',
    lore: 'A seed that learned to wave back. It judges the weather by the direction its leaf points.',
  },
  voltkit: {
    id: 'voltkit',
    name: 'Voltkit',
    epithet: 'the Storm Kit',
    el: 'Volt',
    tier: 'normal',
    hp: 40,
    trait: { key: 'overcharge', name: 'Overcharge', desc: 'Its first hit each turn deals +3 damage.' },
    moves: [
      { name: 'Nibble', kind: 'attack', dmg: 5, times: 2 },
      { name: 'Static Field', kind: 'debuff', status: 'weak', statusN: 2 },
      { name: 'Thunder Pounce', kind: 'attack', dmg: 12 },
    ],
    pattern: [0, 2, 1, 0, 2],
    sig: 'sig_voltkit',
    lore: 'It stores static in its ear tufts. Petting one is a calculated risk.',
  },
  pebblit: {
    id: 'pebblit',
    name: 'Pebblit',
    epithet: 'the Rolling Stone',
    el: 'Stone',
    tier: 'normal',
    hp: 54,
    trait: { key: 'stonehide', name: 'Stonehide', desc: 'Starts battle with 8 Block.' },
    moves: [
      { name: 'Harden', kind: 'block', block: 12 },
      { name: 'Boulder Toss', kind: 'attack', dmg: 11 },
      { name: 'Screech', kind: 'debuff', status: 'vulnerable', statusN: 2 },
    ],
    pattern: [0, 1, 2, 1],
    sig: 'sig_pebblit',
    lore: 'A very old pebble. It has opinions about erosion and will share them, slowly.',
  },
  wispurr: {
    id: 'wispurr',
    name: 'Wispurr',
    epithet: 'the Dream Cat',
    el: 'Psy',
    tier: 'normal',
    hp: 46,
    trait: { key: 'hex', name: 'Hex', desc: 'Its attacks apply 1 Weak.' },
    moves: [
      { name: 'Dream Tap', kind: 'attack', dmg: 7 },
      { name: 'Mind Fog', kind: 'debuff', status: 'vulnerable', statusN: 2 },
      { name: 'Doublevision', kind: 'attack', dmg: 6, times: 2 },
    ],
    pattern: [1, 0, 2, 0],
    sig: 'sig_wispurr',
    lore: 'It naps inside other people\'s daydreams. Its purr sounds like a thought you nearly had.',
  },
  nocturne: {
    id: 'nocturne',
    name: 'Nocturne',
    epithet: 'the Moonbat',
    el: 'Dark',
    tier: 'normal',
    hp: 54,
    trait: { key: 'nightfall', name: 'Nightfall', desc: 'At 50% HP, gains 3 Strength once.' },
    moves: [
      { name: 'Shadow Rake', kind: 'attack', dmg: 9 },
      { name: 'Umbral Veil', kind: 'block', block: 10, buff: 'str', buffN: 2 },
      { name: 'Moon Fang', kind: 'attack', dmg: 13 },
    ],
    pattern: [0, 1, 2, 0, 2],
    sig: 'sig_nocturne',
    lore: 'A scrap of midnight with wings. It steals shadows, then forgets where it put them.',
  },
  frostfin: {
    id: 'frostfin',
    name: 'Frostfin',
    epithet: 'the Glacier Seal',
    el: 'Frost',
    tier: 'normal',
    hp: 50,
    trait: { key: 'chill', name: 'Chill', desc: 'Its attacks apply 1 Weak.' },
    moves: [
      { name: 'Ice Shard', kind: 'attack', dmg: 7 },
      { name: 'Snowdrift', kind: 'block', block: 10 },
      { name: 'Frost Vortex', kind: 'attack', dmg: 5, times: 2, status: 'weak', statusN: 1 },
    ],
    pattern: [0, 1, 2, 0],
    sig: 'sig_frostfin',
    lore: 'It sleeps in the meltwater of glaciers. Its breath makes tiny snow that never lands.',
  },
  toxipod: {
    id: 'toxipod',
    name: 'Toxipod',
    epithet: 'the Spore Pod',
    el: 'Venom',
    tier: 'normal',
    hp: 48,
    trait: { key: 'venom', name: 'Venom', desc: 'Its attacks apply 1 Poison.' },
    moves: [
      { name: 'Toxic Spray', kind: 'debuff', status: 'poison', statusN: 4 },
      { name: 'Gnaw', kind: 'attack', dmg: 8 },
      { name: 'Spore Cloud', kind: 'debuff', status: 'weak', statusN: 2, status2: 'poison', status2N: 2 },
    ],
    pattern: [0, 1, 2, 1],
    sig: 'sig_toxipod',
    lore: 'A mushroom that decided walking was better than waiting. Its cap glows when it is pleased.',
  },
  gustling: {
    id: 'gustling',
    name: 'Gustling',
    epithet: 'the Sky Scrap',
    el: 'Gale',
    tier: 'normal',
    hp: 42,
    trait: { key: 'tailwind', name: 'Tailwind', desc: 'Gains 2 Dexterity whenever it Blocks.' },
    moves: [
      { name: 'Peck', kind: 'attack', dmg: 4, times: 3 },
      { name: 'Updraft', kind: 'block', block: 8 },
      { name: 'Dive', kind: 'attack', dmg: 13 },
    ],
    pattern: [0, 1, 2, 0],
    sig: 'sig_gustling',
    lore: 'A pocket of wind that grew a beak. It follows travelers for the crumbs of their songs.',
  },
  boulderon: {
    id: 'boulderon',
    name: 'Boulderon',
    epithet: 'the Living Crag',
    el: 'Stone',
    tier: 'elite',
    hp: 94,
    trait: { key: 'bedrock', name: 'Bedrock', desc: 'Gains 8 Block at the start of its turn.' },
    moves: [
      { name: 'Quake', kind: 'attack', dmg: 14 },
      { name: 'Fortify', kind: 'block', block: 14, buff: 'str', buffN: 2 },
      { name: 'Rock Barrage', kind: 'attack', dmg: 7, times: 2 },
    ],
    pattern: [1, 0, 2, 0],
    sig: 'sig_boulderon',
    lore: 'A mountain that got bored. It collects small stones and arranges them into portraits of itself.',
  },
  stormroc: {
    id: 'stormroc',
    name: 'Stormroc',
    epithet: 'the Thunder Bird',
    el: 'Gale',
    tier: 'elite',
    hp: 88,
    trait: { key: 'gale', name: 'Gale', desc: 'Its attacks hit one extra time.' },
    moves: [
      { name: 'Wing Slash', kind: 'attack', dmg: 6, times: 2 },
      { name: 'Stormcall', kind: 'block', block: 10, buff: 'str', buffN: 2 },
      { name: 'Lightning Dive', kind: 'attack', dmg: 16 },
    ],
    pattern: [1, 0, 2, 0],
    sig: 'sig_stormroc',
    lore: 'It nests in thunderheads. Its feathers ring like struck bells before a storm.',
  },
  elderwood: {
    id: 'elderwood',
    name: 'Elderwood',
    epithet: 'the Root Remembered',
    el: 'Verdant',
    tier: 'elite',
    hp: 104,
    trait: { key: 'bark', name: 'Bark', desc: 'Has 3 Thorns. Heals 4 at the start of its turn.' },
    moves: [
      { name: 'Root Lash', kind: 'attack', dmg: 11 },
      { name: 'Regrowth', kind: 'block', block: 10, heal: 9 },
      { name: 'Pollen Burst', kind: 'debuff', status: 'weak', statusN: 2, status2: 'vulnerable', status2N: 2 },
    ],
    pattern: [0, 1, 2, 0],
    sig: 'sig_elderwood',
    lore: 'A tree that remembers being a seed. It speaks in the creak of old doors and falling leaves.',
  },
  aurelion: {
    id: 'aurelion',
    name: 'Aurelion',
    epithet: 'the Sunstag',
    el: 'Light',
    tier: 'boss',
    hp: 220,
    trait: { key: 'radiant', name: 'Radiant', desc: 'At 50% HP, gains 4 Strength, heals 12, and changes its moves.' },
    moves: [
      { name: 'Solar Lance', kind: 'attack', dmg: 12, status: 'burn', statusN: 2 },
      { name: 'Radiant Ward', kind: 'block', block: 12, buff: 'str', buffN: 2 },
      { name: 'Meteor Mane', kind: 'attack', dmg: 8, times: 3 },
    ],
    moves2: [
      { name: 'Sunfall', kind: 'attack', dmg: 16, status: 'burn', statusN: 2 },
      { name: 'Crown of Dawn', kind: 'block', block: 16, heal: 6, buff: 'str', buffN: 2 },
      { name: 'Supernova', kind: 'attack', dmg: 10, times: 3, status: 'vulnerable', statusN: 2 },
    ],
    pattern: [0, 1, 2, 0, 2],
    pattern2: [1, 0, 2, 0, 2],
    sig: 'sig_aurelion',
    lore: 'The crown of the Ember Road. One century it will bow its head. No Warden has ever asked it to.',
  },
};

export const NORMAL_SPECIES = ['emberling', 'aquapup', 'leafling', 'voltkit', 'pebblit', 'wispurr', 'nocturne', 'frostfin', 'toxipod', 'gustling'];
export const ELITE_SPECIES = ['boulderon', 'stormroc', 'elderwood'];
export const ALL_SPECIES = [...NORMAL_SPECIES, ...ELITE_SPECIES, 'aurelion'];

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------
// effects are interpreted in game.js. Text is authored for clarity.
// ---------------------------------------------------------------------------

const P = (id, name, cost, rarity, el, effects, text, flavor, extra = {}) => ({
  id, name, cost, type: effects.some(e => e.t === 'damage') ? 'attack' : 'skill',
  rarity, el, effects, text, flavor, ...extra,
});

export const CARDS = {};

const add = (...cards) => cards.forEach(c => { CARDS[c.id] = c; });

add(
  P('tackle', 'Tackle', 1, 'starter', null,
    [{ t: 'damage', n: 6, up: 9 }],
    u => `Deal ${u ? 9 : 6} damage.`,
    'A shoulder-first hello.'),

  P('brace', 'Brace', 1, 'starter', null,
    [{ t: 'block', n: 5, up: 8 }],
    u => `Gain ${u ? 8 : 5} Block.`,
    'The oldest pact is a good stance.'),

  P('kindle', 'Kindle', 1, 'starter', 'Ember',
    [{ t: 'damage', n: 4, up: 7 }, { t: 'status', s: 'burn', n: 2, up: 3, to: 'enemy' }],
    u => `Deal ${u ? 7 : 4} damage. Apply ${u ? 3 : 2} Burn.`,
    'A small fire with large ambitions.'),

  P('study', 'Field Study', 1, 'starter', null,
    [{ t: 'draw', n: 2, up: 3 }],
    u => `Draw ${u ? 3 : 2} cards.`,
    'The wilderness rewards attention.'),

  // ---- common -------------------------------------------------------------
  P('quick_jab', 'Quick Jab', 0, 'common', 'Gale',
    [{ t: 'damage', n: 3, up: 5 }, { t: 'draw', n: 1 }],
    u => `Deal ${u ? 5 : 3} damage. Draw 1 card.`,
    'Fast enough to interrupt a thought.'),

  P('rock_throw', 'Rock Throw', 1, 'common', 'Stone',
    [{ t: 'damage', n: 9, up: 13 }],
    u => `Deal ${u ? 13 : 9} damage.`,
    'Geology, applied directly.'),

  P('harden', 'Harden', 1, 'common', 'Stone',
    [{ t: 'block', n: 9, up: 13 }],
    u => `Gain ${u ? 13 : 9} Block.`,
    'Become the wall.'),

  P('aqua_veil', 'Aqua Veil', 1, 'common', 'Tide',
    [{ t: 'block', n: 7, up: 10 }, { t: 'draw', n: 1 }],
    u => `Gain ${u ? 10 : 7} Block. Draw 1 card.`,
    'A curtain of river-light.'),

  P('vine_whip', 'Vine Whip', 1, 'common', 'Verdant',
    [{ t: 'damage', n: 7, up: 9 }, { t: 'status', s: 'weak', n: 2, to: 'enemy' }],
    u => `Deal ${u ? 9 : 7} damage. Apply 2 Weak.`,
    'The forest has a long reach.'),

  P('spark', 'Spark', 0, 'common', 'Volt',
    [{ t: 'damage', n: 3, up: 4 }, { t: 'status', s: 'vulnerable', n: 1, up: 2, to: 'enemy' }],
    u => `Deal ${u ? 4 : 3} damage. Apply ${u ? 2 : 1} Vulnerable.`,
    'A tiny storm, precisely placed.'),

  P('bite', 'Bite', 1, 'common', 'Dark',
    [{ t: 'damage', n: 7, up: 10 }, { t: 'status', s: 'vulnerable', n: 1, to: 'enemy' }],
    u => `Deal ${u ? 10 : 7} damage. Apply 1 Vulnerable.`,
    'Not all lessons are gentle.'),

  P('berry', 'Wild Berry', 1, 'common', 'Verdant',
    [{ t: 'heal', n: 7, up: 10 }, { t: 'block', n: 4, up: 6 }],
    u => `Heal ${u ? 10 : 7} HP. Gain ${u ? 6 : 4} Block.`,
    'Found at the exact moment it was needed.'),

  P('focus_punch', 'Focus Punch', 2, 'common', null,
    [{ t: 'damage', n: 14, up: 20 }],
    u => `Deal ${u ? 20 : 14} damage.`,
    'One breath. One answer.'),

  P('double_team', 'Double Team', 1, 'common', 'Gale',
    [{ t: 'buff', s: 'dex', n: 2, up: 3 }],
    u => `Gain ${u ? 3 : 2} Dexterity.`,
    'Two of you, briefly.'),

  P('swords_dance', 'Sword Dance', 1, 'common', 'Psy',
    [{ t: 'buff', s: 'str', n: 2, up: 3 }],
    u => `Gain ${u ? 3 : 2} Strength.`,
    'A duel fought entirely in the mind.'),

  P('ice_shard', 'Ice Shard', 1, 'common', 'Frost',
    [{ t: 'damage', n: 6, up: 9 }, { t: 'status', s: 'weak', n: 1, up: 2, to: 'enemy' }],
    u => `Deal ${u ? 9 : 6} damage. Apply ${u ? 2 : 1} Weak.`,
    'Winter keeps a shard behind its teeth.'),

  P('gust', 'Gust', 1, 'common', 'Gale',
    [{ t: 'block', n: 10, up: 14 }, { t: 'draw', n: 1 }],
    u => `Gain ${u ? 14 : 10} Block. Draw 1 card.`,
    'Step behind the wind.'),

  // ---- uncommon -----------------------------------------------------------
  P('recycle', 'Recycle', 1, 'uncommon', 'Verdant',
    [{ t: 'draw', n: 3, up: 4 }],
    u => `Draw ${u ? 4 : 3} cards. Exhaust.`,
    'Nothing is wasted in the undergrowth.', { exhaust: true }),

  P('smoke', 'Smoke Screen', 0, 'uncommon', 'Dark',
    [{ t: 'block', n: 6, up: 9 }],
    u => `Gain ${u ? 9 : 6} Block. Exhaust.`,
    'You were never here.', { exhaust: true }),

  P('petal_storm', 'Petal Storm', 2, 'uncommon', 'Verdant',
    [{ t: 'damage', n: 4, up: 5, times: 3 }],
    u => `Deal ${u ? 5 : 4} damage 3 times.`,
    'Spring, weaponized.'),

  P('thunder_crash', 'Thunder Crash', 2, 'uncommon', 'Volt',
    [{ t: 'damage', n: 18, up: 24 }, { t: 'loseHp', n: 3 }],
    u => `Deal ${u ? 24 : 18} damage. Lose 3 HP.`,
    'The sky takes its fee.'),

  P('second_wind', 'Second Wind', 1, 'uncommon', 'Gale',
    [{ t: 'heal', n: 4, up: 6 }, { t: 'block', n: 5, up: 8 }],
    u => `Heal ${u ? 6 : 4} HP. Gain ${u ? 8 : 5} Block. Exhaust.`,
    'Breathe. Then continue.', { exhaust: true }),

  P('toxic', 'Toxic', 2, 'uncommon', 'Venom',
    [{ t: 'status', s: 'poison', n: 6, up: 9, to: 'enemy' }],
    u => `Apply ${u ? 9 : 6} Poison.`,
    'Patience, distilled.'),

  P('leech', 'Leech', 2, 'uncommon', 'Venom',
    [{ t: 'damage', n: 10, up: 14 }, { t: 'heal', n: 4, up: 6 }],
    u => `Deal ${u ? 14 : 10} damage. Heal ${u ? 6 : 4} HP.`,
    'What is taken can be given back.'),

  P('mind_spike', 'Mind Spike', 0, 'uncommon', 'Psy',
    [{ t: 'damage', n: 5, up: 7 }, { t: 'draw', n: 1, if: 'weakened' }],
    u => `Deal ${u ? 7 : 5} damage. If the foe is Weakened, draw 1 card.`,
    'A thought with an edge.'),

  P('mirror_scale', 'Mirror Scale', 1, 'uncommon', 'Frost',
    [{ t: 'blockFromIntent' }],
    () => `Gain Block equal to the foe's incoming attack damage.`,
    'The mountain teaches reflection.'),

  P('last_stand', 'Last Stand', 1, 'uncommon', null,
    [{ t: 'lastStand' }],
    u => `Deal ${u ? 8 : 5} damage plus 1 for every 10 HP you are missing.`,
    'There is always one more step.'),

  P('hex', 'Hex', 2, 'uncommon', 'Psy',
    [{ t: 'status', s: 'vulnerable', n: 3, up: 4, to: 'enemy' }, { t: 'status', s: 'weak', n: 2, up: 3, to: 'enemy' }],
    u => `Apply ${u ? 4 : 3} Vulnerable and ${u ? 3 : 2} Weak.`,
    'A knot tied in the target\'s luck.'),

  P('bulwark', 'Bulwark', 2, 'uncommon', 'Stone',
    [{ t: 'block', n: 14, up: 18 }, { t: 'buff', s: 'dex', n: 2, up: 3 }],
    u => `Gain ${u ? 18 : 14} Block and ${u ? 3 : 2} Dexterity.`,
    'A fortress is a decision you keep making.'),

  P('venom_fang', 'Venom Fang', 1, 'uncommon', 'Venom',
    [{ t: 'damage', n: 4, up: 6 }, { t: 'status', s: 'poison', n: 4, up: 6, to: 'enemy' }],
    u => `Deal ${u ? 6 : 4} damage. Apply ${u ? 6 : 4} Poison.`,
    'The bite is the introduction.'),

  P('overgrowth', 'Overgrowth', 2, 'uncommon', 'Verdant',
    [{ t: 'block', n: 8, up: 11 }, { t: 'heal', n: 4, up: 6 }, { t: 'draw', n: 1 }],
    u => `Gain ${u ? 11 : 8} Block. Heal ${u ? 6 : 4} HP. Draw 1 card.`,
    'The forest rearranges itself around you.'),

  P('phoenix', 'Phoenix Plume', 2, 'uncommon', 'Ember',
    [{ t: 'damage', n: 12, up: 16 }, { t: 'heal', n: 4, up: 6 }],
    u => `Deal ${u ? 16 : 12} damage. Heal ${u ? 6 : 4} HP.`,
    'A feather that refuses to cool.'),

  // ---- rare ---------------------------------------------------------------
  P('meteor', 'Meteor', 3, 'rare', 'Stone',
    [{ t: 'damage', n: 28, up: 36 }],
    u => `Deal ${u ? 36 : 28} damage.`,
    'The mountain answers all at once.'),

  P('bond_surge', 'Bond Surge', 0, 'rare', 'Light',
    [{ t: 'energy', n: 2, up: 3 }],
    u => `Gain ${u ? 3 : 2} Energy. Exhaust.`,
    'Every bond is a circuit.', { exhaust: true }),

  P('primal_surge', 'Primal Surge', 0, 'rare', 'Volt',
    [{ t: 'draw', n: 2, up: 3 }, { t: 'energy', n: 1, up: 2 }],
    u => `Draw ${u ? 3 : 2} cards. Gain ${u ? 2 : 1} Energy. Exhaust.`,
    'The wild remembers how to run.', { exhaust: true }),

  P('pack_tactics', 'Pack Tactics', 1, 'rare', 'Gale',
    [{ t: 'draw', n: 2, up: 3 }, { t: 'energy', n: 1 }],
    u => `Draw ${u ? 3 : 2} cards. Gain 1 Energy. Exhaust.`,
    'A hunt is a conversation.', { exhaust: true }),

  P('aegis', 'Aegis', 2, 'rare', 'Light',
    [{ t: 'block', n: 20, up: 26 }],
    u => `Gain ${u ? 26 : 20} Block. Exhaust.`,
    'The sun remembers who stood in it.', { exhaust: true }),
);

// ---- signature cards ------------------------------------------------------
const S = (id, name, cost, el, effects, text, flavor, species, extra = {}) => ({
  id, name, cost, type: effects.some(e => e.t === 'damage') ? 'attack' : 'skill',
  rarity: 'signature', el, effects, text, flavor, species, ...extra,
});

add(
  S('sig_emberling', 'Cinder Pounce', 1, 'Ember',
    [{ t: 'damage', n: 9, up: 13 }, { t: 'status', s: 'burn', n: 3, up: 4, to: 'enemy' }],
    u => `Deal ${u ? 13 : 9} damage. Apply ${u ? 4 : 3} Burn.`,
    'The hearth fox teaches the first lesson: warmth is a weapon.', 'emberling'),

  S('sig_aquapup', 'Riptide', 1, 'Tide',
    [{ t: 'damage', n: 5, up: 8 }, { t: 'block', n: 7, up: 10 }, { t: 'draw', n: 1 }],
    u => `Deal ${u ? 8 : 5} damage. Gain ${u ? 10 : 7} Block. Draw 1 card.`,
    'River-water knows how to arrive and how to leave.', 'aquapup'),

  S('sig_leafling', 'Bloom', 1, 'Verdant',
    [{ t: 'heal', n: 6, up: 9 }, { t: 'block', n: 5, up: 7 }, { t: 'draw', n: 1 }],
    u => `Heal ${u ? 9 : 6} HP. Gain ${u ? 7 : 5} Block. Draw 1 card.`,
    'A seed does not fight the dark. It grows through it.', 'leafling'),

  S('sig_voltkit', 'Static Cling', 0, 'Volt',
    [{ t: 'damage', n: 4, up: 6 }, { t: 'status', s: 'weak', n: 1, up: 2, to: 'enemy' }, { t: 'status', s: 'vulnerable', n: 1, up: 2, to: 'enemy' }],
    u => `Deal ${u ? 6 : 4} damage. Apply ${u ? 2 : 1} Weak and ${u ? 2 : 1} Vulnerable.`,
    'Contact leaves a mark on both sides.', 'voltkit'),

  S('sig_pebblit', 'Stoneform', 1, 'Stone',
    [{ t: 'block', n: 12, up: 16 }, { t: 'buff', s: 'dex', n: 1, up: 2 }],
    u => `Gain ${u ? 16 : 12} Block and ${u ? 2 : 1} Dexterity.`,
    'Be patient. Be heavier than the blow.', 'pebblit'),

  S('sig_wispurr', 'Foresight', 0, 'Psy',
    [{ t: 'draw', n: 2, up: 3 }],
    u => `Draw ${u ? 3 : 2} cards. Exhaust.`,
    'The dream cat blinks, and you see the next page.', 'wispurr', { exhaust: true }),

  S('sig_nocturne', 'Moonfang', 1, 'Dark',
    [{ t: 'damage', n: 8, up: 11 }, { t: 'damage', n: 8, up: 12, if: 'weakened' }],
    u => `Deal ${u ? 11 : 8} damage. If the foe is Weakened, deal ${u ? 12 : 8} more.`,
    'Night is not empty. It is patient.', 'nocturne'),

  S('sig_frostfin', 'Permafrost', 2, 'Frost',
    [{ t: 'damage', n: 8, up: 12 }, { t: 'status', s: 'weak', n: 2, up: 3, to: 'enemy' }, { t: 'status', s: 'vulnerable', n: 2, up: 3, to: 'enemy' }],
    u => `Deal ${u ? 12 : 8} damage. Apply ${u ? 3 : 2} Weak and ${u ? 3 : 2} Vulnerable.`,
    'The glacier does not hurry, and it does not miss.', 'frostfin'),

  S('sig_toxipod', 'Toxic Bloom', 1, 'Venom',
    [{ t: 'status', s: 'poison', n: 5, up: 7, to: 'enemy' }, { t: 'status', s: 'poison', n: 3, up: 5, to: 'enemy', if: 'poisoned' }],
    u => `Apply ${u ? 7 : 5} Poison. If the foe is already Poisoned, apply ${u ? 5 : 3} more.`,
    'Grow where nothing else can.', 'toxipod'),

  S('sig_gustling', 'Tailwind', 0, 'Gale',
    [{ t: 'draw', n: 2, up: 3 }, { t: 'energy', n: 1 }],
    u => `Draw ${u ? 3 : 2} cards. Gain 1 Energy. Exhaust.`,
    'The sky offers a push, not a promise.', 'gustling', { exhaust: true }),

  S('sig_boulderon', 'Avalanche', 2, 'Stone',
    [{ t: 'damage', n: 8, up: 10, times: 2 }, { t: 'block', n: 8, up: 12 }],
    u => `Deal ${u ? 10 : 8} damage twice. Gain ${u ? 12 : 8} Block.`,
    'The living crag remembers every rock it has ever been.', 'boulderon'),

  S('sig_stormroc', 'Thunder Dive', 2, 'Gale',
    [{ t: 'damage', n: 20, up: 26 }, { t: 'status', s: 'weak', n: 2, up: 3, to: 'enemy' }],
    u => `Deal ${u ? 26 : 20} damage. Apply ${u ? 3 : 2} Weak.`,
    'There is no weather above the storm bird.', 'stormroc'),

  S('sig_elderwood', 'Elder Bark', 2, 'Verdant',
    [{ t: 'block', n: 14, up: 18 }, { t: 'buff', s: 'str', n: 3, up: 4 }],
    u => `Gain ${u ? 18 : 14} Block and ${u ? 4 : 3} Strength.`,
    'The old tree lends you its patience, and its weight.', 'elderwood'),

  S('sig_aurelion', 'Solar Flare', 3, 'Light',
    [{ t: 'damage', n: 30, up: 40 }, { t: 'heal', n: 10, up: 15 }],
    u => `Deal ${u ? 40 : 30} damage. Heal ${u ? 15 : 10} HP. Exhaust.`,
    'For one breath, you are the center of the sky.', 'aurelion', { exhaust: true }),
);

export const REWARD_POOL = Object.values(CARDS).filter(c => ['common', 'uncommon', 'rare'].includes(c.rarity));
export const SIGNATURE_CARDS = Object.values(CARDS).filter(c => c.rarity === 'signature');

// ---------------------------------------------------------------------------
// Charms (relics)
// ---------------------------------------------------------------------------

export const CHARMS = {
  ember_sigil: { id: 'ember_sigil', name: 'Ember Sigil', el: 'Ember', icon: 'flame', cost: 90, desc: 'Start each battle with 1 Strength.', flavor: 'Warmth, kept close.' },
  verdant_sigil: { id: 'verdant_sigil', name: 'Verdant Sigil', el: 'Verdant', icon: 'leaf', cost: 80, desc: 'Heal 4 HP after each battle.', flavor: 'The road remembers your footsteps.' },
  tide_sigil: { id: 'tide_sigil', name: 'Tide Sigil', el: 'Tide', icon: 'drop', cost: 85, desc: 'Start each battle with 8 Block.', flavor: 'The river stands with you.' },
  volt_sigil: { id: 'volt_sigil', name: 'Volt Sigil', el: 'Volt', icon: 'bolt', cost: 120, desc: 'Gain 1 extra Energy on the first turn of each battle.', flavor: 'A spark saved is a spark spent.' },
  moon_sigil: { id: 'moon_sigil', name: 'Moon Sigil', el: 'Psy', icon: 'moon', cost: 130, desc: 'Draw 1 additional card each turn.', flavor: 'The night offers more than it takes.' },
  stone_sigil: { id: 'stone_sigil', name: 'Stone Sigil', el: 'Stone', icon: 'rock', cost: 100, desc: 'Increase max HP by 15 and heal 15 when found.', flavor: 'Carry a little mountain.' },
  shiny_sigil: { id: 'shiny_sigil', name: 'Shiny Sigil', el: 'Light', icon: 'star', cost: 110, desc: 'Kin become catchable at 45% HP instead of 30%.', flavor: 'Some bonds shine before they are made.' },
  hunter_sigil: { id: 'hunter_sigil', name: 'Hunter Sigil', el: 'Dark', icon: 'fang', cost: 90, desc: 'Gain 15 extra gold from battles.', flavor: 'A practical kind of prayer.' },
  crystal_sigil: { id: 'crystal_sigil', name: 'Crystal Sigil', el: 'Frost', icon: 'snow', cost: 120, desc: 'The first card you play each turn costs 1 less.', flavor: 'Clarity is a kind of speed.' },
  oracle_sigil: { id: 'oracle_sigil', name: 'Oracle Sigil', el: 'Psy', icon: 'eye', cost: 95, desc: 'See the foe\'s next two intents.', flavor: 'The future is mostly weather.' },
};

// ---------------------------------------------------------------------------
// Map & misc
// ---------------------------------------------------------------------------

export const NODE_INFO = {
  battle: { name: 'Wild Kin', icon: 'sword', color: '#ff9d6b', blurb: 'A wild pocket-kin blocks the trail.' },
  catch: { name: 'Bond Glade', icon: 'orb', color: '#ff9fc4', blurb: 'A quiet glade where kin offer their bond.' },
  elite: { name: 'Elite Kin', icon: 'skull', color: '#ff6f7d', blurb: 'A powerful kin guards rare treasure.' },
  shop: { name: 'Wayfarer', icon: 'bag', color: '#e9b95f', blurb: 'Trade gold for cards, sigils, and remedies.' },
  rest: { name: 'Campfire', icon: 'campfire', color: '#ffca6b', blurb: 'Rest, refine a card, or forage.' },
  boss: { name: 'The Sunstag', icon: 'crown', color: '#ffe39a', blurb: 'Aurelion waits at the summit.' },
};

export const MAP_TYPES = [
  ['battle', 'battle', 'battle'],
  ['battle', 'catch', 'battle'],
  ['battle', 'shop', 'battle'],
  ['battle', 'elite', 'catch'],
  ['shop', 'rest', 'battle'],
  ['battle', 'elite', 'catch'],
  ['rest', 'shop', 'battle'],
  ['battle', 'elite', 'catch'],
  ['boss'],
];

// Weighted reward pools
export const CARD_RARITY_WEIGHTS = {
  normal: { common: 58, uncommon: 33, rare: 9 },
  elite: { common: 30, uncommon: 43, rare: 27 },
  catch: { common: 20, uncommon: 50, rare: 30 },
};

export const STATUS_INFO = {
  str: { name: 'Strength', icon: 'sword', color: '#ffbd6b', desc: 'Adds damage to each attack.' },
  dex: { name: 'Dexterity', icon: 'shield', color: '#7fc8ff', desc: 'Adds Block to each Block card.' },
  weak: { name: 'Weak', icon: 'swirl', color: '#b6a8c8', desc: 'Deals 25% less damage.' },
  vulnerable: { name: 'Vulnerable', icon: 'target', color: '#ff8a8a', desc: 'Takes 50% more damage.' },
  burn: { name: 'Burn', icon: 'flame', color: '#ff9a5c', desc: 'Loses HP at the end of its turn, then Burn decreases.' },
  poison: { name: 'Poison', icon: 'drop', color: '#b9e96b', desc: 'Loses HP at the start of its turn, then Poison decreases.' },
  regen: { name: 'Regen', icon: 'heart', color: '#7ee0a0', desc: 'Heals at the end of its turn, then Regen decreases.' },
};

export const FLAVOR_LINES = {
  battleStart: [
    'The trail narrows. Something is watching.',
    'A wild bond waits in the undergrowth.',
    'The lantern gutters. You are not alone.',
  ],
  catchReady: [
    'The wild heart is open.',
    'It is tired enough to listen.',
    'The orb hums in your palm.',
  ],
};
