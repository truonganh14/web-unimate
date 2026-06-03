import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Bot, Sparkles, Clock, MessageCircle, Users, CheckCircle, ArrowRight, Zap, Shield, Brain, Star, ChevronRight, Globe, BarChart3, HeadphonesIcon, Rocket } from 'lucide-react';
import FeedbackForm from './components/FeedbackForm';
import PublicTestimonials from './components/PublicTestimonials';
import { AdminHomeRedirect } from './components/AdminRoute';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'Trí tuệ nhân tạo',
      description: 'Công nghệ AI tiên tiến, học hỏi và cải thiện liên tục từ mỗi cuộc hội thoại',
      gradient: 'from-violet-500 to-purple-600',
      delay: '0'
    },
    {
      icon: Zap,
      title: 'Siêu tốc độ',
      description: 'Phản hồi trong < 3 giây, nhanh hơn gấp 100 lần so với phương pháp truyền thống',
      gradient: 'from-amber-500 to-orange-600',
      delay: '100'
    },
    {
      icon: Clock,
      title: 'Không giới hạn',
      description: 'Phục vụ 24/7 cả ngày lẫn đêm, cuối tuần và ngày lễ - luôn sẵn sàng hỗ trợ bạn',
      gradient: 'from-cyan-500 to-blue-600',
      delay: '200'
    },
    {
      icon: Shield,
      title: 'Tin cậy tuyệt đối',
      description: 'Độ chính xác 98%, dữ liệu được kiểm duyệt bởi phòng Dịch vụ Sinh viên',
      gradient: 'from-emerald-500 to-green-600',
      delay: '300'
    }
  ];

  const stats = [
    {
      icon: Users,
      number: '12,000+',
      label: 'Sinh viên tin dùng',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: MessageCircle,
      number: '50,000+',
      label: 'Câu hỏi đã giải đáp',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      icon: BarChart3,
      number: '98%',
      label: 'Độ hài lòng',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Zap,
      number: '2.8s',
      label: 'Thời gian phản hồi',
      gradient: 'from-emerald-500 to-green-600'
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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/90 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform">
                  <Sparkles className="w-7 h-7 text-white transform -rotate-6" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Unimate
                </span>
                <p className="text-xs text-gray-500 -mt-1">Your University Mate</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Tính năng</a>
              <a href="#benefits" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Lợi ích</a>
              <a href="#testimonials" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Đánh giá</a>
              <a href="#contact" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Liên hệ</a>
            </div>
            <div className="flex items-center gap-3">
              {!isLoading && (
                user ? (
                  <>
                    <span className="hidden sm:inline text-sm font-semibold text-gray-700">
                      Xin chào, {user.name}
                    </span>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="px-4 py-2 rounded-2xl border border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={logout}
                      className="px-4 py-2 rounded-2xl border border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-2 rounded-2xl text-purple-700 font-semibold hover:bg-purple-50 transition"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-xl hover:shadow-purple-500/50 text-white rounded-2xl font-bold transition-all transform hover:scale-105"
                    >
                      Đăng ký
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-8 shadow-lg border border-purple-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Đang phục vụ 12,000+ sinh viên FPT
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                Gặp gỡ
                <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mt-2">
                  Unimate
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
                Người bạn đồng hành AI thông minh của bạn -
                <span className="font-semibold text-purple-600"> Giải đáp mọi thắc mắc</span> về thủ tục hành chính
                <span className="font-semibold text-purple-600"> 24/7</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link
                      to="/chat"
                      className="group px-8 py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-2xl hover:shadow-purple-500/50 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <Rocket className="w-6 h-6 group-hover:translate-y-[-4px] transition-transform" />
                      Trải nghiệm ngay
                    </Link>
                    <button className="px-8 py-5 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-purple-300 transition-all shadow-lg">
                      Xem demo 2 phút
                    </button>
              </div>

              {/* Mini Stats */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className={`text-2xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                          {stat.number}
                        </div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Chat Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100 overflow-hidden transform hover:scale-[1.02] transition-transform">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-purple-600" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Unimate</h3>
                      <p className="text-xs text-purple-100">Luôn sẵn sàng hỗ trợ bạn</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-4 h-[450px] overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-md shadow-md max-w-[85%] border border-purple-100">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        👋 Xin chào! Mình là <span className="font-bold text-purple-600">Unimate</span>,
                        trợ lý AI của bạn tại FPT University. Mình có thể giúp bạn với mọi thủ tục hành chính.
                        Bạn cần tìm hiểu về gì nhỉ?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4 rounded-3xl rounded-tr-md shadow-md max-w-[85%]">
                      <p className="text-sm text-white leading-relaxed">
                        Mình muốn biết cách đăng ký học phần cho kỳ tới
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '1s' }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-md shadow-md max-w-[85%] border border-purple-100">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        Tuyệt vời! Để đăng ký học phần, bạn làm theo các bước sau nhé:<br/><br/>

                        <span className="font-semibold text-purple-600">📱 Bước 1:</span> Truy cập hệ thống FAP (fap.fpt.edu.vn)<br/>
                        <span className="font-semibold text-purple-600">📚 Bước 2:</span> Chọn mục "Đăng ký học phần"<br/>
                        <span className="font-semibold text-purple-600">✅ Bước 3:</span> Chọn học kỳ và môn học mong muốn<br/>
                        <span className="font-semibold text-purple-600">🎯 Bước 4:</span> Kiểm tra và xác nhận đăng ký<br/><br/>

                        ⏰ Lưu ý: Đăng ký trước 23:59 ngày cuối để tránh trễ hạn nhé!
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end animate-fade-in" style={{ animationDelay: '1.5s' }}>
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4 rounded-3xl rounded-tr-md shadow-md max-w-[85%]">
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
                    <button className="px-3 py-1.5 bg-white border border-purple-200 hover:border-purple-400 rounded-full text-xs text-gray-700 whitespace-nowrap transition-all hover:shadow-md">
                      Xin giấy chứng nhận
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-purple-200 hover:border-purple-400 rounded-full text-xs text-gray-700 whitespace-nowrap transition-all hover:shadow-md">
                      Tra cứu điểm
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-purple-200 hover:border-purple-400 rounded-full text-xs text-gray-700 whitespace-nowrap transition-all hover:shadow-md">
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
                      className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      disabled
                    />
                    <button className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:shadow-lg rounded-2xl flex items-center justify-center transition-all transform hover:scale-105">
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
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
              <Star className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-600">Tại sao chọn Unimate?</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Công nghệ dẫn đầu
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Được xây dựng với công nghệ AI tiên tiến nhất, mang đến trải nghiệm vượt trội cho sinh viên FPT
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-purple-200 rounded-3xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Hỗ trợ <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">toàn diện</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unimate thành thạo tất cả các thủ tục hành chính tại FPT University
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {procedures.map((procedure, index) => (
              <div
                key={index}
                className="group px-6 py-5 bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-400 rounded-2xl hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl group-hover:scale-125 transition-transform">{procedure.icon}</span>
                  <span className="text-gray-800 font-semibold group-hover:text-purple-600 transition-colors">
                    {procedure.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicTestimonials />

      {/* Contact / Feedback Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-purple-100 rounded-full mb-6">
              <HeadphonesIcon className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-bold text-purple-700">Liên hệ & Góp ý</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Chia sẻ trải nghiệm với chúng tôi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gửi phản hồi, góp ý hoặc thông tin liên hệ để đội ngũ Unimate cải thiện dịch vụ tốt hơn cho sinh viên.
            </p>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
            <FeedbackForm />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <Rocket className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white">Miễn phí 100% - Không cần đăng ký</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
            Sẵn sàng trải nghiệm<br/>
            tương lai của hỗ trợ sinh viên?
          </h2>

          <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Hàng nghìn sinh viên đã tiết kiệm hàng trăm giờ với Unimate. Đến lượt bạn!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/chat"
              className="group px-10 py-6 bg-white hover:bg-gray-50 text-purple-600 rounded-2xl font-black text-xl transition-all shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 transform hover:scale-105"
            >
              Trò chuyện với Unimate ngay
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-white/80">
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
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black text-white">Unimate</span>
                <p className="text-xs text-gray-400">Your University Mate</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Về chúng tôi</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Liên hệ</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Điều khoản</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2026 Unimate - Powered by FPT University. Made with 💜 for students.
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
