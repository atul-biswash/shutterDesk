"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { EventStatus, InvoiceStatus, PaymentType } from "@prisma/client";

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

  if (invoice) {
    const totalPaid = invoice.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const grandTotal = Number(invoice.grandTotal);
    if (totalPaid >= grandTotal) {
      await prisma.invoice.update({
        where: { id: input.invoiceId },
        data: { status: InvoiceStatus.PAID },
      });
    }
  }

  revalidatePath("/admin/finances");
  revalidatePath("/admin");
  revalidatePath(`/admin/invoices/${input.invoiceId}`);
  return { ok: true, id: payment.id };
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

export async function markEventCompleted(eventId: string) {
  await prisma.event.update({
    where: { id: eventId },
    data: { status: EventStatus.COMPLETED },
  });
  revalidatePath("/admin/events");
  revalidatePath("/admin");
}

export async function markInvoicePaid(invoiceId: string) {
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: InvoiceStatus.PAID },
  });
  revalidatePath(`/admin/invoices/${invoiceId}`);
  revalidatePath("/admin/finances");
}
