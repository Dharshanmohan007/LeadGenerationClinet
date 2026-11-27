import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BellRing,
  CheckCircle2,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import BrandLogo from '../../common/BrandLogo';

/**
 * Two-column fintech authentication shell shared across DSA Login, Signup,
 * Forgot Password, and Reset Password views.
 */
export default function DsaAuthShell({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="min-h-screen grid bg-lf-bg lg:grid-cols-12">
      {/* Left Brand & Fintech Visual Column */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-lf-navy p-10 text-white lg:col-span-5 lg:flex xl:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(21,155,119,0.20),transparent_48%),radial-gradient(circle_at_bottom_left,rgba(24,56,88,0.9),transparent_55%)]"
        />

        <div className="relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#cfdae5] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Return to MUKTIVA Public Site
          </Link>

          <div className="mt-8">
            <BrandLogo size="md" />
          </div>

          <div className="mt-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-lf-mint">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              MUKTIVA DSA Operations CRM
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white xl:text-4xl">
              Manage Personal Loan Enquiries with Clarity.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#cfdae5]">
              Welcome to the MUKTIVA DSA Partner Portal. Access verified enquiry
              pipelines, real-time notifications, and structured lead workflows in
              one secure workspace.
            </p>
          </div>
        </div>

        {/* Clean Visual Feature Cards */}
        <div className="relative mt-10 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lf-green/20 text-lf-mint">
                <Layers className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">
                  Three Enquiry Pipelines
                </p>
                <p className="mt-0.5 text-xs text-[#b9c9d9]">
                  Dedicated views for Website Enquiries, CIBIL Enquiries, and
                  Bank Rejected leads.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lf-green/20 text-lf-mint">
                <BellRing className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">
                  Instant Dashboard &amp; Telegram Alerts
                </p>
                <p className="mt-0.5 text-xs text-[#b9c9d9]">
                  Unread badge tracking inside the portal plus optional private
                  Telegram alerts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 text-xs text-[#9fb3c8]">
            <CheckCircle2 className="h-4 w-4 text-lf-mint" aria-hidden="true" />
            <span>Role-protected access for approved DSA partners</span>
          </div>
        </div>
      </aside>

      {/* Right Form Area */}
      <main className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:col-span-7 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Header Brand */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link to="/" className="rounded-xl bg-lf-navy px-3 py-2">
              <BrandLogo size="sm" />
            </Link>
            <Link
              to="/"
              className="text-xs font-semibold text-lf-navy hover:underline"
            >
              Public Site
            </Link>
          </div>

          <div className="rounded-2xl border border-lf-line bg-white p-6 shadow-[0_18px_55px_rgba(16,37,65,0.08)] sm:p-8">
            <div className="border-b border-lf-line pb-5">
              <h2 className="text-2xl font-bold tracking-tight text-lf-navy">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1.5 text-sm text-lf-muted">{subtitle}</p>
              )}
            </div>

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
