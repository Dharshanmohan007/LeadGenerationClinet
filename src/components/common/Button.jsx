import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const VARIANT_CLASSES = {
  primary:
    'bg-lf-green text-white shadow-[0_8px_18px_rgba(21,155,119,0.22)] hover:brightness-95 active:brightness-90 disabled:opacity-60',
  secondary:
    'bg-lf-navy text-white shadow-sm hover:bg-lf-navy-2 active:bg-lf-footer disabled:opacity-60',
  outline:
    'border border-lf-line bg-white text-lf-navy shadow-2xs hover:bg-lf-bg hover:border-[#cfd8e3] disabled:text-lf-muted',
  ghost:
    'bg-transparent text-lf-navy hover:bg-lf-bg disabled:text-lf-muted',
  danger:
    'bg-[#b42318] text-white shadow-sm hover:brightness-95 disabled:opacity-60',
};

const SIZE_CLASSES = {
  sm: 'px-3.5 py-2 text-sm rounded-[9px]',
  md: 'px-5 py-2.5 text-sm font-bold rounded-[10px]',
  lg: 'px-6 py-3.5 text-base font-bold rounded-[10px]',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  to,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...rest
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lf-green focus-visible:ring-offset-2';

  const composedClasses = [
    baseClasses,
    VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
    SIZE_CLASSES[size] || SIZE_CLASSES.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to && !disabled && !isLoading) {
    return (
      <Link to={to} className={composedClasses} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={composedClasses}
      {...rest}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
