const fakeRequests = [
  {
    id: 1,
    eventName: "Tech Expo 2025",
    status: "Pending",
    items: [
      { name: "Vegetarian Buffet", quantity: 1 }
    ],
    notes: "Need vegetarian buffet for 50 guests"
  },
  {
    id: 2,
    eventName: "Wedding Ceremony",
    status: "Approved",
    items: [
      { name: "Photography Package", quantity: 1 }
    ],
    notes: "Full-day wedding photography package"
  },
  {
    id: 3,
    eventName: "Birthday Party",
    status: "Rejected",
    items: [
      { name: "Balloon Setup", quantity: 1 },
      { name: "Lighting", quantity: 1 }
    ],
    notes: "Birthday party decoration setup"
  }
];


const fakeEvents = [
  {
    id: 1,
    eventName: "Tech Expo 2025",
    date: "2025-07-12",
    location: "Berlin"
  },
  {
    id: 2,
    eventName: "Wedding Ceremony",
    date: "2025-08-03",
    location: "Munich"
  },
  {
    id: 3,
    eventName: "Birthday Party",
    date: "2025-09-20",
    location: "Hamburg"
  }
];
const fakeDeliveries = [
  {
    id: 1,
    requestId: 1,
    deliveryDate: "2025-07-11",
    status: "On the way"
  },
  {
    id: 2,
    requestId: 2,
    deliveryDate: "2025-08-02",
    status: "Delivered"
  },
  {
    id: 3,
    requestId: 3,
    deliveryDate: "2025-09-19",
    status: "Pending"
  }
];

const fakeInvoices = [
  {
    id: 1,
    amount: 120.50,
    date: "2024-06-01",
    status: "Paid"
  },
  {
    id: 2,
    amount: 89.99,
    date: "2024-06-10",
    status: "Pending"
  },
  {
    id: 3,
    amount: 250.00,
    date: "2025-07-15",
    status: "Paid"
  }
];




module.exports = {
  fakeRequests,
  fakeEvents,
  fakeDeliveries,
  fakeInvoices
};
