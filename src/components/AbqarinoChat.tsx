/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AbqarinoChat.tsx — الشاشة المستقلة للمحادثة مع العقل الاصطناعي لعبقرينو
 * متصلة بالوسيط البرمجي brain.ts ومحرك neuralEngine ومختبر NeuralBrainLab
 * تدعم واجهة محادثة عربية بالكامل وعرض حالة المعالجة الحية والاستدلال الديناميكي
 */

import React, { useState, useRef, useEffect } from 'react';
import { brainService, BrainResponse, BrainLiveStatus, BrainActionTrigger } from '../services/brain';
import { neuralEngine } from '../services/neuralEngine';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  HelpCircle,
  Activity,
  Play,
  Zap,
  ArrowRight,
  Bookmark,
  Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'abqarino';
  text: string;
  timestamp: string;
  intent?: string;
  executionTimeMs?: number;
  mindReport?: BrainResponse['mindUnitsReport'];
  metrics?: BrainResponse['metrics'];
  actionTriggers?: BrainActionTrigger[];
  clarifyingQuestion?: string;
  suggestedQuickReplies?: string[];
  isIndependentLocal: boolean;
}

interface AbqarinoChatProps {
  onNavigateToTab?: (tab: string) => void;
}

export const AbqarinoChat: React.FC<AbqarinoChatProps> = ({ onNavigateToTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-init',
      sender: 'abqarino',
      text: `أهلاً وسهلاً بك! أنا **عبقرينو سوبر** — العقل الاصطناعي والنموذج اللغوي المستقل المعتمد في منصة مالك تحت إشراف **المستشار عطيه الهلباوي**.

أعمل محلياً بالكامل عبر الوسيط البرمجي **brainService** ومحرك **neuralEngine**، وألتزم التزاماً صارماً بمبادئ **ميثاق الوليد** في الصدق المعرفي، والامتناع عن تزييف أي حقيقة أو رقم، وحماية الخصوصية.

تفضل بطرح أي سؤال أو فكرة برمجية أو استشارة قانونية أو أمر بتطوير العقل وتدريب النموذج وسأقوم بمعالجته فوراً عبر الاستدلال الديناميكي المباشر.`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isIndependentLocal: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [liveStatus, setLiveStatus] = useState<BrainLiveStatus | null>(null);
  const [expandedThoughtId, setExpandedThoughtId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);
  const [activeVersion, setActiveVersion] = useState<string>(brainService.getActiveCheckpoint().version);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'طور عقل المستشار عطيه بحيث يرد كما يرد جيمينيه على كل الأسئلة التي توجه إليه',
    'ما هي المبادئ الأساسية في ميثاق الوليد للذكاء الاصطناعي؟',
    'احسب: خادم 16 جيجابايت يستهلك النظام 4 جيجابايت، كم مستخدماً متزامناً يستوعب بأمان؟',
    'كيف تنشئ دالة TypeScript آمنة لمعالجة الطلبات دون تسريب الذاكرة؟'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, liveStatus]);

  // Subscribe to brain telemetry
  useEffect(() => {
    const unsub = brainService.subscribeStatus((st) => {
      setActiveVersion(st.activeModelVersion);
    });
    return () => unsub();
  }, []);

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || inputText).trim();
    if (!promptToSend || isLoading) return;

    if (!customPrompt) setInputText('');
    setActionSuccessNotice(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isIndependentLocal: true
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const historyContext = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      // Call the centralized Brain Service with live status callbacks
      const response: BrainResponse = await brainService.processChatPrompt(
        promptToSend,
        historyContext,
        (status) => {
          setLiveStatus(status);
        }
      );

      setActiveVersion(response.activeModelVersion);

      const abqarinoMessage: ChatMessage = {
        id: response.id,
        sender: 'abqarino',
        text: response.text,
        timestamp: response.timestamp,
        intent: response.intent,
        executionTimeMs: response.executionTimeMs,
        mindReport: response.mindUnitsReport,
        metrics: response.metrics,
        actionTriggers: response.actionTriggers,
        clarifyingQuestion: response.clarifyingQuestion,
        suggestedQuickReplies: response.suggestedQuickReplies,
        isIndependentLocal: true
      };

      setMessages((prev) => [...prev, abqarinoMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'abqarino',
        text: `تعذر إتمام الاستدلال العصبي عبر وسيط brain.ts: ${err.message || 'حدث خطأ غير متوقع'}`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isIndependentLocal: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLiveStatus(null);
    }
  };

  const handleActionTrigger = (trigger: BrainActionTrigger) => {
    if (trigger.action === 'start_training') {
      const res = brainService.triggerTrainerAction('start_training', trigger.payload);
      setActionSuccessNotice(res.message);
      setTimeout(() => setActionSuccessNotice(null), 6000);
    } else if (trigger.action === 'save_checkpoint') {
      const res = brainService.triggerTrainerAction('save_checkpoint', trigger.payload);
      setActionSuccessNotice(res.message);
      setActiveVersion(brainService.getActiveCheckpoint().version);
      setTimeout(() => setActionSuccessNotice(null), 6000);
    } else if (trigger.action === 'open_lab') {
      if (onNavigateToTab) {
        onNavigateToTab('neural_lab');
      } else {
        setActionSuccessNotice('يمكنك الانتقال إلى شاشة "مركز تطوير العقل وتدريب النموذج" من القائمة العلوية لمتابعة التدريب والأوزان مباشرة.');
        setTimeout(() => setActionSuccessNotice(null), 6000);
      }
    } else if (trigger.action === 'apply_patch') {
      if (onNavigateToTab) {
        onNavigateToTab('repair');
      } else {
        setActionSuccessNotice('تم توجيه رقعة التصحيح إلى استوديو الإصلاح الذكي للفحص غير الهدام.');
        setTimeout(() => setActionSuccessNotice(null), 5000);
      }
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearSession = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'abqarino',
        text: 'تم بدء جلسة محادثة جديدة وتصفير الذاكرة العاملة المؤقتة مع الإبقاء على الذاكرة طويلة الأجل المشفرة في أمان.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isIndependentLocal: true
      }
    ]);
    setActionSuccessNotice(null);
  };

  const handleExportChatMarkdown = () => {
    const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const content = `# جلسة محادثة عبقرينو سوبر (Abqarino Neural Chat)
التاريخ: ${dateStr}
الوسيط البرمجي: src/services/brain.ts
محرك التشغيل: neuralEngine (محلي مستقل 100%)
إصدار الأوزان النشط: ${activeVersion}
المشرف العام: المستشار عطيه الهلباوي

---

${messages
  .map(
    (m) =>
      `### [${m.timestamp}] ${m.sender === 'user' ? 'المستخدم' : 'عبقرينو سوبر'}:\n\n${m.text}\n`
  )
  .join('\n---\n\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abqarino-chat-session-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-900/30">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">عبقرينو سوبر — المحادثة والاستدلال العصبي</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                  brainService Active
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                الوسيط البرمجي الذكي المرتبط بنموذج NeuralBrainLab ومحرك neuralEngine المحلي المستقل • إشراف المستشار عطيه الهلباوي
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>الإصدار: {activeVersion}</span>
            </div>

            <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ميثاق الوليد: مفعل 100%</span>
            </div>

            <button
              onClick={handleExportChatMarkdown}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold shadow-md transition-colors"
              title="تصدير المحادثة بتنسيق Markdown"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">تصدير الجلسة</span>
            </button>

            <button
              onClick={handleClearSession}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold shadow-md transition-colors"
              title="بدء جلسة جديدة وتصفير السياق"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">جلسة جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Action Success Notice */}
      {actionSuccessNotice && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-2xl flex items-center justify-between text-emerald-200 text-xs sm:text-sm animate-in fade-in shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{actionSuccessNotice}</span>
          </div>
          <button
            onClick={() => setActionSuccessNotice(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs underline"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Suggested Quick Inquiries */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 px-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>استفسارات استدلالية وتوجيهات معتمدة:</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-right p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/60 text-xs text-slate-300 transition-all shadow-md hover:shadow-cyan-950/20 disabled:opacity-50"
            >
              <span className="line-clamp-2 leading-relaxed">{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex flex-col h-[680px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isExpanded = expandedThoughtId === msg.id;

            return (
              <div key={msg.id} className={`flex gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Sender Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-lg ${
                    isUser
                      ? 'bg-gradient-to-tr from-cyan-600 to-sky-500 shadow-cyan-900/30'
                      : 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-900/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                </div>

                {/* Content Column */}
                <div className={`max-w-3xl space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Bubble */}
                  <div
                    className={`p-5 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Clarifying Question & Quick Replies (if present) */}
                  {!isUser && msg.clarifyingQuestion && (
                    <div className="bg-indigo-950/40 border border-indigo-800/60 p-4 rounded-2xl space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                        <HelpCircle className="w-4 h-4 text-indigo-400" />
                        <span>سؤال استيضاحي من عقل عبقرينو لتحديد المسار:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {msg.clarifyingQuestion}
                      </p>
                      {msg.suggestedQuickReplies && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.suggestedQuickReplies.map((reply, rIdx) => (
                            <button
                              key={rIdx}
                              onClick={() => handleSendMessage(reply)}
                              disabled={isLoading}
                              className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-900/50 border border-indigo-700/50 text-indigo-200 transition-colors flex items-center gap-1.5"
                            >
                              <ArrowRight className="w-3 h-3 text-cyan-400" />
                              <span>{reply}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Triggers Box (e.g. Training, Lab, Checkpoint) */}
                  {!isUser && msg.actionTriggers && msg.actionTriggers.length > 0 && (
                    <div className="bg-slate-950/90 border border-cyan-800/50 p-4 rounded-2xl space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span>إجراءات تطويرية وتنفيذية فورية متاحة:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.actionTriggers.map((trig) => (
                          <button
                            key={trig.id}
                            onClick={() => handleActionTrigger(trig)}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-900/60 to-indigo-900/60 hover:from-cyan-800 hover:to-indigo-800 border border-cyan-500/40 text-xs font-bold text-white shadow-md flex items-center gap-1.5 transition-all"
                          >
                            <Play className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300" />
                            <span>{trig.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Autonomous Mind Inspection Drawer (for Abqarino replies) */}
                  {!isUser && msg.mindReport && (
                    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-xs space-y-3 shadow-inner">
                      <button
                        onClick={() => setExpandedThoughtId(isExpanded ? null : msg.id)}
                        className="w-full flex items-center justify-between text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-cyan-400" />
                          <span>تحليل مسار التفكير والاستدلال في العقل الاصطناعي (12 وحدة):</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isExpanded && (
                        <div className="space-y-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                          {/* Intent & Language */}
                          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <div>
                              <span className="text-slate-500 block mb-0.5">اللغة المكتشفة:</span>
                              <span className="font-bold text-slate-200">
                                {msg.mindReport.language.detectedLanguage === 'ar' ? 'العربية' : 'الإنجليزية / مختلط'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5">تصنيف القصد (Intent):</span>
                              <span className="font-mono font-bold text-cyan-400">
                                {msg.intent || msg.mindReport.intent.primaryIntent}
                              </span>
                            </div>
                          </div>

                          {/* Reasoning Steps */}
                          <div>
                            <span className="font-bold text-slate-300 block mb-1.5">
                              سلسلة الاستدلال المنطقي (Chain of Thought):
                            </span>
                            <div className="space-y-1.5">
                              {msg.mindReport.reasoning.chainOfThought.map((step) => (
                                <div key={step.stepNumber} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                                  <span className="font-bold text-indigo-300">
                                    {step.stepNumber}. {step.thoughtTitle}
                                  </span>
                                  <p className="text-slate-400 mt-0.5">{step.deduction}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Fact Check & Self Critique */}
                          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <div>
                              <span className="text-slate-500 block mb-0.5">مطابقة ميثاق الوليد:</span>
                              <span className="font-bold text-emerald-400 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>{Math.round(msg.mindReport.factCheck.overallFactualIntegrity * 100)}% موثق</span>
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5">المراجعة الذاتية:</span>
                              <span className="font-bold text-purple-400">
                                {Math.round(msg.mindReport.selfCritique.score * 100)}% سلامة وأمان
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Turn Metadata and Copy Action */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 px-1">
                    <span>{msg.timestamp}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono font-bold">brainService + neuralEngine (محلي مستقل)</span>
                    {msg.executionTimeMs && (
                      <>
                        <span>•</span>
                        <span className="text-slate-400">{msg.executionTimeMs} ms</span>
                      </>
                    )}
                    {!isUser && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="hover:text-slate-300 flex items-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId === msg.id ? 'تم النسخ بنجاح!' : 'نسخ الإجابة'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Live Processing Status Indicator (وضع الاستدلال vs التحليل المنطقي) */}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4 animate-in fade-in">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse shadow-lg shadow-indigo-900/50">
                <Brain className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-3xl rounded-tl-none bg-slate-950 border border-slate-800 text-xs text-slate-200 max-w-lg space-y-2 shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                    <span className="font-bold text-cyan-300">
                      {liveStatus ? liveStatus.phaseLabelAr : 'وضع الاستدلال العصبي والتحليل المنطقي...'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    {liveStatus?.percent || 50}%
                  </span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 h-1.5 transition-all duration-300"
                    style={{ width: `${liveStatus?.percent || 50}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {liveStatus?.detail || 'معالجة المدخلات عبر الـ 12 وحدة المستقلة والتحقق من ميثاق الوليد...'}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب سؤالك أو فكرتك أو أمر تطوير العقل لعبقرينو سوبر (اضغط Enter للإرسال)..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AbqarinoChat;
