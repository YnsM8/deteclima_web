import { NextRequest, NextResponse } from 'next/server';
import { GroqAdapter } from '@/infrastructure/adapters/out/ai/GroqAdapter';
import { ChatbotService } from '@/application/services/ChatbotService';
import { ChatMessage } from '@/domain/entities';
import { logger } from '@/infrastructure/logger';

const aiAdapter = new GroqAdapter();
const chatbotService = new ChatbotService(aiAdapter);

export class ChatHandler {
  static async handleRequest(request: NextRequest) {
    try {
      logger.info('Chat request received', 'ChatHandler');
      const body = await request.json();
      const messages: ChatMessage[] = body.messages;
      const weatherContext: string | undefined = body.weatherContext;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        logger.warn('Chat request rejected: messages array missing or empty', 'ChatHandler');
        return NextResponse.json(
          { error: 'Se requiere un array de mensajes' },
          { status: 400 }
        );
      }

      const respuesta = await chatbotService.execute(messages, weatherContext);
      logger.info('Chat response generated successfully', 'ChatHandler', {
        model: respuesta.model,
        latencyMs: respuesta.latencyMs,
        tokensUsed: respuesta.tokensUsed,
      });
      return NextResponse.json(respuesta);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('Error handling chat request', 'ChatHandler', error);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
}

