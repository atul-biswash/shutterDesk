import { prisma } from "@/lib/db";
import { Role, EventStatus, PaymentType } from "@prisma/client";

const num = (d: unknown): number => Number(d ?? 0);

export type EventListItem = {
  id: string;
  title: string;
  date: Date;
  time: string | null;
  location: string;
  eventType: string | null;
  clientName: string;
  status: EventStatus;
  photographer: { id: string; name: string } | null;
  amount: number;
};

export async function getAllEvents(): Promise<EventListItem[]> {
  const events = await prisma.event.findMany({
    include: {
      photographer: { select: { id: true, name: true } },
      invoices: { select: { grandTotal: true } },
    },
    orderBy: { date: "desc" },
  });

  return events.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time,
    location: e.location,
    eventType: e.eventType,
    clientName: e.clientName,
    status: e.status,
    photographer: e.photographer,
    amount: e.invoices.reduce((sum, inv) => sum + num(inv.grandTotal), 0),
  }));
}

export async function getUpcomingEvents(limit = 4) {
  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() }, status: EventStatus.PENDING },
    include: { photographer: { select: { id: true, name: true } } },
    orderBy: { date: "asc" },
    take: limit,
  });
  return events;
}

export async function getEventsForPhotographer(photographerId: string) {
  const now = new Date();

  const upcoming = await prisma.event.findMany({
    where: {
      photographerId,
      date: { gte: now },
      status: { in: [EventStatus.PENDING] },
    },
    orderBy: { date: "asc" },
  });

  const past = await prisma.event.findMany({
    where: {
      photographerId,
      OR: [{ date: { lt: now } }, { status: EventStatus.COMPLETED }],
    },
    include: {
      payments: {
        where: { type: PaymentType.EXPENSE_PHOTOGRAPHER, photographerId },
        select: { amount: true, date: true },
      },
      invoices: { select: { grandTotal: true } },
    },
    orderBy: { date: "desc" },
    take: 12,
  });

  return {
    upcoming,
    past: past.map((e) => {
      const payout = e.payments[0];
      const eventValue = e.invoices.reduce((s, i) => s + num(i.grandTotal), 0);
      const photographerCut = payout ? num(payout.amount) : Math.round(eventValue * 0.5 * 100) / 100;
      return {
        id: e.id,
        title: e.title,
        date: e.date,
        clientName: e.clientName,
        eventType: e.eventType,
        amount: photographerCut,
        paymentStatus: payout ? "paid" : eventValue > 0 ? "pending" : "awaiting",
        payoutDate: payout?.date ?? null,
      };
    }),
  };
}

export async function getPhotographerEarnings(photographerId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [thisMonth, ytd, allTime, completedCount, eventsThisMonth] = await Promise.all([
    prisma.payment.aggregate({
      where: { photographerId, type: PaymentType.EXPENSE_PHOTOGRAPHER, date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { photographerId, type: PaymentType.EXPENSE_PHOTOGRAPHER, date: { gte: startOfYear } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { photographerId, type: PaymentType.EXPENSE_PHOTOGRAPHER },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.event.count({
      where: { photographerId, status: EventStatus.COMPLETED },
    }),
    prisma.event.count({
      where: { photographerId, date: { gte: startOfMonth } },
    }),
  ]);

  const completedInvoices = await prisma.invoice.findMany({
    where: {
      event: { photographerId, status: EventStatus.COMPLETED },
      payments: { some: { photographerId, type: PaymentType.EXPENSE_PHOTOGRAPHER } },
    },
    select: { grandTotal: true },
  });

  const pendingPayouts = await prisma.event.findMany({
    where: {
      photographerId,
      status: EventStatus.COMPLETED,
      payments: { none: { photographerId, type: PaymentType.EXPENSE_PHOTOGRAPHER } },
    },
    include: { invoices: { select: { grandTotal: true } } },
  });

  const pendingTotal = pendingPayouts.reduce((sum, e) => {
    const eventValue = e.invoices.reduce((s, i) => s + num(i.grandTotal), 0);
    return sum + Math.round(eventValue * 0.5 * 100) / 100;
  }, 0);

  return {
    thisMonth: num(thisMonth._sum.amount),
    yearToDate: num(ytd._sum.amount),
    pendingPayouts: pendingTotal,
    eventsThisMonth,
    totalEvents: completedCount,
    completionRate: 100,
  };
}

export async function getAllPhotographers() {
  return prisma.user.findMany({
    where: { role: Role.PHOTOGRAPHER },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

export async function getDashboardStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    completedAll,
    contractsThisMonth,
    incomeThisMonth,
    expensesThisMonth,
    incomeLastMonth,
    expensesLastMonth,
    completedThisMonth,
    completedLastMonth,
    contractsLastMonth,
  ] = await Promise.all([
    prisma.event.count({ where: { status: EventStatus.COMPLETED } }),
    prisma.invoice.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.payment.aggregate({
      where: { type: PaymentType.INCOME_CLIENT, date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { type: PaymentType.EXPENSE_PHOTOGRAPHER, date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        type: PaymentType.INCOME_CLIENT,
        date: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        type: PaymentType.EXPENSE_PHOTOGRAPHER,
        date: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { amount: true },
    }),
    prisma.event.count({
      where: { status: EventStatus.COMPLETED, updatedAt: { gte: startOfMonth } },
    }),
    prisma.event.count({
      where: {
        status: EventStatus.COMPLETED,
        updatedAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    }),
    prisma.invoice.count({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
    }),
  ]);

  const incomeNow = num(incomeThisMonth._sum.amount);
  const incomeBefore = num(incomeLastMonth._sum.amount);
  const expensesNow = num(expensesThisMonth._sum.amount);
  const expensesBefore = num(expensesLastMonth._sum.amount);

  const pctChange = (now: number, before: number) => {
    if (before === 0) return now > 0 ? 100 : 0;
    return ((now - before) / before) * 100;
  };

  return {
    completedEvents: {
      value: completedAll,
      change: pctChange(completedThisMonth, completedLastMonth),
    },
    newContracts: {
      value: contractsThisMonth,
      change: contractsThisMonth - contractsLastMonth,
    },
    totalIncome: {
      value: incomeNow,
      change: pctChange(incomeNow, incomeBefore),
    },
    totalExpenses: {
      value: expensesNow,
      change: pctChange(expensesNow, expensesBefore),
    },
    netProfit: {
      value: incomeNow - expensesNow,
      change: pctChange(incomeNow - expensesNow, incomeBefore - expensesBefore),
    },
  };
}

export async function getRecentActivity(limit = 7) {
  const payments = await prisma.payment.findMany({
    include: {
      invoice: { include: { event: { select: { title: true, clientName: true } } } },
      event: { select: { title: true, clientName: true } },
      photographer: { select: { name: true } },
    },
    orderBy: { date: "desc" },
    take: limit,
  });

  return payments.map((p) => {
    const isIncome = p.type === PaymentType.INCOME_CLIENT;
    const description = isIncome ? "Payment received" : "Photographer paid";
    const reference = isIncome
      ? p.invoice?.event?.clientName ?? "Client"
      : p.photographer?.name ?? "Photographer";
    const invoiceId = p.invoiceId;

    return {
      id: p.id,
      type: p.type,
      description,
      reference,
      amount: num(p.amount),
      date: p.date,
      invoiceId,
      isIncome,
    };
  });
}

export async function getInvoiceById(id: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      event: {
        include: { photographer: { select: { id: true, name: true } } },
      },
      items: true,
      payments: true,
    },
  });

  if (!invoice) return null;

  return {
    id: invoice.id,
    grandTotal: num(invoice.grandTotal),
    status: invoice.status,
    notes: invoice.notes,
    createdAt: invoice.createdAt,
    event: invoice.event,
    items: invoice.items.map((i) => ({
      id: i.id,
      description: i.description,
      quantity: i.quantity,
      price: num(i.price),
      total: num(i.total),
    })),
    paidAmount: invoice.payments.reduce((s, p) => s + num(p.amount), 0),
  };
}

export async function getClientPayments() {
  const payments = await prisma.payment.findMany({
    where: { type: PaymentType.INCOME_CLIENT },
    include: {
      invoice: {
        include: { event: { select: { clientName: true, title: true } } },
      },
    },
    orderBy: { date: "desc" },
  });

  return payments.map((p) => ({
    id: p.id,
    date: p.date,
    client: p.invoice?.event?.clientName ?? "Unknown",
    invoiceId: p.invoiceId,
    amount: num(p.amount),
    method: p.method,
    reference: p.reference ?? "—",
  }));
}

export async function getPhotographerPayments() {
  const payments = await prisma.payment.findMany({
    where: { type: PaymentType.EXPENSE_PHOTOGRAPHER },
    include: {
      photographer: { select: { id: true, name: true } },
      event: { select: { id: true, title: true } },
    },
    orderBy: { date: "desc" },
  });

  return payments.map((p) => ({
    id: p.id,
    date: p.date,
    photographerName: p.photographer?.name ?? "Unknown",
    photographerId: p.photographerId,
    eventTitle: p.event?.title ?? "—",
    eventId: p.eventId,
    amount: num(p.amount),
    method: p.method,
  }));
}

export async function getOpenInvoices() {
  const invoices = await prisma.invoice.findMany({
    include: {
      event: { select: { clientName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return invoices.map((i) => ({
    id: i.id,
    client: i.event.clientName,
    amount: num(i.grandTotal),
    status: i.status,
  }));
}

export async function getPhotographerCompletedEvents(photographerId: string) {
  const events = await prisma.event.findMany({
    where: { photographerId, status: EventStatus.COMPLETED },
    select: { id: true, title: true, date: true },
    orderBy: { date: "desc" },
  });
  return events.map((e) => ({ ...e, date: e.date }));
}
