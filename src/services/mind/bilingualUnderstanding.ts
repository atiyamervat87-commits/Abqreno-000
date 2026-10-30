/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bilingual Language Understanding Engine (Module 1)
 * Detects languages, extracts semantic tokens, identifies linguistic nuances
 */

import { defaultTokenizer } from '../neural/tokenizer';

export interface LanguageUnderstandingResult {
  detectedLanguage: 'ar' | 'en' | 'mixed';
  confidence: number;
  normalizedText: string;
  tokenCount: number;
  extractedKeywords: string[];
  hasCodeSnippet: boolean;
  linguisticFeatures: {
    isQuestion: boolean;
    isCommand: boolean;
    sentiment: 'neutral' | 'positive' | 'urgent';
    morphologicalRootsFound: string[];
  };
}

export class BilingualUnderstandingEngine {
  public analyze(input: string): LanguageUnderstandingResult {
    const raw = input.trim();
    const hasArabic = /[\u0600-\u06FF]/.test(raw);
    const hasLatin = /[a-zA-Z]/.test(raw);

    let detectedLanguage: 'ar' | 'en' | 'mixed' = 'ar';
    if (hasArabic && hasLatin) detectedLanguage = 'mixed';
    else if (!hasArabic && hasLatin) detectedLanguage = 'en';

    const normalizedText = defaultTokenizer.normalizeArabic(raw);
    const { tokens } = defaultTokenizer.tokenize(raw);

    const isQuestion = /[?؟]/.test(raw) || /^(هل|ما|ماذا|كيف|لماذا|أين|متى|كم|من|what|how|why|where|when|can|is|are)/i.test(raw);
    const isCommand = /^(أنشئ|ابنِ|أصلح|افحص|نفذ|اكتب|درّب|create|build|fix|repair|inspect|run|train)/i.test(raw);
    const hasCodeSnippet = /```|function|const|import|class|def|select\s+.*\s+from/i.test(raw);
    const isUrgent = /(عاجل|سريع|خطأ فادح|انهيار|فوري|urgent|critical|crash|fatal)/i.test(raw);

    // Extract core keywords
    const keywords = tokens.filter((t) => t.length > 2 && !/^(في|من|إلى|على|عن|مع|أن|إن|the|and|for|with)$/i.test(t));

    // Identify characteristic roots for Arabic
    const commonRoots = ['برمج', 'فحص', 'صلح', 'عقل', 'درب', 'نظم', 'وثق', 'سلم', 'حقق'];
    const rootsFound: string[] = [];
    for (const root of commonRoots) {
      if (normalizedText.includes(root)) rootsFound.push(root);
    }

    return {
      detectedLanguage,
      confidence: 0.98,
      normalizedText,
      tokenCount: tokens.length,
      extractedKeywords: Array.from(new Set(keywords)).slice(0, 10),
      hasCodeSnippet,
      linguisticFeatures: {
        isQuestion,
        isCommand,
        sentiment: isUrgent ? 'urgent' : 'neutral',
        morphologicalRootsFound: rootsFound
      }
    };
  }
}

export const defaultUnderstandingEngine = new BilingualUnderstandingEngine();
