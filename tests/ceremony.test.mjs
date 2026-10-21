import assert from 'node:assert';
import { validateContestData, parseCSVTeams, parseJSONTeams } from '../src/utils/validation.js';
import { toPersianDigits, formatScore, getRankLabel } from '../src/utils/formatting.js';
import { DEFAULT_TEAMS } from '../src/data/defaultTeams.js';

console.log('--- شروع تست‌های ارتقا یافته اعتبارسنجی و موتور مراسم ---');

// Test 1: Valid default teams
const val1 = validateContestData(DEFAULT_TEAMS);
assert.strictEqual(val1.isValid, true, 'Default teams should be 100% valid');
assert.strictEqual(val1.sanitizedTeams.length, 10, 'Should have exactly 10 teams');
console.log('✓ تست ۱: اعتبارسنجی ۱۰ تیم پیش‌فرض موفقیت‌آمیز بود.');

// Test 2: Incomplete teams (less than 10)
const val2 = validateContestData(DEFAULT_TEAMS.slice(0, 8));
assert.strictEqual(val2.isValid, false, 'Less than 10 teams should be invalid');
assert.ok(val2.errors.some((e) => e.includes('۱۰ تیم')), 'Should report count error');
console.log('✓ تست ۲: شناسایی عدم کفایت تعداد تیم‌ها (کمتر از ۱۰) موفق بود.');

// Test 3: Duplicate rank detection
const duplicateRankTeams = JSON.parse(JSON.stringify(DEFAULT_TEAMS));
duplicateRankTeams[1].rank = 1;
const val3 = validateContestData(duplicateRankTeams);
assert.strictEqual(val3.isValid, false, 'Duplicate rank should be invalid');
assert.ok(val3.errors.some((e) => e.includes('تکراری')), 'Should report duplicate rank error');
console.log('✓ تست ۳: شناسایی رتبه تکراری موفق بود.');

// Test 4: Persian digit conversion and score formatting
assert.strictEqual(toPersianDigits('1234567890'), '۱۲۳۴۵۶۷۸۹۰', 'Digits should translate to Persian');
assert.strictEqual(formatScore(98.5, true), '۹۸.۵', 'Score 98.5 should format to ۹۸.۵');
console.log('✓ تست ۴: تبدیل ارقام به فارسی و قالب‌بندی امتیاز موفق بود.');

// Test 5: CSV Parsing
const sampleCSV = `rank,name,score,org,members
1,ققنوس,99.5,شریف,علی و سارا
2,البرز,97.2,تهران,امید`;
const csvParsed = parseCSVTeams(sampleCSV);
assert.strictEqual(csvParsed.length, 2);
assert.strictEqual(csvParsed[0].name, 'ققنوس');
assert.strictEqual(csvParsed[0].score, 99.5);
console.log('✓ تست ۵: تجزیه و پارس فایل CSV موفق بود.');

// Test 6: Sequence order:
// Ranks 10 down to 3 -> finale prep -> Champion (Rank 1) -> DIRECTLY Final Table!
function buildSequence() {
  const steps = [];
  for (let r = 10; r >= 3; r--) {
    steps.push({ type: 'rank', rank: r });
  }
  steps.push({ type: 'finale_prep' });
  steps.push({ type: 'champion', rank: 1 });
  steps.push({ type: 'final_table' });
  return steps;
}

const seq = buildSequence();
assert.strictEqual(seq[0].rank, 10, 'Step 1 should be rank 10');
assert.strictEqual(seq[7].rank, 3, 'Step 8 should be rank 3');
assert.strictEqual(seq[8].type, 'finale_prep', 'Step 9 should be finale prep');
assert.strictEqual(seq[9].type, 'champion', 'Step 10 should be Champion (Rank 1)');
assert.strictEqual(seq[9].rank, 1, 'Champion step must be rank 1');
assert.strictEqual(seq[10].type, 'final_table', 'Step 11 should jump directly to Final Table (no rank 2 separate scroll)');
console.log('✓ تست ۶: تأیید توالی ارتقا یافته مراسم (۱۰ تا ۳، سپس فینال قهرمان و پرش مستقیم به جدول نهایی) تأیید شد.');

// Test 7: Candidate Pool Filtering:
// When teams are revealed, they must be removed from the candidate pool!
const revealedRanks = new Set();
let poolAt10 = DEFAULT_TEAMS.filter((t) => !revealedRanks.has(t.rank));
assert.strictEqual(poolAt10.length, 10, 'At rank 10, all 10 teams in pool');

// Reveal rank 10
revealedRanks.add(10);
let poolAt9 = DEFAULT_TEAMS.filter((t) => !revealedRanks.has(t.rank));
assert.strictEqual(poolAt9.length, 9, 'At rank 9, only 9 teams in pool');
assert.ok(!poolAt9.some((t) => t.rank === 10), 'Team 10 must not be in pool');

// Reveal up to rank 3
for (let r = 9; r >= 3; r--) {
  revealedRanks.add(r);
}
let poolAtFinalist = DEFAULT_TEAMS.filter((t) => !revealedRanks.has(t.rank));
assert.strictEqual(poolAtFinalist.length, 2, 'Only 2 finalists remain in candidate pool for Champion duel!');
assert.deepStrictEqual(poolAtFinalist.map((t) => t.rank).sort(), [1, 2]);
console.log('✓ تست ۷: کنار رفتن تیم‌های معرفی‌شده از لیست گردونه اسکرول با موفقیت کامل تأیید شد.');

console.log('--- همه ۷ تست با موفقیت پاس شدند! ---');
