import React from 'react';
import { Trophy, Crown, Medal, Award, Sparkles, Building } from 'lucide-react';
import { formatScore, toPersianDigits } from '../../utils/formatting';

export const FinalLeaderboard = ({ teams, config }) => {
  const sortedTeams = [...teams].sort((a, b) => a.rank - b.rank);
  const usePersian = config.usePersianDigits !== false;

  return (
    <div className="relative z-10 flex flex-col items-center justify-start text-center px-4 md:px-8 py-6 w-full max-w-7xl mx-auto min-h-screen select-none font-dana animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col items-center mb-8">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900/90 border border-cyan-500/50 text-cyan-300 text-sm md:text-base font-peyda font-bold mb-3 shadow-lg backdrop-blur-md">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>جدول رده‌بندی رسمی و پایانی اختتامیه</span>
        </div>
        <h1 className="text-2xl md:text-5xl font-rokh font-black text-white tracking-tight mb-2 drop-shadow-md">
          ۱۰ تیم برتر {config.contestTitle || "مسابقه"}
        </h1>
        <p className="text-slate-400 font-dana text-xs md:text-sm">
          ثبت نهایی نتایج، مدال‌آوران و کارنامه کلی رقابت
        </p>
      </div>

      {/* Main Leaderboard Table Container */}
      <div className="w-full rounded-3xl bg-slate-950/85 border border-slate-800/90 shadow-2xl backdrop-blur-2xl overflow-hidden p-3 md:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse font-dana">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-peyda text-xs md:text-sm font-bold">
                <th className="py-3 px-3 md:px-6 w-20 md:w-28 text-center">رتبه</th>
                <th className="py-3 px-3 md:px-6">نام تیم</th>
                <th className="py-3 px-3 md:px-6 hidden sm:table-cell">مشخصات و دانشگاه</th>
                <th className="py-3 px-3 md:px-6 w-32 md:w-44 text-left">امتیاز نهایی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedTeams.map((team, idx) => {
                const isChampion = team.rank === 1;
                const isRunnerUp = team.rank === 2;
                const isThird = team.rank === 3;

                let rowBg = "hover:bg-slate-900/40 transition-colors";
                let rankBadge = (
                  <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-numeric font-bold text-base md:text-lg">
                    {usePersian ? toPersianDigits(team.rank) : team.rank}
                  </span>
                );

                if (isChampion) {
                  rowBg = "bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border-amber-500/50 shadow-md";
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 font-numeric font-black text-base md:text-lg shadow-lg" title="قهرمان مسابقه">
                      <Crown className="w-5 h-5 text-slate-950" />
                    </span>
                  );
                } else if (isRunnerUp) {
                  rowBg = "bg-gradient-to-r from-slate-400/20 via-slate-300/10 to-transparent border-slate-400/50 shadow-sm";
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-slate-200 to-zinc-400 text-slate-950 font-numeric font-black text-base md:text-lg shadow-md" title="نایب قهرمان">
                      <Medal className="w-5 h-5 text-slate-950" />
                    </span>
                  );
                } else if (isThird) {
                  rowBg = "bg-gradient-to-r from-amber-700/20 via-orange-800/10 to-transparent border-amber-700/50";
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-700 text-slate-950 font-numeric font-black text-base md:text-lg shadow-md" title="مقام سوم">
                      <Award className="w-5 h-5 text-slate-950" />
                    </span>
                  );
                }

                return (
                  <tr
                    key={team.rank}
                    className={`${rowBg} transition-all duration-300`}
                    style={{
                      animationDelay: `${idx * 80}ms`,
                    }}
                  >
                    {/* Rank Col */}
                    <td className="py-3.5 px-3 md:px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {rankBadge}
                      </div>
                    </td>

                    {/* Team Name Col */}
                    <td className="py-3.5 px-3 md:px-6">
                      <div className="flex flex-col">
                        <span
                          className={`font-rokh font-bold text-base md:text-xl tracking-tight ${
                            isChampion
                              ? "text-yellow-300 font-black text-glow-gold"
                              : isRunnerUp
                              ? "text-slate-100 font-black"
                              : isThird
                              ? "text-amber-400 font-bold"
                              : "text-slate-200"
                          }`}
                        >
                          {team.name}
                        </span>
                        {/* Sub-label for Top 2 */}
                        {isChampion && (
                          <span className="text-[11px] font-peyda font-bold text-amber-400">
                            ★ قهرمان طلایی دوره
                          </span>
                        )}
                        {isRunnerUp && (
                          <span className="text-[11px] font-peyda font-bold text-slate-300">
                            ★ نایب‌قهرمان نقره‌ای دوره
                          </span>
                        )}
                        {/* Mobile view subtext */}
                        <span className="text-xs text-slate-400 sm:hidden mt-0.5">
                          {team.org || team.members}
                        </span>
                      </div>
                    </td>

                    {/* Meta Col */}
                    <td className="py-3.5 px-3 md:px-6 hidden sm:table-cell">
                      <div className="flex flex-col text-xs md:text-sm text-slate-400 gap-0.5 font-dana">
                        {team.org && (
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Building className="w-3.5 h-3.5 text-cyan-400/80" />
                            {team.org}
                          </span>
                        )}
                        {team.members && <span>{team.members}</span>}
                      </div>
                    </td>

                    {/* Score Col */}
                    <td className="py-3.5 px-3 md:px-6 text-left">
                      <div className="inline-flex items-center gap-1.5 font-numeric font-black text-lg md:text-2xl">
                        {isChampion && <Sparkles className="w-4 h-4 text-amber-400" />}
                        <span
                          className={
                            isChampion
                              ? "text-yellow-300 text-glow-gold font-rokh"
                              : isRunnerUp
                              ? "text-slate-200 font-rokh"
                              : isThird
                              ? "text-amber-400 font-rokh"
                              : "text-cyan-300 font-rokh"
                          }
                        >
                          {formatScore(team.score, usePersian)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
