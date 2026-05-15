import { NextRequest } from 'next/server';
import { PredictionHandler } from '@/infrastructure/adapters/in/api/PredictionHandler';

export async function POST(request: NextRequest) {
  return PredictionHandler.handleRequest(request);
}

