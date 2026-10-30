/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AbqarinoCreationEngine } from '../src/services/creationEngine';

console.log('=====================================================');
console.log('🧪 تشغيل الاختبارات الحقيقية لمحرك إنشاء البرامج (Creation Engine)');
console.log('=====================================================');

const engine = new AbqarinoCreationEngine();
let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, details: string = '') {
  if (condition) {
    testsPassed++;
    console.log(`  ✓ [PASS] ${testName} ${details ? '— ' + details : ''}`);
  } else {
    testsFailed++;
    console.error(`  ✕ [FAIL] ${testName} ${details ? '— ' + details : ''}`);
    throw new Error(`Test assertion failed: ${testName}`);
  }
}

// TEST 1: Arabic Prompt Execution & Dynamic 3-Screen Clinic Generation
console.log('\n[اختبار 1] فحص إنشاء منظومة عيادات طبية من وصف باللغة العربية:');
const arabicPrompt = 'أنشئ منظومة متكاملة لعيادة طبية لحجز المواعيد والروشتات الإلكترونية مع قاعدة بيانات';
const resAr = engine.executeFullPipeline(arabicPrompt, 'عيادات الشفاء', 'د. محمود سالم', '01012345678', 6500);

assert(resAr.project.name === 'عيادات الشفاء', 'تحديد اسم المشروع المعتمد');
assert(resAr.artifacts.screens.length === 3, 'توليد 3 شاشات مخصصة للعيادة (دون فرض عدد ثابت)', `عدد الشاشات: ${resAr.artifacts.screens.length}`);
assert(resAr.artifacts.stagesLog.length === 15, 'تنفيذ جميع المراحل الـ 15 كاملة', `المراحل: ${resAr.artifacts.stagesLog.length}`);
assert(resAr.artifacts.files.length >= 4, 'إنشاء ملفات المصدر الحقيقية في مساحة العمل المعزولة', `الملفات: ${resAr.artifacts.files.map(f => f.path).join(', ')}`);

// Verify file contents
const pkgFile = resAr.artifacts.files.find(f => f.path === 'package.json');
assert(pkgFile !== undefined, 'ملف package.json موجود');
const parsedPkg = JSON.parse(pkgFile!.content);
assert(parsedPkg.name !== '', 'ملف package.json قابل للتحليل وخالٍ من الأخطاء');

const serverFile = resAr.artifacts.files.find(f => f.path === 'src/server/index.ts');
assert(serverFile !== undefined && serverFile.content.includes("express"), 'ملف الخادم يحتوي على تطبيق Express سليم');

// TEST 2: English Prompt Execution & Dynamic 4-Screen E-Commerce Generation
console.log('\n[اختبار 2] فحص إنشاء متجر إلكتروني من وصف باللغة الإنجليزية:');
const enPrompt = 'Build an online e-commerce shop with product catalog, shopping cart, and inventory tracking';
const resEn = engine.executeFullPipeline(enPrompt, 'Global Store', 'John Doe', '01299887766', 8000);

assert(resEn.artifacts.screens.length === 4, 'توليد 4 شاشات للمتجر تختلف ديناميكياً عن العيادة', `الشاشات: ${resEn.artifacts.screens.map(s => s.name).join(', ')}`);
assert(resEn.artifacts.missingInfoQuestions.length > 0, 'اكتشاف المعلومات الناقصة وطرح أسئلة محددة على المستخدم');

// TEST 3: German Prompt Execution & Dynamic 2-Screen Task Manager
console.log('\n[اختبار 3] فحص إنشاء تطبيق مهام من وصف باللغة الألمانية:');
const dePrompt = 'Erstelle eine einfache Aufgabenverwaltung mit Kanban-Board und Berichten';
const resDe = engine.executeFullPipeline(dePrompt, 'TaskApp', 'Hans Müller', '01122334455', 4000);

assert(resDe.artifacts.screens.length === 2, 'توليد شاشتين فقط لتطبيق المهام البسيط دون إجبار على شاشات زائدة', `عدد الشاشات: ${resDe.artifacts.screens.length}`);
assert(resDe.project.status === 'completed_pending_delivery_approval', 'حفظ المشروع في الخزينة بانتظار موافقة صاحب المنصة (الباب العاشر)');

console.log('\n=====================================================');
console.log(`📊 النتيجة الإجمالية لاختبارات محرك الإنشاء: ${testsPassed} ناجح | ${testsFailed} فاشل`);
console.log('=====================================================');

if (testsFailed > 0) {
  process.exit(1);
}
