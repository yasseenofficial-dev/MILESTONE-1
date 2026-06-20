const { fakeRequests, fakeDeliveries, fakeInvoices } = require("../data/fakeData");



exports.loginVendor = (req, res) => {
  const { email, password } = req.body;

  // Temporary fake login (we will improve later)
  if (email === "vendor@example.com" && password === "1234") {
    return res.json({
      success: true,
      message: "Login successful",
      vendorId: 1
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid credentials"
  });
};
exports.getVendorRequests = (req, res) => {
  res.json({
    success: true,
    requests: fakeRequests
  });
};
exports.acceptRequest = (req, res) => {
  const requestId = parseInt(req.params.id);

  const request = fakeRequests.find(r => r.id === requestId);

  if (!request) {
    return res.status(404).json({
      success: false,
      message: "Request not found"
    });
  }

  // Update request status
  request.status = "Accepted";

  // Auto-create delivery entry
  const newDelivery = {
    id: fakeDeliveries.length + 1,
    requestId: request.id,
    eventName: request.eventName,
    status: "Preparing", // default starting status
    deliveryDate: request.deliveryDate,
    location: request.location
  };

  fakeDeliveries.push(newDelivery);

  res.json({
    success: true,
    message: "Request accepted and delivery created",
    request,
    delivery: newDelivery
  });
};


exports.declineRequest = (req, res) => {
  const requestId = parseInt(req.params.id);

  const request = fakeRequests.find(r => r.id === requestId);

  if (!request) {
    return res.status(404).json({
      success: false,
      message: "Request not found"
    });
  }

  request.status = "Declined";

  res.json({
    success: true,
    message: "Request declined",
    request
  });
};



exports.getDeliveries = (req, res) => {
  res.json({
    success: true,
    deliveries: fakeDeliveries
  });
};




exports.updateDeliveryStatus = (req, res) => {
  const deliveryId = parseInt(req.params.id);
  const { status } = req.body;

  // Allowed statuses
  const validStatuses = ["Preparing", "Out for Delivery", "Delivered"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Allowed: Preparing, Out for Delivery, Delivered"
    });
  }

  const delivery = fakeDeliveries.find(d => d.id === deliveryId);

  if (!delivery) {
    return res.status(404).json({
      success: false,
      message: "Delivery not found"
    });
  }

  delivery.status = status;

  res.json({
    success: true,
    message: "Delivery status updated",
    delivery
  });
};






exports.confirmDelivery = (req, res) => {
  const deliveryId = parseInt(req.params.id);

  const delivery = fakeDeliveries.find(d => d.id === deliveryId);

  if (!delivery) {
    return res.status(404).json({
      success: false,
      message: "Delivery not found"
    });
  }

  // Mark as delivered
  delivery.status = "Delivered";
  delivery.confirmedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Delivery confirmed successfully",
    delivery
  });
};





exports.createInvoice = (req, res) => {
  const { requestId } = req.body;

  const request = fakeRequests.find(r => r.id === requestId);

  if (!request) {
    return res.status(404).json({
      success: false,
      message: "Request not found"
    });
  }

  // Create invoice object
  const newInvoice = {
    id: fakeInvoices.length + 1,
    requestId: request.id,
    eventName: request.eventName,
    items: request.items,
    totalAmount: request.items.reduce((sum, item) => sum + item.quantity * 10, 0), // simple fake pricing
    createdAt: new Date().toISOString()
  };

  fakeInvoices.push(newInvoice);

  res.json({
    success: true,
    message: "Invoice created successfully",
    invoice: newInvoice
  });
};


exports.getInvoices = (req, res) => {
  res.json({
    success: true,
    invoices: fakeInvoices
  });
};




exports.getInvoiceById = (req, res) => {
  const invoiceId = parseInt(req.params.id);

  const invoice = fakeInvoices.find(i => i.id === invoiceId);

  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: "Invoice not found"
    });
  }

  res.json({
    success: true,
    invoice
  });
};



exports.confirmDelivery = (req, res) => {
  const deliveryId = parseInt(req.params.id);

  const delivery = fakeDeliveries.find(d => d.id === deliveryId);

  if (!delivery) {
    return res.status(404).json({
      success: false,
      message: "Delivery not found"
    });
  }

  delivery.status = "Delivered";
  delivery.confirmedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Delivery confirmed successfully",
    delivery
  });
};
