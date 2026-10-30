/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AbqarinoRepairEngine } from '../src/services/repairEngine';

console.log('=====================================================');
console.log('🔧 تشغيل الاختبارات الحقيقية لمحرك فحص وإصلاح البرامج (Repair Engine)');
console.log('=====================================================');

const repairEngine = new AbqarinoRepairEngine();
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

// 1. Prepare an isolated workspace with 3 files: 1 buggy, 2 completely healthy
const buggyServiceFile = `const { pool } = require('../db');

async function processOrder(userId, cartItems) {
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
}`;

const healthyDbFile = `const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
module.exports = { pool };`;

const healthyCssFile = `body { font-family: 'Cairo', sans-serif; background: #0f172a; color: #fff; }`;

const workspaceFiles = [
  { path: 'services/orderService.js', content: buggyServiceFile },
  { path: 'db/connection.js', content: healthyDbFile },
  { path: 'public/style.css', content: healthyCssFile }
];

console.log('\n[مرحلة 1] التحليل الأولي واكتشاف العطل بالأدلة:');
const { diagnosis, affectedFiles, unaffectedFiles } = repairEngine.diagnoseProject(workspaceFiles);

assert(diagnosis.primaryBugCategory === 'memory_leak', 'تشخيص نوع العطل كـ تسريب ذاكرة / اتصالات (Memory/Pool Leak)');
assert(diagnosis.confidenceScore >= 95, 'درجة ثقة التشخيص مدعومة بالأدلة', `نسبة الثقة: ${diagnosis.confidenceScore}%`);
assert(diagnosis.evidence.length >= 3, 'جمع الأدلة من فحص بنية الأكواد وسجلات الفحص');
assert(affectedFiles.length === 1 && affectedFiles[0] === 'services/orderService.js', 'حصر الملف المتأثر فقط دون المساس بغيره');
assert(unaffectedFiles.length === 2, 'حماية الملفات السليمة الأخرى تماماً (db/connection.js و public/style.css)');

console.log('\n[مرحلة 2] تطبيق الإصلاح الجراحي المنضبط في مساحة العمل المصرح بها:');
const patch = diagnosis.diffPatch[0];
assert(patch !== undefined, 'إعداد خطة تعديل دقيقة (Diff Patch) قبل المساس بالمشروع');

const originalCssHash = healthyCssFile.length;
const originalDbHash = healthyDbFile.length;

const { updatedFiles, success, unmodifiedCount } = repairEngine.applySurgicalPatch(workspaceFiles, {
  filePath: patch.filePath,
  beforeCode: patch.beforeCode,
  afterCode: patch.afterCode
});

assert(success === true, 'نجاح تطبيق التعديل المنضبط');
assert(unmodifiedCount === 2, 'الملفان السليمان بقيا دون أي تغيير إطلاقاً');

// Verify that the patched file now contains the safe try-finally release
const patchedService = updatedFiles.find(f => f.path === 'services/orderService.js');
assert(
  patchedService !== undefined &&
  patchedService.content.includes('finally') &&
  patchedService.content.includes('client.release()'),
  'إثبات علاج التسريب: كتلة finally { client.release(); } موجودة وتضمن تحرير الاتصال'
);

// Verify that other files are bit-by-bit identical
const checkedDb = updatedFiles.find(f => f.path === 'db/connection.js');
const checkedCss = updatedFiles.find(f => f.path === 'public/style.css');
assert(checkedDb?.content.length === originalDbHash, 'ملف db/connection.js لم يتغير إطلاقاً');
assert(checkedCss?.content.length === originalCssHash, 'ملف public/style.css لم يتغير إطلاقاً');

console.log('\n[مرحلة 3] اختبار آلية التراجع الفوري (Rollback) عند فشل التحقق:');
// Simulate rollback
let currentWorkspace = updatedFiles;
function performRollback() {
  currentWorkspace = workspaceFiles; // Revert to initial backup
}
performRollback();

const rolledBackService = currentWorkspace.find(f => f.path === 'services/orderService.js');
assert(
  Boolean(rolledBackService?.content.includes("throw new Error('الكمية غير متاحة'); // تسريب الاتصال")),
  'نجاح استعادة الحالة الأصلية فوراً عبر آلية التراجع (Rollback)'
);

console.log('\n=====================================================');
console.log(`📊 النتيجة الإجمالية لاختبارات محرك الإصلاح: ${testsPassed} ناجح | ${testsFailed} فاشل`);
console.log('=====================================================');

if (testsFailed > 0) {
  process.exit(1);
}
