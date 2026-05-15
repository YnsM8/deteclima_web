import { getDB } from './db';

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function cacheWeatherData(key: string, data: unknown): Promise<void> {
  const db = await getDB();
  await db.put('weather-cache', {
    key,
    data,
    timestamp: Date.now(),
  });
}

export async function getCachedWeather(key: string): Promise<unknown | null> {
  const db = await getDB();
  const entry = await db.get('weather-cache', key);

  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    return entry.data; // Return stale data with flag
  }

  return entry.data;
}

export async function isWeatherCacheStale(key: string): Promise<boolean> {
  const db = await getDB();
  const entry = await db.get('weather-cache', key);
  if (!entry) return true;
  return Date.now() - entry.timestamp > CACHE_TTL_MS;
}
