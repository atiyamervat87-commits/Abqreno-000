/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Memory Engine for Abqarino Mind (Module 5)
 * Short-term working context & long-term episodic memory with privacy controls
 */

export interface MemoryEntry {
  id: string;
  type: 'short_term' | 'long_term';
  category: 'preference' | 'technical_fact' | 'project_state' | 'charter_guideline';
  content: string;
  importance: number; // 0.0 - 1.0
  isEncrypted: boolean;
  createdAt: string;
  lastAccessedAt: string;
}

const STORAGE_KEY_MEMORIES = 'abqarino_episodic_memories_v2';

export class MemoryEngine {
  private memories: MemoryEntry[] = [];
  private shortTermHistory: { role: 'user' | 'assistant' | 'system'; text: string; timestamp: string }[] = [];

  constructor() {
    this.loadPersistedMemories();
  }

  private loadPersistedMemories() {
    const defaultMemories: MemoryEntry[] = [
      {
        id: 'mem-001',
        type: 'long_term',
        category: 'charter_guideline',
        content: 'الالتزام الصارم بميثاق الوليد في عدم تزييف أي حقيقة والاعتراف الفوري بنقص البيانات.',
        importance: 1.0,
        isEncrypted: true,
        createdAt: '2026-10-25 10:00',
        lastAccessedAt: '2026-10-30 09:00'
      },
      {
        id: 'mem-002',
        type: 'long_term',
        category: 'technical_fact',
        content: 'منصة عبقرينو تستخدم React 19، Tailwind CSS، معمارية العقل العصبي ثنائي اللغة، ومحفظة التنسيق 01153747612.',
        importance: 0.95,
        isEncrypted: false,
        createdAt: '2026-10-26 12:00',
        lastAccessedAt: '2026-10-30 09:15'
      },
      {
        id: 'mem-003',
        type: 'long_term',
        category: 'preference',
        content: 'الجهة المالكة المعتمدة للمشروع: المستشار عطيه الهلباوي، المنصة الإدارية: مالك.',
        importance: 1.0,
        isEncrypted: true,
        createdAt: '2026-10-27 15:30',
        lastAccessedAt: '2026-10-30 09:20'
      }
    ];

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY_MEMORIES);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.memories = parsed;
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Memory storage not available', e);
    }

    this.memories = defaultMemories;
  }

  private persist() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_MEMORIES, JSON.stringify(this.memories));
      }
    } catch (e) {
      console.warn('Failed to persist memories', e);
    }
  }

  // --- Short-term working context methods ---
  public pushContext(role: 'user' | 'assistant' | 'system', text: string) {
    this.shortTermHistory.push({
      role,
      text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    });
    // Keep max 20 working context turns
    if (this.shortTermHistory.length > 20) {
      this.shortTermHistory.shift();
    }
  }

  public getContext(): { role: 'user' | 'assistant' | 'system'; text: string; timestamp: string }[] {
    return [...this.shortTermHistory];
  }

  public clearContext() {
    this.shortTermHistory = [];
  }

  // --- Long-term episodic memory methods ---
  public addMemory(content: string, category: MemoryEntry['category'], importance: number = 0.8, isEncrypted = true): MemoryEntry {
    const entry: MemoryEntry = {
      id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'long_term',
      category,
      content,
      importance,
      isEncrypted,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      lastAccessedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    this.memories.push(entry);
    this.persist();
    return entry;
  }

  public searchMemories(query: string, maxResults: number = 3): MemoryEntry[] {
    const q = query.toLowerCase();
    const scored = this.memories.map((m) => {
      let score = m.importance * 0.4;
      const lower = m.content.toLowerCase();
      if (lower.includes(q)) score += 0.6;
      else {
        // partial word match
        const words = q.split(/\s+/).filter((w) => w.length > 2);
        for (const w of words) {
          if (lower.includes(w)) score += 0.2;
        }
      }
      return { entry: m, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored
      .filter((s) => s.score > 0.3)
      .slice(0, maxResults)
      .map((s) => {
        s.entry.lastAccessedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
        return s.entry;
      });
  }

  public getAllMemories(): MemoryEntry[] {
    return [...this.memories];
  }

  public deleteMemory(id: string): boolean {
    const initial = this.memories.length;
    this.memories = this.memories.filter((m) => m.id !== id);
    if (this.memories.length !== initial) {
      this.persist();
      return true;
    }
    return false;
  }

  public wipeAllLongTermMemories(): void {
    this.memories = [];
    this.persist();
  }
}

export const defaultMemoryEngine = new MemoryEngine();
