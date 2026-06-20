export function money(value) {
  return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(value || 0);
}

export function dateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}
