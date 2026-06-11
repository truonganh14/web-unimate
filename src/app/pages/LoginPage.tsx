import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UnimateLogo } from '../components/UnimateLogo';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const loggedInUser = await login(email.trim(), password);
      navigate(loggedInUser.role === 'admin' ? '/admin' : '/');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Đăng nhập thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen unimate-page-bg flex items-center justify-center px-4 py-8 sm:py-12 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <UnimateLogo asLink size="lg" center />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Đăng nhập</h1>
          <p className="text-gray-600 mt-2">Chào mừng bạn quay lại Unimate</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl sm:rounded-3xl border border-brand-sky/25 bg-white p-5 sm:p-8 shadow-xl space-y-5"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-brand-sky/25 px-4 py-3 outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/30"
              placeholder="sinhvien@fpt.edu.vn"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-brand-sky/25 px-4 py-3 outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/30"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl unimate-btn-primary px-4 py-3 font-bold text-white disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-brand-royal hover:text-brand-sky">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
