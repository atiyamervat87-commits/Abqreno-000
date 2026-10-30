/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, RepairDiagnosis } from '../types';
import { MOCK_REPAIR_DIAGNOSIS } from '../data/mockProjects';
import {
  Wrench,
  Upload,
  AlertOctagon,
  CheckCircle2,
  FileSearch,
  GitCompare,
  Play,
  RotateCcw,
  ShieldAlert,
  FileCheck2,
  Check,
  Code2,
  Lock
} from 'lucide-react';

interface RepairStudioProps {
  onProjectRepaired: (project: Project) => void;
  onNavigateToDeliveryVault: () => void;
}

export const RepairStudio: React.FC<RepairStudioProps> = ({
  onProjectRepaired,
  onNavigateToDeliveryVault
}) => {
  // Repair Cycle Stages: 1: Reception -> 2: Diagnosis -> 3: Inspection Report -> 4: Plan Review -> 5: Apply Patch & Test -> 6: Final Verification
  const [repairStage, setRepairStage] = useState<number>(1);
  const [selectedCase, setSelectedCase] = useState<string>('pool_leak');
  const [diagnosis, setDiagnosis] = useState<RepairDiagnosis>(MOCK_REPAIR_DIAGNOSIS);
  const [isPatchApplied, setIsPatchApplied] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{ id: string; name: string; passed: boolean; log: string }[]>([
    { id: 't1', name: 'اختبار محاكاة استثناء ونفاذ المخزون', passed: false, log: 'فشل: تسريب اتصال Pool وعدم تحرير العميل بعد الخطأ.' },
    { id: 't2', name: 'اختبار ضغط 100 طلب متزامن', passed: false, log: 'فشل: استنزاف كافة اتصالات السيرفر وظهور Timeout.' }
  ]);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [customCodeInput, setCustomCodeInput] = useState<string>('');

  // Handle running tests after patch
  const handleRunVerificationTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setTestResults([
        { id: 't1', name: 'اختبار محاكاة استثناء ونفاذ المخزون', passed: true, log: 'نجاح: تم تحرير الاتصال بنجاح داخل كتلة finally بنسبة 100%.' },
        { id: 't2', name: 'اختبار ضغط 100 طلب متزامن', passed: true, log: 'نجاح: استقرت كافة اتصالات الـ Pool وأغلقت بسلاسة (0 تسريب).' }
      ]);
      setIsRunningTests(false);
      setRepairStage(6);
    }, 800);
  };

  const handleApplyPatch = () => {
    setIsPatchApplied(true);
    setRepairStage(5);
  };

  const handleRollback = () => {
    setIsPatchApplied(false);
    setTestResults([
      { id: 't1', name: 'اختبار محاكاة استثناء ونفاذ المخزون', passed: false, log: 'فشل: تم التراجع للحالة السابقة (تسريب الاتصال قائم).' },
      { id: 't2', name: 'اختبار ضغط 100 طلب متزامن', passed: false, log: 'فشل: عاد استنزاف الاتصالات.' }
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-700 flex items-center justify-center text-amber-400">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">استوديو فحص وإصلاح البرامج القائمة (Repair Studio)</h2>
            <p className="text-xs text-slate-400">فحص عميق، تشخيص مؤكد بالأدلة، وإصلاح منضبط دون المساس بالأجزاء السليمة</p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">نسبة دقة التشخيص:</span>
          <span className="text-xs font-mono font-bold text-amber-400">{diagnosis.confidenceScore}% (مؤكد بالأدلة)</span>
        </div>
      </div>

      {/* Repair Stages Steps */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
        {[
          { step: 1, title: 'استقبال المشروع' },
          { step: 2, title: 'التحليل الأولي' },
          { step: 3, title: 'تقرير الفحص' },
          { step: 4, title: 'مراجعة الخطة' },
          { step: 5, title: 'تطبيق التعديل' },
          { step: 6, title: 'الاعتماد والتقرير' }
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setRepairStage(s.step)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              repairStage === s.step
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                : repairStage > s.step
                ? 'bg-slate-950 border-emerald-900/60 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-mono text-[10px] mb-0.5">المرحلة {s.step}</div>
            <div className="truncate">{s.title}</div>
          </button>
        ))}
      </div>

      {/* STAGE 1 & 2: Reception & Initial Analysis */}
      {repairStage <= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>استقبال المشروع المفحوص (ZIP / مجلد / شيفرة برمجية)</span>
            </h3>

            {/* Preloaded Cases & Upload Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedCase('pool_leak')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCase === 'pool_leak'
                    ? 'bg-amber-950/40 border-amber-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-amber-300 mb-1">حالة فحص واقعية جاهزة:</div>
                <div className="text-xs text-white font-semibold">تسريب اتصالات قاعدة بيانات Express & PG</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  انهيار الخادم عند ضغط 50 طلباً بالتزامن لعدم تحرير الاتصال عند الخطأ.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 flex flex-col items-center justify-center text-center">
                <Upload className="w-6 h-6 text-slate-500 mb-2" />
                <span className="text-xs font-semibold text-slate-300">رفع ملف ZIP أو مجلد مشروع</span>
                <span className="text-[10px] text-slate-500 mt-0.5">يتم فحص وتحليل الملفات محلياً بأمان تام</span>
              </div>
            </div>

            {/* Initial Analysis Diagnostic Scan */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
                <span>نتائج التحليل الأولي لمحرك فحص عبقرينو:</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">إطار العمل:</span>
                  <span className="font-bold text-cyan-400">{diagnosis.frameworkDetected}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">نقطة الدخول:</span>
                  <span className="font-mono text-slate-200">{diagnosis.entryPoint}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">تصنيف العطل:</span>
                  <span className="font-bold text-rose-400">Memory/Pool Leak</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">مستوى الخطورة:</span>
                  <span className="font-bold text-rose-400 uppercase">{diagnosis.impactLevel}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setRepairStage(3)}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>عرض تقرير الفحص والتشخيص الهندسي (المرحلة 3)</span>
            </button>
          </div>

          {/* Guidelines Protection Sidecard (الباب الخامس: حماية المشروع الأصلي) */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>مبادئ حماية المشروع الأصلي</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                <li>لا يجوز هدم المشروع وإعادة بنائه لوجود خطأ محدود.</li>
                <li>حظر تعديل قواعد البيانات أو واجهات المستخدم غير المتصلة بالمشكلة.</li>
                <li>تحديد موضع التعديل بدقة ومطابقته حرفياً قبل التغيير.</li>
                <li>توفير آلية تراجع فورية (Rollback) في حال عدم اجتياز الاختبارات.</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              الملف المتأثر حصراً: <span className="font-mono text-amber-300">services/orderService.js</span>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3 & 4: Inspection Report & Repair Plan Review */}
      {repairStage >= 3 && repairStage <= 4 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">تقرير الفحص والتشخيص الشامل (المرحلة 3)</h3>
              <p className="text-xs text-slate-400">توثيق الأدلة الفنية، السبب المحتمل، وتقييم المخاطر قبل البدء</p>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1 rounded-full">
              نسبة الثقة: {diagnosis.confidenceScore}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description & Evidence */}
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-1">وصف المشكلة:</h4>
                <p className="text-xs text-slate-200 leading-relaxed">{diagnosis.problemDescription}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-2">الأدلة التي تدعم التشخيص:</h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  {diagnosis.evidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Repair Plan & Risk */}
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-amber-400 mb-2">خطة الإصلاح المنضبط:</h4>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
                  {diagnosis.repairPlanSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 mb-1">تقييم المخاطر وحماية النظام:</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{diagnosis.riskAssessment}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              onClick={() => setRepairStage(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              الرجوع للفحص
            </button>
            <button
              onClick={() => setRepairStage(5)}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <span>اعتماد الخطة والانتقال لمقارنة الشيفرة وتطبيق التعديل (المرحلة 5)</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5: Diff Comparison, Patch Application & Real Test Verification */}
      {repairStage >= 5 && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-cyan-400" />
                  <span>مقارنة التعديل الدقيق (Unified Diff View)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  الملف المستهدف: <span className="font-mono text-amber-300">services/orderService.js</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!isPatchApplied ? (
                  <button
                    onClick={handleApplyPatch}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>تطبيق التعديل المنضبط</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1.5 rounded-xl font-bold">
                      تم تطبيق التعديل بنجاح ✓
                    </span>
                    <button
                      onClick={handleRollback}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>تراجع (Rollback)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Side-by-Side Diff Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Before */}
              <div className="bg-slate-950 rounded-xl border border-rose-900/50 p-4 space-y-2">
                <div className="flex justify-between items-center text-xs text-rose-400 font-bold border-b border-slate-800 pb-2">
                  <span>الحالة السابقة (قبل الإصلاح — بها تسريب):</span>
                  <span className="font-mono text-[10px]">services/orderService.js</span>
                </div>
                <pre className="text-xs font-mono text-rose-200/90 whitespace-pre leading-relaxed dir-ltr text-left overflow-x-auto h-72">
                  {diagnosis.diffPatch[0]?.beforeCode}
                </pre>
              </div>

              {/* After */}
              <div className="bg-slate-950 rounded-xl border border-emerald-900/50 p-4 space-y-2">
                <div className="flex justify-between items-center text-xs text-emerald-400 font-bold border-b border-slate-800 pb-2">
                  <span>الحالة اللاحقة (تصحيح عبقرينو المنضبط):</span>
                  <span className="font-mono text-[10px]">services/orderService.js (مصحح)</span>
                </div>
                <pre className="text-xs font-mono text-emerald-200/90 whitespace-pre leading-relaxed dir-ltr text-left overflow-x-auto h-72">
                  {diagnosis.diffPatch[0]?.afterCode}
                </pre>
              </div>
            </div>

            {/* Test Execution & Results Check */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">اختبارات التحقق بعد الإصلاح (المرحلة 6)</h4>
                  <p className="text-[11px] text-slate-400">التأكد من علاج التسريب مع بقاء باقي الوظائف سليمة</p>
                </div>
                <button
                  onClick={handleRunVerificationTests}
                  disabled={isRunningTests || !isPatchApplied}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isRunningTests ? 'جارٍ إعادة الاختبار...' : 'تشغيل اختبارات التحقق'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {testResults.map((tr) => (
                  <div
                    key={tr.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      tr.passed
                        ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold">{tr.name}</div>
                      <div className="text-[11px] opacity-80">{tr.log}</div>
                    </div>
                    <span className="font-mono font-bold">{tr.passed ? 'ناجح ✓' : 'فاشل ✕'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Safeguard Banner */}
            {testResults.every((t) => t.passed) && (
              <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-600/80 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <Lock className="w-4 h-4" />
                    <span>تم اعتماد الإصلاح بنجاح — النسخة محفوظة في الخزينة بانتظار إذن صاحب المنصة</span>
                  </span>
                  <p className="text-[11px] text-slate-300">
                    لا يمكن تسليم المشروع تلقائياً للعميل؛ يتولى صاحب المنصة تنزيل المشروع وإرساله للعميل عبر واتساب بعد التحقق من رقم المحفظة 01153747612.
                  </p>
                </div>
                <button
                  onClick={onNavigateToDeliveryVault}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0"
                >
                  فتح بوابة التسليم الحصري
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
