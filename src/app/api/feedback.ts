import { API_BASE_URL, apiFetch } from './baseUrl';

export type FeedbackPayload = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  rating: number;
};

export type FeedbackItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  rating: number;
  createdAt: string;
};

type FeedbackResponse = {
  message: string;
  data?: FeedbackItem;
  errors?: string[];
};

export type PublicFeedbackItem = {
  id: string;
  name: string;
  subject: string;
  message: string;
  rating: number;
  createdAt: string;
};

type FeedbackListResponse = {
  message: string;
  data?: FeedbackItem[];
};

type PublicFeedbackListResponse = {
  message: string;
  data?: PublicFeedbackItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

function parseJsonResponse<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

export async function submitFeedback(
  payload: FeedbackPayload,
  token: string
): Promise<FeedbackResponse> {
  const response = await apiFetch(`${API_BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse<FeedbackResponse>(response);

  if (!response.ok) {
    throw new Error(data.errors?.join(', ') || data.message || 'Gửi phản hồi thất bại');
  }

  return data;
}

export async function fetchFeedbacks(token: string): Promise<FeedbackItem[]> {
  const response = await apiFetch(`${API_BASE_URL}/api/feedback`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseJsonResponse<FeedbackListResponse>(response);

  if (!response.ok) {
    throw new Error(data.message || 'Không thể tải danh sách phản hồi');
  }

  return data.data ?? [];
}

export async function fetchPublicFeedbacks(
  page = 1,
  limit = 3
): Promise<{
  items: PublicFeedbackItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await apiFetch(`${API_BASE_URL}/api/feedback/public?${params}`);
  const data = await parseJsonResponse<PublicFeedbackListResponse>(response);

  if (!response.ok) {
    throw new Error(data.message || 'Không thể tải đánh giá');
  }

  return {
    items: data.data ?? [],
    pagination: data.pagination ?? { page, limit, total: 0, totalPages: 1 },
  };
}

export async function deleteFeedback(id: string, token: string): Promise<void> {
  const response = await apiFetch(`${API_BASE_URL}/api/feedback/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseJsonResponse<FeedbackResponse>(response);

  if (!response.ok) {
    throw new Error(data.message || 'Xóa phản hồi thất bại');
  }
}
