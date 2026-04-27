export interface HourlyPrediction {
  time: string;
  temperature: number;
  confidence: number;
}

export interface Prediccion {
  latitude: number;
  longitude: number;
  predictions: HourlyPrediction[];
  metrics: {
    r2: number;
    mae: number;
    rmse: number;
  };
  modelVersion: string;
  generatedAt: string;
}
