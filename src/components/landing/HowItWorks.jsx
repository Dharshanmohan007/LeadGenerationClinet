import { ClipboardList, IndianRupee, PhoneCall, Send, Info } from 'lucide-react';

const STEPS = [
  {
    stepNumber: '1',
    title: 'Submit your personal information',
    description:
      'Provide your full name, 10-digit Indian mobile number, current city, and employment type (Salaried or Self-employed).',
    icon: ClipboardList,
  },
  {
    stepNumber: '2',
    title: 'Share your financial requirements',
    description:
      'Enter your monthly in-hand income, company or business type, work experience, preferred loan amount (₹1L–₹20L), existing EMI, and purpose.',
    icon: IndianRupee,
  },
  {
    stepNumber: '3',
    title: 'Submit your enquiry',
    description:
      'Review all entered details, make edits if needed, read the privacy and partner consent notice, and submit your enquiry.',
    icon: Send,
  },
  {
    stepNumber: '4',
    title: 'Our team or relevant lending partner follows up',
    description:
      'Once stored, you receive an official reference ID, and our team or the relevant lending/distribution partner may reach out regarding next steps.',
    icon: PhoneCall,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-lf-line bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-lf-green">
            How It Works
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-lf-navy sm:text-4xl">
            Four Simple Steps from Enquiry to Follow-Up
          </h2>
          <p className="mt-3 text-base text-lf-muted">
            Understand exactly what happens when you share your personal loan
            enquiry with MUKTIVA.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="flex flex-col rounded-[14px] border border-lf-line bg-lf-bg p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lf-navy text-xs font-extrabold text-white">
                    {step.stepNumber}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lf-green-soft text-lf-green">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-lf-navy">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-lf-muted sm:text-sm">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-[13px] border border-lf-green-border bg-lf-green-tint px-5 py-4 text-sm text-[#40536a]">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-lf-green" aria-hidden="true" />
          <p>
            <strong className="font-bold text-lf-navy">Please note: </strong>
            Submitting an enquiry connects you with our team or relevant lending
            partners for evaluation and follow-up. It does not imply or guarantee
            loan approval.
          </p>
        </div>
      </div>
    </section>
  );
}
