import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../services/authService';

/**
 * Restricts portal login pages (/dsa/login, /super-admin/login) to
 * unauthenticated visitors. Authenticated DSA or Super Admin users are
 * redirected to their respective dashboards.
 */
export default function PublicOnlyRoute({ children }) {
  const { user, isAuthenticated, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <Loader fullScreen message="Checking session..." />;
  }

  if (isAuthenticated) {
    const destination =
      user?.role === USER_ROLES.SUPER_ADMIN
        ? '/super-admin/dashboard'
        : user?.role === USER_ROLES.DSA
          ? '/dsa/dashboard'
          : '/';

    return <Navigate to={destination} replace />;
  }

  return children || <Outlet />;
}
