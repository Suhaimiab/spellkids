// js/logic.js
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function scrambleLetters(word) {
  const letters = word.split('');
  let scrambled = shuffle(letters);
  let attempts = 0;
  while (scrambled.join('') === word && letters.length > 1 && attempts < 20) {
    scrambled = shuffle(letters);
    attempts++;
  }
  return scrambled;
}

function nextNeededLetter(word, filledCount) {
  return filledCount < word.length ? word[filledCount] : null;
}

function isWordComplete(word, filledCount) {
  return filledCount >= word.length;
}

function pickDecoyLetters(excludeLetters, count) {
  const pool = ALPHABET.filter((l) => !excludeLetters.includes(l));
  return shuffle(pool).slice(0, count);
}

function buildMissingLetterChallenge(word) {
  const missingIndex = Math.floor(Math.random() * word.length);
  const missingLetter = word[missingIndex];
  const displayLetters = word.split('').map((l, i) => (i === missingIndex ? null : l));
  const decoys = pickDecoyLetters(word.split(''), 2);
  const options = shuffle([missingLetter, ...decoys]);
  return { displayLetters, missingIndex, missingLetter, options };
}

function buildFirstSoundChallenge(word) {
  const correctLetter = word[0];
  const decoys = pickDecoyLetters(word.split(''), 2);
  const options = shuffle([correctLetter, ...decoys]);
  return { correctLetter, options };
}

function createShuffleBag(items) {
  let bag = [];
  let lastReturned = null;
  const uniqueCount = new Set(items).size;
  function refill() {
    bag = shuffle(items);
    let attempts = 0;
    while (
      uniqueCount > 1 &&
      bag.length > 0 &&
      bag[bag.length - 1] === lastReturned &&
      attempts < 20
    ) {
      bag = shuffle(items);
      attempts++;
    }
  }
  return {
    next() {
      if (bag.length === 0) refill();
      const item = bag.pop();
      lastReturned = item;
      return item;
    },
  };
}

const SpellLogic = {
  shuffle,
  scrambleLetters,
  nextNeededLetter,
  isWordComplete,
  pickDecoyLetters,
  buildMissingLetterChallenge,
  buildFirstSoundChallenge,
  createShuffleBag,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpellLogic;
}
if (typeof window !== 'undefined') {
  window.SpellLogic = SpellLogic;
}
