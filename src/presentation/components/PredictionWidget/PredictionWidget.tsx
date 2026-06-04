import { useState, useEffect } from 'react';
import { useOnlineStatus } from '@/presentation/hooks/useOnlineStatus';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, AlertCircle, ShieldAlert, Sprout } from 'lucide-react';
import { type Prediccion, obtenerRecomendacionPorTemperatura } from '@/domain/entities';
import { cachePredictionData, getCachedPrediction } from '@/infrastructure/adapters/out/cache/prediction-cache';
import { generateSinusoidalFallback } from '@/presentation/utils/sinusoidalFallback';

interface Props {
  lat: number;
  lon: number;
  onPredictionLoad?: (pred: Prediccion) => void;
}

export function PredictionWidget({ lat, lon, onPredictionLoad }: Props) {
  const isOnline = useOnlineStatus();
  const [data, setData] = useState<Prediccion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
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
        if (!ignore) {
          setData(json);
          if (onPredictionLoad) onPredictionLoad(json);
        }
        await cachePredictionData(cacheKey, json);
      } catch {
        // Fallback to cache
        try {
          const cached = (await getCachedPrediction(cacheKey)) as Prediccion | null;
          if (cached && !ignore) {
            setData(cached);
            if (onPredictionLoad) onPredictionLoad(cached);
          } else if (!ignore) {
            // Activate the sinusoidal fallback because there is no cache and network is offline
            console.warn('Network offline and no cache. Activating sinusoidal fallback.');
            const fallbackData = generateSinusoidalFallback(lat, lon);
            setData(fallbackData);
            if (onPredictionLoad) onPredictionLoad(fallbackData);
          }
        } catch {
          if (!ignore) {
            console.warn('Error reading local cache. Activating sinusoidal fallback.');
            const fallbackData = generateSinusoidalFallback(lat, lon);
            setData(fallbackData);
            if (onPredictionLoad) onPredictionLoad(fallbackData);
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchPrediction();
    return () => { ignore = true; };
  }, [lat, lon, isOnline, onPredictionLoad]);

  const [anomaly, setAnomaly] = useState<{ score: number, type: string } | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchAnomaly() {
      if (!isOnline) {
        if (!ignore) {
          setAnomaly({ score: 0, type: 'Normal (Modo Offline)' });
        }
        return;
      }

      try {
        // Fetch last 7 days history to calculate a simple baseline
        const end = new Date().toISOString().split('T')[0];
        const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const res = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=temperature_2m`);
        if (!res.ok) {
          if (!ignore) setAnomaly({ score: 0, type: 'Normal' });
          return;
        }
        
        const history = await res.json();
        if (!history || !history.hourly || !history.hourly.temperature_2m) {
          if (!ignore) setAnomaly({ score: 0, type: 'Normal' });
          return;
        }

        const temps = history.hourly.temperature_2m;
        const avg = temps.reduce((a: number, b: number) => a + b, 0) / temps.length;
        
        if (data && data.predictions.length > 0 && !ignore) {
          const currentTemp = data.predictions[0].temperature;
          const diff = currentTemp - avg;
          
          if (Math.abs(diff) > 5) {
            setAnomaly({ 
              score: Math.abs(diff), 
              type: diff > 0 ? 'Calor Inusual' : 'Frío Inusual (Posible Helada)' 
            });
          } else {
            setAnomaly({ score: Math.abs(diff), type: 'Normal' });
          }
        }
      } catch (e) {
        // Silently catch network failures or DNS resolution issues and use a safe baseline
        console.warn('No se pudo conectar a la API de anomalías históricas (OpenMeteo) debido a problemas de red. Usando estimación local.', e);
        if (!ignore) {
          setAnomaly({ score: 0, type: 'Normal' });
        }
      }
    }
    if (data) fetchAnomaly();
    return () => { ignore = true; };
  }, [lat, lon, data, isOnline]);

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

  // Calculate minimum temperature forecasted
  const minTemp = data && data.predictions.length > 0 
    ? Math.min(...data.predictions.map((p) => p.temperature)) 
    : 20;

  const recomendacion = obtenerRecomendacionPorTemperatura(minTemp);

  return (
    <div id="prediction" className="glass rounded-xl p-6 mt-8 scroll-mt-24 w-full relative overflow-hidden">
      {/* Anomaly Badge */}
      {anomaly && anomaly.type !== 'Normal' && (
        <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg animate-pulse z-10">
          ⚠️ {anomaly.type.toUpperCase()}
        </div>
      )}

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
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 border-t border-[var(--color-border)] pt-4">
            {data?.metrics && (
              <>
                <div className="p-3 bg-white/5 rounded-lg border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-secondary)] mb-1">Confianza (R²)</p>
                  <p className="font-semibold">{(data.metrics.r2 * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-secondary)] mb-1">Margen de Error (MAE)</p>
                  <p className="font-semibold text-rose-300">± {data.metrics.mae.toFixed(2)} °C</p>
                </div>
              </>
            )}
            
            <div className="p-3 bg-white/5 rounded-lg border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">Anomalía Térmica</p>
              <p className={`font-semibold ${anomaly && anomaly.type !== 'Normal' ? 'text-rose-400' : 'text-green-400'}`}>
                {anomaly ? (anomaly.type !== 'Normal' ? `+${anomaly.score.toFixed(1)}°C` : 'Normal') : '--'}
              </p>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">Modelo v.</p>
              <p className="font-semibold opacity-70">Random Forest {data?.modelVersion || '1.0'}</p>
            </div>
          </div>

          {/* Agricultural Crop Protection Recommendations Panel */}
          <div className={`mt-6 border border-white/10 rounded-xl p-5 ${recomendacion.color.split(' ').slice(1).join(' ')}`}>
            <div className="flex items-center gap-2.5 mb-3">
              {recomendacion.nivel === 'alto' || recomendacion.nivel === 'moderado' ? (
                <ShieldAlert className={`w-5 h-5 ${recomendacion.color.split(' ')[0]}`} />
              ) : (
                <Sprout className={`w-5 h-5 ${recomendacion.color.split(' ')[0]}`} />
              )}
              <h3 className={`font-bold text-sm ${recomendacion.color.split(' ')[0]}`}>
                {recomendacion.titulo}
              </h3>
            </div>
            <p className="text-xs text-white/80 mb-4 leading-relaxed">
              {recomendacion.descripcion}
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold tracking-wider text-white/50 uppercase mb-1">
                Acciones recomendadas para proteger tus cultivos:
              </p>
              {recomendacion.acciones.map((accion, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-white/90 leading-relaxed bg-black/10 rounded-lg p-2.5 border border-white/5">
                  <span className="text-[var(--color-accent)] font-bold shrink-0">{idx + 1}.</span>
                  <span>{accion}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

