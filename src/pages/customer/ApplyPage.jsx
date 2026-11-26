import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import Button from '../../components/common/Button';
import EnquiryStepper from '../../components/enquiry/EnquiryStepper';
import PersonalDetails from '../../components/enquiry/PersonalDetails';
import FinancialDetails from '../../components/enquiry/FinancialDetails';
import ReviewAndConsent from '../../components/enquiry/ReviewAndConsent';
import { submitEnquiry } from '../../services/enquiryService';
import {
  buildEnquiryPayload,
  INITIAL_ENQUIRY_DATA,
  STEP_FIELD_MAP,
  validateCompleteEnquiry,
  validateEnquiryField,
  validateStepFields,
} from '../../utils/enquiryValidation';

export default function ApplyPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_ENQUIRY_DATA);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Ref guard prevents duplicate API calls if the submit button is clicked rapidly.
  const submitInFlightRef = useRef(false);

  function handleFieldChange(fieldName, value) {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (apiError) {
      setApiError('');
    }

    // Re-validate field live once it has been touched or flagged with an error.
    if (touched[fieldName] || errors[fieldName]) {
      const fieldError = validateEnquiryField(fieldName, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldError) {
          next[fieldName] = fieldError;
        } else {
          delete next[fieldName];
        }
        return next;
      });
    }
  }

  function handleFieldBlur(fieldName) {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const fieldError = validateEnquiryField(fieldName, formData[fieldName]);
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) {
        next[fieldName] = fieldError;
      } else {
        delete next[fieldName];
      }
      return next;
    });
  }

  function markStepFieldsTouched(stepNumber) {
    const fields = STEP_FIELD_MAP[stepNumber] || [];
    setTouched((prev) => {
      const next = { ...prev };
      fields.forEach((field) => {
        next[field] = true;
      });
      return next;
    });
  }

  function handleNextStep() {
    setApiError('');
    markStepFieldsTouched(currentStep);

    const { isValid, errors: stepErrors } = validateStepFields(
      currentStep,
      formData
    );

    if (!isValid) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handlePreviousStep() {
    if (isSubmitting) return;
    setApiError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleEditStep(targetStep) {
    if (isSubmitting) return;
    setApiError('');
    setCurrentStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitInFlightRef.current || isSubmitting) return;

    setApiError('');
    [1, 2, 3].forEach(markStepFieldsTouched);

    const {
      isValid,
      errors: allErrors,
      firstInvalidStep,
    } = validateCompleteEnquiry(formData);

    if (!isValid) {
      setErrors(allErrors);
      if (firstInvalidStep && firstInvalidStep !== currentStep) {
        setCurrentStep(firstInvalidStep);
      }
      return;
    }

    submitInFlightRef.current = true;
    setIsSubmitting(true);

    try {
      const payload = buildEnquiryPayload(formData);
      const confirmation = await submitEnquiry(payload);

      // Navigate only after actual backend confirmation and reference ID issuance.
      navigate('/application-success', {
        replace: true,
        state: {
          submissionConfirmed: true,
          referenceId: confirmation.referenceId,
          applicantName: payload.name,
          message: confirmation.message,
        },
      });
    } catch (error) {
      setApiError(
        error?.message ||
          'We could not submit your enquiry right now. Please try again.'
      );
    } finally {
      submitInFlightRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-lf-bg py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-lf-green-border bg-lf-green-soft px-3.5 py-1 text-xs font-bold text-lf-green-dark">
            <ShieldCheck className="h-4 w-4 text-lf-green" aria-hidden="true" />
            Free &amp; Voluntary Personal Loan Enquiry
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-lf-navy sm:text-3xl">
            Personal Loan Enquiry
          </h1>
          <p className="mt-2 text-sm text-lf-muted sm:text-base">
            Your details &middot; Loan requirement &middot; Review &amp; consent
          </p>
        </div>

        {/* Stepper & Progress Indicator */}
        <EnquiryStepper currentStep={currentStep} />

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[18px] border border-lf-line bg-white p-6 shadow-[0_18px_55px_rgba(16,37,65,0.09)] sm:p-8"
        >
          {currentStep === 1 && (
            <PersonalDetails
              formData={formData}
              errors={errors}
              onFieldChange={handleFieldChange}
              onFieldBlur={handleFieldBlur}
            />
          )}

          {currentStep === 2 && (
            <FinancialDetails
              formData={formData}
              errors={errors}
              onFieldChange={handleFieldChange}
              onFieldBlur={handleFieldBlur}
            />
          )}

          {currentStep === 3 && (
            <ReviewAndConsent
              formData={formData}
              errors={errors}
              onFieldChange={handleFieldChange}
              onFieldBlur={handleFieldBlur}
              onEditStep={handleEditStep}
            />
          )}

          {/* API Submission Error Alert */}
          {apiError && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-[#b42318]"
            >
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-[#b42318]"
                aria-hidden="true"
              />
              <div>
                <p className="font-bold">Submission Unsuccessful</p>
                <p className="mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-lf-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePreviousStep}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Previous
                </Button>
              )}
            </div>

            <div>
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto"
                >
                  Next
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    'Submitting Enquiry...'
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Submit Enquiry
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
