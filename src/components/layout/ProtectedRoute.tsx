import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children || <Outlet />}</>;
}
