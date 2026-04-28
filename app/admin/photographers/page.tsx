import Link from "next/link";
import { Camera, Mail, Wallet, ArrowUpRight, UserPlus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPhotographerRoster } from "@/lib/data";
import { formatBDT } from "@/lib/currency";
import { getInitials, formatDate } from "@/lib/constants";

export default async function PhotographersPage() {
  const photographers = await getPhotographerRoster();

  const stats = {
    total: photographers.length,
    active: photographers.filter((p) => p.upcomingCount > 0).length,
    totalShoots: photographers.reduce((s, p) => s + p.totalEvents, 0),
    totalPaid: photographers.reduce((s, p) => s + p.totalEarned, 0),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Photographers"
        subtitle="Roster, workload, and lifetime earnings"
      />

      <div className="flex-1 p-6 space-y-5">
        <div className="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row opacity-0 animate-fade-in">
          <div>
            <h2 className="font-serif text-2xl text-text-primary">
              Photography Team
            </h2>
            <p className="text-sm font-sans text-text-secondary mt-0.5">
              Everyone shooting under the ShutterDesk banner.
            </p>
          </div>
          <Link href="/admin/users">
            <Button size="sm">
              <UserPlus className="w-4 h-4" strokeWidth={2.5} />
              Manage Users
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 opacity-0 animate-fade-in-delay-1">
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-[10px] font-sans uppercase tracking-widest text-text-muted">
                Total Photographers
              </p>
              <p className="font-serif text-2xl text-text-primary mt-1 leading-none">
                {stats.total}
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-profit/20 bg-green-profit-subtle">
            <CardContent className="p-4">
              <p className="text-[10px] font-sans uppercase tracking-widest text-green-profit/70">
                Active This Month
              </p>
              <p className="font-serif text-2xl text-green-profit mt-1 leading-none">
                {stats.active}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-[10px] font-sans uppercase tracking-widest text-text-muted">
                Total Shoots
              </p>
              <p className="font-serif text-2xl text-text-primary mt-1 leading-none">
                {stats.totalShoots}
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber/20 bg-amber-subtle/40">
            <CardContent className="p-4">
              <p className="text-[10px] font-sans uppercase tracking-widest text-amber/70">
                Total Paid Out
              </p>
              <p className="font-serif text-2xl text-amber mt-1 leading-none truncate">
                {formatBDT(stats.totalPaid)}
              </p>
            </CardContent>
          </Card>
        </div>

        {photographers.length === 0 ? (
          <Card className="border-border opacity-0 animate-fade-in-delay-2">
            <CardContent className="p-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-surface-raised border border-border flex items-center justify-center mx-auto">
                <Camera
                  className="w-5 h-5 text-text-muted"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <p className="font-serif text-xl text-text-primary">
                  No photographers yet
                </p>
                <p className="text-sm font-sans text-text-secondary mt-1">
                  Add your first photographer from the Users page.
                </p>
              </div>
              <Link href="/admin/users">
                <Button size="sm">
                  <UserPlus className="w-4 h-4" strokeWidth={2} />
                  Add Photographer
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 opacity-0 animate-fade-in-delay-2">
              {photographers.map((p, i) => (
                <Card
                  key={p.id}
                  className="border-border overflow-hidden group hover:border-amber/30 hover:shadow-card-hover transition-all duration-200 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-amber/20 border border-amber/30 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold font-sans text-amber">
                          {getInitials(p.name)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-lg text-text-primary leading-tight truncate group-hover:text-amber transition-colors">
                          {p.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-text-muted">
                          <Mail
                            className="w-3 h-3 shrink-0"
                            strokeWidth={1.75}
                          />
                          <span className="text-[11px] font-sans truncate">
                            {p.email}
                          </span>
                        </div>
                      </div>
                      {p.upcomingCount > 0 && (
                        <Badge variant="success" className="shrink-0">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border-subtle">
                      <div>
                        <p className="text-[9px] font-sans uppercase tracking-wider text-text-muted">
                          Total
                        </p>
                        <p className="font-serif text-base text-text-primary mt-0.5 leading-none">
                          {p.totalEvents}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-sans uppercase tracking-wider text-text-muted">
                          Done
                        </p>
                        <p className="font-serif text-base text-green-profit mt-0.5 leading-none">
                          {p.completedCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-sans uppercase tracking-wider text-text-muted">
                          Upcoming
                        </p>
                        <p className="font-serif text-base text-amber mt-0.5 leading-none">
                          {p.upcomingCount}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border-subtle">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-text-muted">
                          <Wallet
                            className="w-3 h-3 shrink-0"
                            strokeWidth={1.75}
                          />
                          <span className="text-[10px] font-sans uppercase tracking-wider">
                            Lifetime Earnings
                          </span>
                        </div>
                        <span className="font-serif text-base text-amber leading-none">
                          {formatBDT(p.totalEarned)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border opacity-0 animate-fade-in-delay-3">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Photographer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Total Shoots</TableHead>
                      <TableHead className="text-center">Completed</TableHead>
                      <TableHead className="text-center">Upcoming</TableHead>
                      <TableHead className="text-right">Total Earned</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-10 pr-4"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {photographers.map((p) => (
                      <TableRow key={p.id} className="group">
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-amber/20 border border-amber/30 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-semibold font-sans text-amber">
                                {getInitials(p.name)}
                              </span>
                            </div>
                            <span className="font-medium whitespace-nowrap">
                              {p.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-text-secondary text-xs whitespace-nowrap">
                          {p.email}
                        </TableCell>
                        <TableCell className="text-center text-text-secondary">
                          {p.totalEvents}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-green-profit font-medium">
                            {p.completedCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {p.upcomingCount > 0 ? (
                            <span className="text-amber font-medium">
                              {p.upcomingCount}
                            </span>
                          ) : (
                            <span className="text-text-muted">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium text-text-primary whitespace-nowrap">
                          {formatBDT(p.totalEarned)}
                        </TableCell>
                        <TableCell className="text-xs text-text-muted whitespace-nowrap">
                          {formatDate(p.createdAt)}
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
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
