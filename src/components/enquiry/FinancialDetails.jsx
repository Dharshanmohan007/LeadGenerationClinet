import { Lightbulb } from 'lucide-react';
import FormField from './FormField';
import {
  LOAN_AMOUNT_PRESETS,
  LOAN_PURPOSE_OPTIONS,
  MAX_LOAN_AMOUNT,
  MIN_LOAN_AMOUNT,
  WORK_EXPERIENCE_OPTIONS,
} from '../../utils/enquiryValidation';
import { formatINR } from '../../utils/formatters';

const INPUT_BASE_CLASSES =
  'w-full rounded-[9px] border bg-white px-3.5 py-3 text-sm text-lf-ink placeholder:text-lf-muted transition-colors focus:outline-none focus:ring-3';

function getInputClasses(hasError) {
  return `${INPUT_BASE_CLASSES} ${
    hasError
      ? 'border-[#b42318] focus:border-[#b42318] focus:ring-rose-200'
      : 'border-[#d8e0e8] focus:border-lf-green focus:ring-lf-green/15'
  }`;
}

export default function FinancialDetails({
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
}) {
  const isSelfEmployed = formData.employment === 'Self-employed';

  function handleNumericChange(fieldName, rawValue) {
    // Keep digits only so numeric inputs never accept exponential or negative symbols.
    const sanitized = rawValue.replace(/\D/g, '');
    onFieldChange(fieldName, sanitized);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-lf-line pb-4">
        <h2 className="text-xl font-bold text-lf-navy">
          Step 2: Financial Requirements
        </h2>
        <p className="mt-1 text-sm text-lf-muted">
          These details help the partner understand what you are looking for
          (₹1 lakh to ₹20 lakh).
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Monthly In-hand Income */}
        <div>
          <FormField
            id="enquiry-income"
            label="Monthly In-hand Income (₹)"
            required
            hint={
              formData.income
                ? formatINR(formData.income, '')
                : 'Positive amount in INR'
            }
            error={errors.income}
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-lf-muted">
                ₹
              </span>
              <input
                id="enquiry-income"
                name="income"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 50000"
                value={formData.income}
                onChange={(e) => handleNumericChange('income', e.target.value)}
                onBlur={() => onFieldBlur('income')}
                aria-invalid={Boolean(errors.income)}
                aria-describedby={
                  errors.income ? 'enquiry-income-error' : undefined
                }
                className={`tabular-nums pl-8 ${getInputClasses(
                  Boolean(errors.income)
                )}`}
              />
            </div>
          </FormField>
        </div>

        {/* Company Name / Business Type */}
        <div>
          <FormField
            id="enquiry-company"
            label="Company Name / Business Type"
            required
            error={errors.company}
          >
            <input
              id="enquiry-company"
              name="company"
              type="text"
              placeholder={
                isSelfEmployed
                  ? 'Your business type (e.g., Retail Store)'
                  : 'Your employer name'
              }
              value={formData.company}
              onChange={(e) => onFieldChange('company', e.target.value)}
              onBlur={() => onFieldBlur('company')}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={
                errors.company ? 'enquiry-company-error' : undefined
              }
              className={getInputClasses(Boolean(errors.company))}
            />
          </FormField>
        </div>

        {/* Work Experience */}
        <div>
          <FormField
            id="enquiry-experience"
            label="Work / Business Experience"
            required
            error={errors.experience}
          >
            <select
              id="enquiry-experience"
              name="experience"
              value={formData.experience}
              onChange={(e) => {
                onFieldChange('experience', e.target.value);
                onFieldBlur('experience');
              }}
              onBlur={() => onFieldBlur('experience')}
              aria-invalid={Boolean(errors.experience)}
              aria-describedby={
                errors.experience ? 'enquiry-experience-error' : undefined
              }
              className={getInputClasses(Boolean(errors.experience))}
            >
              <option value="">Select work experience</option>
              {WORK_EXPERIENCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Existing EMI */}
        <div>
          <FormField
            id="enquiry-emi"
            label="Existing Monthly EMI (₹)"
            required
            hint="Enter 0 if none"
            error={errors.emi}
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-lf-muted">
                ₹
              </span>
              <input
                id="enquiry-emi"
                name="emi"
                type="text"
                inputMode="numeric"
                placeholder="Enter 0 if none"
                value={formData.emi}
                onChange={(e) => handleNumericChange('emi', e.target.value)}
                onBlur={() => onFieldBlur('emi')}
                aria-invalid={Boolean(errors.emi)}
                aria-describedby={errors.emi ? 'enquiry-emi-error' : undefined}
                className={`tabular-nums pl-8 ${getInputClasses(
                  Boolean(errors.emi)
                )}`}
              />
            </div>
          </FormField>
        </div>

        {/* Loan Amount (₹1 Lakh – ₹20 Lakh) */}
        <div className="sm:col-span-2">
          <FormField
            id="enquiry-amount"
            label="Required Loan Amount (₹1 Lakh to ₹20 Lakhs)"
            required
            hint={
              formData.amount
                ? formatINR(formData.amount, '')
                : `${formatINR(MIN_LOAN_AMOUNT)} – ${formatINR(MAX_LOAN_AMOUNT)}`
            }
            error={errors.amount}
          >
            <div className="space-y-3">
              {/* Prototype Amount Chips */}
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Quick loan amount options"
              >
                {LOAN_AMOUNT_PRESETS.map((preset) => {
                  const isSelected = Number(formData.amount) === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => {
                        onFieldChange('amount', String(preset.value));
                        onFieldBlur('amount');
                      }}
                      className={`rounded-lg border px-3 py-2 text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-lf-green bg-lf-green-soft font-extrabold text-lf-green-dark'
                          : 'border-lf-line bg-white font-medium text-lf-navy hover:border-lf-green/50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-lf-muted">
                  ₹
                </span>
                <input
                  id="enquiry-amount"
                  name="amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter loan amount between 100000 and 2000000"
                  value={formData.amount}
                  onChange={(e) => handleNumericChange('amount', e.target.value)}
                  onBlur={() => onFieldBlur('amount')}
                  aria-invalid={Boolean(errors.amount)}
                  aria-describedby={
                    errors.amount ? 'enquiry-amount-error' : undefined
                  }
                  className={`tabular-nums pl-8 ${getInputClasses(
                    Boolean(errors.amount)
                  )}`}
                />
              </div>
            </div>
          </FormField>
        </div>

        {/* Loan Purpose */}
        <div className="sm:col-span-2">
          <FormField
            id="enquiry-purpose"
            label="Loan Purpose"
            required
            error={errors.purpose}
          >
            <select
              id="enquiry-purpose"
              name="purpose"
              value={formData.purpose}
              onChange={(e) => {
                onFieldChange('purpose', e.target.value);
                onFieldBlur('purpose');
              }}
              onBlur={() => onFieldBlur('purpose')}
              aria-invalid={Boolean(errors.purpose)}
              aria-describedby={
                errors.purpose ? 'enquiry-purpose-error' : undefined
              }
              className={getInputClasses(Boolean(errors.purpose))}
            >
              {LOAN_PURPOSE_OPTIONS.map((purposeOption) => (
                <option key={purposeOption} value={purposeOption}>
                  {purposeOption}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      {/* Prototype Callout */}
      <div className="flex items-start gap-3 rounded-[13px] border border-lf-green-border bg-lf-green-tint p-4">
        <Lightbulb
          className="mt-0.5 h-5 w-5 shrink-0 text-lf-green"
          aria-hidden="true"
        />
        <div>
          <strong className="block text-xs font-bold text-lf-navy sm:text-sm">
            Why we ask these details
          </strong>
          <p className="mt-1 text-xs leading-relaxed text-[#5d7184]">
            Income, existing EMI, and requested amount help the enquiry partner
            understand your stated requirement. They are not a credit score or
            approval decision.
          </p>
        </div>
      </div>
    </div>
  );
}
