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
  Clock,
  CalendarCheck,
  UserCheck,
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

const stats = [
  {
    title: "Completed Events",
    value: "142",
    change: "+12%",
    trend: "up",
    icon: CheckCircle2,
    sub: "vs last month",
    color: "text-green-profit",
    bgColor: "bg-green-profit-subtle",
    borderColor: "border-green-profit/20",
    iconColor: "text-green-profit",
  },
  {
    title: "New Contracts",
    value: "28",
    change: "+4",
    trend: "up",
    icon: FileSignature,
    sub: "this month",
    color: "text-amber",
    bgColor: "bg-amber-subtle",
    borderColor: "border-amber/20",
    iconColor: "text-amber",
  },
  {
    title: "Total Income",
    value: "৳94,320",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    sub: "vs last month",
    color: "text-green-profit",
    bgColor: "bg-green-profit-subtle",
    borderColor: "border-green-profit/20",
    iconColor: "text-green-profit",
  },
  {
    title: "Total Expenses",
    value: "৳31,480",
    change: "-3.1%",
    trend: "down",
    icon: Receipt,
    sub: "vs last month",
    color: "text-red-expense",
    bgColor: "bg-red-expense-subtle",
    borderColor: "border-red-expense/20",
    iconColor: "text-red-expense",
  },
  {
    title: "Net Profit",
    value: "৳62,840",
    change: "+14.6%",
    trend: "up",
    icon: BarChart3,
    sub: "vs last month",
    color: "text-green-profit",
    bgColor: "bg-green-profit-subtle",
    borderColor: "border-green-profit/20",
    iconColor: "text-green-profit",
    featured: true,
  },
];

const recentActivity = [
  {
    id: "ACT-001",
    invoiceId: "INV-2026-001",
    type: "payment",
    description: "Payment received",
    client: "Helena & Marcus W.",
    amount: "৳2,400",
    date: "Today, 10:32 AM",
    status: "completed",
    icon: DollarSign,
  },
  {
    id: "ACT-002",
    invoiceId: "INV-2026-002",
    type: "assignment",
    description: "Photographer assigned",
    client: "Sunrise Gala — Corporate",
    amount: "James Okafor",
    date: "Today, 9:15 AM",
    status: "confirmed",
    icon: UserCheck,
  },
  {
    id: "ACT-003",
    invoiceId: "INV-2026-003",
    type: "event",
    description: "Event completed",
    client: "The Nguyen Wedding",
    amount: "৳3,850",
    date: "Yesterday, 6:00 PM",
    status: "completed",
    icon: CalendarCheck,
  },
  {
    id: "ACT-004",
    invoiceId: "INV-2026-004",
    type: "contract",
    description: "Contract signed",
    client: "Bloom & Briar Florists",
    amount: "৳1,200",
    date: "Yesterday, 2:44 PM",
    status: "pending",
    icon: FileSignature,
  },
  {
    id: "ACT-005",
    invoiceId: "INV-2026-005",
    type: "payment",
    description: "Payment received",
    client: "Corporate Headshots — TechVive",
    amount: "৳4,100",
    date: "Apr 24, 11:20 AM",
    status: "completed",
    icon: DollarSign,
  },
  {
    id: "ACT-006",
    invoiceId: "INV-2026-006",
    type: "assignment",
    description: "Photographer assigned",
    client: "The Rosario Quinceañera",
    amount: "Priya Mehta",
    date: "Apr 23, 3:00 PM",
    status: "confirmed",
    icon: UserCheck,
  },
  {
    id: "ACT-007",
    invoiceId: "INV-2026-007",
    type: "payment",
    description: "Invoice overdue",
    client: "Lakeside Retreat — Wilson",
    amount: "৳1,750",
    date: "Apr 22, 9:00 AM",
    status: "overdue",
    icon: Clock,
  },
];

const upcomingEvents = [
  {
    name: "The Park Wedding",
    date: "May 3",
    photographer: "James Okafor",
    type: "Wedding",
  },
  {
    name: "TechVive Annual Dinner",
    date: "May 6",
    photographer: "Priya Mehta",
    type: "Corporate",
  },
  {
    name: "Chen Family Portrait",
    date: "May 9",
    photographer: "Unassigned",
    type: "Portrait",
  },
  {
    name: "Morales Engagement",
    date: "May 12",
    photographer: "Sofia Reyes",
    type: "Engagement",
  },
];

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "pending" | "destructive" | "default" }
> = {
  completed: { label: "Completed", variant: "success" },
  confirmed: { label: "Confirmed", variant: "default" },
  pending: { label: "Pending", variant: "pending" },
  overdue: { label: "Overdue", variant: "destructive" },
};

export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" subtitle="Sunday, April 26, 2026" />

      <div className="flex-1 p-6 space-y-6">
        <div className="opacity-0 animate-fade-in">
          <div className="flex items-start lg:items-center justify-between mb-1 gap-4 flex-col lg:flex-row">
            <div>
              <h2 className="font-serif text-2xl text-text-primary">
                Good morning, Admin.
              </h2>
              <p className="text-sm font-sans text-text-secondary mt-0.5">
                Here&apos;s what&apos;s happening at the studio today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 text-xs font-sans text-text-muted bg-surface-raised border border-border rounded-md px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-profit animate-pulse" />
                3 events this week
              </div>
              <Link href="/admin/invoices/create">
                <Button>
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  Create New Invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {stats.map((stat, i) => {
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
                      className={`font-serif text-2xl leading-none ${stat.featured ? "text-amber" : "text-text-primary"}`}
                    >
                      {stat.value}
                    </span>
                    <div
                      className={`flex items-center gap-0.5 text-xs font-sans font-medium ${stat.color}`}
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
                      Latest payments, events, and assignments
                    </p>
                  </div>
                  <button className="text-xs font-sans text-amber hover:text-amber-dim transition-colors">
                    View all →
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-t border-b border-border-subtle">
                        <th className="text-left text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest px-6 py-3">
                          Activity
                        </th>
                        <th className="text-left text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest px-4 py-3 hidden md:table-cell">
                          Client / Detail
                        </th>
                        <th className="text-left text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest px-4 py-3">
                          Amount
                        </th>
                        <th className="text-left text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest px-4 py-3 hidden sm:table-cell">
                          Date
                        </th>
                        <th className="text-left text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest px-4 py-3">
                          Status
                        </th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((item) => {
                        const Icon = item.icon;
                        const status = statusConfig[item.status];
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
                                {item.client}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-sm font-sans font-medium text-text-primary whitespace-nowrap">
                                {item.amount}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 hidden sm:table-cell">
                              <span className="text-xs font-sans text-text-muted whitespace-nowrap">
                                {item.date}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <Badge variant={status.variant}>{status.label}</Badge>
                            </td>
                            <td className="pr-4 py-3.5">
                              <Link
                                href={`/admin/invoices/${item.invoiceId}`}
                                className="flex items-center justify-center w-7 h-7 rounded-md text-text-muted hover:text-amber hover:bg-amber-subtle transition-all opacity-50 group-hover:opacity-100"
                                aria-label={`View invoice ${item.invoiceId}`}
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-1 space-y-4 opacity-0 animate-fade-in-delay-4">
            <Card className="border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Events</CardTitle>
                    <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                      Next 14 days
                    </p>
                  </div>
                  <button className="text-xs font-sans text-amber hover:text-amber-dim transition-colors">
                    View all →
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0 pb-2">
                <div className="space-y-1">
                  {upcomingEvents.map((event, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-surface-hover/50 transition-colors group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-md bg-surface-raised border border-border flex flex-col items-center justify-center shrink-0">
                        <span className="text-[9px] font-sans text-text-muted uppercase leading-none">
                          {event.date.split(" ")[0]}
                        </span>
                        <span className="text-sm font-serif text-text-primary leading-tight">
                          {event.date.split(" ")[1]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-sans font-medium text-text-primary truncate group-hover:text-amber transition-colors">
                          {event.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge
                            variant={
                              event.photographer === "Unassigned"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-[9px] px-1.5 py-0"
                          >
                            {event.type}
                          </Badge>
                          <span className="text-[10px] font-sans text-text-muted truncate">
                            {event.photographer}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                      Studio Performance
                    </p>
                    <p className="text-xs font-sans text-text-secondary mt-1 leading-relaxed">
                      Revenue is up{" "}
                      <span className="text-amber font-medium">14.6%</span>{" "}
                      this month. April is on track to be your best month this
                      year.
                    </p>
                    <button className="mt-3 text-xs font-sans text-amber hover:text-amber-dim transition-colors font-medium">
                      View full report →
                    </button>
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
