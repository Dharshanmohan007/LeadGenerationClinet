import { ArrowLeft, FileText } from 'lucide-react';
import Button from '../../components/common/Button';
import { getPartnerNoticeConfig } from '../../utils/partnerNotice';

export default function TermsPage() {
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
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-lf-green">
                Platform Usage Terms
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-lf-navy sm:text-3xl">
                Terms and Conditions
              </h1>
            </div>
          </div>

          <div className="mt-8 space-y-7 text-sm leading-relaxed text-[#40536a] sm:text-base">
            <section>
              <h2 className="text-lg font-bold text-lf-navy">
                1. Nature of Service
              </h2>
              <p className="mt-2">
                LoanFlow is an enquiry and referral platform, not a bank or
                lending institution. LoanFlow facilitates the collection of
                personal loan enquiries and connects applicants with relevant
                lending or distribution partners.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-lf-navy">
                2. No Guarantee of Loan Approval
              </h2>
              <p className="mt-2">
                Submitting a personal loan enquiry through LoanFlow does not
                constitute a loan offer or guarantee approval. Loan eligibility,
                verification, interest rates, fees, tenure, and final loan
                approval are determined independently by the relevant lending
                partner.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-lf-navy">
                3. Accuracy of Information &amp; Voluntary Consent
              </h2>
              <p className="mt-2">
                By submitting an enquiry, you confirm that the personal and
                financial requirement details you provide are accurate and that you
                voluntarily authorize LoanFlow and its identified lending or
                distribution partner to contact you regarding your enquiry.
              </p>
              {!partnerNotice.isConfigured && (
                <p className="mt-2 rounded-[11px] border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-950 sm:text-sm">
                  Configuration Notice: The exact legal entity name of the lending
                  / distribution partner requires configuration prior to
                  production launch.
                </p>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-lf-navy">
                4. No Enquiry Fee
              </h2>
              <p className="mt-2">
                LoanFlow does not charge customers any fee for submitting a
                personal loan enquiry through this website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-lf-navy">
                5. Governing Contact Details (Placeholder)
              </h2>
              <p className="mt-2 text-lf-muted">
                [Legal Entity Name, Registered Address &amp; Support Email
                Placeholder — Configure prior to production deployment.]
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
