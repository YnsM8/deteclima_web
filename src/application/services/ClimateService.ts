import { Clima } from "@/domain/entities";
import { validateCoordinates } from "@/domain/validators/ClimaValidator";
import { ConsultarClimaUseCase } from "@/application/ports/input/ConsultarClimaUseCase";
import { WeatherPort } from "@/application/ports/output/WeatherPort";
import { DatabasePort } from "@/application/ports/output/DatabasePort";

export class ClimateService implements ConsultarClimaUseCase {
  constructor(
    private readonly weatherPort: WeatherPort,
    private readonly databasePort?: DatabasePort
  ) {}

  async execute(lat: number, lon: number): Promise<Clima> {
    if (!validateCoordinates(lat, lon)) {
      throw new Error(`Coordenadas inválidas: lat=${lat}, lon=${lon}`);
    }

    const clima = await this.weatherPort.getCurrentWeather(lat, lon);

    if (this.databasePort) {
      this.databasePort.saveWeatherQuery({
        lat,
        lon,
        locationName: clima.locationName,
        dataJson: clima
      }).catch(err => console.error('Error saving weather query in DB:', err));
    }

    return clima;
  }
}
