/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Knowledge Retrieval / RAG Engine for Abqarino Mind (Module 6)
 * Authorized, indexed repository with provenance tracking
 */

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'architecture' | 'charter' | 'security' | 'delivery' | 'ai_theory';
  content: string;
  source: string;
  keywords: string[];
}

export interface RetrievalResult {
  doc: KnowledgeDocument;
  relevanceScore: number;
  snippet: string;
}

export class KnowledgeRetrievalEngine {
  private documents: KnowledgeDocument[] = [
    {
      id: 'doc-charter-01',
      title: 'ميثاق الوليد: الصدق المعرفي وعدم التزييف',
      category: 'charter',
      content: 'المبدأ الجوهري في ميثاق الوليد هو الامتناع التام عن اختلاق الحقائق أو الأرقام. يجب على النموذج إعلان عدم المعرفة صراحة عند غياب الدليل القاطع، والتمييز الصارم بين الحقائق المثبتة والاستنتاجات الاجتهادية.',
      source: 'ميثاق الوليد للذكاء الاصطناعي — المادة 1 و2',
      keywords: ['ميثاق', 'الوليد', 'صدق', 'حقيقة', 'استنتاج', 'عدم معرفة', 'هلوسة']
    },
    {
      id: 'doc-arch-01',
      title: 'معمارية العقل الاصطناعي المستقل لعبقرينو سوبر',
      category: 'architecture',
      content: 'يتألف العقل المستقل من 12 وحدة مترابطة: الفهم اللغوي، تحليل القصد، التفكير متعدد الخطوات، التخطيط وتقسيم المهام، الذاكرة المزدوجة، استرجاع المعرفة، التحقق من الحقائق، معايرة عدم اليقين، المراجعة الذاتية، إدارة الأدوات، مراقبة الأخطاء، وجسر الاتصال بالنموذج العصبي.',
      source: 'المواصفات الفنية لمنظومة عبقرينو سوبر — الإصدار الكامل',
      keywords: ['معمارية', 'عقل', 'وحدات', '12', 'مستقل', 'نموذج', 'سوبر']
    },
    {
      id: 'doc-delivery-01',
      title: 'نظام التحكم الحصري في تسليم البرمجيات (الباب العاشر)',
      category: 'delivery',
      content: 'يحظر قطعياً التسليم التلقائي لأي كود نهائي أو مشروع مكتمل إلى العميل مباشرة. يتم حجز كافة الحزم داخل الخزينة، ولا يتم التنزيل أو الإرسال عبر واتساب إلا بواسطة صاحب المنصة حصرياً بعد التحقق اليدوي من تحويل القيمة عبر المحفظة 01153747612.',
      source: 'دليل تشغيل منصة عبقرينو — الباب العاشر: التحكم الحصري',
      keywords: ['تسليم', 'حظر', 'واتساب', '01153747612', 'محفظة', 'صاحب المنصة', 'مالك', 'عطيه']
    },
    {
      id: 'doc-sec-01',
      title: 'معايير أمان التطبيقات البرمجية والخصوصية',
      category: 'security',
      content: 'تطبق المنصة مبادئ الدفاع العميق (Defense in Depth) وانعدام الثقة (Zero Trust). يتم تشفير السجلات الحساسة، ومنع تخزين مفاتيح API في الشيفرات المصدرية، وتطهير مدخلات المستخدم من هجمات الحقن XSS وSQL Injection.',
      source: 'دليل الأمان السيبراني لمنصة عبقرينو',
      keywords: ['أمان', 'تشفير', 'خصوصية', 'ثغرات', 'حقن', 'حماية']
    },
    {
      id: 'doc-ai-01',
      title: 'نموذج فك التشفير العصبي ثنائي اللغة (Abqarino Dense Edge)',
      category: 'ai_theory',
      content: 'نموذج عصبي محلي مستقل بحجم 125 مليون معامل يعمل بآلية الانتباه الذاتي Causal Self-Attention ومُجزئ لغوي يدعم جذور اللغة العربية ومفردات البرمجة الإنجليزية، مع إمكانية التدريب والاستئناف عبر خوارزمية AdamW.',
      source: 'ورقة المعمارية العصبية لعبقرينو Studio',
      keywords: ['نموذج', 'أوزان', 'تدريب', 'عصبي', 'انتباه', 'محلي', 'مستقل']
    }
  ];

  public query(prompt: string, maxResults: number = 2): RetrievalResult[] {
    const p = prompt.toLowerCase();
    const results: RetrievalResult[] = [];

    for (const doc of this.documents) {
      let score = 0;
      // Keyword matching
      for (const kw of doc.keywords) {
        if (p.includes(kw.toLowerCase())) {
          score += 2.0;
        }
      }
      // Content token matching
      const words = p.split(/\s+/).filter((w) => w.length > 2);
      for (const w of words) {
        if (doc.content.toLowerCase().includes(w)) {
          score += 0.5;
        }
      }

      if (score > 1.0) {
        results.push({
          doc,
          relevanceScore: Math.min(1.0, score / 6.0),
          snippet: doc.content.slice(0, 140) + '...'
        });
      }
    }

    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return results.slice(0, maxResults);
  }

  public getDocuments(): KnowledgeDocument[] {
    return [...this.documents];
  }

  public addDocument(doc: Omit<KnowledgeDocument, 'id'>): KnowledgeDocument {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `doc-custom-${Date.now()}`
    };
    this.documents.push(newDoc);
    return newDoc;
  }
}

export const defaultKnowledgeEngine = new KnowledgeRetrievalEngine();
