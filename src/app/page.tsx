"use client";

import { useState, useEffect, useCallback } from "react";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import {
  CloudSun,
  MessageCircle,
  BarChart3,
  Download,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { Clima } from "@/domain/entities";
import {
  cacheWeatherData,
  getCachedWeather,
} from "@/lib/offline/weather-cache";
import { ChatWidget } from "./components/ChatWidget/ChatWidget";
import { PredictionWidget } from "./components/PredictionWidget/PredictionWidget";
import { MapWidget } from "./components/MapWidget/MapWidget";
import { AuthWidget } from "./components/AuthWidget";
import { AlertBanner } from "./components/AlertBanner";
import { useRegionalAlerts } from "@/lib/hooks/useRegionalAlerts";
import type { Prediccion } from "@/domain/entities";

export default function Home() {
  const isOnline = useOnlineStatus();
  const [clima, setClima] = useState<Clima | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [coordinates, setCoordinates] = useState({
    lat: -11.775,
    lon: -75.497,
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching weather for:', coordinates.lat, coordinates.lon);
    let ignore = false;

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      const lat = coordinates.lat;
      const lon = coordinates.lon;
      const cacheKey = `${lat},${lon}`;

      try {
        if (isOnline) {
          const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
          if (!res.ok) throw new Error("Error al obtener datos");
          const data = await res.json();
          if (!ignore) {
            setClima(data);
            setIsOfflineData(false);
          }
          // Cache for offline use
          await cacheWeatherData(cacheKey, data);
        } else {
          // Try loading from cache
          const cached = (await getCachedWeather(cacheKey)) as Clima | null;
          if (cached && !ignore) {
            setClima(cached);
            setIsOfflineData(true);
          } else if (!ignore) {
            setError("Sin conexión y sin datos cacheados");
          }
        }
      } catch {
        // Try cache as fallback
        if (!ignore) {
          try {
            const cached = (await getCachedWeather(cacheKey)) as Clima | null;
            if (cached) {
              setClima(cached);
              setIsOfflineData(true);
            } else {
              setError("Error de conexión. Sin datos disponibles.");
            }
          } catch {
            setError("Error al acceder a los datos.");
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchWeather();
    return () => {
      ignore = true;
    };
  }, [isOnline, coordinates]);

  const handlePredictionLoad = useCallback((pred: Prediccion) => {
    // Buscar si alguna temperatura de las próximas 24h cae a <= 5°C (Helada/Friaje severo)
    const coldHours = pred.predictions.filter((p) => p.temperature <= 5);
    if (coldHours.length > 0) {
      setAlertMessage(
        `¡Atención! Se pronostica un evento de helada/friaje con temperaturas de hasta ${Math.min(...coldHours.map((c) => c.temperature))}°C en las próximas horas.`,
      );
    }
  }, []);

  const exportCSV = useCallback(() => {
    if (!clima) return;

    const header = isOfflineData
      ? `[DATOS OFFLINE - última actualización: ${clima.updatedAt}]\n`
      : "";

    const rows = clima.hourly.time.map((t, i) =>
      [
        t,
        clima.hourly.temperature[i],
        clima.hourly.humidity[i],
        clima.hourly.windSpeed[i],
        clima.hourly.precipitation[i],
      ].join(","),
    );

    const csv = `${header}Hora,Temperatura (°C),Humedad (%),Viento (km/h),Precipitación (mm)\n${rows.join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deteclima_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [clima, isOfflineData]);

  const { alert: regionalAlert, clearAlert: clearRegionalAlert } = useRegionalAlerts();

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto relative">
      <AlertBanner
        message={alertMessage || regionalAlert}
        onClose={() => {
          setAlertMessage(null);
          clearRegionalAlert();
        }}
      />
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <CloudSun size={36} className="text-[var(--color-accent)]" />
          <h1 className="text-2xl font-bold tracking-tight">Deteclima</h1>
        </div>
        <div className="flex items-center gap-6">
          <AuthWidget />
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            {isOnline ? (
              <>
                <Wifi size={16} className="text-[var(--color-success)]" /> En
                línea
              </>
            ) : (
              <>
                <WifiOff size={16} className="text-[var(--color-warning)]" />{" "}
                Offline
              </>
            )}
          </div>
        </div>
      </header>

      {/* Status badge */}
      {isOfflineData && (
        <div className="glass rounded-lg px-4 py-2 mb-6 text-sm text-[var(--color-warning)] flex items-center gap-2">
          <WifiOff size={14} />
          Mostrando datos cacheados — última actualización:{" "}
          {clima?.updatedAt
            ? new Date(clima.updatedAt).toLocaleString("es-PE")
            : "—"}
        </div>
      )}

      {/* Error message (non-blocking) */}
      {error && (
        <div className="glass border border-rose-500/30 rounded-lg px-4 py-3 mb-6 text-sm text-[var(--color-danger)] flex items-center gap-2">
          <div className="p-1 bg-rose-500/20 rounded-md">⚠️</div>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* MapWidget - ALWAYS VISIBLE */}
        <div className="relative">
          <MapWidget
            lat={coordinates.lat}
            lon={coordinates.lon}
            setCoordinates={(lat, lon) => setCoordinates({ lat, lon })}
          />
          {loading && (
            <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[1px] rounded-xl flex items-center justify-center pointer-events-none">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-accent)] border-t-transparent" />
            </div>
          )}
        </div>

        {/* Weather Content */}
        {clima && (
          <div
            className={`transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                {
                  label: "Temperatura",
                  value: `${clima.current.temperature}°C`,
                  icon: "🌡️",
                  color: "from-orange-500/20 to-rose-500/20",
                },
                {
                  label: "Humedad",
                  value: `${clima.current.humidity}%`,
                  icon: "💧",
                  color: "from-blue-500/20 to-cyan-500/20",
                },
                {
                  label: "Viento",
                  value: `${clima.current.windSpeed} km/h`,
                  icon: "💨",
                  color: "from-slate-500/20 to-blue-500/20",
                },
                {
                  label: "Presión",
                  value: `${clima.current.pressure} hPa`,
                  icon: "⏲️",
                  color: "from-indigo-500/20 to-purple-500/20",
                },
                {
                  label: "Precipitación",
                  value: `${clima.current.precipitation} mm`,
                  icon: "🌧️",
                  color: "from-cyan-500/20 to-blue-500/20",
                },
                {
                  label: "Radiación",
                  value: `${clima.current.radiation} W/m²`,
                  icon: "☀️",
                  color: "from-yellow-500/20 to-orange-500/20",
                },
              ].map((card, i) => (
                <div
                  key={card.label}
                  className={`glass rounded-2xl p-5 border-l-4 border-l-[var(--color-accent)] animate-fade-in bg-gradient-to-br ${card.color}`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-3xl mb-3 drop-shadow-md">{card.icon}</div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-bold mb-1">
                    {card.label}
                  </p>
                  <p className="text-xl font-bold tracking-tight">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap animate-fade-in" style={{ animationDelay: '600ms' }}>
              <button
                onClick={exportCSV}
                className="glass rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-[var(--color-accent)] hover:text-white transition-all cursor-pointer group"
              >
                <Download size={18} className="group-hover:bounce" /> Exportar Reporte CSV
              </button>
              <a
                href="#chat"
                className="glass rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                <MessageCircle size={18} /> Consultar a la IA
              </a>
              <a
                href="#prediction"
                className="glass rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                <BarChart3 size={18} /> Ver Análisis ML
              </a>
            </div>

            {/* AI Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 items-start">
              <ChatWidget weatherContext={clima} />
              <PredictionWidget
                lat={coordinates.lat}
                lon={coordinates.lon}
                onPredictionLoad={handlePredictionLoad}
              />
            </div>
          </div>
        )}

        {loading && !clima && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-accent)] border-t-transparent" />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-secondary)]">
        Deteclima — Colegio San Vicente de Paúl, Jauja |{" "}
        {new Date().getFullYear()}
      </footer>
    </main>
  );
}
