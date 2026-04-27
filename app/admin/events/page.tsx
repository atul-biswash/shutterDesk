import { Plus, Download } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { EventsTable } from "./EventsTable";
import { getAllEvents, getAllPhotographers } from "@/lib/data";

export default async function EventsPage() {
  const [events, photographers] = await Promise.all([
    getAllEvents(),
    getAllPhotographers(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Events" subtitle="All events across the agency" />

      <div className="flex-1 p-6 space-y-5">
        <div className="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row opacity-0 animate-fade-in">
          <div>
            <h2 className="font-serif text-2xl text-text-primary">
              Event Tracking
            </h2>
            <p className="text-sm font-sans text-text-secondary mt-0.5">
              Filter, search, and manage every event in the studio.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" strokeWidth={2} />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              New Event
            </Button>
          </div>
        </div>

        <div className="opacity-0 animate-fade-in-delay-1">
          <EventsTable events={events} photographers={photographers} />
        </div>
      </div>
    </div>
  );
}
