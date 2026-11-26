import { Layers } from 'lucide-react';

/**
 * Honest structural placeholder for upcoming DSA and Super Admin dashboard pages.
 * Deliberately renders zero fake statistics or synthetic customer records.
 */
export default function PortalPlaceholder({
  title,
  description,
  plannedFeatures = [],
  backendRequirements = [],
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-lf-line bg-white p-6 shadow-2xs sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lf-green-soft text-lf-green">
            <Layers className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <span className="inline-block rounded-full bg-lf-green-soft px-2.5 py-0.5 text-xs font-bold text-lf-green-dark ring-1 ring-lf-green-border">
              Phase 2 Portal Placeholder
            </span>
            <h1 className="mt-2 text-2xl font-bold text-lf-navy">{title}</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-lf-muted">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-lf-line bg-lf-bg p-5">
            <h2 className="text-sm font-bold text-lf-navy">
              Planned Frontend Capabilities
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-lf-muted">
              {plannedFeatures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-lf-line bg-lf-bg p-5">
            <h2 className="text-sm font-bold text-lf-navy">
              Pending Backend API Integration
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-lf-muted">
              {backendRequirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
