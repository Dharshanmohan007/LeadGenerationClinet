import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../services/authService';

export default function Unauthorized({
  title = 'Access Restricted',
  message = 'Your current account role does not have permission to view this portal section.',
}) {
  const { role } = useAuth();

  const portalHome =
    role === USER_ROLES.SUPER_ADMIN
      ? '/super-admin/dashboard'
      : role === USER_ROLES.DSA
        ? '/dsa/dashboard'
        : '/';

  const portalLabel =
    role === USER_ROLES.SUPER_ADMIN
      ? 'Return to Super Admin Dashboard'
      : role === USER_ROLES.DSA
        ? 'Return to DSA Dashboard'
        : 'Return to Home';

  return (
    <div className="min-h-screen flex items-center justify-center bg-lf-bg px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-[0_18px_55px_rgba(16,37,65,0.09)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-[#b42318]">
          <ShieldAlert className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#b42318]">
          403 &bull; Unauthorized Route
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-lf-navy">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-lf-muted">{message}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button to={portalHome} variant="secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {portalLabel}
          </Button>
          <Button to="/" variant="outline">
            LoanFlow Public Site
          </Button>
        </div>
      </div>
    </div>
  );
}
