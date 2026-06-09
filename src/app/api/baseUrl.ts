// Dev: để trống → gọi /api/... qua Vite proxy (hoạt động với localhost, IP LAN, ngrok).
// Production: set VITE_API_URL=https://your-api.example.com
export const API_BASE_URL =
  (import.meta as { env: Record<string, string | undefined> }).env.VITE_API_URL ?? '';

export const API_AI_BASE_URL =
  (import.meta as { env: Record<string, string | undefined> }).env.VITE_AI_API_URL ??
  'http://54.206.118.226:8000';

export async function apiFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (
    API_BASE_URL.includes('ngrok-free.dev') ||
    API_BASE_URL.includes('ngrok.io') ||
    API_AI_BASE_URL.includes('ngrok-free.dev') ||
    API_AI_BASE_URL.includes('ngrok.io')
  ) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }

  try {
    return await fetch(input, {
      ...init,
      headers,
    });
  } catch {
    throw new Error(
      'Không kết nối được backend. Chạy `cd backend && npm run dev` và kiểm tra MONGODB_URI trong backend/.env'
    );
  }
}
