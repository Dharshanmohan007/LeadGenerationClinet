import { CheckCircle2, Eye, Handshake, Shield } from 'lucide-react';
import Button from '../common/Button';

const PILLARS = [
  {
    title: 'Enquiry Platform Clarity',
    description:
      'LoanFlow operates transparently as an enquiry and referral platform connecting personal loan seekers with lending/distribution partners — never pretending to be a bank.',
    icon: Handshake,
  },
  {
    title: 'Zero Sensitive KYC at First Contact',
    description:
      'We do not ask for PAN numbers, Aadhaar numbers, bank passwords, or OTPs during initial enquiry submission.',
    icon: Shield,
  },
  {
    title: 'Full Review & Consent Control',
    description:
      'You inspect every field from Steps 1 and 2 on a dedicated review screen and provide explicit consent before anything is submitted.',
    icon: Eye,
  },
];

export default function WhyChooseUs() {
  return (
    <section id="about-us" className="bg-lf-bg py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Left Narrative */}
          <div className="lg:col-span-6">
            <p className="text-xs font-extrabold uppercase tracking-wider text-lf-green">
              About Us &amp; Why Choose LoanFlow
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-lf-navy sm:text-4xl">
              Built Around Trust, Clarity, and Respect for Your Time
            </h2>
            <p className="mt-4 text-base leading-relaxed text-lf-muted">
              Finding a personal loan should start with honest communication.
              LoanFlow helps you express your borrowing requirement cleanly so our
              team or a relevant lending partner can evaluate and discuss next
              steps with you directly.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                'Clear separation between initial enquiry and lender verification',
                'Supports ₹1 lakh to ₹20 lakh personal loan requirements',
                'Immediate backend-confirmed reference ID for your records',
                'Transparent privacy notice and voluntary consent workflow',
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-sm font-semibold text-lf-ink"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-lf-green"
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button to="/apply" variant="secondary" size="md">
                Start Your Enquiry
              </Button>
            </div>
          </div>

          {/* Right Cards */}
          <div className="space-y-4 lg:col-span-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="flex items-start gap-4 rounded-[15px] border border-lf-line bg-white p-5 sm:p-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lf-green-soft text-lf-green">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-lf-navy">
                      {pillar.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-lf-muted">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
