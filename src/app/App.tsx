import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Sparkles, Clock, MessageCircle, Users, CheckCircle, ArrowRight, Zap, Shield, Brain, Star, ChevronRight, BarChart3, HeadphonesIcon, Rocket, Menu, X } from 'lucide-react';
import FeedbackForm from './components/FeedbackForm';
import PublicTestimonials from './components/PublicTestimonials';
import { AdminHomeRedirect } from './components/AdminRoute';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, logout, isLoading } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { href: '#features', label: 'Tính năng' },
    { href: '#testimonials', label: 'Đánh giá' },
    { href: '/chat', label: 'Trò chuyện', isRoute: true },
    { href: '/lien-he', label: 'Liên hệ', isRoute: true },
  ];

  const features = [
    {
      icon: Brain,
      title: 'Trí tuệ nhân tạo',
      description: 'Công nghệ AI tiên tiến, học hỏi và cải thiện liên tục từ mỗi cuộc hội thoại',
      gradient: 'from-brand-royal to-brand-sky',
      delay: '0'
    },
    {
      icon: Zap,
      title: 'Siêu tốc độ',
      description: 'Phản hồi trong < 3 giây, nhanh hơn gấp 100 lần so với phương pháp truyền thống',
      gradient: 'from-brand-amber to-brand-orange',
      delay: '100'
    },
    {
      icon: Clock,
      title: 'Không giới hạn',
      description: 'Phục vụ 24/7 cả ngày lẫn đêm, cuối tuần và ngày lễ - luôn sẵn sàng hỗ trợ bạn',
      gradient: 'from-brand-sky to-brand-mint',
      delay: '200'
    },
    {
      icon: Shield,
      title: 'Tin cậy tuyệt đối',
      description: 'Độ chính xác 98%, dữ liệu được kiểm duyệt bởi phòng Dịch vụ Sinh viên',
      gradient: 'from-brand-navy to-brand-royal',
      delay: '300'
    }
  ];

  const stats = [
    {
      icon: Users,
      number: '12,000+',
      label: 'Sinh viên tin dùng',
      gradient: 'from-brand-royal to-brand-sky'
    },
    {
      icon: MessageCircle,
      number: '50,000+',
      label: 'Câu hỏi đã giải đáp',
      gradient: 'from-brand-amber to-brand-orange'
    },
    {
      icon: BarChart3,
      number: '98%',
      label: 'Độ hài lòng',
      gradient: 'from-brand-sky to-brand-mint'
    },
    {
      icon: Zap,
      number: '2.8s',
      label: 'Thời gian phản hồi',
      gradient: 'from-brand-navy to-brand-royal'
    }
  ];

  const procedures = [
    { name: 'Đăng ký học phần', icon: '📚' },
    { name: 'Giấy chứng nhận SV', icon: '📄' },
    { name: 'Hoãn thi / Thi lại', icon: '📝' },
    { name: 'Nghỉ học / Bảo lưu', icon: '⏸️' },
    { name: 'Điểm danh & Điểm số', icon: '📊' },
    { name: 'Học phí & Học bổng', icon: '💰' },
    { name: 'Chuyển ngành / Khu', icon: '🔄' },
    { name: 'Thực tập & Tốt nghiệp', icon: '🎓' }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <AdminHomeRedirect />
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
        scrollY > 50 || mobileMenuOpen ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-brand-sky/10 border-b border-brand-sky/15' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0" onClick={closeMobileMenu}>
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-royal via-brand-sky to-brand-mint rounded-xl sm:rounded-2xl blur-lg opacity-60"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-royal via-brand-sky to-brand-mint rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-brand-sky/30">
                  <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-xl sm:text-2xl font-black unimate-gradient-text block truncate">
                  Unimate
                </span>
                <p className="hidden sm:block text-xs text-gray-500 -mt-1">Your University Mate</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link key={link.href} to={link.href} className="text-brand-navy/80 hover:text-brand-sky font-semibold transition-colors">
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.href} href={link.href} className="text-brand-navy/80 hover:text-brand-sky font-semibold transition-colors">
                    {link.label}
                  </a>
                )
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {!isLoading && (
                user ? (
                  <>
                    <span className="hidden lg:inline text-sm font-semibold text-gray-700 max-w-[140px] truncate">
                      Xin chào, {user.name}
                    </span>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="px-4 py-2 rounded-2xl border border-brand-royal/25 text-brand-navy font-semibold hover:bg-brand-royal/10 transition"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={logout}
                      className="px-4 py-2 rounded-2xl border border-brand-royal/25 text-brand-navy font-semibold hover:bg-brand-royal/10 transition"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-2 rounded-2xl text-brand-navy font-semibold hover:bg-brand-royal/10 transition"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-3 unimate-btn-cta rounded-2xl font-bold transition-all transform hover:scale-105"
                    >
                      Đăng ký
                    </Link>
                  </>
                )
              )}
            </div>

            <button
              type="button"
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-sky/25 bg-white text-brand-navy"
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 top-16 z-40 bg-brand-navy/30 md:hidden"
              aria-label="Đóng menu"
              onClick={closeMobileMenu}
            />
            <div className="fixed inset-x-0 top-16 z-50 md:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-brand-sky/15 bg-white/98 px-4 py-5 shadow-xl backdrop-blur-xl">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) =>
                  link.isRoute ? (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={closeMobileMenu}
                      className="rounded-2xl px-4 py-3.5 text-base font-semibold text-brand-navy hover:bg-brand-sky/10"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="rounded-2xl px-4 py-3.5 text-base font-semibold text-brand-navy hover:bg-brand-sky/10"
                    >
                      {link.label}
                    </a>
                  )
                )}
              </div>

              {!isLoading && (
                <div className="mt-4 flex flex-col gap-3 border-t border-brand-sky/15 pt-4">
                  {user ? (
                    <>
                      <p className="px-4 text-sm font-semibold text-brand-navy/70 truncate">
                        Xin chào, {user.name}
                      </p>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={closeMobileMenu}
                          className="rounded-2xl border border-brand-royal/25 px-4 py-3.5 text-center font-semibold text-brand-navy"
                        >
                          Trang Admin
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                        className="rounded-2xl border border-brand-royal/25 px-4 py-3.5 font-semibold text-brand-navy"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="rounded-2xl border border-brand-sky/25 px-4 py-3.5 text-center font-semibold text-brand-navy"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className="unimate-btn-cta rounded-2xl px-4 py-3.5 text-center font-bold"
                      >
                        Đăng ký miễn phí
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 unimate-hero-bg">
          <div className="absolute top-10 left-0 w-48 h-48 sm:w-80 sm:h-80 bg-brand-sky/45 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute top-24 right-0 w-40 h-40 sm:w-72 sm:h-72 bg-brand-mint/40 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="hidden sm:block absolute -bottom-10 left-1/3 w-96 h-96 bg-brand-royal/25 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex max-w-full items-center gap-2 px-4 sm:px-5 py-2 bg-white/90 backdrop-blur-sm rounded-full mb-6 sm:mb-8 shadow-lg shadow-brand-sky/15 border border-brand-sky/25">
                <div className="w-2 h-2 shrink-0 bg-brand-mint rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-bold unimate-gradient-text truncate">
                  Đang phục vụ 12,000+ sinh viên FPT
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-brand-navy mb-4 sm:mb-6 leading-tight">
                Gặp gỡ
                <span className="block unimate-gradient-text mt-1 sm:mt-2">
                  Unimate
                </span>
              </h1>

              <p className="text-base sm:text-xl md:text-2xl text-brand-navy/70 mb-8 sm:mb-10 leading-relaxed">
                Người bạn đồng hành AI thông minh của bạn —
                <span className="font-bold text-brand-royal"> giải đáp mọi thắc mắc</span> về thủ tục hành chính
                <span className="font-bold text-brand-sky"> 24/7</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-12">
                <Link
                  to="/chat"
                  className="group w-full sm:w-auto min-h-[52px] px-6 sm:px-8 py-4 sm:py-5 unimate-btn-cta rounded-2xl font-bold text-base sm:text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
                  Trải nghiệm ngay
                </Link>
                <Link
                  to="/chat"
                  className="w-full sm:w-auto min-h-[52px] px-6 sm:px-8 py-4 sm:py-5 bg-white hover:bg-brand-sky/5 text-brand-navy rounded-2xl font-bold text-base sm:text-lg border-2 border-brand-sky/30 hover:border-brand-sky transition-all shadow-lg shadow-brand-sky/10 flex items-center justify-center"
                >
                  Xem demo 2 phút
                </Link>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:flex lg:flex-wrap lg:gap-6 justify-center lg:justify-start">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 sm:gap-3 rounded-2xl bg-white/70 p-3 sm:bg-transparent sm:p-0 border border-brand-sky/10 sm:border-0">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-lg sm:text-2xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                          {stat.number}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 leading-snug">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Chat Preview */}
            <div className="relative mt-4 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-sky/40 via-brand-mint/30 to-brand-royal/30 rounded-2xl sm:rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-brand-sky/20 border border-brand-sky/25 overflow-hidden lg:transform lg:hover:scale-[1.02] transition-transform">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-brand-royal via-brand-sky to-brand-mint px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-brand-royal" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-mint border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Unimate</h3>
                      <p className="text-xs text-white/80">Luôn sẵn sàng hỗ trợ bạn</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 sm:p-6 space-y-4 h-[280px] sm:h-[360px] md:h-[450px] overflow-y-auto bg-gradient-to-b from-brand-sky/5 to-white">
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-royal to-brand-sky rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-sky/20">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-md shadow-md max-w-[85%] border border-brand-royal/20">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        👋 Xin chào! Mình là <span className="font-bold text-brand-royal">Unimate</span>,
                        trợ lý AI của bạn tại FPT University. Mình có thể giúp bạn với mọi thủ tục hành chính.
                        Bạn cần tìm hiểu về gì nhỉ?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="bg-gradient-to-r from-brand-sky to-brand-royal px-5 py-4 rounded-3xl rounded-tr-md shadow-md shadow-brand-sky/25 max-w-[85%]">
                      <p className="text-sm text-white leading-relaxed">
                        Mình muốn biết cách đăng ký học phần cho kỳ tới
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '1s' }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-royal to-brand-sky rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-md shadow-md max-w-[85%] border border-brand-royal/20">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        Tuyệt vời! Để đăng ký học phần, bạn làm theo các bước sau nhé:<br/><br/>

                        <span className="font-semibold text-brand-sky">📱 Bước 1:</span> Truy cập hệ thống FAP (fap.fpt.edu.vn)<br/>
                        <span className="font-semibold text-brand-royal">📚 Bước 2:</span> Chọn mục "Đăng ký học phần"<br/>
                        <span className="font-semibold text-brand-royal">✅ Bước 3:</span> Chọn học kỳ và môn học mong muốn<br/>
                        <span className="font-semibold text-brand-royal">🎯 Bước 4:</span> Kiểm tra và xác nhận đăng ký<br/><br/>

                        ⏰ Lưu ý: Đăng ký trước 23:59 ngày cuối để tránh trễ hạn nhé!
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end animate-fade-in" style={{ animationDelay: '1.5s' }}>
                    <div className="bg-gradient-to-r from-brand-amber to-brand-orange px-5 py-4 rounded-3xl rounded-tr-md shadow-md shadow-brand-orange/25 max-w-[85%]">
                      <p className="text-sm text-white leading-relaxed">
                        Cảm ơn bạn! Rất chi tiết và dễ hiểu 🙌
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Suggestions */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2 font-medium">💡 Gợi ý cho bạn:</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <button className="px-3 py-1.5 bg-white border border-brand-sky/30 hover:border-brand-sky hover:bg-brand-sky/5 rounded-full text-xs text-brand-navy whitespace-nowrap transition-all hover:shadow-md">
                      Xin giấy chứng nhận
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-brand-sky/30 hover:border-brand-sky hover:bg-brand-sky/5 rounded-full text-xs text-brand-navy whitespace-nowrap transition-all hover:shadow-md">
                      Tra cứu điểm
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-brand-sky/30 hover:border-brand-sky hover:bg-brand-sky/5 rounded-full text-xs text-brand-navy whitespace-nowrap transition-all hover:shadow-md">
                      Học phí
                    </button>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Hỏi Unimate bất cứ điều gì..."
                      className="flex-1 px-5 py-3 bg-brand-sky/5 border border-brand-sky/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent text-sm"
                      disabled
                    />
                    <button className="w-12 h-12 unimate-btn-primary hover:shadow-lg rounded-2xl flex items-center justify-center transition-all transform hover:scale-105">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 unimate-section-sky">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-mint/20 border border-brand-mint/30 rounded-full mb-4">
              <Star className="w-4 h-4 text-brand-amber" />
              <span className="text-sm font-bold text-brand-royal">Tại sao chọn Unimate?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy mb-4 sm:mb-6">
              Công nghệ <span className="unimate-gradient-text">dẫn đầu</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Được xây dựng với công nghệ AI tiên tiến nhất, mang đến trải nghiệm vượt trội cho sinh viên FPT
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-5 sm:p-8 bg-white/90 border-2 border-brand-sky/15 hover:border-brand-sky/40 rounded-2xl sm:rounded-3xl hover:shadow-2xl hover:shadow-brand-sky/15 transition-all duration-300 cursor-pointer sm:transform sm:hover:scale-105"
                  style={{ animationDelay: `${feature.delay}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Procedures Section */}
      <section id="benefits" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 unimate-section-mint">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy mb-4 sm:mb-6">
              Hỗ trợ <span className="unimate-gradient-text">toàn diện</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Unimate thành thạo tất cả các thủ tục hành chính tại FPT University
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {procedures.map((procedure, index) => (
              <div
                key={index}
                className="group px-4 sm:px-6 py-4 sm:py-5 bg-white/90 backdrop-blur-sm border-2 border-brand-sky/20 hover:border-brand-mint rounded-2xl hover:shadow-xl hover:shadow-brand-sky/10 transition-all cursor-pointer sm:transform sm:hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl group-hover:scale-125 transition-transform">{procedure.icon}</span>
                  <span className="text-brand-navy font-semibold group-hover:text-brand-sky transition-colors">
                    {procedure.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicTestimonials />

      {/* Feedback Section */}
      <section id="feedback" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-brand-sky/8 to-brand-royal/6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-brand-sky/15 border border-brand-sky/25 rounded-full mb-6">
              <HeadphonesIcon className="w-5 h-5 text-brand-royal" />
              <span className="text-sm font-bold text-brand-navy">Góp ý & Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4 px-2">
              Chia sẻ trải nghiệm với chúng tôi
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Gửi phản hồi, góp ý để đội ngũ Unimate cải thiện dịch vụ tốt hơn cho sinh viên.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-brand-sky/25 bg-white/95 p-4 sm:p-6 md:p-8 shadow-xl shadow-brand-sky/10 backdrop-blur-sm">
            <FeedbackForm />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 unimate-cta-bg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-sky/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-mint/15 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <Rocket className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white">Miễn phí 100% - Không cần đăng ký</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8 leading-tight px-2">
            Sẵn sàng trải nghiệm<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>tương lai của hỗ trợ sinh viên?
          </h2>

          <p className="text-base sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Hàng nghìn sinh viên đã tiết kiệm hàng trăm giờ với Unimate. Đến lượt bạn!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12">
            <Link
              to="/chat"
              className="group w-full sm:w-auto min-h-[52px] px-6 sm:px-10 py-4 sm:py-6 unimate-btn-cta rounded-2xl font-black text-base sm:text-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              Trò chuyện với Unimate ngay
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 md:gap-8 text-white/80 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Không cần cài đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Miễn phí vĩnh viễn</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Bảo mật tuyệt đối</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-brand-navy pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-royal via-brand-sky to-brand-mint rounded-2xl flex items-center justify-center shadow-lg shadow-brand-sky/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black text-white">Unimate</span>
                <p className="text-xs text-brand-sky/80">Your University Mate</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              <a href="#" className="text-white/60 hover:text-brand-mint transition-colors text-sm sm:text-base">Về chúng tôi</a>
              <Link to="/lien-he" className="text-white/60 hover:text-brand-mint transition-colors text-sm sm:text-base">Liên hệ</Link>
              <a href="#" className="text-white/60 hover:text-brand-mint transition-colors text-sm sm:text-base">Điều khoản</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2026 Unimate - Powered by FPT University. Made with 💚 for students.
            </p>
            <Link
              to="/admin"
              className="mt-3 inline-block text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
