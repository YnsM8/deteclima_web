'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { PredictionWidget } from '@/presentation/components/PredictionWidget/PredictionWidget';
import { Loader2, BarChart3, MapPin } from 'lucide-react';

function PredictionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  // Authentication Guard
  useEffect(() => {
    if (!authLoading && !user) {
      const currentLat = searchParams.get('lat');
      const currentLon = searchParams.get('lon');
      const query = currentLat && currentLon ? `&lat=${currentLat}&lon=${currentLon}` : '';
      router.push(`/auth?redirect=/prediction${query}`);
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
      console.error('Error reading coords in Prediction page:', e);
    }

    setCoordinates(defaultCoords);
  }, [authLoading, user, searchParams]);

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
          <div className="p-2.5 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-xl">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Análisis ML y Predicciones</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">Algoritmos de Machine Learning entrenados para detección y prevención de heladas.</p>
          </div>
        </div>

        {coordinates && (
          <div className="flex items-center gap-2 glass rounded-full px-3.5 py-1.5 border border-white/5 text-[11px] text-[var(--color-text-secondary)] bg-white/[0.01]">
            <MapPin size={12} className="text-[var(--color-accent)]" />
            <span>Coordenadas de análisis:</span>
            <span className="font-mono text-white/90">
              {coordinates.lat.toFixed(3)}, {coordinates.lon.toFixed(3)}
            </span>
          </div>
        )}
      </div>

      {coordinates ? (
        <div className="animate-fade-in">
          {/* Prediction Widget */}
          <PredictionWidget lat={coordinates.lat} lon={coordinates.lon} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 glass rounded-xl border border-[var(--color-border)]">
          <Loader2 size={24} className="animate-spin text-[var(--color-accent)]" />
          <p className="text-xs text-[var(--color-text-secondary)]">Inicializando coordenadas...</p>
        </div>
      )}
    </div>
  );
}

export default function PredictionPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 size={32} className="animate-spin text-[var(--color-accent)]" />
        <p className="text-xs text-[var(--color-text-secondary)]">Cargando aplicación...</p>
      </div>
    }>
      <PredictionPageContent />
    </Suspense>
  );
}
