"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOnlineStatus } from "@/presentation/hooks/useOnlineStatus";
import {
  CloudSun,
  MessageCircle,
  BarChart3,
  Download,
  Wifi,
  WifiOff,
  Sparkles,
  X,
  MapPin,
  AlertTriangle,
  Share2,
} from "lucide-react";
import type { Clima } from "@/domain/entities";
import {
  cacheWeatherData,
  getCachedWeather,
} from "@/infrastructure/adapters/out/cache/weather-cache";
import { MapWidget } from "@/presentation/components/MapWidget/MapWidget";
import { AuthWidget } from "@/presentation/components/AuthWidget";
import { AlertBanner } from "@/presentation/components/AlertBanner";
import { useRegionalAlerts } from "@/presentation/hooks/useRegionalAlerts";


function ExplorerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnline = useOnlineStatus();
  
  const [clima, setClima] = useState<Clima | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const risk = useMemo(() => {
    const temp = clima?.current?.temperature ?? 10;
    let level = "Bajo";
    let bg = "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300";
    let dot = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
    let text = "Condiciones térmicas seguras. Sin alerta de helada en este momento.";

    if (temp <= 0) {
      level = "Crítico (Helada)";
      bg = "bg-rose-950/40 border border-rose-500/30 text-rose-300";
      dot = "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse";
      text = "Alerta de helada activa: temperaturas bajo cero detectadas. Proteja cultivos y animales.";
    } else if (temp <= 5) {
      level = "Alto";
      bg = "bg-red-500/10 border border-red-500/20 text-red-300";
      dot = "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)] animate-pulse";
      text = "Riesgo alto de heladas. Tome medidas preventivas para agricultura e hidrátese abrigado.";
    } else if (temp <= 10) {
      level = "Medio";
      bg = "bg-amber-500/10 border border-amber-500/20 text-amber-300";
      dot = "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]";
      text = "Riesgo moderado. Caída de temperatura nocturna esperada. Precaución.";
    }
    return { level, bg, dot, text };
  }, [clima]);

  // Warm up the ML microservice on dashboard load
  useEffect(() => {
    if (isOnline) {
      fetch("/api/prediction").catch((err) =>
        console.warn("Prediction warmup request failed:", err)
      );
    }
  }, [isOnline]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasOnboarded = localStorage.getItem("deteclima_onboarded");
      if (!hasOnboarded) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const closeOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("deteclima_onboarded", "true");
    }
    setShowOnboarding(false);
  };


  // Initialize coordinates from URL -> localStorage -> default Jauja
  const [coordinates, setCoordinatesState] = useState(() => {
    const defaultCoords = { lat: -11.775, lon: -75.497 };
    
    // Read from search params if present
    const urlLat = searchParams.get("lat");
    const urlLon = searchParams.get("lon");
    if (urlLat && urlLon) {
      const parsedLat = parseFloat(urlLat);
      const parsedLon = parseFloat(urlLon);
      if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
        return { lat: parsedLat, lon: parsedLon };
      }
    }

    // Fallback to localStorage
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("deteclima_last_coords");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.lat === "number" && typeof parsed.lon === "number") {
            return parsed;
          }
        }
      } catch (e) {
        console.error("Error reading coordinates from localStorage:", e);
      }
    }

    return defaultCoords;
  });

  // Keep search params in sync with coordinates state
  const setCoordinates = useCallback((lat: number, lon: number) => {
    setCoordinatesState({ lat, lon });
    
    // Save to localStorage
    try {
      localStorage.setItem("deteclima_last_coords", JSON.stringify({ lat, lon }));
    } catch (e) {
      console.error("Error writing coordinates to localStorage:", e);
    }

    // Update URL query parameters
    const params = new URLSearchParams(searchParams.toString());
    params.set("lat", lat.toFixed(4));
    params.set("lon", lon.toFixed(4));
    router.push(`/explorer?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    console.log("Fetching weather for:", coordinates.lat, coordinates.lon);
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

  const handleShare = useCallback(async () => {
    if (!clima) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Deteclima - Informe Climático Escolar",
          text: `Informe del clima en lat: ${coordinates.lat.toFixed(4)}, lon: ${coordinates.lon.toFixed(4)}. Temp: ${clima.current.temperature}°C, Humedad: ${clima.current.humidity}%.`,
          url: window.location.href,
        });
      } catch (err) {
        console.warn("Share failed:", err);
      }
    } else {
      // Fallback
      if (typeof window !== "undefined") {
        navigator.clipboard.writeText(window.location.href);
        alert("Enlace de informe climático copiado al portapapeles.");
      }
    }
  }, [clima, coordinates]);

  const handlePrintPDF = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  const { alert: regionalAlert, clearAlert: clearRegionalAlert } = useRegionalAlerts();


  // Create query string to propagate lat/lon to other pages
  const queryStr = `?lat=${coordinates.lat.toFixed(4)}&lon=${coordinates.lon.toFixed(4)}`;

  return (
    <div className="max-w-6xl mx-auto relative">
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
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Explorador Climático</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">Monitoreo meteorológico en tiempo real y alertas de heladas.</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => { setOnboardingStep(0); setShowOnboarding(true); }}
            className="no-print text-xs font-bold px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg flex items-center gap-1.5 hover:bg-white/10 transition-all cursor-pointer text-white"
          >
            <Sparkles size={14} className="text-[var(--color-accent)]" /> Guía de Inicio
          </button>
          <AuthWidget />
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            {isOnline ? (
              <>
                <Wifi size={16} className="text-[var(--color-success)]" /> En línea
              </>
            ) : (
              <>
                <WifiOff size={16} className="text-[var(--color-warning)]" /> Offline
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
            setCoordinates={setCoordinates}
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
            {/* Semáforo de Riesgo Térmico */}
            <div className={`glass rounded-2xl p-5 border-l-4 border-l-sky-500 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${risk.bg}`}>
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${risk.dot}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${risk.dot.split(" ")[0]}`}></span>
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight uppercase">Riesgo Térmico: <span className="underline">{risk.level}</span></h3>
                  <p className="text-xs opacity-90 mt-0.5 font-medium">{risk.text}</p>
                </div>
              </div>
              <div className="text-xs font-semibold px-3 py-1 bg-white/5 rounded-full border border-white/10 w-fit shrink-0">
                Límite de Helada: ≤ 0°C
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                {
                  label: "Temperatura",
                  value: `${clima.current.temperature}°C`,
                  icon: "🌡️",
                  color: "from-orange-500/20 to-rose-500/20",
                  description: "Calor del aire. Clave para detectar heladas.",
                },
                {
                  label: "Humedad",
                  value: `${clima.current.humidity}%`,
                  icon: "💧",
                  color: "from-blue-500/20 to-cyan-500/20",
                  description: "Vapor de agua. Influye en la helada.",
                },
                {
                  label: "Viento",
                  value: `${clima.current.windSpeed} km/h`,
                  icon: "💨",
                  color: "from-slate-500/20 to-blue-500/20",
                  description: "Velocidad del aire y sensación de frío.",
                },
                {
                  label: "Presión",
                  value: `${clima.current.pressure} hPa`,
                  icon: "⏲️",
                  color: "from-indigo-500/20 to-purple-500/20",
                  description: "Fuerza del aire. Indica cambios de tiempo.",
                },
                {
                  label: "Precipitación",
                  value: `${clima.current.precipitation} mm`,
                  icon: "🌧️",
                  color: "from-cyan-500/20 to-blue-500/20",
                  description: "Lluvia o granizo. Vital para siembras.",
                },
                {
                  label: "Radiación",
                  value: `${clima.current.radiation} W/m²`,
                  icon: "☀️",
                  color: "from-yellow-500/20 to-orange-500/20",
                  description: "Intensidad solar y tasa de evaporación.",
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
                  <p className="text-[9px] leading-tight text-[var(--color-text-secondary)] opacity-85 mt-2 border-t border-white/5 pt-1.5 font-medium">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap animate-fade-in no-print" style={{ animationDelay: '600ms' }}>
              <button
                onClick={exportCSV}
                className="glass rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-[var(--color-accent)] hover:text-white transition-all cursor-pointer group text-white"
              >
                <Download size={18} className="group-hover:bounce" /> Exportar CSV
              </button>

              <button
                onClick={handlePrintPDF}
                className="glass rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-[var(--color-accent)] hover:text-white transition-all cursor-pointer group text-white"
              >
                <Download size={18} /> Descargar PDF (Escolar)
              </button>

              <button
                onClick={handleShare}
                className="glass rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-[var(--color-accent)] hover:text-white transition-all cursor-pointer group text-white"
              >
                <Share2 size={18} /> Compartir Reporte
              </button>
              
              <a
                href={`/chat${queryStr}`}
                className="glass rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-[var(--color-accent)]"
              >
                <MessageCircle size={18} /> Consultar a la IA
              </a>
              
              <a
                href={`/prediction${queryStr}`}
                className="glass rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-[var(--color-accent)]"
              >
                <BarChart3 size={18} /> Ver Análisis ML
              </a>
            </div>
          </div>
        )}

        {showOnboarding && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 onboarding-modal">
            <div className="bg-[#111827] border border-[var(--color-accent)]/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fade-in text-white">
              <button 
                onClick={closeOnboarding}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-[var(--color-accent)]" size={24} />
                <h2 className="text-xl font-bold">¡Bienvenido a Deteclima!</h2>
              </div>
              
              <div className="space-y-4 my-6">
                {onboardingStep === 0 && (
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center mb-3">
                      <MapPin className="text-[var(--color-accent)]" size={24} />
                    </div>
                    <h3 className="font-bold text-base text-white">1. Mapa de Ubicación</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                      Haz clic en cualquier punto del mapa interactivo de Jauja y los Andes centrales para seleccionar la zona que deseas analizar. Las coordenadas se guardarán automáticamente.
                    </p>
                  </div>
                )}
                {onboardingStep === 1 && (
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                      <AlertTriangle className="text-amber-400" size={24} />
                    </div>
                    <h3 className="font-bold text-base text-white">2. Semáforo de Riesgo Térmico</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                      Visualiza de inmediato el nivel de alerta térmica (Bajo, Medio, Alto, Crítico) mediante el semáforo interactivo del panel. Te notificará sobre el riesgo inminente de heladas agrícolas.
                    </p>
                  </div>
                )}
                {onboardingStep === 2 && (
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                      <MessageCircle className="text-emerald-400" size={24} />
                    </div>
                    <h3 className="font-bold text-base text-white">3. IA y Predicción con ML</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                      Consulta predicciones climáticas basadas en Inteligencia Artificial y chatea con nuestro chatbot especializado para recibir consejos prácticos y lecciones educativas sobre el clima local.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-6 border-t border-[var(--color-border)] pt-4">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((s) => (
                    <span 
                      key={s} 
                      className={`h-2 w-2 rounded-full transition-all ${s === onboardingStep ? 'bg-[var(--color-accent)] w-4' : 'bg-white/10'}`} 
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  {onboardingStep > 0 && (
                    <button 
                      onClick={() => setOnboardingStep(onboardingStep - 1)}
                      className="px-4 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                    >
                      Atrás
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (onboardingStep < 2) {
                        setOnboardingStep(onboardingStep + 1);
                      } else {
                        closeOnboarding();
                      }
                    }}
                    className="px-4 py-2 text-xs font-bold bg-[var(--color-accent)] text-[#0a0f1e] hover:bg-[var(--color-accent)]/80 rounded-xl transition-all cursor-pointer"
                  >
                    {onboardingStep === 2 ? 'Comenzar' : 'Siguiente'}
                  </button>
                </div>
              </div>
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
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-accent)] border-t-transparent" />
      </div>
    }>
      <ExplorerContent />
    </Suspense>
  );
}
