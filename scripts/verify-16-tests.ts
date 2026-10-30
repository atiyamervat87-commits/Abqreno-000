/**
 * Verification test runner script for Node / CI execution
 */
import { defaultNeuralTestSuite } from '../src/services/neuralTests';

async function main() {
  console.log('================================================================');
  console.log('   تشغيل الاختبارات الإلزامية الـ 16 لمنظومة عبقرينو سوبر       ');
  console.log('================================================================\n');

  const results = await defaultNeuralTestSuite.runAllTests((curr, tot, item) => {
    console.log(`[${curr}/${tot}] [${item.status}] ${item.name} (${item.durationMs}ms)`);
  });

  console.log('\n================================================================');
  console.log('                       ملخص نتائج الاختبارات                     ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  for (const r of results) {
    if (r.status === 'PASS') passed++;
    else failed++;
    console.log(`Test #${r.id}: ${r.name}`);
    console.log(`  - الإجراء: ${r.actionExecuted}`);
    console.log(`  - النتيجة: ${r.actualResult}`);
    console.log(`  - الحالة: ${r.status}`);
    console.log(`  - الدليل: ${r.evidence}`);
    console.log('----------------------------------------------------------------');
  }

  console.log(`\nالإجمالي: ${results.length} | الناجحة: ${passed} | الراسبة: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
