const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.feedback.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.sourcingRequest.deleteMany();
  await prisma.eventVendor.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.budgetCategory.deleteMany();
  await prisma.floorPlan.deleteMany();
  await prisma.task.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.stakeholder.deleteMany();
  await prisma.bookingApplication.deleteMany();
  await prisma.event.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 12);

  const organizer = await prisma.user.create({
    data: {
      email: 'organizer@events.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Hassan',
      companyName: 'Cairo Events Co.',
      phone: '+20 100 123 4567',
      role: 'EVENT_ORGANIZER',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@events.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'GUC Convention Center',
        description: 'Modern convention center with multiple halls and outdoor spaces.',
        address: 'New Cairo, Km 28 Cairo-Suez Road',
        city: 'Cairo',
        capacity: 2500,
        pricePerDay: 45000,
        amenities: JSON.stringify(['WiFi', 'AV Equipment', 'Parking', 'Catering Kitchen', 'Stage']),
        images: JSON.stringify(['/images/venues/guc-cc.jpg']),
        latitude: 30.0280,
        longitude: 31.4950,
        rating: 4.7,
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Nile Garden Terrace',
        description: 'Elegant outdoor venue overlooking the Nile with garden setting.',
        address: 'Maadi Corniche',
        city: 'Cairo',
        capacity: 500,
        pricePerDay: 28000,
        amenities: JSON.stringify(['Garden', 'Lighting', 'Sound System', 'Valet Parking']),
        images: JSON.stringify(['/images/venues/nile-garden.jpg']),
        latitude: 29.9600,
        longitude: 31.2700,
        rating: 4.5,
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Alexandria Grand Ballroom',
        description: 'Luxurious ballroom ideal for galas and corporate dinners.',
        address: 'Stanley Bay',
        city: 'Alexandria',
        capacity: 800,
        pricePerDay: 35000,
        amenities: JSON.stringify(['Ballroom', 'Bridal Suite', 'AV', 'Catering']),
        images: JSON.stringify(['/images/venues/alex-ballroom.jpg']),
        latitude: 31.2400,
        longitude: 29.9600,
        rating: 4.8,
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Tech Hub Auditorium',
        description: 'Compact tech-focused auditorium for conferences and workshops.',
        address: 'Smart Village',
        city: 'Giza',
        capacity: 300,
        pricePerDay: 12000,
        amenities: JSON.stringify(['Projectors', 'Recording Studio', 'Breakout Rooms']),
        images: JSON.stringify(['/images/venues/tech-hub.jpg']),
        rating: 4.3,
      },
    }),
  ]);

  const vendors = await Promise.all([
    prisma.vendor.create({ data: { name: 'Floral Dreams', category: 'DECORATION', email: 'orders@floraldreams.eg', phone: '+20 122 111 2233', rating: 4.6, description: 'Premium floral arrangements and event décor.' } }),
    prisma.vendor.create({ data: { name: 'Gourmet Catering Egypt', category: 'CATERING', email: 'events@gourmeteg.com', phone: '+20 100 555 7788', rating: 4.9, description: 'Full-service catering for corporate and social events.' } }),
    prisma.vendor.create({ data: { name: 'SoundWave AV', category: 'AV_EQUIPMENT', email: 'rentals@soundwave.eg', phone: '+20 111 444 5566', rating: 4.4, description: 'Professional audio-visual equipment rental.' } }),
    prisma.vendor.create({ data: { name: 'Elite Security Services', category: 'SECURITY', email: 'ops@elitesec.eg', phone: '+20 101 999 8877', rating: 4.2, description: 'Event security and crowd management.' } }),
    prisma.vendor.create({ data: { name: 'PrintPro Signage', category: 'PRINTING', email: 'print@printpro.eg', phone: '+20 120 333 4455', rating: 4.5, description: 'Banners, signage, and branded materials.' } }),
  ]);

  const event1 = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      title: 'Annual Tech Summit 2026',
      description: 'A two-day technology conference featuring keynote speakers and workshops.',
      eventType: 'CONFERENCE',
      status: 'PLANNING',
      startDate: new Date('2026-09-15T09:00:00'),
      endDate: new Date('2026-09-16T18:00:00'),
      expectedAttendees: 500,
      venueId: venues[0].id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      title: 'Charity Gala Dinner',
      description: 'Elegant fundraising gala supporting local education initiatives.',
      eventType: 'GALA',
      status: 'CONFIRMED',
      startDate: new Date('2026-07-20T19:00:00'),
      endDate: new Date('2026-07-20T23:30:00'),
      expectedAttendees: 200,
      venueId: venues[1].id,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      title: 'Product Launch - InnovateX',
      description: 'Launch event for InnovateX new product line.',
      eventType: 'PRODUCT_LAUNCH',
      status: 'DRAFT',
      startDate: new Date('2026-11-05T14:00:00'),
      endDate: new Date('2026-11-05T17:00:00'),
      expectedAttendees: 150,
    },
  });

  await prisma.stakeholder.createMany({
    data: [
      { eventId: event1.id, name: 'Dr. Ahmed El-Sayed', email: 'ahmed@techcorp.eg', role: 'SPEAKER', phone: '+20 100 111 2222' },
      { eventId: event1.id, name: 'TechCorp Egypt', email: 'sponsor@techcorp.eg', role: 'SPONSOR', notes: 'Gold sponsor - EGP 100,000' },
      { eventId: event2.id, name: 'Education Foundation', email: 'contact@edfoundation.eg', role: 'PARTNER' },
      { eventId: event2.id, name: 'Mona Farouk', email: 'mona@volunteer.eg', role: 'VOLUNTEER', phone: '+20 122 333 4444' },
    ],
  });

  await prisma.bookingApplication.createMany({
    data: [
      { eventId: event1.id, venueId: venues[0].id, organizerId: organizer.id, startDate: new Date('2026-09-14'), endDate: new Date('2026-09-16'), status: 'APPROVED', message: 'Need full AV setup and 3 breakout rooms.' },
      { eventId: event2.id, venueId: venues[1].id, organizerId: organizer.id, startDate: new Date('2026-07-20'), endDate: new Date('2026-07-20'), status: 'APPROVED' },
      { eventId: event3.id, venueId: venues[3].id, organizerId: organizer.id, startDate: new Date('2026-11-05'), endDate: new Date('2026-11-05'), status: 'PENDING', message: 'Requesting stage and demo area setup.' },
    ],
  });

  const staff1 = await prisma.staff.create({ data: { eventId: event1.id, name: 'Karim Nabil', email: 'karim@events.com', role: 'Event Coordinator', phone: '+20 100 777 8899' } });
  const staff2 = await prisma.staff.create({ data: { eventId: event1.id, name: 'Nour Ali', email: 'nour@events.com', role: 'Registration Lead' } });
  await prisma.staff.create({ data: { eventId: event2.id, name: 'Omar Fathy', email: 'omar@events.com', role: 'Floor Manager' } });

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  await prisma.task.createMany({
    data: [
      { eventId: event1.id, staffId: staff1.id, title: 'Confirm keynote speaker travel', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: tomorrow, reminderAt: now },
      { eventId: event1.id, staffId: staff2.id, title: 'Set up registration desk layout', status: 'TODO', priority: 'MEDIUM', dueDate: nextWeek, reminderAt: tomorrow },
      { eventId: event1.id, title: 'Finalize catering menu', status: 'TODO', priority: 'HIGH', dueDate: nextWeek },
      { eventId: event2.id, title: 'Send VIP invitations', status: 'DONE', priority: 'URGENT', dueDate: new Date('2026-06-01') },
      { eventId: event2.id, title: 'Arrange auction items', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: new Date('2026-07-10'), reminderAt: now },
    ],
  });

  const cat1 = await prisma.budgetCategory.create({ data: { eventId: event1.id, name: 'Venue & Facilities', plannedAmount: 50000 } });
  const cat2 = await prisma.budgetCategory.create({ data: { eventId: event1.id, name: 'Catering', plannedAmount: 80000 } });
  const cat3 = await prisma.budgetCategory.create({ data: { eventId: event1.id, name: 'Marketing', plannedAmount: 25000 } });
  await prisma.budgetCategory.create({ data: { eventId: event2.id, name: 'Venue', plannedAmount: 30000 } });
  await prisma.budgetCategory.create({ data: { eventId: event2.id, name: 'Entertainment', plannedAmount: 45000 } });

  await prisma.expense.createMany({
    data: [
      { eventId: event1.id, budgetCategoryId: cat1.id, description: 'Venue deposit', amount: 22500, expenseDate: new Date('2026-03-01') },
      { eventId: event1.id, budgetCategoryId: cat2.id, vendorId: vendors[1].id, description: 'Catering tasting session', amount: 3500, expenseDate: new Date('2026-04-15') },
      { eventId: event1.id, budgetCategoryId: cat3.id, vendorId: vendors[4].id, description: 'Promotional banners', amount: 8200, expenseDate: new Date('2026-05-01') },
      { eventId: event2.id, description: 'Band deposit', amount: 15000, expenseDate: new Date('2026-04-20') },
    ],
  });

  await prisma.floorPlan.create({
    data: {
      eventId: event1.id,
      name: 'Main Hall Layout',
      width: 1000,
      height: 700,
      canvasData: JSON.stringify({
        objects: [
          { type: 'stage', x: 400, y: 50, width: 200, height: 80, label: 'Stage' },
          { type: 'table', x: 100, y: 200, width: 80, height: 80, label: 'Table 1', seats: 8 },
          { type: 'table', x: 300, y: 200, width: 80, height: 80, label: 'Table 2', seats: 8 },
          { type: 'table', x: 500, y: 200, width: 80, height: 80, label: 'Table 3', seats: 8 },
          { type: 'booth', x: 700, y: 400, width: 120, height: 100, label: 'Sponsor Booth' },
          { type: 'entrance', x: 450, y: 620, width: 100, height: 40, label: 'Entrance' },
        ],
      }),
    },
  });

  const ev1 = await prisma.eventVendor.create({ data: { eventId: event1.id, vendorId: vendors[1].id, contractAmount: 75000, notes: 'Buffet for 500 guests' } });
  const ev2 = await prisma.eventVendor.create({ data: { eventId: event1.id, vendorId: vendors[2].id, contractAmount: 18000 } });
  await prisma.eventVendor.create({ data: { eventId: event2.id, vendorId: vendors[0].id, contractAmount: 22000 } });

  await prisma.sourcingRequest.createMany({
    data: [
      { eventId: event1.id, vendorId: vendors[0].id, title: 'Stage floral backdrop', description: 'Large floral installation behind main stage', status: 'QUOTED', budget: 15000, quoteAmount: 13500, responseAt: new Date() },
      { eventId: event3.id, vendorId: vendors[2].id, title: 'AV package for product demo', status: 'SENT', budget: 10000 },
    ],
  });

  await prisma.delivery.createMany({
    data: [
      { eventVendorId: ev1.id, description: 'Catering equipment delivery', status: 'SCHEDULED', scheduledDate: new Date('2026-09-14T08:00:00'), trackingNotes: 'Refrigerated truck required' },
      { eventVendorId: ev2.id, description: 'AV equipment setup', status: 'IN_TRANSIT', scheduledDate: new Date('2026-09-14T06:00:00'), trackingNotes: 'ETA 6:30 AM' },
    ],
  });

  await prisma.invoice.createMany({
    data: [
      { eventVendorId: ev1.id, invoiceNumber: 'INV-2026-001', amount: 37500, status: 'PAID', dueDate: new Date('2026-04-01'), paidDate: new Date('2026-03-28') },
      { eventVendorId: ev1.id, invoiceNumber: 'INV-2026-002', amount: 37500, status: 'SENT', dueDate: new Date('2026-09-01') },
      { eventVendorId: ev2.id, invoiceNumber: 'INV-2026-003', amount: 18000, status: 'OVERDUE', dueDate: new Date('2026-05-15') },
    ],
  });

  await prisma.guest.createMany({
    data: [
      { eventId: event1.id, name: 'Youssef Tammam', email: 'youssef@example.com', rsvpStatus: 'ACCEPTED', dietaryPreference: 'Vegetarian', invitationSentAt: new Date(), rsvpAt: new Date(), plusOne: false },
      { eventId: event1.id, name: 'Layla Mahmoud', email: 'layla@example.com', rsvpStatus: 'ACCEPTED', dietaryPreference: 'None', invitationSentAt: new Date(), rsvpAt: new Date(), plusOne: true },
      { eventId: event1.id, name: 'Hassan Ibrahim', email: 'hassan@example.com', rsvpStatus: 'PENDING', dietaryPreference: 'Halal', invitationSentAt: new Date() },
      { eventId: event1.id, name: 'Mariam Said', email: 'mariam@example.com', rsvpStatus: 'DECLINED', invitationSentAt: new Date(), rsvpAt: new Date() },
      { eventId: event2.id, name: 'Dr. Nadia Farid', email: 'nadia@example.com', rsvpStatus: 'ACCEPTED', dietaryPreference: 'Gluten-Free', invitationSentAt: new Date(), rsvpAt: new Date() },
      { eventId: event2.id, name: 'Tarek Mostafa', email: 'tarek@example.com', rsvpStatus: 'MAYBE', invitationSentAt: new Date() },
      { eventId: event2.id, name: 'Sara El-Din', email: 'sara@example.com', rsvpStatus: 'PENDING' },
    ],
  });

  const guests = await prisma.guest.findMany({ where: { eventId: event1.id, rsvpStatus: 'ACCEPTED' } });
  await prisma.feedback.createMany({
    data: [
      { eventId: event1.id, guestId: guests[0]?.id, rating: 5, comment: 'Excellent organization last year!' },
      { eventId: event2.id, rating: 4, comment: 'Beautiful venue selection.' },
    ],
  });

  await prisma.user.createMany({
    data: [
      { email: 'karim.team@events.com', passwordHash, firstName: 'Karim', lastName: 'Nabil', role: 'TEAM_MEMBER', createdById: organizer.id, eventId: event1.id, phone: '+20 100 777 8899' },
      { email: 'layla.guest@events.com', passwordHash, firstName: 'Layla', lastName: 'Mahmoud', role: 'GUEST', createdById: organizer.id, eventId: event1.id },
      { email: 'floral.vendor@events.com', passwordHash, firstName: 'Floral', lastName: 'Dreams', role: 'VENDOR', createdById: organizer.id, companyName: 'Floral Dreams' },
      { email: 'ahmed.stakeholder@events.com', passwordHash, firstName: 'Ahmed', lastName: 'El-Sayed', role: 'STAKEHOLDER', createdById: organizer.id, eventId: event1.id },
      { email: 'mona.stakeholder@events.com', passwordHash, firstName: 'Mona', lastName: 'Farouk', role: 'STAKEHOLDER', createdById: organizer.id, eventId: event2.id },
    ],
  });

  console.log('Seed completed!');
  console.log('Login: organizer@events.com / password123');
  console.log('Admin:   admin@events.com / password123');
  console.log(`Created: ${venues.length} venues, ${vendors.length} vendors, 3 events`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
