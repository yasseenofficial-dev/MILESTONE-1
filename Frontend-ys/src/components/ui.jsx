export function StatusBadge({ status }) {
  const map = {
    DRAFT: 'gray', PLANNING: 'info', CONFIRMED: 'primary', IN_PROGRESS: 'warning',
    COMPLETED: 'success', CANCELLED: 'danger',
    PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger',
    TODO: 'gray', DONE: 'success', BLOCKED: 'danger',
    ACCEPTED: 'success', DECLINED: 'danger', MAYBE: 'warning',
    SENT: 'info', QUOTED: 'primary', PAID: 'success', OVERDUE: 'danger',
    SCHEDULED: 'info', IN_TRANSIT: 'warning', DELIVERED: 'success', DELAYED: 'danger',
    LOW: 'gray', MEDIUM: 'info', HIGH: 'warning', URGENT: 'danger',
    ACTIVE: 'success', INACTIVE: 'danger',
  };
  const variant = map[status] || 'gray';
  return <span className={`badge badge-${variant}`}>{status?.replace(/_/g, ' ')}</span>;
}

export function Loading() {
  return <div className="loading">Loading...</div>;
}

export function EmptyState({ message = 'No data found' }) {
  return <div className="empty-state">{message}</div>;
}

export function Modal({ title, children, onClose, onSubmit, submitLabel = 'Save' }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {onSubmit && (
            <button type="button" className="btn btn-primary" onClick={onSubmit}>{submitLabel}</button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Alert({ type = 'error', message }) {
  if (!message) return null;
  return <div className={`alert alert-${type}`}>{message}</div>;
}
