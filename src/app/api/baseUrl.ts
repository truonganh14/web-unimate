export const API_BASE_URL =
  (import.meta as { env: Record<string, string | undefined> }).env.VITE_API_URL ??
  'http://localhost:5000';

export const API_AI_BASE_URL =
  (import.meta as { env: Record<string, string | undefined> }).env.VITE_AI_API_URL ??
  'http://54.206.118.226:8000';

export function apiFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (
    API_BASE_URL.includes('ngrok-free.dev') ||
    API_BASE_URL.includes('ngrok.io') ||
    API_AI_BASE_URL.includes('ngrok-free.dev') ||
    API_AI_BASE_URL.includes('ngrok.io')
  ) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
