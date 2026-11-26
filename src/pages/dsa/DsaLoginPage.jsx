import PortalLoginForm from '../../components/common/PortalLoginForm';
import { useAuth } from '../../hooks/useAuth';

export default function DsaLoginPage() {
  const { loginDsa } = useAuth();

  return (
    <PortalLoginForm
      badge="DSA Partner Portal"
      title="DSA Admin Sign In"
      subtitle="Access enquiries authorized and assigned to your DSA partner account."
      endpointPath="POST /api/auth/dsa/login"
      defaultRedirectPath="/dsa/dashboard"
      onAuthenticate={loginDsa}
    />
  );
}
