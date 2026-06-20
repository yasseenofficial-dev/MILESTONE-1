const { writeDB } = require('../src/config/db');

const now = new Date();
const today = now.toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

const users = [
  { id: 'u1', name: 'Youssef Organizer', email: 'organizer@popeyez.com', password: 'password123', role: 'organizer', active: true, phone: '+20 100 111 2222' },
  { id: 'u2', name: 'Mariam Staff', email: 'staff@popeyez.com', password: 'password123', role: 'staff', active: true, speciality: 'Guest Check-In', employmentType: 'part-time' },
  { id: 'u3', name: 'Omar Staff', email: 'staff2@popeyez.com', password: 'password123', role: 'staff', active: true, speciality: 'Logistics', employmentType: 'full-time' }
];

const events = [
  { id: 'e1', organizerId: 'u1', name: 'Downtown Espresso Weekend', date: today, startTime: '10:00', endTime: '21:00', venueName: 'Cairo Creative Loft', location: 'Zamalek, Cairo', plannedBudget: 85000, status: 'day-of' },
  { id: 'e2', organizerId: 'u1', name: 'Garden Brew Preview', date: tomorrow, startTime: '09:00', endTime: '18:00', venueName: 'Maadi Garden Space', location: 'Maadi, Cairo', plannedBudget: 62000, status: 'upcoming' },
  { id: 'e3', organizerId: 'u1', name: 'Gallery Coffee Night', date: yesterday, startTime: '16:00', endTime: '23:00', venueName: 'Heliopolis Art Gallery', location: 'Heliopolis, Cairo', plannedBudget: 74000, status: 'completed' }
];

const eventStaff = [
  { id: 'es1', eventId: 'e1', staffId: 'u2', shift: '09:00-16:00', role: 'Check-in lead' },
  { id: 'es2', eventId: 'e1', staffId: 'u3', shift: '11:00-21:00', role: 'Logistics coordinator' },
  { id: 'es3', eventId: 'e2', staffId: 'u2', shift: '08:00-13:00', role: 'Guest desk' },
  { id: 'es4', eventId: 'e3', staffId: 'u3', shift: '15:00-23:30', role: 'Vendor coordinator' }
];

const tasks = [
  { id: 't1', eventId: 'e1', title: 'Set up entrance check-in table', category: 'Guest Check-In', assignedTo: 'u2', dueTime: '09:30', status: 'done', progress: 100, priority: 'high', note: 'QR scanner tested.' },
  { id: 't2', eventId: 'e1', title: 'Place wayfinding signs from street entrance', category: 'Logistics', assignedTo: 'u3', dueTime: '09:45', status: 'in progress', progress: 60, priority: 'medium', note: 'Two signs left near elevator.' },
  { id: 't3', eventId: 'e1', title: 'Confirm pastry delivery count', category: 'Vendor Coordination', assignedTo: 'u3', dueTime: '10:15', status: 'pending', progress: 20, priority: 'high', note: '' },
  { id: 't4', eventId: 'e1', title: 'Prepare guest welcome cards', category: 'Guest Experience', assignedTo: 'u2', dueTime: '10:30', status: 'in progress', progress: 45, priority: 'medium', note: '' },
  { id: 't5', eventId: 'e1', title: 'Check seating capacity and safety aisles', category: 'Layout', assignedTo: 'u3', dueTime: '11:00', status: 'blocked', progress: 35, priority: 'high', note: 'Waiting for extra chairs to be moved.' },
  { id: 't6', eventId: 'e2', title: 'Prepare outdoor menu boards', category: 'Setup', assignedTo: 'u2', dueTime: '08:30', status: 'not started', progress: 0, priority: 'medium', note: '' },
  { id: 't7', eventId: 'e2', title: 'Confirm power extension points', category: 'Logistics', assignedTo: 'u3', dueTime: '08:45', status: 'pending', progress: 10, priority: 'high', note: '' },
  { id: 't8', eventId: 'e3', title: 'Pack leftover display materials', category: 'Closeout', assignedTo: 'u3', dueTime: '23:15', status: 'done', progress: 100, priority: 'low', note: 'Stored in organizer vehicle.' }
];

const guestNames = [
  'Nadine Adel', 'Karim Hassan', 'Farah Nabil', 'Laila Samy', 'Ahmed Maher', 'Mona Tarek', 'Yara Fathy', 'Seif Mostafa', 'Hana Youssef', 'Malak Sherif', 'Ali Wael', 'Dina Kamal', 'Tamer Fouad', 'Salma Galal', 'Noor Aly', 'Bassel Hany', 'Maya Nader', 'Zeinab Kamel'
];
const guests = guestNames.map((name, index) => ({
  id: `g${index + 1}`,
  eventId: index < 12 ? 'e1' : (index < 15 ? 'e2' : 'e3'),
  name,
  email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
  rsvpStatus: index % 5 === 0 ? 'Maybe' : (index % 7 === 0 ? 'Not Attending' : 'Attending'),
  dietaryPreference: index % 4 === 0 ? 'Vegan' : (index % 3 === 0 ? 'Gluten-free' : 'None'),
  specialRequirements: index % 6 === 0 ? 'Wheelchair accessible seating' : '',
  checkInStatus: index < 8 ? (index % 3 === 0 ? 'not-arrived' : 'checked-in') : 'not-arrived',
  checkedInAt: index < 8 && index % 3 !== 0 ? new Date(Date.now() - (index + 1) * 600000).toISOString() : null,
  checkedInBy: index < 8 && index % 3 !== 0 ? 'u2' : null,
  qrCode: `POP-${index + 1001}`
}));

const vendors = [
  { id: 'v1', name: 'BeanCraft Roastery', suppliesOffered: 'Specialty coffee beans', mainLocation: 'New Cairo', contact: 'beans@example.com', pricingList: 'Coffee beans EGP 850/kg' },
  { id: 'v2', name: 'Sweet Crumb Bakery', suppliesOffered: 'Pastries and croissants', mainLocation: 'Zamalek', contact: 'bakery@example.com', pricingList: 'Pastry boxes EGP 1200/50 pcs' },
  { id: 'v3', name: 'FreshPress Juices', suppliesOffered: 'Cold pressed juices', mainLocation: 'Maadi', contact: 'juice@example.com', pricingList: 'Bottles EGP 75 each' },
  { id: 'v4', name: 'MoodLight Rentals', suppliesOffered: 'Lighting and extension cables', mainLocation: 'Dokki', contact: 'lights@example.com', pricingList: 'Lighting kit EGP 3000/day' }
];

const eventVendors = [
  { id: 'ev1', eventId: 'e1', vendorId: 'v1', orderSummary: '8kg house blend + 2kg decaf', deliveryStatus: 'Delivered', arrivalStatus: 'arrived', expectedArrival: '08:30', arrivalLoggedAt: new Date(Date.now() - 7200000).toISOString(), arrivalLoggedBy: 'u3', arrivalNote: 'Delivered to bar counter.' },
  { id: 'ev2', eventId: 'e1', vendorId: 'v2', orderSummary: '120 assorted pastries', deliveryStatus: 'Out for Delivery', arrivalStatus: 'not-arrived', expectedArrival: '10:00', arrivalLoggedAt: null, arrivalLoggedBy: null, arrivalNote: '' },
  { id: 'ev3', eventId: 'e1', vendorId: 'v4', orderSummary: 'Accent lighting package', deliveryStatus: 'Delayed', arrivalStatus: 'delayed', expectedArrival: '09:15', arrivalLoggedAt: new Date().toISOString(), arrivalLoggedBy: 'u3', arrivalNote: 'Driver called: 20 minutes late.' },
  { id: 'ev4', eventId: 'e2', vendorId: 'v3', orderSummary: '80 juice bottles', deliveryStatus: 'Preparing', arrivalStatus: 'not-arrived', expectedArrival: '08:00', arrivalLoggedAt: null, arrivalLoggedBy: null, arrivalNote: '' },
  { id: 'ev5', eventId: 'e3', vendorId: 'v1', orderSummary: '6kg espresso blend', deliveryStatus: 'Delivered', arrivalStatus: 'arrived', expectedArrival: '14:30', arrivalLoggedAt: new Date(Date.now() - 86400000).toISOString(), arrivalLoggedBy: 'u3', arrivalNote: 'Completed.' }
];

const communications = [
  { id: 'comm1', eventId: 'e1', title: 'Welcome and Entrance Direction', message: 'Welcome to Downtown Espresso Weekend. Please use the side entrance next to the gallery sign.', audience: 'all-guests', sentBy: 'u1', sentAt: new Date(Date.now() - 3600000).toISOString(), type: 'day-of' },
  { id: 'comm2', eventId: 'e1', title: 'Schedule Update', message: 'The tasting session starts at 14:30 instead of 14:00.', audience: 'attending', sentBy: 'u1', sentAt: new Date(Date.now() - 1800000).toISOString(), type: 'day-of' }
];

let communicationStatuses = [];
communications.forEach((communication, commIndex) => {
  guests.filter(guest => guest.eventId === communication.eventId).forEach((guest, guestIndex) => {
    communicationStatuses.push({
      id: `cs${communicationStatuses.length + 1}`,
      communicationId: communication.id,
      guestId: guest.id,
      received: true,
      receivedAt: new Date(Date.now() - 1500000).toISOString(),
      seen: (guestIndex + commIndex) % 4 !== 0,
      seenAt: (guestIndex + commIndex) % 4 !== 0 ? new Date(Date.now() - 900000).toISOString() : null
    });
  });
});

const feedback = [
  { id: 'f1', eventId: 'e3', guestName: 'Nadine Adel', overall: 5, food: 5, venue: 4, organization: 5, sentiment: 'positive', comment: 'Great atmosphere and very smooth entry.' },
  { id: 'f2', eventId: 'e3', guestName: 'Karim Hassan', overall: 4, food: 4, venue: 5, organization: 4, sentiment: 'positive', comment: 'Coffee was excellent. More seating would help.' },
  { id: 'f3', eventId: 'e3', guestName: 'Farah Nabil', overall: 3, food: 4, venue: 3, organization: 3, sentiment: 'neutral', comment: 'Good event but check-in queue was long.' },
  { id: 'f4', eventId: 'e1', guestName: 'Laila Samy', overall: 5, food: 5, venue: 5, organization: 5, sentiment: 'positive', comment: 'Loved the concept and staff were helpful.' },
  { id: 'f5', eventId: 'e1', guestName: 'Ahmed Maher', overall: 4, food: 4, venue: 4, organization: 5, sentiment: 'positive', comment: 'Clear directions and nice layout.' }
];

const layouts = [
  {
    id: 'l1',
    eventId: 'e1',
    name: 'Downtown Espresso Floor Plan',
    width: 1000,
    height: 620,
    sharedWithStaff: true,
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    elements: [
      { id: 'el1', type: 'Entrance', label: 'Guest Entrance', x: 35, y: 40, w: 160, h: 60 },
      { id: 'el2', type: 'Check-In', label: 'Check-In Desk', x: 230, y: 40, w: 180, h: 80 },
      { id: 'el3', type: 'Bar', label: 'Coffee Bar', x: 590, y: 55, w: 260, h: 95 },
      { id: 'el4', type: 'Seating', label: 'Community Table', x: 250, y: 220, w: 260, h: 120 },
      { id: 'el5', type: 'Seating', label: 'Lounge Seating', x: 590, y: 245, w: 250, h: 120 },
      { id: 'el6', type: 'Vendor', label: 'Pastry Pickup', x: 70, y: 410, w: 210, h: 90 },
      { id: 'el7', type: 'Emergency', label: 'Emergency Exit', x: 820, y: 500, w: 150, h: 70 }
    ]
  },
  {
    id: 'l2', eventId: 'e2', name: 'Garden Brew Layout', width: 1000, height: 620, sharedWithStaff: true, updatedAt: new Date().toISOString(),
    elements: [
      { id: 'el8', type: 'Entrance', label: 'Garden Gate', x: 45, y: 80, w: 160, h: 60 },
      { id: 'el9', type: 'Bar', label: 'Outdoor Brew Station', x: 560, y: 80, w: 280, h: 100 },
      { id: 'el10', type: 'Seating', label: 'Picnic Seating', x: 230, y: 260, w: 430, h: 180 }
    ]
  },
  {
    id: 'l3', eventId: 'e3', name: 'Gallery Night Layout', width: 1000, height: 620, sharedWithStaff: true, updatedAt: new Date(Date.now() - 86400000).toISOString(),
    elements: [
      { id: 'el11', type: 'Entrance', label: 'Gallery Entrance', x: 50, y: 50, w: 160, h: 70 },
      { id: 'el12', type: 'Bar', label: 'Espresso Corner', x: 640, y: 90, w: 240, h: 110 },
      { id: 'el13', type: 'Seating', label: 'Art Wall Seating', x: 260, y: 290, w: 340, h: 120 }
    ]
  }
];

const expenses = [
  { id: 'ex1', eventId: 'e1', category: 'Coffee', description: 'BeanCraft coffee order', amount: 8500 },
  { id: 'ex2', eventId: 'e1', category: 'Food', description: 'Pastry order deposit', amount: 9600 },
  { id: 'ex3', eventId: 'e1', category: 'Venue', description: 'Venue rental', amount: 32000 },
  { id: 'ex4', eventId: 'e1', category: 'Equipment', description: 'Lighting rental', amount: 3000 },
  { id: 'ex5', eventId: 'e1', category: 'Staff', description: 'Day staff shifts', amount: 12500 },
  { id: 'ex6', eventId: 'e3', category: 'Venue', description: 'Gallery rent', amount: 28000 },
  { id: 'ex7', eventId: 'e3', category: 'Coffee', description: 'Espresso supplies', amount: 6000 },
  { id: 'ex8', eventId: 'e3', category: 'Staff', description: 'Closeout team', amount: 9000 }
];

writeDB({ users, events, eventStaff, tasks, guests, vendors, eventVendors, communications, communicationStatuses, feedback, layouts, expenses });
console.log('Database seeded successfully.');
console.log('Demo organizer: organizer@popeyez.com / password123');
console.log('Demo staff: staff@popeyez.com / password123');
