"use client";

import { useState } from "react";
import { Plus, Send, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { photographers, allEvents, paymentMethods } from "@/lib/mockData";

export function PayPhotographerDialog() {
  const [open, setOpen] = useState(false);
  const [photographerId, setPhotographerId] = useState("");
  const [eventId, setEventId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const photographer = photographers.find((p) => p.id === photographerId);
  const photographerEvents = photographer
    ? allEvents.filter(
        (e) =>
          e.photographer === photographer.name && e.status === "Completed"
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    setPhotographerId("");
    setEventId("");
    setAmount("");
    setMethod("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Pay Photographer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-amber-subtle border border-amber/30 flex items-center justify-center shrink-0 mt-0.5">
                <Wallet className="w-4 h-4 text-amber" strokeWidth={1.75} />
              </div>
              <div>
                <DialogTitle>Pay Photographer</DialogTitle>
                <DialogDescription className="mt-1.5">
                  Log an outgoing payment to a photographer for completed work.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photographer">Photographer</Label>
              <Select
                value={photographerId}
                onValueChange={(v) => {
                  setPhotographerId(v);
                  setEventId("");
                }}
                required
              >
                <SelectTrigger id="photographer">
                  <SelectValue placeholder="Select photographer…" />
                </SelectTrigger>
                <SelectContent>
                  {photographers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-text-muted">·</span>
                        <span className="text-text-muted text-xs">
                          {p.specialty}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event">Associated Event</Label>
              <Select
                value={eventId}
                onValueChange={setEventId}
                disabled={!photographerId}
                required
              >
                <SelectTrigger id="event">
                  <SelectValue
                    placeholder={
                      photographerId
                        ? photographerEvents.length === 0
                          ? "No completed events"
                          : "Select event…"
                        : "Select photographer first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {photographerEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.name}</span>
                        <span className="text-text-muted">·</span>
                        <span className="text-text-muted text-xs">
                          {event.date}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {photographerId && photographerEvents.length === 0 && (
                <p className="text-[11px] font-sans text-text-muted">
                  This photographer has no completed events yet.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payout-date">Payment Date</Label>
                <Input
                  id="payout-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="[color-scheme:dark]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payout-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none">
                    ৳
                  </span>
                  <Input
                    id="payout-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payout-method">Payment Method</Label>
              <Select value={method} onValueChange={setMethod} required>
                <SelectTrigger id="payout-method">
                  <SelectValue placeholder="Select method…" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payout-notes">Notes</Label>
              <Textarea
                id="payout-notes"
                placeholder="Optional payout notes…"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" size="sm">
              <Send className="w-4 h-4" strokeWidth={2} />
              Send Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
