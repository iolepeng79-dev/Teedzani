import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'tourist' | 'business' | 'admin';
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
}

export default function ProtectedRoute({ children, role, status }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
        <div className="w-12 h-12 border-4 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && profile?.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  if (status && profile?.status !== status) {
    if (profile?.status === 'draft') return <Navigate to="/onboarding" />;
    if (profile?.status === 'pending') return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}
