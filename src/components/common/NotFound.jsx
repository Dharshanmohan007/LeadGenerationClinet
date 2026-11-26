import { FileQuestion, ArrowLeft } from 'lucide-react';
import Button from './Button';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-lf-bg px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-lf-line bg-white p-8 text-center shadow-[0_18px_55px_rgba(16,37,65,0.09)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lf-green-soft text-lf-green">
          <FileQuestion className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-lf-green">
          404 &bull; Page Not Found
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-lf-navy">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-lf-muted">
          The URL you entered may have been moved, mistyped, or does not exist on
          LoanFlow.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button to="/" variant="outline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Button>
          <Button to="/apply">Submit Loan Enquiry</Button>
        </div>
      </div>
    </div>
  );
}
