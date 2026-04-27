import { Prediccion } from '@/domain/entities';
import { validateCoordinates } from '@/domain/validators/ClimaValidator';
import { PredecirUseCase } from '@/application/ports/input/PredecirUseCase';
import { PredictionPort } from '@/application/ports/output/PredictionPort';

export class PredictionService implements PredecirUseCase {
  constructor(private readonly predictionPort: PredictionPort) {}

  async execute(lat: number, lon: number): Promise<Prediccion> {
    if (!validateCoordinates(lat, lon)) {
      throw new Error(`Coordenadas inválidas: lat=${lat}, lon=${lon}`);
    }

    return this.predictionPort.predict(lat, lon);
  }
}
