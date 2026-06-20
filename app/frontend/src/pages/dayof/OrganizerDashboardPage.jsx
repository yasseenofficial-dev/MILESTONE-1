import { useEffect, useState } from 'react';
import api from '../../api/dayofClient.js';
import EventSelector from '../../components/dayof/EventSelector.jsx';
import LoadingState from '../../components/dayof/LoadingState.jsx';
import PageHeader from '../../components/dayof/PageHeader.jsx';
import StatCard from '../../components/dayof/StatCard.jsx';
import StatusBadge from '../../components/dayof/StatusBadge.jsx';

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then(res => {
      setEvents(res.data.events);
      setSelectedEventId(res.data.events[0]?.id || '');
    });
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    setLoading(true);
    api.get(`/events/${selectedEventId}/day-of-dashboard`)
      .then(res => setDashboard(res.data))
      .finally(() => setLoading(false));
  }, [selectedEventId]);

  return (
    <div>
      <PageHeader eyebrow="Journey 6" title="Day-Of Operations Dashboard"
        description="Live visibility over guest arrivals, tasks, vendor deliveries, and communications.">
        <EventSelector events={events} value={selectedEventId} onChange={setSelectedEventId} />
      </PageHeader>

      {loading || !dashboard ? <LoadingState /> : (
        <>
          <div className="stats-grid">
            <StatCard label="Total guests" value={dashboard.metrics.totalGuests} hint="Invited" />
            <StatCard label="Arrived" value={dashboard.metrics.arrivedGuests} hint={`${dashboard.metrics.waitingGuests} not arrived`} />
            <StatCard label="Task completion" value={`${dashboard.metrics.taskCompletionRate}%`} hint={`${dashboard.metrics.doneTasks}/${dashboard.metrics.totalTasks} done`} />
            <StatCard label="Vendor arrivals" value={`${dashboard.metrics.vendorArrivalRate}%`} hint={`${dashboard.metrics.arrivedVendors}/${dashboard.metrics.totalVendors} arrived`} />
            <StatCard label="Messages sent" value={dashboard.metrics.totalMessagesSent} />
          </div>
          <div className="two-column">
            <section className="panel">
              <h3>Operational Tasks</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Task</th><th>Owner</th><th>Status</th><th>Progress</th></tr></thead>
                  <tbody>
                    {dashboard.recentTasks.map(task => (
                      <tr key={task.id}>
                        <td>{task.title}</td><td>{task.assignedTo}</td>
                        <td><StatusBadge value={task.status} /></td><td>{task.progress}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="panel">
              <h3>Vendor Monitor</h3>
              <div className="cards-list">
                {dashboard.vendorStatus.map(item => (
                  <div className="mini-card" key={item.id}>
                    <strong>{item.vendor?.name}</strong><p>{item.orderSummary}</p>
                    <div className="row-gap"><StatusBadge value={item.deliveryStatus} /><StatusBadge value={item.arrivalStatus} /></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
