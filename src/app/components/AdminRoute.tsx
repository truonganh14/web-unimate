import { useEffect, type ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, token, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !token || user.role !== 'admin')) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, user, token, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-700" />
      </div>
    );
  }

  if (!user || !token || user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

export function AdminHomeRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return null;
}
