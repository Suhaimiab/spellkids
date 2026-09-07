// js/engine.js
const Engine = (function () {
  // Substrings (checked case-insensitively against voice.name / voice.voiceURI)
  // commonly associated with young/female-sounding voices across platforms.
  const FEMALE_VOICE_HINTS = [
    'female', 'woman', 'girl',
    'samantha', // macOS/iOS
    'zira',     // Windows
    'susan', 'karen', 'moira', 'tessa', 'veena', 'fiona', 'kate', // other common OS voices
    'google uk english female',
    'google us english', // Chrome's default US voice reads as female
    'aria', 'jenny', 'michelle', // common online/neural voice names
  ];

  // Cache is a single-element box so we can distinguish "not yet resolved"
  // from "resolved to undefined" (i.e. use browser default) without a magic value.
  let voiceCache = null; // { voice } once resolved, else null
  let listenerAttached = false;

  function pickVoice(voices) {
    if (!voices || !voices.length) return undefined;
    const englishVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
    const pool = englishVoices.length ? englishVoices : voices;

    const female = pool.find((v) => {
      const name = (v.name || '').toLowerCase();
      const uri = (v.voiceURI || '').toLowerCase();
      return FEMALE_VOICE_HINTS.some((hint) => name.includes(hint) || uri.includes(hint));
    });
    if (female) return female;

    return englishVoices.length ? englishVoices[0] : undefined;
  }

  function resolveVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) {
      voiceCache = { voice: pickVoice(voices) };
      return voiceCache.voice;
    }
    // Voices not loaded yet (common on first call, esp. in Chrome). Speak with
    // the browser default this once, and listen for voiceschanged so future
    // calls can benefit once the list is populated.
    if (!listenerAttached && 'onvoiceschanged' in window.speechSynthesis) {
      listenerAttached = true;
      window.speechSynthesis.addEventListener(
        'voiceschanged',
        () => {
          voiceCache = { voice: pickVoice(window.speechSynthesis.getVoices()) };
        },
        { once: true }
      );
    }
    return undefined;
  }

  function speak(text, opts = {}) {
    if (!('speechSynthesis' in window)) return; // silent no-op, per spec
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = opts.rate || 0.9;
    utter.pitch = opts.pitch || 1.15;
    const voice = voiceCache ? voiceCache.voice : resolveVoice();
    if (voice) utter.voice = voice;
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
    if (audioCtx.state === 'suspended') audioCtx.resume();
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
