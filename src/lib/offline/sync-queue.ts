import { getDB } from './db';

export async function addToSyncQueue(action: string, payload: unknown): Promise<void> {
  const db = await getDB();
  await db.add('offline-queue', {
    action,
    payload,
    createdAt: Date.now(),
  });
}

export async function getQueuedActions(): Promise<
  Array<{ action: string; payload: unknown; createdAt: number }>
> {
  const db = await getDB();
  return db.getAll('offline-queue');
}

export async function clearSyncQueue(): Promise<void> {
  const db = await getDB();
  await db.clear('offline-queue');
}

export async function processSyncQueue(
  handler: (action: string, payload: unknown) => Promise<void>
): Promise<void> {
  const items = await getQueuedActions();
  for (const item of items) {
    try {
      await handler(item.action, item.payload);
    } catch {
      // If sync fails, keep the item in the queue
      return;
    }
  }
  await clearSyncQueue();
}
