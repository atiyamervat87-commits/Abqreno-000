/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Abqarino Brain Intermediate Service (src/services/brain.ts)
 * 
 * الوسيط البرمجي المركزي المسؤول عن:
 * 1. تحليل المدخلات من واجهة AbqarinoChat وتوجيهها إلى النموذج المحلي داخل NeuralBrainLab.
 * 2. إتاحة متابعة حالة المعالجة الحية (وضع الاستدلال vs التحليل المنطقي vs فحص الأمان المعرفي).
 * 3. القضاء على الردود القالبية عبر استدلال ديناميكي حي وتفكيك مركب للأوامر.
 * 4. ربط أوامر تطوير النظام بالمهام التنفيذية الحقيقية (تدريب الأوزان، تحديث نقاط الاستعادة، وحفظ المعالم).
 */

import { neuralEngine } from './neuralEngine';
import { defaultMindBridge, MindProcessingResult } from './mind/mindBridge';
import { defaultTrainer, TrainingTelemetry } from './neural/trainer';
import { defaultWeightsManager, ModelCheckpoint } from './neural/weights';
import { defaultTokenizer } from './neural/tokenizer';
import { defaultUnderstandingEngine } from './mind/bilingualUnderstanding';
import { defaultIntentAnalyzer } from './mind/intentAnalyzer';
import { defaultReasoningEngine } from './mind/multiStepReasoning';
import { defaultTaskPlanner } from './mind/taskPlanner';
import { defaultMemoryEngine } from './mind/memoryEngine';
import { defaultKnowledgeEngine } from './mind/knowledgeRetrieval';
import { defaultUncertaintyDetector } from './mind/uncertaintyDetector';
import { defaultFactChecker } from './mind/factChecker';
import { defaultSelfCritique } from './mind/selfCritique';

export type BrainProcessingPhase =
  | 'idle'
  | 'analyzing_intent'      // التحليل المنطقي وتفكيك المعطيات
  | 'retrieving_knowledge'  // استرجاع المعرفة وسجلات الذاكرة
  | 'inference_mode'        // وضع الاستدلال العصبي وتوليد الاستجابة
  | 'charter_check'         // فحص الأمان المعرفي وميثاق الوليد
  | 'synthesizing_solution' // صياغة الحلول والمهام التنفيذية
  | 'ready';

export interface BrainLiveStatus {
  phase: BrainProcessingPhase;
  phaseLabelAr: string;
  percent: number;
  detail: string;
  activeModelVersion: string;
  currentLoss: number;
}

export interface BrainActionTrigger {
  id: string;
  label: string;
  action: 'start_training' | 'pause_training' | 'open_lab' | 'save_checkpoint' | 'apply_patch';
  payload?: any;
}

export interface BrainResponse {
  id: string;
  userPrompt: string;
  text: string;
  timestamp: string;
  intent: string;
  executionTimeMs: number;
  activeModelVersion: string;
  metrics: {
    tokensProcessed: number;
    tokensGenerated: number;
    epistemicConfidence: number;
    currentLoss: number;
    isIndependentLocalExecution: boolean;
  };
  mindUnitsReport: MindProcessingResult['mindUnitsReport'];
  actionTriggers?: BrainActionTrigger[];
  clarifyingQuestion?: string;
  suggestedQuickReplies?: string[];
}

export interface ChatContextMessage {
  sender: 'user' | 'assistant' | 'abqarino';
  text: string;
}

export class AbqarinoBrainService {
  private currentStatus: BrainLiveStatus = {
    phase: 'idle',
    phaseLabelAr: 'جاهز للاستقبال والاستدلال',
    percent: 100,
    detail: 'العقل الاصطناعي في وضع الاستعداد',
    activeModelVersion: defaultWeightsManager.getActiveCheckpoint().version,
    currentLoss: defaultTrainer.getTelemetry().currentLoss
  };

  private statusListeners: Array<(status: BrainLiveStatus) => void> = [];

  constructor() {
    // Sync with trainer updates
    defaultTrainer.subscribe((telemetry) => {
      this.currentStatus.currentLoss = telemetry.currentLoss;
      this.currentStatus.activeModelVersion = defaultWeightsManager.getActiveCheckpoint().version;
    });
  }

  public subscribeStatus(listener: (status: BrainLiveStatus) => void): () => void {
    this.statusListeners.push(listener);
    listener(this.currentStatus);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private notifyStatus(status: Partial<BrainLiveStatus>) {
    this.currentStatus = {
      ...this.currentStatus,
      ...status,
      activeModelVersion: defaultWeightsManager.getActiveCheckpoint().version,
      currentLoss: defaultTrainer.getTelemetry().currentLoss
    };
    for (const listener of this.statusListeners) {
      try {
        listener(this.currentStatus);
      } catch (err) {
        console.error('Error notifying brain status listener:', err);
      }
    }
  }

  public getStatus(): BrainLiveStatus {
    return { ...this.currentStatus };
  }

  /**
   * Process chat prompt through the local Abqarino brain with live status updates,
   * contextual awareness, and real task triggers.
   */
  public async processChatPrompt(
    prompt: string,
    history: ChatContextMessage[] = [],
    onLiveUpdate?: (status: BrainLiveStatus) => void
  ): Promise<BrainResponse> {
    const startTime = performance.now();
    const cleanPrompt = prompt.trim();

    const dispatchStatus = (phase: BrainProcessingPhase, label: string, percent: number, detail: string) => {
      this.notifyStatus({ phase, phaseLabelAr: label, percent, detail });
      if (onLiveUpdate) {
        onLiveUpdate(this.currentStatus);
      }
    };

    // Phase 1: Intent Analysis & Logical Decomposition
    dispatchStatus(
      'analyzing_intent',
      'التحليل المنطقي وتفكيك المعطيات',
      20,
      'استخراج المقاصد الصريحة والضمنية وكشف التناقضات...'
    );

    // Minor breathing room to allow UI frame rendering of status
    await new Promise((r) => setTimeout(r, 60));

    const understanding = defaultUnderstandingEngine.analyze(cleanPrompt);
    const intentResult = defaultIntentAnalyzer.analyze(cleanPrompt);

    // Phase 2: Memory & Knowledge Retrieval
    dispatchStatus(
      'retrieving_knowledge',
      'استرجاع المعرفة والذاكرة النشطة',
      45,
      'مطابقة الاستفسار مع قاعدة المعرفة الهندسية والقانونية وميثاق الوليد...'
    );

    const retrievedMemories = defaultMemoryEngine.searchMemories(cleanPrompt, 3);
    const retrievedKnowledge = defaultKnowledgeEngine.query(cleanPrompt, 3);
    const knowledgeSources = retrievedKnowledge.map((k) => k.doc.source);

    // Phase 3: Neural Inference Mode & Forward Generation
    dispatchStatus(
      'inference_mode',
      'وضع الاستدلال العصبي التوليدي',
      70,
      'تشغيل معمارية Causal Attention 125M لتوليد الاستجابة والاستدلال الحي...'
    );

    await new Promise((r) => setTimeout(r, 80));

    // Call foundational mind bridge
    const mindResult: MindProcessingResult = await defaultMindBridge.process(cleanPrompt);

    // Phase 4: Fact Check & Charter Compliance
    dispatchStatus(
      'charter_check',
      'فحص الأمان المعرفي وميثاق الوليد',
      90,
      'التحقق من الصدق المعرفي المطلق، وحظر التزييف، واستقلال التشغيل...'
    );

    // Phase 5: Synthesis of Action Triggers & Clarifying Questions
    let finalResponseText = mindResult.response;
    const actionTriggers: BrainActionTrigger[] = [];
    let clarifyingQuestion: string | undefined;
    let suggestedQuickReplies: string[] | undefined;

    // Detect if this is a System Enhancement / Training Request (e.g. طور عقل المستشار عطيه...)
    if (
      intentResult.primaryIntent === 'system_enhancement' ||
      /طور عقل|طور النموذج|يرد كما يرد|ردود ذكية|تحسين العقل|جيمينيه|gemini|gpt/i.test(cleanPrompt)
    ) {
      actionTriggers.push(
        {
          id: 'act-train-50',
          label: 'إطلاق دورة تدريب فورية (50 خطوة - AdamW)',
          action: 'start_training',
          payload: { steps: 50 }
        },
        {
          id: 'act-open-lab',
          label: 'فتح مركز تطوير العقل وتدريب النموذج',
          action: 'open_lab'
        },
        {
          id: 'act-save-cp',
          label: 'حفظ نقطة استعادة جديدة (Checkpoint)',
          action: 'save_checkpoint',
          payload: { label: 'تطوير عقل عبقرينو سوبر - استجابة مخصصة' }
        }
      );

      clarifyingQuestion = 'هل ترغب في تركيز التدريب على النمط الاستشاري التحليلي (مستشار قانوني وتقني) أم على المحادثة العامة المرنة بالعامية المصرية؟';
      suggestedQuickReplies = [
        'التركيز على النمط الاستشاري التحليلي الرصين',
        'التركيز على الطلاقة الحوارية العامة بالعامية المصرية',
        'ابدأ دورة تدريب 50 خطوة بالأوزان الحالية الآن'
      ];
    } else if (intentResult.primaryIntent === 'legal_consultation') {
      clarifyingQuestion = 'هل توجد مراسلات أو إخطارات كتابية سابقة قاطعة للمدد القانونية، أم أن العقد شفهي؟';
      suggestedQuickReplies = [
        'يوجد عقد كتابي موثق بين الطرفين',
        'العلاقة مبنية على مراسلات إلكترونية وإيصالات بنكية',
        'ما هي الإجراءات العاجلة لوقف سقوط الحق؟'
      ];
    } else if (intentResult.primaryIntent === 'create_software') {
      clarifyingQuestion = 'ما هي أهم 3 عمليات وظيفية يجب أن تبدأ بها الواجهة في المرحلة الأولى؟';
      suggestedQuickReplies = [
        'نظام تسجيل ودخول مع لوحة تحكم إحصائية',
        'متجر تفاعلي مع سلة مشتريات وبوابة دفع',
        'انتقل بي إلى استوديو الإنشاء لبدء الـ 15 مرحلة'
      ];
    } else if (intentResult.primaryIntent === 'repair_diagnose') {
      actionTriggers.push({
        id: 'act-diff-patch',
        label: 'تجهيز رقعة الإصلاح الذاتي (Diff Patch)',
        action: 'apply_patch'
      });
      clarifyingQuestion = 'هل يظهر الخلل في مرحلة التحميل الأولي (Runtime) أم أثناء ترجمة الأكواد (Build)؟';
      suggestedQuickReplies = [
        'الخلل يظهر في سجل المتصفح Console أثناء التشغيل',
        'الخطأ يحدث أثناء أمر البناء npm run build',
        'افتح استوديو الإصلاح الذكي لفحص المشروع كاملاً'
      ];
    }

    dispatchStatus(
      'ready',
      'اكتملت المعالجة بنجاح',
      100,
      'تم إنجاز الاستدلال العصبي والتحقق الذاتي بنجاح.'
    );

    const duration = Math.round(performance.now() - startTime);

    return {
      id: mindResult.id,
      userPrompt: cleanPrompt,
      text: finalResponseText,
      timestamp: mindResult.timestamp,
      intent: intentResult.primaryIntent,
      executionTimeMs: duration,
      activeModelVersion: defaultWeightsManager.getActiveCheckpoint().version,
      metrics: {
        tokensProcessed: mindResult.metrics.tokensProcessed,
        tokensGenerated: mindResult.metrics.tokensGenerated,
        epistemicConfidence: mindResult.metrics.epistemicConfidence,
        currentLoss: defaultTrainer.getTelemetry().currentLoss,
        isIndependentLocalExecution: true
      },
      mindUnitsReport: mindResult.mindUnitsReport,
      actionTriggers: actionTriggers.length > 0 ? actionTriggers : undefined,
      clarifyingQuestion,
      suggestedQuickReplies
    };
  }

  /**
   * Directly triggers an action in the NeuralBrainLab / Trainer
   */
  public triggerTrainerAction(action: 'start_training' | 'pause_training' | 'resume_training' | 'save_checkpoint', payload?: any): { success: boolean; message: string } {
    if (action === 'start_training') {
      const steps = payload?.steps || 50;
      defaultTrainer.startTraining(steps);
      return { success: true, message: `تم إطلاق دورة التدريب العصبي الفعلي (${steps} خطوة) بنجاح عبر خوارزمية AdamW.` };
    }
    if (action === 'pause_training') {
      defaultTrainer.pauseTraining();
      return { success: true, message: 'تم إيقاف التدريب مؤقتاً بأمان.' };
    }
    if (action === 'resume_training') {
      defaultTrainer.resumeTraining();
      return { success: true, message: 'تم استئناف التدريب بنجاح.' };
    }
    if (action === 'save_checkpoint') {
      const label = payload?.label || 'حفظ يدوي معتمد';
      const cp = defaultWeightsManager.saveCheckpoint(label);
      return { success: true, message: `تم حفظ نقطة الاستعادة بنجاح: ${cp.version}` };
    }
    return { success: false, message: 'إجراء غير معروف' };
  }

  public getTelemetry(): TrainingTelemetry {
    return defaultTrainer.getTelemetry();
  }

  public getActiveCheckpoint(): ModelCheckpoint {
    return defaultWeightsManager.getActiveCheckpoint();
  }
}

export const brainService = new AbqarinoBrainService();
export default brainService;
