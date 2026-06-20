const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { writeDB } = require("./db");

async function seed() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const owner1 = {
    id: uuidv4(),
    ownerName: "Nadine Farouk",
    email: "nadine.farouk@venues.com",
    passwordHash,
    companyName: "Cairo Pop-up Spaces",
    phone: "+20 100 123 4567",
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-04-01T09:00:00.000Z"
  };

  const owner2 = {
    id: uuidv4(),
    ownerName: "Omar Khalil",
    email: "omar.khalil@venues.com",
    passwordHash,
    companyName: "Nile View Properties",
    phone: "+20 101 987 6543",
    createdAt: "2026-04-03T10:30:00.000Z",
    updatedAt: "2026-04-03T10:30:00.000Z"
  };

  const listings = [
    {
      id: uuidv4(),
      ownerId: owner1.id,
      name: "Zamalek Rooftop Loft",
      description: "An airy rooftop space in Zamalek with skyline views, perfect for pop-up cafes and brand activations.",
      location: "Zamalek, Cairo",
      capacity: 80,
      dimensionsSqm: 150,
      amenities: ["WiFi", "Sound system", "Outdoor seating", "Kitchenette"],
      pricing: { amount: 6000, currency: "EGP", unit: "per_day" },
      photos: ["https://example.com/photos/zamalek-1.jpg", "https://example.com/photos/zamalek-2.jpg"],
      floorPlans: ["https://example.com/floorplans/zamalek.pdf"],
      availability: [
        { date: "2026-06-25", status: "available" },
        { date: "2026-06-26", status: "unavailable" },
        { date: "2026-07-02", status: "available" }
      ],
      status: "active",
      createdAt: "2026-04-02T09:00:00.000Z",
      updatedAt: "2026-04-02T09:00:00.000Z"
    },
    {
      id: uuidv4(),
      ownerId: owner1.id,
      name: "Downtown Industrial Hall",
      description: "A converted warehouse with an industrial-chic aesthetic, ideal for larger pop-up events.",
      location: "Downtown, Cairo",
      capacity: 200,
      dimensionsSqm: 400,
      amenities: ["WiFi", "Stage", "Loading dock", "Parking"],
      pricing: { amount: 12000, currency: "EGP", unit: "per_day" },
      photos: ["https://example.com/photos/downtown-1.jpg"],
      floorPlans: [],
      availability: [
        { date: "2026-06-28", status: "available" },
        { date: "2026-07-05", status: "available" }
      ],
      status: "active",
      createdAt: "2026-04-05T09:00:00.000Z",
      updatedAt: "2026-04-05T09:00:00.000Z"
    },
    {
      id: uuidv4(),
      ownerId: owner2.id,
      name: "Maadi Garden Courtyard",
      description: "A lush garden courtyard tucked away in Maadi, great for intimate gatherings and brunch pop-ups.",
      location: "Maadi, Cairo",
      capacity: 50,
      dimensionsSqm: 120,
      amenities: ["Garden", "Power outlets", "Restrooms"],
      pricing: { amount: 4000, currency: "EGP", unit: "per_day" },
      photos: ["https://example.com/photos/maadi-1.jpg"],
      floorPlans: [],
      availability: [{ date: "2026-06-30", status: "available" }],
      status: "active",
      createdAt: "2026-04-06T11:00:00.000Z",
      updatedAt: "2026-04-06T11:00:00.000Z"
    }
  ];

  const bookingRequests = [
    {
      id: uuidv4(),
      listingId: listings[0].id,
      organizerName: "Layla Hassan",
      organizerContact: "layla.hassan@popeyez-organizers.com",
      eventType: "Pop-up Café Launch",
      eventDate: "2026-06-25",
      expectedAttendees: 60,
      specialRequirements: "Need power outlets near the seating area and early access for setup.",
      status: "Pending",
      ownerMessage: null,
      counterProposal: null,
      messages: [],
      createdAt: "2026-06-10T08:15:00.000Z"
    },
    {
      id: uuidv4(),
      listingId: listings[1].id,
      organizerName: "Karim Aboulnaga",
      organizerContact: "karim.a@popeyez-organizers.com",
      eventType: "Streetwear Brand Activation",
      eventDate: "2026-06-28",
      expectedAttendees: 180,
      specialRequirements: "Requires loading dock access the night before.",
      status: "Approved",
      ownerMessage: "Approved, looking forward to hosting you!",
      counterProposal: null,
      messages: [],
      createdAt: "2026-06-05T14:00:00.000Z",
      respondedAt: "2026-06-06T09:00:00.000Z"
    },
    {
      id: uuidv4(),
      listingId: listings[2].id,
      organizerName: "Mona Saeed",
      organizerContact: "mona.saeed@popeyez-organizers.com",
      eventType: "Brunch Pop-up",
      eventDate: "2026-06-30",
      expectedAttendees: 45,
      specialRequirements: "Vegan menu, shaded seating preferred.",
      status: "Approved",
      ownerMessage: "Approved. Garden shade canopy will be set up for you.",
      counterProposal: null,
      messages: [],
      createdAt: "2026-06-08T10:00:00.000Z",
      respondedAt: "2026-06-09T08:30:00.000Z"
    },
    {
      id: uuidv4(),
      listingId: listings[0].id,
      organizerName: "Tarek Mahmoud",
      organizerContact: "tarek.m@popeyez-organizers.com",
      eventType: "Art Exhibition Pop-up",
      eventDate: "2026-07-02",
      expectedAttendees: 70,
      specialRequirements: "Need wall space for hanging artwork.",
      status: "Declined",
      ownerMessage: "Unfortunately the space is already booked for renovations on that date.",
      counterProposal: "Available from 2026-07-09 instead.",
      messages: [],
      createdAt: "2026-06-11T12:00:00.000Z",
      respondedAt: "2026-06-12T09:45:00.000Z"
    },
    {
      id: uuidv4(),
      listingId: listings[1].id,
      organizerName: "Salma Adel",
      organizerContact: "salma.adel@popeyez-organizers.com",
      eventType: "Tech Meetup Pop-up",
      eventDate: "2026-07-05",
      expectedAttendees: 150,
      specialRequirements: "AV equipment and stage required.",
      status: "Pending",
      ownerMessage: null,
      counterProposal: null,
      messages: [],
      createdAt: "2026-06-15T16:20:00.000Z"
    }
  ];

  // Confirmed bookings derived from approved requests
  const bookings = bookingRequests
    .filter((r) => r.status === "Approved")
    .map((r) => ({
      id: uuidv4(),
      requestId: r.id,
      listingId: r.listingId,
      organizerName: r.organizerName,
      organizerContact: r.organizerContact,
      eventType: r.eventType,
      eventDate: r.eventDate,
      expectedAttendees: r.expectedAttendees,
      specialRequirements: r.specialRequirements,
      status: "Confirmed",
      createdAt: r.respondedAt
    }));

  const db = {
    venueOwners: [owner1, owner2],
    listings,
    bookingRequests,
    bookings
  };

  writeDB(db);

  console.log("Database seeded successfully.");
  console.log("Sample login credentials:");
  console.log(`  Email: ${owner1.email}  Password: Password123!`);
  console.log(`  Email: ${owner2.email}  Password: Password123!`);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
