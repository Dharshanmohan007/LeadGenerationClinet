import { AlertTriangle, ArrowLeft, Shield } from 'lucide-react';
import Button from '../../components/common/Button';
import { getPartnerNoticeConfig } from '../../utils/partnerNotice';

export default function PrivacyPolicyPage() {
  const partnerNotice = getPartnerNoticeConfig();

  return (
    <div className="bg-lf-bg py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Button to="/" variant="ghost" size="sm" className="mb-6 -ml-2">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Home
        </Button>

        <article className="rounded-[18px] border border-lf-line bg-white p-6 shadow-[0_18px_55px_rgba(16,37,65,0.09)] sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lf-green-soft text-lf-green">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-lf-green">
                Legal &amp; Data Protection
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-lf-navy sm:text-3xl">
                MUKTIVA Privacy Policy
              </h1>
            </div>
          </div>

          {/* Partner Identity Configuration Disclosure */}
          <div
            className={`mt-6 rounded-[11px] border p-4 sm:p-5 ${
              partnerNotice.isConfigured
                ? 'border-lf-green-border bg-lf-green-tint text-lf-ink'
                : 'border-amber-300 bg-amber-50 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  partnerNotice.isConfigured ? 'text-lf-green' : 'text-amber-600'
                }`}
                aria-hidden="true"
              />
              <div className="text-sm leading-relaxed">
                <p className="font-bold">
                  {partnerNotice.isConfigured
                    ? `Authorized Lending / Distribution Partner: ${partnerNotice.partnerName}`
                    : 'Lending / Distribution Partner Notice — Configuration Required Before Production'}
                </p>
                <p className="mt-1">{partnerNotice.summaryText}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-7 text-sm leading-relaxed text-[#40536a] sm:text-base">
            <section>
              <h2 className="text-lg font-bold text-lf-navy">
                1. Platform Scope
              </h2>
              <p className="mt-2">
                MUKTIVA operates as a personal loan enquiry and referral
                platform, not a bank or lending institution. This Privacy Policy
                explains what information is collected through our initial
                personal loan enquiry form and how that information is used.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-lf-navy">
                2. Information Collected in the Initial Enquiry
              </h2>
              <p className="mt-2">
                When you voluntarily submit an enquiry at <code>/apply</code>, we
                collect only the following information:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>
                  <strong>Personal Details:</strong> Full name, 10-digit Indian
                  mobile number, current city, and employment type (Salaried or
                  Self-employed).
                </li>
                <li>
                  <strong>Financial Requirements:</strong> Monthly in-hand income,
                  company name or business type, work experience bracket, desired
                  loan amount (₹1 lakh to ₹20 lakh), existing monthly EMI, and loan
                  purpose.
                </li>
                <li>
                  <strong>Consent Record:</strong> Confirmation of your voluntary
                  submission and consent checkbox selection.
                </li>
              </ul>
              <p className="mt-3 font-bold text-lf-navy">
                MUKTIVA does NOT collect PAN, Aadhaar, bank account credentials,
                OTPs, or identity document uploads on the initial enquiry form.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-lf-navy">
                3. How Your Information Is Used &amp; Shared
              </h2>
              <p className="mt-2">
                Your submitted information is used to process your personal loan
                enquiry, generate a server-side reference ID, and enable our team
                or the identified lending/distribution partner to contact you
                regarding your enquiry.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-lf-navy">
                4. Privacy Contact (Placeholder)
              </h2>
              <p className="mt-2 text-lf-muted">
                [Privacy Officer Name &amp; Grievance Email Placeholder — Configure
                with verified contact details before production deployment.]
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
