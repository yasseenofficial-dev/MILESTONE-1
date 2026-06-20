export default function StatusBadge({ value }) {
  const normalized = String(value || '').toLowerCase().replace(/\s+/g, '-');
  return <span className={`status-badge status-${normalized}`}>{value}</span>;
}
