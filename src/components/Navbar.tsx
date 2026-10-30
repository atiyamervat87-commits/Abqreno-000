/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudioTab } from '../types';
import {
  Sparkles,
  Wrench,
  Cpu,
  ShieldCheck,
  Archive,
  Layers,
  Box,
  Lock,
  Unlock,
  Bot,
  Terminal
} from 'lucide-react';

interface NavbarProps {
  currentTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  isAdminAuthenticated: boolean;
  pendingDeliveriesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isAdminAuthenticated,
  pendingDeliveriesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Platform Name */}
          <div
            onClick={() => onSelectTab('launcher')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                  عبقرينو Studio
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/80 uppercase">
                  Ultimate
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono leading-none">
                محرك التطوير • العقل المستقل • التحكم الحصري
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectTab('launcher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'launcher'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </button>

            <button
              onClick={() => onSelectTab('abqarino_chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'abqarino_chat'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-300" />
              <span>محادثة عبقرينو</span>
            </button>

            <button
              onClick={() => onSelectTab('creation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'creation'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>إنشاء البرامج</span>
            </button>

            <button
              onClick={() => onSelectTab('repair')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'repair'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-amber-300" />
              <span>فحص وإصلاح</span>
            </button>

            <button
              onClick={() => onSelectTab('neural_brain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'neural_brain'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-300" />
              <span>مركز تطوير العقل</span>
            </button>

            <button
              onClick={() => onSelectTab('antigravity')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'antigravity'
                  ? 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-300" />
              <span>Antigravity CLI</span>
            </button>

            <button
              onClick={() => onSelectTab('tools_management')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'tools_management'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-amber-300" />
              <span>إدارة الأدوات</span>
            </button>

            <button
              onClick={() => onSelectTab('three_lab')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'three_lab'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-purple-300" />
              <span>المجسمات 3D</span>
            </button>

            <button
              onClick={() => onSelectTab('backup_center')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'backup_center'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-emerald-300" />
              <span>النسخ والعمليات</span>
            </button>
          </nav>

          {/* Exclusive Delivery Control Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('admin_delivery')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shadow-md ${
                currentTab === 'admin_delivery'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-rose-950/40'
                  : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-rose-500/80 hover:text-rose-300'
              }`}
              title="نظام التحكم الحصري في تسليم البرامج (الباب العاشر)"
            >
              {isAdminAuthenticated ? (
                <Unlock className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-rose-400" />
              )}
              <span className="hidden sm:inline">إدارة التسليم الحصري</span>
              <span className="font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 border border-slate-800">
                01153747612
              </span>
              {pendingDeliveriesCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {pendingDeliveriesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="xl:hidden flex items-center justify-between py-2 border-t border-slate-800/80 overflow-x-auto gap-1 text-xs">
          <button
            onClick={() => onSelectTab('launcher')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'launcher' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onSelectTab('abqarino_chat')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'abqarino_chat' ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold' : 'text-slate-400'}`}
          >
            محادثة عبقرينو
          </button>
          <button
            onClick={() => onSelectTab('creation')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'creation' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
          >
            إنشاء البرامج
          </button>
          <button
            onClick={() => onSelectTab('repair')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'repair' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
          >
            فحص وإصلاح
          </button>
          <button
            onClick={() => onSelectTab('neural_brain')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'neural_brain' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
          >
            مركز تطوير العقل
          </button>
          <button
            onClick={() => onSelectTab('antigravity')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'antigravity' ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold' : 'text-slate-400'}`}
          >
            Antigravity CLI
          </button>
          <button
            onClick={() => onSelectTab('tools_management')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'tools_management' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
          >
            إدارة الأدوات
          </button>
          <button
            onClick={() => onSelectTab('three_lab')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'three_lab' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
          >
            3D Studio
          </button>
          <button
            onClick={() => onSelectTab('backup_center')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'backup_center' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
          >
            النسخ والعمليات
          </button>
        </div>
      </div>
    </header>
  );
};
