/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bilingual Arabic-English Tokenizer for Abqarino Neural Engine
 */

export interface TokenizerOutput {
  tokens: string[];
  tokenIds: number[];
}

// Special control tokens
export const SPECIAL_TOKENS = {
  PAD: '<pad>',
  UNK: '<unk>',
  BOS: '<s>',
  EOS: '</s>',
  THOUGHT_START: '<thought>',
  THOUGHT_END: '</thought>',
  ACTION_START: '<action>',
  ACTION_END: '</action>',
  FACT: '<fact>',
  UNCERTAIN: '<uncertain>'
} as const;

// Base foundational vocabulary dictionary
const BASE_VOCAB_LIST: string[] = [
  '<pad>', '<unk>', '<s>', '</s>', '<thought>', '</thought>', '<action>', '</action>', '<fact>', '<uncertain>',
  // Punctuation and symbols
  ' ', '\n', '\t', '.', ',', '،', '?', '؟', '!', ':', ';', '؛', '-', '_', '(', ')', '[', ']', '{', '}', '/', '\\', '"', "'", '`', '+', '=', '*', '<', '>', '@', '#', '$', '%', '&', '|',
  // Common English subwords & words
  'the', 'is', 'are', 'was', 'were', 'to', 'in', 'of', 'and', 'a', 'an', 'that', 'this', 'for', 'with', 'on', 'as', 'at', 'by', 'from',
  'it', 'you', 'i', 'we', 'they', 'he', 'she', 'not', 'or', 'but', 'if', 'then', 'else', 'function', 'const', 'let', 'var', 'return',
  'code', 'model', 'data', 'train', 'loss', 'weight', 'neural', 'mind', 'abqarino', 'system', 'test', 'error', 'memory', 'agent', 'run',
  'input', 'output', 'context', 'query', 'response', 'version', 'checkpoint', 'learning', 'rate', 'step', 'epoch', 'accuracy', 'benchmark',
  'true', 'false', 'null', 'undefined', 'async', 'await', 'import', 'export', 'class', 'interface', 'type', 'number', 'string', 'boolean',
  // Arabic foundational words & morphology (جذور وكلمات أساسية)
  'في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'ما', 'ماذا', 'من', 'كيف', 'لماذا', 'أين', 'متى', 'كم', 'هل',
  'هو', 'هي', 'هم', 'نحن', 'أنا', 'أنت', 'كان', 'يكون', 'سيكون', 'إن', 'أن', 'لا', 'لم', 'لن', 'ليس', 'غير', 'بل', 'لكن', 'ثم',
  'عقل', 'نموذج', 'بيانات', 'تدريب', 'استدلال', 'تخطيط', 'ذاكرة', 'محادثة', 'تحقق', 'أوزان', 'معمارية', 'مفردات', 'سياق', 'إصدار',
  'عبقرينو', 'مالك', 'سوبر', 'الوليد', 'ميثاق', 'نظام', 'برمجة', 'كود', 'مشروع', 'إصلاح', 'إنشاء', 'فحص', 'تطبيق', 'قاعدة', 'واجهة',
  'خوارزمية', 'خطوة', 'دقة', 'خسارة', 'تقييم', 'أمان', 'يقين', 'معرفة', 'حقيقة', 'استنتاج', 'خطأ', 'تعافي', 'أداة', 'مستقل', 'محلي',
  'نعم', 'صحيح', 'مؤكد', 'محتمل', 'غير_معروف', 'غير_مؤكد', 'تحليل', 'تنفيذ', 'حل', 'مسألة', 'سؤال', 'جواب', 'نتيجة', 'تقرير', 'مستشار'
];

export class AbqarinoTokenizer {
  private tokenToId: Map<string, number> = new Map();
  private idToToken: Map<number, string> = new Map();
  public readonly vocabSize: number = 4096;

  constructor() {
    this.buildVocab();
  }

  private buildVocab() {
    let currentId = 0;
    for (const token of BASE_VOCAB_LIST) {
      if (!this.tokenToId.has(token)) {
        this.tokenToId.set(token, currentId);
        this.idToToken.set(currentId, token);
        currentId++;
      }
    }
  }

  /**
   * Arabic text normalization: strips redundant diacritics, unifies forms of Alef & Yaa
   */
  public normalizeArabic(text: string): string {
    return text
      // Strip Arabic tashkeel (diacritics)
      .replace(/[\u064B-\u065F\u0670]/g, '')
      // Strip tatweel
      .replace(/\u0640/g, '')
      // Normalize alef forms (أ, إ, آ -> ا)
      .replace(/[إأآ]/g, 'ا')
      // Normalize yaa (ى -> ي)
      .replace(/ى/g, 'ي')
      // Normalize taa marbouta (ة -> ه if needed or keep)
      .replace(/ة/g, 'ة')
      .trim();
  }

  /**
   * Tokenizes text into tokens and deterministic token IDs
   */
  public tokenize(text: string): TokenizerOutput {
    if (!text) return { tokens: [], tokenIds: [] };

    const normalized = this.normalizeArabic(text);

    // Regex for Arabic words, Latin words/numbers, punctuation, special tokens
    const regex = /<[a-z_\/]+>|[\u0600-\u06FF]+|[a-zA-Z0-9]+|[^\s\w]/g;
    const matches = normalized.match(regex) || [];

    const tokens: string[] = [];
    const tokenIds: number[] = [];

    for (const match of matches) {
      const lowerMatch = match.toLowerCase();
      tokens.push(match);

      if (this.tokenToId.has(lowerMatch)) {
        tokenIds.push(this.tokenToId.get(lowerMatch)!);
      } else if (this.tokenToId.has(match)) {
        tokenIds.push(this.tokenToId.get(match)!);
      } else {
        // Deterministic hash to vocabulary space [100, vocabSize - 1]
        let hash = 0;
        for (let i = 0; i < match.length; i++) {
          hash = (hash * 31 + match.charCodeAt(i)) % (this.vocabSize - 100);
        }
        const assignedId = 100 + Math.abs(hash);
        tokenIds.push(assignedId);
        // Cache dynamically
        if (!this.idToToken.has(assignedId)) {
          this.idToToken.set(assignedId, match);
        }
      }
    }

    return { tokens, tokenIds };
  }

  /**
   * Decodes token IDs back into readable text
   */
  public decode(tokenIds: number[]): string {
    const parts: string[] = [];
    for (const id of tokenIds) {
      if (id === 0) continue; // skip PAD
      if (this.idToToken.has(id)) {
        parts.push(this.idToToken.get(id)!);
      } else {
        parts.push(`[${id}]`);
      }
    }
    // Join with natural spacing: avoid space before Arabic/English punctuation
    return parts.reduce((acc, curr, idx) => {
      if (idx === 0) return curr;
      if (/^[.,،؟?!:;؛)\]}"]/.test(curr)) return acc + curr;
      if (/^[(\[{"`]/.test(acc.slice(-1))) return acc + curr;
      return acc + ' ' + curr;
    }, '');
  }

  public getVocabSize(): number {
    return this.vocabSize;
  }
}

export const defaultTokenizer = new AbqarinoTokenizer();
