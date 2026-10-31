import {
  G, hasSave, loadSavedGame, clearSave, availableNodes, nodeKey, esc,
} from './store.js';
import { render } from './ui.js';
import {
  playCard, endPlayerTurn, attemptCatch,
} from './combat.js';
import {
  startNewRun, beginExpedition, abandonRun, saveAndTitle, enterNode,
  chooseReward, skipReward, chooseCatchCard, skipCatchCard, chooseCharm, skipCharm,
  chooseGlade, leaveGlade, continueGlade, buyShopCard, buyShopCharm, buyShopHeal,
  openShopRemove, leaveShop, restHeal, restForge, restForage, restContinue,
  chooseDeckCard, handleCombatWin, handleCombatLose, handleCatch,
} from './run.js';
import { showToast, playEvents, castCard, banner } from './fx.js';
import { sound } from './audio.js';

// ---------------------------------------------------------------------------
// Bind view hooks used by the combat engine
// ---------------------------------------------------------------------------

G.view.render = render;
G.view.toast = showToast;
G.view.playEvents = playEvents;
G.view.castCard = castCard;
G.view.banner = banner;
G.view.onWin = handleCombatWin;
G.view.onLose = handleCombatLose;
G.view.onCatch = handleCatch;

// ---------------------------------------------------------------------------
// Modals & run controls
// ---------------------------------------------------------------------------

function closeModal() {
  G.ui.modal = null;
  G.ui.modalData = null;
  if (G.ui.deckMode !== 'view') {
    G.ui.deckMode = 'view';
    G.ui.deckContext = null;
  }
  render();
}

function openModal(name) {
  if (G.ui.busy && ['deck', 'menu', 'help', 'dex'].includes(name)) {
    showToast('Wait for the trail to settle.', 'bad');
    return;
  }
  G.ui.modal = name;
  render();
}

function openDeck() {
  if (!G.state) return;
  G.ui.deckMode = 'view';
  G.ui.deckContext = null;
  openModal('deck');
}

function openDex() {
  openModal('dex');
}

function openHelp() {
  openModal('help');
}

function openMenu() {
  openModal('menu');
}

function newRunFlow() {
  if (hasSave()) {
    G.ui.modal = 'confirm';
    G.ui.modalData = {
      title: 'Begin a new expedition?',
      eyebrow: 'CURRENT RUN WILL BE LOST',
      message: 'A saved expedition is already on the road. Starting over deletes that save, along with its deck and catches. Your Bond Archive is kept.',
      confirmLabel: 'Start new expedition',
      danger: true,
      onConfirm: () => { G.ui.modal = null; startNewRun(); },
    };
    render();
    return;
  }
  startNewRun();
}

function abandonFlow() {
  G.ui.modal = 'confirm';
  G.ui.modalData = {
    title: 'Abandon the expedition?',
    eyebrow: 'NO RETURN',
    message: 'This deletes the current save. Your Bond Archive and best climb are kept.',
    confirmLabel: 'Abandon run',
    danger: true,
    onConfirm: () => { G.ui.modal = null; abandonRun(); },
  };
  render();
}

// ---------------------------------------------------------------------------
// Event delegation
// ---------------------------------------------------------------------------

document.addEventListener('pointerdown', () => sound.unlock(), { once: true });

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  sound.unlock();
  const act = el.dataset.act;

  if (act === 'backdrop-close') {
    if (e.target === el) closeModal();
    return;
  }
  if (act === 'close-modal') {
    closeModal();
    return;
  }

  switch (act) {
    case 'new-run': newRunFlow(); break;
    case 'continue': {
      if (!loadSavedGame()) {
        showToast('That save could not be loaded.', 'bad');
        render();
        return;
      }
      sound.map();
      render();
      break;
    }
    case 'begin-expedition': beginExpedition(); break;
    case 'title':
      if (G.state) saveAndTitle();
      break;
    case 'title-after-run':
      G.state = null;
      G.ui.modal = null;
      render();
      break;
    case 'save-title': closeModal(); saveAndTitle(); break;
    case 'abandon': abandonFlow(); break;
    case 'confirm-yes': {
      const fn = G.ui.modalData?.onConfirm;
      G.ui.modal = null;
      G.ui.modalData = null;
      if (fn) fn();
      else render();
      break;
    }
    case 'open-deck': openDeck(); break;
    case 'open-dex': openDex(); break;
    case 'open-help': openHelp(); break;
    case 'open-menu': openMenu(); break;
    case 'toggle-sound': {
      const muted = sound.toggle();
      showToast(muted ? 'Sound off.' : 'Sound on.', muted ? '' : 'good');
      render();
      break;
    }
    case 'dismiss-hint': G.ui.hintDismissed = true; render(); break;

    case 'node': {
      const row = Number(el.dataset.row);
      const col = Number(el.dataset.col);
      if (!availableNodes().includes(nodeKey(row, col))) {
        sound.error();
        showToast('That path is not open from here.', 'bad');
        return;
      }
      sound.click();
      enterNode(row, col);
      break;
    }

    case 'play-card': playCard(el.dataset.uid, el); break;
    case 'end-turn': endPlayerTurn(); break;
    case 'catch': attemptCatch(); break;

    case 'choose-reward': chooseReward(Number(el.dataset.index)); break;
    case 'skip-reward': skipReward(); break;
    case 'choose-catch': chooseCatchCard(Number(el.dataset.index)); break;
    case 'skip-catch': skipCatchCard(); break;
    case 'continue-glade': continueGlade(); break;
    case 'choose-charm': chooseCharm(el.dataset.id); break;
    case 'skip-charm': skipCharm(); break;

    case 'choose-glade': chooseGlade(el.dataset.id); break;
    case 'leave-glade': leaveGlade(); break;

    case 'buy-shop-card': buyShopCard(Number(el.dataset.index)); break;
    case 'buy-shop-charm': buyShopCharm(Number(el.dataset.index)); break;
    case 'shop-heal': buyShopHeal(); break;
    case 'shop-remove': openShopRemove(); break;
    case 'leave-shop': leaveShop(); break;

    case 'rest-heal': restHeal(); break;
    case 'rest-forge': restForge(); break;
    case 'rest-forage': restForage(); break;
    case 'rest-continue': restContinue(); break;

    case 'deck-card': chooseDeckCard(el.dataset.uid); break;

    default:
      break;
  }
});

// ---------------------------------------------------------------------------
// Keyboard
// ---------------------------------------------------------------------------

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  if (e.key === 'Escape') {
    e.preventDefault();
    if (G.ui.modal) closeModal();
    else if (G.state && !['title', 'prologue', 'victory', 'gameover'].includes(G.state.screen)) openMenu();
    return;
  }

  if (G.ui.modal) return;
  if (!G.state) return;

  if (e.key === 'd' || e.key === 'D') {
    e.preventDefault();
    openDeck();
    return;
  }
  if (e.key === 'm' || e.key === 'M') {
    e.preventDefault();
    openMenu();
    return;
  }
  if (G.state.screen === 'combat' && G.state.combat && !G.ui.busy) {
    if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      endPlayerTurn();
      return;
    }
    if (/^[1-9]$/.test(e.key)) {
      const idx = Number(e.key) - 1;
      const card = G.state.combat.hand[idx];
      if (card) {
        e.preventDefault();
        const node = document.querySelector(`[data-uid="${card.uid}"][data-act="play-card"]`);
        playCard(card.uid, node);
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Persistence + boot
// ---------------------------------------------------------------------------

window.addEventListener('beforeunload', () => {
  try {
    // state is saved after every action; this is a safety net for modal changes
  } catch {}
});

// Handy for debugging and smoke tests; harmless in production.
window.WB = {
  get state() { return G.state; },
  G,
  newRun: startNewRun,
  enterNode,
  chooseReward,
  chooseCatchCard,
  startCombat: (...args) => import('./combat.js').then(m => m.startCombat(...args)),
  render,
};

// Wake the world.
sound.unlock();
render();

if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reduced-motion');
}
