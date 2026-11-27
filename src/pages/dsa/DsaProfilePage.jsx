import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Save,
  UserCheck,
} from 'lucide-react';
import Button from '../../components/common/Button';
import TelegramNotificationSettings from '../../components/common/TelegramNotificationSettings';
import DsaLayout from '../../components/dsa/layout/DsaLayout';
import {
  evaluatePasswordStrength,
  formatDateTime,
} from '../../config/dsa/enquiryConfig';
import { useAuth } from '../../hooks/useAuth';
import { changePassword } from '../../services/authService';
import {
  getDsaProfile,
  updateDsaProfile,
} from '../../services/dsa/dsaService';

export default function DsaProfilePage() {
  const { user, checkSession, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(user);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');

  // Personal Information Edit Form
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    city: user?.city || '',
    companyName: user?.companyName || '',
  });
  const [editFeedback, setEditFeedback] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change Password Form
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [pwFeedback, setPwFeedback] = useState(null);
  const [isChangingPw, setIsChangingPw] = useState(false);

  const strength = evaluatePasswordStrength(pwForm.newPassword);

  const loadProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    setProfileError('');
    try {
      const data = await getDsaProfile();
      setProfile(data);
      setEditForm({
        name: data.name || '',
        mobile: data.mobile || '',
        city: data.city || '',
        companyName: data.companyName || '',
      });
    } catch (err) {
      setProfileError(err?.message || 'Unable to load DSA profile.');
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleProfileSave(event) {
    event.preventDefault();
    if (isSavingProfile) return;
    setEditFeedback(null);

    if (editForm.name.trim().length < 2) {
      return setEditFeedback({
        type: 'error',
        message: 'Full name must be at least 2 characters.',
      });
    }
    if (!/^[6-9]\d{9}$/.test(editForm.mobile.trim())) {
      return setEditFeedback({
        type: 'error',
        message:
          'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
      });
    }
    if (editForm.city.trim().length < 2) {
      return setEditFeedback({
        type: 'error',
        message: 'City must be at least 2 characters.',
      });
    }

    setIsSavingProfile(true);
    try {
      const res = await updateDsaProfile({
        name: editForm.name.trim(),
        mobile: editForm.mobile.trim(),
        city: editForm.city.trim(),
        companyName: editForm.companyName.trim(),
      });
      setProfile(res.user);
      setEditFeedback({ type: 'success', message: res.message });
      checkSession();
    } catch (err) {
      setEditFeedback({
        type: 'error',
        message: err?.message || 'Unable to save profile.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleChangePasswordSubmit(event) {
    event.preventDefault();
    if (isChangingPw) return;
    setPwFeedback(null);

    if (!pwForm.currentPassword) {
      return setPwFeedback({
        type: 'error',
        message: 'Please enter your current password.',
      });
    }
    if (!strength.isStrong) {
      return setPwFeedback({
        type: 'error',
        message:
          'New password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      });
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return setPwFeedback({
        type: 'error',
        message: 'New passwords do not match.',
      });
    }

    setIsChangingPw(true);
    try {
      const res = await changePassword(pwForm);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwFeedback({ type: 'success', message: res.message });
    } catch (err) {
      setPwFeedback({
        type: 'error',
        message: err?.message || 'Unable to change password.',
      });
    } finally {
      setIsChangingPw(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/dsa/login', { replace: true });
  }

  const initials = (profile?.name || 'DSA')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  return (
    <DsaLayout
      pageTitle="DSA Profile & Settings"
      pageSubtitle="Manage your account details, password, and Telegram notifications"
    >
      <div className="space-y-6">
        {profileError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-[#b42318]">
            {profileError}
          </div>
        )}

        {/* Section A: Profile Overview */}
        <section className="rounded-2xl border border-lf-line bg-white p-6 shadow-2xs sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-lf-line pb-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-lf-navy text-xl font-extrabold text-white">
                {initials}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-lf-navy">
                    {isLoadingProfile ? 'Loading...' : profile?.name}
                  </h2>
                  <span className="rounded-full bg-lf-green-soft px-2.5 py-0.5 text-xs font-bold text-lf-green-dark ring-1 ring-lf-green-border">
                    DSA Partner
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold uppercase text-emerald-700">
                    {profile?.status || 'active'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-lf-muted">{profile?.email}</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </Button>
          </div>

          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-lf-bg p-4">
              <dt className="text-xs font-medium text-lf-muted">Mobile</dt>
              <dd className="tabular-nums mt-1 font-bold text-lf-navy">
                {profile?.mobile || '—'}
              </dd>
            </div>
            <div className="rounded-xl bg-lf-bg p-4">
              <dt className="text-xs font-medium text-lf-muted">City / Firm</dt>
              <dd className="mt-1 font-bold text-lf-navy">
                {[profile?.city, profile?.companyName].filter(Boolean).join(' • ') || '—'}
              </dd>
            </div>
            <div className="rounded-xl bg-lf-bg p-4">
              <dt className="text-xs font-medium text-lf-muted">
                Registration Date
              </dt>
              <dd className="mt-1 font-bold text-lf-navy">
                {formatDateTime(profile?.createdAt)}
              </dd>
            </div>
            <div className="rounded-xl bg-lf-bg p-4">
              <dt className="text-xs font-medium text-lf-muted">Last Login</dt>
              <dd className="mt-1 font-bold text-lf-navy">
                {formatDateTime(profile?.lastLoginAt)}
              </dd>
            </div>
          </dl>
        </section>

        {/* Section B & C Grid: Personal Information + Change Password */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Edit Personal Information */}
          <section className="rounded-2xl border border-lf-line bg-white p-6 shadow-2xs">
            <div className="flex items-center gap-2.5 border-b border-lf-line pb-4">
              <UserCheck className="h-5 w-5 text-lf-green" aria-hidden="true" />
              <h2 className="text-lg font-bold text-lf-navy">
                Personal Information
              </h2>
            </div>

            <form onSubmit={handleProfileSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#34475d]">
                  Email Address (Verified — Read-only)
                </label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="mt-1.5 w-full rounded-[9px] border border-lf-line bg-lf-bg px-3.5 py-2.5 text-sm text-lf-muted"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-bold text-[#34475d]"
                >
                  Full Name *
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-mobile"
                  className="block text-xs font-bold text-[#34475d]"
                >
                  Mobile Number *
                </label>
                <input
                  id="profile-mobile"
                  type="tel"
                  maxLength={10}
                  value={editForm.mobile}
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      mobile: e.target.value.replace(/\D/g, '').slice(0, 10),
                    }))
                  }
                  className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm tabular-nums text-lf-ink focus:border-lf-green focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-city"
                    className="block text-xs font-bold text-[#34475d]"
                  >
                    City *
                  </label>
                  <input
                    id="profile-city"
                    type="text"
                    value={editForm.city}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, city: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-company"
                    className="block text-xs font-bold text-[#34475d]"
                  >
                    Company / Business Name
                  </label>
                  <input
                    id="profile-company"
                    type="text"
                    value={editForm.companyName}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, companyName: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
                  />
                </div>
              </div>

              {editFeedback && (
                <div
                  role="status"
                  className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium ${
                    editFeedback.type === 'error'
                      ? 'border-rose-200 bg-rose-50 text-[#b42318]'
                      : 'border-lf-green-border bg-lf-green-tint text-lf-green-dark'
                  }`}
                >
                  {editFeedback.type === 'error' ? (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <span>{editFeedback.message}</span>
                </div>
              )}

              <Button
                type="submit"
                isLoading={isSavingProfile}
                disabled={isSavingProfile}
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </form>
          </section>

          {/* Change Password */}
          <section className="rounded-2xl border border-lf-line bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-lf-line pb-4">
              <div className="flex items-center gap-2.5">
                <KeyRound className="h-5 w-5 text-lf-green" aria-hidden="true" />
                <h2 className="text-lg font-bold text-lf-navy">
                  Change Password
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswords((p) => !p)}
                className="inline-flex items-center gap-1 text-xs font-bold text-lf-muted hover:text-lf-navy cursor-pointer"
              >
                {showPasswords ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" /> Show
                  </>
                )}
              </button>
            </div>

            <form
              onSubmit={handleChangePasswordSubmit}
              className="mt-5 space-y-4"
            >
              <div>
                <label
                  htmlFor="pw-current"
                  className="block text-xs font-bold text-[#34475d]"
                >
                  Current Password *
                </label>
                <input
                  id="pw-current"
                  type={showPasswords ? 'text' : 'password'}
                  value={pwForm.currentPassword}
                  onChange={(e) =>
                    setPwForm((p) => ({ ...p, currentPassword: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="pw-new"
                  className="block text-xs font-bold text-[#34475d]"
                >
                  New Password *
                </label>
                <input
                  id="pw-new"
                  type={showPasswords ? 'text' : 'password'}
                  value={pwForm.newPassword}
                  onChange={(e) =>
                    setPwForm((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
                />
                {pwForm.newPassword && (
                  <div className="mt-2 space-y-1.5">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-lf-line">
                      <div
                        className={`h-full transition-all ${strength.colorClass}`}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-lf-muted">
                      <span className={strength.checks.minLength ? 'text-lf-green-dark font-semibold' : ''}>
                        8+ chars
                      </span>
                      <span className={strength.checks.hasUpper ? 'text-lf-green-dark font-semibold' : ''}>
                        Uppercase
                      </span>
                      <span className={strength.checks.hasLower ? 'text-lf-green-dark font-semibold' : ''}>
                        Lowercase
                      </span>
                      <span className={strength.checks.hasDigit ? 'text-lf-green-dark font-semibold' : ''}>
                        Number
                      </span>
                      <span className={strength.checks.hasSpecial ? 'text-lf-green-dark font-semibold' : ''}>
                        Special symbol
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="pw-confirm"
                  className="block text-xs font-bold text-[#34475d]"
                >
                  Confirm New Password *
                </label>
                <input
                  id="pw-confirm"
                  type={showPasswords ? 'text' : 'password'}
                  value={pwForm.confirmPassword}
                  onChange={(e) =>
                    setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-[9px] border border-[#d8e0e8] px-3.5 py-2.5 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
                />
              </div>

              {pwFeedback && (
                <div
                  role="status"
                  className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium ${
                    pwFeedback.type === 'error'
                      ? 'border-rose-200 bg-rose-50 text-[#b42318]'
                      : 'border-lf-green-border bg-lf-green-tint text-lf-green-dark'
                  }`}
                >
                  {pwFeedback.type === 'error' ? (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <span>{pwFeedback.message}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="secondary"
                isLoading={isChangingPw}
                disabled={isChangingPw}
              >
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                {isChangingPw ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          </section>
        </div>

        {/* Section D: Telegram Notification Settings */}
        <TelegramNotificationSettings />
      </div>
    </DsaLayout>
  );
}
