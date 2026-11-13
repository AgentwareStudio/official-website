// The product pages' sounds: tones synthesised in the browser — the "result tone" that marks a finished job, the
// three rising notes of the sound mark, a soft tick — and recorded lines a page may add (`speak`). The page is silent
// until the visitor turns sound on; the choice is kept for the next visit.
import { useSyncExternalStore } from 'react';

const KEY = 'aw-product-sound';
let on = false;
let ctx: AudioContext | null = null;
const listeners = new Set<() => void>();

function read() {
  try { return window.localStorage.getItem(KEY) === 'on'; } catch { return false; }
}
if (typeof window !== 'undefined') on = read();

export function setSound(next: boolean) {
  on = next;
  if (!next) hush();
  try { window.localStorage.setItem(KEY, next ? 'on' : 'off'); } catch { /* storage off: the choice lasts for this page */ }
  // Called from a click, so the browser lets the audio context start.
  if (next) audio()?.resume();
  listeners.forEach((f) => f());
}
export function useSound() {
  return useSyncExternalStore((f) => { listeners.add(f); return () => listeners.delete(f); }, () => on, () => false);
}

function audio() {
  if (typeof window === 'undefined') return null;
  const A = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!A) return null;
  return (ctx ??= new A());
}

/** One plucked sine with a soft octave above it. */
function note(freq: number, at: number, length: number, gain: number) {
  const a = audio();
  if (!a || !on || a.state !== 'running') return;
  const t = a.currentTime + at;
  const out = a.createGain();
  out.gain.setValueAtTime(0, t);
  out.gain.linearRampToValueAtTime(gain, t + 0.012);
  out.gain.exponentialRampToValueAtTime(0.0001, t + length);
  out.connect(a.destination);
  for (const [mult, level] of [[1, 1], [2, 0.28]] as const) {
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq * mult;
    g.gain.value = level;
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + length + 0.05);
  }
}

// Recorded lines: fetched and decoded once, when the sound is on (the page stays silent and light until then).
const buffers = new Map<string, Promise<AudioBuffer | null>>();
let speaking: AudioBufferSourceNode | null = null;
let request = 0; // the newest speak() or hush(): a line still loading for an older request never plays

function load(src: string) {
  const a = audio();
  if (!a) return Promise.resolve(null);
  let got = buffers.get(src);
  if (!got) {
    got = fetch(src).then((r) => r.arrayBuffer()).then((b) => a.decodeAudioData(b)).catch(() => null);
    buffers.set(src, got);
  }
  return got;
}

/** Fetches lines ahead, so they start on their cue; nothing while the sound is off. */
export function preload(srcs: string[]) {
  if (on) srcs.forEach(load);
}

/** Resolves once the lines are ready (at once while the sound is off), for a scene that starts on a click. */
export async function ready(srcs: string[]) {
  if (on) await Promise.all(srcs.map(load));
}

/** Plays a recorded line (cutting off the one before); silent while the sound is off. */
export function speak(src: string) {
  const a = audio();
  const mine = ++request;
  if (!a || !on || a.state !== 'running') return;
  void load(src).then((buffer) => {
    if (!buffer || !on || mine !== request) return;
    speaking?.stop();
    const s = a.createBufferSource();
    s.buffer = buffer;
    s.connect(a.destination);
    s.onended = () => { if (speaking === s) speaking = null; };
    s.start();
    speaking = s;
  });
}

export function hush() {
  request += 1;
  speaking?.stop();
  speaking = null;
}

// D major: the result tone is the high tonic the sound mark rises to.
const RESULT = 1174.66;
export const resultTone = () => note(RESULT, 0, 0.9, 0.16);
export const soundMark = () => { note(587.33, 0, 0.5, 0.12); note(880, 0.125, 0.5, 0.12); note(RESULT, 0.25, 1.1, 0.16); };
export const tick = (step = 0) => note(440 * Math.pow(2, step / 12), 0, 0.22, 0.07);
/** A dull stop: the line met something it may not do. */
export const thud = () => note(98, 0, 0.35, 0.2);
