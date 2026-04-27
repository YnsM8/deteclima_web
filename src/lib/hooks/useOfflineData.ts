'use client';

import { useState, useEffect } from 'react';
import { getCachedWeather, isWeatherCacheStale } from '@/lib/offline/weather-cache';
import type { Clima } from '@/domain/entities';

interface OfflineDataState {
  data: Clima | null;
  isStale: boolean;
  isLoading: boolean;
}

export function useOfflineData(cacheKey: string): OfflineDataState {
  const [state, setState] = useState<OfflineDataState>({
    data: null,
    isStale: false,
    isLoading: true,
  });

  useEffect(() => {
    async function loadCached() {
      try {
        const data = (await getCachedWeather(cacheKey)) as Clima | null;
        const stale = await isWeatherCacheStale(cacheKey);
        setState({ data, isStale: stale, isLoading: false });
      } catch {
        setState({ data: null, isStale: true, isLoading: false });
      }
    }

    loadCached();
  }, [cacheKey]);

  return state;
}
