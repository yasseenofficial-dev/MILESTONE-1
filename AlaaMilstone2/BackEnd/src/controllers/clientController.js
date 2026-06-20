    const { fakeRequests, fakeEvents, fakeDeliveries } = require("../Database/fakeData");

    // =========================
    // CREATE EVENT
    // =========================
    exports.createEvent = (req, res) => {
    const { eventName, date, location, totalGuests } = req.body;

    if (!eventName || !date || !location || !totalGuests) {
        return res.status(400).json({
        success: false,
        message: "Missing required fields"
        });
    }

    const newEvent = {
        id: fakeEvents.length + 1,
        eventName,
        date,
        location,
        totalGuests,
        arrivedGuests: 0,
        createdAt: new Date().toISOString()
    };

    fakeEvents.push(newEvent);

    res.json({
        success: true,
        message: "Event created successfully",
        event: newEvent
    });
    };

    // =========================
    // GET ALL EVENTS
    // =========================
    exports.getEvents = (req, res) => {
    res.json({
        success: true,
        events: fakeEvents
    });
    };

    // =========================
    // GET EVENT BY ID
    // =========================
    exports.getEventById = (req, res) => {
    const eventId = parseInt(req.params.id);

    const event = fakeEvents.find(e => e.id === eventId);

    if (!event) {
        return res.status(404).json({
        success: false,
        message: "Event not found"
        });
    }

    res.json({
        success: true,
        event
    });
    };

    // =========================
    // CREATE REQUEST
    // =========================
   exports.createRequest = (req, res) => {
  const { eventId, items, notes } = req.body;

  if (!eventId || !items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  const event = fakeEvents.find(e => e.id === eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found"
    });
  }

  const newRequest = {
    id: fakeRequests.length + 1,
    eventName: event.eventName,
    status: "Pending",
    items, // already an array of { name, quantity }
    notes: notes || ""
  };

  fakeRequests.push(newRequest);

  res.json({
    success: true,
    message: "Request created successfully",
    request: newRequest
  });
};


    // =========================
    // GET ALL CLIENT REQUESTS
    // =========================
    exports.getClientRequests = (req, res) => {
    res.json({
        success: true,
        requests: fakeRequests
    });
    };

    // =========================
    // GET CLIENT REQUEST BY ID
    // =========================
    exports.getClientRequestById = (req, res) => {
    const requestId = parseInt(req.params.id);

    const request = fakeRequests.find(r => r.id === requestId);

    if (!request) {
        return res.status(404).json({
        success: false,
        message: "Request not found"
        });
    }

    res.json({
        success: true,
        request
    });
    };


    // =========================
    // GET ALL DELIVERIES (Client View)
    // =========================
    exports.getClientDeliveries = (req, res) => {
    res.json({
        success: true,
        deliveries: fakeDeliveries
    });
    };

    // =========================
    // GET DELIVERY BY ID (Client View)
    // =========================
    exports.getClientDeliveryById = (req, res) => {
    const deliveryId = parseInt(req.params.id);

    const delivery = fakeDeliveries.find(d => d.id === deliveryId);

    if (!delivery) {
        return res.status(404).json({
        success: false,
        message: "Delivery not found"
        });
    }

    res.json({
        success: true,
        delivery
    });
    };
