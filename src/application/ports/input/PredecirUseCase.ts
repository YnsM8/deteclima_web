import { Prediccion } from '@/domain/entities';

export interface PredecirUseCase {
  execute(lat: number, lon: number): Promise<Prediccion>;
}
