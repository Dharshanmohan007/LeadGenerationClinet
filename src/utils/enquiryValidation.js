/**
 * Shared option definitions, initial state, validation rules, and payload builder
 * for the three-step LoanFlow customer personal loan enquiry form.
 */

export const EMPLOYMENT_TYPES = ['Salaried', 'Self-employed'];

export const WORK_EXPERIENCE_OPTIONS = [
  'Below 6 months',
  '6–12 months',
  '1–2 years',
  '2–5 years',
  'Above 5 years',
];

export const MIN_LOAN_AMOUNT = 100000; // ₹1 Lakh
export const MAX_LOAN_AMOUNT = 2000000; // ₹20 Lakhs

export const LOAN_AMOUNT_PRESETS = [
  { value: 100000, label: '₹1 Lakh' },
  { value: 200000, label: '₹2 Lakhs' },
  { value: 300000, label: '₹3 Lakhs' },
  { value: 500000, label: '₹5 Lakhs' },
  { value: 700000, label: '₹7 Lakhs' },
  { value: 1000000, label: '₹10 Lakhs' },
  { value: 1500000, label: '₹15 Lakhs' },
  { value: 2000000, label: '₹20 Lakhs' },
];

export const LOAN_PURPOSE_OPTIONS = [
  'Personal expenses',
  'Medical expenses',
  'Education',
  'Debt consolidation',
  'Home renovation',
  'Other',
];

export const INITIAL_ENQUIRY_DATA = {
  name: '',
  mobile: '',
  city: '',
  employment: '',
  income: '',
  company: '',
  experience: '',
  amount: '',
  emi: '',
  purpose: 'Personal expenses',
  consent: false,
};

export const STEP_FIELD_MAP = {
  1: ['name', 'mobile', 'city', 'employment'],
  2: ['income', 'company', 'experience', 'amount', 'emi', 'purpose'],
  3: ['consent'],
};

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
const REPEATED_DIGIT_REGEX = /^(\d)\1{9}$/;

/**
 * Validates a single enquiry field and returns an error string or empty string when valid.
 */
export function validateEnquiryField(fieldName, value) {
  switch (fieldName) {
    case 'name': {
      const trimmed = String(value ?? '').trim();
      if (!trimmed) return 'Please enter your full name.';
      if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
      if (trimmed.length > 100) return 'Full name cannot exceed 100 characters.';
      return '';
    }

    case 'mobile': {
      const digits = String(value ?? '').trim();
      if (!digits) return 'Please enter your 10-digit mobile number.';
      if (!/^\d+$/.test(digits)) {
        return 'Mobile number must contain digits only.';
      }
      if (digits.length !== 10) {
        return 'Mobile number must be exactly 10 digits.';
      }
      if (!INDIAN_MOBILE_REGEX.test(digits) || REPEATED_DIGIT_REGEX.test(digits)) {
        return 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.';
      }
      return '';
    }

    case 'city': {
      const trimmed = String(value ?? '').trim();
      if (!trimmed) return 'Please enter your current city.';
      if (trimmed.length < 2) return 'City name must be at least 2 characters.';
      if (trimmed.length > 80) return 'City name cannot exceed 80 characters.';
      return '';
    }

    case 'employment': {
      if (!EMPLOYMENT_TYPES.includes(value)) {
        return 'Please select your employment type.';
      }
      return '';
    }

    case 'income': {
      const raw = String(value ?? '').trim();
      if (!raw) return 'Please enter your monthly in-hand income.';
      const num = Number(raw);
      if (!Number.isFinite(num) || num <= 0) {
        return 'Monthly in-hand income must be a positive amount greater than ₹0.';
      }
      return '';
    }

    case 'company': {
      const trimmed = String(value ?? '').trim();
      if (!trimmed) return 'Please enter your company name or business type.';
      if (trimmed.length < 2) {
        return 'Company name or business type must be at least 2 characters.';
      }
      if (trimmed.length > 120) {
        return 'Company name or business type cannot exceed 120 characters.';
      }
      return '';
    }

    case 'experience': {
      if (!WORK_EXPERIENCE_OPTIONS.includes(value)) {
        return 'Please select your total work experience.';
      }
      return '';
    }

    case 'amount': {
      const raw = String(value ?? '').trim();
      if (!raw) return 'Please select or enter your required loan amount.';
      const num = Number(raw);
      if (!Number.isFinite(num)) {
        return 'Please enter a valid numeric loan amount.';
      }
      if (num < MIN_LOAN_AMOUNT || num > MAX_LOAN_AMOUNT) {
        return 'Loan amount must be between ₹1,00,000 (₹1 Lakh) and ₹20,00,000 (₹20 Lakhs).';
      }
      return '';
    }

    case 'emi': {
      const raw = String(value ?? '').trim();
      if (raw === '') {
        return 'Please enter your existing monthly EMI (enter 0 if none).';
      }
      const num = Number(raw);
      if (!Number.isFinite(num) || num < 0) {
        return 'Existing EMI must be ₹0 or a positive amount.';
      }
      return '';
    }

    case 'purpose': {
      if (!LOAN_PURPOSE_OPTIONS.includes(value)) {
        return 'Please select the purpose of your loan.';
      }
      return '';
    }

    case 'consent': {
      if (value !== true) {
        return 'You must review and accept the consent statement before submitting.';
      }
      return '';
    }

    default:
      return '';
  }
}

/**
 * Validates all fields belonging to a specific step (1, 2, or 3).
 * Returns { isValid: boolean, errors: Record<string, string> }.
 */
export function validateStepFields(stepNumber, formData) {
  const fields = STEP_FIELD_MAP[stepNumber] || [];
  const errors = {};

  fields.forEach((field) => {
    const error = validateEnquiryField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates every field across Steps 1, 2, and 3 before final API submission.
 * Returns { isValid: boolean, errors: Record<string, string>, firstInvalidStep: number | null }.
 */
export function validateCompleteEnquiry(formData) {
  const allErrors = {};
  let firstInvalidStep = null;

  [1, 2, 3].forEach((step) => {
    const { isValid, errors } = validateStepFields(step, formData);
    if (!isValid && firstInvalidStep === null) {
      firstInvalidStep = step;
    }
    Object.assign(allErrors, errors);
  });

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors,
    firstInvalidStep,
  };
}

/**
 * Maps validated form state to the exact API request body expected by POST /api/enquiries.
 */
export function buildEnquiryPayload(formData) {
  return {
    name: formData.name.trim(),
    mobile: formData.mobile.trim(),
    city: formData.city.trim(),
    employment: formData.employment,
    income: Number(formData.income),
    company: formData.company.trim(),
    experience: formData.experience,
    amount: Number(formData.amount),
    emi: Number(formData.emi),
    purpose: formData.purpose,
    consent: Boolean(formData.consent),
  };
}
