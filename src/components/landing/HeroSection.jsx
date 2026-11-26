import {
  ArrowRight,
  Check,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import Button from '../common/Button';

export default function HeroSection() {
  function scrollToHowItWorks() {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-lf-navy text-white"
    >
      {/* Subtle Navy & Emerald ambient accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(21,155,119,0.16),transparent_46%),radial-gradient(circle_at_bottom_left,rgba(24,56,88,0.85),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-22">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Copy */}
          <div className="lg:col-span-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[1.6px] text-lf-mint">
              A simpler way to explore loan options
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-[54px] lg:leading-[1.08]">
              Personal loan options, made easier.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#cfdae5] sm:text-[17px]">
              Tell us what you are looking for. Submit a short enquiry for ₹1
              lakh to ₹20 lakh and, with your permission, our team or a disclosed
              lending/distribution partner can contact you to discuss available
              options.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to="/apply" size="lg">
                Apply Now
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={scrollToHowItWorks}
              >
                Learn More
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {/* Trust Checkmarks */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#c4d1de]">
              {[
                'Simple enquiry',
                'Your choice to proceed',
                'Privacy-conscious process',
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check
                    className="h-3.5 w-3.5 stroke-[3] text-[#69d2ae]"
                    aria-hidden="true"
                  />
                  {item}
                </span>
              ))}
            </div>

            {/* Pill Highlights */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-[#e4edf5]">
                <Check className="h-3 w-3 text-[#69d2ae]" aria-hidden="true" />
                No obligation to apply
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-[#e4edf5]">
                <Check className="h-3 w-3 text-[#69d2ae]" aria-hidden="true" />
                No document upload at enquiry stage
              </span>
            </div>
          </div>

          {/* Right White Hero Card (Prototype Theme) */}
          <div className="lg:col-span-5">
            <div className="rounded-[20px] bg-white p-6 text-lf-ink shadow-[0_25px_70px_rgba(0,0,0,0.22)] sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-lf-navy">
                    Start with a few details
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-lf-muted sm:text-sm">
                    Share your requirement. A lending partner makes the final
                    eligibility and approval decision.
                  </p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lf-green-soft text-lf-green">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <div className="mt-5 divide-y divide-lf-line text-sm">
                <div className="flex items-center justify-between gap-3 py-3.5">
                  <span className="text-lf-muted">Loan requirements</span>
                  <strong className="tabular-nums font-bold text-lf-navy">
                    ₹1 lakh – ₹20 lakh*
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-3 py-3.5">
                  <span className="text-lf-muted">Who can enquire?</span>
                  <strong className="font-bold text-lf-navy">
                    Salaried / Self-employed
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-3 py-3.5">
                  <span className="text-lf-muted">Enquiry steps</span>
                  <strong className="font-bold text-lf-navy">
                    3 simple steps (~2 mins)
                  </strong>
                </div>
              </div>

              <div className="mt-5">
                <Button to="/apply" fullWidth size="md">
                  Submit an enquiry
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-[#8492a2]">
                *Illustrative enquiry range. Actual loan terms and approval are
                determined independently by the lending partner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
