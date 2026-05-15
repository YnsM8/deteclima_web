import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'deteclima-offline';
const DB_VERSION = 1;

export interface DeteclimaDB {
  'weather-cache': {
    key: string;
    value: {
      key: string;
      data: unknown;
      timestamp: number;
    };
  };
  'chat-history': {
    key: string;
    value: {
      sessionId: string;
      messages: Array<{ role: string; content: string }>;
      timestamp: number;
    };
  };
  'predictions-cache': {
    key: string;
    value: {
      key: string;
      predictions: unknown;
      timestamp: number;
    };
  };
  'user-preferences': {
    key: string;
    value: {
      key: string;
      value: unknown;
    };
  };
  'offline-queue': {
    key: number;
    value: {
      action: string;
      payload: unknown;
      createdAt: number;
    };
    indexes: { 'by-action': string };
  };
}

let dbPromise: Promise<IDBPDatabase<DeteclimaDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<DeteclimaDB>> {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is only available in the browser');
  }

  if (!dbPromise) {
    dbPromise = openDB<DeteclimaDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('weather-cache')) {
          db.createObjectStore('weather-cache', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('chat-history')) {
          db.createObjectStore('chat-history', { keyPath: 'sessionId' });
        }
        if (!db.objectStoreNames.contains('predictions-cache')) {
          db.createObjectStore('predictions-cache', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('user-preferences')) {
          db.createObjectStore('user-preferences', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('offline-queue')) {
          const store = db.createObjectStore('offline-queue', { autoIncrement: true });
          store.createIndex('by-action', 'action');
        }
      },
    });
  }

  return dbPromise;
}
