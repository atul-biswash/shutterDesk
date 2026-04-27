import Link from "next/link";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Aperture,
  Pencil,
  MapPin,
  CalendarDays,
  Phone,
  Mail,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { PrintButton } from "./PrintButton";

import { formatBDTWithDecimals as formatCurrency } from "@/lib/currency";

const mockInvoice = {
  number: "INV-2026-001",
  status: "Pending",
  issueDate: "April 26, 2026",
  dueDate: "May 26, 2026",
  customer: {
    name: "Helena & Marcus Wilson",
    phone: "+1 (555) 234-7891",
    email: "helena.wilson@email.com",
    address: "84 Crescent Lane, Brooklyn, NY 11201",
  },
  event: {
    title: "The Wilson Wedding",
    date: "June 15, 2026",
    location: "Belmont Estate, Tarrytown, NY",
  },
  photographers: [
    { name: "James Okafor", role: "Lead Photographer" },
    { name: "Priya Mehta", role: "Second Shooter" },
  ],
  items: [
    {
      description: "8-hour Wedding Photography Coverage",
      detail: "Full ceremony and reception, prep through send-off",
      quantity: 1,
      price: 2400,
    },
    {
      description: "Premium Album — Leather Bound (12×12)",
      detail: "60 pages, archival prints, hand-bound",
      quantity: 2,
      price: 300,
    },
    {
      description: "Engagement Session",
      detail: "2-hour pre-wedding shoot at location of choice",
      quantity: 1,
      price: 450,
    },
    {
      description: "Drone Aerial Coverage",
      detail: "Licensed pilot, 4K footage, edited highlight reel",
      quantity: 1,
      price: 200,
    },
    {
      description: "Digital Gallery & Print Release",
      detail: "Online gallery for 1 year, full print release rights",
      quantity: 1,
      price: 150,
    },
  ],
  notes:
    "Thank you for choosing ShutterDesk for your wedding day. A 50% deposit (৳1,750) is required upon signing this contract to secure your date. The remaining balance is due 14 days prior to the event. Cancellation within 30 days of the event forfeits the deposit.",
  taxRate: 8,
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = mockInvoice;

  const subtotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={`Invoice ${id}`}
        subtitle="View, print, or share this invoice"
      />

      <div className="flex-1 p-6 invoice-page-wrapper">
        <div className="max-w-[850px] mx-auto">
          <div className="flex items-center justify-between mb-5 print:hidden">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-sans text-text-muted hover:text-amber transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Pencil className="w-4 h-4" strokeWidth={2} />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Send className="w-4 h-4" strokeWidth={2} />
                Email
              </Button>
              <Button variant="outline" size="sm">
                <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                Mark as Paid
              </Button>
              <PrintButton />
            </div>
          </div>

          <div className="invoice-paper bg-paper text-paper-ink rounded-lg shadow-paper print:shadow-none border border-paper-line print:border-0 overflow-hidden">
            <div className="px-12 pt-12 pb-8 print:px-10 print:pt-10 print:pb-6">
              <div className="flex items-start justify-between border-b-2 border-paper-ink pb-7">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-md bg-paper-ink flex items-center justify-center shrink-0">
                    <Aperture
                      className="w-7 h-7 text-amber"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p className="font-serif text-3xl text-paper-ink leading-none">
                      ShutterDesk
                    </p>
                    <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-paper-subtle mt-1.5">
                      Photography Studio
                    </p>
                    <div className="mt-3 text-[11px] font-sans text-paper-muted space-y-0.5 leading-relaxed">
                      <p>92 Bridgewater Avenue, Suite 4B</p>
                      <p>Brooklyn, NY 11211</p>
                      <p>hello@shutterdesk.com · +1 (555) 010-2233</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-serif text-4xl text-paper-ink leading-none tracking-tight">
                    INVOICE
                  </p>
                  <p className="text-sm font-sans font-semibold text-amber-deep mt-2 tracking-wide">
                    {data.number}
                  </p>
                  <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-sm bg-amber-100 text-amber-800 text-[10px] font-sans font-semibold uppercase tracking-[0.15em] border border-amber-300">
                    {data.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10 mt-8">
                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-2.5 font-semibold">
                    Billed To
                  </p>
                  <p className="font-serif text-xl text-paper-ink leading-tight">
                    {data.customer.name}
                  </p>
                  <div className="mt-3 text-[11px] font-sans text-paper-muted space-y-1 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <MapPin
                        className="w-3 h-3 mt-0.5 text-paper-subtle shrink-0"
                        strokeWidth={1.75}
                      />
                      <span>{data.customer.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail
                        className="w-3 h-3 text-paper-subtle shrink-0"
                        strokeWidth={1.75}
                      />
                      <span>{data.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone
                        className="w-3 h-3 text-paper-subtle shrink-0"
                        strokeWidth={1.75}
                      />
                      <span>{data.customer.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-1.5 font-semibold">
                      Issue Date
                    </p>
                    <p className="text-sm font-sans text-paper-ink">
                      {data.issueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-1.5 font-semibold">
                      Due Date
                    </p>
                    <p className="text-sm font-sans text-paper-ink font-medium">
                      {data.dueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-1.5 font-semibold">
                      Amount Due
                    </p>
                    <p className="font-serif text-2xl text-amber-deep leading-none">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-paper-line grid grid-cols-2 gap-10">
                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-2.5 font-semibold">
                    Event
                  </p>
                  <p className="font-serif text-lg text-paper-ink leading-tight">
                    {data.event.title}
                  </p>
                  <div className="mt-2.5 text-[11px] font-sans text-paper-muted space-y-1 leading-relaxed">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        className="w-3 h-3 text-paper-subtle shrink-0"
                        strokeWidth={1.75}
                      />
                      <span>{data.event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin
                        className="w-3 h-3 text-paper-subtle shrink-0"
                        strokeWidth={1.75}
                      />
                      <span>{data.event.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-2.5 font-semibold">
                    Photography Team
                  </p>
                  <div className="space-y-2">
                    {data.photographers.map((p) => (
                      <div key={p.name}>
                        <p className="text-sm font-sans font-medium text-paper-ink leading-tight">
                          {p.name}
                        </p>
                        <p className="text-[10px] font-sans text-paper-subtle uppercase tracking-wider mt-0.5">
                          {p.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <table className="w-full">
                  <thead>
                    <tr className="border-y-2 border-paper-ink">
                      <th className="text-left text-[10px] font-sans uppercase tracking-[0.2em] text-paper-ink py-3 font-bold">
                        Description
                      </th>
                      <th className="text-center text-[10px] font-sans uppercase tracking-[0.2em] text-paper-ink py-3 w-16 font-bold">
                        Qty
                      </th>
                      <th className="text-right text-[10px] font-sans uppercase tracking-[0.2em] text-paper-ink py-3 w-24 font-bold">
                        Price
                      </th>
                      <th className="text-right text-[10px] font-sans uppercase tracking-[0.2em] text-paper-ink py-3 w-28 font-bold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, i) => (
                      <tr key={i} className="border-b border-paper-line">
                        <td className="py-3.5 pr-4">
                          <p className="text-sm font-sans text-paper-ink font-medium leading-snug">
                            {item.description}
                          </p>
                          {item.detail && (
                            <p className="text-[10px] font-sans text-paper-subtle mt-0.5 leading-relaxed">
                              {item.detail}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 text-sm font-sans text-center text-paper-muted">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 text-sm font-sans text-right text-paper-muted">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="py-3.5 text-sm font-sans font-medium text-right text-paper-ink">
                          {formatCurrency(item.quantity * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-8">
                <div className="w-72 space-y-2.5">
                  <div className="flex justify-between text-sm font-sans text-paper-muted">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans text-paper-muted">
                    <span>Tax ({data.taxRate}%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between pt-3 mt-1 border-t-2 border-paper-ink">
                    <span className="font-serif text-lg text-paper-ink">
                      Total Due
                    </span>
                    <span className="font-serif text-2xl text-amber-deep leading-none">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-paper-line">
                <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-2.5 font-semibold">
                  Notes & Terms
                </p>
                <p className="text-[11px] font-sans text-paper-muted leading-relaxed">
                  {data.notes}
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-paper-line text-center">
                <p className="font-serif text-base text-paper-ink italic">
                  Thank you for choosing ShutterDesk.
                </p>
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-paper-subtle mt-2">
                  Capturing moments · Crafting memories
                </p>
              </div>
            </div>

            <div className="bg-paper-line/40 px-12 py-3 print:px-10 flex items-center justify-between text-[10px] font-sans text-paper-subtle">
              <span>shutterdesk.com</span>
              <span>
                Invoice {data.number} · Page 1 of 1
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
