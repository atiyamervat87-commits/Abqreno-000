/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Antigravity Command Center — مركز قيادة وتشغيل أداة Antigravity CLI
 * المسار الثالث والرسمي لدمج الأداة كمساعد تطوير خارجي داخل عبقرينو سوبر
 */

import React, { useState, useEffect } from 'react';
import {
  antigravityService,
  AntigravityStatus,
  AntigravityExecutionLog,
  AntigravityTaskResult
} from '../services/antigravityService';
import {
  Terminal,
  Play,
  Square,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Cpu,
  ShieldCheck,
  Key,
  Copy,
  Download,
  Code2,
  ExternalLink,
  Smartphone,
  Server,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';

export const AntigravityCommandCenter: React.FC = () => {
  const [status, setStatus] = useState<AntigravityStatus>(antigravityService.getStatus());
  const [logs, setLogs] = useState<AntigravityExecutionLog[]>(antigravityService.getLogs());
  const [activeTask, setActiveTask] = useState<'code_analysis' | 'bug_audit' | 'architecture_review'>('code_analysis');
  const [taskResult, setTaskResult] = useState<AntigravityTaskResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showInvalidGrantDialog, setShowInvalidGrantDialog] = useState(false);

  useEffect(() => {
    const unsub = antigravityService.subscribe((st) => {
      setStatus(st);
      setLogs(antigravityService.getLogs());
    });
    return () => unsub();
  }, []);

  const handleStart = async () => {
    setIsProcessing(true);
    const res = await antigravityService.startService();
    setIsProcessing(false);
    setActionNotice(res.message);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleStop = async () => {
    setIsProcessing(true);
    const res = await antigravityService.stopService();
    setIsProcessing(false);
    setActionNotice(res.message);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleDoctor = async () => {
    setIsProcessing(true);
    const res = await antigravityService.runDoctor();
    setIsProcessing(false);
    setActionNotice('اكتمل فحص Doctor للبيئة والاعتماديات بنجاح.');
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handlePing = async () => {
    setIsProcessing(true);
    const res = await antigravityService.testConnection();
    setIsProcessing(false);
    setActionNotice(res.message);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleAuthenticate = async () => {
    setIsProcessing(true);
    const res = await antigravityService.authenticate('counselor.attia@abqarino.com');
    setIsProcessing(false);
    setActionNotice(res.message);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleDeauth = () => {
    const res = antigravityService.deauthenticate();
    setActionNotice(res.message);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleExecuteTask = async () => {
    setIsProcessing(true);
    const result = await antigravityService.executeAssistantTask(
      activeTask,
      '// Project files triage from /src/'
    );
    setTaskResult(result);
    setIsProcessing(false);
    setActionNotice(`أتمت Antigravity تنفيذ مهمة (${activeTask}) بنجاح.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleCopyTermuxCommand = () => {
    navigator.clipboard.writeText(antigravityService.getTermuxBridgeCommand());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const invalidGrantInfo = antigravityService.diagnoseInvalidGrant();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-cyan-950/40">
              <Terminal className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white">Antigravity Command Center</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                  status.isRunning
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${status.isRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  <span>{status.isRunning ? 'Daemon يعمل' : 'متوقف مؤقتاً'}</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                مركز إدارة وتشغيل أداة Antigravity CLI الرسمية كمساعد تطوير خارجي لفحص وتطوير مشاريع عبقرينو سوبر • مفصولة تماماً عن أوزان النموذج المستقل والعقل المحلي.
              </p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {!status.isRunning ? (
              <button
                onClick={handleStart}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>تشغيل الأداة</span>
              </button>
            ) : (
              <button
                onClick={handleStop}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>إيقاف الأداة</span>
              </button>
            )}

            <button
              onClick={handlePing}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
              title="اختبار زمن الاتصال"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>اختبار الاتصال ({status.lastPingMs}ms)</span>
            </button>

            <button
              onClick={handleDoctor}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
              title="فحص بيئة التثبيت"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>فحص التثبيت (Doctor)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="bg-cyan-950/90 border border-cyan-500/40 p-4 rounded-2xl flex items-center justify-between text-cyan-200 text-xs sm:text-sm animate-in fade-in shadow-xl">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-semibold">{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-cyan-400 hover:text-cyan-200 text-xs underline"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Grid: Status Cards & Environment Triage */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1.5">
          <span className="text-slate-400 text-xs flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>إصدار الأداة المعتمد:</span>
          </span>
          <div className="font-mono font-bold text-white text-sm sm:text-base">{status.version}</div>
          <span className="text-[11px] text-emerald-400 block">الملف التنفيذي جاهز</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1.5">
          <span className="text-slate-400 text-xs flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span>بيئة التشغيل الحالية:</span>
          </span>
          <div className="font-bold text-slate-200 text-xs sm:text-sm truncate">{status.runtimeEnvironment}</div>
          <span className="text-[11px] text-slate-400 block font-mono">Port: {status.activePort}</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1.5">
          <span className="text-slate-400 text-xs flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>حالة المصادقة:</span>
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs sm:text-sm font-bold ${
              status.authStatus === 'authenticated' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {status.authStatus === 'authenticated' ? 'مصادق (Verified)' : 'غير مسجل دخول'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block truncate">
            {status.authAccount || 'حساب المالك لم يُربط بعد'}
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1.5">
          <span className="text-slate-400 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>الفصل المعماري:</span>
          </span>
          <div className="font-bold text-emerald-300 text-xs sm:text-sm">معزولة كلياً</div>
          <span className="text-[11px] text-slate-400 block">مساعد تطوير فقط (No Model Override)</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assistant Task Execution & Termux Phone Link (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Assistant Tasks Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">تنفيذ مهام التطوير بمساعدة Antigravity</h3>
              </div>
              <span className="text-xs text-slate-400">مساعد كودي حصري للمالك</span>
            </div>

            {/* Task Type Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTask('code_analysis')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                  activeTask === 'code_analysis'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                تحليل الكود والأنواع
              </button>
              <button
                onClick={() => setActiveTask('bug_audit')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                  activeTask === 'bug_audit'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                فحص الثغرات (Zip Slip)
              </button>
              <button
                onClick={() => setActiveTask('architecture_review')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                  activeTask === 'architecture_review'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                المراجعة المعمارية
              </button>
            </div>

            {/* Execute Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleExecuteTask}
                disabled={isProcessing}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>تشغيل الفحص والتحليل الآن عبر CLI</span>
              </button>

              {taskResult && (
                <span className="text-xs text-emerald-400 font-mono">
                  اكتمل في {taskResult.executionTimeMs} ms
                </span>
              )}
            </div>

            {/* Findings Display */}
            {taskResult && (
              <div className="space-y-3 pt-3 border-t border-slate-800 animate-in fade-in">
                <div className="text-xs text-slate-300 leading-relaxed font-semibold">
                  {taskResult.summary}
                </div>
                <div className="space-y-2">
                  {taskResult.findings.map((f, idx) => (
                    <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-cyan-300">{f.file}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          f.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {f.severity === 'critical' ? 'حرج' : 'توصية'}
                        </span>
                      </div>
                      <p className="text-slate-300">{f.description}</p>
                      <p className="text-emerald-400 font-mono text-[11px]">الحل: {f.remediation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Termux Phone Bridge Card (المسار الأول والثاني) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">ربط أداة Antigravity من هاتف المستشار (Termux / Ubuntu)</h3>
              </div>
              <button
                onClick={handleCopyTermuxCommand}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'تم النسخ!' : 'نسخ أمر الهاتف'}</span>
              </button>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              إذا كانت النسخة الأصلية مثبتة مسبقاً على هاتف المستشار عطيه داخل بيئة Termux أو Ubuntu، يمكنك فتح موجه Termux وتشغيل هذا الأمر الموحد لربطها فوراً كعقدة معالجة متصلة بمركز قيادة عبقرينو:
            </p>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {antigravityService.getTermuxBridgeCommand()}
            </pre>
          </div>
        </div>

        {/* Right Column: Execution Logs & Auth Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Auth Management & invalid_grant Resolver */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">إدارة المصادقة الرسمية</h3>
              </div>
              <button
                onClick={() => setShowInvalidGrantDialog(!showInvalidGrantDialog)}
                className="text-xs text-amber-400 hover:text-amber-300 underline"
              >
                تشخيص خطأ invalid_grant
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              تدفق المصادقة الرسمي لا يتطلب وضع كلمات المرور داخل المحادثة، ويتم حفظ الرموز مشفرة في التخزين الآمن.
            </p>

            {status.authStatus !== 'authenticated' ? (
              <button
                onClick={handleAuthenticate}
                disabled={isProcessing}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Key className="w-4 h-4" />
                <span>التحقق من مصادقة الحساب المعتمد</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-emerald-950/60 border border-emerald-500/40 p-3.5 rounded-2xl flex items-center justify-between text-xs text-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>جلسة معتمدة: {status.authAccount}</span>
                  </div>
                </div>
                <button
                  onClick={handleDeauth}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  إلغاء المصادقة ومسح الرموز
                </button>
              </div>
            )}

            {/* invalid_grant Diagnostic Modal / Box */}
            {showInvalidGrantDialog && (
              <div className="bg-amber-950/40 border border-amber-600/40 p-4 rounded-2xl space-y-2.5 text-xs text-slate-300 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>أسباب وحلول خطأ (invalid_grant) في Termux:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {invalidGrantInfo.cause}
                </p>
                <div className="space-y-1 pt-1 text-[11px] text-amber-200">
                  {invalidGrantInfo.resolutionSteps.map((step, sIdx) => (
                    <div key={sIdx}>{step}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Real-time Execution Logs Stream */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">سجل التنفيذ الحي (Live Logs)</h3>
              </div>
              <button
                onClick={() => antigravityService.clearLogs()}
                className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>تصفير</span>
              </button>
            </div>

            <div className="h-72 overflow-y-auto space-y-2 p-3 bg-slate-950 rounded-2xl border border-slate-800/80 font-mono text-[11px]">
              {logs.map((log) => (
                <div key={log.id} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/50 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span className="text-cyan-400 font-bold">$ {log.command}</span>
                    <span>{log.timestamp} ({log.executionTimeMs}ms)</span>
                  </div>
                  <div className={`leading-relaxed ${
                    log.level === 'error'
                      ? 'text-rose-400'
                      : log.level === 'warn'
                      ? 'text-amber-400'
                      : log.level === 'success'
                      ? 'text-emerald-400'
                      : 'text-slate-300'
                  }`}>
                    {log.output}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AntigravityCommandCenter;
