/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Automated Verification Tests View
 * Executes and reports all 16 mandatory tests with PASS/FAIL logs and tangible evidence
 */

import React, { useState } from 'react';
import { defaultNeuralTestSuite, TestResultItem } from '../../services/neuralTests';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  FileCheck,
  ShieldCheck,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';

export const AutomatedTestsView: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [currentProgress, setCurrentProgress] = useState<{ current: number; total: number } | null>(null);

  const handleRunAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setCurrentProgress({ current: 0, total: 16 });

    const results = await defaultNeuralTestSuite.runAllTests((curr, tot, item) => {
      setCurrentProgress({ current: curr, total: tot });
      setTestResults((prev) => [...prev, item]);
    });

    setIsRunning(false);
    setCurrentProgress(null);
  };

  const passCount = testResults.filter((t) => t.status === 'PASS').length;
  const failCount = testResults.filter((t) => t.status === 'FAIL').length;

  const handleExportTestReport = () => {
    const markdown = `# تقرير التحقق والاختبارات الإلزامية الـ 16 لمنظومة عبقرينو سوبر
التاريخ: ${new Date().toISOString().replace('T', ' ').slice(0, 16)}
إجمالي الاختبارات: ${testResults.length}
الناجحة: ${passCount} | الراسبة: ${failCount}

| الرقم | اسم الاختبار | الحالة | الإجراء المنفذ | النتيجة الفعلية | الدليل القابل للتحقق |
|---|---|---|---|---|---|
${testResults
  .map(
    (t) =>
      `| ${t.id} | ${t.name} | ${t.status} | ${t.actionExecuted} | ${t.actualResult} | \`${t.evidence}\` |`
  )
  .join('\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abqarino-16-tests-verification-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              حزمة الاختبارات الإلزامية الـ 16 (Mandatory Verification Suite)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            تنفيذ فعلي لكافة الاختبارات الـ 16 المنصوص عليها في الباب الثامن مع توثيق أدلة التشغيل وحالة كل فحص
          </p>
        </div>

        <div className="flex items-center gap-2">
          {testResults.length > 0 && (
            <button
              onClick={handleExportTestReport}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>تصدير التقرير Markdown</span>
            </button>
          )}

          <button
            onClick={handleRunAllTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all shrink-0"
          >
            <Play className="w-4 h-4" />
            <span>{isRunning ? 'جارٍ تنفيذ الاختبارات...' : 'بدء فحص الاختبارات الـ 16 الآن'}</span>
          </button>
        </div>
      </div>

      {/* Progress & Summary Bar */}
      {currentProgress && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-xs text-slate-300 font-bold">
            <span>جارٍ تنفيذ الاختبار رقم {currentProgress.current} من 16...</span>
            <span className="font-mono text-cyan-400">
              {Math.round((currentProgress.current / currentProgress.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${(currentProgress.current / currentProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary Scorecard if run completed */}
      {testResults.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 block">إجمالي الاختبارات:</span>
            <span className="text-2xl font-black font-mono text-white">{testResults.length} / 16</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 block">ناجحة (PASS):</span>
            <span className="text-2xl font-black font-mono text-emerald-400">{passCount}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 block">راسبة (FAIL):</span>
            <span className="text-2xl font-black font-mono text-rose-400">{failCount}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 block">نسبة النجاح والجاهزية:</span>
            <span className="text-2xl font-black font-mono text-cyan-400">
              {Math.round((passCount / (testResults.length || 1)) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-3">
        {testResults.map((t) => (
          <div
            key={t.id}
            className="bg-slate-900 border border-slate-800/90 p-5 rounded-2xl space-y-3 shadow-md hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-950 font-mono text-xs font-bold text-cyan-400 flex items-center justify-center border border-slate-800">
                  {t.id}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">الإجراء: {t.actionExecuted}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{t.durationMs}ms</span>
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                    t.status === 'PASS'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {t.status === 'PASS' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  <span>{t.status}</span>
                </span>
              </div>
            </div>

            <div className="text-xs space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block font-medium">النتيجة الفعلية:</span>
              <p className="text-slate-200">{t.actualResult}</p>
            </div>

            <div className="text-[11px] font-mono text-cyan-300/90 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/60 overflow-x-auto">
              دليل التحقق: {t.evidence}
            </div>
          </div>
        ))}

        {testResults.length === 0 && !isRunning && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-3">
            <FileCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">الاختبارات الـ 16 جاهزة للتشغيل</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              اضغط على زر "بدء فحص الاختبارات الـ 16 الآن" لإجراء الاختبارات الشاملة وتوليد الأدلة القابلة للتحقق
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
