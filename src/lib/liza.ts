import { supabase } from './supabase';

export const LIZA_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/liza-ai`;

export type LizaMessage = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
};

export type LizaConversation = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type LizaFlashcardSet = {
  id: string;
  user_id: string;
  conversation_id: string | null;
  title: string;
  source_type: 'prompt' | 'pdf' | 'chat';
  source_filename: string;
  created_at: string;
};

export type LizaFlashcard = {
  id: string;
  set_id: string;
  front: string;
  back: string;
  position: number;
};

export type LizaQuiz = {
  id: string;
  user_id: string;
  conversation_id: string | null;
  title: string;
  source_type: 'prompt' | 'pdf' | 'chat';
  source_filename: string;
  question_count: number;
  created_at: string;
};

export type LizaQuizQuestion = {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  position: number;
};

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY;
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function streamChat(params: {
  message: string;
  conversationId: string | null;
  onToken: (token: string) => void;
  onMeta: (meta: { conversation_id: string }) => void;
  onTitle?: (title: string) => void;
  signal?: AbortSignal;
}): Promise<void> {
  const headers = await authHeaders();
  const resp = await fetch(LIZA_FUNCTION_URL, {
    method: 'POST',
    headers,
    signal: params.signal,
    body: JSON.stringify({
      action: 'chat',
      message: params.message,
      conversation_id: params.conversationId,
    }),
  });

  if (!resp.ok || !resp.body) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Chat failed: ${text || resp.statusText}`);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';
    for (const block of parts) {
      const lines = block.split('\n');
      let event = 'message';
      let dataStr = '';
      for (const line of lines) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) dataStr += line.slice(5).trim();
      }
      if (!dataStr) continue;
      try {
        const data = JSON.parse(dataStr);
        if (event === 'meta') params.onMeta(data);
        else if (event === 'token') params.onToken(data.t || '');
        else if (event === 'title' && params.onTitle) params.onTitle(data.title);
        else if (event === 'error') throw new Error(data.error || 'Stream error');
      } catch (e) {
        if (event === 'error') throw e;
      }
    }
  }
}

export async function generateFlashcards(params: {
  source: string;
  count: number;
  sourceType: 'prompt' | 'pdf' | 'chat';
  sourceFilename?: string;
  conversationId?: string | null;
}): Promise<{ set: LizaFlashcardSet; cards: LizaFlashcard[] }> {
  const headers = await authHeaders();
  const resp = await fetch(LIZA_FUNCTION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      action: 'generate_flashcards',
      source: params.source,
      count: params.count,
      source_type: params.sourceType,
      source_filename: params.sourceFilename || '',
      conversation_id: params.conversationId || null,
    }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to generate flashcards');
  return data;
}

export async function generateQuiz(params: {
  source: string;
  count: number;
  sourceType: 'prompt' | 'pdf' | 'chat';
  sourceFilename?: string;
  conversationId?: string | null;
}): Promise<{ quiz: LizaQuiz; questions: LizaQuizQuestion[] }> {
  const headers = await authHeaders();
  const resp = await fetch(LIZA_FUNCTION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      action: 'generate_quiz',
      source: params.source,
      count: params.count,
      source_type: params.sourceType,
      source_filename: params.sourceFilename || '',
      conversation_id: params.conversationId || null,
    }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to generate quiz');
  return data;
}

export function groupConversationsByTime(
  conversations: LizaConversation[],
): { label: string; items: LizaConversation[] }[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const buckets: Record<string, LizaConversation[]> = {
    Today: [],
    'This week': [],
    Older: [],
  };
  for (const c of conversations) {
    const age = now - new Date(c.updated_at).getTime();
    if (age < day) buckets['Today'].push(c);
    else if (age < 7 * day) buckets['This week'].push(c);
    else buckets['Older'].push(c);
  }
  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}
