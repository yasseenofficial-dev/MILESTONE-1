import axios from "axios";

const API = "http://localhost:5000";

// Get all vendor requests
export const getVendorRequests = () =>
  axios.get(`${API}/vendor/requests`);

// Accept a request
export const acceptRequest = (id) => {
  return axios.post(`http://localhost:5000/vendor/requests/${id}/accept`);
};







export const getDeliveries = () => {
  return axios.get("http://localhost:5000/vendor/deliveries");
};

export const updateDeliveryStatus = (id, status) => {
  return axios.put(`http://localhost:5000/vendor/deliveries/${id}/status`, {
    status
  });
};

export const confirmDelivery = (id) => {
  return axios.post(`http://localhost:5000/vendor/deliveries/${id}/confirm`);
};

