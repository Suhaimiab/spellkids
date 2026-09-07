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
      renderBuildWord(entry.word, entry.id);
    } else if (mode === 'missing') {
      renderMissingLetter(entry.word, entry.id);
    } else if (mode === 'firstsound') {
      renderFirstSound(entry.word, entry.id);
    }
  }

  // ------------------------------------------------------------------
  // Shared wrong-tap "bounce-back" animation helper (Task 9/10 review fix).
  // Restarts the CSS bounce-back animation on `el` and cleans up the class
  // once it ends. Guarded per-element via `guardSet` (a WeakSet the caller
  // owns for its own set of buttons/bubbles) so rapid repeat wrong-taps on
  // the same element don't stack up duplicate animationend listeners.
  // ------------------------------------------------------------------
  function triggerBounceBack(el, guardSet) {
    if (guardSet.has(el)) return;
    guardSet.add(el);
    el.classList.remove('bounce-back');
    void el.offsetWidth; // restart animation if tapped again quickly
    el.classList.add('bounce-back');
    el.addEventListener('animationend', () => {
      el.classList.remove('bounce-back');
      guardSet.delete(el);
    }, { once: true });
  }

  // ------------------------------------------------------------------
  // Build the Word mode (Task 9) — blank tiles + a scrambled letter tray
  // containing only this word's letters. Tapping the next-needed letter
  // fills a tile and chimes; any other tap bounces that tile back with no
  // sound. Renders directly into #challenge-area per the module-level
  // render pattern established in Task 8 (no Session methods).
  // ------------------------------------------------------------------
  function renderBuildWord(word, id) {
    const area = document.getElementById('challenge-area');
    if (!area) return;

    let filledCount = 0;
    const bounceGuards = new WeakSet();

    const wrap = document.createElement('div');
    wrap.className = 'build-word';

    const tileRow = document.createElement('div');
    tileRow.className = 'tile-row';
    const tileEls = word.split('').map(() => {
      const tile = document.createElement('div');
      tile.className = 'tile tile--blank';
      tileRow.appendChild(tile);
      return tile;
    });

    const tray = document.createElement('div');
    tray.className = 'tray';
    const scrambled = SpellLogic.scrambleLetters(word);
    scrambled.forEach((letter) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tray-letter';
      btn.textContent = letter;
      btn.addEventListener('click', () => handleTrayTap(letter, btn));
      tray.appendChild(btn);
    });

    wrap.appendChild(tileRow);
    wrap.appendChild(tray);
    area.appendChild(wrap);

    function handleTrayTap(letter, btn) {
      if (btn.disabled) return;
      const needed = SpellLogic.nextNeededLetter(word, filledCount);
      if (needed !== null && letter === needed) {
        const tile = tileEls[filledCount];
        tile.textContent = letter;
        tile.classList.remove('tile--blank');
        tile.classList.add('tile--filled');
        filledCount++;
        Engine.playChime('correct');
        btn.disabled = true;
        btn.classList.add('tray-letter--used');

        if (SpellLogic.isWordComplete(word, filledCount)) {
          handleWordComplete(word, id);
        }
      } else {
        // Wrong tap: bounce-back animation only, no sound (per spec).
        triggerBounceBack(btn, bounceGuards);
      }
    }
  }

  // ------------------------------------------------------------------
  // Shared choice-bubble row helper (Task 11 review fix) — Missing Letter
  // and First Sound Match both offer 3 `.choice-bubble` buttons (correct
  // letter + 2 decoys) with identical click-wiring: correct tap disables
  // every bubble in the row and calls `onCorrect(letter, btn)` for the
  // caller to do its mode-specific completion work; wrong tap bounces just
  // that bubble back (via triggerBounceBack) with no sound and calls the
  // optional `onWrong(letter, btn)`. Builds and returns the `.bubble-row`
  // element; callers append it into their own wrapper.
  // ------------------------------------------------------------------
  function renderBubbleRow(options, correctLetter, onCorrect, onWrong) {
    const bounceGuards = new WeakSet();
    const row = document.createElement('div');
    row.className = 'bubble-row';
    options.forEach((letter) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-bubble';
      btn.textContent = letter;
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        if (letter === correctLetter) {
          Array.from(row.children).forEach((el) => { el.disabled = true; });
          onCorrect(letter, btn);
        } else {
          // Wrong tap: bounce-back animation only, no sound (per spec).
          triggerBounceBack(btn, bounceGuards);
          if (onWrong) onWrong(letter, btn);
        }
      });
      row.appendChild(btn);
    });
    return row;
  }

  // ------------------------------------------------------------------
  // Missing Letter mode (Task 10) — the word is shown with one letter
  // blanked out, and 3 choice bubbles (correct letter + 2 decoys, from
  // SpellLogic.buildMissingLetterChallenge) are offered below. Tapping the
  // correct bubble fills the blank, chimes, and completes the word;
  // tapping a decoy bounces just that bubble back with no sound, leaving
  // the blank open for another try. Renders directly into #challenge-area
  // (already cleared by renderChallenge()), following the same pattern as
  // renderBuildWord: local closure state, no Session/module-level mutation.
  // ------------------------------------------------------------------
  function renderMissingLetter(word, id) {
    const area = document.getElementById('challenge-area');
    if (!area) return;

    const challenge = SpellLogic.buildMissingLetterChallenge(word);
    const { displayLetters, missingLetter, options } = challenge;

    const wrap = document.createElement('div');
    wrap.className = 'missing-letter';

    const tileRow = document.createElement('div');
    tileRow.className = 'tile-row';
    let blankTile = null;
    displayLetters.forEach((letter) => {
      const tile = document.createElement('div');
      if (letter === null) {
        tile.className = 'tile tile--blank';
        blankTile = tile;
      } else {
        tile.className = 'tile tile--filled';
        tile.textContent = letter;
      }
      tileRow.appendChild(tile);
    });

    const bubbleRow = renderBubbleRow(options, missingLetter, (letter) => {
      blankTile.textContent = letter;
      blankTile.classList.remove('tile--blank');
      blankTile.classList.add('tile--filled');
      Engine.playChime('correct');

      // Filling the one blank always completes the word in this mode.
      handleWordComplete(word, id);
    });

    wrap.appendChild(tileRow);
    wrap.appendChild(bubbleRow);
    area.appendChild(wrap);
  }

  // ------------------------------------------------------------------
  // First Sound Match mode (Task 11) — the word's picture is shown and
  // spoken aloud (Engine.speak), with 3 choice bubbles (correct first
  // letter + 2 decoys, from SpellLogic.buildFirstSoundChallenge) below it.
  // Tapping the correct bubble chimes and completes the word immediately —
  // unlike Build the Word / Missing Letter there are no blanks to fill, one
  // correct tap is the whole challenge. Tapping a decoy bounces just that
  // bubble back with no sound, per spec. Follows the same local-closure,
  // no-Session-mutation pattern as the other two renderers.
  // ------------------------------------------------------------------
  function renderFirstSound(word, id) {
    const area = document.getElementById('challenge-area');
    if (!area) return;

    const challenge = SpellLogic.buildFirstSoundChallenge(word);
    const { correctLetter, options } = challenge;

    Engine.speak(word);

    const wrap = document.createElement('div');
    wrap.className = 'first-sound';

    const pictureWrap = document.createElement('div');
    pictureWrap.className = 'firstsound-picture';
    pictureWrap.innerHTML = PICTURES[id] || '';

    const bubbleRow = renderBubbleRow(options, correctLetter, () => {
      Engine.playChime('correct');

      // A single correct tap always completes this mode (no blanks).
      handleWordComplete(word, id);
    });

    wrap.appendChild(pictureWrap);
    wrap.appendChild(bubbleRow);
    area.appendChild(wrap);
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
  // Shared word-completion handler (Task 12) — called by all three modes
  // once a word is fully solved. Plays the completion chime, shows the
  // reward (Task 13: extracted into renderReward above), fills the pip,
  // then advances to the next word or — if this was the last word — shows
  // the end-of-session screen (Task 13).
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
  // manual/console inspection.
  window.SpellApp = {
    Session,
    showView,
    renderPips,
    startSession,
    renderChallenge,
    renderBuildWord,
    renderMissingLetter,
    renderFirstSound,
    renderReward,
    handleWordComplete,
    showEndOfSession,
  };
})();
