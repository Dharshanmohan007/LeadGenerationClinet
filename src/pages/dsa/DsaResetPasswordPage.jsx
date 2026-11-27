import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import DsaAuthShell from '../../components/dsa/auth/DsaAuthShell';
import { evaluatePasswordStrength } from '../../config/dsa/enquiryConfig';
import { resetPassword } from '../../services/authService';

export default function DsaResetPasswordPage() {
  const { token } = useParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = evaluatePasswordStrength(password);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');

    if (!strength.isStrong) {
      return setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword({ token, password, confirmPassword });
      setSuccessMessage(res.message);
    } catch (err) {
      setError(
        err?.message || 'Unable to reset password. Request a new reset link.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DsaAuthShell
      title="Reset Password"
      subtitle="Create a new strong password for your MUKTIVA DSA account."
    >
      {successMessage ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lf-green-soft text-lf-green">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm leading-relaxed text-lf-ink">{successMessage}</p>
          <Button to="/dsa/login" fullWidth>
            Sign In with New Password
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="dsa-reset-password"
              className="block text-xs font-bold text-[#34475d]"
            >
              New Password *
            </label>
            <div className="relative mt-1.5">
              <input
                id="dsa-reset-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter new strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 pr-10 text-sm text-lf-ink focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lf-muted hover:text-lf-navy cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-lf-line">
                  <div
                    className={`h-full transition-all ${strength.colorClass}`}
                    style={{ width: `${(strength.score / 5) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-lf-muted">
                  Strength: <strong className="text-lf-navy">{strength.label}</strong>
                </p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="dsa-reset-confirm"
              className="block text-xs font-bold text-[#34475d]"
            >
              Confirm New Password *
            </label>
            <input
              id="dsa-reset-confirm"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-medium text-[#b42318]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating Password...' : 'Reset Password'}
          </Button>

          <p className="pt-1 text-center text-xs text-lf-muted">
            <Link to="/dsa/login" className="font-bold text-lf-navy hover:underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      )}
    </DsaAuthShell>
  );
}
