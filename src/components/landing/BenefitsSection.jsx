import {
  Briefcase,
  FileCheck2,
  IndianRupee,
  ListChecks,
  Lock,
  ShieldCheck,
} from 'lucide-react';

const BENEFITS = [
  {
    title: '₹1 Lakh to ₹20 Lakh Loan Range',
    description:
      'Share personal loan requirements spanning ₹1,00,000 to ₹20,00,000 for personal expenses, medical needs, education, home renovation, or debt consolidation.',
    icon: IndianRupee,
  },
  {
    title: 'Guided 3-Step Enquiry Form',
    description:
      'Enter your personal details, financial requirements, and review everything before giving consent — designed to be clear and quick on mobile or desktop.',
    icon: ListChecks,
  },
  {
    title: 'No Platform Enquiry Fee',
    description:
      'Submitting a personal loan enquiry on LoanFlow is completely free. There are no upfront submission charges or hidden enquiry fees.',
    icon: ShieldCheck,
  },
  {
    title: 'Privacy-First Initial Intake',
    description:
      'We ask for basic enquiry details only and do not collect PAN, Aadhaar, OTPs, bank credentials, or identity documents through this initial form.',
    icon: Lock,
  },
  {
    title: 'Salaried & Self-Employed Support',
    description:
      'Built for salaried professionals and self-employed individuals across Indian cities with clear income and work experience options.',
    icon: Briefcase,
  },
  {
    title: 'Review Before Consent & Reference ID',
    description:
      'Inspect and edit every field before submitting, confirm explicit consent, and receive an official backend-issued reference ID upon confirmation.',
    icon: FileCheck2,
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="bg-lf-bg py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-lf-green">
            Benefits of LoanFlow
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-lf-navy sm:text-4xl">
            A Clear, Simple Enquiry Journey
          </h2>
          <p className="mt-3 text-base text-lf-muted">
            We collect only the details needed to understand your personal loan
            enquiry at this stage.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className="group rounded-[15px] border border-lf-line bg-white p-6 transition-all duration-200 hover:border-lf-green/50 hover:shadow-[0_18px_55px_rgba(16,37,65,0.08)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lf-green-soft text-lf-green transition-colors group-hover:bg-lf-green group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-lf-navy">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-lf-muted">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Prototype Stat Strip & Privacy Callout */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-[13px] border border-lf-line bg-white p-4 text-center">
            <strong className="block text-lg font-bold text-lf-navy">3 steps</strong>
            <span className="text-xs text-lf-muted">Simple enquiry flow</span>
          </div>
          <div className="rounded-[13px] border border-lf-line bg-white p-4 text-center">
            <strong className="block text-lg font-bold text-lf-navy">2 minutes</strong>
            <span className="text-xs text-lf-muted">Approx. form time</span>
          </div>
          <div className="rounded-[13px] border border-lf-line bg-white p-4 text-center">
            <strong className="tabular-nums block text-lg font-bold text-lf-navy">
              ₹1L–₹20L*
            </strong>
            <span className="text-xs text-lf-muted">Illustrative request range</span>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3.5 rounded-[13px] border border-lf-green-border bg-lf-green-tint p-4 sm:p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-lf-green ring-1 ring-lf-green-border">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <strong className="block text-sm font-bold text-lf-navy">
              Your information matters
            </strong>
            <p className="mt-1 text-xs leading-relaxed text-[#5d7184] sm:text-sm">
              We ask for basic enquiry details only. Do not submit PAN, Aadhaar,
              bank credentials, OTPs, or identity documents through this initial
              enquiry form.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
