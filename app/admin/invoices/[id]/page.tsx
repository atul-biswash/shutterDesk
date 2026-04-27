import Link from "next/link";
import { notFound } from "next/navigation";
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
import { getInvoiceById } from "@/lib/data";
import { formatBDTWithDecimals as formatCurrency } from "@/lib/currency";
import { formatDateLong, formatDate } from "@/lib/constants";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) notFound();

  const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
  const tax = invoice.grandTotal - subtotal;
  const taxRate = subtotal > 0 ? (tax / subtotal) * 100 : 0;

  const dueDate = new Date(invoice.createdAt);
  dueDate.setDate(dueDate.getDate() + 30);

  const statusLabel = invoice.status === "PAID" ? "Paid" : "Pending";
  const statusColors =
    invoice.status === "PAID"
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-amber-100 text-amber-800 border-amber-300";

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={`Invoice ${invoice.id.slice(0, 12)}`}
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
                    <Aperture className="w-7 h-7 text-amber" strokeWidth={1.5} />
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
                      <p>Dhaka 1212, Bangladesh</p>
                      <p>hello@shutterdesk.com · +880 2 5566 7788</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-serif text-4xl text-paper-ink leading-none tracking-tight">
                    INVOICE
                  </p>
                  <p className="text-sm font-sans font-semibold text-amber-deep mt-2 tracking-wide font-mono">
                    {invoice.id.slice(0, 12).toUpperCase()}
                  </p>
                  <div
                    className={`mt-3 inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-sans font-semibold uppercase tracking-[0.15em] border ${statusColors}`}
                  >
                    {statusLabel}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10 mt-8">
                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-2.5 font-semibold">
                    Billed To
                  </p>
                  <p className="font-serif text-xl text-paper-ink leading-tight">
                    {invoice.event.clientName}
                  </p>
                  <div className="mt-3 text-[11px] font-sans text-paper-muted space-y-1 leading-relaxed">
                    {invoice.event.location && (
                      <div className="flex items-start gap-2">
                        <MapPin
                          className="w-3 h-3 mt-0.5 text-paper-subtle shrink-0"
                          strokeWidth={1.75}
                        />
                        <span>{invoice.event.location}</span>
                      </div>
                    )}
                    {invoice.event.clientEmail && (
                      <div className="flex items-center gap-2">
                        <Mail
                          className="w-3 h-3 text-paper-subtle shrink-0"
                          strokeWidth={1.75}
                        />
                        <span>{invoice.event.clientEmail}</span>
                      </div>
                    )}
                    {invoice.event.clientPhone && (
                      <div className="flex items-center gap-2">
                        <Phone
                          className="w-3 h-3 text-paper-subtle shrink-0"
                          strokeWidth={1.75}
                        />
                        <span>{invoice.event.clientPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-1.5 font-semibold">
                      Issue Date
                    </p>
                    <p className="text-sm font-sans text-paper-ink">
                      {formatDate(invoice.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-1.5 font-semibold">
                      Due Date
                    </p>
                    <p className="text-sm font-sans text-paper-ink font-medium">
                      {formatDate(dueDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-1.5 font-semibold">
                      Amount Due
                    </p>
                    <p className="font-serif text-2xl text-amber-deep leading-none">
                      {formatCurrency(invoice.grandTotal)}
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
                    {invoice.event.title}
                  </p>
                  <div className="mt-2.5 text-[11px] font-sans text-paper-muted space-y-1 leading-relaxed">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        className="w-3 h-3 text-paper-subtle shrink-0"
                        strokeWidth={1.75}
                      />
                      <span>{formatDateLong(invoice.event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin
                        className="w-3 h-3 text-paper-subtle shrink-0"
                        strokeWidth={1.75}
                      />
                      <span>{invoice.event.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-2.5 font-semibold">
                    Photography Team
                  </p>
                  {invoice.event.photographer ? (
                    <div>
                      <p className="text-sm font-sans font-medium text-paper-ink leading-tight">
                        {invoice.event.photographer.name}
                      </p>
                      <p className="text-[10px] font-sans text-paper-subtle uppercase tracking-wider mt-0.5">
                        Lead Photographer
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-sans text-paper-subtle italic">
                      To be assigned
                    </p>
                  )}
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
                      <th className="text-right text-[10px] font-sans uppercase tracking-[0.2em] text-paper-ink py-3 w-28 font-bold">
                        Price
                      </th>
                      <th className="text-right text-[10px] font-sans uppercase tracking-[0.2em] text-paper-ink py-3 w-32 font-bold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-paper-line">
                        <td className="py-3.5 pr-4">
                          <p className="text-sm font-sans text-paper-ink font-medium leading-snug">
                            {item.description}
                          </p>
                        </td>
                        <td className="py-3.5 text-sm font-sans text-center text-paper-muted">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 text-sm font-sans text-right text-paper-muted">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="py-3.5 text-sm font-sans font-medium text-right text-paper-ink">
                          {formatCurrency(item.total)}
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
                  {tax > 0.01 && (
                    <div className="flex justify-between text-sm font-sans text-paper-muted">
                      <span>Tax ({taxRate.toFixed(1)}%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 mt-1 border-t-2 border-paper-ink">
                    <span className="font-serif text-lg text-paper-ink">
                      Total Due
                    </span>
                    <span className="font-serif text-2xl text-amber-deep leading-none">
                      {formatCurrency(invoice.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="mt-12 pt-6 border-t border-paper-line">
                  <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-paper-subtle mb-2.5 font-semibold">
                    Notes & Terms
                  </p>
                  <p className="text-[11px] font-sans text-paper-muted leading-relaxed">
                    {invoice.notes}
                  </p>
                </div>
              )}

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
              <span className="font-mono">
                {invoice.id.slice(0, 12).toUpperCase()} · Page 1 of 1
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
