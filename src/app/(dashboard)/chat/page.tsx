'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useOnlineStatus } from '@/presentation/hooks/useOnlineStatus';
import { ChatWidget } from '@/presentation/components/ChatWidget/ChatWidget';
import { getCachedWeather } from '@/infrastructure/adapters/out/cache/weather-cache';
import type { Clima } from '@/domain/entities';
import { Loader2, MessageCircle, MapPin, AlertCircle } from 'lucide-react';

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const isOnline = useOnlineStatus();

  const [clima, setClima] = useState<Clima | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  // Authentication Guard
  useEffect(() => {
    if (!authLoading && !user) {
      const currentLat = searchParams.get('lat');
      const currentLon = searchParams.get('lon');
      const query = currentLat && currentLon ? `&lat=${currentLat}&lon=${currentLon}` : '';
      router.push(`/auth?redirect=/chat${query}`);
    }
  }, [user, authLoading, router, searchParams]);

  // Determine coordinates from URL or fallback
  useEffect(() => {
    if (authLoading || !user) return;

    const defaultCoords = { lat: -11.775, lon: -75.497 };
    const urlLat = searchParams.get('lat');
    const urlLon = searchParams.get('lon');

    if (urlLat && urlLon) {
      const parsedLat = parseFloat(urlLat);
      const parsedLon = parseFloat(urlLon);
      if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
        setCoordinates({ lat: parsedLat, lon: parsedLon });
        return;
      }
    }

    // LocalStorage fallback
    try {
      const saved = localStorage.getItem('deteclima_last_coords');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lon === 'number') {
          setCoordinates(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Error reading coords in Chat page:', e);
    }

    setCoordinates(defaultCoords);
  }, [authLoading, user, searchParams]);

  // Fetch weather context for Chat LLM
  useEffect(() => {
    if (!coordinates) return;

    let ignore = false;
    async function fetchWeather() {
      setWeatherLoading(true);
      const cacheKey = `${coordinates!.lat},${coordinates!.lon}`;
      try {
        if (isOnline) {
          const res = await fetch(`/api/weather?lat=${coordinates!.lat}&lon=${coordinates!.lon}`);
          if (res.ok) {
            const data = await res.json();
            if (!ignore) setClima(data);
          }
        } else {
          const cached = await getCachedWeather(cacheKey) as Clima | null;
          if (cached && !ignore) setClima(cached);
        }
      } catch (err) {
        console.error('Error fetching weather context in Chat:', err);
      } finally {
        if (!ignore) setWeatherLoading(false);
      }
    }

    fetchWeather();
    return () => { ignore = true; };
  }, [coordinates, isOnline]);

  if (authLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 size={32} className="animate-spin text-[var(--color-accent)]" />
        <p className="text-xs text-[var(--color-text-secondary)] font-medium">Verificando credenciales...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[var(--color-border)] pb-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <MessageCircle size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Asistente Climático IA</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">Consulta predicciones, heladas y recomendaciones agrícolas.</p>
          </div>
        </div>

        {coordinates && (
          <div className="flex items-center gap-2 glass rounded-full px-3.5 py-1.5 border border-white/5 text-[11px] text-[var(--color-text-secondary)] bg-white/[0.01]">
            <MapPin size={12} className="text-[var(--color-accent)]" />
            <span>Coordenadas de consulta:</span>
            <span className="font-mono text-white/90">
              {coordinates.lat.toFixed(3)}, {coordinates.lon.toFixed(3)}
            </span>
          </div>
        )}
      </div>

      {weatherLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 glass rounded-xl border border-[var(--color-border)]">
          <Loader2 size={24} className="animate-spin text-[var(--color-accent)]" />
          <p className="text-xs text-[var(--color-text-secondary)]">Cargando contexto climático de la zona...</p>
        </div>
      ) : (
        <div className="animate-fade-in">
          {!clima && (
            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 p-3.5 rounded-xl text-xs text-yellow-300 flex items-start gap-2.5">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>
                No se pudo cargar el contexto climático en tiempo real. La IA funcionará con conocimiento base general sobre heladas y friajes.
              </span>
            </div>
          )}
          {/* Renders ChatWidget passing the weather context */}
          <ChatWidget weatherContext={clima} />
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 size={32} className="animate-spin text-[var(--color-accent)]" />
        <p className="text-xs text-[var(--color-text-secondary)]">Cargando aplicación...</p>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
