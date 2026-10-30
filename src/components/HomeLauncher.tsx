/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudioTab, Project } from '../types';
import {
  Sparkles,
  Wrench,
  Cpu,
  ShieldCheck,
  Archive,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Box,
  Layers,
  Terminal,
  FileCode2,
  PhoneCall
} from 'lucide-react';

interface HomeLauncherProps {
  onSelectTab: (tab: StudioTab) => void;
  projects: Project[];
  isAdminAuthenticated: boolean;
}

export const HomeLauncher: React.FC<HomeLauncherProps> = ({
  onSelectTab,
  projects,
  isAdminAuthenticated
}) => {
  const pendingDeliveries = projects.filter(
    (p) => p.status === 'completed_pending_delivery_approval'
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>المنصة الهندسية المتكاملة لإنشاء البرامج وإصلاحها بالذكاء المستقل</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            عبقرينو <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Studio Ultimate</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            بيئة احترافية متكاملة لإنشاء التطبيقات من الصفر عبر 15 مرحلة هندسية، وفحص وإصلاح المشروعات القائمة دون هدمها،
            مزودة بعقل اصطناعي مستقل ونظام تحكم حصري في تسليم البرامج لصاحب المنصة حصرياً عبر المحفظة <span className="text-amber-400 font-mono font-bold">01153747612</span>.
          </p>

          {/* Quick Action Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>فصل تام بين الإنشاء والإصلاح</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>عقل اصطناعي ثنائي اللغة (عربي / إنجليزي)</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
              <span>منع التسليم التلقائي للعميل قطعياً</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>نسخة ZIP كاملة جاهزة للحفظ على الهاتف</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Two Studio Portals (الباب الثاني: الهيكل الأساسي للمنصة) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">الاستوديوهات الرئيسية المستقلة</h2>
            <p className="text-sm text-slate-400">اختر مسار العمل المطلوب — لكل قسم مساراته وأدواته وسجلاته المستقلة تماماً</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Studio 1: Creation Studio */}
          <div className="relative group rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/60 p-8 transition-all duration-300 shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-700 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono font-bold bg-cyan-950 px-3 py-1 rounded-full text-cyan-300 border border-cyan-800">
                  Creation Studio
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">استوديو إنشاء البرامج من الصفر</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  توليد مشروعات برمجية متكاملة بدءاً من الفكرة وحتى الشيفرات وقواعد البيانات واختبارات الأداء والأمان عبر 15 مرحلة محكمة.
                </p>
              </div>

              {/* 15-Stage Highlights */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                <div className="font-semibold text-cyan-400 mb-1">المراحل الهندسية المتكاملة:</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>1. مناقشة وتحليل الفكرة</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>2. تصميم الشاشات التفاعلية</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>3. اعتماد السعر والمتطلبات</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>4. توليد الشيفرة وقواعد البيانات</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>5. الاختبارات الشاملة والأمان</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>6. الحفظ في الخزينة بانتظار الإذن</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">تصميم مرن دون فرض عدد شاشات ثابت</span>
              <button
                onClick={() => onSelectTab('creation')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-colors shadow-lg shadow-cyan-900/40"
              >
                <span>دخول استوديو الإنشاء</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Studio 2: Repair Studio */}
          <div className="relative group rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 p-8 transition-all duration-300 shadow-xl hover:shadow-amber-950/30 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-700 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Wrench className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono font-bold bg-amber-950 px-3 py-1 rounded-full text-amber-300 border border-amber-800">
                  Repair Studio
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">استوديو فحص وإصلاح البرامج القائمة</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  فحص المشروعات المتعثرة، وتشخيص تسريب الذاكرة وأخطاء المسارات وقواعد البيانات، وتنفيذ إصلاحات منضبطة دون هدم المشروع.
                </p>
              </div>

              {/* Repair Highlights */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                <div className="font-semibold text-amber-400 mb-1">دورة الإصلاح المنضبط:</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>1. استقبال ZIP أو الملفات</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>2. تحليل AST واكتشاف الأعطال</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>3. تقرير الفحص ونسبة الثقة</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>4. مقارنة Diff قبل/بعد التعديل</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>5. اختبارات التحقق من الإصلاح</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>6. حماية المشروع وإمكانية التراجع</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">تشخيص دقيق وحماية سلامة الشيفرة</span>
              <button
                onClick={() => onSelectTab('repair')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition-colors shadow-lg shadow-amber-900/40"
              >
                <span>دخول استوديو الإصلاح</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mandatory Delivery Control Section (الباب العاشر) */}
      <section className="rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/40 border border-rose-800/60 p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-rose-900/60 border border-rose-700/80 px-3 py-1 rounded-full text-xs font-bold text-rose-300">
              <Lock className="w-3.5 h-3.5" />
              <span>الباب العاشر: نظام التحكم الحصري في تسليم البرامج</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              السيطرة الكاملة لصاحب المنصة على تسليم البرامج للعملاء
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              يُحظر على النظام تسليم أي مشروع للعميل تلقائياً، أو إتاحة التنزيل المباشر من واجهة العميل. صاحب المنصة وحده هو من يراجع الدفع عبر رقم المحفظة / الاتصال{' '}
              <span className="text-amber-400 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-700">01153747612</span>،
              ثم ينزل الحزمة النهائية لجهازه ويرسلها بنفسه إلى العميل عبر واتساب ويسجل التسليم الخارجي.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => onSelectTab('admin_delivery')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl transition-all"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>بوابة إدارة البرامج الجاهزة للتسليم</span>
              {pendingDeliveries.length > 0 && (
                <span className="bg-slate-950 text-white px-2 py-0.5 rounded-full text-xs font-mono">
                  {pendingDeliveries.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Grid of Supporting Engines (Autonomous Brain, 3D Studio, Full Backup) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Autonomous AI Brain */}
        <div
          onClick={() => onSelectTab('neural_brain')}
          className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 p-6 transition-all hover:bg-slate-900/80 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
            <Cpu className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">العقل الاصطناعي المستقل</h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            معمارية Transformer مستقلة تدعم مفردات عربية وأوزان تدريب حقيقية، مع مقاييس تقييم مقاومة الهلوسة وفهم التعليمات.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
            <span>فتح معمل التدريب والتقييم</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: 3D Holographic Studio */}
        <div
          onClick={() => onSelectTab('three_lab')}
          className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/60 p-6 transition-all hover:bg-slate-900/80 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-700 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
            <Box className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">استوديو المجسمات 3D PBR</h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            مشاهد Three.js إجرائية مركبة من 3-12 جزءاً (نواة ذكية، معمارية سحابية، وخزينة مشفرة) مع تفكيك مجسمات 60 إطاراً بالثانية.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
            <span>عرض المجسمات التفاعلية</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Full Backup Archive */}
        <div
          onClick={() => onSelectTab('backup_center')}
          className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 p-6 transition-all hover:bg-slate-900/80 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-700 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
            <Archive className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">النسخة الكاملة للهاتف (ZIP)</h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            توليد وتنزيل أرشيف <span className="font-mono text-emerald-300">عبقرينو-سوبر-نسخة-كاملة.zip</span> مع التحقق من سلامة البصمة ومطابقة مسار Android.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <span>تنزيل وفحص الأرشيف</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>
      </section>
    </div>
  );
};
