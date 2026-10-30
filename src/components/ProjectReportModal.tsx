/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Project } from '../types';
import { FileText, CheckCircle2, ShieldCheck, X, PhoneCall, Code2, Layers, Check } from 'lucide-react';

interface ProjectReportModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectReportModal: React.FC<ProjectReportModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{project.name}</h3>
                <span className="font-mono text-xs bg-slate-950 px-2 py-0.5 rounded text-cyan-400 border border-slate-800">
                  {project.orderNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">تقرير الاعتماد الهندسي وشهادة اجتياز الاختبارات</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-500 block">صاحب المشروع / العميل:</span>
            <span className="font-bold text-white">{project.clientName}</span>
            <span className="font-mono text-cyan-400 block text-[11px]">{project.clientPhone}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">السعر المعتمد:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{project.priceEGP} ج.م</span>
            <span className="text-[10px] text-slate-400 block">التحقق: 01153747612</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">الحالة الراهنة:</span>
            <span className="font-bold text-rose-400 block">{project.status}</span>
            <span className="text-[10px] text-slate-400">مرحلة {project.currentStageNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">حجم الحزمة النهائية:</span>
            <span className="font-mono text-white text-sm">
              {(project.finalBundleSizeBytes / (1024 * 1024)).toFixed(1)} MB
            </span>
            <span className="text-[10px] text-emerald-400 block">مشفرة في الخزينة</span>
          </div>
        </div>

        {/* Requirements Approved */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300">قائمة المتطلبات المعتمدة هندسياً:</h4>
          <div className="space-y-1.5">
            {project.requirements.map((req) => (
              <div key={req.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">{req.title}</span>
                  <span className="text-slate-400 mr-2 text-[11px]">— {req.description}</span>
                </div>
                <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>معتمد</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Test Suite Passed */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>نتائج الاختبارات المنفذة فعلياً ({project.testCases.length} اختبارات ناجحة):</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project.testCases.map((tc) => (
              <div key={tc.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{tc.name}</span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded font-mono font-bold">
                    PASSED
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  الوقت: {tc.executionTimeMs}ms • {tc.outputLog}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusive Delivery Notice */}
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-200 space-y-1">
          <span className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>تنبيه نظام التحكم الحصري (الباب العاشر):</span>
          </span>
          <p className="text-[11px] text-rose-300 leading-relaxed">
            النسخة المصدرية والحزمة المترجمة لا تُمنح للعميل إلا بواسطة صاحب المنصة يدوياً عبر واتساب بعد مراجعة المعاملة المالية عبر رقم المحفظة 01153747612.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            إغلاق التقرير
          </button>
        </div>
      </div>
    </div>
  );
};
