export function money(value, currency = 'KES') {
  return `${currency} ${Number(value || 0).toLocaleString()}`;
}

export function dateText(timestamp) {
  if (!timestamp?.toDate) return '';
  return timestamp.toDate().toLocaleDateString();
}
