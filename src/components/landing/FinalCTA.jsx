import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export default function FinalCTA() {
  return (
    <section className="bg-lf-bg py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[18px] bg-lf-navy px-6 py-9 text-white shadow-[0_18px_55px_rgba(16,37,65,0.14)] sm:px-10 sm:py-11 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to share your requirement?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#c9d6e3] sm:text-base">
              Start a personal loan enquiry in three clear steps. There is no
              enquiry fee and no obligation to proceed with an offer.
            </p>
          </div>
          <div className="shrink-0">
            <Button to="/apply" size="lg">
              Apply Now
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
