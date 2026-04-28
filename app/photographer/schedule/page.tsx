import { redirect } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { getPhotographerSchedule, getAllPhotographers } from "@/lib/data";
import { formatDateShort, formatDateLong } from "@/lib/constants";

export default async function PhotographerSchedulePage() {
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

  const events = await getPhotographerSchedule(photographerId);

  const grouped = events.reduce<Record<string, typeof events>>((acc, event) => {
    const key = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(event.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="My Schedule" subtitle="All upcoming shoots" />

      <div className="flex-1 p-6 space-y-6">
        {isPreviewMode && (
          <div className="opacity-0 animate-fade-in">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-subtle border border-amber/30">
              <CalendarDays
                className="w-3.5 h-3.5 text-amber shrink-0"
                strokeWidth={2}
              />
              <p className="text-xs font-sans text-amber">
                Preview mode — viewing{" "}
                <span className="font-medium">{photographerName}</span>&apos;s
                schedule.
              </p>
            </div>
          </div>
        )}

        <div className="opacity-0 animate-fade-in">
          <h2 className="font-serif text-2xl text-text-primary">
            Upcoming Schedule
          </h2>
          <p className="text-sm font-sans text-text-secondary mt-0.5">
            {events.length} confirmed shoot{events.length === 1 ? "" : "s"} on the calendar.
          </p>
        </div>

        {events.length === 0 ? (
          <Card className="border-border opacity-0 animate-fade-in-delay-1">
            <CardContent className="p-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-surface-raised border border-border flex items-center justify-center mx-auto">
                <Calendar
                  className="w-5 h-5 text-text-muted"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <p className="font-serif text-xl text-text-primary">
                  Your calendar is clear
                </p>
                <p className="text-sm font-sans text-text-secondary mt-1">
                  No upcoming events scheduled. Check back when admin assigns new shoots.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 opacity-0 animate-fade-in-delay-1">
            {Object.entries(grouped).map(([monthLabel, monthEvents]) => (
              <div key={monthLabel} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-lg text-text-primary">
                    {monthLabel}
                  </h3>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-text-muted bg-surface-raised border border-border-subtle px-2 py-0.5 rounded-sm">
                    {monthEvents.length} event
                    {monthEvents.length === 1 ? "" : "s"}
                  </span>
                  <div className="h-px bg-border flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {monthEvents.map((event, i) => {
                    const { month, day } = formatDateShort(event.date);
                    return (
                      <Card
                        key={event.id}
                        className="border-border overflow-hidden group hover:border-amber/30 hover:shadow-card-hover transition-all duration-200 opacity-0 animate-fade-in"
                        style={{ animationDelay: `${i * 50}ms` }}
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
                            <Badge
                              variant="default"
                              className="text-[9px] px-1.5 py-0"
                            >
                              {event.eventType ?? "Event"}
                            </Badge>
                            <button className="text-xs font-sans text-text-muted hover:text-amber transition-colors flex items-center gap-1">
                              Details
                              <ArrowUpRight
                                className="w-3 h-3"
                                strokeWidth={2}
                              />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
