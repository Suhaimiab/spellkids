// js/modes.js — challenge-mode renderers (Build the Word, Missing Letter,
// First Sound Match), extracted from js/app.js.
//
// This is a pure move (code-review follow-up before the final full-playtest
// task): no logic changes, no behavior changes. Depends on SpellLogic
// (logic.js), Engine (engine.js) and PICTURES (pictures.js) already being
// loaded, and on app.js calling in via window.SpellModes below. Each
// renderer calls back into `SpellApp.handleWordComplete(word, id)` once a
// word is solved — app.js still owns Session state and the completion/
// reward/end-of-session flow.

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // Shared wrong-tap "bounce-back" animation helper (Task 9/10 review fix).
  // Restarts the CSS bounce-back animation on `el` and cleans up the class
  // once it ends. Guarded per-element via `guardSet` (a WeakSet the caller
  // owns for its own set of buttons/bubbles) so rapid repeat wrong-taps on
  // the same element don't stack up duplicate animationend listeners.
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // Shared word-picture element (playtest fix, Task 14) — per spec, every
  // round "remains fully playable via the picture and on-screen letters
  // alone," and Build the Word is spelled out explicitly as "blank tiles
  // shown below the picture." All three modes need the picture visible
  // during play, not just First Sound Match. Returns a fresh
  // `.challenge-picture` wrapper looked up from PICTURES by id.
  // ------------------------------------------------------------------
  function buildPictureElement(id) {
    const pictureWrap = document.createElement('div');
    pictureWrap.className = 'challenge-picture';
    pictureWrap.innerHTML = PICTURES[id] || '';
    return pictureWrap;
  }

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

    Engine.speak(word);

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

    wrap.appendChild(buildPictureElement(id));
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
          window.SpellApp.handleWordComplete(word, id);
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

    Engine.speak(word);

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
      window.SpellApp.handleWordComplete(word, id);
    });

    wrap.appendChild(buildPictureElement(id));
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

    const pictureWrap = buildPictureElement(id);

    const bubbleRow = renderBubbleRow(options, correctLetter, () => {
      Engine.playChime('correct');

      // A single correct tap always completes this mode (no blanks).
      window.SpellApp.handleWordComplete(word, id);
    });

    wrap.appendChild(pictureWrap);
    wrap.appendChild(bubbleRow);
    area.appendChild(wrap);
  }

  // Exposed for app.js's renderChallenge() dispatch and for manual/console
  // inspection. triggerBounceBack/renderBubbleRow stay internal — nothing
  // outside these three renderers calls them.
  window.SpellModes = {
    renderBuildWord,
    renderMissingLetter,
    renderFirstSound,
  };
})();
