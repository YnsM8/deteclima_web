import { Prediccion } from '@/domain/entities';
import { PredictionPort } from '@/application/ports/output/PredictionPort';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export class MLServiceAdapter implements PredictionPort {
  async predict(lat: number, lon: number): Promise<Prediccion> {
    try {
      const response = await fetch(`${ML_SERVICE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lon }),
        // Timeout corto para no bloquear la UI
        signal: AbortSignal.timeout(3000)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          latitude: lat,
          longitude: lon,
          predictions: data.predictions,
          metrics: data.metrics,
          modelVersion: data.model_version,
          generatedAt: new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('ML Service unreachable, using mock fallback for demo/offline mode.');
    }

    // --- MOCK FALLBACK ---
    // Generar 24h de predicción simulada realista
    const mockPredictions = Array.from({ length: 24 }, (_, i) => {
      const time = new Date();
      time.setHours(time.getHours() + i);
      // Simular curva de temperatura diaria (más frío de noche, más calor de día)
      const hour = time.getHours();
      const baseTemp = 12 + Math.sin((hour - 8) * Math.PI / 12) * 8; 
      return {
        time: time.toISOString(),
        temperature: parseFloat((baseTemp + (Math.random() * 2 - 1)).toFixed(2)),
        confidence: 0.85 + Math.random() * 0.1
      };
    });

    return {
      latitude: lat,
      longitude: lon,
      predictions: mockPredictions,
      metrics: {
        r2: 0.92,
        mae: 0.85,
        rmse: 1.12
      },
      modelVersion: '1.0.0-mock',
      generatedAt: new Date().toISOString(),
    };
  }
}
