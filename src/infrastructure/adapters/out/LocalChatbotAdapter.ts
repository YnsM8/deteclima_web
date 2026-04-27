import { RespuestaIA } from '@/domain/entities';

const OFFLINE_TEMPLATES: Record<string, string> = {
  temperatura: 'Sin conexión. Según los últimos datos cacheados, la temperatura era {cached_temp}°C.',
  humedad: 'Sin conexión. La última humedad registrada fue {cached_humidity}%.',
  viento: 'Sin conexión. La última velocidad de viento registrada fue {cached_wind} km/h.',
  lluvia: 'Sin conexión. Consulta los datos cacheados en el dashboard para ver precipitaciones.',
  presión: 'Sin conexión. La última presión atmosférica registrada fue {cached_pressure} hPa.',
  pronóstico: 'Sin conexión. No puedo generar pronósticos sin acceso a internet. Revisa los últimos datos guardados.',
  default: 'Estoy en modo offline. Puedo mostrarte los últimos datos climáticos guardados. Conéctate a internet para respuestas completas del asistente IA.',
};

interface CachedWeatherData {
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
}

export function getOfflineResponse(
  question: string,
  cachedData?: CachedWeatherData
): RespuestaIA {
  const lower = question.toLowerCase();

  let template = OFFLINE_TEMPLATES.default;
  for (const [keyword, tmpl] of Object.entries(OFFLINE_TEMPLATES)) {
    if (keyword !== 'default' && lower.includes(keyword)) {
      template = tmpl;
      break;
    }
  }

  const content = template
    .replace('{cached_temp}', cachedData?.temperature?.toFixed(1) ?? '—')
    .replace('{cached_humidity}', cachedData?.humidity?.toFixed(0) ?? '—')
    .replace('{cached_wind}', cachedData?.windSpeed?.toFixed(1) ?? '—')
    .replace('{cached_pressure}', cachedData?.pressure?.toFixed(0) ?? '—');

  return {
    content,
    model: 'offline-local',
    tokensUsed: 0,
    latencyMs: 0,
    isOffline: true,
  };
}
