import React, { useState } from 'react';
import { parseCSVTeams, parseJSONTeams, validateContestData } from '../../utils/validation';
import { Upload, FileJson, FileSpreadsheet, AlertTriangle, CheckCircle, X } from 'lucide-react';

export const BulkDataModal = ({ isOpen, onClose, onImport }) => {
  const [activeFormat, setActiveFormat] = useState('json'); // 'json' or 'csv'
  const [rawText, setRawText] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTextChange = (text) => {
    setRawText(text);
    setErrorMsg('');
    setValidationResult(null);

    if (!text.trim()) return;

    try {
      let parsed;
      if (activeFormat === 'json') {
        parsed = parseJSONTeams(text);
      } else {
        parsed = { teams: parseCSVTeams(text) };
      }
      const val = validateContestData(parsed.teams);
      setValidationResult(val);
    } catch (err) {
      setErrorMsg(err.message || "خطا در خواندن فرمت فایل ورودی");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        if (file.name.endsWith('.csv')) {
          setActiveFormat('csv');
        } else if (file.name.endsWith('.json')) {
          setActiveFormat('json');
        }
        handleTextChange(content);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirm = () => {
    if (!validationResult || !validationResult.isValid) return;
    onImport(validationResult.sanitizedTeams);
    onClose();
  };

  const loadSampleData = () => {
    if (activeFormat === 'json') {
      const sample = {
        contestTitle: "مسابقه ملی هوش مصنوعی و الگوریتم",
        teams: Array.from({ length: 10 }).map((_, i) => ({
          rank: i + 1,
          name: `تیم برگزیده شماره ${i + 1}`,
          score: Number((98 - i * 2.2).toFixed(2)),
          org: "دانشگاه نمونه",
          members: "عضو اول، عضو دوم",
        })),
      };
      handleTextChange(JSON.stringify(sample, null, 2));
    } else {
      const csv = [
        "rank,name,score,org,members",
        "1,تیم شاهین طلایی,98.5,دانشگاه صنعتی شریف,علی رضایی، سارا نوری",
        "2,کاوشگران هوشمند,96.0,دانشگاه تهران,محمد محمدی",
        "3,سیستم‌های نوین,94.2,دانشگاه امیرکبیر,نرگس صفوی",
        "4,تک‌کد,91.8,دانشگاه علم و صنعت,پوریا کمالی",
        "5,الگوریتم برتر,89.5,دانشگاه اصفهان,الهام حسنی",
        "6,سایبر بایت,87.0,دانشگاه شیراز,امید شمس",
        "7,دیجیتال مایند,85.3,دانشگاه مشهد,سینا پارسا",
        "8,کوانتوم وب,83.1,دانشگاه خواجه نصیر,مهدی توکلی",
        "9,ماتریکس سافت,81.4,دانشگاه تبریز,فرشاد حسینی",
        "10,افق آینده,79.0,دانشگاه بهشتی,زهرا شریفی",
      ].join("\n");
      handleTextChange(csv);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 md:p-8 text-right overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">ورود گروهی نتایج مسابقه</h2>
              <p className="text-xs text-slate-400">بارگذاری سریع اطلاعات از طریق JSON یا CSV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector & Sample buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveFormat('json');
                handleTextChange('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeFormat === 'json'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileJson className="w-4 h-4" />
              <span>قالب JSON</span>
            </button>
            <button
              onClick={() => {
                setActiveFormat('csv');
                handleTextChange('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeFormat === 'csv'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>قالب CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>انتخاب فایل از رایانه</span>
              <input
                type="file"
                accept=".csv,.json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <button
              onClick={loadSampleData}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              درج داده نمونه معتبر
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          rows={10}
          value={rawText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={
            activeFormat === 'json'
              ? 'محتوای JSON را اینجا جای‌گذاری (Paste) کنید...'
              : 'محتوای CSV (شامل رتبه، نام، امتیاز، ...) را اینجا جای‌گذاری کنید...'
          }
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs md:text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition resize-y mb-4"
          dir="ltr"
        />

        {/* Validation Status Box */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm flex items-start gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">خطای فرمت داده‌ها:</p>
              <p className="text-xs mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {validationResult && !validationResult.isValid && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-sm mb-6">
            <div className="flex items-center gap-2 font-bold mb-2 text-amber-300">
              <AlertTriangle className="w-5 h-5" />
              <span>اطلاعات ورودی کامل و معتبر نیست ({validationResult.errors.length} خطا):</span>
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 text-amber-300/90 pr-2">
              {validationResult.errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {validationResult && validationResult.isValid && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-sm flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="font-bold">اطلاعات کاملاً معتبر است!</p>
                <p className="text-xs text-emerald-400/80">دقیقاً ۱۰ تیم با رتبه‌های ۱ تا ۱۰ شناسایی شدند.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-numeric">
              ۱۰ / ۱۰ تیم
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-semibold transition"
          >
            انصراف
          </button>
          <button
            onClick={handleConfirm}
            disabled={!validationResult || !validationResult.isValid}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition flex items-center gap-2 ${
              validationResult && validationResult.isValid
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>تأیید و جایگزینی نتایج رسمی</span>
          </button>
        </div>
      </div>
    </div>
  );
};
