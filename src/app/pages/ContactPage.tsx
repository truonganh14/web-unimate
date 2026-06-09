import { Link } from 'react-router';
import {
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from 'lucide-react';
import ContactFeedbackForm from '../components/ContactFeedbackForm';
import { UnimateLogo } from '../components/UnimateLogo';

const contactItems = [
  {
    icon: Mail,
    title: 'Email',
    value: 'unimate@fpt.edu.vn',
    href: 'mailto:unimate@fpt.edu.vn',
  },
  {
    icon: Phone,
    title: 'Hotline',
    value: '1900 636 636',
    href: 'tel:1900636636',
  },
  {
    icon: MapPin,
    title: 'Địa chỉ',
    value: 'FPT University — Khu Giáo dục và Đào tạo, Hòa Lạc, Hà Nội',
    href: null,
  },
  {
    icon: Clock,
    title: 'Giờ làm việc',
    value: 'Thứ 2 – Thứ 6: 8:00 – 17:30 | Thứ 7: 8:00 – 12:00',
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen unimate-page-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
          <UnimateLogo asLink size="md" />
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl border border-brand-royal/25 bg-white px-5 py-3 font-semibold text-brand-navy transition hover:bg-brand-sky/10"
          >
            Về trang chủ
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full border border-brand-sky/25 mb-6">
            <Phone className="w-5 h-5 text-brand-royal" />
            <span className="text-sm font-bold text-brand-navy">Liên hệ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy mb-3 sm:mb-4 px-2">
            Liên hệ với <span className="unimate-gradient-text">Unimate</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Đội ngũ Unimate luôn sẵn sàng hỗ trợ sinh viên FPT. Liên hệ trực tiếp qua các kênh bên dưới.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="rounded-3xl border border-brand-sky/25 bg-white p-6 shadow-sm h-full">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-sky/20 to-brand-mint/20 text-brand-royal">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 mb-1">{item.title}</h2>
                    <p className="text-gray-600 leading-relaxed">{item.value}</p>
                  </div>
                </div>
              </div>
            );

            return item.href ? (
              <a
                key={item.title}
                href={item.href}
                className="block transition hover:scale-[1.02]"
              >
                {content}
              </a>
            ) : (
              <div key={item.title}>{content}</div>
            );
          })}
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-brand-sky/25 bg-white p-4 sm:p-6 md:p-8 shadow-xl">
          <div className="text-center mb-8">
            <MessageSquare className="mx-auto h-10 w-10 text-brand-royal mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gửi góp ý</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Điền phiếu thông tin bên dưới, góp ý của bạn sẽ được gửi trực tiếp về email Unimate.
            </p>
          </div>
          <ContactFeedbackForm />
        </div>
      </div>
    </div>
  );
}
