import Link from "next/link";
import {
  TrendingUp,
  CheckCircle2,
  FileSignature,
  DollarSign,
  Receipt,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
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
import {
  getDashboardStatsForPeriod,
  getRecentActivityForPeriod,
  getUpcomingEventsForPeriod,
} from "@/lib/data";
import { formatBDT } from "@/lib/currency";
import { formatDateTime, formatDateShort } from "@/lib/constants";
import { DashboardPeriodPicker } from "./DashboardPeriodPicker";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const sp = await searchParams;
  const today = new Date();
  const yearParam = sp.year ? parseInt(sp.year, 10) : NaN;
  const monthParam = sp.month ? parseInt(sp.month, 10) : NaN;
  const year =
    Number.isFinite(yearParam) && yearParam >= 2000 && yearParam <= 2100
      ? yearParam
      : today.getFullYear();
  const month =
    Number.isFinite(monthParam) && monthParam >= 0 && monthParam <= 11
      ? monthParam
      : today.getMonth();

  const [stats, recentActivity, upcomingEvents] = await Promise.all([
    getDashboardStatsForPeriod(year, month),
    getRecentActivityForPeriod(year, month, 7),
    getUpcomingEventsForPeriod(year, month),
  ]);

  const periodLabel = `${MONTH_NAMES[month]} ${year}`;
  const isCurrentPeriod =
    year === today.getFullYear() && month === today.getMonth();

  const formatPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
  const formatDelta = (n: number) => `${n >= 0 ? "+" : ""}${n}`;

  const statCards = [
    {
      title: "Completed Events",
      value: stats.completedEvents.value.toString(),
      sub: `${stats.completedEvents.total} total in studio`,
      change: formatPct(stats.completedEvents.change),
      trend: stats.completedEvents.change >= 0 ? "up" : "down",
      icon: CheckCircle2,
      color: "text-green-profit",
      bgColor: "bg-green-profit-subtle",
      borderColor: "border-green-profit/20",
      iconColor: "text-green-profit",
    },
    {
      title: "New Contracts",
      value: stats.newContracts.value.toString(),
      sub: `in ${MONTH_NAMES[month]}`,
      change: formatDelta(stats.newContracts.change),
      trend: stats.newContracts.change >= 0 ? "up" : "down",
      icon: FileSignature,
      color: "text-amber",
      bgColor: "bg-amber-subtle",
      borderColor: "border-amber/20",
      iconColor: "text-amber",
    },
    {
      title: "Total Income",
      value: formatBDT(stats.totalIncome.value),
      sub: "vs prior month",
      change: formatPct(stats.totalIncome.change),
      trend: stats.totalIncome.change >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "text-green-profit",
      bgColor: "bg-green-profit-subtle",
      borderColor: "border-green-profit/20",
      iconColor: "text-green-profit",
    },
    {
      title: "Total Expenses",
      value: formatBDT(stats.totalExpenses.value),
      sub: "vs prior month",
      change: formatPct(stats.totalExpenses.change),
      trend: stats.totalExpenses.change <= 0 ? "up" : "down",
      icon: Receipt,
      color: "text-red-expense",
      bgColor: "bg-red-expense-subtle",
      borderColor: "border-red-expense/20",
      iconColor: "text-red-expense",
    },
    {
      title: "Net Profit",
      value: formatBDT(stats.netProfit.value),
      sub: "vs prior month",
      change: formatPct(stats.netProfit.change),
      trend: stats.netProfit.change >= 0 ? "up" : "down",
      icon: BarChart3,
      color: "text-green-profit",
      bgColor: "bg-green-profit-subtle",
      borderColor: "border-green-profit/20",
      iconColor: "text-green-profit",
      featured: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" subtitle={periodLabel} />

      <div className="flex-1 p-6 space-y-6">
        <div className="opacity-0 animate-fade-in">
          <div className="flex items-start lg:items-center justify-between mb-1 gap-4 flex-col lg:flex-row">
            <div>
              <h2 className="font-serif text-2xl text-text-primary">
                {isCurrentPeriod ? "Good morning, Admin." : `Reporting · ${periodLabel}`}
              </h2>
              <p className="text-sm font-sans text-text-secondary mt-0.5">
                {isCurrentPeriod
                  ? "Here's what's happening at the studio today."
                  : "Historical data for the selected month."}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <DashboardPeriodPicker year={year} month={month} />
              <Link href="/admin/invoices/create">
                <Button>
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  Create Invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
            return (
              <Card
                key={stat.title}
                className={`opacity-0 animate-fade-in border transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${stat.bgColor} ${stat.borderColor} ${stat.featured ? "xl:col-span-1 ring-1 ring-amber/20" : ""}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-text-secondary">
                      {stat.title}
                    </CardTitle>
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center ${stat.bgColor} border ${stat.borderColor}`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 ${stat.iconColor}`}
                        strokeWidth={1.75}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2">
                    <span
                      className={`font-serif text-2xl leading-none ${stat.featured ? "text-amber" : "text-text-primary"} truncate`}
                    >
                      {stat.value}
                    </span>
                    <div
                      className={`flex items-center gap-0.5 text-xs font-sans font-medium ${stat.color} shrink-0`}
                    >
                      <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-[11px] font-sans text-text-muted mt-1.5">
                    {stat.sub}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 opacity-0 animate-fade-in-delay-3">
            <Card className="border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                      Payments in {periodLabel}
                    </p>
                  </div>
                  <Link
                    href="/admin/finances"
                    className="text-xs font-sans text-amber hover:text-amber-dim transition-colors"
                  >
                    View all →
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {recentActivity.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm font-sans text-text-muted">
                      No payments recorded in {periodLabel}.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-t border-b border-border-subtle">
                          <th className="text-left text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest px-6 py-3">
                            Activity
                          </th>
                          <th className="text-left text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest px-4 py-3 hidden md:table-cell">
                            Reference
                          </th>
                          <th className="text-left text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest px-4 py-3">
                            Amount
                          </th>
                          <th className="text-left text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest px-4 py-3 hidden sm:table-cell">
                            Date
                          </th>
                          <th className="text-left text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest px-4 py-3">
                            Type
                          </th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentActivity.map((item) => {
                          const Icon = item.isIncome ? DollarSign : Receipt;
                          return (
                            <tr
                              key={item.id}
                              className="border-b border-border-subtle last:border-0 hover:bg-surface-hover/50 transition-colors group"
                            >
                              <td className="px-6 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-md bg-surface-raised border border-border flex items-center justify-center shrink-0">
                                    <Icon
                                      className="w-3.5 h-3.5 text-text-muted"
                                      strokeWidth={1.75}
                                    />
                                  </div>
                                  <span className="text-sm font-sans text-text-primary whitespace-nowrap">
                                    {item.description}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 hidden md:table-cell">
                                <span className="text-sm font-sans text-text-secondary truncate max-w-[180px] block">
                                  {item.reference}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <span
                                  className={`text-sm font-sans font-medium whitespace-nowrap ${item.isIncome ? "text-green-profit" : "text-red-expense"}`}
                                >
                                  {item.isIncome ? "+" : "−"}
                                  {formatBDT(item.amount)}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 hidden sm:table-cell">
                                <span className="text-xs font-sans text-text-muted whitespace-nowrap">
                                  {formatDateTime(item.date)}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <Badge
                                  variant={
                                    item.isIncome ? "success" : "secondary"
                                  }
                                >
                                  {item.isIncome ? "Income" : "Expense"}
                                </Badge>
                              </td>
                              <td className="pr-4 py-3.5">
                                {item.invoiceId ? (
                                  <Link
                                    href={`/admin/invoices/${item.invoiceId}`}
                                    className="flex items-center justify-center w-7 h-7 rounded-md text-text-muted hover:text-amber hover:bg-amber-subtle transition-all opacity-50 group-hover:opacity-100"
                                  >
                                    <ArrowUpRight
                                      className="w-3.5 h-3.5"
                                      strokeWidth={2}
                                    />
                                  </Link>
                                ) : (
                                  <span className="block w-7 h-7" />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-1 space-y-4 opacity-0 animate-fade-in-delay-4">
            <Card className="border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Events</CardTitle>
                    <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                      In {periodLabel}
                    </p>
                  </div>
                  <Link
                    href="/admin/events"
                    className="text-xs font-sans text-amber hover:text-amber-dim transition-colors"
                  >
                    View all →
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0 pb-2">
                {upcomingEvents.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <p className="text-sm font-sans text-text-muted">
                      No pending events in this period.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {upcomingEvents.map((event) => {
                      const { month, day } = formatDateShort(event.date);
                      return (
                        <div
                          key={event.id}
                          className="flex items-center gap-3 px-6 py-3 hover:bg-surface-hover/50 transition-colors group cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-md bg-surface-raised border border-border flex flex-col items-center justify-center shrink-0">
                            <span className="text-[9px] font-sans text-text-muted uppercase leading-none">
                              {month}
                            </span>
                            <span className="text-sm font-serif text-text-primary leading-tight">
                              {day}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-sans font-medium text-text-primary truncate group-hover:text-amber transition-colors">
                              {event.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Badge
                                variant={
                                  event.photographer
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="text-[9px] px-1.5 py-0"
                              >
                                {event.eventType ?? "Event"}
                              </Badge>
                              <span className="text-[10px] font-sans text-text-muted truncate">
                                {event.photographer?.name ?? "Unassigned"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-amber/20 bg-amber-subtle">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-amber/20 border border-amber/30 flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp
                      className="w-4 h-4 text-amber"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-serif text-amber leading-tight">
                      {periodLabel} Performance
                    </p>
                    <p className="text-xs font-sans text-text-secondary mt-1 leading-relaxed">
                      {stats.totalIncome.value > 0 ? (
                        <>
                          Net profit was{" "}
                          <span className="text-amber font-medium">
                            {formatBDT(stats.netProfit.value)}
                          </span>{" "}
                          on {formatBDT(stats.totalIncome.value)} of revenue.
                        </>
                      ) : (
                        <>No revenue recorded in this period yet.</>
                      )}
                    </p>
                    <Link
                      href="/admin/finances"
                      className="mt-3 inline-block text-xs font-sans text-amber hover:text-amber-dim transition-colors font-medium"
                    >
                      View full report →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
