import { getDB } from './db';

export async function saveChatHistory(
  sessionId: string,
  messages: Array<{ role: string; content: string }>
): Promise<void> {
  const db = await getDB();
  await db.put('chat-history', {
    sessionId,
    messages,
    timestamp: Date.now(),
  });
}

export async function getChatHistory(
  sessionId: string
): Promise<Array<{ role: string; content: string }> | null> {
  const db = await getDB();
  const entry = await db.get('chat-history', sessionId);
  return entry?.messages ?? null;
}

export async function clearChatHistory(sessionId: string): Promise<void> {
  const db = await getDB();
  await db.delete('chat-history', sessionId);
}
