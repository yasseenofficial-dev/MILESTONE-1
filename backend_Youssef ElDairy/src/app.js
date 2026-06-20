require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const taskRoutes = require('./routes/taskRoutes');
const layoutRoutes = require('./routes/layoutRoutes');
const guestRoutes = require('./routes/guestRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PopEyez Journeys 6-11 API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/layouts', layoutRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
