import api from './organizerClient.js';

export const authApi = {
  register:       (data) => api.post('/auth/register', data),
  login:          (data) => api.post('/auth/login', data),
  getProfile:     ()     => api.get('/auth/profile'),
  updateProfile:  (data) => api.put('/auth/profile', data),
};

export const accountApi = {
  getAccounts:              (params) => api.get('/accounts', { params }),
  createAccount:            (data)   => api.post('/accounts', data),
  updateAccount:            (id, data) => api.put(`/accounts/${id}`, data),
  deactivateAccount:        (id)     => api.patch(`/accounts/${id}/deactivate`),
  deactivateAllStakeholders:(data)   => api.patch('/accounts/deactivate-stakeholders', data),
};

export const eventApi = {
  getDashboard: () => api.get('/events/dashboard'),
  getEvents:    (params) => api.get('/events', { params }),
  getEvent:     (id) => api.get(`/events/${id}`),
  createEvent:  (data) => api.post('/events', data),
  updateEvent:  (id, data) => api.put(`/events/${id}`, data),
  deleteEvent:  (id) => api.delete(`/events/${id}`),
};

export const venueApi = {
  getVenues:     (params) => api.get('/venues', { params }),
  getVenue:      (id)     => api.get(`/venues/${id}`),
  getBookings:   (params) => api.get('/venues/bookings', { params }),
  createBooking: (data)   => api.post('/venues/bookings', data),
  cancelBooking: (id)     => api.delete(`/venues/bookings/${id}`),
};

export const stakeholderApi = {
  getAll: (eventId) => api.get(`/events/${eventId}/stakeholders`),
  create: (eventId, data) => api.post(`/events/${eventId}/stakeholders`, data),
  update: (eventId, id, data) => api.put(`/events/${eventId}/stakeholders/${id}`, data),
  remove: (eventId, id) => api.delete(`/events/${eventId}/stakeholders/${id}`),
};

export const taskApi = {
  getTasks:     (eventId, params) => api.get(`/events/${eventId}/tasks`, { params }),
  getReminders: () => api.get('/tasks/reminders'),
  create:       (eventId, data) => api.post(`/events/${eventId}/tasks`, data),
  update:       (eventId, id, data) => api.put(`/events/${eventId}/tasks/${id}`, data),
  remove:       (eventId, id) => api.delete(`/events/${eventId}/tasks/${id}`),
};

export const budgetApi = {
  getBudget:      (eventId) => api.get(`/events/${eventId}/budget`),
  createCategory: (eventId, data) => api.post(`/events/${eventId}/budget/categories`, data),
  updateCategory: (eventId, id, data) => api.put(`/events/${eventId}/budget/categories/${id}`, data),
  deleteCategory: (eventId, id) => api.delete(`/events/${eventId}/budget/categories/${id}`),
  createExpense:  (eventId, data) => api.post(`/events/${eventId}/budget/expenses`, data),
  deleteExpense:  (eventId, id) => api.delete(`/events/${eventId}/budget/expenses/${id}`),
};

export const floorPlanApi = {
  getAll:  (eventId) => api.get(`/events/${eventId}/floor-plans`),
  get:     (eventId, id) => api.get(`/events/${eventId}/floor-plans/${id}`),
  create:  (eventId, data) => api.post(`/events/${eventId}/floor-plans`, data),
  update:  (eventId, id, data) => api.put(`/events/${eventId}/floor-plans/${id}`, data),
  remove:  (eventId, id) => api.delete(`/events/${eventId}/floor-plans/${id}`),
};

export const staffApi = {
  getAll:     (eventId) => api.get(`/events/${eventId}/staff`),
  create:     (eventId, data) => api.post(`/events/${eventId}/staff`, data),
  update:     (eventId, id, data) => api.put(`/events/${eventId}/staff/${id}`, data),
  remove:     (eventId, id) => api.delete(`/events/${eventId}/staff/${id}`),
  assignTask: (eventId, staffId, taskId) => api.put(`/events/${eventId}/staff/${staffId}/tasks/${taskId}`),
};

export const vendorApi = {
  getCatalog:     (params) => api.get('/vendors', { params }),
  getEventVendors:(eventId) => api.get(`/events/${eventId}/vendors/vendors`),
  addEventVendor: (eventId, data) => api.post(`/events/${eventId}/vendors/vendors`, data),
  getSourcing:    (eventId) => api.get(`/events/${eventId}/vendors/sourcing`),
  createSourcing: (eventId, data) => api.post(`/events/${eventId}/vendors/sourcing`, data),
  updateSourcing: (eventId, id, data) => api.put(`/events/${eventId}/vendors/sourcing/${id}`, data),
  createDelivery: (eventId, data) => api.post(`/events/${eventId}/vendors/deliveries`, data),
  updateDelivery: (eventId, id, data) => api.put(`/events/${eventId}/vendors/deliveries/${id}`, data),
  createInvoice:  (eventId, data) => api.post(`/events/${eventId}/vendors/invoices`, data),
  updateInvoice:  (eventId, id, data) => api.put(`/events/${eventId}/vendors/invoices/${id}`, data),
};

export const guestApi = {
  getGuests:       (eventId, params) => api.get(`/events/${eventId}/guests`, { params }),
  getStats:        (eventId) => api.get(`/events/${eventId}/guests/stats`),
  getFeedback:     (eventId) => api.get(`/events/${eventId}/guests/feedback`),
  create:          (eventId, data) => api.post(`/events/${eventId}/guests`, data),
  update:          (eventId, id, data) => api.put(`/events/${eventId}/guests/${id}`, data),
  remove:          (eventId, id) => api.delete(`/events/${eventId}/guests/${id}`),
  sendInvitations: (eventId, guestIds) => api.post(`/events/${eventId}/guests/send-invitations`, { guestIds }),
};
