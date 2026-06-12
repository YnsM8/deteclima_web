import { NextRequest, NextResponse } from 'next/server';
import { MLServiceAdapter } from '@/infrastructure/adapters/out/ai/MLServiceAdapter';
import { PredictionService } from '@/application/services/PredictionService';
import { logger } from '@/infrastructure/logger';

const mlAdapter = new MLServiceAdapter();
const predictionService = new PredictionService(mlAdapter);

export class PredictionHandler {
  static async handleRequest(request: NextRequest) {
    try {
      logger.info('Prediction request received', 'PredictionHandler');
      const body = await request.json();
      const lat = parseFloat(body.latitude);
      const lon = parseFloat(body.longitude);

      if (isNaN(lat) || isNaN(lon)) {
        logger.warn('Prediction request rejected: invalid lat/lon parameters', 'PredictionHandler', { lat, lon });
        return NextResponse.json(
          { error: 'latitude y longitude son requeridos' },
          { status: 400 }
        );
      }

      const prediccion = await predictionService.execute(lat, lon);
      logger.info('Prediction generated successfully', 'PredictionHandler', {
        lat,
        lon,
        modelVersion: prediccion.modelVersion,
      });
      return NextResponse.json(prediccion);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('Error handling prediction request', 'PredictionHandler', error);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  static async handleWarmup(request: NextRequest) {
    try {
      const isWarm = await mlAdapter.warmup();
      logger.info('ML Service warmup triggered', 'PredictionHandler', { success: isWarm });
      return NextResponse.json({ status: 'ok', warm: isWarm });
    } catch (error) {
      logger.error('Failed to warmup ML Service', 'PredictionHandler', error);
      return NextResponse.json({ status: 'error' }, { status: 500 });
    }
  }
}


