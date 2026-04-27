import { NextRequest, NextResponse } from 'next/server';
import { MLServiceAdapter } from '@/infrastructure/adapters/out/MLServiceAdapter';
import { PredictionService } from '@/application/services/PredictionService';

const mlAdapter = new MLServiceAdapter();
const predictionService = new PredictionService(mlAdapter);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lat = parseFloat(body.latitude);
    const lon = parseFloat(body.longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { error: 'latitude y longitude son requeridos' },
        { status: 400 }
      );
    }

    const prediccion = await predictionService.execute(lat, lon);
    return NextResponse.json(prediccion);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
