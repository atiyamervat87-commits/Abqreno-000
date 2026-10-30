/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Memory Settings & Tool Orchestration Sandbox View
 */

import React, { useState } from 'react';
import { defaultMemoryEngine, MemoryEntry } from '../../services/mind/memoryEngine';
import { defaultToolOrchestrator, ToolDefinition } from '../../services/mind/toolManager';
import { defaultErrorMonitor, SystemErrorLog } from '../../services/mind/errorMonitor';
import {
  Database,
  Lock,
  Trash2,
  Plus,
  Wrench,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  ShieldCheck,
  Terminal,
  RefreshCw
} from 'lucide-react';

export const MemorySettingsView: React.FC = () => {
  const [memories, setMemories] = useState<MemoryEntry[]>(defaultMemoryEngine.getAllMemories());
  const [newMemoryContent, setNewMemoryContent] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState<MemoryEntry['category']>('technical_fact');
  const [notice, setNotice] = useState('');

  // Tool Sandbox State
  const tools = defaultToolOrchestrator.getTools();
  const [selectedTool, setSelectedTool] = useState<string>(tools[0]?.name || 'system_calculator');
  const [toolArgInput, setToolArgInput] = useState<string>('{"expression": "48 * 12 + 256"}');
  const [toolResult, setToolResult] = useState<any>(null);
  const [isExecutingTool, setIsExecutingTool] = useState(false);

  // Errors State
  const [errors, setErrors] = useState<SystemErrorLog[]>(defaultErrorMonitor.getLogs());

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryContent.trim()) return;

    defaultMemoryEngine.addMemory(newMemoryContent.trim(), newMemoryCategory, 0.9, true);
    setMemories(defaultMemoryEngine.getAllMemories());
    setNewMemoryContent('');
    setNotice('تم تشفير وحفظ السجل الجديد في الذاكرة طويلة الأجل بنجاح');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleDeleteMemory = (id: string) => {
    defaultMemoryEngine.deleteMemory(id);
    setMemories(defaultMemoryEngine.getAllMemories());
    setNotice('تم حذف السجل من الذاكرة');
    setTimeout(() => setNotice(''), 2000);
  };

  const handleWipeAllMemories = () => {
    if (confirm('هل أنت متأكد من مسح كافة سجلات الذاكرة طويلة الأجل؟ (حق النسيان الرقمي)')) {
      defaultMemoryEngine.wipeAllLongTermMemories();
      setMemories([]);
      setNotice('تم تفريغ كافة سجلات الذاكرة بنجاح وفق ضوابط الخصوصية');
      setTimeout(() => setNotice(''), 3000);
    }
  };

  const handleRunTool = async () => {
    setIsExecutingTool(true);
    setToolResult(null);
    try {
      const parsedArgs = JSON.parse(toolArgInput);
      const res = await defaultToolOrchestrator.executeTool(selectedTool, parsedArgs);
      setToolResult(res);
    } catch (err: any) {
      setToolResult({ success: false, result: `خطأ في صياغة المدخلات: ${err.message}` });
    } finally {
      setIsExecutingTool(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notice Banner */}
      {notice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Memory Vault Section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                خزينة الذاكرة طويلة الأجل المشفرة (Episodic Memory Vault)
              </h3>
              <p className="text-xs text-slate-400">
                إدارة الحقائق والمعلومات المحفوظة عبر الجلسات مع إمكانية التعديل والمسح الكامل
              </p>
            </div>
          </div>

          <button
            onClick={handleWipeAllMemories}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح الذاكرة بالكامل (حق النسيان)</span>
          </button>
        </div>

        {/* Add Memory Form */}
        <form onSubmit={handleAddMemory} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newMemoryContent}
            onChange={(e) => setNewMemoryContent(e.target.value)}
            placeholder="أدخل حقيقة أو معلومة لتثبيتها في الذاكرة طويلة الأجل..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />

          <select
            value={newMemoryCategory}
            onChange={(e) => setNewMemoryCategory(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
          >
            <option value="technical_fact">حقيقة تقنية</option>
            <option value="preference">تفضيل للمستخدم / المالك</option>
            <option value="project_state">حالة مشروع</option>
            <option value="charter_guideline">مبدأ من ميثاق الوليد</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>تشفير وحفظ</span>
          </button>
        </form>

        {/* Memories List */}
        <div className="space-y-2">
          {memories.map((m) => (
            <div
              key={m.id}
              className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white font-medium block">{m.content}</span>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                    <span className="font-mono text-cyan-400">[{m.category}]</span>
                    <span>الأهمية: {(m.importance * 100).toFixed(0)}%</span>
                    <span>تاريخ الحفظ: {m.createdAt}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteMemory(m.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="حذف هذا السجل"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {memories.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-500 font-mono">
              الذاكرة فارغة حالياً
            </div>
          )}
        </div>
      </div>

      {/* Tool Sandbox & Error Monitor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tool Sandbox */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Wrench className="w-5 h-5 text-teal-400" />
            <h4 className="text-sm font-bold text-white">مختبر فحص وتشغيل الأدوات (Tool Sandbox)</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1">اختر الأداة المراد اختبارها:</label>
              <select
                value={selectedTool}
                onChange={(e) => {
                  setSelectedTool(e.target.value);
                  if (e.target.value === 'system_calculator') {
                    setToolArgInput('{"expression": "48 * 12 + 256"}');
                  } else if (e.target.value === 'syntax_validator') {
                    setToolArgInput('{"code": "function calc(a: number) { return a * 2; }"}');
                  } else if (e.target.value === 'knowledge_search') {
                    setToolArgInput('{"query": "ميثاق الوليد الصدق"}');
                  } else {
                    setToolArgInput('{"query": "01153747612"}');
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                {tools.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name} — {t.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">المدخلات بصيغة JSON (Arguments):</label>
              <textarea
                value={toolArgInput}
                onChange={(e) => setToolArgInput(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <button
              onClick={handleRunTool}
              disabled={isExecutingTool}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>{isExecutingTool ? 'جارٍ التنفيذ...' : 'تشغيل الأداة وفحص الناتج'}</span>
            </button>

            {toolResult && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block">نتيجة تنفيذ الأداة:</span>
                <pre className="text-teal-300 font-mono text-[11px] whitespace-pre-wrap">
                  {JSON.stringify(toolResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Error Monitor & Self Healing */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-lime-400" />
              <h4 className="text-sm font-bold text-white">سجلات مراقبة الأخطاء والتعافي الذاتي</h4>
            </div>
            <span className="text-[10px] bg-lime-950 text-lime-300 border border-lime-800 px-2 py-0.5 rounded-full font-bold">
              نشط ومرصود
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {errors.map((err) => (
              <div key={err.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-cyan-400 text-[10px]">[{err.subsystem}]</span>
                  <span className="text-[10px] text-slate-500 font-mono">{err.timestamp}</span>
                </div>
                <p className="text-rose-400 font-medium">{err.errorMessage}</p>
                <div className="pt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>إجراء التعافي: {err.recoveryActionTaken}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
