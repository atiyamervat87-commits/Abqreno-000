/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Uncertainty Detector & Honesty Calibration for Abqarino Mind (Module 8)
 * Explicit admission of unknown data and confidence quantification
 */

export interface UncertaintyAssessment {
  confidenceScore: number; // 0.0 - 1.0
  isCertain: boolean;
  uncertaintyType: 'none' | 'missing_input_context' | 'future_prediction' | 'private_secret' | 'epistemic_limit';
  admissionStatement?: string;
  recommendedClarification?: string;
}

export class UncertaintyDetector {
  public assess(prompt: string, retrievedMatchesCount: number): UncertaintyAssessment {
    const p = prompt.toLowerCase().trim();

    // 0. Greetings, introductions, and friendly social turns have absolute certainty (1.0)
    const isGreetingOrSocial =
      /^(السلام عليكم|وعليكم السلام|مرحبا|أهلا|اهلا|صباح الخير|مساء الخير|ازيك|عامل ايه|أهلاً بك|من أنت|عرفني بنفسك|ما هي قدراتك|كيف حالك|hello|hi|hey|good morning|good evening|who are you|what can you do|hallo|guten tag)[\s!؟?.]*$/i.test(p) ||
      /السلام عليكم|وعليكم السلام|أهلاً بك|مرحباً بك|عرفني بنفسك|من هو عبقرينو|ماذا تستطيع أن تفعل|أخبرني عن نفسك/i.test(p);

    if (isGreetingOrSocial) {
      return {
        confidenceScore: 1.0,
        isCertain: true,
        uncertaintyType: 'none'
      };
    }

    // 1. Future events or occult matters
    if (/غيب|مستقبل 20|ماذا سيحدث في عام 203|من سيموت|تنبأ لي/i.test(p)) {
      return {
        confidenceScore: 0.1,
        isCertain: false,
        uncertaintyType: 'future_prediction',
        admissionStatement: 'لا أملك أي معرفة بالأحداث المستقبلية أو الأمور الغيبية، وميثاق الوليد يلزمني بالصدق المعرفي والامتناع عن التخمين.',
        recommendedClarification: 'يرجى توجيه السؤال نحو المفاهيم الهندسية أو البرمجية أو الحقائق القابلة للقياس.'
      };
    }

    // 2. Private secrets or passwords
    if (/كلمة سر قاعدة|private key|مفتاح خادم السحاب|الباسورد السري/i.test(p)) {
      return {
        confidenceScore: 0.05,
        isCertain: false,
        uncertaintyType: 'private_secret',
        admissionStatement: 'لا أملك حق الوصول إلى أي مفاتيح أو كلمات مرور سرية؛ المنظومة تطبق حماية صارمة للخصوصية.',
        recommendedClarification: 'يرجى مراجعة مسؤول البنية التحتية المعتمد أو استخدام مديري المفاتيح المشفرين.'
      };
    }

    // 3. Missing input context (evaluating unprovided code or missing data)
    if (/هل هذا الكود صحيح|ما رأيك في مشروعي|ما الخطأ هنا/i.test(p) && !/```|function|class|const|def/i.test(p) && p.length < 50) {
      return {
        confidenceScore: 0.35,
        isCertain: false,
        uncertaintyType: 'missing_input_context',
        admissionStatement: 'لا أملك معطيات كافية للإجابة الدقيقة، حيث لم يتم إرفاق الكود أو تفاصيل المشكلة المطلوبة.',
        recommendedClarification: 'يرجى إرفاق الشيفرة المصدرية وسجل الخطأ (Error Log) لأتمكن من فحصها بصورة هندسية صحيحة.'
      };
    }

    // 4. Specific empirical fact request requiring external documents that are absent
    if (
      retrievedMatchesCount === 0 &&
      /كم عدد سكان|من ربح كأس العالم|تاريخ ميلاد|إحصائية رسمية لعام/i.test(p)
    ) {
      return {
        confidenceScore: 0.65,
        isCertain: false,
        uncertaintyType: 'epistemic_limit',
        admissionStatement: 'البيانات المتوفرة حول هذه الإحصائية أو الواقعة المحددة غير مدرجة في قاعدة المعرفة المعتمدة، وسأجيبك بالحدود المنطقية الموثوقة.',
        recommendedClarification: 'يمكنك تزويدي بمصادر أو توضيحات إضافية لتعزيز دقة الإجابة.'
      };
    }

    return {
      confidenceScore: 0.96,
      isCertain: true,
      uncertaintyType: 'none'
    };
  }
}

export const defaultUncertaintyDetector = new UncertaintyDetector();
