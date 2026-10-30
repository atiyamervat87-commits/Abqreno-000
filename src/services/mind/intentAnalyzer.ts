/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Intent & Semantic Analyzer for Abqarino Mind (Module 2)
 * Categorizes user intent, discovers implicit goals, detects contradictions and missing parameters
 */

export interface IntentAnalysisResult {
  primaryIntent:
    | 'create_software'
    | 'repair_diagnose'
    | 'train_model'
    | 'system_enhancement'
    | 'legal_consultation'
    | 'charter_inquiry'
    | 'code_generation'
    | 'greeting_social'
    | 'general_reasoning'
    | 'uncertain_query';
  confidence: number;
  explicitGoals: string[];
  implicitNeeds: string[];
  missingParameters: string[];
  detectedContradictions: string[];
  suggestedAction: string;
}

export class IntentAnalyzer {
  public analyze(prompt: string, contextSummary?: string): IntentAnalysisResult {
    const text = prompt.toLowerCase().trim();
    const explicitGoals: string[] = [];
    const implicitNeeds: string[] = [];
    const missingParameters: string[] = [];
    const detectedContradictions: string[] = [];

    let primaryIntent: IntentAnalysisResult['primaryIntent'] = 'general_reasoning';

    // 0. Greeting & Social Intent (السلام عليكم، مرحبا، أهلاً، من أنت، إلخ)
    if (
      /^(السلام عليكم|وعليكم السلام|مرحبا|أهلا|اهلا|صباح الخير|مساء الخير|ازيك|عامل ايه|أهلاً بك|من أنت|عرفني بنفسك|ما هي قدراتك|كيف حالك|hello|hi|hey|good morning|good evening|who are you|what can you do|hallo|guten tag)[\s!؟?.]*$/i.test(text) ||
      /السلام عليكم|وعليكم السلام|أهلاً بك|مرحباً بك|عرفني بنفسك|من هو عبقرينو|ماذا تستطيع أن تفعل/i.test(text)
    ) {
      primaryIntent = 'greeting_social';
      explicitGoals.push('الترحيب بالمستخدم وتقديم عبقرينو سوبر وتأكيد الجاهزية للعمل البرمجي والاستدلالي');
      implicitNeeds.push('استعراض القدرات المستقلة المتاحة ومبادئ ميثاق الوليد');
    }
    // 0.5 System Enhancement & Model Brain Upgrade (مثل: طور عقل المستشار عطيه بحيث يرد كما يرد جيمينيه)
    else if (
      /طور عقل|طور العقل|تطوير العقل|طور النموذج|تطوير النموذج|يرد كما يرد|ردود ذكية|تحسين الردود|upgrade brain|enhance model|ترقية النموذج|يرد مثل|أجب كما يجيب|جيمينيه|gemini|gpt/i.test(text)
    ) {
      primaryIntent = 'system_enhancement';
      explicitGoals.push('تطوير العقل الاصطناعي المستقل والنموذج اللغوي لعبقرينو ليرتقي إلى أعلى معايير الجودة والحوار الذكي');
      implicitNeeds.push(
        'إثراء مجموعات البيانات الحوارية ثنائية اللغة',
        'ضبط معمارية Causal Attention ونطاق السياق',
        'تحديث الأوزان عبر خوارزمية AdamW وخفض الخسارة',
        'استبدال القوالب النمطية باستدلال ديناميكي وتفكير حي'
      );
      missingParameters.push('تحديد المجال ذي الأولوية للتدريب (استشارات قانونية وهندسية، أم حوار عام متعدد الأدوار)');
    }
    // 0.6 Legal Consultations (المسائل القانونية وصياغة العقود)
    else if (/قانون|استشارة قانونية|عقد|تعاقد|تعويض|دعوى|محكمة|مستشار عطيه|جنحة|جناية|حقوق ملكية|legal|contract/i.test(text)) {
      primaryIntent = 'legal_consultation';
      explicitGoals.push('تقديم رأي قانوني واستشاري رصين مستند إلى أحكام القانون ومبادئ العدالة ومكتب المستشار عطيه الهلباوي');
      implicitNeeds.push('تكييف الواقعة القانونية وتحديد النصوص والمبادئ القضائية الواجبة التطبيق');
    }
    // 1. Creation Intent
    else if (/أنشئ|ابنِ|مشروع جديد|تطبيق|برنامج جديد|create|build|develop app/i.test(text)) {
      primaryIntent = 'create_software';
      explicitGoals.push('بناء منظومة برمجية جديدة');
      implicitNeeds.push('تحديد المعمارية وقاعدة البيانات وواجهات المستخدم');
      if (!/متجر|عيادة|مدرسة|عقار|شات|store|clinic|school/i.test(text)) {
        missingParameters.push('المجال الوظيفي الدقيق للتطبيق والمنصات المستهدفة');
      }
    }
    // 2. Repair Intent
    else if (/أصلح|عطل|مشكلة|فحص|خطأ|انهيار|fix|repair|bug|crash|error/i.test(text)) {
      primaryIntent = 'repair_diagnose';
      explicitGoals.push('فحص وتشخيص عطل برمجي وإصلاحه دون هدم');
      implicitNeeds.push('تحديد ملف العطل، وفحص سجل التتبع (Stack Trace)');
      if (!/```|class|function|line|ملف/i.test(text)) {
        missingParameters.push('سجل الخطأ الدقيق أو الشيفرة المصابة بالعطل');
      }
    }
    // 3. Training & Neural Model Intent
    else if (/تدريب|أوزان|نموذج|loss|خسارة|checkpoint|نقطة حفظ|train|epoch/i.test(text)) {
      primaryIntent = 'train_model';
      explicitGoals.push('إدارة تدريب النموذج اللغوي المستقل أو فحص أوزانه');
      implicitNeeds.push('التحقق من سلامة الأوزان ودقة التقييم وفصل بيانات الاختبار');
    }
    // 4. Al-Walid Charter
    else if (/ميثاق|الوليد|صدق|أمانة|حقوق|charter|ethics/i.test(text)) {
      primaryIntent = 'charter_inquiry';
      explicitGoals.push('الاستعلام عن مبادئ ميثاق الوليد في الذكاء الاصطناعي');
    }
    // 5. Code generation
    else if (/كود|دالة|اكتب كود|function|typescript|python|sql/i.test(text)) {
      primaryIntent = 'code_generation';
      explicitGoals.push('صياغة شيفرة برمجية موثقة ومدققة');
    }

    // Contradiction detection
    if (/سريع جداً.*بدون موارد|مجان.*مدفوع|محلي.*سحابي إجباري/i.test(text)) {
      detectedContradictions.push('تناقض بين طلب سرعة فائقة جداً مع اشتراط عدم استهلاك أي موارد معالجة');
    }
    if (/احفظ سرياً.*وانشر علناً/i.test(text)) {
      detectedContradictions.push('تعارض بين الحفظ السري المشفر والنشر العام للبيانات');
    }

    let suggestedAction = 'تقديم إجابة استدلالية متكاملة مدعومة بالبراهين';
    if (primaryIntent === 'greeting_social') {
      suggestedAction = 'الرد بترحيب كريم وتقديم هوية عبقرينو سوبر واستعراض خيارات العمل البرمجي المتاحة';
    } else if (primaryIntent === 'system_enhancement') {
      suggestedAction = 'وضع خطة هندسية تفصيلية لتطوير النموذج وإمكانية إطلاق دورة تدريب وتحديث الأوزان';
    } else if (primaryIntent === 'legal_consultation') {
      suggestedAction = 'تقديم تأصيل قانوني استشاري وفق القانون ومبادئ العدالة';
    } else if (primaryIntent === 'create_software') {
      suggestedAction = 'طرح أسئلة استيضاحية محددة للمتطلبات وتحديد الشاشات المقترحة';
    } else if (primaryIntent === 'repair_diagnose') {
      suggestedAction = 'فحص سبب الخطأ الجذري وتقديم رقعة التصحيح Diff Patch';
    } else if (primaryIntent === 'train_model') {
      suggestedAction = 'عرض لوحة التدريب وإطلاق دورة تحسين الأوزان مع رصد Loss';
    }

    return {
      primaryIntent,
      confidence: 0.96,
      explicitGoals,
      implicitNeeds,
      missingParameters,
      detectedContradictions,
      suggestedAction
    };
  }
}

export const defaultIntentAnalyzer = new IntentAnalyzer();
