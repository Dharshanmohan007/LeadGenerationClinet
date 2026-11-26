import { Loader2 } from 'lucide-react';

export default function Loader({
  message = 'Loading...',
  fullScreen = false,
  className = '',
}) {
  const containerClasses = fullScreen
    ? 'min-h-screen w-full flex flex-col items-center justify-center bg-lf-bg px-4'
    : 'w-full flex flex-col items-center justify-center py-12 px-4';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${containerClasses} ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lf-green-soft text-lf-green shadow-2xs ring-1 ring-lf-green-border">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-medium text-lf-muted">{message}</p>
    </div>
  );
}
