let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function unlockAudio() {
  ac();
}

function beep(freq: number, dur: number, type: OscillatorType, gain = 0.08, delay = 0) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export function meowSound() {
  beep(420, 0.16, "sine", 0.07);
  beep(640, 0.12, "triangle", 0.04, 0.05);
}

export function winSound() {
  beep(523, 0.12, "sine", 0.07);
  beep(659, 0.12, "sine", 0.07, 0.1);
  beep(784, 0.22, "sine", 0.08, 0.2);
}

export function loseSound() {
  beep(220, 0.28, "triangle", 0.06);
  beep(164, 0.35, "sine", 0.05, 0.12);
}
