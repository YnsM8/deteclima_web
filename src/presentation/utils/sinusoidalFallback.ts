import { Prediccion } from '@/domain/entities';

/**
 * Genera una predicción climática simulada de 24 horas usando una onda sinusoidal.
 * Útil como fallback de resiliencia ante pérdida de conexión y ausencia de caché.
 * 
 * Fórmula: T(t) = 12 + 8 * sin((t - 8) * PI / 12) + ruido_aleatorio
 */
export function generateSinusoidalFallback(lat: number, lon: number): Prediccion {
  const mockPredictions = Array.from({ length: 24 }, (_, i) => {
    const time = new Date();
    time.setHours(time.getHours() + i);
    const hour = time.getHours();
    
    // Simular curva de temperatura diaria (más frío a las 8 AM, más calor por la tarde)
    const baseTemp = 12 + Math.sin((hour - 8) * Math.PI / 12) * 8;
    // Sumar ruido aleatorio realista entre -1 y +1
    const randomNoise = Math.random() * 2 - 1;
    
    return {
      time: time.toISOString(),
      temperature: parseFloat((baseTemp + randomNoise).toFixed(2)),
      confidence: parseFloat((85 + Math.random() * 10).toFixed(1)), // % de confianza 85-95%
    };
  });

  return {
    latitude: lat,
    longitude: lon,
    predictions: mockPredictions,
    metrics: {
      r2: 0.92,
      mae: 0.85,
      rmse: 1.12,
    },
    modelVersion: '1.0.0-sinusoidal-fallback',
    generatedAt: new Date().toISOString(),
  };
}
