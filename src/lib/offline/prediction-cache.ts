import { getDB } from './db';

export async function cachePredictionData(
  key: string,
  predictions: unknown
): Promise<void> {
  const db = await getDB();
  await db.put('predictions-cache', {
    key,
    predictions,
    timestamp: Date.now(),
  });
}

export async function getCachedPrediction(
  key: string
): Promise<unknown | null> {
  const db = await getDB();
  const entry = await db.get('predictions-cache', key);
  
  if (!entry) return null;
  return entry.predictions;
}
