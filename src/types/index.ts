/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StudioTab = 
  | 'launcher' 
  | 'abqarino_chat'
  | 'creation' 
  | 'repair' 
  | 'neural_brain'
  | 'model_training'
  | 'antigravity'
  | 'tools_management'
  | 'backup_center'
  | 'admin_delivery' 
  | 'three_lab';

export type ProjectStatus =
  | 'new'
  | 'analyzing'
  | 'pending_approval'
  | 'in_progress'
  | 'testing'
  | 'needs_repair'
  | 'completed_pending_delivery_approval'
  | 'available_for_admin_download'
  | 'downloaded_by_admin'
  | 'externally_delivered'
  | 'cancelled';

export interface ProjectRequirement {
  id: string;
  title: string;
  description: string;
  category: 'core' | 'database' | 'security' | 'ui' | 'integration';
  approved: boolean;
}

export interface ScreenSpec {
  id: string;
  name: string;
  route: string;
  description: string;
  components: string[];
  responsiveBreakpoints: ('mobile' | 'tablet' | 'desktop')[];
  inputs: string[];
  actions: string[];
}

export interface ProjectFile {
  path: string;
  language: string;
  content: string;
  sizeBytes: number;
  lastModified: string;
}

export interface TestCase {
  id: string;
  name: string;
  type: 'syntax' | 'unit' | 'integration' | 'security' | 'database' | 'performance';
  status: 'passed' | 'failed' | 'pending';
  executionTimeMs: number;
  outputLog: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  userOrAdmin: string;
  details: string;
  ipAddress?: string;
}

export interface DeliveryLogEntry {
  id: string;
  projectId: string;
  adminId: string;
  timestamp: string;
  channel: 'whatsapp';
  recipientContact: string;
  paymentConfirmedVia: string; // e.g. "01153747612"
  notes: string;
}

export interface Project {
  id: string;
  orderNumber: string;
  name: string;
  description: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  type: 'creation' | 'repair';
  techStack: string[];
  status: ProjectStatus;
  currentStageNumber: number; // 1-15 for creation, 1-7 for repair
  priceEGP: number;
  paymentVerifiedByOwner: boolean;
  paymentReferencePhone: string; // "01153747612"
  requirements: ProjectRequirement[];
  screens: ScreenSpec[];
  files: ProjectFile[];
  testCases: TestCase[];
  auditLogs: AuditLogEntry[];
  deliveryLogs: DeliveryLogEntry[];
  secureStoragePath: string;
  finalBundleSizeBytes: number;
  createdAt: string;
  completedAt?: string;
  deliveredAt?: string;
}

export interface RepairDiagnosis {
  id: string;
  projectId: string;
  frameworkDetected: string;
  entryPoint: string;
  primaryBugCategory: 'syntax' | 'runtime' | 'memory_leak' | 'security_vulnerability' | 'db_connection';
  confidenceScore: number; // 0-100%
  problemDescription: string;
  evidence: string[];
  affectedFiles: string[];
  potentialRootCause: string;
  isConfirmed: boolean;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  repairPlanSteps: string[];
  riskAssessment: string;
  diffPatch: {
    filePath: string;
    beforeCode: string;
    afterCode: string;
    explanation: string;
  }[];
}

export interface NeuralModelConfig {
  vocabSize: number;
  contextLength: number;
  hiddenDim: number;
  numLayers: number;
  numHeads: number;
  arabicTokenizerSupport: boolean;
  weightsVersion: string;
  totalParameters: string;
  trainingEpoch: number;
  currentLoss: number;
  isTraining: boolean;
  checkpointsCount: number;
  benchmarks: {
    arabicUnderstanding: number; // percentage
    codeGenerationQuality: number;
    errorDiagnosisAccuracy: number;
    antiHallucinationScore: number;
    instructionFollowing: number;
  };
}
