import { G, wait, clamp } from './store.js';
import { STATUS_INFO } from './data.js';
import { sound } from './audio.js';

const layer = () => document.getElementById('fx-layer');
const toastLayer = () => document.getElementById('toast-layer');
const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function targetEl(which) {
  if (which === 'enemy') return document.getElementById('enemyFigure') || document.getElementById('enemyPanel');
  if (which === 'player') return document.getElementById('playerFigure') || document.getElementById('playerPanel');
  return null;
}

export function fxNumber(target, text, cls = 'dmg', dx = 0, dy = 0) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  const fx = layer();
  if (!el || !fx) return;
  const r = el.getBoundingClientRect();
  const d = document.createElement('div');
  d.className = `fx-num ${cls}`;
  d.textContent = text;
  d.style.left = `${r.left + r.width / 2 + dx + (Math.random() * 32 - 16)}px`;
  d.style.top = `${r.top + r.height * 0.36 + dy + (Math.random() * 20 - 10)}px`;
  fx.appendChild(d);
  setTimeout(() => d.remove(), 1100);
}

export function burst(target, color = '#ffd27a', n = 12) {
  if (reduced()) return;
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  const fx = layer();
  if (!el || !fx) return;
  const r = el.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'fx-spark';
    const ang = Math.random() * Math.PI * 2;
    const dist = 26 + Math.random() * 80;
    s.style.left = `${r.left + r.width / 2}px`;
    s.style.top = `${r.top + r.height * 0.42}px`;
    s.style.background = color;
    s.style.setProperty('--dx', `${Math.cos(ang) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(ang) * dist}px`);
    s.style.setProperty('--rot', `${Math.random() * 360}deg`);
    s.style.setProperty('--dur', `${520 + Math.random() * 450}ms`);
    s.style.width = `${2 + Math.random() * 4}px`;
    s.style.height = `${2 + Math.random() * 4}px`;
    fx.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
}

export function shake(target, strong = false) {
  if (reduced()) return;
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  el.classList.remove('shake', 'shake-hard');
  void el.offsetWidth;
  el.classList.add(strong ? 'shake-hard' : 'shake');
  setTimeout(() => el.classList.remove('shake', 'shake-hard'), 480);
}

export function flash(kind = 'red') {
  if (reduced()) return;
  const fx = layer();
  if (!fx) return;
  const d = document.createElement('div');
  d.className = `fx-flash ${kind}`;
  fx.appendChild(d);
  setTimeout(() => d.remove(), 380);
}

export function banner(text, sub = '', kind = 'neutral') {
  const fx = layer();
  if (!fx) return;
  const d = document.createElement('div');
  d.className = `fx-banner ${kind}`;
  d.innerHTML = `<b>${text}</b>${sub ? `<span>${sub}</span>` : ''}`;
  fx.appendChild(d);
  setTimeout(() => d.classList.add('out'), 1050);
  setTimeout(() => d.remove(), 1550);
}

export function castCard(el) {
  if (!el || reduced()) return;
  const clone = el.cloneNode(true);
  const r = el.getBoundingClientRect();
  const enemy = targetEl('enemy');
  const fx = layer();
  if (!fx) return;
  const er = enemy?.getBoundingClientRect();
  clone.classList.add('cast-clone');
  clone.style.left = `${r.left}px`;
  clone.style.top = `${r.top}px`;
  clone.style.width = `${r.width}px`;
  clone.style.height = `${r.height}px`;
  clone.style.transform = 'none';
  fx.appendChild(clone);
  const tx = (er ? er.left + er.width / 2 : window.innerWidth / 2) - (r.left + r.width / 2);
  const ty = (er ? er.top + er.height * 0.4 : window.innerHeight / 2) - (r.top + r.height / 2);
  const anim = clone.animate([
    { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: `translate(${tx * 0.55}px, ${ty * 0.4 - 40}px) scale(1.06) rotate(8deg)`, opacity: 0.95, offset: 0.55 },
    { transform: `translate(${tx}px, ${ty}px) scale(0.35) rotate(24deg)`, opacity: 0 },
  ], { duration: 360, easing: 'cubic-bezier(.2,.7,.3,1)' });
  anim.onfinish = () => clone.remove();
}

export function showToast(text, kind = '') {
  const layer2 = toastLayer();
  if (!layer2) return;
  const d = document.createElement('div');
  d.className = `toast ${kind}`;
  d.textContent = text;
  layer2.appendChild(d);
  setTimeout(() => d.classList.add('out'), 2600);
  setTimeout(() => d.remove(), 3100);
}

export async function playEvents(events) {
  if (!events || !events.length) {
    await wait(110);
    return;
  }
  for (const ev of events) {
    if (!ev) continue;
    const enemy = targetEl('enemy');
    const player = targetEl('player');
    switch (ev.t) {
      case 'damage': {
        if (ev.target === 'enemy') {
          if (ev.amount > 0) fxNumber(enemy, `-${ev.amount}`, 'dmg', 0, -8);
          if (ev.blocked > 0) fxNumber(enemy, `${ev.blocked} BLOCK`, 'block', 26, 28);
          burst(enemy, ev.amount > 0 ? '#ffb36b' : '#8fd3ff', ev.amount > 12 ? 18 : 9);
          shake(enemy, ev.amount > 12);
          if (ev.amount > 12) sound.bigHit(); else sound.hit();
        } else {
          if (ev.amount > 0) fxNumber(player, `-${ev.amount}`, 'dmg', 0, -8);
          if (ev.blocked > 0) fxNumber(player, `${ev.blocked} BLOCK`, 'block', 26, 28);
          burst(player, ev.amount > 0 ? '#ff8a8a' : '#8fd3ff', ev.amount > 10 ? 14 : 8);
          shake(player, ev.amount > 10);
          flash(ev.amount > 8 ? 'red' : 'soft');
          sound.hit();
        }
        await wait(ev.amount > 12 ? 300 : 220);
        break;
      }
      case 'direct': {
        const el = ev.target === 'enemy' ? enemy : player;
        const colors = { burn: '#ff9a5c', poison: '#b9e96b', thorns: '#c9b79c', cost: '#ff8a8a' };
        const labels = { burn: 'BURN', poison: 'POISON', thorns: 'THORNS', cost: 'COST' };
        fxNumber(el, `-${ev.amount}`, ev.reason === 'poison' ? 'poison' : ev.reason === 'burn' ? 'burn' : 'dmg', 0, -18);
        fxNumber(el, labels[ev.reason] || '', 'status-small', -30, 20);
        burst(el, colors[ev.reason] || '#ffb36b', 7);
        sound.status();
        await wait(230);
        break;
      }
      case 'block': {
        const el = ev.target === 'enemy' ? enemy : player;
        fxNumber(el, `+${ev.amount}`, 'block', 0, -12);
        burst(el, '#8fd3ff', 8);
        sound.block();
        await wait(180);
        break;
      }
      case 'heal': {
        const el = ev.target === 'enemy' ? enemy : player;
        fxNumber(el, `+${ev.amount}`, 'heal', 0, -10);
        burst(el, '#8ff0b0', 10);
        sound.heal();
        await wait(220);
        break;
      }
      case 'buff': {
        const el = ev.target === 'enemy' ? enemy : player;
        fxNumber(el, `+${ev.n} ${ev.s === 'str' ? 'STR' : 'DEX'}`, 'buff', 0, -16);
        burst(el, '#ffd27a', 9);
        sound.buff();
        await wait(180);
        break;
      }
      case 'status': {
        const el = ev.target === 'enemy' ? enemy : player;
        const info = STATUS_INFO[ev.s];
        fxNumber(el, `${info?.name || ev.s} ${ev.n}`, 'status', 20, 18);
        burst(el, info?.color || '#b98cff', 7);
        sound.debuff();
        await wait(190);
        break;
      }
      case 'draw':
        fxNumber(player, `DRAW ${ev.n}`, 'draw', -10, -22);
        sound.draw();
        await wait(140);
        break;
      case 'energy':
        fxNumber(player, `+${ev.n} ENERGY`, 'energy', -10, -26);
        sound.energy();
        await wait(160);
        break;
      case 'phase': {
        banner(ev.text, ev.sub, 'phase');
        burst(enemy, '#ffe39a', 22);
        sound.buff();
        await wait(650);
        break;
      }
      default:
        await wait(80);
    }
  }
}
