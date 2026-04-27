import { ChatMessage, RespuestaIA } from '@/domain/entities';
import { AIPort } from '@/application/ports/output/AIPort';
import { groq } from '@/lib/groq/client';

export class GroqAdapter implements AIPort {
  async generateResponse(messages: ChatMessage[], systemPrompt: string): Promise<RespuestaIA> {
    const startTime = Date.now();

    const groqMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: groqMessages,
      temperature: 0.7,
      max_completion_tokens: 1024,
    });

    const latencyMs = Date.now() - startTime;
    const choice = completion.choices[0];

    return {
      content: choice?.message?.content || 'No pude generar una respuesta.',
      model: completion.model,
      tokensUsed: completion.usage?.total_tokens || 0,
      latencyMs,
      isOffline: false,
    };
  }
}
