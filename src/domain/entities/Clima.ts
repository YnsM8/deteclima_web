export interface WeatherCurrent {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  precipitation: number;
  cloudCover: number;
  weatherCode: number;
  apparentTemperature: number;
  radiation: number;
}

export interface WeatherHourly {
  time: string[];
  temperature: number[];
  humidity: number[];
  precipitation: number[];
  windSpeed: number[];
  pressure: number[];
  weatherCode: number[];
}

export interface Clima {
  latitude: number;
  longitude: number;
  locationName: string;
  current: WeatherCurrent;
  hourly: WeatherHourly;
  timezone: string;
  updatedAt: string;
}
