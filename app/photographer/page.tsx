"use client";

import Link from "next/link";
import {
  Wallet,
  Clock,
  Calendar,
  CheckCircle2,
  TrendingUp,
  MapPin,
  User,
  Camera,
  ArrowUpRight,
  CalendarDays,
  History,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  photographerEarnings,
  photographerUpcoming,
  photographerPast,
} from "@/lib/mockData";
import { formatBDT as formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Earnings This Month",
    value: formatCurrency(photographerEarnings.thisMonth),
    sub: "+18% vs last month",
    icon: Wallet,
    accent: "text-amber",
    bg: "bg-amber-subtle",
    border: "border-amber/20",
    featured: true,
  },
  {
    label: "Year to Date",
    value: formatCurrency(photographerEarnings.yearToDate),
    sub: `${photographerEarnings.totalEvents} total events`,
    icon: TrendingUp,
    accent: "text-green-profit",
    bg: "bg-green-profit-subtle",
    border: "border-green-profit/20",
  },
  {
    label: "Pending Payouts",
    value: formatCurrency(photographerEarnings.pendingPayouts),
    sub: "Awaiting client payment",
    icon: Clock,
    accent: "text-text-secondary",
    bg: "bg-surface-raised",
    border: "border-border",
  },
  {
    label: "Events This Month",
    value: photographerEarnings.eventsThisMonth.toString(),
    sub: `${photographerEarnings.completionRate}% completion rate`,
    icon: Calendar,
    accent: "text-text-secondary",
    bg: "bg-surface-raised",
    border: "border-border",
  },
];

const statusBadge = (status: string) => {
  if (status === "Confirmed")
    return <Badge variant="success">Confirmed</Badge>;
  if (status === "Brief Pending")
    return <Badge variant="pending">Brief Pending</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
};

const paymentBadge = (status: string) => {
  if (status === "paid") return <Badge variant="success">Paid</Badge>;
  if (status === "pending") return <Badge variant="pending">Processing</Badge>;
  if (status === "awaiting") return <Badge variant="secondary">Awaiting Client</Badge>;
  return <Badge variant="destructive">Overdue</Badge>;
};

export default function PhotographerDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="My Dashboard"
        subtitle="Sunday, April 26, 2026"
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="opacity-0 animate-fade-in">
          <div className="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
            <div>
              <h2 className="font-serif text-2xl text-text-primary">
                Welcome back, James.
              </h2>
              <p className="text-sm font-sans text-text-secondary mt-0.5">
                You have{" "}
                <span className="text-amber font-medium">
                  {photographerUpcoming.length} upcoming events
                </span>{" "}
                and{" "}
                <span className="text-green-profit font-medium">
                  {formatCurrency(photographerEarnings.pendingPayouts)}
                </span>{" "}
                in pending payouts.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans text-text-muted bg-surface-raised border border-border rounded-md px-3 py-2">
              <Camera className="w-3.5 h-3.5 text-amber" strokeWidth={1.75} />
              <span>Specialty: Weddings · Events</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className={cn(
                  "opacity-0 animate-fade-in border transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5",
                  stat.bg,
                  stat.border,
                  stat.featured && "ring-1 ring-amber/20"
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-text-secondary">
                      {stat.label}
                    </CardTitle>
                    <div
                      className={cn(
                        "w-7 h-7 rounded-md flex items-center justify-center border",
                        stat.bg,
                        stat.border
                      )}
                    >
                      <Icon
                        className={cn("w-3.5 h-3.5", stat.accent)}
                        strokeWidth={1.75}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <span
                    className={cn(
                      "font-serif text-2xl leading-none block",
                      stat.featured ? "text-amber" : "text-text-primary"
                    )}
                  >
                    {stat.value}
                  </span>
                  <p className="text-[11px] font-sans text-text-muted mt-1.5">
                    {stat.sub}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="opacity-0 animate-fade-in-delay-3">
          <Tabs defaultValue="upcoming">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <TabsList>
                <TabsTrigger value="upcoming">
                  <CalendarDays className="w-4 h-4" />
                  Upcoming Events
                  <span className="ml-1 px-1.5 py-0.5 rounded-sm bg-text-inverse/10 text-[10px] font-semibold data-[state=inactive]:bg-surface-hover">
                    {photographerUpcoming.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="past">
                  <History className="w-4 h-4" />
                  Past Events
                  <span className="ml-1 px-1.5 py-0.5 rounded-sm bg-text-inverse/10 text-[10px] font-semibold data-[state=inactive]:bg-surface-hover">
                    {photographerPast.length}
                  </span>
                </TabsTrigger>
              </TabsList>
              <p className="text-xs font-sans text-text-muted hidden sm:block">
                Showing your assigned events
              </p>
            </div>

            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {photographerUpcoming.map((event, i) => {
                  const [month, day] = event.dateLabel.split(" ");
                  return (
                    <Card
                      key={event.id}
                      className="border-border overflow-hidden group hover:border-amber/30 hover:shadow-card-hover transition-all duration-200 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex items-stretch border-b border-border-subtle">
                        <div className="w-20 bg-amber-subtle border-r border-amber/20 flex flex-col items-center justify-center py-4">
                          <span className="text-[10px] font-sans uppercase tracking-widest text-amber-deep font-semibold">
                            {month}
                          </span>
                          <span className="font-serif text-3xl text-amber leading-none mt-0.5">
                            {day}
                          </span>
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                          <p className="text-[10px] font-sans uppercase tracking-widest text-text-muted">
                            {event.dateLong}
                          </p>
                          <p className="font-serif text-lg text-text-primary leading-tight mt-0.5 truncate group-hover:text-amber transition-colors">
                            {event.title}
                          </p>
                          <p className="text-xs font-sans text-text-secondary mt-0.5 truncate">
                            {event.role}
                          </p>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-2.5">
                        <div className="flex items-start gap-2">
                          <Clock
                            className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5"
                            strokeWidth={1.75}
                          />
                          <span className="text-xs font-sans text-text-secondary">
                            {event.time}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin
                            className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5"
                            strokeWidth={1.75}
                          />
                          <span className="text-xs font-sans text-text-secondary truncate">
                            {event.location}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <User
                            className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5"
                            strokeWidth={1.75}
                          />
                          <span className="text-xs font-sans text-text-secondary truncate">
                            {event.client}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border-subtle">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="default" className="text-[9px] px-1.5 py-0">
                              {event.type}
                            </Badge>
                            {statusBadge(event.status)}
                          </div>
                          <button
                            className="text-xs font-sans text-text-muted hover:text-amber transition-colors flex items-center gap-1"
                          >
                            Details
                            <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="past">
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Completed Events</CardTitle>
                      <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                        Recent shoots and their payment status
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-sans text-text-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-profit" strokeWidth={1.75} />
                      <span>
                        {
                          photographerPast.filter(
                            (e) => e.paymentStatus === "paid"
                          ).length
                        }{" "}
                        of {photographerPast.length} paid
                      </span>
                    </div>
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
                      {photographerPast.map((event) => (
                        <TableRow key={event.id} className="group">
                          <TableCell className="pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-md bg-surface-raised border border-border flex items-center justify-center shrink-0">
                                <Camera className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.75} />
                              </div>
                              <span className="font-medium whitespace-nowrap">
                                {event.title}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-text-secondary whitespace-nowrap">
                            {event.date}
                          </TableCell>
                          <TableCell className="text-text-secondary whitespace-nowrap">
                            {event.client}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-[10px]">
                              {event.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-text-primary whitespace-nowrap">
                            {formatCurrency(event.amount)}
                          </TableCell>
                          <TableCell className="text-xs text-text-muted whitespace-nowrap">
                            {event.payoutDate}
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
            </TabsContent>
          </Tabs>
        </div>

        <Card className="border-amber/20 bg-gradient-to-br from-amber-subtle/30 to-surface opacity-0 animate-fade-in-delay-4">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-amber/20 border border-amber/30 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-amber" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-serif text-amber leading-tight">
                  You&apos;re on track for a strong May.
                </p>
                <p className="text-xs font-sans text-text-secondary mt-1 leading-relaxed">
                  With {photographerUpcoming.length} confirmed shoots and no scheduling conflicts, you&apos;re set to bring in approximately{" "}
                  <span className="text-amber font-medium">৳5,200</span> next month.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
