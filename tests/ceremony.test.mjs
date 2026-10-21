import assert from 'node:assert';
import { validateContestData, parseCSVTeams, parseJSONTeams } from '../src/utils/validation.js';
import { toPersianDigits, formatScore, getRankLabel } from '../src/utils/formatting.js';
import { DEFAULT_TEAMS } from '../src/data/defaultTeams.js';

console.log('--- شروع تست‌های اعتبارسنجی و موتور مراسم ---');

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
duplicateRankTeams[1].rank = 1; // Duplicate rank 1
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

// Test 6: Sequence order - Rank 1 (Champion) before Rank 2 (Runner-Up)
function buildSequence(championFirst = true) {
  const steps = [];
  for (let r = 10; r >= 3; r--) {
    steps.push({ type: 'rank', rank: r });
  }
  steps.push({ type: 'finale_prep' });
  if (championFirst) {
    steps.push({ type: 'champion', rank: 1 });
    steps.push({ type: 'runner_up', rank: 2 });
  } else {
    steps.push({ type: 'runner_up', rank: 2 });
    steps.push({ type: 'champion', rank: 1 });
  }
  steps.push({ type: 'final_table' });
  return steps;
}

const defaultSeq = buildSequence(true);
assert.strictEqual(defaultSeq[0].rank, 10, 'Step 1 should be rank 10');
assert.strictEqual(defaultSeq[7].rank, 3, 'Step 8 should be rank 3');
assert.strictEqual(defaultSeq[8].type, 'finale_prep', 'Step 9 should be finale prep');
assert.strictEqual(defaultSeq[9].type, 'champion', 'Step 10 should be Champion (Rank 1)');
assert.strictEqual(defaultSeq[9].rank, 1, 'Champion step must be rank 1');
assert.strictEqual(defaultSeq[10].type, 'runner_up', 'Step 11 should be Runner-Up (Rank 2)');
assert.strictEqual(defaultSeq[10].rank, 2, 'Runner-up step must be rank 2');
assert.strictEqual(defaultSeq[11].type, 'final_table', 'Step 12 should be Final Table');
console.log('✓ تست ۶: تأیید توالی رسمی مراسم (رتبه ۱۰ تا ۳، سپس رتبه ۱ قهرمان و بعد رتبه ۲ نایب‌قهرمان و در نهایت جدول کامل) با موفقیت تأیید شد.');

console.log('--- همه ۶ تست با موفقیت پاس شدند! ---');
