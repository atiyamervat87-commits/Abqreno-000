/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Task Planner & Decomposition Engine for Abqarino Mind (Module 4)
 * Breaks complex requests into actionable, ordered execution milestones
 */

export interface SubTask {
  id: string;
  order: number;
  title: string;
  description: string;
  dependencies: string[];
  estimatedDurationMs: number;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ExecutionPlan {
  planId: string;
  overallGoal: string;
  tasks: SubTask[];
  milestones: string[];
  fallbackStrategy: string;
}

export class TaskPlannerEngine {
  public plan(goal: string, intent: string): ExecutionPlan {
    const tasks: SubTask[] = [];

    if (intent === 'greeting_social') {
      tasks.push(
        {
          id: 'task-1',
          order: 1,
          title: 'استقبال التحية وبناء الألفة المهنية',
          description: 'الترحيب بالمستخدم بعبارة كريمة وتعريفه بهوية عبقرينو سوبر واستقلاليته الكاملة.',
          dependencies: [],
          estimatedDurationMs: 50,
          status: 'completed',
          riskLevel: 'low'
        },
        {
          id: 'task-2',
          order: 2,
          title: 'استعراض القدرات المستقلة المتاحة',
          description: 'إيضاح مجالات الدعم المتاحة (إنشاء البرامج، إصلاح الأخطاء، تدريب النموذج، صياغة الأكواد).',
          dependencies: ['task-1'],
          estimatedDurationMs: 80,
          status: 'completed',
          riskLevel: 'low'
        },
        {
          id: 'task-3',
          order: 3,
          title: 'فتح مسار المحادثة والعمل',
          description: 'دعوة المستخدم لطرح فكرته أو مشكلته البرمجية للبدء في تحليلها فورياً.',
          dependencies: ['task-2'],
          estimatedDurationMs: 60,
          status: 'completed',
          riskLevel: 'low'
        }
      );
      return {
        planId: `plan-greet-${Date.now()}`,
        overallGoal: 'استقبال المستخدم وفتح مسار العمل البرمجي الاستدلالي',
        tasks,
        milestones: ['الترحيب', 'بيان القدرات', 'الجاهزية للطلب'],
        fallbackStrategy: 'الاستجابة المباشرة لأي سؤال يطرحه المستخدم لاحقاً'
      };
    }

    if (intent === 'system_enhancement') {
      tasks.push(
        {
          id: 'task-enh-1',
          order: 1,
          title: 'تحليل الأهداف المعرفية وتوليد بيانات التدريب',
          description: 'إعداد وحقن عينات حوارية واستدلالية ثنائية اللغة متعددة الأدوار في DatasetStudio لرفع ثراء النموذج.',
          dependencies: [],
          estimatedDurationMs: 400,
          status: 'completed',
          riskLevel: 'low'
        },
        {
          id: 'task-enh-2',
          order: 2,
          title: 'معايرة معمارية الانتباه ونافذة السياق',
          description: 'ضبط بارامترات Causal Decoder ورفع نافذة السياق إلى 8192 رمزاً وتعديل أخذ العينات التوليدي (Temperature 0.65).',
          dependencies: ['task-enh-1'],
          estimatedDurationMs: 600,
          status: 'completed',
          riskLevel: 'medium'
        },
        {
          id: 'task-enh-3',
          order: 3,
          title: 'إطلاق دورة التدريب العصبي الفعلي (AdamW)',
          description: 'تنفيذ تدريب الأوزان ورصد تراجع دالة الخسارة (Loss) في ModelTrainingLabView وحفظ نقطة استعادة جديدة.',
          dependencies: ['task-enh-2'],
          estimatedDurationMs: 1500,
          status: 'in_progress',
          riskLevel: 'medium'
        },
        {
          id: 'task-enh-4',
          order: 4,
          title: 'اعتماد الإصدار وإلغاء القوالب النمطية',
          description: 'تفعيل الاستدلال الديناميكي المباشر وضمان الإجابة المخصصة لكل سؤال وفق ميثاق الوليد.',
          dependencies: ['task-enh-3'],
          estimatedDurationMs: 300,
          status: 'pending',
          riskLevel: 'low'
        }
      );
      return {
        planId: `plan-enh-${Date.now()}`,
        overallGoal: 'ترقية وتطوير العقل الاصطناعي والنموذج اللغوي المستقل لعبقرينو سوبر',
        tasks,
        milestones: ['توليد البيانات الحوارية', 'ضبط المعمارية', 'تدريب الأوزان', 'اعتماد الإصدار المستقل'],
        fallbackStrategy: 'الاستعادة الفورية لنقطة الحفظ السابقة في حال ارتفاع دالة الخسارة عن الحدود المقبولة'
      };
    }

    if (intent === 'legal_consultation') {
      tasks.push(
        {
          id: 'task-leg-1',
          order: 1,
          title: 'التكييف القانوني وحصر النزاع أو الاستفسار',
          description: 'فحص الوقائع وبيان الصفات القانونية وتحديد الفرع القانوني الواجب التطبيق.',
          dependencies: [],
          estimatedDurationMs: 250,
          status: 'completed',
          riskLevel: 'low'
        },
        {
          id: 'task-leg-2',
          order: 2,
          title: 'استقراء النصوص القانونية وأحكام النقض',
          description: 'تطبيق المواد التشريعية وأحكام محكمة النقض المصرية ومبادئ مكتب المستشار عطيه الهلباوي.',
          dependencies: ['task-leg-1'],
          estimatedDurationMs: 400,
          status: 'completed',
          riskLevel: 'low'
        },
        {
          id: 'task-leg-3',
          order: 3,
          title: 'صياغة التوصيات الإجرائية والوقائية',
          description: 'بيان الخطوات العملية لحماية الحقوق وتفادي المهل القانونية وسقوط الحق بالتقادم.',
          dependencies: ['task-leg-2'],
          estimatedDurationMs: 350,
          status: 'completed',
          riskLevel: 'low'
        }
      );
      return {
        planId: `plan-leg-${Date.now()}`,
        overallGoal: 'تقديم رأي قانوني واستشاري منهجي محكم',
        tasks,
        milestones: ['التكييف القانوني', 'التأصيل التشريعي والقضائي', 'التوصيات الإجرائية'],
        fallbackStrategy: 'التأكيد على مراجعة المستندات الأصلية بحضور المستشار المعني'
      };
    }

    if (intent === 'create_software') {
      tasks.push(
        {
          id: 'task-1',
          order: 1,
          title: 'تحليل المتطلبات وتحديد حدود النظام',
          description: 'صياغة أهداف البرنامج وتحديد الكيانات وحالات الاستخدام دون فرض شاشات مسبقة.',
          dependencies: [],
          estimatedDurationMs: 400,
          status: 'completed',
          riskLevel: 'low'
        },
        {
          id: 'task-2',
          order: 2,
          title: 'تصميم هيكل البيانات والواجهات المتجاوبة',
          description: 'إعداد جداول قاعدة البيانات والمسارات البرمجية وتصميم شاشات متوافقة مع الجوال والحاسوب.',
          dependencies: ['task-1'],
          estimatedDurationMs: 800,
          status: 'completed',
          riskLevel: 'medium'
        },
        {
          id: 'task-3',
          order: 3,
          title: 'بناء الشيفرات وتأمين الاختبارات الصارمة',
          description: 'كتابة مكونات النظام والتحقق من سلامة الأكواد بنسبة نجاح 100% في كافة السيناريوهات.',
          dependencies: ['task-2'],
          estimatedDurationMs: 1200,
          status: 'in_progress',
          riskLevel: 'medium'
        },
        {
          id: 'task-4',
          order: 4,
          title: 'التحزيم الآمن والحجز في خزينة التسليم الحصري',
          description: 'إنشاء حزمة ZIP كاملة وحفظها محلياً لحين مراجعة صاحب المنصة والتحقق من الدفع.',
          dependencies: ['task-3'],
          estimatedDurationMs: 500,
          status: 'pending',
          riskLevel: 'high'
        }
      );
    } else if (intent === 'repair_diagnose') {
      tasks.push(
        {
          id: 'task-rep-1',
          order: 1,
          title: 'تحديد نقطة الدخول واستكشاف ملف العطل',
          description: 'فحص شجرة المشروع وتشخيص الملف الحاضن للخلل دون المساس بالملفات السليمة.',
          dependencies: [],
          estimatedDurationMs: 300,
          status: 'completed',
          riskLevel: 'low'
        },
        {
          id: 'task-rep-2',
          order: 2,
          title: 'تحديد السبب الجذري Root Cause وتأكيد الثقة',
          description: 'تصنيف الخطأ بدقة (نحوي، منطقي، تسريب ذاكرة) وتحديد نسبة الثقة التشخيصية.',
          dependencies: ['task-rep-1'],
          estimatedDurationMs: 500,
          status: 'completed',
          riskLevel: 'medium'
        },
        {
          id: 'task-rep-3',
          order: 3,
          title: 'صياغة رقعة التصحيح Diff Patch واختبارها',
          description: 'تطبيق التعديل الدقيق وإجراء اختبار إعادة تشغيل للتحقق من زوال العطل.',
          dependencies: ['task-rep-2'],
          estimatedDurationMs: 600,
          status: 'in_progress',
          riskLevel: 'low'
        }
      );
    } else {
      // General reasoning plan
      tasks.push(
        {
          id: 'task-gen-1',
          order: 1,
          title: 'فهم وتفكيك السؤال',
          description: 'استخراج الأطروحة والتحقق من الشروط المسبقة.',
          dependencies: [],
          estimatedDurationMs: 200,
          status: 'completed',
          riskLevel: 'low'
        },
        {
          id: 'task-gen-2',
          order: 2,
          title: 'استرجاع الأدلة والتحقق من الحقائق',
          description: 'مطابقة المعطيات مع قاعدة المعرفة واستبعاد المغالطات.',
          dependencies: ['task-gen-1'],
          estimatedDurationMs: 300,
          status: 'completed',
          riskLevel: 'low'
        },
        {
          id: 'task-gen-3',
          order: 3,
          title: 'صياغة المخرجات ومراجعتها ذاتياً',
          description: 'فحص خلو الإجابة من الهلوسة والتأكد من وضوحها.',
          dependencies: ['task-gen-2'],
          estimatedDurationMs: 200,
          status: 'in_progress',
          riskLevel: 'low'
        }
      );
    }

    return {
      planId: `plan-${Date.now()}`,
      overallGoal: goal,
      tasks,
      milestones: tasks.map((t) => t.title),
      fallbackStrategy: 'في حالة تعثر أي مرحلة، يتم التراجع إلى الحالة السابقة الآمنة وتنبيه المسؤول فوراً.'
    };
  }
}

export const defaultTaskPlanner = new TaskPlannerEngine();
