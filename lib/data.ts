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
  photographer: { id: string; name: string | null } | null;
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
      const photographerCut = payout
        ? num(payout.amount)
        : Math.round(eventValue * 0.5 * 100) / 100;
      return {
        id: e.id,
        title: e.title,
        date: e.date,
        clientName: e.clientName,
        eventType: e.eventType,
        amount: photographerCut,
        paymentStatus: payout
          ? "paid"
          : eventValue > 0
            ? "pending"
            : "awaiting",
        payoutDate: payout?.date ?? null,
      };
    }),
  };
}

export async function getPhotographerEarnings(photographerId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [thisMonth, ytd, completedCount, eventsThisMonth] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        photographerId,
        type: PaymentType.EXPENSE_PHOTOGRAPHER,
        date: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        photographerId,
        type: PaymentType.EXPENSE_PHOTOGRAPHER,
        date: { gte: startOfYear },
      },
      _sum: { amount: true },
    }),
    prisma.event.count({
      where: { photographerId, status: EventStatus.COMPLETED },
    }),
    prisma.event.count({
      where: { photographerId, date: { gte: startOfMonth } },
    }),
  ]);

  const pendingPayouts = await prisma.event.findMany({
    where: {
      photographerId,
      status: EventStatus.COMPLETED,
      payments: {
        none: { photographerId, type: PaymentType.EXPENSE_PHOTOGRAPHER },
      },
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
  const list = await prisma.user.findMany({
    where: { role: Role.PHOTOGRAPHER },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
  return list.map((p) => ({
    id: p.id,
    name: p.name ?? p.email.split("@")[0],
    email: p.email,
  }));
}

export async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { assignedEvents: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return users.map((u) => ({
    id: u.id,
    name: u.name ?? u.email.split("@")[0],
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    assignedEventCount: u._count.assignedEvents,
  }));
}

export async function getDashboardStatsForPeriod(year: number, month: number) {
  const startOfPeriod = new Date(year, month, 1);
  const endOfPeriod = new Date(year, month + 1, 0, 23, 59, 59, 999);
  const startOfPrevPeriod = new Date(year, month - 1, 1);
  const endOfPrevPeriod = new Date(year, month, 0, 23, 59, 59, 999);

  const [
    completedAll,
    completedThisPeriod,
    completedLastPeriod,
    contractsThisPeriod,
    contractsLastPeriod,
    incomeThisPeriod,
    incomeLastPeriod,
    expensesThisPeriod,
    expensesLastPeriod,
  ] = await Promise.all([
    prisma.event.count({ where: { status: EventStatus.COMPLETED } }),
    prisma.event.count({
      where: {
        status: EventStatus.COMPLETED,
        updatedAt: { gte: startOfPeriod, lte: endOfPeriod },
      },
    }),
    prisma.event.count({
      where: {
        status: EventStatus.COMPLETED,
        updatedAt: { gte: startOfPrevPeriod, lte: endOfPrevPeriod },
      },
    }),
    prisma.invoice.count({
      where: { createdAt: { gte: startOfPeriod, lte: endOfPeriod } },
    }),
    prisma.invoice.count({
      where: { createdAt: { gte: startOfPrevPeriod, lte: endOfPrevPeriod } },
    }),
    prisma.payment.aggregate({
      where: {
        type: PaymentType.INCOME_CLIENT,
        date: { gte: startOfPeriod, lte: endOfPeriod },
      },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        type: PaymentType.INCOME_CLIENT,
        date: { gte: startOfPrevPeriod, lte: endOfPrevPeriod },
      },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        type: PaymentType.EXPENSE_PHOTOGRAPHER,
        date: { gte: startOfPeriod, lte: endOfPeriod },
      },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        type: PaymentType.EXPENSE_PHOTOGRAPHER,
        date: { gte: startOfPrevPeriod, lte: endOfPrevPeriod },
      },
      _sum: { amount: true },
    }),
  ]);

  const incomeNow = num(incomeThisPeriod._sum.amount);
  const incomeBefore = num(incomeLastPeriod._sum.amount);
  const expensesNow = num(expensesThisPeriod._sum.amount);
  const expensesBefore = num(expensesLastPeriod._sum.amount);

  const pctChange = (now: number, before: number) => {
    if (before === 0) return now > 0 ? 100 : 0;
    return ((now - before) / before) * 100;
  };

  return {
    completedEvents: {
      value: completedThisPeriod,
      total: completedAll,
      change: pctChange(completedThisPeriod, completedLastPeriod),
    },
    newContracts: {
      value: contractsThisPeriod,
      change: contractsThisPeriod - contractsLastPeriod,
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

export async function getRecentActivityForPeriod(
  year: number,
  month: number,
  limit = 7
) {
  const startOfPeriod = new Date(year, month, 1);
  const endOfPeriod = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const payments = await prisma.payment.findMany({
    where: { date: { gte: startOfPeriod, lte: endOfPeriod } },
    include: {
      invoice: {
        include: { event: { select: { title: true, clientName: true } } },
      },
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
    return {
      id: p.id,
      type: p.type,
      description,
      reference,
      amount: num(p.amount),
      date: p.date,
      invoiceId: p.invoiceId,
      isIncome,
    };
  });
}

export async function getUpcomingEventsForPeriod(year: number, month: number) {
  const startOfPeriod = new Date(year, month, 1);
  const endOfPeriod = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const events = await prisma.event.findMany({
    where: {
      date: { gte: startOfPeriod, lte: endOfPeriod },
      status: EventStatus.PENDING,
    },
    include: { photographer: { select: { id: true, name: true } } },
    orderBy: { date: "asc" },
    take: 4,
  });
  return events;
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

export async function getAllInvoices() {
  const invoices = await prisma.invoice.findMany({
    include: {
      event: {
        select: {
          id: true,
          title: true,
          clientName: true,
          date: true,
          eventType: true,
          photographer: { select: { id: true, name: true } },
        },
      },
      payments: { select: { amount: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return invoices.map((i) => {
    const paid = i.payments.reduce((s, p) => s + num(p.amount), 0);
    const total = num(i.grandTotal);
    return {
      id: i.id,
      createdAt: i.createdAt,
      grandTotal: total,
      paidAmount: paid,
      balance: Math.max(0, total - paid),
      status: i.status,
      itemCount: i._count.items,
      event: {
        id: i.event.id,
        title: i.event.title,
        clientName: i.event.clientName,
        date: i.event.date,
        eventType: i.event.eventType,
        photographer: i.event.photographer,
      },
    };
  });
}

export async function getPhotographerCompletedEvents(photographerId: string) {
  const events = await prisma.event.findMany({
    where: { photographerId, status: EventStatus.COMPLETED },
    select: { id: true, title: true, date: true },
    orderBy: { date: "desc" },
  });
  return events.map((e) => ({ ...e, date: e.date }));
}

export async function getPhotographerRoster() {
  const photographers = await prisma.user.findMany({
    where: { role: Role.PHOTOGRAPHER },
    include: {
      assignedEvents: {
        select: {
          id: true,
          status: true,
          date: true,
          invoices: { select: { grandTotal: true } },
        },
      },
      payouts: {
        where: { type: PaymentType.EXPENSE_PHOTOGRAPHER },
        select: { amount: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const now = new Date();

  return photographers.map((p) => {
    const totalEvents = p.assignedEvents.length;
    const completedCount = p.assignedEvents.filter(
      (e) => e.status === EventStatus.COMPLETED
    ).length;
    const upcomingCount = p.assignedEvents.filter(
      (e) => e.status === EventStatus.PENDING && e.date >= now
    ).length;
    const totalEarned = p.payouts.reduce((s, p) => s + num(p.amount), 0);

    return {
      id: p.id,
      name: p.name ?? p.email.split("@")[0],
      email: p.email,
      createdAt: p.createdAt,
      totalEvents,
      completedCount,
      upcomingCount,
      totalEarned,
    };
  });
}

export async function getPhotographerSchedule(photographerId: string) {
  const now = new Date();

  const events = await prisma.event.findMany({
    where: {
      photographerId,
      date: { gte: now },
    },
    orderBy: { date: "asc" },
  });

  return events;
}

export async function getPhotographerEarningsDetail(photographerId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [thisMonth, ytd, allTime] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        photographerId,
        type: PaymentType.EXPENSE_PHOTOGRAPHER,
        date: { gte: startOfMonth },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: {
        photographerId,
        type: PaymentType.EXPENSE_PHOTOGRAPHER,
        date: { gte: startOfYear },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: { photographerId, type: PaymentType.EXPENSE_PHOTOGRAPHER },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const payouts = await prisma.payment.findMany({
    where: { photographerId, type: PaymentType.EXPENSE_PHOTOGRAPHER },
    include: {
      event: { select: { id: true, title: true, eventType: true, clientName: true } },
    },
    orderBy: { date: "desc" },
    take: 25,
  });

  const pendingEvents = await prisma.event.findMany({
    where: {
      photographerId,
      status: EventStatus.COMPLETED,
      payments: {
        none: { photographerId, type: PaymentType.EXPENSE_PHOTOGRAPHER },
      },
    },
    include: { invoices: { select: { grandTotal: true } } },
    orderBy: { date: "desc" },
  });

  const pendingTotal = pendingEvents.reduce((sum, e) => {
    const eventValue = e.invoices.reduce((s, i) => s + num(i.grandTotal), 0);
    return sum + Math.round(eventValue * 0.5 * 100) / 100;
  }, 0);

  return {
    thisMonth: {
      total: num(thisMonth._sum.amount),
      count: thisMonth._count,
    },
    yearToDate: {
      total: num(ytd._sum.amount),
      count: ytd._count,
    },
    allTime: {
      total: num(allTime._sum.amount),
      count: allTime._count,
    },
    pending: {
      total: pendingTotal,
      count: pendingEvents.length,
      events: pendingEvents.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        clientName: e.clientName,
        eventType: e.eventType,
        suggestedPayout:
          Math.round(
            e.invoices.reduce((s, i) => s + num(i.grandTotal), 0) * 0.5 * 100
          ) / 100,
      })),
    },
    payouts: payouts.map((p) => ({
      id: p.id,
      date: p.date,
      amount: num(p.amount),
      method: p.method,
      eventTitle: p.event?.title ?? "—",
      eventType: p.event?.eventType ?? null,
      clientName: p.event?.clientName ?? "—",
    })),
  };
}
