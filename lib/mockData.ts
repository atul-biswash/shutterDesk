export const photographers = [
  { id: "p1", name: "James Okafor", email: "james@shutterdesk.com", specialty: "Weddings", initials: "JO" },
  { id: "p2", name: "Priya Mehta", email: "priya@shutterdesk.com", specialty: "Corporate", initials: "PM" },
  { id: "p3", name: "Sofia Reyes", email: "sofia@shutterdesk.com", specialty: "Portrait", initials: "SR" },
  { id: "p4", name: "Marcus Tanaka", email: "marcus@shutterdesk.com", specialty: "Events", initials: "MT" },
  { id: "p5", name: "Anya Volkov", email: "anya@shutterdesk.com", specialty: "Fashion", initials: "AV" },
  { id: "p6", name: "David Chen", email: "david@shutterdesk.com", specialty: "Editorial", initials: "DC" },
];

export type EventStatus = "Pending" | "Completed" | "Canceled" | "In Progress";
export type PaymentStatus = "paid" | "pending" | "awaiting" | "overdue";

export const allEvents = [
  { id: "EV-2026-001", name: "The Wilson Wedding", date: "Jun 15, 2026", time: "4:00 PM – 11:00 PM", location: "Belmont Estate, Tarrytown NY", client: "Helena & Marcus Wilson", photographer: "James Okafor", type: "Wedding", status: "Pending" as EventStatus, amount: 3450 },
  { id: "EV-2026-002", name: "TechVive Annual Dinner", date: "May 6, 2026", time: "7:00 PM – 10:00 PM", location: "The Plaza Hotel, NY", client: "TechVive Inc.", photographer: "Priya Mehta", type: "Corporate", status: "Pending" as EventStatus, amount: 2200 },
  { id: "EV-2026-003", name: "Chen Family Portrait", date: "May 9, 2026", time: "2:00 PM – 4:00 PM", location: "Central Park, NY", client: "The Chen Family", photographer: "Sofia Reyes", type: "Portrait", status: "Pending" as EventStatus, amount: 540 },
  { id: "EV-2026-004", name: "Morales Engagement", date: "May 12, 2026", time: "5:30 PM – 8:00 PM", location: "Brooklyn Bridge Park", client: "Sofia & Diego Morales", photographer: "James Okafor", type: "Engagement", status: "Pending" as EventStatus, amount: 850 },
  { id: "EV-2026-005", name: "Tan Quinceañera", date: "May 17, 2026", time: "6:00 PM – 12:00 AM", location: "Glen Cove Mansion", client: "The Tan Family", photographer: "Marcus Tanaka", type: "Event", status: "Pending" as EventStatus, amount: 1750 },
  { id: "EV-2026-006", name: "Bay Area Tech Headshots", date: "May 21, 2026", time: "9:00 AM – 5:00 PM", location: "Studio — SoHo", client: "BrightWave Co.", photographer: "Priya Mehta", type: "Headshots", status: "Pending" as EventStatus, amount: 1900 },
  { id: "EV-2026-007", name: "Spring Fashion Editorial", date: "May 24, 2026", time: "10:00 AM – 6:00 PM", location: "Hudson Yards, NY", client: "Atelier Hudson", photographer: "Anya Volkov", type: "Editorial", status: "Pending" as EventStatus, amount: 2800 },
  { id: "EV-2026-008", name: "Hartwood Gallery Opening", date: "Apr 30, 2026", time: "7:00 PM – 11:00 PM", location: "Hartwood Gallery, Chelsea", client: "Hartwood Gallery", photographer: "David Chen", type: "Event", status: "Pending" as EventStatus, amount: 1100 },
  { id: "EV-2026-009", name: "Patel Garden Party", date: "Apr 29, 2026", time: "3:00 PM – 9:00 PM", location: "Private residence, Bronx", client: "The Patels", photographer: "Marcus Tanaka", type: "Event", status: "Canceled" as EventStatus, amount: 950 },
  { id: "EV-2026-010", name: "Rivera Wedding Anniversary", date: "Apr 22, 2026", time: "6:00 PM – 10:00 PM", location: "Cipriani 42nd St", client: "The Riveras", photographer: "James Okafor", type: "Anniversary", status: "Completed" as EventStatus, amount: 1200 },
  { id: "EV-2026-011", name: "Vega Corporate Summit", date: "Apr 18, 2026", time: "8:00 AM – 6:00 PM", location: "Javits Center", client: "Vega Industries", photographer: "Priya Mehta", type: "Corporate", status: "Completed" as EventStatus, amount: 3200 },
  { id: "EV-2026-012", name: "Kim Birthday Bash", date: "Apr 14, 2026", time: "7:00 PM – 1:00 AM", location: "Brooklyn Bowl", client: "Tara Kim", photographer: "Marcus Tanaka", type: "Event", status: "Completed" as EventStatus, amount: 680 },
  { id: "EV-2026-013", name: "Nguyen Wedding", date: "Apr 11, 2026", time: "3:00 PM – 11:00 PM", location: "The Bowery Hotel", client: "The Nguyens", photographer: "James Okafor", type: "Wedding", status: "Completed" as EventStatus, amount: 3850 },
  { id: "EV-2026-014", name: "Anand Family Portraits", date: "Apr 9, 2026", time: "4:00 PM – 6:00 PM", location: "Prospect Park", client: "The Anand Family", photographer: "Sofia Reyes", type: "Portrait", status: "Completed" as EventStatus, amount: 420 },
  { id: "EV-2026-015", name: "Hudson Magazine Shoot", date: "Apr 5, 2026", time: "10:00 AM – 4:00 PM", location: "Studio — Tribeca", client: "Hudson Magazine", photographer: "David Chen", type: "Editorial", status: "Completed" as EventStatus, amount: 2600 },
  { id: "EV-2026-016", name: "Bloom & Briar Branding", date: "Apr 2, 2026", time: "11:00 AM – 2:00 PM", location: "Bloom & Briar Studio", client: "Bloom & Briar Florists", photographer: "Anya Volkov", type: "Branding", status: "Completed" as EventStatus, amount: 1100 },
];

export const photographerEarnings = {
  thisMonth: 4280,
  yearToDate: 38540,
  pendingPayouts: 1850,
  eventsThisMonth: 6,
  completionRate: 98,
  totalEvents: 47,
};

export const photographerUpcoming = [
  { id: "EV-2026-001", title: "The Wilson Wedding", dateLabel: "Jun 15", dateLong: "Saturday, June 15, 2026", time: "4:00 PM – 11:00 PM", location: "Belmont Estate, Tarrytown NY", client: "Helena & Marcus Wilson", type: "Wedding", status: "Confirmed", role: "Lead Photographer" },
  { id: "EV-2026-004", title: "Morales Engagement", dateLabel: "May 12", dateLong: "Tuesday, May 12, 2026", time: "5:30 PM – 8:00 PM", location: "Brooklyn Bridge Park", client: "Sofia & Diego Morales", type: "Engagement", status: "Confirmed", role: "Lead Photographer" },
  { id: "EV-2026-019", title: "Stark Anniversary Dinner", dateLabel: "May 18", dateLong: "Monday, May 18, 2026", time: "7:00 PM – 10:30 PM", location: "Eleven Madison Park", client: "Olivia & Henry Stark", type: "Anniversary", status: "Brief Pending", role: "Lead Photographer" },
  { id: "EV-2026-022", title: "Greenwich Studio Shoot", dateLabel: "May 25", dateLong: "Monday, May 25, 2026", time: "10:00 AM – 4:00 PM", location: "Studio — Greenwich", client: "Elena Voss", type: "Editorial", status: "Confirmed", role: "Second Shooter" },
  { id: "EV-2026-028", title: "The Reyes-Cole Wedding", dateLabel: "Jun 1", dateLong: "Monday, June 1, 2026", time: "2:00 PM – 11:00 PM", location: "Hudson Valley Estate", client: "Maria & Jordan Reyes-Cole", type: "Wedding", status: "Confirmed", role: "Lead Photographer" },
  { id: "EV-2026-031", title: "Lakehouse Engagement", dateLabel: "Jun 7", dateLong: "Sunday, June 7, 2026", time: "5:00 PM – 8:00 PM", location: "Greenwood Lake, NJ", client: "Amara & Felix Daume", type: "Engagement", status: "Confirmed", role: "Lead Photographer" },
];

export const photographerPast = [
  { id: "EV-2026-013", title: "Nguyen Wedding", date: "Apr 11, 2026", client: "The Nguyens", type: "Wedding", amount: 1925, paymentStatus: "paid" as PaymentStatus, payoutDate: "Apr 18, 2026" },
  { id: "EV-2026-010", title: "Rivera Anniversary", date: "Apr 22, 2026", client: "The Riveras", type: "Anniversary", amount: 600, paymentStatus: "paid" as PaymentStatus, payoutDate: "Apr 25, 2026" },
  { id: "EV-2026-091", title: "Hartman Spring Gala", date: "Mar 28, 2026", client: "Hartman Foundation", type: "Event", amount: 950, paymentStatus: "paid" as PaymentStatus, payoutDate: "Apr 4, 2026" },
  { id: "EV-2026-088", title: "Anand Family Portrait", date: "Mar 22, 2026", client: "The Anand Family", type: "Portrait", amount: 320, paymentStatus: "pending" as PaymentStatus, payoutDate: "—" },
  { id: "EV-2026-083", title: "Tara Birthday Bash", date: "Mar 19, 2026", client: "Tara Patel", type: "Event", amount: 540, paymentStatus: "awaiting" as PaymentStatus, payoutDate: "—" },
  { id: "EV-2026-079", title: "Lim Family Reunion", date: "Mar 14, 2026", client: "The Lims", type: "Event", amount: 720, paymentStatus: "paid" as PaymentStatus, payoutDate: "Mar 21, 2026" },
  { id: "EV-2026-072", title: "Editorial — Hudson Mag", date: "Mar 9, 2026", client: "Hudson Magazine", type: "Editorial", amount: 1200, paymentStatus: "paid" as PaymentStatus, payoutDate: "Mar 16, 2026" },
  { id: "EV-2026-066", title: "Ganesh Wedding", date: "Mar 1, 2026", client: "Priya & Arjun Ganesh", type: "Wedding", amount: 2100, paymentStatus: "paid" as PaymentStatus, payoutDate: "Mar 8, 2026" },
];

export const clientPayments = [
  { id: "PAY-IN-001", date: "Apr 26, 2026", client: "Helena & Marcus Wilson", invoiceId: "INV-2026-001", amount: 1725, method: "Bank Transfer", reference: "WIRE-784512" },
  { id: "PAY-IN-002", date: "Apr 24, 2026", client: "TechVive Inc.", invoiceId: "INV-2026-002", amount: 4100, method: "Credit Card", reference: "STR-39481" },
  { id: "PAY-IN-003", date: "Apr 22, 2026", client: "The Nguyens", invoiceId: "INV-2026-013", amount: 3850, method: "Bank Transfer", reference: "WIRE-784301" },
  { id: "PAY-IN-004", date: "Apr 19, 2026", client: "Vega Industries", invoiceId: "INV-2026-011", amount: 3200, method: "Check", reference: "CHK-2247" },
  { id: "PAY-IN-005", date: "Apr 15, 2026", client: "The Riveras", invoiceId: "INV-2026-010", amount: 1200, method: "Credit Card", reference: "STR-39102" },
  { id: "PAY-IN-006", date: "Apr 12, 2026", client: "Hudson Magazine", invoiceId: "INV-2026-015", amount: 2600, method: "Bank Transfer", reference: "WIRE-783914" },
  { id: "PAY-IN-007", date: "Apr 8, 2026", client: "Tara Kim", invoiceId: "INV-2026-012", amount: 680, method: "Cash", reference: "—" },
  { id: "PAY-IN-008", date: "Apr 5, 2026", client: "Bloom & Briar Florists", invoiceId: "INV-2026-016", amount: 1100, method: "Bank Transfer", reference: "WIRE-783520" },
];

export const photographerPayments = [
  { id: "PAY-OUT-001", date: "Apr 25, 2026", photographer: "James Okafor", event: "Rivera Anniversary", eventId: "EV-2026-010", amount: 600, method: "Bank Transfer" },
  { id: "PAY-OUT-002", date: "Apr 23, 2026", photographer: "Priya Mehta", event: "Vega Corporate Summit", eventId: "EV-2026-011", amount: 1600, method: "Bank Transfer" },
  { id: "PAY-OUT-003", date: "Apr 18, 2026", photographer: "James Okafor", event: "Nguyen Wedding", eventId: "EV-2026-013", amount: 1925, method: "Bank Transfer" },
  { id: "PAY-OUT-004", date: "Apr 16, 2026", photographer: "Marcus Tanaka", event: "Kim Birthday Bash", eventId: "EV-2026-012", amount: 340, method: "Bank Transfer" },
  { id: "PAY-OUT-005", date: "Apr 12, 2026", photographer: "Sofia Reyes", event: "Anand Family Portraits", eventId: "EV-2026-014", amount: 210, method: "Bank Transfer" },
  { id: "PAY-OUT-006", date: "Apr 8, 2026", photographer: "David Chen", event: "Hudson Magazine Shoot", eventId: "EV-2026-015", amount: 1300, method: "Bank Transfer" },
  { id: "PAY-OUT-007", date: "Apr 5, 2026", photographer: "Anya Volkov", event: "Bloom & Briar Branding", eventId: "EV-2026-016", amount: 550, method: "Bank Transfer" },
  { id: "PAY-OUT-008", date: "Apr 2, 2026", photographer: "James Okafor", event: "Hartman Spring Gala", eventId: "EV-2026-091", amount: 950, method: "Bank Transfer" },
];

export const paymentMethods = [
  "Bank Transfer",
  "Credit Card",
  "Cash",
  "Check",
  "PayPal",
  "Stripe",
];

export const invoices = [
  { id: "INV-2026-001", client: "Helena & Marcus Wilson", amount: 3450 },
  { id: "INV-2026-002", client: "TechVive Inc.", amount: 4100 },
  { id: "INV-2026-010", client: "The Riveras", amount: 1200 },
  { id: "INV-2026-011", client: "Vega Industries", amount: 3200 },
  { id: "INV-2026-013", client: "The Nguyens", amount: 3850 },
  { id: "INV-2026-015", client: "Hudson Magazine", amount: 2600 },
  { id: "INV-2026-016", client: "Bloom & Briar Florists", amount: 1100 },
];
