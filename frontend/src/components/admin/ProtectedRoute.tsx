import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;