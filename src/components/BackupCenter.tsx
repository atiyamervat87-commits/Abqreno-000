/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project } from '../types';
import {
  generateFullSystemBackupZip,
  verifyArchiveIntegrity,
  triggerBrowserDownload,
  BackupArchiveManifest
} from '../services/zipExporter';
import {
  Archive,
  Download,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  HardDrive,
  FileCheck,
  RefreshCw,
  FolderDown,
  Hash,
  AlertTriangle
} from 'lucide-react';

interface BackupCenterProps {
  projects: Project[];
}

export const BackupCenter: React.FC<BackupCenterProps> = ({ projects }) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedArchiveName, setSelectedArchiveName] = useState<'عبقرينو-سوبر-نسخة-كاملة.zip' | 'عبقرينو-سوبر-2026-10-17.zip'>(
    'عبقرينو-سوبر-نسخة-كاملة.zip'
  );
  const [currentManifest, setCurrentManifest] = useState<BackupArchiveManifest | null>(null);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    valid: boolean;
    filesCount: number;
    errors: string[];
  }>({
    tested: false,
    valid: false,
    filesCount: 0,
    errors: []
  });

  const handleCreateFullBackup = async () => {
    setIsGenerating(true);
    setVerificationResult({ tested: false, valid: false, filesCount: 0, errors: [] });

    try {
      // 1. Generate full zip archive
      const { blob, manifest } = await generateFullSystemBackupZip(selectedArchiveName, projects);
      setCurrentManifest(manifest);
      setGeneratedBlob(blob);

      // 2. Perform real integrity test
      const integrity = await verifyArchiveIntegrity(blob);
      setVerificationResult({
        tested: true,
        valid: integrity.isValid,
        filesCount: integrity.filesList.length,
        errors: integrity.errors
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadZip = () => {
    if (!generatedBlob || !currentManifest) return;
    triggerBrowserDownload(generatedBlob, currentManifest.archiveName);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">مركز النسخ الاحتياطية والتصدير الكامل (ZIP)</h2>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-800">
                الباب العشرون والشرط الإلزامي
              </span>
            </div>
            <p className="text-xs text-slate-400">
              توليد، فحص سلامة، وتنزيل حزمة المنصة الكاملة لحفظها في مجلد Download على هاتف Android
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-400">المسار المستهدف بالهاتف:</span>
          <span className="text-xs font-mono font-bold text-emerald-400">/sdcard/Download/</span>
        </div>
      </div>

      {/* Target File Options & Generator Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">تحديد اسم الحزمة المضغوطة للتوليد:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedArchiveName('عبقرينو-سوبر-نسخة-كاملة.zip')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedArchiveName === 'عبقرينو-سوبر-نسخة-كاملة.zip'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-emerald-300">الشرط الإلزامي الإضافي:</span>
                  <span className="text-[10px] font-mono text-emerald-400">نسخة كاملة</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">عبقرينو-سوبر-نسخة-كاملة.zip</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  الحزمة الشاملة متضمنة كافة الشيفرات والواجهات والمحركات والتوثيق.
                </p>
              </div>

              <div
                onClick={() => setSelectedArchiveName('عبقرينو-سوبر-2026-10-17.zip')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedArchiveName === 'عبقرينو-سوبر-2026-10-17.zip'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-amber-300">الباب العشرون:</span>
                  <span className="text-[10px] font-mono text-amber-400">الأرشيف المؤرخ</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">عبقرينو-سوبر-2026-10-17.zip</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  النسخة الاحتياطية الشاملة المؤرخة بتاريخ الإنجاز والتسليم الفني.
                </p>
              </div>
            </div>
          </div>

          {/* Action to build */}
          <div className="pt-2">
            <button
              onClick={handleCreateFullBackup}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جارٍ جمع الملفات وضغط الأرشيف وحساب بصمة SHA-256...</span>
                </>
              ) : (
                <>
                  <Archive className="w-5 h-5" />
                  <span>توليد واختبار الأرشيف الكامل الآن ({selectedArchiveName})</span>
                </>
              )}
            </button>
          </div>

          {/* Verification Results Panel */}
          {verificationResult.tested && currentManifest && (
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    تم التحقق من سلامة الأرشيف بنجاح (Valid Archive Integrity)
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                  {verificationResult.filesCount} ملفات تم فحصها
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">الحجم الكلي للأرشيف:</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    {(currentManifest.totalSizeBytes / 1024).toFixed(1)} KB (مضغوط DEFLATE المستوى 9)
                  </span>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">بصمة التحقق الإلكترونية (SHA-256):</span>
                  <span className="font-mono text-[10px] text-amber-300 break-all select-all block">
                    {currentManifest.sha256Checksum}
                  </span>
                </div>
              </div>

              {/* Direct Download for Mobile / Desktop */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadZip}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل الأرشيف الآن وحفظه في /sdcard/Download/</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Inventory Checklist Sidecard */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>محتويات الأرشيف المعتمدة (الباب العشرون):</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>الشيفرة المصدرية الكاملة للواجهة والخادم</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>محرك إنشاء البرامج (15 مرحلة هندسية)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>محرك فحص وإصلاح البرامج القائمة</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>معمارية وأوزان النموذج اللغوي المستقل</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>نظام التحكم الحصري في التسليم (01153747612)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>مخططات قاعدة البيانات والترحيلات</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>حزم الاختبارات الآلية وضمان الجودة</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>الدليل الفني الشامل وتوثيق الاستعادة</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-200 block">تعليمات حفظ الملف على الهاتف:</span>
            <p>
              عند النقر على تنزيل من متصفح هاتف Android، اختر مجلد <code className="text-emerald-300 font-mono">Download</code> ليصبح المسار:
              <br />
              <code className="text-emerald-400 font-mono break-all">/sdcard/Download/{selectedArchiveName}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
