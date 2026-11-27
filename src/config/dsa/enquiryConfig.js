export const ENQUIRY_STATUS_OPTIONS = [
  { value: 'new', label: 'New', badgeClass: 'bg-blue-50 text-blue-700 ring-blue-200', barColor: 'bg-blue-600' },
  { value: 'contacted', label: 'Contacted', badgeClass: 'bg-indigo-50 text-indigo-700 ring-indigo-200', barColor: 'bg-indigo-500' },
  { value: 'in_progress', label: 'In Progress', badgeClass: 'bg-amber-50 text-amber-800 ring-amber-200', barColor: 'bg-amber-500' },
  { value: 'follow_up_required', label: 'Follow-up Required', badgeClass: 'bg-orange-50 text-orange-800 ring-orange-200', barColor: 'bg-orange-500' },
  { value: 'qualified', label: 'Qualified', badgeClass: 'bg-teal-50 text-teal-800 ring-teal-200', barColor: 'bg-teal-500' },
  { value: 'converted', label: 'Converted', badgeClass: 'bg-lf-green-soft text-lf-green-dark ring-lf-green-border', barColor: 'bg-lf-green' },
  { value: 'rejected', label: 'Rejected', badgeClass: 'bg-rose-50 text-[#b42318] ring-rose-200', barColor: 'bg-[#b42318]' },
  { value: 'closed', label: 'Closed', badgeClass: 'bg-slate-100 text-slate-700 ring-slate-200', barColor: 'bg-slate-500' },
];

export const ENQUIRY_STATUS_MAP = Object.fromEntries(
  ENQUIRY_STATUS_OPTIONS.map((item) => [item.value, item])
);

export const ENQUIRY_SOURCE_META = {
  website: {
    key: 'website',
    label: 'Website Enquiry',
    shortLabel: 'Website',
    route: '/dsa/enquiries/website',
    badgeClass: 'bg-lf-green-soft text-lf-green-dark ring-lf-green-border',
    barColor: 'bg-lf-green',
  },
  cibil: {
    key: 'cibil',
    label: 'CIBIL Enquiry',
    shortLabel: 'CIBIL',
    route: '/dsa/enquiries/cibil',
    badgeClass: 'bg-sky-50 text-sky-800 ring-sky-200',
    barColor: 'bg-sky-600',
  },
  bank_rejected: {
    key: 'bank_rejected',
    label: 'Bank Rejected Enquiry',
    shortLabel: 'Bank Rejected',
    route: '/dsa/enquiries/bank_rejected'.replace('_', '-'),
    badgeClass: 'bg-amber-50 text-amber-800 ring-amber-200',
    barColor: 'bg-amber-500',
  },
};

export function formatRelativeTime(dateInput) {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '—';

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return 'Just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateInput) {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function evaluatePasswordStrength(password = '') {
  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  let label = 'Weak';
  let colorClass = 'bg-[#b42318]';

  if (score >= 5) {
    label = 'Strong';
    colorClass = 'bg-lf-green';
  } else if (score >= 3) {
    label = 'Moderate';
    colorClass = 'bg-amber-500';
  }

  return { checks, score, label, colorClass, isStrong: score === 5 };
}
