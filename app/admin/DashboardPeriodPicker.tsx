"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
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

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function DashboardPeriodPicker({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(year);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const isCurrent = year === today.getFullYear() && month === today.getMonth();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) setViewYear(year);
  }, [open, year]);

  const navigate = (newYear: number, newMonth: number) => {
    const params = new URLSearchParams();
    params.set("year", newYear.toString());
    params.set("month", newMonth.toString());
    router.push(`/admin?${params.toString()}`);
    setOpen(false);
  };

  const goToCurrent = () => {
    const t = new Date();
    navigate(t.getFullYear(), t.getMonth());
  };

  const minYear = today.getFullYear() - 5;
  const maxYear = today.getFullYear() + 1;
  const canGoBackYear = viewYear > minYear;
  const canGoForwardYear = viewYear < maxYear;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-surface-raised text-sm font-sans transition-all",
          open
            ? "border-amber/50 ring-1 ring-amber/40"
            : "border-border hover:border-amber/30"
        )}
      >
        <Calendar className="w-3.5 h-3.5 text-amber" strokeWidth={1.75} />
        <span className="font-medium text-text-primary">
          {MONTHS[month]} {year}
        </span>
        {!isCurrent && (
          <span className="text-[10px] font-sans uppercase tracking-wider text-text-muted bg-surface-hover px-1.5 py-0.5 rounded-sm">
            Historical
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 bg-surface-raised border border-border rounded-md shadow-card-hover z-30 w-72 animate-fade-in opacity-0">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-subtle">
            <button
              type="button"
              onClick={() => setViewYear(viewYear - 1)}
              disabled={!canGoBackYear}
              className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-amber hover:bg-amber-subtle transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <span className="font-serif text-base text-text-primary">
              {viewYear}
            </span>
            <button
              type="button"
              onClick={() => setViewYear(viewYear + 1)}
              disabled={!canGoForwardYear}
              className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-amber hover:bg-amber-subtle transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted"
            >
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>

          <div className="p-2 grid grid-cols-3 gap-1">
            {MONTHS_SHORT.map((m, idx) => {
              const isSelected = year === viewYear && month === idx;
              const isThisMonth =
                viewYear === today.getFullYear() && idx === today.getMonth();
              const isFuture =
                viewYear > today.getFullYear() ||
                (viewYear === today.getFullYear() && idx > today.getMonth());
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => navigate(viewYear, idx)}
                  disabled={isFuture}
                  className={cn(
                    "px-3 py-2 rounded-md text-xs font-sans transition-all relative",
                    isSelected
                      ? "bg-amber text-text-inverse font-semibold"
                      : isThisMonth
                        ? "bg-amber-subtle text-amber border border-amber/30"
                        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                    isFuture && "opacity-30 cursor-not-allowed hover:bg-transparent"
                  )}
                >
                  {m}
                  {isSelected && (
                    <Check
                      className="w-2.5 h-2.5 absolute top-1.5 right-1.5"
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {!isCurrent && (
            <div className="px-2 pb-2 pt-1 border-t border-border-subtle">
              <button
                type="button"
                onClick={goToCurrent}
                className="w-full px-3 py-2 rounded-md text-xs font-sans text-amber hover:bg-amber-subtle transition-colors"
              >
                Jump to this month
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
