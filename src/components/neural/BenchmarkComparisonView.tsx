/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Fixed Benchmark Evaluation Suite & Model Version Comparison View
 */

import React, { useState } from 'react';
import { defaultBenchmarkSuite, BenchmarkMetrics, BenchmarkDetailedItem } from '../../services/neural/benchmark';
import { defaultMindBridge } from '../../services/mind/mindBridge';
import { defaultWeightsManager, ModelCheckpoint } from '../../services/neural/weights';
import {
  BarChart3,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  ShieldCheck,
  Cpu,
  FileCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const BenchmarkComparisonView: React.FC = () => {
  const [isRunningEval, setIsRunningEval] = useState<boolean>(false);
  const [lastMetrics, setLastMetrics] = useState<BenchmarkMetrics | null>(null);
  const [detailedItems, setDetailedItems] = useState<BenchmarkDetailedItem[]>([]);
  const checkpoints = defaultWeightsManager.getCheckpoints();

  const [versionAId, setVersionAId] = useState<string>(checkpoints[1]?.id || checkpoints[0]?.id || '');
  const [versionBId, setVersionBId] = useState<string>(checkpoints[0]?.id || '');

  const handleRunEvaluation = () => {
    setIsRunningEval(true);
    setTimeout(() => {
      const model = defaultMindBridge.getModel();
      const { metrics, detailedItems: items } = defaultBenchmarkSuite.evaluateModel(model);
      setLastMetrics(metrics);
      setDetailedItems(items);
      setIsRunningEval(false);
    }, 600);
  };

  const comparison = defaultWeightsManager.compareCheckpoints(versionAId, versionBId);

  return (
    <div className="space-y-8">
      {/* Top Banner & Evaluation Trigger */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">بنك التقييم المعياري الثابت (Fixed Benchmark Suite)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            اختبارات حقيقية على مجموعة البيانات المحجوزة (Test Split 10%) لقياس الحيرة (Perplexity) ودقة الاستدلال ومقاومة الهلوسة
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isRunningEval}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 transition-all shrink-0"
        >
          <Play className="w-4 h-4" />
          <span>{isRunningEval ? 'جارٍ تشغيل بنك التقييم...' : 'تشغيل الاختبارات المعيارية الآن'}</span>
        </button>
      </div>

      {/* Benchmark Results Grid */}
      {lastMetrics ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-400 block">النتيجة الإجمالية (Overall):</span>
              <span className="text-2xl font-black font-mono text-emerald-400">{lastMetrics.overallScore}%</span>
              <span className="text-[10px] text-emerald-300/80 block">اجتياز {lastMetrics.totalEvaluatedSamples} اختبار</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-400 block">مستوى الخسارة (Mean Loss):</span>
              <span className="text-2xl font-black font-mono text-cyan-400">{lastMetrics.meanLoss}</span>
              <span className="text-[10px] text-cyan-300/80 block">دالة Cross-Entropy محايدة</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-400 block">مقياس الحيرة (Perplexity):</span>
              <span className="text-2xl font-black font-mono text-purple-400">{lastMetrics.perplexity}</span>
              <span className="text-[10px] text-purple-300/80 block">أقل = نموذج أكثر ثقة ويقيناً</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-400 block">تاريخ الفحص:</span>
              <span className="text-xs font-mono font-bold text-slate-200 block pt-1">{lastMetrics.evaluatedAt}</span>
              <span className="text-[10px] text-slate-500 block">بإشراف المنظومة</span>
            </div>
          </div>

          {/* Metric Bars */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-white">تفصيل درجات القدرات الخمس الأساسية:</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { label: 'فهم وتوليد اللغة العربية والإنجليزية', score: lastMetrics.arabicUnderstanding, color: 'bg-cyan-500' },
                { label: 'جودة توليد الشيفرات البرمجية والتحقق', score: lastMetrics.codeGenerationQuality, color: 'bg-indigo-500' },
                { label: 'تشخيص الأعطال وتتبع الأخطاء المنطقية', score: lastMetrics.errorDiagnosisAccuracy, color: 'bg-amber-500' },
                { label: 'مقاومة الهلوسة والالتزام بميثاق الوليد', score: lastMetrics.antiHallucinationScore, color: 'bg-emerald-500' },
                { label: 'اتباع التعليمات والقيود المعمارية الصارمة', score: lastMetrics.instructionFollowing, color: 'bg-purple-500' }
              ].map((m, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-300">{m.label}</span>
                    <span className="font-mono font-bold text-white">{m.score}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} transition-all duration-500`} style={{ width: `${m.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-3">
          <FileCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">بنك التقييم جاهز للاختبار</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            اضغط على زر "تشغيل الاختبارات المعيارية الآن" لحساب دالة الخسارة والحيرة ونسبة مقاومة الهلوسة على عينات الاختبار المحجوزة
          </p>
        </div>
      )}

      {/* Side-by-Side Version Comparison Panel */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white">المقارنة التقنية بين نسختين من الأوزان (Version Diff)</h4>
        </div>

        {/* Version Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">النسخة الأساسية الأولى (Version A):</label>
            <select
              value={versionAId}
              onChange={(e) => setVersionAId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
            >
              {checkpoints.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.version} (Epoch {c.epoch} - Loss {c.loss})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">النسخة المقارنة الثانية (Version B):</label>
            <select
              value={versionBId}
              onChange={(e) => setVersionBId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
            >
              {checkpoints.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.version} (Epoch {c.epoch} - Loss {c.loss})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Differential Card */}
        {comparison && (
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <span className="text-xs font-bold text-white">
                مقارنة: <span className="text-indigo-400 font-mono">{comparison.versionA}</span> مقابل{' '}
                <span className="text-cyan-400 font-mono">{comparison.versionB}</span>
              </span>
              <span className="text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full">
                الحكم الهندسي: {comparison.verdict}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">فارق الخسارة (Loss Diff):</span>
                <span className={`text-base font-bold ${comparison.lossDiff < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {comparison.lossDiff > 0 ? `+${comparison.lossDiff}` : comparison.lossDiff}
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">فارق الدقة (Accuracy Diff):</span>
                <span className={`text-base font-bold ${comparison.accuracyDiff > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {comparison.accuracyDiff > 0 ? `+${comparison.accuracyDiff}%` : `${comparison.accuracyDiff}%`}
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">فارق الحقب التدريبية:</span>
                <span className="text-base font-bold text-cyan-400">
                  {comparison.epochDiff > 0 ? `+${comparison.epochDiff}` : comparison.epochDiff} Epochs
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">فارق خطوات Backprop:</span>
                <span className="text-base font-bold text-indigo-400">
                  {comparison.stepsDiff > 0 ? `+${comparison.stepsDiff}` : comparison.stepsDiff} Steps
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
