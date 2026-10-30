/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Live Neural Model Training Lab View
 * Real Backprop Execution, Loss Tracking, Hyperparameters, Checkpoints & Version Rollback
 */

import React, { useState, useEffect } from 'react';
import { defaultTrainer, TrainingTelemetry } from '../../services/neural/trainer';
import { defaultWeightsManager, ModelCheckpoint } from '../../services/neural/weights';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Sliders,
  Save,
  Activity,
  Cpu,
  History,
  CheckCircle2,
  TrendingDown,
  Layers,
  ArrowRightLeft,
  Sparkles,
  Zap
} from 'lucide-react';

export const ModelTrainingLabView: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TrainingTelemetry>(defaultTrainer.getTelemetry());
  const [checkpoints, setCheckpoints] = useState<ModelCheckpoint[]>(defaultWeightsManager.getCheckpoints());
  const [activeCheckpoint, setActiveCheckpoint] = useState<ModelCheckpoint>(defaultWeightsManager.getActiveCheckpoint());
  const [selectedTargetSteps, setSelectedTargetSteps] = useState<number>(50);
  const [learningRate, setLearningRate] = useState<number>(defaultTrainer.getConfig().learningRate);
  const [batchSize, setBatchSize] = useState<number>(defaultTrainer.getConfig().batchSize);
  const [actionNotice, setActionNotice] = useState<string>('');
  const [compareVersions, setCompareVersions] = useState<{ idA: string; idB: string } | null>(null);

  useEffect(() => {
    const unsubscribe = defaultTrainer.subscribe((t) => {
      setTelemetry(t);
      setCheckpoints(defaultWeightsManager.getCheckpoints());
      setActiveCheckpoint(defaultWeightsManager.getActiveCheckpoint());
    });
    return () => unsubscribe();
  }, []);

  const handleStartTraining = () => {
    setActionNotice('');
    defaultTrainer.startTraining(selectedTargetSteps);
  };

  const handlePauseTraining = () => {
    defaultTrainer.pauseTraining();
  };

  const handleResumeTraining = () => {
    defaultTrainer.resumeTraining();
  };

  const handleStopTraining = () => {
    defaultTrainer.stopTraining();
  };

  const handleApplyHyperparams = (e: React.FormEvent) => {
    e.preventDefault();
    defaultTrainer.updateConfig({
      learningRate: Number(learningRate),
      batchSize: Number(batchSize)
    });
    setActionNotice('تم تحديث معاملات التدريب بنجاح وحفظها في المنظومة');
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleRollback = (checkpointId: string) => {
    const res = defaultWeightsManager.rollbackTo(checkpointId);
    setActionNotice(res.message);
    setCheckpoints(defaultWeightsManager.getCheckpoints());
    setActiveCheckpoint(defaultWeightsManager.getActiveCheckpoint());
    setTimeout(() => setActionNotice(''), 4000);
  };

  // Calculate SVG Points for loss curve
  const points = telemetry.lossHistory.map((pt, idx) => {
    const x = (idx / Math.max(1, telemetry.lossHistory.length - 1)) * 360;
    // Normalize loss between 0.3 and 3.0 to y (100 to 10)
    const normalizedLoss = Math.max(0.3, Math.min(3.0, pt.loss));
    const y = 90 - ((normalizedLoss - 0.3) / 2.7) * 80;
    return `${x},${y}`;
  });
  const svgPath = points.length > 1 ? `M ${points.join(' L ')}` : '';

  return (
    <div className="space-y-8">
      {/* Top Banner: Training Controls & Live Telemetry */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">مختبر التدريب العصبي المباشر (Neural Training Lab)</h3>
              <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full font-bold">
                محرك Causal Transformer
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              تنفيذ تدريب حقيقي وتعديل أوزان المصفوفات عبر خوارزمية AdamW مع رصد مباشر لدالة الخسارة وحفظ النسخ
            </p>
          </div>

          {/* Training Control Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <span>الخطوات:</span>
              <select
                value={selectedTargetSteps}
                onChange={(e) => setSelectedTargetSteps(Number(e.target.value))}
                disabled={telemetry.isTraining && !telemetry.isPaused}
                className="bg-transparent text-cyan-400 font-bold focus:outline-none"
              >
                <option value={20} className="bg-slate-900">20 خطوة</option>
                <option value={50} className="bg-slate-900">50 خطوة إضافية (موصى به)</option>
                <option value={100} className="bg-slate-900">100 خطوة</option>
              </select>
            </div>

            {!telemetry.isTraining ? (
              <button
                onClick={handleStartTraining}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>بدء التدريب الفعلي</span>
              </button>
            ) : telemetry.isPaused ? (
              <button
                onClick={handleResumeTraining}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <Play className="w-4 h-4" />
                <span>استئناف التدريب</span>
              </button>
            ) : (
              <button
                onClick={handlePauseTraining}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <Pause className="w-4 h-4" />
                <span>إيقاف مؤقت</span>
              </button>
            )}

            {telemetry.isTraining && (
              <button
                onClick={handleStopTraining}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <Square className="w-4 h-4" />
                <span>إنهاء وحفظ</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Notice */}
        {actionNotice && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Real-time Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">دورة التدريب (Epoch):</span>
            <span className="text-2xl font-black font-mono text-white">{telemetry.currentEpoch}</span>
            <span className="text-[10px] text-slate-500 block">الإجمالي: {telemetry.totalEpochs}</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">الخطوات المنفذة (Steps):</span>
            <span className="text-2xl font-black font-mono text-cyan-400">{telemetry.overallStep}</span>
            <span className="text-[10px] text-cyan-300/80 block">خطوة الحقبة: {telemetry.currentStep} / {telemetry.totalStepsInEpoch}</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">دالة الخسارة (Current Loss):</span>
            <span className="text-2xl font-black font-mono text-emerald-400">{telemetry.currentLoss}</span>
            <span className="text-[10px] text-emerald-300/80 block flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              <span>معدل انحدار مستقر</span>
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">الإصدار النشط للأوزان:</span>
            <span className="text-sm font-bold font-mono text-indigo-400 truncate block">
              {activeCheckpoint.version}
            </span>
            <span className="text-[10px] text-indigo-300/80 block">دقة النموذج: {activeCheckpoint.accuracy}%</span>
          </div>
        </div>

        {/* Live Loss Graph Canvas */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>منحنى الخسارة الحي (Live Loss Curve):</span>
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              {telemetry.lossHistory.length} نقاط مسجلة عبر التدريب الفعلي
            </span>
          </div>

          <div className="h-32 w-full bg-slate-900/80 rounded-lg p-2 border border-slate-800 flex items-center justify-center relative overflow-hidden">
            {svgPath ? (
              <svg viewBox="0 0 360 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                <path d={svgPath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ) : (
              <span className="text-xs text-slate-500">لا توجد بيانات كافية لرسم المنحنى</span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>سجل التشغيل الأخير: {telemetry.lastLog}</span>
            <span className="text-emerald-400">بيئة التشغيل: {telemetry.hardwareDevice}</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Hyperparameters & Checkpoint Version History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Hyperparameter Configuration */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">إعدادات ومعاملات التدريب (Hyperparameters)</h4>
          </div>

          <form onSubmit={handleApplyHyperparams} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-medium">
                معدل التعلم (Learning Rate):
              </label>
              <input
                type="number"
                step="0.0005"
                min="0.0001"
                max="0.05"
                value={learningRate}
                onChange={(e) => setLearningRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500">القيمة الموصى بها: 0.003 مع AdamW</span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">حجم الحزمة (Batch Size):</label>
              <input
                type="number"
                min="1"
                max="32"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500">الحجم الحالي: {batchSize} عينات لكل دفعة</span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">مُحسن التدرج (Optimizer):</label>
              <input
                type="text"
                disabled
                value="AdamW (Decoupled Weight Decay 0.01)"
                className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl px-3 py-2 text-slate-400 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-950/50"
            >
              حفظ وتطبيق المعاملات
            </button>
          </form>
        </div>

        {/* Column 2 & 3: Checkpoints & Version Control */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">
                إدارة نقاط الحفظ والإصدارات السابقة ({checkpoints.length} نقاط استعادة)
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">حفظ وحماية تلقائية لعدم فقدان أي تقدم</span>
          </div>

          <div className="space-y-3">
            {checkpoints.map((ckpt) => {
              const isActive = ckpt.id === activeCheckpoint.id;

              return (
                <div
                  key={ckpt.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-indigo-950/50 border-indigo-700 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{ckpt.version}</span>
                      {isActive && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          الإصدار النشط
                        </span>
                      )}
                      {ckpt.isBaseline && (
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                          نسخة قاعدية
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{ckpt.createdAt}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Loss:</span>
                      <span className="text-cyan-400 font-bold">{ckpt.loss}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">الدقة:</span>
                      <span className="text-emerald-400 font-bold">{ckpt.accuracy}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">الحقبة / الخطوات:</span>
                      <span className="text-slate-300">E{ckpt.epoch} / {ckpt.steps}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">الجهة:</span>
                      <span className="text-amber-400 truncate block">{ckpt.author}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3">{ckpt.notes}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-500">
                      معاملات الأوزان: {(ckpt.weightsSummary.totalParams / 1000000).toFixed(0)}M Parameters
                    </span>

                    {!isActive && (
                      <button
                        onClick={() => handleRollback(ckpt.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>تفعيل هذا الإصدار (Rollback)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
