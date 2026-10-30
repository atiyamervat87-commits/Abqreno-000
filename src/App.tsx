/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudioTab, Project, DeliveryLogEntry } from './types';
import { INITIAL_PROJECTS } from './data/mockProjects';
import { Navbar } from './components/Navbar';
import { HomeLauncher } from './components/HomeLauncher';
import { CreationStudio } from './components/CreationStudio';
import { RepairStudio } from './components/RepairStudio';
import { NeuralBrainLab } from './components/NeuralBrainLab';
import { AdminDeliveryPortal } from './components/AdminDeliveryPortal';
import { BackupCenter } from './components/BackupCenter';
import { ThreeScene } from './components/ThreeScene';
import { ProjectReportModal } from './components/ProjectReportModal';
import { PhoneCall, ShieldCheck, Sparkles, Archive, Heart } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<StudioTab>('launcher');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [selectedReportProject, setSelectedReportProject] = useState<Project | null>(null);

  // Pending deliveries count for badge
  const pendingDeliveriesCount = projects.filter(
    (p) => p.status === 'completed_pending_delivery_approval'
  ).length;

  // Handle new project creation from Creation Studio
  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  // Handle repaired project from Repair Studio
  const handleProjectRepaired = (repairedProject: Project) => {
    setProjects((prev) => [repairedProject, ...prev]);
  };

  // Admin login handler
  const handleAdminLogin = (password: string): boolean => {
    // Master passkey for platform owner
    if (password === 'abqarino2026' || password === '01153747612') {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  // Record payment verified status
  const handleRecordPayment = (projectId: string, verified: boolean) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updated = { ...p, paymentVerifiedByOwner: verified };
          updated.auditLogs.push({
            id: `aud-pay-${Date.now()}`,
            action: verified ? 'تأكيد استلام الدفع' : 'إلغاء تأكيد الدفع',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            userOrAdmin: 'صاحب المنصة (01153747612)',
            details: verified
              ? 'تم التحقق من تحويل الدفع عبر محفظة 01153747612.'
              : 'تم تعليق حالة التحقق من الدفع.'
          });
          return updated;
        }
        return p;
      })
    );
  };

  // Confirm external delivery via WhatsApp (Chapter 10)
  const handleConfirmExternalDelivery = (
    projectId: string,
    log: Omit<DeliveryLogEntry, 'id' | 'timestamp'>
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
          const newEntry: DeliveryLogEntry = {
            id: `deliv-${Date.now()}`,
            timestamp,
            ...log
          };

          const updated = {
            ...p,
            status: 'externally_delivered' as const,
            deliveredAt: timestamp,
            deliveryLogs: [newEntry, ...p.deliveryLogs]
          };

          updated.auditLogs.push({
            id: `aud-deliv-${Date.now()}`,
            action: 'تأكيد التسليم الخارجي عبر واتساب',
            timestamp,
            userOrAdmin: 'صاحب المنصة (ADMIN)',
            details: `تم إرسال البرنامج النهائي إلى ${log.recipientContact} عبر واتساب بنجاح.`
          });

          return updated;
        }
        return p;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Global Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isAdminAuthenticated={isAdminAuthenticated}
        pendingDeliveriesCount={pendingDeliveriesCount}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'launcher' && (
          <HomeLauncher
            onSelectTab={setCurrentTab}
            projects={projects}
            isAdminAuthenticated={isAdminAuthenticated}
          />
        )}

        {currentTab === 'creation' && (
          <CreationStudio
            onProjectCreated={handleProjectCreated}
            onNavigateToDeliveryVault={() => setCurrentTab('admin_delivery')}
          />
        )}

        {currentTab === 'repair' && (
          <RepairStudio
            onProjectRepaired={handleProjectRepaired}
            onNavigateToDeliveryVault={() => setCurrentTab('admin_delivery')}
          />
        )}

        {currentTab === 'neural_brain' && <NeuralBrainLab />}

        {currentTab === 'three_lab' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">المختبر المجسم ثلاثي الأبعاد (Three.js 3D Lab)</h2>
                <p className="text-xs text-slate-400">
                  نماذج إجرائية متطورة مركبة من 3-12 جزءاً، إضاءة استوديو PBR، وتفكيك تفاعلي 60 إطاراً في الثانية
                </p>
              </div>
            </div>
            <ThreeScene adminUnlocked={isAdminAuthenticated} />
          </div>
        )}

        {currentTab === 'admin_delivery' && (
          <AdminDeliveryPortal
            projects={projects}
            isAdminAuthenticated={isAdminAuthenticated}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            onRecordPayment={handleRecordPayment}
            onConfirmExternalDelivery={handleConfirmExternalDelivery}
            onViewProjectReport={(proj) => setSelectedReportProject(proj)}
          />
        )}

        {currentTab === 'backup_center' && <BackupCenter projects={projects} />}
      </main>

      {/* Project Report Modal */}
      <ProjectReportModal
        project={selectedReportProject}
        onClose={() => setSelectedReportProject(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">عبقرينو Studio Ultimate</div>
              <p className="text-[11px] text-slate-500">
                منصة متكاملة لإنشاء البرامج وإصلاحها • نظام التحكم الحصري في التسليم
              </p>
            </div>
          </div>

          {/* Coordination Call Center */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">المحفظة والتنسيق:</span>
              <span className="font-mono font-bold text-amber-300">01153747612</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
              <Archive className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">حفظ الهاتف:</span>
              <span className="font-mono text-emerald-300">/sdcard/Download/</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 font-mono">
            جميع الحقوق محفوظة © 2026 عبقرينو Studio
          </div>
        </div>
      </footer>
    </div>
  );
}
