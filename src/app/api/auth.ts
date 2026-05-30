import { parseJsonResponse } from './client';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
};

type AuthResponse = {
  message: string;
  data?: {
    token: string;
    user: User;
  };
  errors?: string[];
};

type MeResponse = {
  message: string;
  data?: User;
};

const API_BASE = import.meta.env.VITE_API_URL ?? '';
const TOKEN_KEY = 'unimate_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function parseAuthResponse(response: Response): Promise<AuthResponse> {
  const data = await parseJsonResponse<AuthResponse>(response);

  if (!response.ok) {
    throw new Error(data.errors?.join(', ') || data.message || 'Request failed');
  }

  return data;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await parseAuthResponse(response);
  return data.data!;
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await parseAuthResponse(response);
  return data.data!;
}

export async function fetchCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseJsonResponse<MeResponse>(response);

  if (!response.ok) {
    throw new Error(data.message || 'Session expired');
  }

  return data.data!;
}
