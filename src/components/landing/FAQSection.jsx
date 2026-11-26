import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getPartnerNoticeConfig } from '../../utils/partnerNotice';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const partnerNotice = getPartnerNoticeConfig();

  const faqs = [
    {
      question: 'How does the MUKTIVA enquiry process work?',
      answer:
        'You complete a simple three-step enquiry form covering your personal details, financial requirements (such as monthly income, employment details, existing EMI, and desired loan amount between ₹1 lakh and ₹20 lakh), and review/consent confirmation. Once submitted and saved by our server, you receive an official reference ID.',
    },
    {
      question: 'Does submitting an enquiry guarantee loan approval?',
      answer:
        'No. MUKTIVA is an enquiry and referral platform, not a bank or lending institution. Loan eligibility, document verification, interest rates, tenure, and final loan approval are determined independently by the relevant lending partner.',
    },
    {
      question: 'Do I need to pay any fee to submit an enquiry?',
      answer:
        'No. Submitting a personal loan enquiry through MUKTIVA is completely free for applicants.',
    },
    {
      question: 'How is my personal and financial information used?',
      answer: partnerNotice.isConfigured
        ? `The details you provide are used to process your personal loan enquiry and, with your explicit consent, shared with our authorized lending/distribution partner (${partnerNotice.partnerName}) as described in our Privacy Policy.`
        : 'The details you provide are used to process your personal loan enquiry and, subject to your explicit consent, shared only with the specifically identified lending/distribution partner described in our Privacy Policy. Note: Partner identity configuration must be finalized prior to production submission.',
    },
    {
      question: 'Who may contact me after I submit an enquiry?',
      answer:
        'Our MUKTIVA team or the relevant authorized lending/distribution partner may contact you on the mobile number you provide to discuss your enquiry and explain potential next steps.',
    },
    {
      question: 'Do I need to upload PAN, Aadhaar, or bank details right now?',
      answer:
        'No. MUKTIVA does not collect PAN, Aadhaar, bank account credentials, OTPs, or identity documents in this initial enquiry form.',
    },
  ];

  function toggleItem(index) {
    setOpenIndex((current) => (current === index ? -1 : index));
  }

  return (
    <section
      id="faq"
      className="border-t border-lf-line bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-lf-green">
            Frequently Asked Questions
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-lf-navy sm:text-4xl">
            Important Things to Know Before Submitting
          </h2>
          <p className="mt-3 text-base text-lf-muted">
            Clear answers on how enquiries are handled, privacy consent, and what
            to expect next.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-[15px] border border-lf-line bg-lf-bg/50 transition-colors"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold text-lf-navy hover:bg-white sm:px-6 sm:py-5 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-lf-muted transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-lf-green' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="border-t border-lf-line bg-white px-5 pb-5 pt-3 text-sm leading-relaxed text-lf-muted sm:px-6"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
