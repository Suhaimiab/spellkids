// js/engine.js
const Engine = (function () {
  function speak(text, opts = {}) {
    if (!('speechSynthesis' in window)) return; // silent no-op, per spec
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = opts.rate || 0.9;
    utter.pitch = opts.pitch || 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    return audioCtx;
  }

  function playTone(freq, duration, type = 'sine', gainValue = 0.15) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainValue;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(gainValue, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }

  function playChime(kind) {
    if (kind === 'correct') {
      playTone(523.25, 0.15, 'sine', 0.18); // C5
      setTimeout(() => playTone(659.25, 0.2, 'sine', 0.18), 100); // E5
    } else if (kind === 'complete') {
      playTone(523.25, 0.12, 'sine', 0.2);
      setTimeout(() => playTone(659.25, 0.12, 'sine', 0.2), 90);
      setTimeout(() => playTone(783.99, 0.25, 'sine', 0.2), 180); // G5
    } else if (kind === 'wrong') {
      playTone(220, 0.12, 'sine', 0.1); // soft, low, brief — no harsh buzzer
    }
  }

  return { speak, playChime };
})();

if (typeof window !== 'undefined') {
  window.Engine = Engine;
}
