const express = require("express");
const router = express.Router();

const { 
  loginVendor, 
  getVendorRequests, 
  acceptRequest, 
  declineRequest,
  getDeliveries,
  updateDeliveryStatus,
  confirmDelivery,
  createInvoice,
  getInvoices,
  getInvoiceById
} = require("../controllers/vendorController");




router.post("/login", loginVendor);
router.get("/requests", getVendorRequests);
router.post("/requests/:id/accept", acceptRequest);
router.post("/requests/:id/decline", declineRequest);
router.get("/deliveries", getDeliveries);
router.put("/deliveries/:id/status", updateDeliveryStatus);
router.post("/deliveries/:id/confirm", confirmDelivery);
router.post("/invoices/create", createInvoice);
router.get("/invoices", getInvoices);
router.get("/invoices/:id", getInvoiceById);
router.put("/deliveries/:id/confirm", confirmDelivery);




module.exports = router;
