import { PrismaClient, Role, EventStatus, InvoiceStatus, PaymentType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const daysFromNow = (days: number, hour = 12, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
};

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@shutterdesk.com",
      password,
      role: Role.ADMIN,
    },
  });

  const office = await prisma.user.create({
    data: {
      name: "Office Staff",
      email: "office@shutterdesk.com",
      password,
      role: Role.OFFICE,
    },
  });

  const james = await prisma.user.create({
    data: {
      name: "James Okafor",
      email: "james@shutterdesk.com",
      password,
      role: Role.PHOTOGRAPHER,
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: "Priya Mehta",
      email: "priya@shutterdesk.com",
      password,
      role: Role.PHOTOGRAPHER,
    },
  });

  console.log("✓ Created 4 users (1 admin, 1 office, 2 photographers)");
  console.log("  Login password for all users: password123");

  const eventSeeds = [
    { title: "The Wilson Wedding", date: daysFromNow(50, 16), time: "4:00 PM – 11:00 PM", location: "Belmont Estate, Tarrytown NY", eventType: "Wedding", clientName: "Helena & Marcus Wilson", clientPhone: "+880 1711 234567", clientEmail: "helena.wilson@email.com", status: EventStatus.PENDING, photographerId: james.id, amount: 3450 },
    { title: "TechVive Annual Dinner", date: daysFromNow(10, 19), time: "7:00 PM – 10:00 PM", location: "The Plaza Hotel, NY", eventType: "Corporate", clientName: "TechVive Inc.", clientPhone: "+880 1812 345678", clientEmail: "events@techvive.com", status: EventStatus.PENDING, photographerId: priya.id, amount: 2200 },
    { title: "Chen Family Portrait", date: daysFromNow(13, 14), time: "2:00 PM – 4:00 PM", location: "Central Park, NY", eventType: "Portrait", clientName: "The Chen Family", clientPhone: "+880 1611 456789", clientEmail: "chen.family@email.com", status: EventStatus.PENDING, photographerId: james.id, amount: 540 },
    { title: "Morales Engagement", date: daysFromNow(16, 17, 30), time: "5:30 PM – 8:00 PM", location: "Brooklyn Bridge Park", eventType: "Engagement", clientName: "Sofia & Diego Morales", clientPhone: "+880 1911 567890", clientEmail: "sofia.morales@email.com", status: EventStatus.PENDING, photographerId: james.id, amount: 850 },
    { title: "Tan Family Reunion", date: daysFromNow(21, 18), time: "6:00 PM – 12:00 AM", location: "Glen Cove Mansion", eventType: "Event", clientName: "The Tan Family", clientPhone: "+880 1511 678901", clientEmail: "tan.family@email.com", status: EventStatus.PENDING, photographerId: priya.id, amount: 1750 },
    { title: "Spring Editorial Shoot", date: daysFromNow(28, 10), time: "10:00 AM – 6:00 PM", location: "Hudson Yards, NY", eventType: "Editorial", clientName: "Atelier Hudson", clientPhone: "+880 1322 789012", clientEmail: "studio@atelierhudson.com", status: EventStatus.PENDING, photographerId: priya.id, amount: 2800 },
    { title: "Patel Garden Party", date: daysFromNow(-3, 15), time: "3:00 PM – 9:00 PM", location: "Private residence, Bronx", eventType: "Event", clientName: "The Patels", clientPhone: "+880 1444 890123", clientEmail: null, status: EventStatus.CANCELED, photographerId: priya.id, amount: 950 },
    { title: "Rivera Anniversary", date: daysFromNow(-5, 18), time: "6:00 PM – 10:00 PM", location: "Cipriani 42nd St", eventType: "Anniversary", clientName: "The Riveras", clientPhone: "+880 1722 901234", clientEmail: "rivera@email.com", status: EventStatus.COMPLETED, photographerId: james.id, amount: 1200 },
    { title: "Vega Corporate Summit", date: daysFromNow(-9, 8), time: "8:00 AM – 6:00 PM", location: "Javits Center", eventType: "Corporate", clientName: "Vega Industries", clientPhone: "+880 1833 012345", clientEmail: "events@vega.com", status: EventStatus.COMPLETED, photographerId: priya.id, amount: 3200 },
    { title: "Kim Birthday Bash", date: daysFromNow(-13, 19), time: "7:00 PM – 1:00 AM", location: "Brooklyn Bowl", eventType: "Event", clientName: "Tara Kim", clientPhone: "+880 1955 123450", clientEmail: "tara@email.com", status: EventStatus.COMPLETED, photographerId: james.id, amount: 680 },
    { title: "Nguyen Wedding", date: daysFromNow(-16, 15), time: "3:00 PM – 11:00 PM", location: "The Bowery Hotel", eventType: "Wedding", clientName: "The Nguyens", clientPhone: "+880 1666 234561", clientEmail: "nguyens@email.com", status: EventStatus.COMPLETED, photographerId: james.id, amount: 3850 },
    { title: "Anand Family Portraits", date: daysFromNow(-18, 16), time: "4:00 PM – 6:00 PM", location: "Prospect Park", eventType: "Portrait", clientName: "The Anand Family", clientPhone: "+880 1577 345672", clientEmail: "anands@email.com", status: EventStatus.COMPLETED, photographerId: priya.id, amount: 420 },
    { title: "Hudson Magazine Shoot", date: daysFromNow(-22, 10), time: "10:00 AM – 4:00 PM", location: "Studio — Tribeca", eventType: "Editorial", clientName: "Hudson Magazine", clientPhone: "+880 1388 456783", clientEmail: "creative@hudsonmag.com", status: EventStatus.COMPLETED, photographerId: priya.id, amount: 2600 },
    { title: "Bloom & Briar Branding", date: daysFromNow(-25, 11), time: "11:00 AM – 2:00 PM", location: "Bloom & Briar Studio", eventType: "Branding", clientName: "Bloom & Briar Florists", clientPhone: "+880 1199 567894", clientEmail: "info@bloombriar.com", status: EventStatus.COMPLETED, photographerId: james.id, amount: 1100 },
  ];

  const createdEvents = [];
  for (const seed of eventSeeds) {
    const { amount, ...eventData } = seed;
    const event = await prisma.event.create({ data: eventData });
    createdEvents.push({ ...event, amount });
  }

  console.log(`✓ Created ${createdEvents.length} events`);

  const invoiceItemTemplates: Record<string, Array<{ description: string; ratio: number; quantity: number }>> = {
    Wedding: [
      { description: "8-hour Wedding Photography Coverage", ratio: 0.7, quantity: 1 },
      { description: "Engagement Session", ratio: 0.13, quantity: 1 },
      { description: "Premium Album — Leather Bound", ratio: 0.13, quantity: 1 },
      { description: "Drone Aerial Coverage", ratio: 0.04, quantity: 1 },
    ],
    Corporate: [
      { description: "Full-day Event Coverage", ratio: 0.7, quantity: 1 },
      { description: "Edited Photo Gallery", ratio: 0.2, quantity: 1 },
      { description: "Same-day Highlights", ratio: 0.1, quantity: 1 },
    ],
    Portrait: [
      { description: "2-hour Portrait Session", ratio: 0.6, quantity: 1 },
      { description: "Edited Digital Gallery", ratio: 0.4, quantity: 1 },
    ],
    Engagement: [
      { description: "Engagement Photo Session", ratio: 0.7, quantity: 1 },
      { description: "Premium Print Set", ratio: 0.3, quantity: 1 },
    ],
    Anniversary: [
      { description: "Anniversary Coverage", ratio: 0.75, quantity: 1 },
      { description: "Edited Photo Gallery", ratio: 0.25, quantity: 1 },
    ],
    Editorial: [
      { description: "Full-day Editorial Shoot", ratio: 0.65, quantity: 1 },
      { description: "Retouched Final Selects", ratio: 0.25, quantity: 1 },
      { description: "Studio Setup & Lighting", ratio: 0.1, quantity: 1 },
    ],
    Event: [
      { description: "Event Photography Coverage", ratio: 0.75, quantity: 1 },
      { description: "Edited Highlights Gallery", ratio: 0.25, quantity: 1 },
    ],
    Branding: [
      { description: "Brand Photography Session", ratio: 0.7, quantity: 1 },
      { description: "Image Licensing — 1 Year", ratio: 0.3, quantity: 1 },
    ],
    Headshots: [
      { description: "Professional Headshots — Per Person", ratio: 1, quantity: 8 },
    ],
  };

  let invoicesCreated = 0;
  for (const event of createdEvents) {
    if (event.status === EventStatus.CANCELED) continue;

    const template = invoiceItemTemplates[event.eventType ?? "Event"] ?? invoiceItemTemplates.Event;
    const isPaid = event.status === EventStatus.COMPLETED;

    await prisma.invoice.create({
      data: {
        eventId: event.id,
        grandTotal: event.amount,
        status: isPaid ? InvoiceStatus.PAID : InvoiceStatus.UNPAID,
        notes: "50% deposit due upon signing. Remaining balance due 14 days before the event.",
        items: {
          create: template.map((item) => {
            const lineTotal = Math.round(event.amount * item.ratio * 100) / 100;
            return {
              description: item.description,
              quantity: item.quantity,
              price: Math.round((lineTotal / item.quantity) * 100) / 100,
              total: lineTotal,
            };
          }),
        },
      },
    });
    invoicesCreated++;
  }

  console.log(`✓ Created ${invoicesCreated} invoices with line items`);

  const completedEvents = createdEvents.filter((e) => e.status === EventStatus.COMPLETED);
  const eventInvoices = await prisma.invoice.findMany({
    where: { eventId: { in: completedEvents.map((e) => e.id) } },
  });

  const methods = ["Bank Transfer", "Credit Card", "Cash", "Check"];
  let clientPaymentsCreated = 0;
  let photographerPaymentsCreated = 0;

  for (let i = 0; i < eventInvoices.length; i++) {
    const invoice = eventInvoices[i];
    const event = completedEvents.find((e) => e.id === invoice.eventId)!;
    const clientPaymentDate = new Date(event.date);
    clientPaymentDate.setDate(clientPaymentDate.getDate() + 3);

    await prisma.payment.create({
      data: {
        amount: invoice.grandTotal,
        date: clientPaymentDate,
        method: methods[i % methods.length],
        type: PaymentType.INCOME_CLIENT,
        invoiceId: invoice.id,
        reference: `WIRE-${(700000 + i * 137).toString()}`,
      },
    });
    clientPaymentsCreated++;

    if (event.photographerId) {
      const photographerPayoutDate = new Date(event.date);
      photographerPayoutDate.setDate(photographerPayoutDate.getDate() + 7);
      const photographerCut = Math.round(event.amount * 0.5 * 100) / 100;

      await prisma.payment.create({
        data: {
          amount: photographerCut,
          date: photographerPayoutDate,
          method: "Bank Transfer",
          type: PaymentType.EXPENSE_PHOTOGRAPHER,
          eventId: event.id,
          photographerId: event.photographerId,
        },
      });
      photographerPaymentsCreated++;
    }
  }

  console.log(`✓ Created ${clientPaymentsCreated} client payments (income)`);
  console.log(`✓ Created ${photographerPaymentsCreated} photographer payments (expense)`);

  console.log("\n✨ Seed complete!\n");
  console.log("Test logins:");
  console.log("  admin@shutterdesk.com    / password123  (Admin)");
  console.log("  office@shutterdesk.com   / password123  (Office)");
  console.log("  james@shutterdesk.com    / password123  (Photographer)");
  console.log("  priya@shutterdesk.com    / password123  (Photographer)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
