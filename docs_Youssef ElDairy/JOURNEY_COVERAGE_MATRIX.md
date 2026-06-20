# Journey Coverage Matrix — User Journeys 6 to 11

| Journey | Requirement | Implemented In Frontend | Implemented In Backend |
|---|---|---|---|
| 6 | Access day-of dashboard with total guests and arrived guests | `OrganizerDashboardPage.jsx` | `eventsController.getDayOfDashboard` |
| 6 | Send live day-of communications to guests | `CommunicationsPage.jsx` | `communicationsController.createCommunication` |
| 6 | View which guests received and saw messages | `CommunicationsPage.jsx` | `communicationsController.listCommunications` |
| 6 | Send follow-up to guests who have not seen message | `CommunicationsPage.jsx` | `communicationsController.createFollowUp` |
| 7 | Review post-event feedback | `ReportsPage.jsx` | `reportsController.getReport` |
| 7 | Generate reports covering costs, attendance, outcomes | `ReportsPage.jsx` | `reportsController.getReport` |
| 7 | Export reports | `ReportsPage.jsx` | `reportsController.exportCsv` |
| 8 | Staff login with organizer-provided credentials | `LoginPage.jsx` | `authController.login` |
| 9 | Staff view participating events | `StaffEventsPage.jsx` | `eventsController.listEvents` |
| 9 | Filter events by date | `StaffEventsPage.jsx` | `eventsController.listEvents` |
| 9 | View assigned tasks and filter them | `StaffTasksPage.jsx` | `tasksController.listTasks` |
| 9 | Update task completion progress | `StaffTasksPage.jsx` | `tasksController.updateTask` |
| 10 | View shared floor plan | `FloorPlanPage.jsx` | `layoutsController.getLayoutByEvent` |
| 11 | Access guest list and filter by status | `GuestCheckInPage.jsx` | `guestsController.listGuests` |
| 11 | Update guest check-in status | `GuestCheckInPage.jsx` | `guestsController.updateCheckIn` |
| 11 | Access vendor list for event | `VendorArrivalPage.jsx` | `vendorsController.listEventVendors` |
| 11 | Mark vendors as arrived upon delivery | `VendorArrivalPage.jsx` | `vendorsController.updateArrival` |
