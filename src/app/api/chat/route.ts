import { NextRequest } from 'next/server';
import { ChatHandler } from '@/infrastructure/adapters/in/api/ChatHandler';

export async function POST(request: NextRequest) {
  return ChatHandler.handleRequest(request);
}

