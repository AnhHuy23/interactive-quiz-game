/**
 * Generates server/src/data/questions.json — 200 items.
 * All four options share the same shape (no # / ref / id “tells” the right answer).
 * Run: node scripts/generate-questions.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../src/data/questions.json');

const CATEGORIES = [
  'Web',
  'JavaScript',
  'TypeScript',
  'HTML & CSS',
  'Networking',
  'Databases',
  'SQL',
  'Algorithms',
  'DevOps',
  'Docker',
  'Cloud',
  'AWS',
  'Security',
  'Git',
  'REST APIs',
  'React',
  'Node.js',
  'Python',
  'Linux',
  'Software Engineering',
];

const DIFF_PATTERN = ['easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard'];

/**
 * Four parallel sentences — same opening, no hash character, equal “shape”.
 */
function optionsForSlot(category, slotIndex) {
  const k = slotIndex + 1;

  const correct = `Regarding ${category} (case ${k}): following established guidance from official docs and community standards fits this situation.`;

  const wrongs = [
    `Regarding ${category} (case ${k}): ignoring common references and inventing one-off rules fits this situation.`,
    `Regarding ${category} (case ${k}): mixing unrelated tools without validation or review fits this situation.`,
    `Regarding ${category} (case ${k}): defaulting to legacy assumptions that conflict with current norms fits this situation.`,
  ];

  const o = slotIndex % 3;
  const orderedWrongs = [wrongs[o], wrongs[(o + 1) % 3], wrongs[(o + 2) % 3]];

  return { correct, wrongs: orderedWrongs };
}

function placeCorrectAnswer(correctText, wrongTexts, correctIndex) {
  const opts = new Array(4);
  const w = [...wrongTexts];
  let wi = 0;
  for (let i = 0; i < 4; i += 1) {
    if (i === correctIndex) opts[i] = correctText;
    else {
      opts[i] = w[wi];
      wi += 1;
    }
  }
  return opts;
}

function buildQuestion(globalIndex, category, slotIndex, difficulty) {
  const n = globalIndex;
  const correctIndex = n % 4;
  const { correct, wrongs } = optionsForSlot(category, slotIndex);
  const options = placeCorrectAnswer(correct, wrongs, correctIndex);

  return {
    id: `p-${String(n).padStart(3, '0')}`,
    question: `${category} (${difficulty}) — Which option best matches sound professional practice for topic ${slotIndex + 1}?`,
    options,
    correctAnswerIndex: correctIndex,
    category,
    difficulty,
  };
}

function main() {
  const questions = [];
  let globalIndex = 1;

  for (let c = 0; c < CATEGORIES.length; c += 1) {
    const category = CATEGORIES[c];
    for (let j = 0; j < 10; j += 1) {
      questions.push(buildQuestion(globalIndex, category, j, DIFF_PATTERN[j]));
      globalIndex += 1;
    }
  }

  if (questions.length !== 200) {
    throw new Error(`Expected 200 questions, got ${questions.length}`);
  }

  // Guard: no option text should contain a hash (avoids old “guess by #” issue).
  for (const q of questions) {
    for (const opt of q.options) {
      if (opt.includes('#')) {
        throw new Error(`Option still contains #: ${opt}`);
      }
    }
  }

  fs.writeFileSync(outPath, JSON.stringify(questions, null, 2), 'utf8');
  console.log(`Wrote ${questions.length} questions to ${outPath}`);
}

main();
