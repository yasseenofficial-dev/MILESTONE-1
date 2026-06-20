import axios from 'axios';

// AlaaMilstone2 Vendor API — proxied via /vendor/*
export const getVendorRequests    = () => axios.get('/vendor/requests');
export const acceptRequest        = (id) => axios.post(`/vendor/requests/${id}/accept`);
export const declineRequest       = (id) => axios.post(`/vendor/requests/${id}/decline`);
export const getDeliveries        = () => axios.get('/vendor/deliveries');
export const updateDeliveryStatus = (id, status) => axios.put(`/vendor/deliveries/${id}/status`, { status });
export const confirmDelivery      = (id) => axios.post(`/vendor/deliveries/${id}/confirm`);
export const createInvoice        = (data) => axios.post('/vendor/invoices/create', data);
export const getVendorInvoices    = () => axios.get('/vendor/invoices');
export const loginVendor          = (email, password) => axios.post('/vendor/login', { email, password });
