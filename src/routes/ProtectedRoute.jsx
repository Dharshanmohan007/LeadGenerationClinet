import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';

/**
 * Protects dashboard and account routes against unauthenticated visitors.
 * Renders a loading indicator while session verification is in progress so
 * protected content never flashes prior to redirection.
 */
export default function ProtectedRoute({
  loginPath = '/dsa/login',
  children,
}) {
  const { isAuthenticated, isCheckingAuth } = useAuth();
  const location = useLocation();

  if (isCheckingAuth) {
    return <Loader fullScreen message="Verifying your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  return children || <Outlet />;
}
