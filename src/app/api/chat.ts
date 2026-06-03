import { apiFetch } from './baseUrl';
import { API_AI_BASE_URL } from './baseUrl';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  createdAt: string;
}

export interface ChatSession {
  session_id: string;
  updated_at: string;
  last_message: string;
}

export interface SendMessagePayload {
  message: string;
  session_id: string;
}

export interface SendMessageResponse {
  session_id: string;
  input_text: string;
  reply_text: string;
  audio_url: string | null;
}

export async function sendChatMessage(
  payload: SendMessagePayload
): Promise<SendMessageResponse> {
  const res = await apiFetch(`${API_AI_BASE_URL}/api/v1/chat/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail ?? `HTTP ${res.status}`);
  }

  return res.json();
}

export async function getChatSessions(limit = 50): Promise<ChatSession[]> {
  const res = await apiFetch(
    `${API_AI_BASE_URL}/api/v1/chat/sessions?limit=${limit}`
  );
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function getChatHistory(
  sessionId: string,
  limit = 50
): Promise<ChatMessage[]> {
  const res = await apiFetch(
    `${API_AI_BASE_URL}/api/v1/chat/history/${sessionId}?limit=${limit}`
  );
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}
