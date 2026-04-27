import { Clima } from '@/domain/entities';
import { validateCoordinates } from '@/domain/validators/ClimaValidator';
import { ConsultarClimaUseCase } from '@/application/ports/input/ConsultarClimaUseCase';
import { WeatherPort } from '@/application/ports/output/WeatherPort';

export class ClimateService implements ConsultarClimaUseCase {
  constructor(private readonly weatherPort: WeatherPort) {}

  async execute(lat: number, lon: number): Promise<Clima> {
    if (!validateCoordinates(lat, lon)) {
      throw new Error(`Coordenadas inválidas: lat=${lat}, lon=${lon}`);
    }

    return this.weatherPort.getCurrentWeather(lat, lon);
  }
}
