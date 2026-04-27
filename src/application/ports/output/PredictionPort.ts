import { Prediccion } from '@/domain/entities';

export interface PredictionPort {
  predict(lat: number, lon: number): Promise<Prediccion>;
}
