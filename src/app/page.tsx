'use client';

import { useState, useEffect } from 'react';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';
import { CloudSun, MessageCircle, BarChart3, Download, Wifi, WifiOff } from 'lucide-react';
import type { Clima } from '@/domain/entities';
import { cacheWeatherData, getCachedWeather } from '@/lib/offline/weather-cache';
import { ChatWidget } from './components/ChatWidget/ChatWidget';
import { PredictionWidget } from './components/PredictionWidget/PredictionWidget';
import { MapWidget } from './components/MapWidget/MapWidget';

export default function Home() {
  const isOnline = useOnlineStatus();
  const [clima, setClima] = useState<Clima | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: -11.775, lon: -75.497 });

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      setError(null);

      const lat = coordinates.lat;
      const lon = coordinates.lon;
      const cacheKey = `${lat},${lon}`;

      try {
        if (isOnline) {
          const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
          if (!res.ok) throw new Error('Error al obtener datos');
          const data = await res.json();
          setClima(data);
          setIsOfflineData(false);
          // Cache for offline use
          await cacheWeatherData(cacheKey, data);
        } else {
          // Try loading from cache
          const cached = (await getCachedWeather(cacheKey)) as Clima | null;
          if (cached) {
            setClima(cached);
            setIsOfflineData(true);
          } else {
            setError('Sin conexión y sin datos cacheados');
          }
        }
      } catch {
        // Try cache as fallback
        try {
          const cached = (await getCachedWeather(cacheKey)) as Clima | null;
          if (cached) {
            setClima(cached);
            setIsOfflineData(true);
          } else {
            setError('Error de conexión. Sin datos disponibles.');
          }
        } catch {
          setError('Error al acceder a los datos.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [isOnline, coordinates]);

  function exportCSV() {
    if (!clima) return;

    const header = isOfflineData
      ? `[DATOS OFFLINE - última actualización: ${clima.updatedAt}]\n`
      : '';

    const rows = clima.hourly.time.map((t, i) =>
      [t, clima.hourly.temperature[i], clima.hourly.humidity[i], clima.hourly.windSpeed[i], clima.hourly.precipitation[i]].join(',')
    );

    const csv = `${header}Hora,Temperatura (°C),Humedad (%),Viento (km/h),Precipitación (mm)\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deteclima_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <CloudSun size={36} className="text-[var(--color-accent)]" />
          <h1 className="text-2xl font-bold tracking-tight">Deteclima</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          {isOnline ? (
            <><Wifi size={16} className="text-[var(--color-success)]" /> En línea</>
          ) : (
            <><WifiOff size={16} className="text-[var(--color-warning)]" /> Offline</>
          )}
        </div>
      </header>

      {/* Status badge */}
      {isOfflineData && (
        <div className="glass rounded-lg px-4 py-2 mb-6 text-sm text-[var(--color-warning)] flex items-center gap-2">
          <WifiOff size={14} />
          Mostrando datos cacheados — última actualización: {clima?.updatedAt ? new Date(clima.updatedAt).toLocaleString('es-PE') : '—'}
        </div>
      )}

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-accent)] border-t-transparent" />
        </div>
      )}
      {error && (
        <div className="glass rounded-lg px-4 py-3 mb-6 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      {/* Weather Cards */}
      {clima && !loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Temperatura', value: `${clima.current.temperature}°C`, icon: '🌡️' },
              { label: 'Humedad', value: `${clima.current.humidity}%`, icon: '💧' },
              { label: 'Viento', value: `${clima.current.windSpeed} km/h`, icon: '💨' },
              { label: 'Presión', value: `${clima.current.pressure} hPa`, icon: '🔵' },
              { label: 'Precipitación', value: `${clima.current.precipitation} mm`, icon: '🌧️' },
              { label: 'Radiación', value: `${clima.current.radiation} W/m²`, icon: '☀️' },
            ].map((card) => (
              <div key={card.label} className="glass rounded-xl p-4 hover:border-[var(--color-accent)]/30 transition-colors">
                <div className="text-2xl mb-2">{card.icon}</div>
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">{card.label}</p>
                <p className="text-lg font-semibold">{card.value}</p>
              </div>
            ))}
          </div>
          
          {/* MapWidget */}
          <div className="mb-8">
            <MapWidget lat={coordinates.lat} lon={coordinates.lon} setCoordinates={(lat, lon) => setCoordinates({ lat, lon })} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={exportCSV}
              className="glass rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Download size={16} /> Exportar CSV
            </button>
            <a
              href="#chat"
              className="glass rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              <MessageCircle size={16} /> Chatbot IA
            </a>
            <a
              href="#prediction"
              className="glass rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              <BarChart3 size={16} /> Predicción 24h
            </a>
          </div>
          
          {/* AI Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 items-start">
            <ChatWidget weatherContext={clima} />
            <PredictionWidget lat={coordinates.lat} lon={coordinates.lon} />
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-secondary)]">
        Deteclima — Colegio San Vicente de Paúl, Jauja | {new Date().getFullYear()}
      </footer>
    </main>
  );
}
