import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Chapter, Authority } from '../types';

interface FhrDBSchema extends DBSchema {
  chapters: {
    key: string; // id
    value: Chapter;
    indexes: {
      'by-sort-order': number;
      'by-slug': string;
    };
  };
  authorities: {
    key: string; // id
    value: Authority;
    indexes: {
      'by-published-date': string;
      'by-slug': string;
    };
  };
  metadata: {
    key: string;
    value: any; // Used to store SyncMeta like 'lastSyncTimestamp'
  };
}

const DB_NAME = 'fhr_offline_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<FhrDBSchema>> | null = null;

export const initDB = (): Promise<IDBPDatabase<FhrDBSchema>> => {
  if (!dbPromise) {
    dbPromise = openDB<FhrDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Chapters Store
        if (!db.objectStoreNames.contains('chapters')) {
          const chapterStore = db.createObjectStore('chapters', { keyPath: 'id' });
          chapterStore.createIndex('by-sort-order', 'sort_order');
          chapterStore.createIndex('by-slug', 'slug', { unique: true });
        }

        // Authorities Store
        if (!db.objectStoreNames.contains('authorities')) {
          const authorityStore = db.createObjectStore('authorities', { keyPath: 'id' });
          authorityStore.createIndex('by-published-date', 'published_at');
          authorityStore.createIndex('by-slug', 'slug', { unique: true });
        }

        // Metadata Store (for SyncMeta)
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata');
        }
      },
    });
  }
  return dbPromise;
};

// Expose helpful utility methods for DB access
export const getDB = () => initDB();
