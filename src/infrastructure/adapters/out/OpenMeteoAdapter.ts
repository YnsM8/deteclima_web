import { Clima, WeatherCurrent, WeatherHourly } from '@/domain/entities';
import { WeatherPort } from '@/application/ports/output/WeatherPort';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export class OpenMeteoAdapter implements WeatherPort {
  async getCurrentWeather(lat: number, lon: number): Promise<Clima> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: [
        'temperature_2m', 'relative_humidity_2m', 'wind_speed_10m',
        'wind_direction_10m', 'surface_pressure', 'precipitation',
        'cloud_cover', 'weather_code', 'apparent_temperature',
        'shortwave_radiation',
      ].join(','),
      hourly: [
        'temperature_2m', 'relative_humidity_2m', 'precipitation',
        'wind_speed_10m', 'surface_pressure', 'weather_code',
      ].join(','),
      forecast_hours: '24',
      timezone: 'auto',
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();

    const current: WeatherCurrent = {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      pressure: data.current.surface_pressure,
      precipitation: data.current.precipitation,
      cloudCover: data.current.cloud_cover,
      weatherCode: data.current.weather_code,
      apparentTemperature: data.current.apparent_temperature,
      radiation: data.current.shortwave_radiation,
    };

    const hourly: WeatherHourly = {
      time: data.hourly.time,
      temperature: data.hourly.temperature_2m,
      humidity: data.hourly.relative_humidity_2m,
      precipitation: data.hourly.precipitation,
      windSpeed: data.hourly.wind_speed_10m,
      pressure: data.hourly.surface_pressure,
      weatherCode: data.hourly.weather_code,
    };

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      locationName: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      current,
      hourly,
      timezone: data.timezone,
      updatedAt: new Date().toISOString(),
    };
  }
}
