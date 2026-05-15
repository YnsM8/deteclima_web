import { NextRequest } from 'next/server';
import { WeatherHandler } from '@/infrastructure/adapters/in/api/WeatherHandler';

export async function GET(request: NextRequest) {
  return WeatherHandler.handleRequest(request);
}

