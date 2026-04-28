import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { InvoicesTable } from "./InvoicesTable";
import { getAllInvoices } from "@/lib/data";

export default async function InvoicesPage() {
  const invoices = await getAllInvoices();

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Invoices"
        subtitle="All client invoices and their payment status"
      />

      <div className="flex-1 p-6 space-y-5">
        <div className="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row opacity-0 animate-fade-in">
          <div>
            <h2 className="font-serif text-2xl text-text-primary">
              Invoice Records
            </h2>
            <p className="text-sm font-sans text-text-secondary mt-0.5">
              Track outstanding balances, payments received, and invoice status.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" strokeWidth={2} />
              Export
            </Button>
            <Link href="/admin/invoices/create">
              <Button size="sm">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Create Invoice
              </Button>
            </Link>
          </div>
        </div>

        <div className="opacity-0 animate-fade-in-delay-1">
          <InvoicesTable invoices={invoices} />
        </div>
      </div>
    </div>
  );
}
