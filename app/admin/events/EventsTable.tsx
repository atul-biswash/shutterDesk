"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  ArrowUpRight,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
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
import { allEvents, photographers, type EventStatus } from "@/lib/mockData";
import { formatBDT as formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

const statusBadge = (status: EventStatus) => {
  if (status === "Completed")
    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={2.5} />
        Completed
      </Badge>
    );
  if (status === "Pending")
    return (
      <Badge variant="pending" className="gap-1">
        <Clock className="w-2.5 h-2.5" strokeWidth={2.5} />
        Pending
      </Badge>
    );
  if (status === "Canceled")
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="w-2.5 h-2.5" strokeWidth={2.5} />
        Canceled
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1">
      <Loader2 className="w-2.5 h-2.5" strokeWidth={2.5} />
      In Progress
    </Badge>
  );
};

const statusOptions: ("all" | EventStatus)[] = [
  "all",
  "Pending",
  "Completed",
  "Canceled",
];

export function EventsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [photographerFilter, setPhotographerFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | EventStatus>("all");

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesSearch =
        searchQuery === "" ||
        event.photographer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.client.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPhotographer =
        photographerFilter === "all" ||
        event.photographer === photographerFilter;

      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;

      return matchesSearch && matchesPhotographer && matchesStatus;
    });
  }, [searchQuery, photographerFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = filteredEvents.length;
    const completed = filteredEvents.filter((e) => e.status === "Completed").length;
    const pending = filteredEvents.filter((e) => e.status === "Pending").length;
    const canceled = filteredEvents.filter((e) => e.status === "Canceled").length;
    return { total, completed, pending, canceled };
  }, [filteredEvents]);

  const clearFilters = () => {
    setSearchQuery("");
    setPhotographerFilter("all");
    setStatusFilter("all");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    photographerFilter !== "all" ||
    statusFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-text-muted">
              Total
            </p>
            <p className="font-serif text-2xl text-text-primary mt-1 leading-none">
              {stats.total}
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber/20 bg-amber-subtle/40">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-amber/70">
              Pending
            </p>
            <p className="font-serif text-2xl text-amber mt-1 leading-none">
              {stats.pending}
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-profit/20 bg-green-profit-subtle">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-green-profit/70">
              Completed
            </p>
            <p className="font-serif text-2xl text-green-profit mt-1 leading-none">
              {stats.completed}
            </p>
          </CardContent>
        </Card>
        <Card className="border-red-expense/20 bg-red-expense-subtle">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-red-expense/70">
              Canceled
            </p>
            <p className="font-serif text-2xl text-red-expense mt-1 leading-none">
              {stats.canceled}
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
                placeholder="Search by photographer, event, or client…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={photographerFilter}
                onValueChange={setPhotographerFilter}
              >
                <SelectTrigger className="w-[180px] h-9 text-xs">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3 h-3 text-text-muted" strokeWidth={2} />
                    <SelectValue placeholder="All photographers" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Photographers</SelectItem>
                  {photographers.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
              >
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "all" ? "All Statuses" : s}
                    </SelectItem>
                  ))}
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
                {filteredEvents.length}
              </span>
              <span>of</span>
              <span className="text-text-secondary font-medium">
                {allEvents.length}
              </span>
              <span>events</span>
            </div>
          )}
        </CardContent>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Photographer</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10 pr-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-10 h-10 rounded-md bg-surface-raised border border-border flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-text-muted" strokeWidth={1.5} />
                      </div>
                      <p className="text-sm font-sans text-text-secondary">
                        No events match your filters
                      </p>
                      <button
                        onClick={clearFilters}
                        className="text-xs font-sans text-amber hover:text-amber-dim transition-colors"
                      >
                        Clear filters
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => {
                  const photographer = photographers.find(
                    (p) => p.name === event.photographer
                  );
                  return (
                    <TableRow key={event.id} className="group">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0">
                            <Calendar
                              className="w-3.5 h-3.5 text-amber"
                              strokeWidth={1.75}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium whitespace-nowrap">
                              {event.name}
                            </p>
                            <p className="text-[11px] font-sans text-text-muted mt-0.5">
                              {event.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-text-secondary whitespace-nowrap">
                        {event.date}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber/20 border border-amber/30 flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-semibold font-sans text-amber">
                              {photographer?.initials || "??"}
                            </span>
                          </div>
                          <span className="text-text-secondary whitespace-nowrap">
                            {event.photographer}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-text-secondary whitespace-nowrap max-w-[180px] truncate">
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
                      <TableCell>{statusBadge(event.status)}</TableCell>
                      <TableCell className="pr-4">
                        <button className="w-7 h-7 rounded-md text-text-muted hover:text-amber hover:bg-amber-subtle transition-all opacity-50 group-hover:opacity-100 flex items-center justify-center">
                          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
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
