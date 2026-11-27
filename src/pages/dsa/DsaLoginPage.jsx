import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Button from '../../components/common/Button';
import DsaAuthShell from '../../components/dsa/auth/DsaAuthShell';
import { useAuth } from '../../hooks/useAuth';

export default function DsaLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginDsa, sessionExpired, clearSessionExpired } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/dsa/dashboard';

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    clearSessionExpired();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError('Please enter both your registered email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginDsa({ email: trimmedEmail, password, rememberMe });
      navigate(redirectTo, { replace: true });
    } catch (authError) {
      setError(
        authError?.message || 'Unable to sign in. Please verify your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DsaAuthShell
      title="DSA Partner Sign In"
      subtitle="Sign in to access your MUKTIVA DSA dashboard and manage enquiries."
    >
      {sessionExpired && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-900"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <span>Your previous session expired. Please sign in again.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="dsa-login-email"
            className="block text-xs font-bold text-[#34475d]"
          >
            Email Address
          </label>
          <div className="relative mt-1.5">
            <Mail
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lf-muted"
              aria-hidden="true"
            />
            <input
              id="dsa-login-email"
              type="email"
              autoComplete="email"
              required
              placeholder="partner@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[9px] border border-[#d8e0e8] bg-white py-2.5 pl-10 pr-3.5 text-sm text-lf-ink placeholder:text-lf-muted focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="dsa-login-password"
              className="block text-xs font-bold text-[#34475d]"
            >
              Password
            </label>
            <Link
              to="/dsa/forgot-password"
              className="text-xs font-semibold text-lf-green hover:text-lf-green-dark"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Lock
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lf-muted"
              aria-hidden="true"
            />
            <input
              id="dsa-login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[9px] border border-[#d8e0e8] bg-white py-2.5 pl-10 pr-10 text-sm text-lf-ink placeholder:text-lf-muted focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lf-muted hover:text-lf-navy cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-xs text-lf-muted select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded accent-lf-green"
          />
          <span>Keep me signed in on this device for 30 days</span>
        </label>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-medium text-[#b42318]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          size="md"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'}
        </Button>

        <p className="pt-2 text-center text-xs text-lf-muted">
          New DSA partner?{' '}
          <Link
            to="/dsa/signup"
            className="font-bold text-lf-green hover:text-lf-green-dark hover:underline"
          >
            Register for a DSA account
          </Link>
        </p>
      </form>
    </DsaAuthShell>
  );
}
