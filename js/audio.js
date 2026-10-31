// Tiny synthesized soundscape — no external audio assets.
const MUTE_KEY = 'wildbound.muted.v1';

export class Sound {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.muted = false;
    try { this.muted = localStorage.getItem(MUTE_KEY) === '1'; } catch {}
    this.musicTimer = null;
    this.started = false;
  }

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.55;
      this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.1;
      this.musicGain.connect(this.master);
      this.startAmbient();
      this.started = true;
    } catch {}
  }

  setMuted(m) {
    this.muted = m;
    try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch {}
    if (this.master && this.ctx) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(m ? 0 : 0.55, this.ctx.currentTime + 0.15);
    }
  }

  toggle() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  tone(freq, dur = 0.12, type = 'sine', vol = 0.12, slide = 0, delay = 0) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t + dur + 0.03);
  }

  noise(dur = 0.16, vol = 0.14, freq = 1200, q = 0.8, delay = 0) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp).connect(g).connect(this.master);
    src.start(t);
  }

  startAmbient() {
    if (!this.ctx) return;
    const pad = (freq, vol, detune) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const f = this.ctx.createBiquadFilter();
      o.type = 'triangle';
      o.frequency.value = freq;
      o.detune.value = detune;
      f.type = 'lowpass'; f.frequency.value = 480; f.Q.value = 0.6;
      g.gain.value = vol;
      o.connect(f).connect(g).connect(this.musicGain);
      o.start();
      return o;
    };
    pad(55, 0.11, -5);
    pad(82.4, 0.06, 6);
    pad(110, 0.035, -9);
    const lfo = this.ctx.createOscillator();
    const lg = this.ctx.createGain();
    lfo.frequency.value = 0.045;
    lg.gain.value = 0.035;
    lfo.connect(lg).connect(this.musicGain.gain);
    lfo.start();

    const pluck = () => {
      if (!this.ctx) return;
      const scale = [220, 246.9, 293.7, 329.6, 392, 440, 493.9];
      const f = scale[Math.floor(Math.random() * scale.length)] * (Math.random() < 0.25 ? 0.5 : 1);
      this.tone(f, 1.6, 'sine', 0.022, 0, 0);
      this.tone(f * 2, 1.1, 'sine', 0.008, 0, 0.02);
      this.musicTimer = setTimeout(pluck, 5200 + Math.random() * 7000);
    };
    this.musicTimer = setTimeout(pluck, 3000);
  }

  click() { this.tone(660, 0.05, 'triangle', 0.05, -100); }
  hover() { this.tone(880, 0.025, 'sine', 0.018); }
  error() { this.tone(140, 0.12, 'square', 0.05, -40); }
  card() { this.noise(0.08, 0.06, 2600, 1.6); this.tone(520, 0.08, 'triangle', 0.04, 120); }
  draw() { this.noise(0.06, 0.045, 3200, 1.4); this.tone(740, 0.06, 'sine', 0.03); }
  energy() { this.tone(520, 0.12, 'sine', 0.06, 260); this.tone(780, 0.2, 'triangle', 0.04, 140, 0.03); }
  hit() { this.noise(0.14, 0.16, 420, 0.7); this.tone(110, 0.16, 'sawtooth', 0.06, -40); }
  bigHit() { this.noise(0.24, 0.22, 280, 0.5); this.tone(80, 0.28, 'sawtooth', 0.09, -35); }
  block() { this.tone(310, 0.1, 'square', 0.05, 80); this.noise(0.09, 0.05, 1700, 2.4); }
  heal() { [523, 659, 784].forEach((f, i) => this.tone(f, 0.22, 'sine', 0.05, 0, i * 0.07)); }
  buff() { [392, 523, 659, 784].forEach((f, i) => this.tone(f, 0.18, 'triangle', 0.04, 0, i * 0.05)); }
  debuff() { [420, 350, 280].forEach((f, i) => this.tone(f, 0.18, 'sine', 0.04, -20, i * 0.06)); }
  status() { this.tone(300, 0.14, 'sine', 0.04, 60); }
  endTurn() { this.tone(330, 0.16, 'triangle', 0.05, 90); }
  enemy() { this.tone(180, 0.2, 'sawtooth', 0.05, -60); }
  coin() { this.tone(988, 0.1, 'square', 0.04); this.tone(1319, 0.16, 'square', 0.035, 0, 0.07); }
  catch() {
    [392, 523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.5, 'sine', 0.06, 0, i * 0.1));
    this.noise(0.3, 0.05, 2400, 1.2);
  }
  victory() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.65, 'triangle', 0.055, 0, i * 0.13));
  }
  defeat() { [220, 196, 165, 130].forEach((f, i) => this.tone(f, 0.7, 'sine', 0.05, -15, i * 0.19)); }
  map() { this.tone(440, 0.2, 'sine', 0.035, 120); }
  upgrade() { [659, 880, 1109].forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.05, 0, i * 0.06)); }
}

export const sound = new Sound();
