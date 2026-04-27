"use client";

import { Clock, MapPin, User, ArrowUpRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateShort, formatDateLong } from "@/lib/constants";
import type { Event } from "@prisma/client";

export function PhotographerEventsGrid({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface-raised border border-border flex items-center justify-center mx-auto mb-3">
            <Calendar
              className="w-5 h-5 text-text-muted"
              strokeWidth={1.5}
            />
          </div>
          <p className="font-serif text-lg text-text-primary">
            No upcoming events
          </p>
          <p className="text-sm font-sans text-text-secondary mt-1">
            Your schedule is clear. New assignments will show up here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {events.map((event, i) => {
        const { month, day } = formatDateShort(event.date);
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
                <p className="text-[10px] font-sans uppercase tracking-widest text-text-muted truncate">
                  {formatDateLong(event.date)}
                </p>
                <p className="font-serif text-lg text-text-primary leading-tight mt-0.5 truncate group-hover:text-amber transition-colors">
                  {event.title}
                </p>
                <p className="text-xs font-sans text-text-secondary mt-0.5 truncate">
                  Lead Photographer
                </p>
              </div>
            </div>

            <CardContent className="p-4 space-y-2.5">
              {event.time && (
                <div className="flex items-start gap-2">
                  <Clock
                    className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5"
                    strokeWidth={1.75}
                  />
                  <span className="text-xs font-sans text-text-secondary">
                    {event.time}
                  </span>
                </div>
              )}
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
                  {event.clientName}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border-subtle">
                <div className="flex items-center gap-1.5">
                  <Badge variant="default" className="text-[9px] px-1.5 py-0">
                    {event.eventType ?? "Event"}
                  </Badge>
                  <Badge variant="success" className="text-[9px] px-1.5 py-0">
                    Confirmed
                  </Badge>
                </div>
                <button className="text-xs font-sans text-text-muted hover:text-amber transition-colors flex items-center gap-1">
                  Details
                  <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
