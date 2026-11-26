import { Check } from 'lucide-react';

const STEPS = [
  { number: 1, title: 'Personal Details', subtitle: 'Basic contact & profile' },
  { number: 2, title: 'Financial Requirements', subtitle: 'Income & loan details' },
  { number: 3, title: 'Review & Consent', subtitle: 'Verify & submit' },
];

export default function EnquiryStepper({ currentStep }) {
  const progressPercent = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="mb-7">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-lf-muted">
          <span className="uppercase tracking-wide">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="tabular-nums font-bold text-lf-green-dark">
            {progressPercent}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Enquiry form progress"
          className="h-1.5 w-full overflow-hidden rounded-full bg-[#edf1f5]"
        >
          <div
            className="h-full rounded-full bg-lf-green transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <li
              key={step.number}
              aria-current={isCurrent ? 'step' : undefined}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                isCurrent
                  ? 'border-lf-green bg-lf-green-soft/60'
                  : isCompleted
                    ? 'border-lf-green-border bg-lf-green-tint'
                    : 'border-lf-line bg-white'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                  isCompleted
                    ? 'bg-lf-green text-white'
                    : isCurrent
                      ? 'bg-lf-navy text-white'
                      : 'bg-[#edf1f5] text-lf-muted'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  step.number
                )}
              </span>

              <div className="min-w-0">
                <p
                  className={`truncate text-sm font-bold ${
                    isCurrent || isCompleted ? 'text-lf-navy' : 'text-lf-muted'
                  }`}
                >
                  {step.title}
                </p>
                <p className="truncate text-xs text-lf-muted">{step.subtitle}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
