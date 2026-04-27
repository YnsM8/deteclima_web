import { Clima } from '@/domain/entities';

export interface WeatherPort {
  getCurrentWeather(lat: number, lon: number): Promise<Clima>;
}
