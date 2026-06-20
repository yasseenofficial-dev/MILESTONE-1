const BASE_URL = "/api/venue-owner";

function getToken() {
  return localStorage.getItem("venueOwnerToken");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  // Account (journey 22)
  register: (payload) => request("/account/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/account/login", { method: "POST", body: payload, auth: false }),
  getProfile: () => request("/account/me"),
  updateProfile: (payload) => request("/account/me", { method: "PUT", body: payload }),

  // Listings (journey 23)
  getListings: () => request("/listings"),
  getListing: (id) => request(`/listings/${id}`),
  createListing: (payload) => request("/listings", { method: "POST", body: payload }),
  updateListing: (id, payload) => request(`/listings/${id}`, { method: "PUT", body: payload }),
  addPhotos: (id, photoUrls) => request(`/listings/${id}/photos`, { method: "POST", body: { photoUrls } }),
  addFloorPlans: (id, floorPlanUrls) =>
    request(`/listings/${id}/floor-plans`, { method: "POST", body: { floorPlanUrls } }),
  setAvailability: (id, availability) =>
    request(`/listings/${id}/availability`, { method: "PUT", body: { availability } }),
  setListingStatus: (id, status) => request(`/listings/${id}/status`, { method: "PATCH", body: { status } }),
  deleteListing: (id) => request(`/listings/${id}`, { method: "DELETE" }),

  // Booking requests (journey 24)
  getBookingRequests: (status) => request(`/requests${status ? `?status=${status}` : ""}`),
  getBookingRequest: (id) => request(`/requests/${id}`),
  respondToRequest: (id, payload) => request(`/requests/${id}/respond`, { method: "PATCH", body: payload }),
  sendRequestMessage: (id, message) => request(`/requests/${id}/message`, { method: "POST", body: { message } }),

  // Booking overview (journey 25)
  getBookings: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/bookings${qs ? `?${qs}` : ""}`);
  },
  getBooking: (id) => request(`/bookings/${id}`),
  getUpcomingBookings: () => request("/bookings-upcoming"),

  // Reporting (journey 26)
  getSummary: () => request("/reports/summary"),
  getHistory: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/reports/history${qs ? `?${qs}` : ""}`);
  },
  getExportUrl: () => `${BASE_URL}/reports/export`
};

export { getToken };
