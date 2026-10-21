import React, { useState } from 'react';
import { validateContestData } from '../../utils/validation';
import { BulkDataModal } from './BulkDataModal';
import { DEFAULT_TEAMS } from '../../data/defaultTeams';
import {
  Plus,
  Trash2,
  Upload,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';

export const ResultsEditor = ({ teams, onUpdateTeams, onValidateStatus }) => {
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const validation = validateContestData(teams);

  const handleRowChange = (index, field, value) => {
    const updated = [...teams];
    let val = value;
    if (field === 'rank') {
      val = parseInt(value, 10) || '';
    } else if (field === 'score') {
      val = parseFloat(value) || 0;
    }
    updated[index] = { ...updated[index], [field]: val };
    onUpdateTeams(updated);
  };

  const handleAddRow = () => {
    const nextRank = teams.length + 1;
    const newTeam = {
      rank: nextRank <= 10 ? nextRank : '',
      name: `تیم جدید ${nextRank}`,
      score: 75.0,
      org: '',
      members: '',
      color: '#06b6d4',
    };
    onUpdateTeams([...teams, newTeam]);
  };

  const handleDeleteRow = (index) => {
    const updated = teams.filter((_, i) => i !== index);
    onUpdateTeams(updated);
  };

  const handleSortByRank = () => {
    const sorted = [...teams].sort((a, b) => (Number(a.rank) || 99) - (Number(b.rank) || 99));
    onUpdateTeams(sorted);
  };

  const handleSortByScore = () => {
    // Sort descending by score and re-assign ranks 1..10
    const sorted = [...teams].sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
    const reRanked = sorted.map((t, idx) => ({ ...t, rank: idx + 1 }));
    onUpdateTeams(reRanked);
  };

  const handleResetDefaults = () => {
    onUpdateTeams(DEFAULT_TEAMS);
    setResetConfirmOpen(false);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ teams }, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "contest_results_top10.json");
    dl.click();
  };

  const handleExportCSV = () => {
    let csv = "rank,name,score,org,members\n";
    teams.forEach((t) => {
      csv += `${t.rank},"${t.name || ''}",${t.score},"${t.org || ''}","${t.members || ''}"\n`;
    });
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "contest_results_top10.csv");
    dl.click();
  };

  return (
    <div className="flex flex-col gap-6 text-right select-none animate-fade-in">
      {/* Top Validation Banner */}
      <div
        className={`p-4 md:p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg ${
          validation.isValid
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            : 'bg-amber-950/50 border-amber-500/60 text-amber-200'
        }`}
      >
        <div className="flex items-start gap-3">
          {validation.isValid ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="font-bold text-base md:text-lg">
              {validation.isValid
                ? "داده‌های داوری آماده و معتبر هستند"
                : "نیازمند اعتبارسنجی پیش از شروع مراسم"}
            </h3>
            <p className="text-xs md:text-sm mt-0.5 opacity-90">
              {validation.isValid
                ? "دقیقاً ۱۰ تیم با رتبه‌های بدون نقص ۱ تا ۱۰ در سیستم ثبت شده‌اند."
                : validation.errors[0] || "تعداد و رتبه تیم‌ها را بررسی کنید."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-numeric border ${
              teams.length === 10
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}
          >
            تعداد: {teams.length} / ۱۰ تیم
          </span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsBulkOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs md:text-sm shadow-md transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>ورود گروهی (CSV / JSON)</span>
          </button>

          <button
            onClick={handleAddRow}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium border border-slate-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>افزودن تیم</span>
          </button>

          <button
            onClick={handleSortByRank}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium border border-slate-700 transition cursor-pointer"
            title="مرتب‌سازی بر اساس رتبه"
          >
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span>مرتب‌سازی رتبه</span>
          </button>

          <button
            onClick={handleSortByScore}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium border border-slate-700 transition cursor-pointer"
            title="محاسبه خودکار رتبه بر اساس بیشترین امتیاز"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>رتبه‌بندی بر اساس امتیاز</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            title="دانلود خروجی JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            title="دانلود خروجی CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 text-xs font-medium border border-slate-700 hover:border-red-500/40 transition"
            title="بازنشانی اطلاعات"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی پیش‌فرض</span>
          </button>
        </div>
      </div>

      {/* Editable Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 text-xs font-bold">
                <th className="py-3 px-3 text-center w-20">رتبه</th>
                <th className="py-3 px-4 min-w-[200px]">نام تیم *</th>
                <th className="py-3 px-3 w-28 text-center">امتیاز *</th>
                <th className="py-3 px-4 min-w-[180px]">سازمان / دانشگاه</th>
                <th className="py-3 px-4 min-w-[220px]">نام اعضای تیم</th>
                <th className="py-3 px-3 text-center w-16">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs md:text-sm">
              {teams.map((team, idx) => {
                const isChampion = Number(team.rank) === 1;
                const isRunnerUp = Number(team.rank) === 2;
                const isThird = Number(team.rank) === 3;

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-900/50 transition-colors ${
                      isChampion
                        ? 'bg-amber-500/5'
                        : isRunnerUp
                        ? 'bg-slate-400/5'
                        : isThird
                        ? 'bg-amber-700/5'
                        : ''
                    }`}
                  >
                    {/* Rank Input */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={team.rank}
                        onChange={(e) => handleRowChange(idx, 'rank', e.target.value)}
                        className={`w-14 text-center py-1.5 rounded-lg border font-numeric font-bold focus:outline-none transition ${
                          isChampion
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : isRunnerUp
                            ? 'bg-slate-700/50 border-slate-500/50 text-slate-200'
                            : isThird
                            ? 'bg-amber-800/20 border-amber-600/50 text-amber-400'
                            : 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500'
                        }`}
                      />
                    </td>

                    {/* Team Name */}
                    <td className="py-2.5 px-4">
                      <input
                        type="text"
                        value={team.name}
                        onChange={(e) => handleRowChange(idx, 'name', e.target.value)}
                        placeholder="نام تیم مسابقه..."
                        className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-white font-medium focus:outline-none transition"
                      />
                    </td>

                    {/* Score */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        step="0.01"
                        value={team.score}
                        onChange={(e) => handleRowChange(idx, 'score', e.target.value)}
                        className="w-24 text-center bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-lg px-2 py-1.5 text-amber-300 font-numeric font-bold focus:outline-none transition"
                      />
                    </td>

                    {/* Organization / Affiliation */}
                    <td className="py-2.5 px-4">
                      <input
                        type="text"
                        value={team.org || ''}
                        onChange={(e) => handleRowChange(idx, 'org', e.target.value)}
                        placeholder="دانشگاه یا نهاد..."
                        className="w-full bg-slate-900/60 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none transition"
                      />
                    </td>

                    {/* Members */}
                    <td className="py-2.5 px-4">
                      <input
                        type="text"
                        value={team.members || ''}
                        onChange={(e) => handleRowChange(idx, 'members', e.target.value)}
                        placeholder="اسامی اعضا..."
                        className="w-full bg-slate-900/60 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none transition"
                      />
                    </td>

                    {/* Delete action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleDeleteRow(idx)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="حذف تیم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Data Modal */}
      <BulkDataModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onImport={(imported) => onUpdateTeams(imported)}
      />

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full text-right shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">تأیید بازنشانی نتایج</h3>
            <p className="text-sm text-slate-300 mb-6">
              آیا مطمئن هستید که می‌خواهید اطلاعات فعلی را با ۱۰ تیم نمونه پیش‌فرض جایگزین کنید؟ اطلاعات ذخیره‌شده جاری بازنویسی خواهد شد.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
              >
                انصراف
              </button>
              <button
                onClick={handleResetDefaults}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg"
              >
                بله، بازنشانی شود
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
