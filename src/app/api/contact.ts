import { parseJsonResponse } from './client';

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type ContactResponse = {
  message: string;
  errors?: string[];
};

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function sendContactFeedback(payload: ContactPayload): Promise<string> {
  const response = await fetch(`${API_BASE}/api/contact/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse<ContactResponse>(response);

  if (!response.ok) {
    throw new Error(data.errors?.join(', ') || data.message || 'Gửi góp ý thất bại');
  }

  return data.message;
}
