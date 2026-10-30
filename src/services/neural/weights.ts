/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Checkpoint Registry & Weights Manager for Abqarino
 */

import { AbqarinoLanguageModel } from './architecture';

export interface ModelCheckpoint {
  id: string;
  version: string;
  epoch: number;
  steps: number;
  loss: number;
  perplexity: number;
  accuracy: number;
  createdAt: string;
  isBaseline: boolean;
  isActive: boolean;
  notes: string;
  author: string;
  weightsSummary: {
    totalParams: number;
    sampleWeights: number[];
  };
}

const STORAGE_KEY = 'abqarino_checkpoints_v2';

export class WeightsManager {
  private checkpoints: ModelCheckpoint[] = [];
  private activeVersionId: string = 'ckpt-baseline-v1';

  constructor() {
    this.loadCheckpoints();
  }

  private loadCheckpoints() {
    const defaultCheckpoints: ModelCheckpoint[] = [
      {
        id: 'ckpt-baseline-v1',
        version: 'abqarino-v1.0-baseline',
        epoch: 1,
        steps: 120,
        loss: 2.148,
        perplexity: 8.57,
        accuracy: 74.2,
        createdAt: '2026-10-25 09:30',
        isBaseline: true,
        isActive: false,
        notes: 'النسخة القاعدية الأولية قبل التدريب المعزز على ميثاق الوليد',
        author: 'النظام الأساسي',
        weightsSummary: {
          totalParams: 125000000,
          sampleWeights: [0.012, -0.045, 0.089, -0.015, 0.033]
        }
      },
      {
        id: 'ckpt-epoch-42-v3',
        version: 'abqarino-v3.2-production',
        epoch: 42,
        steps: 1840,
        loss: 0.884,
        perplexity: 2.42,
        accuracy: 94.6,
        createdAt: '2026-10-29 18:45',
        isBaseline: false,
        isActive: true,
        notes: 'إصدار مستقر اجتاز ميثاق الوليد واختبارات البرمجة والاستدلال الصارم',
        author: 'مالك — المستشار عطيه الهلباوي',
        weightsSummary: {
          totalParams: 125000000,
          sampleWeights: [0.082, -0.019, 0.124, -0.008, 0.061]
        }
      }
    ];

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.checkpoints = parsed;
            const active = this.checkpoints.find((c) => c.isActive);
            if (active) this.activeVersionId = active.id;
            return;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available, using in-memory checkpoints', e);
    }

    this.checkpoints = defaultCheckpoints;
    this.activeVersionId = 'ckpt-epoch-42-v3';
  }

  private persist() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.checkpoints));
      }
    } catch (e) {
      console.warn('Failed to persist checkpoints to storage', e);
    }
  }

  public getCheckpoints(): ModelCheckpoint[] {
    return [...this.checkpoints];
  }

  public getActiveCheckpoint(): ModelCheckpoint {
    return this.checkpoints.find((c) => c.id === this.activeVersionId) || this.checkpoints[0];
  }

  public setActiveVersion(checkpointId: string): boolean {
    const target = this.checkpoints.find((c) => c.id === checkpointId);
    if (!target) return false;

    this.checkpoints = this.checkpoints.map((c) => ({
      ...c,
      isActive: c.id === checkpointId
    }));
    this.activeVersionId = checkpointId;
    this.persist();
    return true;
  }

  public saveNewCheckpoint(
    model: AbqarinoLanguageModel,
    epoch: number,
    steps: number,
    loss: number,
    accuracy: number,
    notes: string,
    author: string = 'مالك'
  ): ModelCheckpoint {
    const versionLabel = `abqarino-v${(3.2 + epoch * 0.05).toFixed(2)}-e${epoch}`;
    const newCkpt: ModelCheckpoint = {
      id: `ckpt-${Date.now()}`,
      version: versionLabel,
      epoch,
      steps,
      loss: parseFloat(loss.toFixed(4)),
      perplexity: parseFloat(Math.exp(Math.min(10, loss)).toFixed(2)),
      accuracy: parseFloat(accuracy.toFixed(1)),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isBaseline: false,
      isActive: true,
      notes,
      author,
      weightsSummary: {
        totalParams: 125000000,
        sampleWeights: Array.from(model.weights.wEmbed.slice(0, 5)).map((v) => parseFloat(v.toFixed(4)))
      }
    };

    // Mark previous as non-active
    this.checkpoints = this.checkpoints.map((c) => ({ ...c, isActive: false }));
    this.checkpoints.unshift(newCkpt);
    this.activeVersionId = newCkpt.id;
    this.persist();

    return newCkpt;
  }

  public rollbackTo(checkpointId: string): { success: boolean; message: string; checkpoint?: ModelCheckpoint } {
    const target = this.checkpoints.find((c) => c.id === checkpointId);
    if (!target) {
      return { success: false, message: 'نقطة الاستعادة المطلوبة غير موجودة' };
    }

    this.setActiveVersion(checkpointId);
    return {
      success: true,
      message: `تم التراجع بنجاح إلى الإصدار: ${target.version} (الحقبة ${target.epoch})`,
      checkpoint: target
    };
  }

  public compareCheckpoints(idA: string, idB: string) {
    const a = this.checkpoints.find((c) => c.id === idA);
    const b = this.checkpoints.find((c) => c.id === idB);
    if (!a || !b) return null;

    return {
      versionA: a.version,
      versionB: b.version,
      lossDiff: parseFloat((b.loss - a.loss).toFixed(4)),
      accuracyDiff: parseFloat((b.accuracy - a.accuracy).toFixed(2)),
      stepsDiff: b.steps - a.steps,
      epochDiff: b.epoch - a.epoch,
      verdict: b.loss < a.loss && b.accuracy > a.accuracy ? 'تحسن ملحوظ في دقة النموذج' : 'استقرار أو تراجع نسبي'
    };
  }
}

export const defaultWeightsManager = new WeightsManager();
