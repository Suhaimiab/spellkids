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
  window.SpellApp = { Session, showView, renderPips, startSession };
})();
