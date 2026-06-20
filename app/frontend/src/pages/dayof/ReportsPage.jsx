import { useEffect, useState } from 'react';
import api from '../../api/dayofClient.js';
import EventSelector from '../../components/dayof/EventSelector.jsx';
import PageHeader from '../../components/dayof/PageHeader.jsx';
import StatCard from '../../components/dayof/StatCard.jsx';
import { money } from '../../utils/format.js';

export default function ReportsPage() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get('/events').then(res => { setEvents(res.data.events); setEventId(res.data.events[0]?.id || ''); });
  }, []);
  useEffect(() => {
    if (!eventId) return;
    api.get(`/reports/${eventId}`).then(res => setReport(res.data.report));
  }, [eventId]);

  async function downloadReport() {
    const response = await api.get(`/reports/${eventId}/export.csv`, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url; link.download = `${eventId}-popeyez-report.csv`;
    document.body.appendChild(link); link.click(); link.remove();
  }

  return (
    <div>
      <PageHeader eyebrow="Journey 7" title="Evaluation and Reporting"
        description="Review feedback and generate exportable reports.">
        <EventSelector events={events} value={eventId} onChange={setEventId} />
      </PageHeader>
      {report && (
        <>
          <div className="stats-grid">
            <StatCard label="Invited" value={report.attendance?.invited} hint={`${report.attendance?.checkedIn} checked in`} />
            <StatCard label="Attendance rate" value={`${report.outcome?.attendanceRate}%`} />
            <StatCard label="Actual spend" value={money(report.costs?.actualTotal)} />
            <StatCard label="Feedback avg" value={report.feedback?.averageOverall} hint={`${report.feedback?.totalResponses} responses`} />
          </div>
          <div className="two-column">
            <section className="panel">
              <h3>Outcome summary</h3>
              <ul className="clean-list">
                <li><strong>Budget:</strong> {report.outcome?.budgetStatus}</li>
                <li><strong>Tasks done:</strong> {report.taskSummary?.done}/{report.taskSummary?.total}</li>
              </ul>
              <button className="primary-button" onClick={downloadReport}>Export CSV</button>
            </section>
            <section className="panel">
              <h3>Cost breakdown</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
                  <tbody>
                    {report.costs?.expenses?.map(exp => (
                      <tr key={exp.id}><td>{exp.category}</td><td>{exp.description}</td><td>{money(exp.amount)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          <section className="panel">
            <h3>Guest feedback</h3>
            <div className="cards-list">
              {report.feedback?.comments?.map((item, i) => (
                <div className="mini-card" key={i}>
                  <strong>{item.guestName}</strong><span>Overall: {item.overall}/5</span><p>{item.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
