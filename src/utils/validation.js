/**
 * Data validation service for contest results
 */

export function validateContestData(data) {
  const errors = [];
  const warnings = [];

  if (!data) {
    return {
      isValid: false,
      errors: ["اطلاعات ورودی خالی است."],
      warnings: [],
      sanitizedTeams: [],
    };
  }

  const teams = Array.isArray(data) ? data : data.teams;

  if (!Array.isArray(teams)) {
    return {
      isValid: false,
      errors: ["ساختار داده‌ها نامعتبر است؛ لیست تیم‌ها یافت نشد."],
      warnings: [],
      sanitizedTeams: [],
    };
  }

  if (teams.length !== 10) {
    errors.push(
      `تعداد تیم‌های ورودی باید دقیقاً ۱۰ تیم باشد. تعداد فعلی: ${teams.length} تیم`
    );
  }

  const seenRanks = new Set();
  const seenNames = new Set();
  const sanitizedTeams = [];

  teams.forEach((t, index) => {
    const rowNum = index + 1;
    const name = (t.name || "").trim();
    const rank = Number(t.rank);
    const score = Number(t.score);

    if (!name) {
      errors.push(`ردیف ${rowNum}: نام تیم نمی‌تواند خالی باشد.`);
    } else {
      if (seenNames.has(name.toLowerCase())) {
        warnings.push(`هشدار: نام تیم تکراری «${name}» در لیست وجود دارد.`);
      }
      seenNames.add(name.toLowerCase());
    }

    if (isNaN(rank) || !Number.isInteger(rank) || rank < 1 || rank > 10) {
      errors.push(
        `ردیف ${rowNum} (${name || 'بدون نام'}): رتبه باید یک عدد صحیح بین ۱ تا ۱۰ باشد (مقدار فعلی: ${t.rank}).`
      );
    } else {
      if (seenRanks.has(rank)) {
        errors.push(`رتبه تکراری ${rank} برای چند تیم ثبت شده است.`);
      }
      seenRanks.add(rank);
    }

    if (isNaN(score)) {
      errors.push(`ردیف ${rowNum} (${name}): امتیاز باید عددی معتبر باشد.`);
    } else if (score < 0) {
      warnings.push(`ردیف ${rowNum} (${name}): امتیاز منفی ثبت شده است (${score}).`);
    }

    sanitizedTeams.push({
      rank: isNaN(rank) ? index + 1 : rank,
      name: name || `تیم ${index + 1}`,
      score: isNaN(score) ? 0 : score,
      members: (t.members || "").trim(),
      org: (t.org || "").trim(),
      color: t.color || "#06b6d4",
      badge: t.badge || `رتبه ${rank}`,
    });
  });

  // Verify full sequence 1..10 if count is 10
  if (teams.length === 10) {
    for (let r = 1; r <= 10; r++) {
      if (!seenRanks.has(r)) {
        errors.push(`رتبه ${r} در لیست تیم‌ها غایب است.`);
      }
    }
  }

  // Sort by rank ascending
  sanitizedTeams.sort((a, b) => a.rank - b.rank);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedTeams,
  };
}

/**
 * Parse CSV format text into structured teams
 * Supports headers: rank, name, score, [members, org]
 */
export function parseCSVTeams(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error("فایل CSV باید شامل سطر سرستون و حداقل یک سطر اطلاعات باشد.");
  }

  const headerLine = lines[0].toLowerCase();
  const headers = headerLine.split(/[,;\t]/).map((h) => h.trim().replace(/^["']|["']$/g, ''));

  const rankIdx = headers.findIndex((h) => h === "rank" || h === "رتبه");
  const nameIdx = headers.findIndex((h) => h === "name" || h === "نام" || h === "تیم");
  const scoreIdx = headers.findIndex((h) => h === "score" || h === "امتیاز");
  const membersIdx = headers.findIndex((h) => h === "members" || h === "اعضا");
  const orgIdx = headers.findIndex((h) => h === "org" || h === "سازمان" || h === "دانشگاه");

  if (nameIdx === -1 || scoreIdx === -1) {
    throw new Error(
      "سرستون‌های فایل CSV باید حداقل شامل 'name' (یا نام) و 'score' (یا امتیاز) باشند."
    );
  }

  const teams = [];
  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(/[,;\t]/).map((c) => c.trim().replace(/^["']|["']$/g, ''));
    if (rawCols.length <= 1 && !rawCols[0]) continue;

    const rankVal = rankIdx !== -1 ? parseInt(rawCols[rankIdx], 10) : i;
    const nameVal = rawCols[nameIdx] || `تیم ${i}`;
    const scoreVal = parseFloat(rawCols[scoreIdx]) || 0;
    const membersVal = membersIdx !== -1 ? rawCols[membersIdx] || "" : "";
    const orgVal = orgIdx !== -1 ? rawCols[orgIdx] || "" : "";

    teams.push({
      rank: rankVal,
      name: nameVal,
      score: scoreVal,
      members: membersVal,
      org: orgVal,
    });
  }

  return teams;
}

/**
 * Parse JSON format text
 */
export function parseJSONTeams(jsonText) {
  const parsed = JSON.parse(jsonText);
  if (Array.isArray(parsed)) {
    return { title: null, teams: parsed };
  }
  if (parsed && Array.isArray(parsed.teams)) {
    return {
      title: parsed.contestTitle || parsed.title || null,
      organizer: parsed.organizer || null,
      teams: parsed.teams,
    };
  }
  throw new Error("ساختار JSON نامعتبر است. باید یک آرایه از تیم‌ها یا یک شیء شامل کلید 'teams' باشد.");
}
