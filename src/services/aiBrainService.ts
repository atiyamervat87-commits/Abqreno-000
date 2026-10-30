/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NeuralModelConfig, ProjectRequirement, ScreenSpec, TestCase, ProjectFile } from '../types';

export interface ChatTurn {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  metadata?: {
    identifiedGoal?: string;
    suggestedScreens?: string[];
    suggestedTech?: string[];
    estimatedPriceEGP?: number;
    dbTables?: string[];
    nextAction?: string;
  };
}

export const INITIAL_MODEL_CONFIG: NeuralModelConfig = {
  vocabSize: 32000,
  contextLength: 8192,
  hiddenDim: 1024,
  numLayers: 16,
  numHeads: 16,
  arabicTokenizerSupport: true,
  weightsVersion: 'abqarino-v3-ar-en-epoch42',
  totalParameters: '125 Million (Custom Dense Edge Decoder)',
  trainingEpoch: 42,
  currentLoss: 1.084,
  isTraining: false,
  checkpointsCount: 14,
  benchmarks: {
    arabicUnderstanding: 96.4,
    codeGenerationQuality: 93.8,
    errorDiagnosisAccuracy: 95.2,
    antiHallucinationScore: 94.1,
    instructionFollowing: 97.0
  }
};

/**
 * Procedural Tokenizer for Arabic & English
 */
export function simulateTokenize(text: string): { tokens: string[]; tokenIds: number[] } {
  // Split on arabic words, latin words, punctuation, whitespace
  const rawParts = text.match(/[\u0600-\u06FF]+|[a-zA-Z0-9]+|[^\s\w]/g) || [];
  const tokens: string[] = [];
  const tokenIds: number[] = [];

  rawParts.forEach((part, index) => {
    // Generate deterministic hash ID in vocab range [0, 31999]
    let hash = 0;
    for (let i = 0; i < part.length; i++) {
      hash = (hash * 31 + part.charCodeAt(i)) % 32000;
    }
    tokens.push(part);
    tokenIds.push(Math.abs(hash));
  });

  return { tokens, tokenIds };
}

/**
 * Conversational Engine: Processes user input in Arabic/English, analyzes requirements,
 * extracts technical needs without imposing fixed screens, and plans implementation.
 */
export function processUserChatIdea(userPrompt: string, historyCount: number): ChatTurn {
  const normalized = userPrompt.trim().toLowerCase();

  // Keyword intent detection for Arabic context
  const isEcommerce = /متجر|تسوق|منتجات|سلة|شراء|دفع|بيع|orders|store/i.test(normalized);
  const isMedical = /عيادة|طبي|مريض|روشتة|كشف|دكتور|clinic|patient/i.test(normalized);
  const isSchool = /مدرسة|جامعة|طلاب|كورسات|تعليم|امتحانات|school|student/i.test(normalized);
  const isRealEstate = /عقارات|شقق|إيجار|بيع|سمسار|property/i.test(normalized);

  let responseText = '';
  let metadata: ChatTurn['metadata'] = {};

  if (historyCount === 0) {
    if (isEcommerce) {
      responseText = `مرحباً بك! لقد فهمت أنك ترغب في إنشاء منصة متجر إلكتروني احترافية.
بناءً على مبادئ عبقرينو Studio: لا نفرض تصميماً ثابتاً ولا عدداً محدداً من الشاشات.

لضمان بناء نظام متكامل يلبي هدفك بدقة، أود مناقشة هذه النقاط:
1. هل المتجر يستهدف عملاء التجزئة (B2C) أم الجملة وتجار التوزيع (B2B)؟
2. ما هي وسائل الدفع وطرق الشحن المطلوبة؟
3. هل تحتاج إلى نظام إدارة مستودعات وتنبيهات عند انخفاض المخزون؟
4. هل ترغب في شاشات مخصصة لمسؤولي التوصيل أو تتبع الشحنات؟

أقترح مبدئياً 4 شاشات متجاوبة قابلة للتعديل حسب موافقتك.`;
      metadata = {
        identifiedGoal: 'متجر إلكتروني متعدد الأقسام مع إدارة مخزون وسلة تسوق',
        suggestedScreens: ['الرئيسية واستعراض المنتجات', 'تفاصيل المنتج والتقييمات', 'سلة الشراء وإتمام الطلب', 'لوحة تحكم التاجر'],
        suggestedTech: ['React 19', 'TypeScript', 'Node.js/Express', 'SQLite/PostgreSQL', 'Tailwind CSS'],
        estimatedPriceEGP: 5800,
        dbTables: ['users', 'products', 'categories', 'orders', 'order_items'],
        nextAction: 'مناقشة التفاصيل واعتماد المتطلبات والتسعير'
      };
    } else if (isMedical) {
      responseText = `أهلاً بك! فكرة ممتازة لإنشاء منظومة عيادات طبية متخصصة.
منظومة عبقرينو تحرص على الأمان والخصوصية الطبية العالية.

الاستفسارات المحورية لتخصيص الشاشات وقواعد البيانات:
1. هل المنظومة لعيادة فردية أم مجمع عيادات متعدد التخصصات والأطباء؟
2. ما هي متطلبات الروشتة الطبية (طباعة ورقية، إرسال واتساب، حفظ تحاليل)؟
3. هل تحتاج إلى صلاحيات متباينة (طبيب، مساعد/تمريض، موظف استقبال)؟
4. هل سيتيح التطبيق للمرضى حجز المواعيد ذاتياً من هواتفهم؟

سأقترح عليك هيكل الشاشات المناسب فور توضيح هذه النقاط.`;
      metadata = {
        identifiedGoal: 'منظومة إدارة عيادات ومواعيد وسجلات طبية إلكترونية',
        suggestedScreens: ['لوحة تحكم العيادة اليومية', 'سجل المريض والروشتات', 'جدولة المواعيد والحجوزات', 'إدارة الحسابات والأدوية'],
        suggestedTech: ['React 19', 'TypeScript', 'Express', 'SQLite مشفر', 'Tailwind CSS'],
        estimatedPriceEGP: 6200,
        dbTables: ['doctors', 'patients', 'appointments', 'prescriptions', 'bills'],
        nextAction: 'اعتماد الشاشات والصلاحيات'
      };
    } else {
      responseText = `أهلاً بك في استوديو عبقرينو Ultimate! قرأت فكرتك باهتمام: "${userPrompt}".
معمارية عبقرينو تعتمد على الفهم العميق والتخطيط المرن (دون فرض شاشات مسبقة).

دعنا نناقش الركائز الأساسية لمشروعك:
1. من هم المستخدمون الأساسيون وما هي الصلاحيات المطلوبة؟
2. ما هي العمليات والوظائف الحيوية التي لا يستغني عنها البرنامج؟
3. هل تحتاج قاعدة بيانات محلية أم سحابية؟ وما نوع التكاملات الخارجية؟
4. ما المنصات المستهدفة (متصفحات، هواتف ذكية، لوحات تشغيل مكتبية)؟

شاركني تفاصيلك وسأقوم بصياغة خطة التنفيذ وتصميم الشاشات وتقدير السعر المخصص.`;
      metadata = {
        identifiedGoal: `تطبيق مخصص: ${userPrompt.slice(0, 45)}...`,
        suggestedScreens: ['الشاشة الترحيبية والبيانات', 'لوحة التحكم والعمليات', 'إدارة السجلات والإعدادات'],
        suggestedTech: ['TypeScript', 'React', 'Node.js Express', 'SQLite', 'Tailwind CSS'],
        estimatedPriceEGP: 4500,
        dbTables: ['users', 'records', 'audit_logs'],
        nextAction: 'تحديد المتطلبات بدقة'
      };
    }
  } else {
    // Continuous conversational refinement
    responseText = `ممتاز جداً! قمت بتحديث سجل المتطلبات بناءً على ردك الأخير.
القرارات المعتمدة حتى الآن:
- استبعاد أي تعقيد غير ضروري والتركيز على الواجهات العملية والسريعة.
- دعم كامل للغة العربية والاتجاه من اليمين إلى اليسار (RTL) مع تصميم متجاوب لكافة الشاشات.
- تجهيز قاعدة البيانات وجداولها مع قيود السلامة وعزل الصلاحيات.

يمكنك الآن مراجعة الشاشات المقترحة واعتماد المتطلبات لبدء مراحل التنفيذ الفعلي الـ 15.`;
    metadata = {
      identifiedGoal: 'اكتمال صياغة المتطلبات والاتفاق على المواصفات',
      suggestedScreens: ['لوحة الإدارة الرئيسية', 'واجهة العمليات التفاعلية', 'سجل التقارير والأرشيف'],
      suggestedTech: ['React 19', 'TypeScript', 'Node.js', 'SQLite', 'Tailwind'],
      estimatedPriceEGP: 5000,
      nextAction: 'الانتقال إلى اعتماد المتطلبات والتنفيذ الفعلي'
    };
  }

  return {
    id: `turn-${Date.now()}`,
    sender: 'assistant',
    text: responseText,
    timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    metadata
  };
}

/**
 * Live Synthetic Training Epoch Step for Autonomous Brain
 */
export function stepTrainingEpoch(current: NeuralModelConfig): NeuralModelConfig {
  const newEpoch = current.trainingEpoch + 1;
  // Natural logarithmic decay simulation with realistic jitter
  const targetLoss = 1.0 / (1 + 0.05 * newEpoch);
  const jitter = (Math.random() - 0.5) * 0.02;
  const newLoss = Math.max(0.42, parseFloat((targetLoss + jitter).toFixed(4)));

  const benchmarkGain = Math.min(99.5, +(current.benchmarks.arabicUnderstanding + 0.15).toFixed(1));
  const codeGain = Math.min(99.2, +(current.benchmarks.codeGenerationQuality + 0.2).toFixed(1));
  const diagGain = Math.min(99.4, +(current.benchmarks.errorDiagnosisAccuracy + 0.18).toFixed(1));

  return {
    ...current,
    trainingEpoch: newEpoch,
    currentLoss: newLoss,
    checkpointsCount: current.checkpointsCount + 1,
    benchmarks: {
      ...current.benchmarks,
      arabicUnderstanding: benchmarkGain,
      codeGenerationQuality: codeGain,
      errorDiagnosisAccuracy: diagGain
    }
  };
}
