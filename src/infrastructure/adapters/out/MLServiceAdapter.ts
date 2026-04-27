import { Prediccion } from '@/domain/entities';
import { PredictionPort } from '@/application/ports/output/PredictionPort';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export class MLServiceAdapter implements PredictionPort {
  async predict(lat: number, lon: number): Promise<Prediccion> {
    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lon }),
    });

    if (!response.ok) {
      throw new Error(`ML Service error: ${response.status}`);
    }

    const data = await response.json();

    return {
      latitude: lat,
      longitude: lon,
      predictions: data.predictions,
      metrics: {
        r2: data.metrics.r2,
        mae: data.metrics.mae,
        rmse: data.metrics.rmse,
      },
      modelVersion: data.model_version,
      generatedAt: new Date().toISOString(),
    };
  }
}
