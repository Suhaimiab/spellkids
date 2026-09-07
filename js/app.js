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
    wordOrder: [],   // shuffled copy of WORDS for this session
    currentIndex: 0, // index into wordOrder
    modeBag: null,   // shuffle-bag over ['build', 'missing', 'firstsound']
    praiseBag: null, // shuffle-bag over PRAISE_LINES (consumed starting Task 12)
    completed: [],   // parallel to wordOrder: true once a word is solved
  };

  function startSession() {
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
  // renderer. Only 'build' (Build the Word) is implemented in Task 9;
  // 'missing' (Task 10) and 'firstsound' (Task 11) are stubs.
  //
  // TEMPORARY FALLBACK: until Tasks 10-11 land, the 'missing' and
  // 'firstsound' branches fall back to renderBuildWord() (with a
  // console.warn) instead of leaving #challenge-area blank — this keeps
  // every draw from Session.modeBag testable end-to-end in the browser
  // right now, since the bag can hand back any of the three modes on any
  // given word. Task 10/11's implementer: replace the matching branch's
  // body with the real renderer and delete its console.warn/fallback call.
  // ------------------------------------------------------------------
  function renderChallenge() {
    const entry = Session.wordOrder[Session.currentIndex];
    if (!entry) return;
    const mode = Session.modeBag.next();
    const area = document.getElementById('challenge-area');
    if (area) area.innerHTML = '';

    if (mode === 'build') {
      renderBuildWord(entry.word);
    } else if (mode === 'missing') {
      // TODO(Task 10): implement Missing Letter mode renderer here.
      console.warn('renderChallenge: "missing" mode not yet implemented (Task 10) — falling back to Build the Word');
      renderBuildWord(entry.word);
    } else if (mode === 'firstsound') {
      // TODO(Task 11): implement First Sound Match mode renderer here.
      console.warn('renderChallenge: "firstsound" mode not yet implemented (Task 11) — falling back to Build the Word');
      renderBuildWord(entry.word);
    }
  }

  // ------------------------------------------------------------------
  // Build the Word mode (Task 9) — blank tiles + a scrambled letter tray
  // containing only this word's letters. Tapping the next-needed letter
  // fills a tile and chimes; any other tap bounces that tile back with no
  // sound. Renders directly into #challenge-area per the module-level
  // render pattern established in Task 8 (no Session methods).
  // ------------------------------------------------------------------
  function renderBuildWord(word) {
    const area = document.getElementById('challenge-area');
    if (!area) return;

    let filledCount = 0;

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
          handleWordComplete(word);
        }
      } else {
        // Wrong tap: bounce-back animation only, no sound (per spec).
        btn.classList.remove('bounce-back');
        void btn.offsetWidth; // restart animation if tapped again quickly
        btn.classList.add('bounce-back');
        btn.addEventListener('animationend', () => btn.classList.remove('bounce-back'), { once: true });
      }
    }
  }

  // ------------------------------------------------------------------
  // PLACEHOLDER completion handler — Task 12 will replace this with the
  // real shared handler (picture wiggle animation, Engine.playChime
  // ('complete'), a spoken/shown personalized praise line drawn from
  // Session.praiseBag, filling the pip, then advancing after ~1.5s or
  // showing the end-of-session screen on the last word — Task 13).
  //
  // For now this just proves the mode is playable end-to-end: it logs,
  // plays the 'complete' chime, marks/fills the current pip, and after a
  // short delay advances to the next word (looping the dispatch through
  // renderChallenge()) so Build the Word can be exercised for more than
  // one round in manual testing. Task 12's implementer: replace this
  // function's body wholesale; nothing here needs to survive.
  // ------------------------------------------------------------------
  function handleWordComplete(word) {
    console.log('[placeholder] word complete:', word, '— Task 12 will add reward animation + praise');
    Engine.playChime('complete');
    Session.completed[Session.currentIndex] = true;
    renderPips('pips', Session.wordOrder.length, Session.completed);

    setTimeout(() => {
      Session.currentIndex++;
      if (Session.currentIndex < Session.wordOrder.length) {
        renderChallenge();
      } else {
        console.log('[placeholder] session complete — Task 13 will show the end-of-session view');
      }
    }, 1500);
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
    handleWordComplete,
  };
})();
