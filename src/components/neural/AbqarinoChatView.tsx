/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Dedicated Real-Time Abqarino Chat Screen with Autonomous Mind Inspection
 */

import React, { useState, useRef, useEffect } from 'react';
import { defaultMindBridge, MindProcessingResult } from '../../services/mind/mindBridge';
import { defaultMemoryEngine } from '../../services/mind/memoryEngine';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Cpu,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Wrench,
  Search,
  BookOpen
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'abqarino';
  text: string;
  timestamp: string;
  mindReport?: MindProcessingResult['mindUnitsReport'];
  metrics?: MindProcessingResult['metrics'];
  isIndependentLocal: boolean;
}

export const AbqarinoChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'abqarino',
      text: `مرحباً بك! أنا **عبقرينو سوبر** — العقل الاصطناعي المستقل ونموذج فك التشفير العصبي ثنائي اللغة (عربي / إنجليزي).
أعمل بصورة محلية مستقلة تماماً، وألتزم التزاماً صارماً بمبادئ **ميثاق الوليد** في الصدق المعرفي، وحظر تزييف الحقائق، وحماية الخصوصية.

كيف يمكنني مساعدتك اليوم في التخطيط، البرمجة، تشخيص الأعطال، أو استدلال المسائل الهندسية؟`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isIndependentLocal: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedThoughtId, setExpandedThoughtId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = inputText.trim();
    if (!prompt || isLoading) return;

    setInputText('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isIndependentLocal: true
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await defaultMindBridge.process(prompt);
      const abqarinoMsg: ChatMessage = {
        id: result.id,
        sender: 'abqarino',
        text: result.response,
        timestamp: result.timestamp,
        mindReport: result.mindUnitsReport,
        metrics: result.metrics,
        isIndependentLocal: true
      };
      setMessages((prev) => [...prev, abqarinoMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'abqarino',
        text: `تعذر إتمام الاستدلال: ${err.message}`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isIndependentLocal: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    defaultMemoryEngine.clearContext();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'abqarino',
        text: 'تم بدء جلسة محادثة جديدة وتصفير الذاكرة العاملة المؤقتة مع الحفاظ على الذاكرة طويلة الأجل المشفرة.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isIndependentLocal: true
      }
    ]);
  };

  const handleExportChat = () => {
    const formatted = messages
      .map((m) => `[${m.timestamp}] ${m.sender === 'user' ? 'المستخدم' : 'عبقرينو سوبر'}:\n${m.text}\n`)
      .join('\n---\n\n');
    const blob = new Blob([formatted], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abqarino-chat-session-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[740px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Chat Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-900/40">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">محادثة عبقرينو سوبر المباشرة</h3>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>نموذج محلي مستقل (100% On-Device)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              مدعوم بـ 12 وحدة عقلية • الالتزام بميثاق الوليد • سياق حواري متصل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold"
            title="تصدير المحادثة"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">تصدير</span>
          </button>
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold"
            title="بدء جلسة جديدة"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">جلسة جديدة</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isExpanded = expandedThoughtId === msg.id;

          return (
            <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                  isUser
                    ? 'bg-cyan-600 shadow-md shadow-cyan-900/30'
                    : 'bg-indigo-600 shadow-md shadow-indigo-900/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
              </div>

              <div className={`max-w-2xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-cyan-600/90 text-white rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Mind Units Inspection Drawer (for Assistant messages) */}
                {!isUser && msg.mindReport && (
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs space-y-2">
                    <button
                      onClick={() => setExpandedThoughtId(isExpanded ? null : msg.id)}
                      className="w-full flex items-center justify-between text-indigo-400 font-semibold hover:text-indigo-300"
                    >
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>تحليل وحدات العقل الاصطناعي الـ 12 وسلسلة التفكير:</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                        {/* Language & Intent */}
                        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <div>
                            <span className="text-slate-500 block">اللغة المكتشفة:</span>
                            <span className="font-bold text-slate-200">
                              {msg.mindReport.language.detectedLanguage === 'ar' ? 'العربية' : 'الإنجليزية / مختلط'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">القصد والمقصد:</span>
                            <span className="font-mono font-bold text-cyan-400">
                              {msg.mindReport.intent.primaryIntent}
                            </span>
                          </div>
                        </div>

                        {/* Chain of Thought */}
                        <div>
                          <span className="font-bold text-slate-300 block mb-1">
                            خطوات الاستدلال والتفكير متعدد الخطوات:
                          </span>
                          <div className="space-y-1">
                            {msg.mindReport.reasoning.chainOfThought.map((s) => (
                              <div key={s.stepNumber} className="bg-slate-900/90 p-2 rounded border border-slate-800">
                                <span className="font-bold text-indigo-300">
                                  {s.stepNumber}. {s.thoughtTitle}
                                </span>
                                <p className="text-slate-400 mt-0.5">{s.deduction}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Verification & Critique */}
                        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <div>
                            <span className="text-slate-500 block">سلامة الحقائق وميثاق الوليد:</span>
                            <span className="font-bold text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{Math.round(msg.mindReport.factCheck.overallFactualIntegrity * 100)}% موثق</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">المراجعة الذاتية:</span>
                            <span className="font-bold text-purple-400">
                              {Math.round(msg.mindReport.selfCritique.score * 100)}% مطابقة
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <>
                      <span>•</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-slate-300 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedId === msg.id ? 'تم النسخ!' : 'نسخ'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Brain className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-950 border border-slate-800 text-xs text-indigo-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span>العقل الاصطناعي يقوم بالتحليل والاستدلال المعرفي والتحقق الذاتي...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="اكتب سؤالك لعبقرينو سوبر بالعربية أو الإنجليزية (مثال: اشرح مبادئ ميثاق الوليد، أو احسب سعة الخادم)..."
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/40 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">إرسال</span>
        </button>
      </form>
    </div>
  );
};
