"use client";

import { Camera, ArrowUpRight, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBDT as formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/constants";

type PastEvent = {
  id: string;
  title: string;
  date: Date;
  clientName: string;
  eventType: string | null;
  amount: number;
  paymentStatus: string;
  payoutDate: Date | null;
};

const paymentBadge = (status: string) => {
  if (status === "paid") return <Badge variant="success">Paid</Badge>;
  if (status === "pending") return <Badge variant="pending">Processing</Badge>;
  if (status === "awaiting") return <Badge variant="secondary">Awaiting Client</Badge>;
  return <Badge variant="destructive">Overdue</Badge>;
};

export function PhotographerPastTable({ events }: { events: PastEvent[] }) {
  if (events.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface-raised border border-border flex items-center justify-center mx-auto mb-3">
            <History
              className="w-5 h-5 text-text-muted"
              strokeWidth={1.5}
            />
          </div>
          <p className="font-serif text-lg text-text-primary">
            No past events yet
          </p>
          <p className="text-sm font-sans text-text-secondary mt-1">
            Completed shoots and payment status will show up here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const paidCount = events.filter((e) => e.paymentStatus === "paid").length;

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Completed Events</CardTitle>
            <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
              Recent shoots and their payment status
            </p>
          </div>
          <span className="text-xs font-sans text-text-muted">
            {paidCount} of {events.length} paid
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Earned</TableHead>
              <TableHead>Payout Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10 pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} className="group">
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-surface-raised border border-border flex items-center justify-center shrink-0">
                      <Camera
                        className="w-3.5 h-3.5 text-text-muted"
                        strokeWidth={1.75}
                      />
                    </div>
                    <span className="font-medium whitespace-nowrap">
                      {event.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary whitespace-nowrap">
                  {formatDate(event.date)}
                </TableCell>
                <TableCell className="text-text-secondary whitespace-nowrap">
                  {event.clientName}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px]">
                    {event.eventType ?? "Event"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium text-text-primary whitespace-nowrap">
                  {formatCurrency(event.amount)}
                </TableCell>
                <TableCell className="text-xs text-text-muted whitespace-nowrap">
                  {event.payoutDate ? formatDate(event.payoutDate) : "—"}
                </TableCell>
                <TableCell>{paymentBadge(event.paymentStatus)}</TableCell>
                <TableCell className="pr-4">
                  <button className="w-7 h-7 rounded-md text-text-muted hover:text-amber hover:bg-amber-subtle transition-all opacity-50 group-hover:opacity-100 flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
