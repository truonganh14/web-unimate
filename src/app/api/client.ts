export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    throw new Error(
      'Không kết nối được backend. Vui lòng chạy backend trước: cd backend && npm run dev'
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Phản hồi không hợp lệ từ máy chủ');
  }
}
