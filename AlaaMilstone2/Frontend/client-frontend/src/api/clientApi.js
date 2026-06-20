import axios from "axios";

const API = "http://localhost:5000";

// EVENTS
export const getEvents = () => axios.get(`${API}/client/events`);
export const createEvent = (eventData) =>
  axios.post(`${API}/client/events`, eventData);

// REQUESTS
export const getClientRequests = () => axios.get(`${API}/client/requests`);
export const createRequest = (data) => axios.post(`${API}/client/requests/create`, data);

// DELIVERIES
export const getClientDeliveries = () => axios.get(`${API}/client/deliveries`);
export const getClientInvoices = () => axios.get(`${API}/client/invoices`);
