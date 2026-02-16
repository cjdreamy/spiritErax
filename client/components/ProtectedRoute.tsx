import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthManager } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = AuthManager.isAuthenticated();

  useEffect(() => {
    // Check if session cookie is valid
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
      console.log('User not authenticated, redirecting to login');
    }
  }, []);

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
