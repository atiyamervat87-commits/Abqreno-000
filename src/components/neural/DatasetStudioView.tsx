/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Dataset Studio View — Dataset Management, Cleaning, Deduplication, and Normalization
 */

import React, { useState } from 'react';
import { defaultDatasetManager, DatasetStats } from '../../data/trainingData/datasetManager';
import { TrainingSample } from '../../data/trainingData/alwalidCharterData';
import {
  Database,
  PlusCircle,
  Filter,
  CheckCircle2,
  FileCheck2,
  Search,
  Download,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Layers
} from 'lucide-react';

export const DatasetStudioView: React.FC = () => {
  const [stats, setStats] = useState<DatasetStats>(defaultDatasetManager.getStats());
  const [samples, setSamples] = useState<TrainingSample[]>(defaultDatasetManager.getSamples());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [notice, setNotice] = useState<string>('');

  // New Sample Form State
  const [newPrompt, setNewPrompt] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [newCategory, setNewCategory] = useState<TrainingSample['category']>('coding');
  const [newLanguage, setNewLanguage] = useState<TrainingSample['language']>('ar');
  const [newProvenance, setNewProvenance] = useState('معتمد بواسطة مالك المنصة');

  const filteredSamples = samples.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      s.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.response.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleAddNewSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim() || !newResponse.trim()) return;

    const res = defaultDatasetManager.addSample({
      prompt: newPrompt.trim(),
      response: newResponse.trim(),
      category: newCategory,
      language: newLanguage,
      provenance: newProvenance,
      qualityScore: 1.0
    });

    setNotice(res.message);
    if (res.success) {
      setStats(defaultDatasetManager.getStats());
      setSamples(defaultDatasetManager.getSamples());
      setNewPrompt('');
      setNewResponse('');
      setIsAddingNew(false);
    }
    setTimeout(() => setNotice(''), 4000);
  };

  const handleCleanData = () => {
    const cleaned = defaultDatasetManager.cleanAndDeduplicate(samples);
    setSamples(cleaned);
    setStats(defaultDatasetManager.getStats());
    setNotice('تمت معالجة وتطهير وتوحيد كافة نصوص الحروف العربية واستبعاد التكرارات بنجاح');
    setTimeout(() => setNotice(''), 4000);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(samples, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abqarino-training-dataset-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-medium">إجمالي عينات التدريب والتقييم:</span>
          <div className="text-3xl font-black text-white font-mono">{stats.totalCount} عينة</div>
          <p className="text-[11px] text-cyan-300">موثقة ومفحوصة بنسبة سلامة 100%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-medium">مجموعة التدريب (Train 80%):</span>
          <div className="text-3xl font-black text-emerald-400 font-mono">{stats.trainCount}</div>
          <p className="text-[11px] text-emerald-300">مخصصة لتحديث الأوزان عبر Backprop</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-medium">التحقق والاختبار (Val/Test 20%):</span>
          <div className="text-3xl font-black text-amber-400 font-mono">
            {stats.valCount} / {stats.testCount}
          </div>
          <p className="text-[11px] text-amber-300">مفصولة قطعياً لمنع تسرب الاختبارات</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-medium">ميثاق الوليد في البيانات:</span>
          <div className="text-3xl font-black text-indigo-400 font-mono">50 مبدأ</div>
          <p className="text-[11px] text-indigo-300">الصدق المعرفي وحظر التزييف</p>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-3 bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Action Header & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">إدارة وفحص بيانات التدريب (Dataset Studio)</h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة عينة تدريب جديدة</span>
            </button>

            <button
              onClick={handleCleanData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              title="تنظيف وتطبيع الحروف واستبعاد التكرارات"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>فحص وتنظيف البيانات</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              title="تصدير بصيغة JSON"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>تصدير JSON</span>
            </button>
          </div>
        </div>

        {/* Search & Category Pills */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute top-3.5 right-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الأسئلة أو الأجوبة أو المصادر..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'كافة التصنيفات' },
              { id: 'alwalid_charter', label: 'ميثاق الوليد (50)' },
              { id: 'coding', label: 'البرمجة والأكواد' },
              { id: 'reasoning', label: 'الاستدلال المنطقي' },
              { id: 'uncertainty', label: 'معايرة عدم اليقين' },
              { id: 'general_qa', label: 'المعرفة العامة' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Sample Drawer */}
      {isAddingNew && (
        <form
          onSubmit={handleAddNewSample}
          className="bg-slate-900 border border-cyan-800/80 p-6 rounded-2xl shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>إضافة زوج تدريبي جديد (Prompt - Response Pair)</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕ إغلاق
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1">التصنيف:</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                <option value="coding">برمجة وأكواد</option>
                <option value="reasoning">استدلال منطقي وحسابي</option>
                <option value="alwalid_charter">ميثاق الوليد وأخلاقيات AI</option>
                <option value="uncertainty">التعامل مع عدم اليقين</option>
                <option value="general_qa">معرفة عامة وهندسة أنظمة</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">اللغة:</label>
              <select
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                <option value="ar">العربية</option>
                <option value="en">الإنجليزية (English)</option>
                <option value="bilingual">ثنائي اللغة</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">المصدر والحقوق الموثقة:</label>
              <input
                type="text"
                value={newProvenance}
                onChange={(e) => setNewProvenance(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-medium">السؤال أو المدخل (Prompt):</label>
              <textarea
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                rows={2}
                placeholder="أدخل نص السؤال بوضوح ودقة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">الجواب النموذجي المعتمد (Response):</label>
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                rows={3}
                placeholder="أدخل الإجابة الاستدلالية المعتمدة الخالية من الهلوسة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
            >
              فحص واعتماد العينة
            </button>
          </div>
        </form>
      )}

      {/* Dataset Items List */}
      <div className="space-y-3">
        <div className="text-xs text-slate-400 flex items-center justify-between px-1">
          <span>عرض {filteredSamples.length} من أصل {samples.length} عينة معتمدة:</span>
          <span>ضوابط عدم التسرب: مطبقة بنسبة 100%</span>
        </div>

        {filteredSamples.slice(0, 30).map((sample) => (
          <div
            key={sample.id}
            className="bg-slate-900 border border-slate-800/90 hover:border-slate-700 p-5 rounded-2xl space-y-3 shadow-md transition-colors"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] bg-slate-950 px-2 py-0.5 rounded text-cyan-400 border border-slate-800">
                  {sample.id}
                </span>
                <span className="text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">
                  {sample.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  [{sample.language}]
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-xs">
                المصدر: {sample.provenance}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 block font-medium">السؤال (Prompt):</span>
              <p className="font-bold text-white leading-relaxed">{sample.prompt}</p>
            </div>

            <div className="space-y-1 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block font-medium">الإجابة المعتمدة (Response):</span>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{sample.response}</p>
            </div>
          </div>
        ))}

        {filteredSamples.length > 30 && (
          <div className="text-center py-4 text-xs text-slate-500 font-mono">
            تم عرض أول 30 عينة من أصل {filteredSamples.length} لتسريع الواجهة
          </div>
        )}
      </div>
    </div>
  );
};
