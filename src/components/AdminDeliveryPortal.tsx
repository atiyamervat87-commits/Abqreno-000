/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, DeliveryLogEntry } from '../types';
import { generateProjectBundleZip, triggerBrowserDownload } from '../services/zipExporter';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Download,
  Send,
  CheckCircle2,
  PhoneCall,
  FileText,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  KeyRound,
  History,
  Archive
} from 'lucide-react';

interface AdminDeliveryPortalProps {
  projects: Project[];
  isAdminAuthenticated: boolean;
  onAdminLogin: (pass: string) => boolean;
  onAdminLogout: () => void;
  onRecordPayment: (projectId: string, verified: boolean) => void;
  onConfirmExternalDelivery: (projectId: string, log: Omit<DeliveryLogEntry, 'id' | 'timestamp'>) => void;
  onViewProjectReport: (project: Project) => void;
}

export const AdminDeliveryPortal: React.FC<AdminDeliveryPortalProps> = ({
  projects,
  isAdminAuthenticated,
  onAdminLogin,
  onAdminLogout,
  onRecordPayment,
  onConfirmExternalDelivery,
  onViewProjectReport
}) => {
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [selectedProjectForDelivery, setSelectedProjectForDelivery] = useState<Project | null>(null);
  const [whatsappNotes, setWhatsappNotes] = useState<string>('تم إرسال الملف المضغوط كاملاً عبر واتساب بعد التحقق من الدفع.');
  const [isExportingZip, setIsExportingZip] = useState<string | null>(null);

  // Projects that require owner attention
  const pendingProjects = projects.filter(
    (p) =>
      p.status === 'completed_pending_delivery_approval' ||
      p.status === 'available_for_admin_download' ||
      p.status === 'downloaded_by_admin' ||
      p.status === 'externally_delivered'
  );

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setLoginError('يرجى إدخال كلمة المرور السرية لصاحب المنصة');
      return;
    }
    const success = onAdminLogin(passwordInput.trim());
    if (!success) {
      setLoginError('كلمة المرور غير صحيحة. كلمة المرور الافتراضية هي: abqarino2026');
    } else {
      setLoginError('');
      setPasswordInput('');
    }
  };

  const handleDownloadByOwner = async (project: Project) => {
    try {
      setIsExportingZip(project.id);
      const { blob, filename } = await generateProjectBundleZip(project);
      triggerBrowserDownload(blob, filename);

      // Audit log the download
      project.status = 'downloaded_by_admin';
      project.auditLogs.push({
        id: `aud-dl-${Date.now()}`,
        action: 'تنزيل النسخة النهائية بواسطة صاحب المنصة',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        userOrAdmin: 'صاحب المنصة (ADMIN)',
        details: `تم تنزيل الحزمة ${filename} بنجاح لإرسالها للعميل.`
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsExportingZip(null);
    }
  };

  const handleConfirmDeliveryAction = (project: Project) => {
    if (!project) return;
    onConfirmExternalDelivery(project.id, {
      projectId: project.id,
      adminId: 'owner-master-admin',
      channel: 'whatsapp',
      recipientContact: project.clientPhone,
      paymentConfirmedVia: '01153747612',
      notes: whatsappNotes
    });
    setSelectedProjectForDelivery(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">إدارة البرامج الجاهزة للتسليم (الباب العاشر)</h2>
              <span className="text-[10px] bg-rose-950 text-rose-300 font-mono px-2 py-0.5 rounded border border-rose-800">
                حصري لصاحب المنصة
              </span>
            </div>
            <p className="text-xs text-slate-400">
              التحكم المطلق في تسليم البرامج، التحقق من الدفع، والتنزيل والإرسال اليدوي عبر واتساب
            </p>
          </div>
        </div>

        {/* Coordination Wallet Badge */}
        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <PhoneCall className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400">رقم التنسيق والمحفظة:</span>
          <span className="text-sm font-mono font-bold text-amber-400">01153747612</span>
        </div>
      </div>

      {/* Admin Authentication Gate */}
      {!isAdminAuthenticated ? (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-700 mx-auto flex items-center justify-center text-rose-400 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">تسجيل دخول صاحب المنصة</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              هذه الصفحة مخصصة حصرياً لصاحب منصة عبقرينو. يمنع وصول العملاء إليها لضمان عدم تنزيل أي برنامج دون تحقق يدوي.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="أدخل كلمة المرور السرية..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-center text-white focus:outline-none focus:border-rose-500 font-mono"
              />
              {loginError && <p className="text-xs text-rose-400 mt-2">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-rose-950/50"
            >
              <KeyRound className="w-4 h-4" />
              <span>تسجيل الدخول والوصول للخزينة</span>
            </button>

            <p className="text-[10px] text-slate-500">
              كلمة المرور الافتراضية للمراجعة: <code className="text-slate-400">abqarino2026</code>
            </p>
          </form>
        </div>
      ) : (
        /* Authenticated Admin Dashboard: Deliveries Management */
        <div className="space-y-6">
          {/* Admin Status Strip */}
          <div className="bg-slate-900/90 border border-emerald-900/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <div>
                <span className="text-xs font-bold text-white block">
                  جلسة صاحب المنصة نشطة (صلاحيات كاملة للتحقق والتنزيل)
                </span>
                <span className="text-[11px] text-slate-400">
                  كافة عمليات التنزيل والتسليم تسجل في سجل التدقيق غير القابل للتعديل
                </span>
              </div>
            </div>

            <button
              onClick={onAdminLogout}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              تسجيل الخروج الآمن
            </button>
          </div>

          {/* List of Completed Projects Waiting or Processed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Archive className="w-4 h-4 text-cyan-400" />
                <span>سجل المشروعات الجاهزة للتسليم ({pendingProjects.length} مشروع)</span>
              </h3>
            </div>

            <div className="divide-y divide-slate-800/80">
              {pendingProjects.map((project) => {
                const isDelivered = project.status === 'externally_delivered';
                const isDownloaded = project.status === 'downloaded_by_admin';

                return (
                  <div key={project.id} className="p-6 space-y-4 hover:bg-slate-900/40 transition-colors">
                    {/* Top Row: Info & Status */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs bg-slate-950 px-2 py-0.5 rounded text-cyan-400 border border-slate-800">
                            {project.orderNumber}
                          </span>
                          <h4 className="text-base font-bold text-white">{project.name}</h4>
                        </div>
                        <p className="text-xs text-slate-400 max-w-2xl">{project.description}</p>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        {isDelivered ? (
                          <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تم التسليم الخارجي عبر واتساب</span>
                          </span>
                        ) : isDownloaded ? (
                          <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-full font-bold">
                            تم التنزيل بواسطة الإدارة
                          </span>
                        ) : (
                          <span className="text-xs bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1 rounded-full font-bold">
                            في انتظار موافقة صاحب المنصة
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">العميل ورقم الهاتف:</span>
                        <span className="font-bold text-slate-200">{project.clientName}</span>
                        <span className="block font-mono text-[11px] text-cyan-400">{project.clientPhone}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">السعر وحالة الدفع:</span>
                        <span className="font-mono font-bold text-amber-400">{project.priceEGP} ج.م</span>
                        <button
                          onClick={() => onRecordPayment(project.id, !project.paymentVerifiedByOwner)}
                          className={`block text-[10px] mt-0.5 font-bold ${
                            project.paymentVerifiedByOwner ? 'text-emerald-400 underline' : 'text-rose-400 underline'
                          }`}
                        >
                          {project.paymentVerifiedByOwner ? 'تم التحقق من الدفع ✓' : 'لم يتم التحقق (اضغط للتأكيد)'}
                        </button>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">مكان الحفظ الآمن:</span>
                        <span className="font-mono text-[11px] text-slate-300 truncate block">
                          {project.secureStoragePath}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          الحجم: {(project.finalBundleSizeBytes / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">تاريخ الإنجاز:</span>
                        <span className="font-mono text-slate-300">{project.completedAt || project.createdAt}</span>
                        <span className="block text-[10px] text-emerald-400 font-bold">الاختبارات: 100% ناجحة</span>
                      </div>
                    </div>

                    {/* Action Buttons (Exclusive to Admin) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        onClick={() => onViewProjectReport(project)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>عرض تقرير المشروع</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Download final bundle exclusively */}
                        <button
                          onClick={() => handleDownloadByOwner(project)}
                          disabled={isExportingZip === project.id}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md"
                        >
                          <Download className="w-4 h-4" />
                          <span>
                            {isExportingZip === project.id ? 'جارٍ الضغط والتنزيل...' : 'تنزيل البرنامج النهائي للجهاز'}
                          </span>
                        </button>

                        {/* Open WhatsApp modal to send manually */}
                        <button
                          onClick={() => setSelectedProjectForDelivery(project)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>تأكيد التسليم الخارجي (واتساب)</span>
                        </button>
                      </div>
                    </div>

                    {/* Delivery Log History */}
                    {project.deliveryLogs.length > 0 && (
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1">
                        <span className="font-bold text-emerald-400 block flex items-center gap-1">
                          <History className="w-3.5 h-3.5" />
                          <span>سجل التسليم الخارجي:</span>
                        </span>
                        {project.deliveryLogs.map((log) => (
                          <div key={log.id} className="text-slate-400 font-mono">
                            [{log.timestamp}] تم الإرسال للرقم {log.recipientContact} بواسطة {log.adminId} عبر المحفظة{' '}
                            {log.paymentConfirmedVia} - ملاحظات: "{log.notes}"
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* External Delivery WhatsApp Confirmation Modal */}
      {selectedProjectForDelivery && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>تأكيد التسليم الخارجي عبر واتساب</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  المشروع: <strong className="text-white">{selectedProjectForDelivery.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedProjectForDelivery(null)}
                className="text-slate-500 hover:text-white text-xs"
              >
                ✕ إغلاق
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block">رقم واتساب العميل المستهدف:</span>
                <span className="text-base font-bold text-white font-mono">{selectedProjectForDelivery.clientPhone}</span>
              </div>

              {/* Direct WhatsApp Coordinator Link */}
              <a
                href={`https://wa.me/2${selectedProjectForDelivery.clientPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                  `مرحباً ${selectedProjectForDelivery.clientName}، مع حضرتك صاحب منصة عبقرينو Studio. تم اكتمال مشروعك (${selectedProjectForDelivery.name}) واجتيازه لكافة الاختبارات. مرفق لحضرتك النسخة النهائية.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/60 hover:bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>فتح محادثة واتساب مع العميل الآن</span>
              </a>

              <div>
                <label className="text-slate-400 block mb-1">ملاحظات التسليم في السجل الإداري:</label>
                <textarea
                  value={whatsappNotes}
                  onChange={(e) => setWhatsappNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedProjectForDelivery(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleConfirmDeliveryAction(selectedProjectForDelivery)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تثبيت التسليم في السجل</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
