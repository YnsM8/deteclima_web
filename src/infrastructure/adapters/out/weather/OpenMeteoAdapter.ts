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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    try {
      const response = await fetch(`${BASE_URL}?${params}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.status === 429) {
        throw new Error('Open-Meteo API rate limit exceeded. Please try again later.');
      }

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
    } catch {
      clearTimeout(timeoutId);
      console.warn('OpenMeteo API unreachable, using mock fallback for demo/offline mode.');

      // --- MOCK FALLBACK ---
      const mockTime: string[] = [];
      const mockTemp: number[] = [];
      const mockHum: number[] = [];
      const mockPrecip: number[] = [];
      const mockWind: number[] = [];
      const mockPress: number[] = [];
      const mockCode: number[] = [];

      for (let i = 0; i < 24; i++) {
        const time = new Date();
        time.setHours(time.getHours() + i);
        mockTime.push(time.toISOString().slice(0, 16));
        
        const hour = time.getHours();
        // Temperature curve: colder at night (e.g. 4am: 2°C), warmer at day (e.g. 2pm: 15°C)
        const baseTemp = 9 + Math.sin((hour - 8) * Math.PI / 12) * 6;
        mockTemp.push(parseFloat((baseTemp + (Math.random() * 2 - 1)).toFixed(1)));
        mockHum.push(Math.round(70 - Math.sin((hour - 8) * Math.PI / 12) * 20));
        mockPrecip.push(Math.random() < 0.1 ? parseFloat((Math.random() * 2).toFixed(1)) : 0.0);
        mockWind.push(parseFloat((8 + Math.random() * 5).toFixed(1)));
        mockPress.push(Math.round(1013 + Math.sin((hour - 8) * Math.PI / 12) * 2));
        mockCode.push(1);
      }

      return {
        latitude: lat,
        longitude: lon,
        locationName: `${lat.toFixed(2)}, ${lon.toFixed(2)} (Demo)`,
        current: {
          temperature: mockTemp[0],
          humidity: mockHum[0],
          windSpeed: mockWind[0],
          windDirection: 180,
          pressure: mockPress[0],
          precipitation: mockPrecip[0],
          cloudCover: 20,
          weatherCode: 1,
          apparentTemperature: parseFloat((mockTemp[0] - 1).toFixed(1)),
          radiation: 350,
        },
        hourly: {
          time: mockTime,
          temperature: mockTemp,
          humidity: mockHum,
          precipitation: mockPrecip,
          windSpeed: mockWind,
          pressure: mockPress,
          weatherCode: mockCode,
        },
        timezone: 'America/Lima',
        updatedAt: new Date().toISOString(),
      };
    }
  }
}
