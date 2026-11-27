import {
  ENQUIRY_SOURCE_META,
  ENQUIRY_STATUS_MAP,
} from '../../../config/dsa/enquiryConfig';

export function EnquiryStatusBadge({ status }) {
  const meta = ENQUIRY_STATUS_MAP[status] || {
    label: status || 'Unknown',
    badgeClass: 'bg-slate-100 text-slate-700 ring-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 whitespace-nowrap ${meta.badgeClass}`}
    >
      {meta.label}
    </span>
  );
}

export function EnquirySourceBadge({ source }) {
  const meta = ENQUIRY_SOURCE_META[source] || ENQUIRY_SOURCE_META.website;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 whitespace-nowrap ${meta.badgeClass}`}
    >
      {meta.shortLabel}
    </span>
  );
}
