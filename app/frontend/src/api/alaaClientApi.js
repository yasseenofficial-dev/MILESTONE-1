import axios from 'axios';

// AlaaMilstone2 Client API — proxied via /client/*
const BASE = '';

export const getEvents         = () => axios.get(`${BASE}/client/events`);
export const createEvent       = (data) => axios.post(`${BASE}/client/events`, data);
export const getClientRequests = () => axios.get(`${BASE}/client/requests`);
export const createRequest     = (data) => axios.post(`${BASE}/client/requests/create`, data);
export const getClientDeliveries = () => axios.get(`${BASE}/client/deliveries`);
export const getClientInvoices   = () => axios.get(`${BASE}/client/invoices`);
