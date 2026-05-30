import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Star } from 'lucide-react';
import { fetchPublicFeedbacks, type PublicFeedbackItem } from '../api/feedback';

const AVATARS = ['👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍💻', '🧑‍🎓'];

const PAGE_SIZE = 3;

function getAvatar(name: string, index: number) {
  return AVATARS[(name.charCodeAt(0) + index) % AVATARS.length];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function PublicTestimonials() {
  const [items, setItems] = useState<PublicFeedbackItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeedbacks = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchPublicFeedbacks(targetPage, PAGE_SIZE);
      setItems(result.items);
      setPage(result.pagination.page);
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);
    } catch (loadError) {
      setItems([]);
      setError(loadError instanceof Error ? loadError.message : 'Không thể tải đánh giá');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeedbacks(1);
  }, [loadFeedbacks]);

  useEffect(() => {
    const handleSubmitted = () => {
      loadFeedbacks(1);
      setPage(1);
    };

    window.addEventListener('feedback-submitted', handleSubmitted);
    return () => window.removeEventListener('feedback-submitted', handleSubmitted);
  }, [loadFeedbacks]);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }
    loadFeedbacks(nextPage);
    document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900 mb-6">
            Sinh viên nói gì về{' '}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Unimate
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            {total > 0
              ? `${total} phản hồi từ cộng đồng sinh viên FPT`
              : 'Hàng nghìn lời khen từ cộng đồng sinh viên FPT'}
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-purple-700">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-purple-200 bg-purple-50/50 p-12 text-center text-gray-500">
            Chưa có phản hồi nào. Hãy là đầu tiên gửi đánh giá ở mục Liên hệ bên dưới!
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-8 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 rounded-3xl hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl">{getAvatar(item.name, index)}</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  {item.subject && (
                    <p className="text-sm font-semibold text-purple-700 mb-2">{item.subject}</p>
                  )}
                  <p className="text-gray-700 leading-relaxed italic">&ldquo;{item.message}&rdquo;</p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-2 rounded-2xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trang trước
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => goToPage(pageNumber)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition ${
                        pageNumber === page
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                          : 'border border-purple-200 bg-white text-purple-700 hover:bg-purple-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-2 rounded-2xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Trang sau
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
