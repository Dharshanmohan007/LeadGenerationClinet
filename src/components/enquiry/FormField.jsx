import { AlertCircle } from 'lucide-react';

/**
 * Reusable accessible form field wrapper with label, optional hint, and error feedback.
 */
export default function FormField({
  id,
  label,
  required = false,
  error = '',
  hint = '',
  children,
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className="block text-xs font-bold text-[#34475d] sm:text-sm"
        >
          {label}
          {required && (
            <span className="ml-1 text-[#b42318]" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {hint && <span className="text-xs text-lf-muted">{hint}</span>}
      </div>

      {children}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-xs font-medium text-[#b42318]"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
