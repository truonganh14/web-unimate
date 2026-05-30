import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle, Loader2, LogIn, Send, Star } from 'lucide-react';
import { submitFeedback } from '../api/feedback';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  rating: 5,
};

export default function FeedbackForm() {
  const { user, token, isLoading } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (field: keyof typeof emptyForm, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError('Vui lòng đăng nhập để gửi phản hồi');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await submitFeedback(form, token);
      setSuccess(true);
      window.dispatchEvent(new CustomEvent('feedback-submitted'));
      setForm({
        ...emptyForm,
        name: user?.name ?? '',
        email: user?.email ?? '',
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Gửi phản hồi thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-purple-700">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="rounded-3xl border border-dashed border-purple-200 bg-purple-50/60 p-10 text-center">
        <LogIn className="mx-auto h-10 w-10 text-purple-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Cần đăng nhập để gửi phản hồi</h3>
        <p className="text-gray-600 mb-6">
          Vui lòng đăng nhập hoặc tạo tài khoản để chia sẻ góp ý với Unimate.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-bold text-white"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-2xl border border-purple-200 bg-white px-6 py-3 font-semibold text-purple-700"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Họ và tên
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={100}
            value={form.name}
            onChange={(event) => handleChange('name', event.target.value)}
            className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(event) => handleChange('email', event.target.value)}
            className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            placeholder="sinhvien@fpt.edu.vn"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            id="phone"
            type="tel"
            required
            maxLength={20}
            value={form.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            placeholder="0901234567"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
            Tiêu đề
          </label>
          <input
            id="subject"
            type="text"
            required
            maxLength={200}
            value={form.subject}
            onChange={(event) => handleChange('subject', event.target.value)}
            className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            placeholder="Góp ý về Unimate"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
          Nội dung phản hồi
        </label>
        <textarea
          id="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          value={form.message}
          onChange={(event) => handleChange('message', event.target.value)}
          className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 resize-none"
          placeholder="Chia sẻ trải nghiệm hoặc góp ý của bạn..."
        />
      </div>

      <div>
        <p className="block text-sm font-semibold text-gray-700 mb-3">Đánh giá</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleChange('rating', value)}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
                form.rating >= value
                  ? 'border-yellow-300 bg-yellow-50 text-yellow-500'
                  : 'border-purple-100 bg-white text-gray-300 hover:border-yellow-200'
              }`}
              aria-label={`${value} sao`}
            >
              <Star className={`h-5 w-5 ${form.rating >= value ? 'fill-yellow-400' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          Cảm ơn bạn! Phản hồi đã được gửi thành công.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-8 py-4 text-lg font-bold text-white transition hover:shadow-xl hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            Gửi phản hồi
            <Send className="h-5 w-5 transition group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
