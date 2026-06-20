import { useEffect, useState } from 'react';
import api from '../api/client.js';
import EventSelector from '../components/EventSelector.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { money } from '../utils/format.js';

export default function ReportsPage() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get('/events').then(res => {
      setEvents(res.data.events);
      setEventId(res.data.events[0]?.id || '');
    });
  }, []);

  useEffect(() => {
    if (!eventId) return;
    api.get(`/reports/${eventId}`).then(res => setReport(res.data.report));
  }, [eventId]);

  function exportReport() {
    const token = localStorage.getItem('popeyez_token');
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/${eventId}/export.csv?token=${token}`, '_blank');
  }

  async function downloadReport() {
    const response = await api.get(`/reports/${eventId}/export.csv`, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventId}-popeyez-report.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Journey 7"
        title="Evaluation and Reporting"
        description="Review feedback and generate exportable reports covering costs, attendance, and outcomes."
      >
        <EventSelector events={events} value={eventId} onChange={setEventId} />
      </PageHeader>

      {report && (
        <>
          <div className="stats-grid">
            <StatCard label="Invited" value={report.attendance.invited} hint={`${report.attendance.checkedIn} checked in`} />
            <StatCard label="Attendance rate" value={`${report.outcome.attendanceRate}%`} hint="Checked in / invited" />
            <StatCard label="Actual spend" value={money(report.costs.actualTotal)} hint={`Planned ${money(report.costs.plannedBudget)}`} />
            <StatCard label="Budget variance" value={money(report.costs.variance)} hint={report.outcome.budgetStatus} />
            <StatCard label="Feedback average" value={report.feedback.averageOverall} hint={`${report.feedback.totalResponses} responses`} />
          </div>

          <div className="two-column">
            <section className="panel">
              <h3>Outcome summary</h3>
              <ul className="clean-list">
                <li><strong>Budget:</strong> {report.outcome.budgetStatus}</li>
                <li><strong>Readiness:</strong> {report.outcome.readinessStatus}</li>
                <li><strong>Vendors:</strong> {report.outcome.vendorStatus}</li>
                <li><strong>Tasks done:</strong> {report.taskSummary.done}/{report.taskSummary.total}</li>
              </ul>
              <button className="primary-button" onClick={downloadReport}>Export CSV report</button>
            </section>

            <section className="panel">
              <h3>Cost breakdown</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
                  <tbody>
                    {report.costs.expenses.map(expense => (
                      <tr key={expense.id}><td>{expense.category}</td><td>{expense.description}</td><td>{money(expense.amount)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className="panel">
            <h3>Guest feedback</h3>
            <div className="feedback-grid">
              {report.feedback.comments.map((item, index) => (
                <div className="mini-card" key={`${item.guestName}-${index}`}>
                  <strong>{item.guestName}</strong>
                  <span>Overall rating: {item.overall}/5</span>
                  <p>{item.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
