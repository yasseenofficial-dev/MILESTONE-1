const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const venueRoutes = require('./routes/venueRoutes');
const stakeholderRoutes = require('./routes/stakeholderRoutes');
const taskRoutes = require('./routes/taskRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const floorPlanRoutes = require('./routes/floorPlanRoutes');
const staffRoutes = require('./routes/staffRoutes');
const vendorCatalogRoutes = require('./routes/vendorCatalogRoutes');
const eventVendorRoutes = require('./routes/eventVendorRoutes');
const guestRoutes = require('./routes/guestRoutes');
const accountRoutes = require('./routes/accountRoutes');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Event Organizer API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/events/:eventId/stakeholders', stakeholderRoutes);
app.use('/api/events/:eventId/tasks', taskRoutes);
app.use('/api/events/:eventId/budget', budgetRoutes);
app.use('/api/events/:eventId/floor-plans', floorPlanRoutes);
app.use('/api/events/:eventId/staff', staffRoutes);
app.use('/api/events/:eventId/vendors', eventVendorRoutes);
app.use('/api/events/:eventId/guests', guestRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/vendors', vendorCatalogRoutes);
app.use('/api/tasks', reminderRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

module.exports = app;
