import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import Button from '../../components/common/Button';
import DsaAuthShell from '../../components/dsa/auth/DsaAuthShell';
import { forgotPassword } from '../../services/authService';

export default function DsaForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return setError('Please enter your registered email address.');
    }

    setIsSubmitting(true);
    try {
      const res = await forgotPassword(trimmed);
      setSubmittedMessage(res.message);
    } catch (err) {
      setError(err?.message || 'Unable to process reset request.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DsaAuthShell
      title="Forgot Password"
      subtitle="Enter your registered DSA email address to request a password reset."
    >
      {submittedMessage ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lf-green-soft text-lf-green">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm leading-relaxed text-lf-ink">{submittedMessage}</p>
          <Button to="/dsa/login" variant="outline" fullWidth>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="dsa-forgot-email"
              className="block text-xs font-bold text-[#34475d]"
            >
              Registered Email Address
            </label>
            <div className="relative mt-1.5">
              <Mail
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lf-muted"
                aria-hidden="true"
              />
              <input
                id="dsa-forgot-email"
                type="email"
                required
                placeholder="partner@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[9px] border border-[#d8e0e8] py-2.5 pl-10 pr-3.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
              />
            </div>
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
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/dsa/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-lf-navy hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to DSA Sign In
            </Link>
          </div>
        </form>
      )}
    </DsaAuthShell>
  );
}
