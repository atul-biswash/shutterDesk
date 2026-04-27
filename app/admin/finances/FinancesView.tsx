"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Wallet,
  Receipt,
  ArrowUpRight,
  CreditCard,
  Banknote,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBDTWithDecimals as formatCurrency } from "@/lib/currency";
import { getInitials, formatDate } from "@/lib/constants";
import { RecordClientPaymentDialog } from "./RecordClientPaymentDialog";
import { PayPhotographerDialog } from "./PayPhotographerDialog";

type ClientPayment = {
  id: string;
  date: Date;
  client: string;
  invoiceId: string | null;
  amount: number;
  method: string;
  reference: string;
};

type PhotographerPayment = {
  id: string;
  date: Date;
  photographerName: string;
  photographerId: string | null;
  eventTitle: string;
  eventId: string | null;
  amount: number;
  method: string;
};

type OpenInvoice = {
  id: string;
  client: string;
  amount: number;
  status: string;
};

type Photographer = { id: string; name: string; email: string };

const methodIcon = (method: string) => {
  if (method === "Bank Transfer") return Banknote;
  if (method === "Credit Card") return CreditCard;
  if (method === "Check") return FileText;
  return Wallet;
};

const methodBadge = (method: string) => {
  const Icon = methodIcon(method);
  return (
    <Badge variant="secondary" className="gap-1.5 font-medium">
      <Icon className="w-2.5 h-2.5" strokeWidth={2} />
      {method}
    </Badge>
  );
};

export function FinancesView({
  clientPayments,
  photographerPayments,
  openInvoices,
  photographers,
}: {
  clientPayments: ClientPayment[];
  photographerPayments: PhotographerPayment[];
  openInvoices: OpenInvoice[];
  photographers: Photographer[];
}) {
  const [incomeSearch, setIncomeSearch] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");

  const totalIncome = clientPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = photographerPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const net = totalIncome - totalExpenses;
  const margin =
    totalIncome > 0 ? ((net / totalIncome) * 100).toFixed(1) : "0.0";
  const avgIncome =
    clientPayments.length > 0 ? totalIncome / clientPayments.length : 0;

  const filteredIncome = useMemo(
    () =>
      clientPayments.filter(
        (p) =>
          incomeSearch === "" ||
          p.client.toLowerCase().includes(incomeSearch.toLowerCase()) ||
          (p.invoiceId ?? "")
            .toLowerCase()
            .includes(incomeSearch.toLowerCase()) ||
          p.method.toLowerCase().includes(incomeSearch.toLowerCase())
      ),
    [clientPayments, incomeSearch]
  );

  const filteredExpenses = useMemo(
    () =>
      photographerPayments.filter(
        (p) =>
          expenseSearch === "" ||
          p.photographerName
            .toLowerCase()
            .includes(expenseSearch.toLowerCase()) ||
          p.eventTitle.toLowerCase().includes(expenseSearch.toLowerCase())
      ),
    [photographerPayments, expenseSearch]
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-profit/20 bg-green-profit-subtle">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-profit/70">
                Total Income
              </CardTitle>
              <div className="w-7 h-7 rounded-md bg-green-profit-subtle border border-green-profit/30 flex items-center justify-center">
                <ArrowDownToLine
                  className="w-3.5 h-3.5 text-green-profit"
                  strokeWidth={1.75}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-2xl text-green-profit leading-none">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-[11px] font-sans text-text-muted mt-1.5">
              {clientPayments.length} client payments
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-expense/20 bg-red-expense-subtle">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-expense/70">
                Total Expenses
              </CardTitle>
              <div className="w-7 h-7 rounded-md bg-red-expense-subtle border border-red-expense/30 flex items-center justify-center">
                <ArrowUpFromLine
                  className="w-3.5 h-3.5 text-red-expense"
                  strokeWidth={1.75}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-2xl text-red-expense leading-none">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-[11px] font-sans text-text-muted mt-1.5">
              {photographerPayments.length} photographer payouts
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber/20 bg-amber-subtle ring-1 ring-amber/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-amber/70">Net Profit</CardTitle>
              <div className="w-7 h-7 rounded-md bg-amber-subtle border border-amber/30 flex items-center justify-center">
                <TrendingUp
                  className="w-3.5 h-3.5 text-amber"
                  strokeWidth={1.75}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-2xl text-amber leading-none">
              {formatCurrency(net)}
            </p>
            <p className="text-[11px] font-sans text-text-muted mt-1.5">
              {margin}% profit margin
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-text-secondary">
                Avg. Transaction
              </CardTitle>
              <div className="w-7 h-7 rounded-md bg-surface-raised border border-border flex items-center justify-center">
                <Receipt
                  className="w-3.5 h-3.5 text-text-secondary"
                  strokeWidth={1.75}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-2xl text-text-primary leading-none">
              {formatCurrency(avgIncome)}
            </p>
            <p className="text-[11px] font-sans text-text-muted mt-1.5">
              Per client payment
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="income">
        <TabsList>
          <TabsTrigger value="income">
            <ArrowDownToLine className="w-4 h-4" />
            Client Payments
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <ArrowUpFromLine className="w-4 h-4" />
            Photographer Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <Card className="border-border">
            <CardHeader className="pb-4 border-b border-border-subtle">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle>Incoming Payments</CardTitle>
                  <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                    All client payments received
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                    <Input
                      placeholder="Search payments…"
                      value={incomeSearch}
                      onChange={(e) => setIncomeSearch(e.target.value)}
                      className="pl-9 w-56 h-9"
                    />
                  </div>
                  <RecordClientPaymentDialog invoices={openInvoices} />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead className="text-right">Amount Paid</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="w-10 pr-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncome.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-12 text-center text-sm text-text-muted"
                      >
                        {clientPayments.length === 0
                          ? "No payments recorded yet."
                          : "No payments match your search."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredIncome.map((payment) => (
                      <TableRow key={payment.id} className="group">
                        <TableCell className="pl-6 text-text-secondary whitespace-nowrap">
                          {formatDate(payment.date)}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-text-primary whitespace-nowrap">
                            {payment.client}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-amber font-mono text-xs whitespace-nowrap">
                            {payment.invoiceId
                              ? payment.invoiceId.slice(0, 12)
                              : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium text-green-profit whitespace-nowrap">
                            +{formatCurrency(payment.amount)}
                          </span>
                        </TableCell>
                        <TableCell>{methodBadge(payment.method)}</TableCell>
                        <TableCell>
                          <span className="text-xs font-mono text-text-muted">
                            {payment.reference}
                          </span>
                        </TableCell>
                        <TableCell className="pr-4">
                          <button className="w-7 h-7 rounded-md text-text-muted hover:text-amber hover:bg-amber-subtle transition-all opacity-50 group-hover:opacity-100 flex items-center justify-center">
                            <ArrowUpRight
                              className="w-3.5 h-3.5"
                              strokeWidth={2}
                            />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card className="border-border">
            <CardHeader className="pb-4 border-b border-border-subtle">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle>Outgoing Payments</CardTitle>
                  <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                    Payouts to photographers for completed work
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                    <Input
                      placeholder="Search payouts…"
                      value={expenseSearch}
                      onChange={(e) => setExpenseSearch(e.target.value)}
                      className="pl-9 w-56 h-9"
                    />
                  </div>
                  <PayPhotographerDialog photographers={photographers} />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Date</TableHead>
                    <TableHead>Photographer</TableHead>
                    <TableHead>Associated Event</TableHead>
                    <TableHead className="text-right">Amount Paid</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="w-10 pr-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-sm text-text-muted"
                      >
                        {photographerPayments.length === 0
                          ? "No payouts recorded yet."
                          : "No payouts match your search."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((payment) => (
                      <TableRow key={payment.id} className="group">
                        <TableCell className="pl-6 text-text-secondary whitespace-nowrap">
                          {formatDate(payment.date)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber/20 border border-amber/30 flex items-center justify-center shrink-0">
                              <span className="text-[9px] font-semibold font-sans text-amber">
                                {getInitials(payment.photographerName)}
                              </span>
                            </div>
                            <span className="font-medium text-text-primary whitespace-nowrap">
                              {payment.photographerName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-text-primary whitespace-nowrap">
                              {payment.eventTitle}
                            </span>
                            {payment.eventId && (
                              <span className="text-[10px] font-mono text-text-muted">
                                {payment.eventId.slice(0, 12)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium text-red-expense whitespace-nowrap">
                            −{formatCurrency(payment.amount)}
                          </span>
                        </TableCell>
                        <TableCell>{methodBadge(payment.method)}</TableCell>
                        <TableCell className="pr-4">
                          <button className="w-7 h-7 rounded-md text-text-muted hover:text-amber hover:bg-amber-subtle transition-all opacity-50 group-hover:opacity-100 flex items-center justify-center">
                            <ArrowUpRight
                              className="w-3.5 h-3.5"
                              strokeWidth={2}
                            />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
