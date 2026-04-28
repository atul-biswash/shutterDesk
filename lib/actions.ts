"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { EventStatus, InvoiceStatus, PaymentType, Role } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }
  return session;
}

async function requireStaff() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.OFFICE)
  ) {
    throw new Error("Unauthorized");
  }
  return session;
}

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export async function createUser(
  input: CreateUserInput
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    if (!input.email || !input.password || !input.name) {
      return { ok: false, error: "All fields are required." };
    }
    if (input.password.length < 8) {
      return { ok: false, error: "Password must be at least 8 characters." };
    }

    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (existing) {
      return { ok: false, error: "A user with this email already exists." };
    }

    const hashed = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email: input.email.toLowerCase().trim(),
        password: hashed,
        role: input.role,
      },
      select: { id: true },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/events");
    return { ok: true, data: { id: user.id } };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to create user.",
    };
  }
}

export type CreateEventInput = {
  title: string;
  date: string;
  time?: string;
  location: string;
  eventType?: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  photographerId?: string;
  status?: EventStatus;
};

export async function createEvent(input: CreateEventInput) {
  await requireStaff();

  const event = await prisma.event.create({
    data: {
      title: input.title,
      date: new Date(input.date),
      time: input.time || null,
      location: input.location,
      eventType: input.eventType || null,
      clientName: input.clientName,
      clientPhone: input.clientPhone || null,
      clientEmail: input.clientEmail || null,
      photographerId: input.photographerId || null,
      status: input.status ?? EventStatus.PENDING,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/admin");
  return { ok: true, id: event.id };
}

export type CreateInvoiceInput = {
  customer: { name: string; phone?: string; email?: string };
  event: { title: string; date: string; location: string; eventType?: string };
  photographerIds: string[];
  items: Array<{ description: string; quantity: number; price: number }>;
  notes?: string;
  taxRate?: number;
};

export async function createInvoice(input: CreateInvoiceInput) {
  await requireStaff();

  const subtotal = input.items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );
  const tax = subtotal * ((input.taxRate ?? 0) / 100);
  const grandTotal = Math.round((subtotal + tax) * 100) / 100;
  const primaryPhotographerId = input.photographerIds[0] || null;

  const result = await prisma.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: {
        title: input.event.title,
        date: new Date(input.event.date),
        location: input.event.location,
        eventType: input.event.eventType || null,
        clientName: input.customer.name,
        clientPhone: input.customer.phone || null,
        clientEmail: input.customer.email || null,
        photographerId: primaryPhotographerId,
        status: EventStatus.PENDING,
      },
    });

    const invoice = await tx.invoice.create({
      data: {
        eventId: event.id,
        grandTotal,
        notes: input.notes || null,
        status: InvoiceStatus.UNPAID,
        items: {
          create: input.items
            .filter((i) => i.description.trim() !== "" && i.quantity > 0)
            .map((i) => ({
              description: i.description,
              quantity: i.quantity,
              price: i.price,
              total: Math.round(i.quantity * i.price * 100) / 100,
            })),
        },
      },
    });

    return { event, invoice };
  });

  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath("/admin/invoices");
  return { ok: true, invoiceId: result.invoice.id, eventId: result.event.id };
}

export type RecordClientPaymentInput = {
  invoiceId: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
};

export async function recordClientPayment(input: RecordClientPaymentInput) {
  await requireStaff();

  const payment = await prisma.payment.create({
    data: {
      amount: input.amount,
      date: new Date(input.date),
      method: input.method,
      type: PaymentType.INCOME_CLIENT,
      invoiceId: input.invoiceId,
      reference: input.reference || null,
      notes: input.notes || null,
    },
  });

  const invoice = await prisma.invoice.findUnique({
    where: { id: input.invoiceId },
    include: { payments: true },
  });

  let invoiceMarkedPaid = false;
  if (invoice) {
    const totalPaid = invoice.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const grandTotal = Number(invoice.grandTotal);
    if (totalPaid >= grandTotal && invoice.status !== InvoiceStatus.PAID) {
      await prisma.invoice.update({
        where: { id: input.invoiceId },
        data: { status: InvoiceStatus.PAID },
      });
      invoiceMarkedPaid = true;
    }
  }

  revalidatePath("/admin/finances");
  revalidatePath("/admin");
  revalidatePath(`/admin/invoices/${input.invoiceId}`);
  return { ok: true, id: payment.id, invoiceMarkedPaid };
}

export type PayPhotographerInput = {
  photographerId: string;
  eventId: string;
  date: string;
  amount: number;
  method: string;
  notes?: string;
};

export async function payPhotographer(input: PayPhotographerInput) {
  await requireStaff();

  const payment = await prisma.payment.create({
    data: {
      amount: input.amount,
      date: new Date(input.date),
      method: input.method,
      type: PaymentType.EXPENSE_PHOTOGRAPHER,
      photographerId: input.photographerId,
      eventId: input.eventId,
      notes: input.notes || null,
    },
  });

  revalidatePath("/admin/finances");
  revalidatePath("/admin");
  revalidatePath("/photographer");
  return { ok: true, id: payment.id };
}

export type MarkEventCompletedResult = {
  ok: boolean;
  payoutNeeded: boolean;
  photographerName: string | null;
  photographerId: string | null;
  eventTitle: string;
  suggestedAmount: number;
};

export async function markEventCompleted(
  eventId: string
): Promise<MarkEventCompletedResult> {
  await requireStaff();

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: { status: EventStatus.COMPLETED },
    include: {
      photographer: { select: { id: true, name: true } },
      invoices: { select: { grandTotal: true } },
      payments: {
        where: { type: PaymentType.EXPENSE_PHOTOGRAPHER },
        select: { id: true },
      },
    },
  });

  const eventValue = updated.invoices.reduce(
    (sum, inv) => sum + Number(inv.grandTotal),
    0
  );
  const alreadyPaid = updated.payments.length > 0;
  const payoutNeeded = !!updated.photographer && !alreadyPaid;

  revalidatePath("/admin/events");
  revalidatePath("/admin");
  revalidatePath("/photographer");

  return {
    ok: true,
    payoutNeeded,
    photographerName: updated.photographer?.name ?? null,
    photographerId: updated.photographer?.id ?? null,
    eventTitle: updated.title,
    suggestedAmount: Math.round(eventValue * 0.5 * 100) / 100,
  };
}

export async function markInvoicePaid(invoiceId: string) {
  await requireStaff();

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: InvoiceStatus.PAID },
  });
  revalidatePath(`/admin/invoices/${invoiceId}`);
  revalidatePath("/admin/finances");
}
