import { redirect } from "next/navigation";
import {
  Wallet,
  TrendingUp,
  Clock,
  Calendar,
  ArrowDownToLine,
  Banknote,
  CreditCard,
  FileText,
  CalendarDays,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/auth";
import {
  getAllPhotographers,
  getPhotographerEarningsDetail,
} from "@/lib/data";
import { formatBDT, formatBDTWithDecimals } from "@/lib/currency";
import { formatDate } from "@/lib/constants";
import { cn } from "@/lib/utils";

const methodIcon = (method: string) => {
  if (method === "Bank Transfer") return Banknote;
  if (method === "Credit Card") return CreditCard;
  if (method === "Check") return FileText;
  return Wallet;
};

export default async function PhotographerEarningsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  let photographerId: string;
  let photographerName: string;
  let isPreviewMode = false;

  if (session.user.role === "PHOTOGRAPHER") {
    photographerId = session.user.id;
    photographerName = session.user.name ?? "Photographer";
  } else {
    const photographers = await getAllPhotographers();
    if (photographers.length === 0) redirect("/admin");
    photographerId = photographers[0].id;
    photographerName = photographers[0].name;
    isPreviewMode = true;
  }

  const earnings = await getPhotographerEarningsDetail(photographerId);

  const stats = [
    {
      label: "This Month",
      value: formatBDT(earnings.thisMonth.total),
      sub: `${earnings.thisMonth.count} payout${earnings.thisMonth.count === 1 ? "" : "s"}`,
      icon: Wallet,
      bg: "bg-amber-subtle",
      border: "border-amber/20",
      textClass: "text-amber",
      featured: true,
    },
    {
      label: "Year to Date",
      value: formatBDT(earnings.yearToDate.total),
      sub: `${earnings.yearToDate.count} payout${earnings.yearToDate.count === 1 ? "" : "s"}`,
      icon: TrendingUp,
      bg: "bg-green-profit-subtle",
      border: "border-green-profit/20",
      textClass: "text-green-profit",
    },
    {
      label: "All Time",
      value: formatBDT(earnings.allTime.total),
      sub: `${earnings.allTime.count} payout${earnings.allTime.count === 1 ? "" : "s"}`,
      icon: ArrowDownToLine,
      bg: "bg-surface-raised",
      border: "border-border",
      textClass: "text-text-primary",
    },
    {
      label: "Pending Payouts",
      value: formatBDT(earnings.pending.total),
      sub: `${earnings.pending.count} event${earnings.pending.count === 1 ? "" : "s"} awaiting`,
      icon: Clock,
      bg: "bg-surface-raised",
      border: "border-border",
      textClass: "text-text-primary",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Earnings" subtitle="Your payout history and pending balance" />

      <div className="flex-1 p-6 space-y-6">
        {isPreviewMode && (
          <div className="opacity-0 animate-fade-in">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-subtle border border-amber/30">
              <Sparkles
                className="w-3.5 h-3.5 text-amber shrink-0"
                strokeWidth={2}
              />
              <p className="text-xs font-sans text-amber">
                Preview mode — viewing{" "}
                <span className="font-medium">{photographerName}</span>&apos;s
                earnings.
              </p>
            </div>
          </div>
        )}

        <div className="opacity-0 animate-fade-in">
          <h2 className="font-serif text-2xl text-text-primary">
            Earnings Summary
          </h2>
          <p className="text-sm font-sans text-text-secondary mt-0.5">
            Track every payout from ShutterDesk in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className={cn(
                  "opacity-0 animate-fade-in border transition-all duration-200",
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
                        className={cn("w-3.5 h-3.5", stat.textClass)}
                        strokeWidth={1.75}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <span
                    className={cn(
                      "font-serif text-2xl leading-none block truncate",
                      stat.textClass
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

        {earnings.pending.events.length > 0 && (
          <Card className="border-amber/20 bg-amber-subtle/30 opacity-0 animate-fade-in-delay-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber" strokeWidth={1.75} />
                  <CardTitle className="text-amber">
                    Pending Payouts
                  </CardTitle>
                </div>
                <span className="text-xs font-sans text-text-muted">
                  Suggested 50% of invoice value
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Event</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right pr-6">
                      Suggested Payout
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.pending.events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-surface-raised border border-border flex items-center justify-center shrink-0">
                            <Calendar
                              className="w-3.5 h-3.5 text-amber"
                              strokeWidth={1.75}
                            />
                          </div>
                          <span className="font-medium whitespace-nowrap">
                            {event.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-text-secondary text-xs whitespace-nowrap">
                        {event.clientName}
                      </TableCell>
                      <TableCell className="text-text-muted text-xs whitespace-nowrap">
                        {formatDate(event.date)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {event.eventType ?? "Event"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6 font-medium text-amber whitespace-nowrap">
                        {formatBDTWithDecimals(event.suggestedPayout)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Card className="border-border opacity-0 animate-fade-in-delay-3">
          <CardHeader className="pb-4">
            <div>
              <CardTitle>Payout History</CardTitle>
              <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                Last {earnings.payouts.length} payment
                {earnings.payouts.length === 1 ? "" : "s"} received
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {earnings.payouts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-10 h-10 rounded-md bg-surface-raised border border-border flex items-center justify-center mx-auto mb-3">
                  <CalendarDays
                    className="w-5 h-5 text-text-muted"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-sm font-sans text-text-secondary">
                  No payouts yet.
                </p>
                <p className="text-xs font-sans text-text-muted mt-1">
                  Payments from completed events will appear here.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Date</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right pr-6">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.payouts.map((payout) => {
                    const Icon = methodIcon(payout.method);
                    return (
                      <TableRow key={payout.id} className="group">
                        <TableCell className="pl-6 text-text-secondary whitespace-nowrap">
                          {formatDate(payout.date)}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-text-primary whitespace-nowrap">
                            {payout.eventTitle}
                          </span>
                        </TableCell>
                        <TableCell className="text-text-secondary text-xs whitespace-nowrap">
                          {payout.clientName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px]">
                            {payout.eventType ?? "Event"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="gap-1.5 font-medium"
                          >
                            <Icon
                              className="w-2.5 h-2.5"
                              strokeWidth={2}
                            />
                            {payout.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <span className="font-medium text-green-profit whitespace-nowrap">
                            +{formatBDTWithDecimals(payout.amount)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
