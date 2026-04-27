import { ChatMessage, RespuestaIA } from '@/domain/entities';
import { isClimateRelated } from '@/domain/validators/ClimaValidator';
import { ChatbotUseCase } from '@/application/ports/input/ChatbotUseCase';
import { AIPort } from '@/application/ports/output/AIPort';

const SYSTEM_PROMPT = `Eres "Deteclima AI", un asistente educativo especializado EXCLUSIVAMENTE en clima, meteorología y ciencias ambientales.

REGLAS ESTRICTAS:
1. SOLO responde preguntas relacionadas con clima, meteorología, fenómenos atmosféricos y ciencias ambientales.
2. Si la pregunta NO es sobre clima, responde: "Lo siento, solo puedo ayudarte con temas relacionados al clima y la meteorología. ¿Tienes alguna pregunta sobre el tiempo?"
3. Usa lenguaje didáctico adaptado para estudiantes de educación básica (12-16 años).
4. Si se proporcionan datos climáticos reales, SIEMPRE cita los valores exactos en tu respuesta.
5. Incluye ejemplos locales de la región andina peruana cuando sea relevante.
6. Responde en español.

DATOS CLIMÁTICOS ACTUALES:
{WEATHER_CONTEXT}`;

export class ChatbotService implements ChatbotUseCase {
  constructor(private readonly aiPort: AIPort) {}

  async execute(messages: ChatMessage[], weatherContext?: string): Promise<RespuestaIA> {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !isClimateRelated(lastMessage.content)) {
      return {
        content: 'Lo siento, solo puedo ayudarte con temas relacionados al clima y la meteorología. ¿Tienes alguna pregunta sobre el tiempo?',
        model: 'filter',
        tokensUsed: 0,
        latencyMs: 0,
        isOffline: false,
      };
    }

    const prompt = SYSTEM_PROMPT.replace(
      '{WEATHER_CONTEXT}',
      weatherContext || 'No hay datos climáticos disponibles en este momento.'
    );

    return this.aiPort.generateResponse(messages, prompt);
  }
}
