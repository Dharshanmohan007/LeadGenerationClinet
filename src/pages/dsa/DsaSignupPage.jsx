import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import DsaAuthShell from '../../components/dsa/auth/DsaAuthShell';
import { evaluatePasswordStrength } from '../../config/dsa/enquiryConfig';
import { signupDsa } from '../../services/authService';

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export default function DsaSignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = evaluatePasswordStrength(formData.password);

  function updateField(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');

    if (formData.name.trim().length < 2) {
      return setError('Please enter your full name.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return setError('Please enter a valid email address.');
    }
    if (!INDIAN_MOBILE_REGEX.test(formData.mobile.trim())) {
      return setError(
        'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
      );
    }
    if (formData.city.trim().length < 2) {
      return setError('Please enter your city.');
    }
    if (!strength.isStrong) {
      return setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (!formData.acceptTerms) {
      return setError(
        'Please accept the Terms and Conditions and Privacy Policy.'
      );
    }

    setIsSubmitting(true);
    try {
      const response = await signupDsa({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        city: formData.city.trim(),
        companyName: formData.companyName.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.acceptTerms,
      });
      setSuccessMessage(
        response.message ||
          'Your DSA registration has been submitted successfully. Your account will be available after approval by the MUKTIVA administration team.'
      );
    } catch (signupError) {
      setError(
        signupError?.message ||
          'Unable to complete DSA registration. Please verify your details.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successMessage) {
    return (
      <DsaAuthShell
        title="Registration Submitted"
        subtitle="Pending MUKTIVA administration review"
      >
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lf-green-soft text-lf-green">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="text-sm leading-relaxed text-lf-ink font-medium">
            {successMessage}
          </p>
          <div className="rounded-xl border border-lf-line bg-lf-bg p-4 text-xs text-lf-muted">
            Once an authorized Super Admin activates your account, you will be
            able to sign in and connect Telegram notifications.
          </div>
          <Button to="/dsa/login" fullWidth>
            Proceed to DSA Sign In
          </Button>
        </div>
      </DsaAuthShell>
    );
  }

  return (
    <DsaAuthShell
      title="DSA Partner Registration"
      subtitle="Submit your details to request a MUKTIVA DSA portal account."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="dsa-reg-name" className="block text-xs font-bold text-[#34475d]">
            Full Name *
          </label>
          <input
            id="dsa-reg-name"
            type="text"
            required
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dsa-reg-email" className="block text-xs font-bold text-[#34475d]">
              Email Address *
            </label>
            <input
              id="dsa-reg-email"
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
            />
          </div>

          <div>
            <label htmlFor="dsa-reg-mobile" className="block text-xs font-bold text-[#34475d]">
              Mobile Number *
            </label>
            <input
              id="dsa-reg-mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              required
              placeholder="10-digit mobile"
              value={formData.mobile}
              onChange={(e) =>
                updateField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm tabular-nums text-lf-ink focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dsa-reg-city" className="block text-xs font-bold text-[#34475d]">
              City *
            </label>
            <input
              id="dsa-reg-city"
              type="text"
              required
              placeholder="Your operating city"
              value={formData.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
            />
          </div>

          <div>
            <label htmlFor="dsa-reg-company" className="block text-xs font-bold text-[#34475d]">
              Company / Business (Optional)
            </label>
            <input
              id="dsa-reg-company"
              type="text"
              placeholder="DSA firm or agency name"
              value={formData.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
            />
          </div>
        </div>

        <div>
          <label htmlFor="dsa-reg-password" className="block text-xs font-bold text-[#34475d]">
            Password *
          </label>
          <div className="relative mt-1.5">
            <input
              id="dsa-reg-password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
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
          {formData.password && (
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-lf-line">
                <div
                  className={`h-full transition-all ${strength.colorClass}`}
                  style={{ width: `${(strength.score / 5) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-lf-muted">
                Strength: <strong className="text-lf-navy">{strength.label}</strong> (8+ chars, upper, lower, number, symbol)
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="dsa-reg-confirm" className="block text-xs font-bold text-[#34475d]">
            Confirm Password *
          </label>
          <input
            id="dsa-reg-confirm"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none focus:ring-3 focus:ring-lf-green/15"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-lf-muted">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => updateField('acceptTerms', e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded accent-lf-green"
          />
          <span>
            I accept the MUKTIVA{' '}
            <Link to="/terms-and-conditions" className="font-bold text-lf-green underline">
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="font-bold text-lf-green underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

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
          {isSubmitting ? 'Submitting Registration...' : 'Submit DSA Registration'}
        </Button>

        <p className="pt-2 text-center text-xs text-lf-muted">
          Already registered?{' '}
          <Link
            to="/dsa/login"
            className="font-bold text-lf-green hover:text-lf-green-dark hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </DsaAuthShell>
  );
}
