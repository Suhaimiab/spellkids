// js/app.js — session state, router, pip rendering
//
// This is the skeleton/plumbing layer (Task 8): it owns session state,
// switches between the three views, renders progress pips, and mounts the
// mascot. The actual challenge rendering (Build the Word / Missing Letter /
// First Sound Match) is added in Tasks 9-11. It will read/write Session
// fields directly (Session.currentIndex, Session.modeBag.next(), etc.) and
// render into #challenge-area via module-level functions, following the
// pattern already used here (startSession, showView, renderPips) — Session
// itself stays a plain data bag with no methods of its own.

(function () {
  'use strict';

  const PRAISE_LINES = [
    'Amazing, Safeera!',
    'You spelled it, Safeera!',
    'Super star, Safeera!',
    'Yes! You did it, Safeera!',
    'Wow, look at you, Safeera!',
    'Great spelling, Safeera!',
  ];

  const MASCOT_MOUNTS = {
    title: 'mascot-title',
    game: 'mascot-game',
    end: 'mascot-end',
  };

  // Session state — created fresh each time the Start button is pressed.
  const Session = {
    id: 0,           // monotonically increasing — bumped by startSession() so
                      // stale setTimeout closures from a previous session
                      // (see handleWordComplete) can detect they're stale and
                      // no-op instead of corrupting the new session's state.
    wordOrder: [],   // shuffled copy of WORDS for this session
    currentIndex: 0, // index into wordOrder
    modeBag: null,   // shuffle-bag over ['build', 'missing', 'firstsound']
    praiseBag: null, // shuffle-bag over PRAISE_LINES (consumed starting Task 12)
    completed: [],   // parallel to wordOrder: true once a word is solved
  };

  function startSession() {
    Session.id++;
    Session.wordOrder = SpellLogic.shuffle(WORDS);
    Session.currentIndex = 0;
    Session.completed = Session.wordOrder.map(() => false);
    Session.modeBag = SpellLogic.createShuffleBag(['build', 'missing', 'firstsound']);
    Session.praiseBag = SpellLogic.createShuffleBag(PRAISE_LINES);

    showView('game');
    renderPips('pips', Session.wordOrder.length, Session.completed);
    renderChallenge();
  }

  // ------------------------------------------------------------------
  // Challenge dispatch (Task 9) — reads the current word off Session and
  // draws a mode from Session.modeBag, then hands off to that mode's
  // renderer. All three modes ('build', 'missing', 'firstsound') are
  // implemented as of Task 11. 'firstsound' needs the word's picture
  // (looked up from PICTURES by id), so all three renderers are called
  // with the word string plus the entry's id for consistency, even though
  // 'build'/'missing' don't use the id today.
  // ------------------------------------------------------------------
  function renderChallenge() {
    const entry = Session.wordOrder[Session.currentIndex];
    if (!entry) return;
    const mode = Session.modeBag.next();
    const area = document.getElementById('challenge-area');
    if (area) area.innerHTML = '';

    if (mode === 'build') {
      SpellModes.renderBuildWord(entry.word, entry.id);
    } else if (mode === 'missing') {
      SpellModes.renderMissingLetter(entry.word, entry.id);
    } else if (mode === 'firstsound') {
      SpellModes.renderFirstSound(entry.word, entry.id);
    }
  }

  // ------------------------------------------------------------------
  // Shared word-completion handler (Task 12) — called by all three modes
  // (js/modes.js) once a word is fully solved. Plays the completion chime,
  // shows the reward (Task 13: extracted into renderReward below), fills
  // the pip, then advances to the next word or — if this was the last
  // word — shows the end-of-session screen (Task 13).
  //
  // Stale setTimeout guard (carried-forward Task 9 review concern): the
  // advance-to-next-word timeout snapshots Session.id and checks it
  // still matches when the timeout fires. Session.id is bumped once per
  // startSession() call, so if a new session starts (Task 13's "Play
  // Again", which goes through startSession()) before this timeout
  // fires, the stale closure sees a mismatch and does nothing instead of
  // mutating the new session's currentIndex or double-showing a view.
  //
  // Speech-overlap note (carried-forward Task 11 review concern):
  // Engine.speak() cancels any in-flight utterance before speaking
  // (newest-wins). Engine.speak(line) inside renderReward() is called
  // immediately, before the 1.5s hold begins, giving the praise line the
  // longest possible head start to finish before the next round's
  // renderFirstSound might call Engine.speak(word) and cut it off. This
  // is an accepted low-risk "newest wins" tradeoff per spec, not a bug —
  // a speech queue would be overkill here.
  // ------------------------------------------------------------------
  function handleWordComplete(word, id) {
    Engine.playChime('complete');
    renderReward(id);

    Session.completed[Session.currentIndex] = true;
    renderPips('pips', Session.wordOrder.length, Session.completed);

    const sessionId = Session.id;
    setTimeout(() => {
      if (Session.id !== sessionId) return; // a new session started — stale, ignore
      Session.currentIndex++;
      if (Session.currentIndex < Session.wordOrder.length) {
        renderChallenge();
      } else {
        showEndOfSession();
      }
    }, 1500);
  }

  // ------------------------------------------------------------------
  // Reward block (Task 12, extracted in Task 13) — builds the "you
  // finished the word" celebration: the word's picture wiggling plus a
  // personalized praise line drawn from Session.praiseBag, spoken via
  // Engine.speak and shown as text. Renders into #challenge-area.
  //
  // Picture-display design decision: Build the Word and Missing Letter
  // don't render the word's picture at all during play (only First Sound
  // Match does, via .firstsound-picture). Since the wiggle reward is a
  // universal "you finished the word" celebration, not a first-sound-mode
  // feature, we can't rely on the picture already being on screen. So
  // this clears #challenge-area (its mode-specific content is done being
  // interacted with anyway — the word is solved) and renders a dedicated
  // `.reward` block into it containing the picture (fresh `[data-anim]`
  // group looked up from PICTURES by id) and the praise text. This
  // guarantees the picture is visible and animates on every completion,
  // regardless of which mode was just played, without needing each
  // renderer to special-case picture display.
  // ------------------------------------------------------------------
  function renderReward(id) {
    const area = document.getElementById('challenge-area');
    if (!area) {
      // No #challenge-area to render into — still speak the praise so
      // audio feedback isn't silently lost.
      Engine.speak(Session.praiseBag.next());
      return;
    }

    area.innerHTML = '';

    const reward = document.createElement('div');
    reward.className = 'reward';

    const pictureWrap = document.createElement('div');
    pictureWrap.className = 'reward-picture';
    pictureWrap.innerHTML = PICTURES[id] || '';
    reward.appendChild(pictureWrap);

    // Trigger the wiggle keyframe animation on the picture's [data-anim]
    // group (Task 5). Fresh element every time, so no need to restart
    // via reflow the way triggerBounceBack does for reused buttons.
    const animEl = pictureWrap.querySelector('[data-anim]');
    if (animEl) animEl.classList.add('celebrate');

    const praiseLine = Session.praiseBag.next();
    Engine.speak(praiseLine);

    const praiseText = document.createElement('p');
    praiseText.className = 'reward-praise';
    praiseText.textContent = praiseLine;
    reward.appendChild(praiseText);

    area.appendChild(reward);
  }

  // ------------------------------------------------------------------
  // End-of-session screen (Task 13) — shown once the last word's
  // completion hold finishes. All pips are already filled at this point
  // (the last word's own pip fill happens in handleWordComplete above,
  // before this runs), so we just re-render them into #end-pips off the
  // same Session.completed array. Draws a closing line from the same
  // Session.praiseBag pool used for in-round praise, speaks + shows it,
  // re-mounts the mascot via showView('end') and gives it a happy react.
  // "Play Again" (wired once in init()) goes through startSession() —
  // the same path that bumps Session.id — so the stale-timeout guard in
  // handleWordComplete stays intact for a restarted session.
  // ------------------------------------------------------------------
  function showEndOfSession() {
    showView('end');
    renderPips('end-pips', Session.wordOrder.length, Session.completed);

    const praiseLine = Session.praiseBag.next();
    Engine.speak(praiseLine);
    const endPraise = document.getElementById('end-praise');
    if (endPraise) endPraise.textContent = praiseLine;

    Mascot.react('happy');
  }

  // Pip rendering — one pip per word, filled once that word is completed.
  // Adapted from edukids/js/app.js's renderPipsN (a plain div-per-pip loop
  // toggling a `filled` class), generalized to take the completed-state
  // array directly since spellkids' pip count varies with WORDS.length
  // rather than a fixed ROUNDS constant.
  function renderPips(containerId, total, completed) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const pip = document.createElement('div');
      pip.className = 'pip' + (completed[i] ? ' filled' : '');
      el.appendChild(pip);
    }
  }

  // Router — toggles [hidden] across the three view sections and re-mounts
  // the mascot for whichever view becomes active.
  //
  // Mascot is a singleton (see Task 6 review note): it only ever tracks the
  // most-recently-mounted SVG. Since spellkids shows one view at a time, we
  // re-mount the mascot into the newly-shown view's mount point on every
  // switch (rather than mounting all three up front) — this keeps
  // Mascot.react() always targeting the visible mascot with no extra
  // bookkeeping here.
  function showView(name) {
    const views = { title: 'view-title', game: 'view-game', end: 'view-end' };
    if (!views[name]) {
      console.warn('showView: unrecognized view name "' + name + '"');
    }
    Object.keys(views).forEach((key) => {
      const section = document.getElementById(views[key]);
      if (section) section.hidden = key !== name;
    });
    const mountId = MASCOT_MOUNTS[name];
    if (mountId) {
      const mountEl = document.getElementById(mountId);
      if (mountEl) Mascot.mount(mountEl);
    }
  }

  function init() {
    showView('title');
    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.addEventListener('click', startSession);
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) playAgainBtn.addEventListener('click', startSession);
  }

  document.addEventListener('DOMContentLoaded', init);

  // Exposed for later tasks (challenge rendering, reward/praise) and for
  // manual/console inspection. The challenge-mode renderers themselves now
  // live in js/modes.js (window.SpellModes) — re-exposed here too so the
  // existing `SpellApp.renderBuildWord(...)` / `SpellApp.renderMissingLetter(...)`
  // / `SpellApp.renderFirstSound(...)` console-testing convention from prior
  // tasks keeps working unchanged.
  window.SpellApp = {
    Session,
    showView,
    renderPips,
    startSession,
    renderChallenge,
    renderBuildWord: SpellModes.renderBuildWord,
    renderMissingLetter: SpellModes.renderMissingLetter,
    renderFirstSound: SpellModes.renderFirstSound,
    renderReward,
    handleWordComplete,
    showEndOfSession,
  };
})();
