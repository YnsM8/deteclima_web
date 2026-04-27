import { NextRequest, NextResponse } from 'next/server';
import { OpenMeteoAdapter } from '@/infrastructure/adapters/out/OpenMeteoAdapter';
import { ClimateService } from '@/application/services/ClimateService';

const weatherAdapter = new OpenMeteoAdapter();
const climateService = new ClimateService(weatherAdapter);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = parseFloat(searchParams.get('lat') || '');
  const lon = parseFloat(searchParams.get('lon') || '');

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: 'Parámetros lat y lon son requeridos' },
      { status: 400 }
    );
  }

  try {
    const clima = await climateService.execute(lat, lon);
    return NextResponse.json(clima);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
