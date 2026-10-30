/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, RepairDiagnosis } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-deliv-001',
    orderNumber: 'ABQ-2026-8819',
    name: 'منظومة إدارة عيادات تبارك الطبية',
    description: 'تطبيق ويب وهواتف متكامل لحجز المواعيد وإدارة الملفات الطبية والروشتات الإلكترونية مع ربط واتساب.',
    clientName: 'د. محمود عبد الرحمن',
    clientPhone: '01099234812',
    clientEmail: 'dr.mahmoud@tabarak-clinic.com',
    type: 'creation',
    techStack: ['React 19', 'TypeScript', 'Node.js', 'Express', 'SQLite', 'Tailwind CSS'],
    status: 'completed_pending_delivery_approval',
    currentStageNumber: 15,
    priceEGP: 6500,
    paymentVerifiedByOwner: false,
    paymentReferencePhone: '01153747612',
    secureStoragePath: '/secure/vault/production_builds/ABQ-2026-8819_tabarak.zip',
    finalBundleSizeBytes: 14852900, // ~14.8 MB
    createdAt: '2026-10-15 14:30',
    completedAt: '2026-10-17 19:45',
    requirements: [
      { id: 'req-1', title: 'سجل المريض الإلكتروني', description: 'حفظ التاريخ المرضي والأدوية المزمنة مع التشفير.', category: 'core', approved: true },
      { id: 'req-2', title: 'حجز المواعيد والإشعارات', description: 'جدولة الكشوفات وإرسال تذكير عبر الرسائل.', category: 'core', approved: true },
      { id: 'req-3', title: 'قاعدة بيانات SQLite محلية وآمنة', description: 'جداول المرضى، المواعيد، والأطباء.', category: 'database', approved: true },
      { id: 'req-4', title: 'عزل الصلاحيات الطبية', description: 'أطباء، تمريض، استقبال مع حماية JWT.', category: 'security', approved: true }
    ],
    screens: [
      {
        id: 'scr-1',
        name: 'لوحة التحكم الرئيسية',
        route: '/dashboard',
        description: 'إحصائيات المرضى، جدول اليوم، والإيرادات.',
        components: ['StatsCards', 'TodayAppointmentsTable', 'QuickAddPatientModal'],
        responsiveBreakpoints: ['mobile', 'tablet', 'desktop'],
        inputs: ['SearchPatientInput', 'DateFilterSelect'],
        actions: ['ExportDailyReport', 'NewAppointment']
      },
      {
        id: 'scr-2',
        name: 'ملف المريض والروشتة',
        route: '/patients/:id',
        description: 'عرض السيرة المرضية وإصدار روشتة قابلة للطباعة.',
        components: ['PatientBioHeader', 'PrescriptionEditor', 'LabResultsTimeline'],
        responsiveBreakpoints: ['mobile', 'tablet', 'desktop'],
        inputs: ['DrugNameAutosuggest', 'DosageInput', 'NotesTextarea'],
        actions: ['PrintPrescription', 'SaveMedicalRecord']
      },
      {
        id: 'scr-3',
        name: 'بوابة المريض وحجز الموعد',
        route: '/booking',
        description: 'واجهة بسيطة متجاوبة بالكامل لحجز موعد المريض.',
        components: ['ClinicSpecialtyPicker', 'TimeSlotGrid', 'BookingSummaryCard'],
        responsiveBreakpoints: ['mobile', 'tablet', 'desktop'],
        inputs: ['PatientName', 'NationalId', 'PhoneInput'],
        actions: ['ConfirmBooking', 'CancelBooking']
      }
    ],
    files: [
      {
        path: 'src/server/index.ts',
        language: 'typescript',
        sizeBytes: 3420,
        lastModified: '2026-10-17 19:10',
        content: `import express from 'express';
import { patientRouter } from './routes/patients';
import { appointmentRouter } from './routes/appointments';

const app = express();
app.use(express.json());

// Routes
app.use('/api/patients', patientRouter);
app.use('/api/appointments', appointmentRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '2.4.0', timestamp: new Date() });
});

export default app;`
      },
      {
        path: 'src/server/database/schema.sql',
        language: 'sql',
        sizeBytes: 1850,
        lastModified: '2026-10-17 18:40',
        content: `CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  national_id TEXT UNIQUE,
  chronic_diseases TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  slot_time DATETIME NOT NULL,
  status TEXT DEFAULT 'confirmed',
  fee REAL NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);`
      },
      {
        path: 'src/client/App.tsx',
        language: 'typescript',
        sizeBytes: 4210,
        lastModified: '2026-10-17 19:30',
        content: `import React, { useState } from 'react';

export default function ClinicApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dir-rtl">
      <header className="bg-emerald-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">منظومة عيادات تبارك الطبية</h1>
        <span className="text-sm bg-emerald-800 px-3 py-1 rounded">النسخة المعتمدة v2.4</span>
      </header>
      <main className="p-6">
        <p className="text-slate-600">تم بناء واختبار المنظومة بنجاح بواسطة عبقرينو Studio Ultimate.</p>
      </main>
    </div>
  );
}`
      }
    ],
    testCases: [
      { id: 't-1', name: 'تحقق من صحة بناء TypeScript وعدم وجود أخطاء في الأنواع', type: 'syntax', status: 'passed', executionTimeMs: 420, outputLog: 'TSC build successful with 0 errors.' },
      { id: 't-2', name: 'اختبار تشفير بيانات المرضى الحساسة والاتصال بـ SQLite', type: 'database', status: 'passed', executionTimeMs: 185, outputLog: 'Database connection verified, encryption AES-256 active.' },
      { id: 't-3', name: 'فحص الحماية من ثغرات الحقن SQL Injection & XSS', type: 'security', status: 'passed', executionTimeMs: 290, outputLog: 'No injection vulnerabilities found in parameterized queries.' },
      { id: 't-4', name: 'محاكاة دورة حجز موعد كاملة وإصدار الروشتة', type: 'integration', status: 'passed', executionTimeMs: 310, outputLog: 'End-to-end booking & prescription pipeline: 100% passed.' }
    ],
    auditLogs: [
      { id: 'aud-1', action: 'إنشاء مسودة المتطلبات والمناقشة', timestamp: '2026-10-15 14:32', userOrAdmin: 'العميل: د. محمود عبد الرحمن', details: 'اكتملت 15 مرحلة تخطيطية بنجاح.' },
      { id: 'aud-2', action: 'اعتماد السعر والمتطلبات', timestamp: '2026-10-15 16:00', userOrAdmin: 'العميل: د. محمود عبد الرحمن', details: 'تم الاتفاق على السعر 6,500 جنيه مصري.' },
      { id: 'aud-3', action: 'اكتمال التنفيذ وتشفير الحزمة النهائية', timestamp: '2026-10-17 19:45', userOrAdmin: 'محرك عبقرينو Creation Engine', details: 'تم حفظ النسخة النهائية في الخزينة المحمية بانتظار موافقة صاحب المنصة.' }
    ],
    deliveryLogs: []
  },
  {
    id: 'proj-repair-002',
    orderNumber: 'ABQ-2026-9041',
    name: 'تطبيق متجر النجوم السريع - تسريب ذاكرة وخطأ تكرار الطلبات',
    description: 'تطبيق متجر إلكتروني Node.js/Express يعاني من انهيار الخادم عند ضغط 50 مستخدم بالتزامن بسبب تسريب في اتصالات قاعدة البيانات.',
    clientName: 'م. أحمد الشناوي',
    clientPhone: '01223948511',
    clientEmail: 'ahmed@stars-store.eg',
    type: 'repair',
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'Sequelize'],
    status: 'needs_repair',
    currentStageNumber: 2, // Diagnosed, ready for patch review
    priceEGP: 3200,
    paymentVerifiedByOwner: true,
    paymentReferencePhone: '01153747612',
    secureStoragePath: '/secure/vault/repair_staging/ABQ-2026-9041_stars.zip',
    finalBundleSizeBytes: 8900400,
    createdAt: '2026-10-17 10:15',
    requirements: [
      { id: 'rep-req-1', title: 'حل مشكلة تسريب اتصالات DB Pool', description: 'إغلاق الاتصالات بشكل سليم عند كل استعلام.', category: 'core', approved: true },
      { id: 'rep-req-2', title: 'منع خصم المخزون المزدوج Race Condition', description: 'استخدام معملات Transactions وقفل الصفوف.', category: 'security', approved: true }
    ],
    screens: [],
    files: [
      {
        path: 'services/orderService.js',
        language: 'javascript',
        sizeBytes: 2150,
        lastModified: '2026-10-17 10:20',
        content: `// Buggy Version: Leaking DB connection on exception and duplicate deduction
const { pool } = require('../db');

async function processOrder(userId, cartItems) {
  const client = await pool.connect();
  // BUG: client is never released if an error is thrown inside!
  for (const item of cartItems) {
    const product = await client.query('SELECT stock FROM products WHERE id = $1', [item.id]);
    if (product.rows[0].stock < item.quantity) {
      throw new Error('الكمية غير متاحة'); // Client leaked!
    }
    await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.id]);
  }
  await client.query('INSERT INTO orders (user_id, status) VALUES ($1, $2)', [userId, 'completed']);
  client.release();
  return { success: true };
}`
      }
    ],
    testCases: [
      { id: 'rt-1', name: 'اختبار الضغط: 100 طلب متزامن', type: 'performance', status: 'failed', executionTimeMs: 4500, outputLog: 'FATAL: pool exhausted. Remaining open connections = 100.' },
      { id: 'rt-2', name: 'اختبار محاكاة نفاذ المخزون والتعامل مع الاستثناءات', type: 'unit', status: 'failed', executionTimeMs: 120, outputLog: 'Connection leak detected after exception was thrown.' }
    ],
    auditLogs: [
      { id: 'aud-rep-1', action: 'استقبال المشروع وتحليله', timestamp: '2026-10-17 10:18', userOrAdmin: 'محرك عبقرينو Repair Engine', details: 'تم تشخيص تسريب اتصالات Pool وعدم استخدام try/finally.' }
    ],
    deliveryLogs: []
  }
];

export const MOCK_REPAIR_DIAGNOSIS: RepairDiagnosis = {
  id: 'diag-002',
  projectId: 'proj-repair-002',
  frameworkDetected: 'Node.js Express + pg Client Pool',
  entryPoint: 'services/orderService.js',
  primaryBugCategory: 'memory_leak',
  confidenceScore: 98,
  problemDescription: 'عدم تحرير اتصال قاعدة البيانات client.release() عند حدوث خطأ أو رمي استثناء (Unreleased Pool Client on Exception)، مما يؤدي لاستهلاك كافة اتصالات الـ Pool وانهيار الخادم.',
  evidence: [
    'ملف services/orderService.js سطر 5: يتم استدعاء pool.connect() دون استخدام كتل try...finally.',
    'في حال عدم كفاية المخزون (السطر 9)، يتم رمي Error دون استدعاء client.release().',
    'سجل الاختبار: استنزاف 100 اتصال مفتوح في اختبار الضغط وظهور خطأ timeout.'
  ],
  affectedFiles: ['services/orderService.js'],
  potentialRootCause: 'غياب كتل try { ... } finally { client.release(); } واستخدام استعلامات متسلسلة بدلاً من Transaction آمنة.',
  isConfirmed: true,
  impactLevel: 'critical',
  repairPlanSteps: [
    'تغليف استدعاءات المعاملة داخل try/catch/finally.',
    'ضمان استدعاء client.release() دائماً في كتلة finally.',
    'إضافة BEGIN و COMMIT و ROLLBACK لضمان سلامة المخزون ومنع الخصم المزدوج.',
    'إعادة تشغيل اختبار الضغط لـ 100 طلب متزامن والتحقق من عدم تسرب أي اتصال.'
  ],
  riskAssessment: 'منخفض جداً: التعديل موضعي ومحصور في دالة processOrder ولا يغير أسماء الواجهات أو نماذج البيانات.',
  diffPatch: [
    {
      filePath: 'services/orderService.js',
      beforeCode: `async function processOrder(userId, cartItems) {
  const client = await pool.connect();
  for (const item of cartItems) {
    const product = await client.query('SELECT stock FROM products WHERE id = $1', [item.id]);
    if (product.rows[0].stock < item.quantity) {
      throw new Error('الكمية غير متاحة'); // تسريب الاتصال
    }
    await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.id]);
  }
  await client.query('INSERT INTO orders (user_id, status) VALUES ($1, $2)', [userId, 'completed']);
  client.release();
  return { success: true };
}`,
      afterCode: `async function processOrder(userId, cartItems) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const item of cartItems) {
      const product = await client.query(
        'SELECT stock FROM products WHERE id = $1 FOR UPDATE',
        [item.id]
      );
      if (!product.rows[0] || product.rows[0].stock < item.quantity) {
        throw new Error('الكمية غير متاحة للمنتج: ' + item.id);
      }
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.id]
      );
    }
    await client.query(
      'INSERT INTO orders (user_id, status) VALUES ($1, $2)',
      [userId, 'completed']
    );
    await client.query('COMMIT');
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    // إصلاح عبقرينو: ضمان تحرير الاتصال تحت كل الظروف
    client.release();
  }
}`,
      explanation: 'تم تغليف العمليات في Transaction حقيقية مع FOR UPDATE لمنع التضارب، وإضافة finally { client.release(); } لحل مشكلة تسريب اتصالات الخادم نهائياً.'
    }
  ]
};
