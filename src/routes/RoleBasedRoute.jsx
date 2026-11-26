import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader';
import Unauthorized from '../components/common/Unauthorized';
import { useAuth } from '../hooks/useAuth';

/**
 * Enforces strict role isolation between DSA ('dsa') and Super Admin ('super_admin')
 * portal routes. Never exposes protected content while checking auth or when the
 * authenticated user belongs to another role.
 */
export default function RoleBasedRoute({
  allowedRoles = [],
  loginPath = '/dsa/login',
  children,
}) {
  const { user, isAuthenticated, isCheckingAuth } = useAuth();
  const location = useLocation();

  if (isCheckingAuth) {
    return <Loader fullScreen message="Checking role permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return (
      <Unauthorized
        title="Portal Access Denied"
        message="You are signed in with a different role and do not have permission to view this portal area."
      />
    );
  }

  return children || <Outlet />;
}
