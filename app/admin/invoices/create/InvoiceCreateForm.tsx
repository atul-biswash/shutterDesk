"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  X,
  ChevronDown,
  Check,
  User,
  CalendarDays,
  Camera,
  ListChecks,
  StickyNote,
  Save,
  Sparkles,
  Send,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBDTWithDecimals as formatCurrency } from "@/lib/currency";
import { createInvoice } from "@/lib/actions";

type Photographer = { id: string; name: string; email: string };

type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  price: number;
};

const SectionIcon = ({
  icon: Icon,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) => (
  <div className="w-8 h-8 rounded-md bg-amber/10 border border-amber/30 flex items-center justify-center shrink-0">
    <Icon className="w-4 h-4 text-amber" strokeWidth={1.5} />
  </div>
);

export function InvoiceCreateForm({
  photographers,
}: {
  photographers: Photographer[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventType, setEventType] = useState("");

  const [selectedPhotographers, setSelectedPhotographers] = useState<string[]>(
    []
  );
  const [photographerOpen, setPhotographerOpen] = useState(false);
  const photographerRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: "", quantity: 1, price: 0 },
  ]);
  const [nextItemId, setNextItemId] = useState(2);

  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(8);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        photographerRef.current &&
        !photographerRef.current.contains(e.target as Node)
      ) {
        setPhotographerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      { id: nextItemId, description: "", quantity: 1, price: 0 },
    ]);
    setNextItemId(nextItemId + 1);
  };

  const removeItem = (id: number) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const updateItemNumeric = (
    id: number,
    field: "quantity" | "price",
    value: string
  ) => {
    const num = value === "" ? 0 : parseFloat(value);
    if (isNaN(num)) return;
    updateItem(id, field, num);
  };

  const togglePhotographer = (id: string) => {
    setSelectedPhotographers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const selectedPhotographerObjects = photographers.filter((p) =>
    selectedPhotographers.includes(p.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validItems = items.filter(
      (i) => i.description.trim() !== "" && i.quantity > 0 && i.price >= 0
    );
    if (validItems.length === 0) {
      setError("Add at least one valid line item.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createInvoice({
          customer: {
            name: customerName,
            phone: customerPhone || undefined,
            email: customerEmail || undefined,
          },
          event: {
            title: eventTitle,
            date: eventDate,
            location: eventLocation,
            eventType: eventType || undefined,
          },
          photographerIds: selectedPhotographers,
          items: validItems.map((i) => ({
            description: i.description,
            quantity: i.quantity,
            price: i.price,
          })),
          notes: notes || undefined,
          taxRate,
        });

        if (result.ok) {
          router.push(`/admin/invoices/${result.invoiceId}`);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create invoice"
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <Card className="border-border">
          <CardHeader className="pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <SectionIcon icon={User} />
              <div>
                <CardTitle>Customer Information</CardTitle>
                <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                  Bill-to details for this invoice
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input
                  id="customer-name"
                  placeholder="e.g., Helena & Marcus Wilson"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-phone">Phone Number</Label>
                <Input
                  id="customer-phone"
                  type="tel"
                  placeholder="+880 1XXX XXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-email">Email Address</Label>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="customer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <SectionIcon icon={CalendarDays} />
              <div>
                <CardTitle>Event Details</CardTitle>
                <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                  When and where the shoot will happen
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  placeholder="e.g., The Wilson Wedding"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-date">Event Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="text-text-primary [color-scheme:dark]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Input
                  id="event-type"
                  placeholder="e.g., Wedding, Corporate, Portrait"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  placeholder="e.g., Belmont Estate, Tarrytown NY"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <SectionIcon icon={Camera} />
              <div>
                <CardTitle>Photographer Assignment</CardTitle>
                <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                  Select one or more photographers for this event
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-2">
              <Label>Assigned Photographers</Label>
              <div ref={photographerRef} className="relative">
                <button
                  type="button"
                  onClick={() => setPhotographerOpen(!photographerOpen)}
                  className={cn(
                    "w-full min-h-[40px] flex items-start justify-between gap-2 px-3 py-2 rounded border bg-surface-raised text-left text-sm font-sans transition-colors",
                    photographerOpen
                      ? "border-amber/50 ring-1 ring-amber/40"
                      : "border-border hover:border-amber/30"
                  )}
                >
                  <div className="flex flex-wrap gap-1.5 flex-1 min-h-[24px] items-center">
                    {selectedPhotographerObjects.length === 0 ? (
                      <span className="text-text-muted">
                        {photographers.length === 0
                          ? "No photographers in database"
                          : "Select photographer(s)…"}
                      </span>
                    ) : (
                      selectedPhotographerObjects.map((p) => (
                        <Badge
                          key={p.id}
                          variant="default"
                          className="gap-1.5 pl-2 pr-1 py-0.5"
                        >
                          {p.name}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePhotographer(p.id);
                            }}
                            className="rounded-sm hover:bg-amber/20 transition-colors p-0.5"
                          >
                            <X className="w-2.5 h-2.5" strokeWidth={2.5} />
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-text-muted transition-transform shrink-0 mt-0.5",
                      photographerOpen && "rotate-180"
                    )}
                  />
                </button>

                {photographerOpen && photographers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-surface-raised border border-border rounded-md shadow-card-hover z-20 max-h-72 overflow-y-auto py-1 animate-fade-in opacity-0">
                    {photographers.map((p) => {
                      const isSelected = selectedPhotographers.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => togglePhotographer(p.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-hover transition-colors",
                            isSelected && "bg-amber-subtle/50"
                          )}
                        >
                          <div
                            className={cn(
                              "w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors",
                              isSelected
                                ? "bg-amber border-amber"
                                : "border-border bg-background"
                            )}
                          >
                            {isSelected && (
                              <Check
                                className="w-3 h-3 text-text-inverse"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-sans text-text-primary">
                              {p.name}
                            </div>
                            <div className="text-[11px] font-sans text-text-muted">
                              {p.email}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <p className="text-[11px] font-sans text-text-muted mt-1.5">
                {selectedPhotographers.length} selected
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-4 border-b border-border-subtle">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <SectionIcon icon={ListChecks} />
                <div>
                  <CardTitle>Itemized Services</CardTitle>
                  <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                    Break down what&apos;s being billed
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-2">
              <div className="hidden md:grid grid-cols-12 gap-2 px-1 pb-2 border-b border-border-subtle">
                <div className="col-span-6 text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest">
                  Description
                </div>
                <div className="col-span-1 text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest text-center">
                  Qty
                </div>
                <div className="col-span-2 text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest text-right">
                  Price
                </div>
                <div className="col-span-2 text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest text-right">
                  Total
                </div>
                <div className="col-span-1"></div>
              </div>

              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-center group py-1"
                >
                  <div className="col-span-12 md:col-span-6">
                    <Input
                      placeholder={`Service ${idx + 1} (e.g., 8-hour wedding coverage)`}
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-3 md:col-span-1">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItemNumeric(item.id, "quantity", e.target.value)
                      }
                      className="text-center"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        updateItemNumeric(item.id, "price", e.target.value)
                      }
                      className="text-right"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 text-right">
                    <span className="text-sm font-sans font-medium text-text-primary">
                      {formatCurrency(item.quantity * item.price)}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-text-muted hover:text-red-expense hover:bg-red-expense-subtle transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addItem}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-md border border-dashed border-border hover:border-amber/50 hover:bg-amber-subtle/30 text-sm font-sans text-text-secondary hover:text-amber transition-all"
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                Add another service
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <SectionIcon icon={StickyNote} />
              <div>
                <CardTitle>Notes & Terms</CardTitle>
                <p className="text-xs font-sans text-text-muted mt-1 normal-case tracking-normal">
                  Optional message shown on the invoice
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <Textarea
              placeholder="e.g., 50% deposit due upon signing. Remaining balance due 14 days before the event."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-20 space-y-4">
          <Card className="border-amber/20 bg-gradient-to-br from-amber-subtle/40 to-surface">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber" strokeWidth={1.75} />
                <CardTitle className="text-amber">Invoice Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-sans text-text-secondary">
                    Subtotal
                  </span>
                  <span className="text-sm font-sans font-medium text-text-primary">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-sans text-text-secondary">
                      Tax
                    </span>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={taxRate}
                      onChange={(e) =>
                        setTaxRate(parseFloat(e.target.value) || 0)
                      }
                      className="w-14 h-7 px-2 text-center text-xs"
                    />
                    <span className="text-xs font-sans text-text-muted">%</span>
                  </div>
                  <span className="text-sm font-sans font-medium text-text-primary">
                    {formatCurrency(tax)}
                  </span>
                </div>
                <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
                  <span className="font-serif text-base text-text-primary">
                    Grand Total
                  </span>
                  <span className="font-serif text-2xl text-amber leading-none">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4 space-y-2 text-xs font-sans text-text-muted">
                <div className="flex items-center justify-between">
                  <span>Line items</span>
                  <span className="text-text-secondary font-medium">
                    {items.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Photographers</span>
                  <span className="text-text-secondary font-medium">
                    {selectedPhotographers.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-3 space-y-2">
              {error && (
                <div className="px-3 py-2 rounded-md bg-red-expense-subtle border border-red-expense/30 text-xs font-sans text-red-expense">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Send className="w-4 h-4" strokeWidth={2} />
                )}
                {isPending ? "Generating…" : "Generate Invoice"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                size="lg"
                disabled={isPending}
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                Save as Draft
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                size="lg"
                onClick={() => router.push("/admin")}
                disabled={isPending}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>

          <p className="text-[11px] font-sans text-text-muted text-center px-3">
            Generating an invoice will create a permanent record. You can mark
            it as paid or cancel it later.
          </p>
        </div>
      </div>
    </form>
  );
}
