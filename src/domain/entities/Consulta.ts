export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Consulta {
  sessionId: string;
  messages: ChatMessage[];
  weatherContext?: string;
  createdAt: string;
}

export interface RespuestaIA {
  content: string;
  model: string;
  tokensUsed: number;
  latencyMs: number;
  isOffline: boolean;
}
