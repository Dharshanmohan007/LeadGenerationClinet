import { Briefcase, Building2, Lock } from 'lucide-react';
import FormField from './FormField';
import { EMPLOYMENT_TYPES } from '../../utils/enquiryValidation';

const INPUT_BASE_CLASSES =
  'w-full rounded-[9px] border bg-white px-3.5 py-3 text-sm text-lf-ink placeholder:text-lf-muted transition-colors focus:outline-none focus:ring-3';

function getInputClasses(hasError) {
  return `${INPUT_BASE_CLASSES} ${
    hasError
      ? 'border-[#b42318] focus:border-[#b42318] focus:ring-rose-200'
      : 'border-[#d8e0e8] focus:border-lf-green focus:ring-lf-green/15'
  }`;
}

export default function PersonalDetails({
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
}) {
  function handleMobileChange(event) {
    // Allow numeric digits only and cap at 10 digits for Indian mobile numbers.
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 10);
    onFieldChange('mobile', digitsOnly);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-lf-line pb-4">
        <h2 className="text-xl font-bold text-lf-navy">
          Step 1: Personal Details
        </h2>
        <p className="mt-1 text-sm text-lf-muted">
          Enter your basic contact details. Fields marked * are required.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <FormField
            id="enquiry-name"
            label="Full Name"
            required
            error={errors.name}
          >
            <input
              id="enquiry-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              onBlur={() => onFieldBlur('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
              className={getInputClasses(Boolean(errors.name))}
            />
          </FormField>
        </div>

        {/* Mobile Number */}
        <div>
          <FormField
            id="enquiry-mobile"
            label="Mobile Number"
            required
            hint="10-digit Indian mobile"
            error={errors.mobile}
          >
            <div className="flex">
              <span className="inline-flex items-center rounded-l-[9px] border border-r-0 border-[#d8e0e8] bg-lf-bg px-3.5 text-sm font-bold text-lf-navy select-none">
                +91
              </span>
              <input
                id="enquiry-mobile"
                name="mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={handleMobileChange}
                onBlur={() => onFieldBlur('mobile')}
                aria-invalid={Boolean(errors.mobile)}
                aria-describedby={
                  errors.mobile ? 'enquiry-mobile-error' : undefined
                }
                className={`tabular-nums rounded-l-none ${getInputClasses(
                  Boolean(errors.mobile)
                )}`}
              />
            </div>
          </FormField>
        </div>

        {/* City */}
        <div>
          <FormField
            id="enquiry-city"
            label="City"
            required
            error={errors.city}
          >
            <input
              id="enquiry-city"
              name="city"
              type="text"
              autoComplete="address-level2"
              placeholder="Enter your city"
              value={formData.city}
              onChange={(e) => onFieldChange('city', e.target.value)}
              onBlur={() => onFieldBlur('city')}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? 'enquiry-city-error' : undefined}
              className={getInputClasses(Boolean(errors.city))}
            />
          </FormField>
        </div>

        {/* Employment Type */}
        <div className="sm:col-span-2">
          <FormField
            id="enquiry-employment"
            label="Employment Type"
            required
            error={errors.employment}
          >
            <div
              id="enquiry-employment"
              role="radiogroup"
              aria-label="Employment Type"
              className="grid gap-3 sm:grid-cols-2"
            >
              {EMPLOYMENT_TYPES.map((type) => {
                const isSelected = formData.employment === type;
                const Icon = type === 'Salaried' ? Building2 : Briefcase;

                return (
                  <label
                    key={type}
                    className={`flex cursor-pointer items-center gap-3.5 rounded-[10px] border p-4 transition-all ${
                      isSelected
                        ? 'border-lf-green bg-lf-green-soft/60 ring-2 ring-lf-green/20'
                        : 'border-lf-line bg-white hover:border-[#cfd8e3]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="employment"
                      value={type}
                      checked={isSelected}
                      onChange={(e) => {
                        onFieldChange('employment', e.target.value);
                        onFieldBlur('employment');
                      }}
                      className="h-4 w-4 accent-lf-green"
                    />
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? 'bg-lf-green text-white'
                          : 'bg-lf-bg text-lf-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <span className="block text-sm font-bold text-lf-navy">
                        {type}
                      </span>
                      <span className="block text-xs text-lf-muted">
                        {type === 'Salaried'
                          ? 'Employed with a company or organization'
                          : 'Business owner, professional, or freelancer'}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </FormField>
        </div>
      </div>

      {/* Reassurance Note */}
      <div className="flex items-start gap-2.5 rounded-[11px] border border-lf-line bg-lf-notice-bg px-4 py-3 text-xs text-[#536579]">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-lf-green" aria-hidden="true" />
        <span>
          Do not enter PAN, Aadhaar, bank account credentials, OTPs, or identity
          documents in this initial enquiry form.
        </span>
      </div>
    </div>
  );
}
