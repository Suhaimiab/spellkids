// tests/logic.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  shuffle,
  scrambleLetters,
  nextNeededLetter,
  isWordComplete,
  pickDecoyLetters,
  buildMissingLetterChallenge,
  buildFirstSoundChallenge,
  createShuffleBag,
} = require('../js/logic.js');

test('shuffle returns a permutation of the same items', () => {
  const input = [1, 2, 3, 4, 5];
  const result = shuffle(input);
  assert.deepEqual([...result].sort(), [...input].sort());
  assert.equal(result.length, input.length);
});

test('shuffle does not mutate the input array', () => {
  const input = [1, 2, 3];
  shuffle(input);
  assert.deepEqual(input, [1, 2, 3]);
});

test('scrambleLetters returns the same letters as the word', () => {
  const scrambled = scrambleLetters('CAT');
  assert.deepEqual([...scrambled].sort(), ['A', 'C', 'T'].sort());
});

test('scrambleLetters is not already in original order (for length > 1)', () => {
  // Run many times since scrambling is random; the function must guarantee
  // it never returns the original order for words longer than 1 letter.
  for (let i = 0; i < 200; i++) {
    const scrambled = scrambleLetters('CAT');
    assert.notEqual(scrambled.join(''), 'CAT');
  }
});

test('nextNeededLetter returns the letter at the current fill position', () => {
  assert.equal(nextNeededLetter('CAT', 0), 'C');
  assert.equal(nextNeededLetter('CAT', 1), 'A');
  assert.equal(nextNeededLetter('CAT', 2), 'T');
});

test('nextNeededLetter returns null when word is already complete', () => {
  assert.equal(nextNeededLetter('CAT', 3), null);
});

test('isWordComplete is true only when filledCount reaches word length', () => {
  assert.equal(isWordComplete('CAT', 2), false);
  assert.equal(isWordComplete('CAT', 3), true);
});

test('pickDecoyLetters never includes an excluded letter', () => {
  const decoys = pickDecoyLetters(['C', 'A', 'T'], 5);
  for (const letter of decoys) {
    assert.equal(['C', 'A', 'T'].includes(letter), false);
  }
});

test('pickDecoyLetters returns the requested count', () => {
  assert.equal(pickDecoyLetters(['C', 'A', 'T'], 2).length, 2);
});

test('buildMissingLetterChallenge blanks exactly one letter and includes it in options', () => {
  const challenge = buildMissingLetterChallenge('CAT');
  const blankCount = challenge.displayLetters.filter((l) => l === null).length;
  assert.equal(blankCount, 1);
  assert.equal(challenge.displayLetters[challenge.missingIndex], null);
  assert.ok(challenge.options.includes(challenge.missingLetter));
  assert.equal(challenge.options.length, 3);
});

test('buildFirstSoundChallenge correct letter is the word\'s first letter', () => {
  const challenge = buildFirstSoundChallenge('DOG');
  assert.equal(challenge.correctLetter, 'D');
  assert.ok(challenge.options.includes('D'));
  assert.equal(challenge.options.length, 3);
});

test('createShuffleBag never repeats an item until all items are used once', () => {
  const bag = createShuffleBag(['a', 'b', 'c']);
  const drawn = [bag.next(), bag.next(), bag.next()];
  assert.deepEqual([...drawn].sort(), ['a', 'b', 'c']);
});

test('createShuffleBag refills after exhausting all items', () => {
  const bag = createShuffleBag(['a', 'b']);
  const drawn = [bag.next(), bag.next(), bag.next(), bag.next()];
  assert.equal(drawn.length, 4);
  // first 2 and second 2 are each a permutation of ['a','b']
  assert.deepEqual([...drawn.slice(0, 2)].sort(), ['a', 'b']);
  assert.deepEqual([...drawn.slice(2, 4)].sort(), ['a', 'b']);
});

test('createShuffleBag never draws the same item twice in a row across refill boundaries', () => {
  const bag = createShuffleBag(['a', 'b', 'c']);
  let previous = null;
  for (let i = 0; i < 60; i++) {
    const current = bag.next();
    if (previous !== null) {
      assert.notEqual(current, previous);
    }
    previous = current;
  }
});

test('scrambleLetters handles a word with a duplicate letter (BEE)', () => {
  for (let i = 0; i < 50; i++) {
    const scrambled = scrambleLetters('BEE');
    assert.deepEqual([...scrambled].sort(), ['B', 'E', 'E'].sort());
  }
});

test('buildMissingLetterChallenge handles a word with a duplicate letter (BEE)', () => {
  for (let i = 0; i < 20; i++) {
    const challenge = buildMissingLetterChallenge('BEE');
    const blankCount = challenge.displayLetters.filter((l) => l === null).length;
    assert.equal(blankCount, 1);
    assert.equal(challenge.displayLetters[challenge.missingIndex], null);
    assert.ok(challenge.options.includes(challenge.missingLetter));
    assert.equal(challenge.options.length, 3);
  }
});

test('buildFirstSoundChallenge handles a word with a duplicate letter (BEE)', () => {
  const challenge = buildFirstSoundChallenge('BEE');
  assert.equal(challenge.correctLetter, 'B');
  assert.ok(challenge.options.includes('B'));
  assert.equal(challenge.options.length, 3);
});
