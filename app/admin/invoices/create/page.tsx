import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { InvoiceCreateForm } from "./InvoiceCreateForm";
import { getAllPhotographers } from "@/lib/data";

export default async function CreateInvoicePage() {
  const photographers = await getAllPhotographers();

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Create Invoice"
        subtitle="Generate a new invoice for a client event"
      />

      <div className="flex-1 p-6 max-w-7xl w-full">
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-sans text-text-muted hover:text-amber transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            Back to Dashboard
          </Link>

          <div className="hidden md:flex items-center gap-2 text-[11px] font-sans text-text-muted bg-surface-raised border border-border rounded-md px-3 py-1.5">
            <FileText className="w-3 h-3 text-amber" strokeWidth={2} />
            Draft Invoice
          </div>
        </div>

        <InvoiceCreateForm photographers={photographers} />
      </div>
    </div>
  );
}
