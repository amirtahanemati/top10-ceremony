/**
 * Formatting utilities for numbers, Persian digits, and rankings
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input) {
  if (input === undefined || input === null) return '';
  return String(input).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function formatNumber(val, usePersian = true) {
  if (val === undefined || val === null || isNaN(val)) return '-';
  const str = Number(val).toLocaleString('fa-IR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
  return usePersian ? str : Number(val).toFixed(2).replace(/\.00$/, '');
}

export function formatScore(score, usePersian = true) {
  if (score === undefined || score === null || isNaN(score)) return '۰';
  const formatted = Number(score).toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 1,
  });
  return usePersian ? toPersianDigits(formatted) : formatted;
}

export function getRankLabel(rank) {
  switch (Number(rank)) {
    case 1:
      return "قهرمان مسابقه";
    case 2:
      return "نایب قهرمان";
    case 3:
      return "مقام سوم";
    case 4:
      return "رتبه چهارم";
    case 5:
      return "رتبه پنجم";
    case 6:
      return "رتبه ششم";
    case 7:
      return "رتبه هفتم";
    case 8:
      return "رتبه هشتم";
    case 9:
      return "رتبه نهم";
    case 10:
      return "رتبه دهم";
    default:
      return `رتبه ${rank}`;
  }
}

export function getRankBadgeColors(rank) {
  switch (Number(rank)) {
    case 1:
      return {
        badgeBg: "from-amber-400 via-yellow-500 to-amber-600",
        border: "border-amber-400/80",
        text: "text-amber-300",
        shadow: "box-glow-gold",
        label: "قهرمان مسابقه",
        metal: "gold",
      };
    case 2:
      return {
        badgeBg: "from-slate-200 via-slate-400 to-zinc-500",
        border: "border-slate-300/80",
        text: "text-slate-200",
        shadow: "box-glow-silver",
        label: "نایب قهرمان",
        metal: "silver",
      };
    case 3:
      return {
        badgeBg: "from-amber-600 via-amber-700 to-amber-800",
        border: "border-amber-600/80",
        text: "text-amber-400",
        shadow: "box-glow-bronze",
        label: "مقام سوم",
        metal: "bronze",
      };
    default:
      return {
        badgeBg: "from-cyan-500 to-blue-600",
        border: "border-cyan-500/40",
        text: "text-cyan-400",
        shadow: "box-glow-cyan",
        label: `رتبه ${rank}`,
        metal: "standard",
      };
  }
}
