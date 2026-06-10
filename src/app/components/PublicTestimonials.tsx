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
    <section id="testimonials" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-sky/8 via-white to-brand-mint/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy mb-4 sm:mb-6 px-2">
            Sinh viên nói gì về{' '}
            <span className="text-brand-navy">
              Unimate
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
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
          <div className="flex items-center justify-center py-20 text-brand-navy">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl sm:rounded-3xl border border-dashed border-brand-sky/30 bg-brand-sky/8 p-6 sm:p-12 text-center text-brand-navy/60 text-sm sm:text-base">
            Chưa có phản hồi nào. Hãy là đầu tiên gửi đánh giá tại mục{' '}
            <a href="/#feedback" className="font-semibold text-brand-royal hover:text-brand-sky">
              Góp ý
            </a>{' '}
            trên trang chủ!
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-8 bg-white/95 border-2 border-brand-sky/20 rounded-2xl sm:rounded-3xl hover:border-brand-mint/50 hover:shadow-2xl hover:shadow-brand-sky/15 transition-all sm:transform sm:hover:scale-105"
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
                    <p className="text-sm font-semibold text-brand-sky mb-2">{item.subject}</p>
                  )}
                  <p className="text-gray-700 leading-relaxed italic">&ldquo;{item.message}&rdquo;</p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-brand-royal/25 bg-white px-5 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-sky/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trang trước
                </button>

                <span className="sm:hidden text-center text-sm font-semibold text-brand-navy py-1">
                  Trang {page} / {totalPages}
                </span>

                <div className="hidden sm:flex items-center gap-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => goToPage(pageNumber)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition ${
                        pageNumber === page
                          ? 'unimate-btn-primary text-white shadow-lg shadow-brand-sky/20'
                          : 'border border-brand-royal/25 bg-white text-brand-navy hover:bg-brand-sky/10'
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
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-brand-royal/25 bg-white px-5 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-sky/10 disabled:cursor-not-allowed disabled:opacity-40"
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
