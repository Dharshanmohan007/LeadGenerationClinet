import { Link } from 'react-router-dom';
import { AlertTriangle, Edit3, ShieldCheck } from 'lucide-react';
import { formatINR, formatLoanAmountLabel } from '../../utils/formatters';
import { getPartnerNoticeConfig } from '../../utils/partnerNotice';
import FormField from './FormField';

export default function ReviewAndConsent({
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
  onEditStep,
}) {
  const partnerNotice = getPartnerNoticeConfig();

  const personalItems = [
    { label: 'Full Name', value: formData.name },
    { label: 'Mobile Number', value: `+91 ${formData.mobile}` },
    { label: 'City', value: formData.city },
    { label: 'Employment Type', value: formData.employment },
  ];

  const financialItems = [
    {
      label: 'Monthly In-hand Income',
      value: formatINR(formData.income),
    },
    { label: 'Company / Business Type', value: formData.company },
    { label: 'Work Experience', value: formData.experience },
    {
      label: 'Requested Loan Amount',
      value: formatLoanAmountLabel(formData.amount),
    },
    { label: 'Existing Monthly EMI', value: formatINR(formData.emi) },
    { label: 'Loan Purpose', value: formData.purpose },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-lf-line pb-4">
        <h2 className="text-xl font-bold text-lf-navy">
          Step 3: Review and Consent
        </h2>
        <p className="mt-1 text-sm text-lf-muted">
          Check your details before submitting. You can go back to edit any
          section.
        </p>
      </div>

      {/* Review Summary Cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Step 1 Summary */}
        <div className="rounded-xl border border-lf-line bg-white p-5">
          <div className="flex items-center justify-between border-b border-lf-line pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-lf-navy">
              Personal Details
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-lf-green hover:text-lf-green-dark cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </button>
          </div>
          <dl className="mt-3 divide-y divide-[#edf1f4] text-sm">
            {personalItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between gap-4 py-2.5"
              >
                <dt className="text-lf-muted">{item.label}</dt>
                <dd className="text-right font-bold text-lf-navy">
                  {item.value || '—'}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Step 2 Summary */}
        <div className="rounded-xl border border-lf-line bg-white p-5">
          <div className="flex items-center justify-between border-b border-lf-line pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-lf-navy">
              Financial Requirements
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-lf-green hover:text-lf-green-dark cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </button>
          </div>
          <dl className="mt-3 divide-y divide-[#edf1f4] text-sm">
            {financialItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between gap-4 py-2.5"
              >
                <dt className="text-lf-muted">{item.label}</dt>
                <dd className="tabular-nums text-right font-bold text-lf-navy">
                  {item.value || '—'}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Lending Partner & Privacy Notice */}
      <div
        className={`rounded-[11px] border p-4 ${
          partnerNotice.isConfigured
            ? 'border-lf-green-border bg-lf-green-tint text-lf-ink'
            : 'border-amber-300 bg-amber-50/90 text-amber-950'
        }`}
      >
        <div className="flex items-start gap-3">
          {partnerNotice.isConfigured ? (
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-lf-green"
              aria-hidden="true"
            />
          ) : (
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
              aria-hidden="true"
            />
          )}
          <div className="text-xs leading-relaxed sm:text-sm">
            <p className="font-bold">
              {partnerNotice.isConfigured
                ? `Lending / Distribution Partner Notice (${partnerNotice.partnerName})`
                : 'Lending Partner Identity & Privacy Notice (Configuration Required Before Production)'}
            </p>
            <p className="mt-1">{partnerNotice.summaryText}</p>
          </div>
        </div>
      </div>

      {/* Consent Checkbox */}
      <FormField
        id="enquiry-consent"
        label="Customer Enquiry Consent"
        required
        error={errors.consent}
      >
        <label
          htmlFor="enquiry-consent"
          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
            errors.consent
              ? 'border-[#b42318] bg-rose-50/40'
              : formData.consent
                ? 'border-lf-green bg-lf-green-soft/50'
                : 'border-lf-line bg-white hover:border-[#cfd8e3]'
          }`}
        >
          <input
            id="enquiry-consent"
            name="consent"
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => {
              onFieldChange('consent', e.target.checked);
              onFieldBlur('consent');
            }}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={
              errors.consent ? 'enquiry-consent-error' : undefined
            }
            className="mt-1 h-4 w-4 shrink-0 rounded accent-lf-green"
          />
          <span className="text-xs leading-relaxed text-[#40536a] sm:text-sm">
            I confirm that I am voluntarily submitting this personal loan enquiry.
            I understand that my information may be used to process this enquiry,
            may be shared with the specifically identified lending/distribution
            partner described in the{' '}
            <Link
              to="/privacy-policy"
              className="font-bold text-lf-green underline hover:text-lf-green-dark"
            >
              Privacy Policy
            </Link>{' '}
            (and{' '}
            <Link
              to="/terms-and-conditions"
              className="font-bold text-lf-green underline hover:text-lf-green-dark"
            >
              Terms and Conditions
            </Link>
            ), and I agree to be contacted regarding my enquiry.
          </span>
        </label>
      </FormField>
    </div>
  );
}
