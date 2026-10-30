/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Self-Critique & Answer Reviewer for Abqarino Mind (Module 9)
 * Pre-delivery verification of tone, safety, accuracy, and Al-Walid compliance
 */

export interface CritiqueResult {
  isApproved: boolean;
  score: number; // 0.0 - 1.0
  critiqueNotes: string[];
  suggestedRevisions: string[];
  charterCompliance: boolean;
}

export class SelfCritiqueEngine {
  public review(draftResponse: string, intent: string): CritiqueResult {
    const notes: string[] = [];
    const suggestions: string[] = [];
    let score = 1.0;
    let charterCompliance = true;

    // 1. Check for hallucination / hyperbole
    if (/أقوى ذكاء في التاريخ|مستحيل أخطئ|أعرف كل شيء/i.test(draftResponse)) {
      score -= 0.3;
      charterCompliance = false;
      notes.push('تم رصد عبارات مبالغة أو ادعاءات غير مدعومة بالبراهين.');
      suggestions.push('تهذيب النبرة لتكون موضوعية متواضعة ومستندة إلى الواقع العلمي.');
    }

    // 2. Check for privacy leak risks
    if (/password\s*=\s*['"][^'"]+['"]|api_key\s*=\s*['"][^'"]+['"]/i.test(draftResponse)) {
      score -= 0.5;
      charterCompliance = false;
      notes.push('تحذير أمني: الشيفرة تحتوي على مفتاح أو كلمة مرور مكشوفة.');
      suggestions.push('استبدال المفاتيح الصريحة بمتغيرات بيئة مشفرة process.env.');
    }

    // 3. Check for clarity and structure
    if (draftResponse.length > 200 && !/\n|•|-|\d\./.test(draftResponse)) {
      score -= 0.1;
      notes.push('النص طويل ومصمت يحتاج إلى تنسيق نقطي لسهولة القراءة.');
      suggestions.push('تقسيم المخرجات إلى نقاط مرقمة أو فقرات محددة.');
    }

    // 4. Validate Al-Walid Charter attribution if discussing ethics
    if (intent === 'charter_inquiry' && !draftResponse.includes('ميثاق الوليد')) {
      score -= 0.2;
      notes.push('الإجابة تناقش المبادئ دون الإشارة الصريحة لميثاق الوليد المعتمد.');
      suggestions.push('تضمين الإشارة الواضحة لمواد ميثاق الوليد.');
    }

    if (notes.length === 0) {
      notes.push('الإجابة تستوفي كافة معايير المراجعة الذاتية وميثاق الوليد.');
    }

    return {
      isApproved: score >= 0.75,
      score: parseFloat(score.toFixed(2)),
      critiqueNotes: notes,
      suggestedRevisions: suggestions,
      charterCompliance
    };
  }
}

export const defaultSelfCritique = new SelfCritiqueEngine();
