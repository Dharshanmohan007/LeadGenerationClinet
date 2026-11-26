/**
 * Format a numeric value in Indian Rupee (INR) notation (e.g., ₹5,00,000).
 * Returns an empty fallback if the input is not a valid finite number.
 */
export function formatINR(value, fallback = '—') {
  if (value === '' || value === null || value === undefined) {
    return fallback;
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericValue);
}

/**
 * Format loan amounts with both exact INR and readable Lakh suffix for quick comprehension.
 */
export function formatLoanAmountLabel(amount) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return '—';
  }

  const lakhs = numericAmount / 100000;
  const formattedLakhs = Number.isInteger(lakhs)
    ? `${lakhs}`
    : lakhs.toFixed(1).replace(/\.0$/, '');
  const unit = lakhs === 1 ? 'Lakh' : 'Lakhs';

  return `${formatINR(numericAmount)} (₹${formattedLakhs} ${unit})`;
}
