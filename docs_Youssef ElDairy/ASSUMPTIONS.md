# Assumptions for User Journeys 6–11

1. Only Event Organizer and Team Member / Staff functionality is implemented because the requested scope is User Journeys 6 to 11.
2. Guests do not log in in this part of the system; their message statuses, RSVP data, and feedback exist as records managed by the organizer/staff workflows.
3. Vendors do not log in in this part; vendor delivery records are viewed and updated by staff for Journey 11.
4. The database is a local JSON file to make the project runnable without external database installation.
5. Authentication is intentionally simple for academic demonstration. Passwords are stored as plain demo values in seeded data and must not be used in production.
6. Export is implemented as CSV because it is easy for evaluators to open in Excel and satisfies the report export requirement for this scoped implementation.
7. The floor plan is view-only for staff because Journey 10 only asks staff to access and view the floor plan designed by the organizer.
8. Day-of communications are simulated inside the database; no real email/SMS integration is used.
9. Follow-up messages target guests whose status is not seen on the selected original communication.
10. All missing details were reasonably assumed and documented here as requested by the Milestone 2 guidelines.
