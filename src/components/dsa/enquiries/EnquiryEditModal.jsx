import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { ENQUIRY_STATUS_OPTIONS } from '../../../config/dsa/enquiryConfig';
import {
  EMPLOYMENT_TYPES,
  LOAN_PURPOSE_OPTIONS,
  WORK_EXPERIENCE_OPTIONS,
} from '../../../utils/enquiryValidation';
import Button from '../../common/Button';

/**
 * Reusable modal allowing a DSA partner to edit enquiry details, update
 * status, and append a follow-up note with backend confirmation.
 */
export default function EnquiryEditModal({
  enquiry,
  onClose,
  onSave,
}) {
  const [formState, setFormState] = useState({
    name: enquiry?.name || '',
    mobile: enquiry?.mobile || '',
    city: enquiry?.city || '',
    employment: enquiry?.employment || 'Salaried',
    income: enquiry?.income ?? '',
    company: enquiry?.company || '',
    experience: enquiry?.experience || '1–2 years',
    amount: enquiry?.amount ?? '',
    emi: enquiry?.emi ?? 0,
    purpose: enquiry?.purpose || 'Personal expenses',
    status: enquiry?.status || 'new',
    note: '',
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function updateField(key, value) {
    setFormState((prev) => ({ ...prev, [key]: value }));
    if (error) setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSaving) return;
    setError('');

    const payload = {
      status: formState.status,
    };

    if (formState.name.trim()) payload.name = formState.name.trim();
    if (/^[6-9]\d{9}$/.test(formState.mobile.trim())) {
      payload.mobile = formState.mobile.trim();
    } else if (formState.mobile.trim()) {
      return setError('Mobile number must be a valid 10-digit Indian number.');
    }

    if (formState.city.trim()) payload.city = formState.city.trim();
    if (formState.employment) payload.employment = formState.employment;
    if (formState.company.trim()) payload.company = formState.company.trim();
    if (formState.experience) payload.experience = formState.experience;
    if (formState.purpose) payload.purpose = formState.purpose;

    if (formState.income !== '' && formState.income !== null) {
      const inc = Number(formState.income);
      if (!Number.isFinite(inc) || inc <= 0) {
        return setError('Monthly income must be greater than ₹0.');
      }
      payload.income = inc;
    }

    if (formState.amount !== '' && formState.amount !== null) {
      const amt = Number(formState.amount);
      if (!Number.isFinite(amt) || amt < 100000 || amt > 2000000) {
        return setError('Loan amount must be between ₹1,00,000 and ₹20,00,000.');
      }
      payload.amount = amt;
    }

    if (formState.emi !== '' && formState.emi !== null) {
      const emiVal = Number(formState.emi);
      if (!Number.isFinite(emiVal) || emiVal < 0) {
        return setError('Existing EMI cannot be negative.');
      }
      payload.emi = emiVal;
    }

    if (formState.note.trim()) {
      payload.note = formState.note.trim();
    }

    setIsSaving(true);
    try {
      await onSave(payload);
      onClose();
    } catch (saveError) {
      setError(saveError?.message || 'Unable to update enquiry.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-enquiry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-lf-navy/60 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-lf-line bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-lf-line px-6 py-4">
          <div>
            <h2
              id="edit-enquiry-modal-title"
              className="text-lg font-bold text-lf-navy"
            >
              Update Enquiry ({enquiry?.referenceId})
            </h2>
            <p className="text-xs text-lf-muted">
              Update lead fields, change status, or record a follow-up note.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-lf-muted hover:bg-lf-bg hover:text-lf-navy cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#34475d]">
                Status
              </label>
              <select
                value={formState.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
              >
                {ENQUIRY_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#34475d]">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={formState.amount}
                onChange={(e) => updateField('amount', e.target.value)}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm tabular-nums text-lf-ink focus:border-lf-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#34475d]">
                Customer Name
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#34475d]">
                Mobile Number
              </label>
              <input
                type="tel"
                maxLength={10}
                value={formState.mobile}
                onChange={(e) =>
                  updateField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))
                }
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm tabular-nums text-lf-ink focus:border-lf-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#34475d]">
                City
              </label>
              <input
                type="text"
                value={formState.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#34475d]">
                Employment Type
              </label>
              <select
                value={formState.employment}
                onChange={(e) => updateField('employment', e.target.value)}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#34475d]">
                Monthly Income (₹)
              </label>
              <input
                type="number"
                value={formState.income}
                onChange={(e) => updateField('income', e.target.value)}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm tabular-nums text-lf-ink focus:border-lf-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#34475d]">
                Existing EMI (₹)
              </label>
              <input
                type="number"
                value={formState.emi}
                onChange={(e) => updateField('emi', e.target.value)}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm tabular-nums text-lf-ink focus:border-lf-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#34475d]">
                Company / Business
              </label>
              <input
                type="text"
                value={formState.company}
                onChange={(e) => updateField('company', e.target.value)}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#34475d]">
                Work Experience
              </label>
              <select
                value={formState.experience}
                onChange={(e) => updateField('experience', e.target.value)}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
              >
                {WORK_EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#34475d]">
                Loan Purpose
              </label>
              <select
                value={formState.purpose}
                onChange={(e) => updateField('purpose', e.target.value)}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
              >
                {LOAN_PURPOSE_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#34475d]">
                Add Follow-up Note (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Record call outcome, customer feedback, or next follow-up date..."
                value={formState.note}
                onChange={(e) => updateField('note', e.target.value)}
                className="mt-1 w-full rounded-[9px] border border-[#d8e0e8] px-3 py-2 text-sm text-lf-ink focus:border-lf-green focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-[#b42318]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-lf-line pt-4">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSaving} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
