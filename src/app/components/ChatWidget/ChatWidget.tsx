'use client';

import { useState, useRef, useEffect } from 'react';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';
import { MessageCircle, Send, Loader2, Sparkles, AlertTriangle, WifiOff } from 'lucide-react';
import type { ChatMessage, Clima } from '@/domain/entities';
import { getOfflineResponse } from '@/infrastructure/adapters/out/LocalChatbotAdapter';
import { getChatHistory, saveChatHistory } from '@/lib/offline/chat-cache';

interface Props {
  weatherContext: Clima | null;
}

export function ChatWidget({ weatherContext }: Props) {
  const isOnline = useOnlineStatus();
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: '¡Hola! Soy tu asistente climático potenciado por Llama 3. ¿En qué te puedo ayudar sobre el clima de hoy?'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const SESSION_ID = 'default';

  // Load chat history
  useEffect(() => {
    async function loadHistory() {
      const history = await getChatHistory(SESSION_ID);
      if (history && history.length > 0) {
        setMessages(history as ChatMessage[]);
      }
    }
    loadHistory();
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    // Only serialize necessary data points to avoid excess tokens
    const contextString = weatherContext ? JSON.stringify({
      temp: weatherContext.current.temperature,
      humidity: weatherContext.current.humidity,
      wind: weatherContext.current.windSpeed,
      precip: weatherContext.current.precipitation,
      radiation: weatherContext.current.radiation
    }) : undefined;

    try {
      if (!isOnline) {
        // Fallback local
        const offlineReply = getOfflineResponse(userMessage.content, weatherContext?.current);
        const finalMessages = [...newMessages, { role: 'assistant' as const, content: offlineReply.content }];
        setMessages(finalMessages);
        saveChatHistory(SESSION_ID, finalMessages);
        return;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          weatherContext: contextString
        }),
      });

      if (!res.ok) throw new Error('Error al conectar con la IA');
      
      const data = await res.json();
      const finalMessages = [...newMessages, { role: 'assistant' as const, content: data.content }];
      setMessages(finalMessages);
      saveChatHistory(SESSION_ID, finalMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      // Revert the UI state so they can try again or just show error below
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="chat" className="glass rounded-xl mt-8 scroll-mt-24 w-full flex flex-col h-[500px]">
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-black/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg relative">
            <MessageCircle size={20} />
            {isOnline && (
              <div className="absolute top-0 right-0 -mt-1 -mr-1">
                 <Sparkles size={12} className="text-emerald-300 animate-pulse" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight">ChatBot Climático</h2>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest">
              {isOnline ? 'Powered by Groq Llama 3' : 'Modo Offline (Respuestas limitadas)'}
            </p>
          </div>
        </div>
        {!isOnline && <WifiOff size={16} className="text-[var(--color-warning)]" />}
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-[var(--color-accent)] text-white rounded-tr-sm' 
                  : 'bg-white/10 text-[var(--color-text-primary)] rounded-tl-sm border border-[var(--color-border)]'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex w-full justify-start">
            <div className="bg-white/5 text-[var(--color-text-secondary)] rounded-2xl rounded-tl-sm px-4 py-3 text-sm border border-[var(--color-border)] flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-[var(--color-accent)]" /> Analizando contexto...
            </div>
          </div>
        )}
        {error && (
          <div className="flex w-full justify-center text-xs text-[var(--color-danger)] gap-1 my-2 bg-rose-500/10 px-3 py-2 rounded-lg">
             <AlertTriangle size={14} /> {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-black/20 border-t border-[var(--color-border)] mt-auto">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ej: ¿Qué ropa me recomiendas salir a usar dada la temperatura?"
            className="w-full bg-black/30 border border-[var(--color-border)] text-sm rounded-full py-3.5 pl-5 pr-14 outline-none focus:border-[var(--color-accent)]/50 transition-colors placeholder:text-white/20 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-[var(--color-accent)] rounded-full text-white hover:bg-[var(--color-accent)]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
