import { ChatMessage, RespuestaIA } from '@/domain/entities';

export interface ChatbotUseCase {
  execute(messages: ChatMessage[], weatherContext?: string): Promise<RespuestaIA>;
}
