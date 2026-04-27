import { NextRequest, NextResponse } from 'next/server';
import { GroqAdapter } from '@/infrastructure/adapters/out/GroqAdapter';
import { ChatbotService } from '@/application/services/ChatbotService';
import { ChatMessage } from '@/domain/entities';

const aiAdapter = new GroqAdapter();
const chatbotService = new ChatbotService(aiAdapter);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages;
    const weatherContext: string | undefined = body.weatherContext;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de mensajes' },
        { status: 400 }
      );
    }

    const respuesta = await chatbotService.execute(messages, weatherContext);
    return NextResponse.json(respuesta);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
