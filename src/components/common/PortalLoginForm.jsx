import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Info, Landmark, Lock } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth';

/**
 * Reusable login screen for DSA and Super Admin portals.
 * Never simulates authentication: submits real credentials via the supplied
 * `onAuthenticate` callback to the backend auth service.
 */
export default function PortalLoginForm({
  badge,
  title,
  subtitle,
  endpointPath,
  defaultRedirectPath,
  onAuthenticate,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionExpired, clearSessionExpired } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget =
    location.state?.from?.pathname || defaultRedirectPath;

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    clearSessionExpired();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onAuthenticate({ email: trimmedEmail, password });
      navigate(redirectTarget, { replace: true });
    } catch (authError) {
      setError(
        authError?.message ||
          'Authentication failed. Please check your credentials and backend connectivity.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-lf-navy px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#cfdae5] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to LoanFlow Public Site
        </Link>

        <div className="rounded-3xl border border-lf-line bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.22)] sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lf-green text-white">
              <Landmark className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <span className="inline-block rounded-full bg-lf-green-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-lf-green-dark">
                {badge}
              </span>
              <h1 className="mt-1 text-xl font-bold text-lf-navy">{title}</h1>
            </div>
          </div>

          <p className="mt-3 text-sm text-lf-muted">{subtitle}</p>

          {/* Session Expired Banner */}
          {sessionExpired && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-900"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
              <span>
                Your previous session expired or became unauthorized. Please sign
                in again.
              </span>
            </div>
          )}

          {/* Future Backend Auth Integration Notice */}
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-lf-line bg-lf-notice-bg px-3.5 py-3 text-xs text-[#536579]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-lf-green" aria-hidden="true" />
            <span>
              Backend authentication endpoint{' '}
              <code className="font-semibold text-lf-navy">{endpointPath}</code>{' '}
              will validate credentials once server auth is connected.
            </span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="portal-email"
                className="block text-xs font-bold text-[#34475d]"
              >
                Email Address
              </label>
              <input
                id="portal-email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@company.example"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink placeholder:text-lf-muted focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
              />
            </div>

            <div>
              <label
                htmlFor="portal-password"
                className="block text-xs font-bold text-[#34475d]"
              >
                Password
              </label>
              <input
                id="portal-password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink placeholder:text-lf-muted focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-medium text-[#b42318]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#b42318]" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
