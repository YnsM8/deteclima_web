'use client';

import { useState, useEffect } from 'react';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, AlertCircle, WifiOff } from 'lucide-react';
import type { Prediccion } from '@/domain/entities';
import { cachePredictionData, getCachedPrediction } from '@/lib/offline/prediction-cache';

interface Props {
  lat: number;
  lon: number;
}

export function PredictionWidget({ lat, lon }: Props) {
  const isOnline = useOnlineStatus();
  const [data, setData] = useState<Prediccion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);

  useEffect(() => {
    async function fetchPrediction() {
      setLoading(true);
      setError(null);
      const cacheKey = `${lat},${lon}`;
      
      try {
        if (!isOnline) throw new Error('Offline');
        const res = await fetch('/api/prediction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude: lat, longitude: lon }),
        });
        if (!res.ok) throw new Error('No se pudo generar la predicción automática');
        const json = await res.json();
        setData(json);
        setIsOfflineData(false);
        await cachePredictionData(cacheKey, json);
      } catch (err) {
        // Fallback to cache
        try {
          const cached = (await getCachedPrediction(cacheKey)) as Prediccion | null;
          if (cached) {
            setData(cached);
            setIsOfflineData(true);
          } else {
            setError(err instanceof Error && err.message !== 'Offline' ? err.message : 'Modo offline y sin predicciones previas guardadas.');
          }
        } catch {
          setError('Error de lectura local.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPrediction();
  }, [lat, lon, isOnline]);

  // Format data for Recharts (extract hour properly)
  const chartData = data?.predictions.map((p) => {
    const d = new Date(p.time);
    return {
      time: p.time,
      hour: d.getHours() + ':00',
      temperature: p.temperature,
      confidence: p.confidence,
    };
  }) || [];

  return (
    <div id="prediction" className="glass rounded-xl p-6 mt-8 scroll-mt-24 w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-lg">
          <BarChart3 size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Predicción de Temperatura (24h)</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">IA de Machine Learning entrenada con el histórico zonal</p>
        </div>
      </div>

      {loading && (
        <div className="h-64 flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-accent)] border-t-transparent mb-4" />
          <p>Ejecutando modelo predictivo...</p>
        </div>
      )}

      {error && !loading && (
        <div className="h-64 flex items-center justify-center text-[var(--color-danger)] font-medium gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {!loading && !error && chartData.length > 0 && (
        <>
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="hour" stroke="#ffffff50" fontSize={12} tickMargin={10} />
                <YAxis stroke="#ffffff50" fontSize={12} tickMargin={10} unit="°" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#8b9bb4', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  name="Temp °C" 
                  stroke="var(--color-accent)" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {data?.metrics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 border-t border-[var(--color-border)] pt-4">
              <div className="p-3 bg-white/5 rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">Confianza (R²)</p>
                <p className="font-semibold">{(data.metrics.r2 * 100).toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">Margen Error Absoluto (MAE)</p>
                <p className="font-semibold text-rose-300">± {data.metrics.mae.toFixed(2)} °C</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">RMSE</p>
                <p className="font-semibold text-rose-300">{data.metrics.rmse.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">Modelo v.</p>
                <p className="font-semibold opacity-70">Random Forest {data.modelVersion}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
