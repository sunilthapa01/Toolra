/**
 * Toolora IndexedDB Persistence Layer
 * Native browser storage wrapper for high-capacity offline draft and history persistence.
 */

const DB_NAME = 'toolora_db';
const DB_VERSION = 1;

export interface DraftItem {
  key: string;
  content: string;
  updated_at: number;
}

export interface HistoryItem {
  id: string;
  toolSlug: string;
  snippet: string;
  created_at: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('drafts')) {
        db.createObjectStore('drafts', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('history')) {
        const historyStore = db.createObjectStore('history', { keyPath: 'id' });
        historyStore.createIndex('toolSlug', 'toolSlug', { unique: false });
        historyStore.createIndex('created_at', 'created_at', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getDraft(toolSlug: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('drafts', 'readonly');
      const store = tx.objectStore('drafts');
      const request = store.get(toolSlug);

      request.onsuccess = () => {
        const result = request.result as DraftItem | undefined;
        resolve(result ? result.content : null);
      };
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('[Toolora DB] Failed to retrieve draft:', err);
    return null;
  }
}

export async function saveDraft(toolSlug: string, content: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('drafts', 'readwrite');
      const store = tx.objectStore('drafts');
      const item: DraftItem = {
        key: toolSlug,
        content,
        updated_at: Date.now(),
      };
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[Toolora DB] Failed to save draft:', err);
  }
}

export async function clearDraft(toolSlug: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('drafts', 'readwrite');
      const store = tx.objectStore('drafts');
      const request = store.delete(toolSlug);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('[Toolora DB] Failed to clear draft:', err);
  }
}

export async function saveHistory(toolSlug: string, snippet: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('history', 'readwrite');
      const store = tx.objectStore('history');
      const item: HistoryItem = {
        id: `${toolSlug}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        toolSlug,
        snippet,
        created_at: Date.now(),
      };
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[Toolora DB] Failed to save history:', err);
  }
}

export async function getHistory(toolSlug: string, limit = 10): Promise<HistoryItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('history', 'readonly');
      const store = tx.objectStore('history');
      const index = store.index('toolSlug');
      const request = index.getAll(toolSlug);

      request.onsuccess = () => {
        const items = (request.result as HistoryItem[]) || [];
        items.sort((a, b) => b.created_at - a.created_at);
        resolve(items.slice(0, limit));
      };
      request.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('[Toolora DB] Failed to fetch history:', err);
    return [];
  }
}
