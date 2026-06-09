import { useEffect, useState } from 'react';
import { deleteFeedback, fetchFeedbacks, type FeedbackItem } from '../api/feedback';
import { useAuth } from '../context/AuthContext';
import { Loader2, RefreshCw, Shield, Star, Trash2 } from 'lucide-react';

export default function AdminFeedbackPage() {
  const { user, token, logout } = useAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFeedbacks = async (authToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchFeedbacks(authToken);
      setFeedbacks(data);
    } catch (loadError) {
      setFeedbacks([]);
      setError(loadError instanceof Error ? loadError.message : 'Không thể tải danh sách phản hồi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadFeedbacks(token);
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleDelete = async (id: string) => {
    if (!token || !window.confirm('Bạn có chắc muốn xóa phản hồi này?')) {
      return;
    }

    setDeletingId(id);
    setError(null);

    try {
      await deleteFeedback(id, token);
      setFeedbacks((current) => current.filter((item) => item.id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Xóa phản hồi thất bại');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen unimate-page-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-brand-sky/25 mb-4">
              <Shield className="w-4 h-4 text-brand-royal" />
              <span className="text-sm font-semibold text-brand-navy">Trang quản trị Admin</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">Quản lý phản hồi</h1>
            <p className="text-gray-600 mt-2">
              Xin chào, <span className="font-semibold text-brand-navy">{user?.name}</span> — xem và xóa feedback từ người dùng.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Tổng cộng <span className="font-bold text-brand-navy">{feedbacks.length}</span> phản hồi
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => token && loadFeedbacks(token)}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-2xl border border-brand-royal/25 bg-white px-4 py-2 text-sm font-semibold text-brand-navy"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Làm mới
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
              >
                Đăng xuất
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-brand-navy">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-brand-royal/25 bg-white/80 p-12 text-center text-gray-500">
              Chưa có phản hồi nào.
            </div>
          ) : (
            <div className="grid gap-4">
              {feedbacks.map((feedback) => (
                <article
                  key={feedback.id}
                  className="rounded-2xl sm:rounded-3xl border border-brand-sky/25 bg-white p-4 sm:p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900">{feedback.subject}</h2>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: feedback.rating }).map((_, index) => (
                            <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p><span className="font-semibold text-gray-800">Họ tên:</span> {feedback.name}</p>
                        <p><span className="font-semibold text-gray-800">Email:</span> {feedback.email}</p>
                        <p><span className="font-semibold text-gray-800">SĐT:</span> {feedback.phone}</p>
                        <p>
                          <span className="font-semibold text-gray-800">Thời gian:</span>{' '}
                          {new Date(feedback.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(feedback.id)}
                      disabled={deletingId === feedback.id}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                    >
                      {deletingId === feedback.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Xóa
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
