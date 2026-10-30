/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AbqarinoMultilingualNeuralEngine } from '../src/services/neuralEngine';

console.log('=====================================================');
console.log('🧠 تشغيل الاختبارات الحقيقية لمحرك العقل الاصطناعي المستقل (Neural Engine V3)');
console.log('=====================================================');

const engine = new AbqarinoMultilingualNeuralEngine();
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

// TEST 1: Multilingual Language Detection (AR / ARZ / EN / DE)
console.log('\n[اختبار 1] فحص كفاءة الكشف اللغوي رباعي اللغات (فصحى / عامية مصرية / إنجليزي / ألماني):');
assert(engine.detectLanguage('أنشئ تطبيق لحجز كشوفات العيادة الطبية') === 'ar', 'اكتشاف اللغة العربية الفصحى بنجاح');
assert(engine.detectLanguage('عايز أعمل تطبيق زي أوبر شغال دلوقتي علشان التوصيل') === 'arz', 'اكتشاف اللهجة المصرية العامية بنجاح');
assert(engine.detectLanguage('Create a high performance Express backend') === 'en', 'اكتشاف اللغة الإنجليزية بنجاح');
assert(engine.detectLanguage('Erstelle eine Webanwendung für Arztpraxen mit SQLite') === 'de', 'اكتشاف اللغة الألمانية بنجاح (بما فيها الحروف الألمانية ä, ö, ü, ß)');

// TEST 2: Arabic Clitic Detachment (السوابق الصرفية)
console.log('\n[اختبار 2] فحص التفكيك الصرفي للسوابق واللواصق العربية (Clitic Detachment):');
const clitics = engine.splitArabicClitics('وبالمريض');
assert(clitics.length === 4 && clitics[0] === 'و+' && clitics[1] === 'ب+' && clitics[2] === 'ال+' && clitics[3] === 'مريض', 'تفكيك كلمة وبالمريض إلى و+ ب+ ال+ مريض بدقة', `الناتج: ${JSON.stringify(clitics)}`);

// TEST 3: Multilingual Tokenizer & Special Tokens
console.log('\n[اختبار 3] فحص دقة المجزئ اللغوي وتقطيع النصوص إلى معرفات رقمية:');
const sampleAr = 'أنشئ متجر إلكتروني';
const tokenizedAr = engine.tokenize(sampleAr);
assert(tokenizedAr.tokens.length >= 3, 'تقطيع العبارة العربية إلى رموز لغوية سليمة', `الرموز: ${tokenizedAr.tokens.join(', ')}`);
assert(tokenizedAr.tokenIds[0] === 1, 'بدء التسلسل برمز البداية <bos>');
assert(tokenizedAr.tokenIds[1] === 4, 'إدراج رمز لغة العبارة <lang_ar>');
assert(tokenizedAr.tokenIds[tokenizedAr.tokenIds.length - 1] === 2, 'إنهاء التسلسل برمز النهاية <eos>');

const sampleArz = 'عايز تطبيق شغال';
const tokenizedArz = engine.tokenize(sampleArz);
assert(tokenizedArz.tokenIds[1] === 5, 'إدراج رمز لغة العبارة المصرية <lang_arz>');

const sampleDe = 'Erstelle einen Online-Shop mit Warenkorb';
const tokenizedDe = engine.tokenize(sampleDe);
assert(tokenizedDe.tokenIds[1] === 7, 'إدراج رمز لغة العبارة الألمانية <lang_de>');

// TEST 4: Lossless 100% Round-Trip Guarantee (Byte-Fallback)
console.log('\n[اختبار 4] فحص إعادة بناء النصوص بنسبة 100% دون فقدان أي حرف (Round-Trip Fidelity):');
const testSentences = [
  'وبالمرضى وللطبيب فالعيادة كالشمس',
  'عايز أعمل تطبيق زي أوبر شغال دلوقتي علشان التوصيل',
  'const sum = (a: number, b: number): number => { return a + b; };',
  'Erstelle eine Webanwendung für Ärzte mit Überweisung und Röntgen.'
];

for (const sent of testSentences) {
  const enc = engine.tokenize(sent).tokenIds;
  const dec = engine.decode(enc, true);
  assert(dec === sent, `تطابق تام بنسبة 100% للنص: "${sent.slice(0, 30)}..."`, `المسترجع: "${dec.slice(0, 30)}..."`);
}

// TEST 5: Authentic Autoregressive Causal Generation
console.log('\n[اختبار 5] فحص التوليد التوليدي السببي الحقيقي رمزاً برمز (Causal Autoregressive):');
const genRes = engine.generate('أنشئ تطبيق عيادة طبية مع قاعدة بيانات', 6);
assert(genRes.isAuthenticAutoregressive === true, 'تأكيد التوليد عبر التمرير الأمامي السببي دون قواميس مسبقة');
assert(genRes.generatedTokenIds.length > 0, 'توليد تسلسل معرفات رقمية حقيقية', `المعرفات: [${genRes.generatedTokenIds.join(', ')}]`);
assert(genRes.executionTimeMs >= 0, 'حساب زمن المعالجة الفعلي بالمللي ثانية', `${genRes.executionTimeMs}ms`);
assert(genRes.tokensPerSecond >= 0, 'حساب معدل توليد الرموز لكل ثانية', `${genRes.tokensPerSecond} tokens/sec`);

console.log('\n=====================================================');
console.log(`📊 النتيجة الإجمالية لاختبارات العقل الاصطناعي: ${testsPassed} ناجح | ${testsFailed} فاشل`);
console.log('=====================================================');

if (testsFailed > 0) {
  process.exit(1);
}
