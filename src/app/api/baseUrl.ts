export const API_BASE = import.meta.env.VITE_API_URL ?? 'https://etching-underhand-placidly.ngrok-free.dev';

export function apiFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (API_BASE.includes('ngrok-free.dev') || API_BASE.includes('ngrok.io')) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
