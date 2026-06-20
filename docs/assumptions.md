# Assumptions

1. The project is a local milestone demonstration, so authentication uses seeded accounts and simple password checking rather than production JWT security.
2. The database is implemented as a local JSON file database at `backend/data/database.json`. This keeps setup simple and makes the project runnable without installing MySQL, PostgreSQL, or MongoDB.
3. The normalized SQL schema is still included in `database/schema.sql` to document the database structure.
4. Email and messaging actions are simulated by updating database records. No external email/SMS provider is required.
5. Floor plan export is implemented as a downloadable JSON file containing the saved layout items. This demonstrates export logic without requiring a PDF generator.
6. Image uploads are represented by file names/URLs in the venue records because local file upload middleware was outside the required milestone scope.
7. All roles use the same web application with role-based navigation so evaluators can test all journeys from one frontend.
