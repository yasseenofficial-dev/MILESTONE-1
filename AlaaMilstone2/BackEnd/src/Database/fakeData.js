const fakeEvents = [
  { id: 1, eventName: "Cairo Tech Expo 2026",    date: "2026-07-12", location: "Cairo Business Hall, Zamalek" },
  { id: 2, eventName: "Grand Wedding Ceremony",   date: "2026-08-03", location: "Nile Garden Terrace, Cairo" },
  { id: 3, eventName: "Birthday Gala Night",      date: "2026-08-20", location: "Pyramids Conference Center, Giza" },
  { id: 4, eventName: "Product Launch — BrewCo",  date: "2026-09-05", location: "Zamalek Rooftop Loft, Cairo" },
  { id: 5, eventName: "Charity Fundraiser Dinner",date: "2026-09-15", location: "Alexandria Sea View Hall" },
  { id: 6, eventName: "Annual Sports Day",        date: "2026-10-01", location: "Cairo Stadium, Nasr City" }
];

const fakeRequests = [
  {
    id: 1, eventId: 1,
    eventName: "Cairo Tech Expo 2026",
    status: "Pending",
    items: [{ name: "Vegetarian Buffet", quantity: 1 }, { name: "Coffee Station", quantity: 2 }],
    notes: "Vegetarian buffet for 80 guests plus 2 coffee stations"
  },
  {
    id: 2, eventId: 2,
    eventName: "Grand Wedding Ceremony",
    status: "Approved",
    items: [{ name: "Full-Day Photography Package", quantity: 1 }, { name: "Floral Arch Decoration", quantity: 1 }],
    notes: "Full-day wedding photography and floral arch for the ceremony"
  },
  {
    id: 3, eventId: 3,
    eventName: "Birthday Gala Night",
    status: "Rejected",
    items: [{ name: "Balloon Setup", quantity: 1 }, { name: "Uplighting Kit", quantity: 4 }],
    notes: "Balloon ceiling installation and uplighting — rejected due to venue restrictions"
  },
  {
    id: 4, eventId: 4,
    eventName: "Product Launch — BrewCo",
    status: "Approved",
    items: [{ name: "Branded Tote Bags", quantity: 300 }, { name: "Stage Backdrop Print", quantity: 1 }],
    notes: "Branded giveaways and stage backdrop for the launch event"
  },
  {
    id: 5, eventId: 5,
    eventName: "Charity Fundraiser Dinner",
    status: "Pending",
    items: [{ name: "3-Course Dinner Catering", quantity: 1 }, { name: "Live Band Setup", quantity: 1 }],
    notes: "Premium 3-course dinner for 150 guests and live entertainment"
  },
  {
    id: 6, eventId: 6,
    eventName: "Annual Sports Day",
    status: "Cancelled",
    items: [{ name: "Outdoor Sound System", quantity: 1 }, { name: "Portable Toilets", quantity: 6 }],
    notes: "Cancelled — postponed to next quarter"
  },
  {
    id: 7, eventId: 1,
    eventName: "Cairo Tech Expo 2026",
    status: "Approved",
    items: [{ name: "Printed Lanyards", quantity: 500 }, { name: "Welcome Banners", quantity: 4 }],
    notes: "Branded lanyards and entrance banners for 500 attendees"
  }
];

const fakeDeliveries = [
  { id: 1, requestId: 1, deliveryDate: "2026-07-11", status: "Pending",        notes: "Awaiting vendor confirmation" },
  { id: 2, requestId: 2, deliveryDate: "2026-08-02", status: "Delivered",      notes: "Delivered to venue on time" },
  { id: 3, requestId: 3, deliveryDate: "2026-08-19", status: "Cancelled",      notes: "Cancelled alongside request" },
  { id: 4, requestId: 4, deliveryDate: "2026-09-04", status: "On the way",     notes: "Driver en route — ETA 2 hours" },
  { id: 5, requestId: 5, deliveryDate: "2026-09-14", status: "Pending",        notes: "Catering van scheduled" },
  { id: 6, requestId: 7, deliveryDate: "2026-07-10", status: "Delivered",      notes: "All printed items confirmed received" },
  { id: 7, requestId: 4, deliveryDate: "2026-09-04", status: "Failed",         notes: "Stage backdrop damaged in transit — replacement ordered" }
];

const fakeInvoices = [
  { id: 1, requestId: 2, amount: 18500.00, date: "2026-08-03", status: "Paid",     notes: "Photography + floral — paid in full" },
  { id: 2, requestId: 1, amount:  9200.00, date: "2026-07-12", status: "Pending",  notes: "Catering deposit awaiting transfer" },
  { id: 3, requestId: 4, amount:  7400.00, date: "2026-09-05", status: "Paid",     notes: "Tote bags and backdrop confirmed" },
  { id: 4, requestId: 5, amount: 24000.00, date: "2026-09-15", status: "Pending",  notes: "Awaiting 50% deposit" },
  { id: 5, requestId: 7, amount:  3800.00, date: "2026-07-12", status: "Paid",     notes: "Lanyards and banners — settled" },
  { id: 6, requestId: 3, amount:      0, date: "2026-08-20",   status: "Voided",   notes: "Invoice voided after rejection" },
  { id: 7, requestId: 5, amount: 12000.00, date: "2026-09-01", status: "Overdue",  notes: "First instalment overdue by 7 days" }
];

module.exports = { fakeRequests, fakeEvents, fakeDeliveries, fakeInvoices };
