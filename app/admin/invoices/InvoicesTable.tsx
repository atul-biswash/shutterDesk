"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Search,
  X,
  ArrowUpRight,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { InvoiceStatus } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBDT } from "@/lib/currency";
import { getInitials, formatDate } from "@/lib/constants";

type Invoice = {
  id: string;
  createdAt: Date;
  grandTotal: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  itemCount: number;
  event: {
    id: string;
    title: string;
    clientName: string;
    date: Date;
    eventType: string | null;
    photographer: { id: string; name: string | null } | null;
  };
};

const statusBadge = (status: InvoiceStatus, balance: number) => {
  if (status === "PAID")
    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={2.5} />
        Paid
      </Badge>
    );
  if (balance > 0 && balance < 999999999) {
    return (
      <Badge variant="pending" className="gap-1">
        <Clock className="w-2.5 h-2.5" strokeWidth={2.5} />
        Unpaid
      </Badge>
    );
  }
  return (
    <Badge variant="pending" className="gap-1">
      <Clock className="w-2.5 h-2.5" strokeWidth={2.5} />
      Unpaid
    </Badge>
  );
};

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>(
    "all"
  );

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        inv.event.clientName.toLowerCase().includes(q) ||
        inv.event.title.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q) ||
        (inv.event.photographer?.name ?? "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const totalBilled = invoices.reduce((s, i) => s + i.grandTotal, 0);
    const totalPaid = invoices.reduce((s, i) => s + i.paidAmount, 0);
    const totalOutstanding = invoices.reduce((s, i) => s + i.balance, 0);
    const paidCount = invoices.filter((i) => i.status === "PAID").length;
    return {
      total: invoices.length,
      paidCount,
      unpaidCount: invoices.length - paidCount,
      totalBilled,
      totalPaid,
      totalOutstanding,
    };
  }, [invoices]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-text-muted">
              Total Invoices
            </p>
            <p className="font-serif text-2xl text-text-primary mt-1 leading-none">
              {stats.total}
            </p>
            <p className="text-[10px] font-sans text-text-muted mt-1">
              {stats.paidCount} paid · {stats.unpaidCount} unpaid
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-text-muted">
              Total Billed
            </p>
            <p className="font-serif text-2xl text-text-primary mt-1 leading-none truncate">
              {formatBDT(stats.totalBilled)}
            </p>
            <p className="text-[10px] font-sans text-text-muted mt-1">
              Across all invoices
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-profit/20 bg-green-profit-subtle">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-green-profit/70">
              Collected
            </p>
            <p className="font-serif text-2xl text-green-profit mt-1 leading-none truncate">
              {formatBDT(stats.totalPaid)}
            </p>
            <p className="text-[10px] font-sans text-text-muted mt-1">
              Payments received
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber/20 bg-amber-subtle/40">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-amber/70">
              Outstanding
            </p>
            <p className="font-serif text-2xl text-amber mt-1 leading-none truncate">
              {formatBDT(stats.totalOutstanding)}
            </p>
            <p className="text-[10px] font-sans text-text-muted mt-1">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardContent className="p-4 border-b border-border-subtle">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <Input
                placeholder="Search by client, event, or invoice ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(v) =>
                  setStatusFilter(v as typeof statusFilter)
                }
              >
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-text-muted hover:text-amber"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 text-xs font-sans text-text-muted">
              <span>Showing</span>
              <span className="text-amber font-semibold">
                {filteredInvoices.length}
              </span>
              <span>of</span>
              <span className="text-text-secondary font-medium">
                {invoices.length}
              </span>
              <span>invoices</span>
            </div>
          )}
        </CardContent>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Invoice</TableHead>
                <TableHead>Client / Event</TableHead>
                <TableHead>Photographer</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10 pr-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="w-10 h-10 rounded-md bg-surface-raised border border-border flex items-center justify-center">
                        <FileText
                          className="w-5 h-5 text-text-muted"
                          strokeWidth={1.5}
                        />
                      </div>
                      {invoices.length === 0 ? (
                        <>
                          <div>
                            <p className="text-sm font-sans text-text-primary">
                              No invoices yet
                            </p>
                            <p className="text-xs font-sans text-text-muted mt-1">
                              Generate your first invoice to start tracking
                              payments.
                            </p>
                          </div>
                          <Link href="/admin/invoices/create">
                            <Button size="sm">
                              Create Invoice
                              <ArrowUpRight
                                className="w-3.5 h-3.5"
                                strokeWidth={2}
                              />
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-sans text-text-secondary">
                            No invoices match your filters
                          </p>
                          <button
                            onClick={clearFilters}
                            className="text-xs font-sans text-amber hover:text-amber-dim transition-colors"
                          >
                            Clear filters
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((inv) => {
                  const isOverdue =
                    inv.status === "UNPAID" &&
                    new Date(inv.createdAt).getTime() <
                      Date.now() - 30 * 24 * 60 * 60 * 1000;
                  return (
                    <TableRow key={inv.id} className="group">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0">
                            <FileText
                              className="w-3.5 h-3.5 text-amber"
                              strokeWidth={1.75}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-mono text-xs text-text-primary whitespace-nowrap">
                              {inv.id.slice(0, 12).toUpperCase()}
                            </p>
                            <p className="text-[10px] font-sans text-text-muted mt-0.5">
                              {inv.itemCount} line item
                              {inv.itemCount === 1 ? "" : "s"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-text-primary whitespace-nowrap">
                          {inv.event.clientName}
                        </p>
                        <p className="text-[11px] font-sans text-text-muted truncate max-w-[200px]">
                          {inv.event.title}
                        </p>
                      </TableCell>
                      <TableCell>
                        {inv.event.photographer ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber/20 border border-amber/30 flex items-center justify-center shrink-0">
                              <span className="text-[9px] font-semibold font-sans text-amber">
                                {getInitials(
                                  inv.event.photographer.name ?? "??"
                                )}
                              </span>
                            </div>
                            <span className="text-text-secondary whitespace-nowrap text-xs">
                              {inv.event.photographer.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-text-muted italic text-xs">
                            Unassigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-text-secondary whitespace-nowrap text-xs">
                        {formatDate(inv.createdAt)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-text-primary whitespace-nowrap">
                        {formatBDT(inv.grandTotal)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {inv.balance === 0 ? (
                          <span className="text-text-muted text-xs">—</span>
                        ) : (
                          <span
                            className={
                              isOverdue
                                ? "text-red-expense font-medium"
                                : "text-amber font-medium"
                            }
                          >
                            {formatBDT(inv.balance)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {statusBadge(inv.status, inv.balance)}
                          {isOverdue && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle
                                className="w-2.5 h-2.5"
                                strokeWidth={2.5}
                              />
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="pr-4">
                        <Link
                          href={`/admin/invoices/${inv.id}`}
                          className="w-7 h-7 rounded-md text-text-muted hover:text-amber hover:bg-amber-subtle transition-all opacity-50 group-hover:opacity-100 flex items-center justify-center"
                        >
                          <ArrowUpRight
                            className="w-3.5 h-3.5"
                            strokeWidth={2}
                          />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
