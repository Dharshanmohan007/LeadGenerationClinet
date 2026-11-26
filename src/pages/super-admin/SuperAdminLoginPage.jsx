import PortalLoginForm from '../../components/common/PortalLoginForm';
import { useAuth } from '../../hooks/useAuth';

export default function SuperAdminLoginPage() {
  const { loginSuperAdmin } = useAuth();

  return (
    <PortalLoginForm
      badge="Company Administration"
      title="Super Admin Sign In"
      subtitle="Restricted access for MUKTIVA company administrators to manage enquiries and DSA accounts."
      endpointPath="POST /api/auth/super-admin/login"
      defaultRedirectPath="/super-admin/dashboard"
      onAuthenticate={loginSuperAdmin}
    />
  );
}
