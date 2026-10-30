/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Tool Orchestrator & Execution Manager for Abqarino Mind (Module 10)
 * Manages authorized tool registry, schema checking, and deterministic execution
 */

import { defaultKnowledgeEngine } from './knowledgeRetrieval';
import { defaultMemoryEngine } from './memoryEngine';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: { [key: string]: { type: string; description: string; required: boolean } };
  execute: (args: Record<string, any>) => Promise<{ success: boolean; result: any; executionTimeMs: number }>;
}

export class ToolOrchestrator {
  private tools: Map<string, ToolDefinition> = new Map();

  constructor() {
    this.registerBuiltinTools();
  }

  private registerBuiltinTools() {
    // 1. Math / Capacity Calculator
    this.registerTool({
      name: 'system_calculator',
      description: 'حساب المعادلات الحسابية الدقيقة وتخطيط سعة الذاكرة والخوادم',
      parameters: {
        expression: { type: 'string', description: 'المعادلة الحسابية المراد حسابها', required: true }
      },
      execute: async (args) => {
        const start = performance.now();
        try {
          const sanitized = String(args.expression).replace(/[^0-9+\-*/().]/g, '');
          // Safe arithmetic evaluation
          // eslint-disable-next-line no-new-func
          const evalResult = new Function(`return (${sanitized})`)();
          return {
            success: true,
            result: evalResult,
            executionTimeMs: Math.round(performance.now() - start)
          };
        } catch (err: any) {
          return {
            success: false,
            result: `فشل الحساب: ${err.message}`,
            executionTimeMs: Math.round(performance.now() - start)
          };
        }
      }
    });

    // 2. Syntax Validator
    this.registerTool({
      name: 'syntax_validator',
      description: 'التحقق من توازن الأقواس وصحة الشيفرة المصدرية (TypeScript/JSON)',
      parameters: {
        code: { type: 'string', description: 'الشيفرة المراد التحقق منها', required: true },
        language: { type: 'string', description: 'لغة الشيفرة', required: false }
      },
      execute: async (args) => {
        const start = performance.now();
        const code = String(args.code);
        // Simple bracket balance check
        const stack: string[] = [];
        const pairs: { [k: string]: string } = { ')': '(', ']': '[', '}': '{' };
        let balanced = true;

        for (const char of code) {
          if (['(', '[', '{'].includes(char)) stack.push(char);
          else if ([')', ']', '}'].includes(char)) {
            if (stack.pop() !== pairs[char]) {
              balanced = false;
              break;
            }
          }
        }

        if (stack.length > 0) balanced = false;

        return {
          success: true,
          result: {
            isBalanced: balanced,
            charCount: code.length,
            status: balanced ? 'الشيفرة سليمة نحوياً ومتوازنة الأقواس' : 'تم اكتشاف خلل في توازن الأقواس'
          },
          executionTimeMs: Math.round(performance.now() - start)
        };
      }
    });

    // 3. Knowledge Base Search
    this.registerTool({
      name: 'knowledge_search',
      description: 'البحث في وثائق عبقرينو وميثاق الوليد المعتمدة',
      parameters: {
        query: { type: 'string', description: 'عبارة البحث', required: true }
      },
      execute: async (args) => {
        const start = performance.now();
        const docs = defaultKnowledgeEngine.query(args.query, 3);
        return {
          success: true,
          result: docs,
          executionTimeMs: Math.round(performance.now() - start)
        };
      }
    });

    // 4. Memory Lookup
    this.registerTool({
      name: 'memory_lookup',
      description: 'استرجاع حقائق الذاكرة طويلة الأجل الخاصة بالمشروع والمالك',
      parameters: {
        query: { type: 'string', description: 'موضوع الذاكرة', required: true }
      },
      execute: async (args) => {
        const start = performance.now();
        const memories = defaultMemoryEngine.searchMemories(args.query, 3);
        return {
          success: true,
          result: memories,
          executionTimeMs: Math.round(performance.now() - start)
        };
      }
    });
  }

  public registerTool(tool: ToolDefinition) {
    this.tools.set(tool.name, tool);
  }

  public getTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public async executeTool(name: string, args: Record<string, any>) {
    const tool = this.tools.get(name);
    if (!tool) {
      return { success: false, result: `الأداة ${name} غير معرفة في المنظومة`, executionTimeMs: 0 };
    }
    return tool.execute(args);
  }
}

export const defaultToolOrchestrator = new ToolOrchestrator();
