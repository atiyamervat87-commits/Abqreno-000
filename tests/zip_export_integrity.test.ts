/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('=====================================================');
console.log('📦 تشغيل الاختبارات الحقيقية لسلامة أرشيف ZIP الكامل (Zip Integrity)');
console.log('=====================================================');

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

async function runZipIntegrityTests() {
  const zip = new JSZip();

  // Collect real project files from disk
  const filesToVerify = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    'server.ts',
    'README.md',
    'INSTALL_AND_RUN.md',
    'database/schema.sql',
    'database/migrate.ts',
    'neural_brain/model_architecture.py',
    'neural_brain/tokenizer.py',
    'neural_brain/engine.py',
    'neural_brain/train.py',
    'neural_brain/eval.py',
    'neural_brain/weights_manifest.json',
    'neural_brain/eval_report_real.json',
    'neural_brain/data/train_corpus.jsonl',
    'neural_brain/data/eval_held_out.jsonl',
    'neural_brain/checkpoints/checkpoint_latest.json',
    'src/App.tsx',
    'src/main.tsx',
    'src/index.css',
    'src/types/index.ts',
    'src/services/aiBrainService.ts',
    'src/services/creationEngine.ts',
    'src/services/repairEngine.ts',
    'src/services/neuralEngine.ts',
    'src/services/zipExporter.ts',
    'src/components/Navbar.tsx',
    'src/components/HomeLauncher.tsx',
    'src/components/CreationStudio.tsx',
    'src/components/RepairStudio.tsx',
    'src/components/NeuralBrainLab.tsx',
    'src/components/AdminDeliveryPortal.tsx',
    'src/components/BackupCenter.tsx',
    'src/components/ThreeScene.tsx',
    'src/components/ProjectReportModal.tsx'
  ];

  console.log(`\n[فحص 1] قراءة الملفات الحقيقية من القرص وحزمها في أرشيف ZIP:`);
  for (const relPath of filesToVerify) {
    const fullPath = path.join(rootDir, relPath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(content.length > 0, `الملف ${relPath} موجود وغير فارغ`, `حجم: ${content.length} بايت`);
    zip.file(relPath, content);
  }

  console.log(`\n[فحص 2] ضغط الأرشيف وتوليد الحزمة الثنائية (Binary Generation):`);
  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  assert(zipBuffer.length > 50000, 'حجم الأرشيف المضغوط حقيقي ويتجاوز 50 كيلوبايت', `${(zipBuffer.length / 1024).toFixed(1)} KB`);

  console.log(`\n[فحص 3] فك ضغط الأرشيف وفحص سلامة الترويسات ومحتوى كل ملف:`);
  const unpacked = await JSZip.loadAsync(zipBuffer);
  const unpackedFiles = Object.keys(unpacked.files);

  assert(unpackedFiles.length >= filesToVerify.length, `جميع الملفات مسترجعة بالكامل (${unpackedFiles.length} ملفاً)`);

  // Verify App.tsx inside unpacked archive
  const unpackedAppTsx = await unpacked.file('src/App.tsx')?.async('text');
  assert(
    unpackedAppTsx !== undefined && unpackedAppTsx.includes('CreationStudio'),
    'ملف src/App.tsx داخل الأرشيف يحتوي على كامل المكونات وليس مجرد كود فارغ'
  );

  // Verify neural architecture inside unpacked archive
  const unpackedArch = await unpacked.file('neural_brain/model_architecture.py')?.async('text');
  assert(
    unpackedArch !== undefined && unpackedArch.includes('AbqarinoModel'),
    'ملف معمارية النموذج اللغوي سليم داخل الأرشيف المستخرج'
  );

  console.log('\n=====================================================');
  console.log(`📊 النتيجة الإجمالية لاختبارات فحص الأرشيف: ${testsPassed} ناجح | ${testsFailed} فاشل`);
  console.log('=====================================================');
}

runZipIntegrityTests().catch(err => {
  console.error(err);
  process.exit(1);
});
