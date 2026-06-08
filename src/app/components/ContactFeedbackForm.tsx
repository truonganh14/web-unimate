import { FormEvent, useState } from 'react';
import { CheckCircle, Loader2, Send } from 'lucide-react';
import { sendContactFeedback } from '../api/contact';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export default function ContactFeedbackForm() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const message = await sendContactFeedback(form);
      setSuccess(message);
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Gửi góp ý thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-2">
            Họ và tên
          </label>
          <input
            id="contact-name"
            type="text"
            required
            maxLength={100}
            value={form.name}
            onChange={(event) => handleChange('name', event.target.value)}
            className="w-full rounded-2xl border border-brand-sky/25 px-4 py-3 outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/30"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={(event) => handleChange('email', event.target.value)}
            className="w-full rounded-2xl border border-brand-sky/25 px-4 py-3 outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/30"
            placeholder="sinhvien@fpt.edu.vn"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            id="contact-phone"
            type="tel"
            required
            maxLength={20}
            value={form.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            className="w-full rounded-2xl border border-brand-sky/25 px-4 py-3 outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/30"
            placeholder="0901234567"
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className="block text-sm font-semibold text-gray-700 mb-2">
            Tiêu đề
          </label>
          <input
            id="contact-subject"
            type="text"
            required
            maxLength={200}
            value={form.subject}
            onChange={(event) => handleChange('subject', event.target.value)}
            className="w-full rounded-2xl border border-brand-sky/25 px-4 py-3 outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/30"
            placeholder="Góp ý về Unimate"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-2">
          Nội dung góp ý
        </label>
        <textarea
          id="contact-message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          value={form.message}
          onChange={(event) => handleChange('message', event.target.value)}
          className="w-full rounded-2xl border border-brand-sky/25 px-4 py-3 outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/30 resize-none"
          placeholder="Chia sẻ trải nghiệm hoặc góp ý của bạn..."
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl unimate-btn-cta px-8 py-4 text-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            Gửi góp ý
            <Send className="h-5 w-5 transition group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
