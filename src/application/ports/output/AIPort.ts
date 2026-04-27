import { ChatMessage, RespuestaIA } from '@/domain/entities';

export interface AIPort {
  generateResponse(messages: ChatMessage[], systemPrompt: string): Promise<RespuestaIA>;
}
