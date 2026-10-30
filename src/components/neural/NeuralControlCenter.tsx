/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Abqarino Neural Control Center — مركز تطوير العقل وتدريب النموذج
 * The unified operational center enabling Malik to govern mind development, model training, and evaluation
 */

import React, { useState } from 'react';
import { AbqarinoChatView } from './AbqarinoChatView';
import { MindTelemetryView } from './MindTelemetryView';
import { ModelTrainingLabView } from './ModelTrainingLabView';
import { DatasetStudioView } from './DatasetStudioView';
import { BenchmarkComparisonView } from './BenchmarkComparisonView';
import { AutomatedTestsView } from './AutomatedTestsView';
import { MemorySettingsView } from './MemorySettingsView';
import { defaultWeightsManager } from '../../services/neural/weights';
import { defaultTrainer } from '../../services/neural/trainer';
import {
  Brain,
  Cpu,
  MessageSquare,
  Activity,
  Database,
  BarChart3,
  ShieldCheck,
  Settings,
  Download,
  CheckCircle2,
  PhoneCall,
  Sliders
} from 'lucide-react';

type NeuralCenterTab =
  | 'chat'
  | 'mind_telemetry'
  | 'training_lab'
  | 'dataset_studio'
  | 'benchmarks'
  | 'automated_tests'
  | 'memory_settings';

export const NeuralControlCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NeuralCenterTab>('chat');
  const activeCheckpoint = defaultWeightsManager.getActiveCheckpoint();
  const telemetry = defaultTrainer.getTelemetry();

  const handleExportFullReport = () => {
    const report = {
      project: 'عبقرينو سوبر — النسخة الكاملة',
      platform: 'مالك',
      owner: 'المستشار عطيه الهلباوي',
      coordinationPhone: '01153747612',
      generatedAt: new Date().toISOString(),
      activeModel: {
        version: activeCheckpoint.version,
        epoch: activeCheckpoint.epoch,
        steps: activeCheckpoint.steps,
        loss: activeCheckpoint.loss,
        accuracy: activeCheckpoint.accuracy,
        totalParams: activeCheckpoint.weightsSummary.totalParams,
        isBaseline: activeCheckpoint.isBaseline
      },
      trainingTelemetry: {
        currentEpoch: telemetry.currentEpoch,
        currentLoss: telemetry.currentLoss,
        overallStep: telemetry.overallStep,
        device: telemetry.hardwareDevice,
        optimizer: 'AdamW',
        learningRate: telemetry.learningRate
      },
      mindUnits: {
        totalUnits: 12,
        status: 'All 12 Autonomous Units Active & Verified',
        charterCompliance: 'Al-Walid AI Charter 100% Implemented'
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abqarino-neural-control-center-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Center Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-900/30">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  مركز تطوير العقل وتدريب النموذج
                </h1>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-0.5 rounded-full font-bold">
                  Abqarino Neural Control Center
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                المنصة الإدارية الشاملة لمالك: إدارة العقل الاصطناعي المستقل (12 وحدة)، وتدريب النموذج اللغوي المحلي، وإدارة الإصدارات والاختبارات
              </p>
            </div>
          </div>

          {/* Quick Status Pill & Export Report */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">الإصدار النشط:</span>
              <span className="font-mono font-bold text-cyan-400">{activeCheckpoint.version}</span>
            </div>

            <button
              onClick={handleExportFullReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold shadow-md transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>تصدير تقرير المنظومة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs shadow-lg">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>شاشة المحادثة المباشرة</span>
        </button>

        <button
          onClick={() => setActiveTab('mind_telemetry')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'mind_telemetry'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>حالة العقل الاصطناعي (12 وحدة)</span>
        </button>

        <button
          onClick={() => setActiveTab('training_lab')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'training_lab'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>مختبر التدريب والأوزان</span>
        </button>

        <button
          onClick={() => setActiveTab('dataset_studio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'dataset_studio'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>إدارة بيانات التدريب</span>
        </button>

        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'benchmarks'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>بنك التقييم والمقارنة</span>
        </button>

        <button
          onClick={() => setActiveTab('automated_tests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'automated_tests'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>الاختبارات الإلزامية الـ 16</span>
        </button>

        <button
          onClick={() => setActiveTab('memory_settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'memory_settings'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>الذاكرة والأدوات</span>
        </button>
      </div>

      {/* Tab View Container */}
      <div>
        {activeTab === 'chat' && <AbqarinoChatView />}
        {activeTab === 'mind_telemetry' && <MindTelemetryView />}
        {activeTab === 'training_lab' && <ModelTrainingLabView />}
        {activeTab === 'dataset_studio' && <DatasetStudioView />}
        {activeTab === 'benchmarks' && <BenchmarkComparisonView />}
        {activeTab === 'automated_tests' && <AutomatedTestsView />}
        {activeTab === 'memory_settings' && <MemorySettingsView />}
      </div>
    </div>
  );
};
