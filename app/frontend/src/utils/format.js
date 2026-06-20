export function dateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

export function money(amount, currency = 'EGP') {
  if (amount === undefined || amount === null) return '—';
  return `${Number(amount).toLocaleString()} ${currency}`;
}

export function date(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString();
}
