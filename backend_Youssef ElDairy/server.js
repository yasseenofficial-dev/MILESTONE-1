const app = require('./src/app');
const { ensureDatabaseExists } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

ensureDatabaseExists();

app.listen(PORT, () => {
  console.log(`PopEyez Journeys 6-11 API running on http://localhost:${PORT}`);
  console.log('Demo login: organizer@popeyez.com / password123');
});
