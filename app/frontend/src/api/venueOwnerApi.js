// Venue Owner API — uses /api/venue-owner/*
const BASE_URL = '/api/venue-owner';

function getToken() {
  return localStorage.getItem('venueOwnerToken');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;
  if (!res.ok) throw new Error(data?.error || `Request failed with status ${res.status}`);
  return data;
}

export const api = {
  register:         (p) => request('/account/register', { method: 'POST', body: p, auth: false }),
  login:            (p) => request('/account/login',    { method: 'POST', body: p, auth: false }),
  getProfile:       ()  => request('/account/me'),
  updateProfile:    (p) => request('/account/me', { method: 'PUT', body: p }),
  getListings:      ()  => request('/listings'),
  getListing:       (id) => request(`/listings/${id}`),
  createListing:    (p) => request('/listings', { method: 'POST', body: p }),
  updateListing:    (id, p) => request(`/listings/${id}`, { method: 'PUT', body: p }),
  addPhotos:        (id, urls) => request(`/listings/${id}/photos`, { method: 'POST', body: { photoUrls: urls } }),
  addFloorPlans:    (id, urls) => request(`/listings/${id}/floor-plans`, { method: 'POST', body: { floorPlanUrls: urls } }),
  setAvailability:  (id, a)   => request(`/listings/${id}/availability`, { method: 'PUT', body: { availability: a } }),
  setListingStatus: (id, s)   => request(`/listings/${id}/status`, { method: 'PATCH', body: { status: s } }),
  deleteListing:    (id) => request(`/listings/${id}`, { method: 'DELETE' }),
  getBookingRequests: (status) => request(`/requests${status ? `?status=${status}` : ''}`),
  getBookingRequest:  (id) => request(`/requests/${id}`),
  respondToRequest:   (id, p) => request(`/requests/${id}/respond`, { method: 'PATCH', body: p }),
  sendRequestMessage: (id, msg) => request(`/requests/${id}/message`, { method: 'POST', body: { message: msg } }),
  getBookings:        (params = {}) => request(`/bookings${new URLSearchParams(params).toString() ? `?${new URLSearchParams(params).toString()}` : ''}`),
  getBooking:         (id) => request(`/bookings/${id}`),
  getUpcomingBookings: ()  => request('/bookings-upcoming'),
  getSummary:         ()  => request('/reports/summary'),
  getHistory:         (params = {}) => request(`/reports/history${new URLSearchParams(params).toString() ? `?${new URLSearchParams(params).toString()}` : ''}`),
  getExportUrl:       ()  => `${BASE_URL}/reports/export`
};

export { getToken };
