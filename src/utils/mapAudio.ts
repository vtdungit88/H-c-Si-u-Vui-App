// Procedural ambience for the adventure map (no audio files): sea noise + a gentle music-box melody.
import { soundManager } from './audio';

const KEY = 'hsv_map_music_on';
const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
const CHORDS = [[130.81, 196.0, 261.63], [110.0, 164.81, 220.0], [87.31, 130.81, 174.61], [98.0, 146.83, 196.0]];

class MapAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private step = 0;
  private nextTime = 0;
  private noise: AudioBufferSourceNode | null = null;
  private playing = false;

  isEnabled(): boolean { try { return localStorage.getItem(KEY) !== '0'; } catch { return true; } }
  setEnabled(on: boolean) {
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* ignore */ }
    if (on) this.start(); else this.stop();
  }

  start() {
    if (this.playing || !this.isEnabled() || soundManager.getMuted()) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    try {
      this.ctx = this.ctx ?? new AC();
      void this.ctx.resume();
      const ctx = this.ctx;
      this.master = ctx.createGain();
      this.master.gain.value = 0;
      this.master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);
      this.master.connect(ctx.destination);
      this.addSea(ctx);
      this.step = 0; this.nextTime = ctx.currentTime + 0.3; this.playing = true;
      this.timer = window.setInterval(() => this.schedule(), 200);
    } catch { this.playing = false; }
  }

  stop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null; this.playing = false;
    const ctx = this.ctx, master = this.master, noise = this.noise;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
      window.setTimeout(() => { try { noise?.stop(); master.disconnect(); } catch { /* ignore */ } }, 800);
    }
    this.noise = null; this.master = null;
  }

  private addSea(ctx: AudioContext) {
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
    const g = ctx.createGain(); g.gain.value = 0.35;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.2;
    lfo.connect(lfoGain); lfoGain.connect(g.gain); lfo.start();
    src.connect(lp); lp.connect(g); g.connect(this.master!); src.start();
    this.noise = src;
  }

  private tone(freq: number, t: number, dur: number, vol: number, type: OscillatorType) {
    const ctx = this.ctx!; const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master!); o.start(t); o.stop(t + dur + 0.05);
  }

  private schedule() {
    if (!this.ctx || !this.playing) return;
    if (soundManager.getMuted()) { this.stop(); return; }
    const beat = 0.42;
    while (this.nextTime < this.ctx.currentTime + 0.6) {
      const bar = Math.floor(this.step / 8) % 4;
      if (this.step % 8 === 0) CHORDS[bar].forEach((f) => this.tone(f, this.nextTime, beat * 7.5, 0.05, 'triangle'));
      if (this.step % 2 === 0 || Math.random() < 0.35) {
        const n = PENTA[(this.step * 3 + Math.floor(Math.random() * 4) + bar) % PENTA.length];
        this.tone(n, this.nextTime, beat * 1.6, 0.09, 'sine');
        this.tone(n * 2, this.nextTime, beat * 0.8, 0.025, 'sine');
      }
      if (Math.random() < 0.03) this.tone(2400 + Math.random() * 600, this.nextTime, 0.12, 0.02, 'sine'); // distant gull chirp
      this.nextTime += beat; this.step++;
    }
  }
}

export const mapAudio = new MapAudio();
