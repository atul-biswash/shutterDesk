import {
  Wallet,
  Clock,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Camera,
  Sparkles,
  CalendarDays,
  History,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhotographerEventsGrid } from "./PhotographerEventsGrid";
import { PhotographerPastTable } from "./PhotographerPastTable";
import {
  getAllPhotographers,
  getEventsForPhotographer,
  getPhotographerEarnings,
} from "@/lib/data";
import { formatBDT } from "@/lib/currency";
import { cn } from "@/lib/utils";

export default async function PhotographerDashboard() {
  const photographers = await getAllPhotographers();

  if (photographers.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header
          title="My Dashboard"
          subtitle="Photographer workspace"
        />
        <div className="flex-1 p-6 flex items-center justify-center">
          <Card className="max-w-md border-border">
            <CardContent className="p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-surface-raised border border-border flex items-center justify-center mx-auto">
                <Camera
                  className="w-5 h-5 text-text-muted"
                  strokeWidth={1.5}
                />
              </div>
              <p className="font-serif text-xl text-text-primary">
                No photographers yet
              </p>
              <p className="text-sm font-sans text-text-secondary leading-relaxed">
                Run <span className="font-mono text-amber">npm run db:seed</span> to populate the database with demo photographers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentPhotographer = photographers[0];

  const [{ upcoming, past }, earnings] = await Promise.all([
    getEventsForPhotographer(currentPhotographer.id),
    getPhotographerEarnings(currentPhotographer.id),
  ]);

  const stats = [
    {
      label: "Earnings This Month",
      value: formatBDT(earnings.thisMonth),
      sub: `${earnings.eventsThisMonth} events scheduled`,
      icon: Wallet,
      accent: "text-amber",
      bg: "bg-amber-subtle",
      border: "border-amber/20",
      featured: true,
    },
    {
      label: "Year to Date",
      value: formatBDT(earnings.yearToDate),
      sub: `${earnings.totalEvents} total events`,
      icon: TrendingUp,
      accent: "text-green-profit",
      bg: "bg-green-profit-subtle",
      border: "border-green-profit/20",
    },
    {
      label: "Pending Payouts",
      value: formatBDT(earnings.pendingPayouts),
      sub: "Awaiting payment",
      icon: Clock,
      accent: "text-text-secondary",
      bg: "bg-surface-raised",
      border: "border-border",
    },
    {
      label: "Events This Month",
      value: earnings.eventsThisMonth.toString(),
      sub: `${earnings.completionRate}% completion rate`,
      icon: Calendar,
      accent: "text-text-secondary",
      bg: "bg-surface-raised",
      border: "border-border",
    },
  ];

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const firstName = currentPhotographer.name.split(" ")[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="My Dashboard" subtitle={today} />

      <div className="flex-1 p-6 space-y-6">
        <div className="opacity-0 animate-fade-in">
          <div className="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
            <div>
              <h2 className="font-serif text-2xl text-text-primary">
                Welcome back, {firstName}.
              </h2>
              <p className="text-sm font-sans text-text-secondary mt-0.5">
                You have{" "}
                <span className="text-amber font-medium">
                  {upcoming.length} upcoming events
                </span>{" "}
                and{" "}
                <span className="text-green-profit font-medium">
                  {formatBDT(earnings.pendingPayouts)}
                </span>{" "}
                in pending payouts.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans text-text-muted bg-surface-raised border border-border rounded-md px-3 py-2">
              <Camera className="w-3.5 h-3.5 text-amber" strokeWidth={1.75} />
              <span>{currentPhotographer.email}</span>
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
                      "font-serif text-2xl leading-none block truncate",
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
                    {upcoming.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="past">
                  <History className="w-4 h-4" />
                  Past Events
                  <span className="ml-1 px-1.5 py-0.5 rounded-sm bg-text-inverse/10 text-[10px] font-semibold data-[state=inactive]:bg-surface-hover">
                    {past.length}
                  </span>
                </TabsTrigger>
              </TabsList>
              <p className="text-xs font-sans text-text-muted hidden sm:flex items-center gap-1.5">
                <CheckCircle2
                  className="w-3.5 h-3.5 text-green-profit"
                  strokeWidth={1.75}
                />
                {past.filter((e) => e.paymentStatus === "paid").length} of{" "}
                {past.length} payouts received
              </p>
            </div>

            <TabsContent value="upcoming">
              <PhotographerEventsGrid events={upcoming} />
            </TabsContent>

            <TabsContent value="past">
              <PhotographerPastTable events={past} />
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
                  {upcoming.length > 0
                    ? "You're booked up nicely."
                    : "Your calendar is clear."}
                </p>
                <p className="text-xs font-sans text-text-secondary mt-1 leading-relaxed">
                  {upcoming.length > 0 ? (
                    <>
                      With {upcoming.length} confirmed shoot
                      {upcoming.length === 1 ? "" : "s"} coming up, your year-to-date earnings of{" "}
                      <span className="text-amber font-medium">
                        {formatBDT(earnings.yearToDate)}
                      </span>{" "}
                      are on track to grow.
                    </>
                  ) : (
                    <>
                      No upcoming events scheduled. Check back when admin assigns new shoots.
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
