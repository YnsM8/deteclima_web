import { NextRequest, NextResponse } from 'next/server';
import { OpenMeteoAdapter } from '@/infrastructure/adapters/out/weather/OpenMeteoAdapter';
import { SupabaseAdapter } from '@/infrastructure/adapters/out/persistence/SupabaseAdapter';
import { ClimateService } from '@/application/services/ClimateService';
import { logger } from '@/infrastructure/logger';

const weatherAdapter = new OpenMeteoAdapter();
const supabaseAdapter = new SupabaseAdapter();
const climateService = new ClimateService(weatherAdapter, supabaseAdapter);

export class WeatherHandler {
  static async handleRequest(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const lat = parseFloat(searchParams.get('lat') || '');
    const lon = parseFloat(searchParams.get('lon') || '');

    if (isNaN(lat) || isNaN(lon)) {
      logger.warn('Weather request rejected: missing or invalid parameters', 'WeatherHandler', { lat, lon });
      return NextResponse.json(
        { error: 'Parámetros lat y lon son requeridos' },
        { status: 400 }
      );
    }

    try {
      logger.info('Weather request received', 'WeatherHandler', { lat, lon });
      const clima = await climateService.execute(lat, lon);
      logger.info('Weather data fetched successfully', 'WeatherHandler', { lat, lon });
      return NextResponse.json(clima);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('Error handling weather request', 'WeatherHandler', error);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
}

