/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mind Telemetry View — Interactive Dashboard for the 12 Interconnected Autonomous Units
 */

import React, { useState } from 'react';
import { defaultUnderstandingEngine } from '../../services/mind/bilingualUnderstanding';
import { defaultIntentAnalyzer } from '../../services/mind/intentAnalyzer';
import { defaultReasoningEngine } from '../../services/mind/multiStepReasoning';
import { defaultTaskPlanner } from '../../services/mind/taskPlanner';
import { defaultMemoryEngine } from '../../services/mind/memoryEngine';
import { defaultKnowledgeEngine } from '../../services/mind/knowledgeRetrieval';
import { defaultFactChecker } from '../../services/mind/factChecker';
import { defaultUncertaintyDetector } from '../../services/mind/uncertaintyDetector';
import { defaultSelfCritique } from '../../services/mind/selfCritique';
import { defaultToolOrchestrator } from '../../services/mind/toolManager';
import { defaultErrorMonitor } from '../../services/mind/errorMonitor';
import {
  Brain,
  Cpu,
  Compass,
  Layers,
  Database,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Wrench,
  Activity,
  GitBranch,
  Sparkles,
  Terminal
} from 'lucide-react';

export const MindTelemetryView: React.FC = () => {
  const [testQuery, setTestQuery] = useState('أنشئ منظومة طبية لحجز العيادات مع قاعدة بيانات مشفرة ومراجعة ميثاق الوليد');
  const [activeUnitDetails, setActiveUnitDetails] = useState<number | null>(null);

  // Run dynamic inspection on test query
  const langRes = defaultUnderstandingEngine.analyze(testQuery);
  const intentRes = defaultIntentAnalyzer.analyze(testQuery);
  const uncertRes = defaultUncertaintyDetector.assess(testQuery, 2);
  const memoryItems = defaultMemoryEngine.searchMemories(testQuery, 2);
  const knowledgeItems = defaultKnowledgeEngine.query(testQuery, 2);
  const reasoningRes = defaultReasoningEngine.reason(testQuery, knowledgeItems.map((k) => k.doc.title), intentRes.primaryIntent);
  const planRes = defaultTaskPlanner.plan(testQuery, intentRes.primaryIntent);
  const factRes = defaultFactChecker.validate([testQuery], ['وثائق عبقرينو']);
  const critiqueRes = defaultSelfCritique.review(testQuery, intentRes.primaryIntent);
  const tools = defaultToolOrchestrator.getTools();
  const errors = defaultErrorMonitor.getLogs();

  const mindUnits = [
    {
      id: 1,
      name: 'وحدة فهم اللغتين العربية والإنجليزية',
      englishName: 'Bilingual Understanding Engine',
      icon: Compass,
      status: 'نشط',
      metric: `اللغة: ${langRes.detectedLanguage.toUpperCase()} (${langRes.tokenCount} Tokens)`,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/60 border-cyan-800/80',
      description: 'كشف اللغة وتطبيع الحركات وتحديد الجذور الصرفية والشيفرات البرمجية.'
    },
    {
      id: 2,
      name: 'وحدة تحليل السؤال وتحديد المقصود',
      englishName: 'Intent & Semantic Analyzer',
      icon: GitBranch,
      status: 'نشط',
      metric: `القصد: ${intentRes.primaryIntent}`,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-950/60 border-indigo-800/80',
      description: 'تصنيف الأهداف الصريحة والاحتياجات الضمنية وكشف التعارضات المنطقية.'
    },
    {
      id: 3,
      name: 'وحدة الاستدلال والتفكير متعدد الخطوات',
      englishName: 'Multi-Step Reasoning Engine',
      icon: Brain,
      status: 'نشط',
      metric: `${reasoningRes.chainOfThought.length} خطوات استدلالية`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/60 border-purple-800/80',
      description: 'بناء سلسلة التفكير التحليلية Chain-of-Thought والتحقق من التناسق المنطقي.'
    },
    {
      id: 4,
      name: 'وحدة التخطيط وتقسيم المهام',
      englishName: 'Task Planner & Decomposition',
      icon: Layers,
      status: 'نشط',
      metric: `${planRes.tasks.length} مهام تنفيذية`,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/60 border-amber-800/80',
      description: 'تجزئة المهام المعقدة، ترتيب الأولويات وإدارة الاعتماديات والمخاطر.'
    },
    {
      id: 5,
      name: 'وحدة الذاكرة قصيرة وطويلة الأجل',
      englishName: 'Dual Episodic Memory Engine',
      icon: Database,
      status: 'نشط',
      metric: `${defaultMemoryEngine.getAllMemories().length} سجلات مشفرة`,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/60 border-emerald-800/80',
      description: 'ذاكرة عمل سياقية + ذاكرة وقائعية مشفرة مع ضوابط الخصوصية وحق النسيان.'
    },
    {
      id: 6,
      name: 'وحدة استرجاع المعرفة المسموح بها (RAG)',
      englishName: 'Knowledge Retrieval / RAG Engine',
      icon: Search,
      status: 'نشط',
      metric: `${defaultKnowledgeEngine.getDocuments().length} وثائق مفهرسة`,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/60 border-sky-800/80',
      description: 'فهرسة وثائق ميثاق الوليد والمعمارية الهندسية ومطابقة السياق بدقة.'
    },
    {
      id: 7,
      name: 'وحدة التحقق والتمييز بين الحقيقة والاستنتاج',
      englishName: 'Fact Checker & Inference Validator',
      icon: ShieldCheck,
      status: 'نشط',
      metric: `${Math.round(factRes.overallFactualIntegrity * 100)}% موثوقية`,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/60 border-rose-800/80',
      description: 'منع اختلاق المعلومات والتمييز الإلزامي بين الحقيقة والاستنتاج.'
    },
    {
      id: 8,
      name: 'وحدة اكتشاف عدم اليقين والاعتراف بعدم العلم',
      englishName: 'Uncertainty Detector & Honesty',
      icon: AlertCircle,
      status: 'نشط',
      metric: `اليقين: ${Math.round(uncertRes.confidenceScore * 100)}%`,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/60 border-amber-800/80',
      description: 'المعايرة الاحتمالية والاعتراف الفوري بنقص البيانات طبقاً لميثاق الوليد.'
    },
    {
      id: 9,
      name: 'وحدة المراجعة الذاتية قبل التقديم',
      englishName: 'Self-Critique Reviewer',
      icon: CheckCircle2,
      status: 'نشط',
      metric: `تقييم المراجعة: ${Math.round(critiqueRes.score * 100)}%`,
      color: 'text-violet-400',
      bgColor: 'bg-violet-950/60 border-violet-800/80',
      description: 'فحص النبرة والأمان وخلو الإجابة من الهلوسة أو الثغرات البرمجية.'
    },
    {
      id: 10,
      name: 'وحدة إدارة وتنسيق الأدوات والمهام',
      englishName: 'Tool Orchestrator',
      icon: Wrench,
      status: 'نشط',
      metric: `${tools.length} أدوات مسجلة`,
      color: 'text-teal-400',
      bgColor: 'bg-teal-950/60 border-teal-800/80',
      description: 'تنفيذ الآلات الحاسبة، فحص توازن الأقواس النحوية، والبحث في المعرفة.'
    },
    {
      id: 11,
      name: 'وحدة مراقبة الأخطاء والتعافي الذاتي',
      englishName: 'Error Monitor & Self-Healing',
      icon: Activity,
      status: 'نشط',
      metric: `${errors.length} سجلات تعافٍ`,
      color: 'text-lime-400',
      bgColor: 'bg-lime-950/60 border-lime-800/80',
      description: 'اعتراض الاستثناءات وتخفيف القيود تلقائياً لمنع توقف الجلسة.'
    },
    {
      id: 12,
      name: 'واجهة اتصال العقل والنموذج اللغوي (Bridge)',
      englishName: 'Mind-Model Bridge Protocol',
      icon: Cpu,
      status: 'نشط',
      metric: 'تكامل كامل 100%',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/60 border-cyan-800/80',
      description: 'جسر تنسيق وتوليد الرموز العصبية وتمرير النتائج بدقة فائقة.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Live Query Tester Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>مختبر فحص الوحدات الاثنتي عشرة للعقل في الوقت الفعلي</span>
            </h3>
            <p className="text-xs text-slate-400">
              قم بكتابة أي جملة أو أمر لاختبار استجابة كافة الوحدات العصبية المستقلة في آن واحد
            </p>
          </div>
          <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-full font-bold">
            12/12 وحدة متصلة ونشطة
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
            placeholder="أدخل نصاً لفحصه في العقل..."
          />
        </div>
      </div>

      {/* Grid of 12 Autonomous Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mindUnits.map((u) => {
          const Icon = u.icon;
          const isSelected = activeUnitDetails === u.id;

          return (
            <div
              key={u.id}
              onClick={() => setActiveUnitDetails(isSelected ? null : u.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-lg hover:scale-[1.01] ${u.bgColor} ${
                isSelected ? 'ring-2 ring-cyan-400' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${u.color}`} />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] font-bold text-emerald-400">{u.status}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">#{u.id}</span>
                  <h4 className="text-sm font-bold text-white">{u.name}</h4>
                </div>
                <p className="text-[10px] font-mono text-slate-400">{u.englishName}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">الحالة الفورية:</span>
                <span className={`font-mono font-bold text-[11px] ${u.color}`}>{u.metric}</span>
              </div>

              <p className="mt-2 text-[11px] text-slate-300 line-clamp-2">{u.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
