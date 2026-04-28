"use client";

import { useState, useTransition } from "react";
import { Plus, DollarSign, Receipt, Loader2, CheckCircle2 } from "lucide-react";
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
import { paymentMethods } from "@/lib/constants";
import { recordClientPayment } from "@/lib/actions";

type Invoice = { id: string; client: string; amount: number; status: string };

export function RecordClientPaymentDialog({ invoices }: { invoices: Invoice[] }) {
  const [open, setOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    startTransition(async () => {
      const result = await recordClientPayment({
        invoiceId,
        date,
        amount: parseFloat(amount),
        method,
        reference: reference || undefined,
        notes: notes || undefined,
      });

      if (result.ok) {
        if (result.invoiceMarkedPaid) {
          setSuccess(
            "Payment recorded. Invoice is fully paid and marked as PAID."
          );
        } else {
          setSuccess("Payment recorded successfully.");
        }
        setTimeout(() => {
          setOpen(false);
          setInvoiceId("");
          setAmount("");
          setMethod("");
          setReference("");
          setNotes("");
          setSuccess(null);
        }, 1500);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={invoices.length === 0}>
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-green-profit-subtle border border-green-profit/30 flex items-center justify-center shrink-0 mt-0.5">
                <DollarSign
                  className="w-4 h-4 text-green-profit"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <DialogTitle>Record Client Payment</DialogTitle>
                <DialogDescription className="mt-1.5">
                  Log an incoming payment from a client toward an invoice.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogBody className="space-y-4">
            {success && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-green-profit-subtle border border-green-profit/30 text-green-profit">
                <CheckCircle2
                  className="w-3.5 h-3.5 shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <p className="text-xs font-sans leading-relaxed">{success}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="invoice">Associated Invoice</Label>
              <Select value={invoiceId} onValueChange={setInvoiceId} required>
                <SelectTrigger id="invoice">
                  <SelectValue placeholder="Select invoice…" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">
                          {inv.id.slice(0, 12)}
                        </span>
                        <span className="text-text-muted">·</span>
                        <span className="text-text-secondary">{inv.client}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment-date">Payment Date</Label>
                <Input
                  id="payment-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="[color-scheme:dark]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none">
                    ৳
                  </span>
                  <Input
                    id="amount"
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
              <Label htmlFor="method">Payment Method</Label>
              <Select value={method} onValueChange={setMethod} required>
                <SelectTrigger id="method">
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
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                placeholder="e.g., WIRE-784512 (optional)"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Optional notes about this payment…"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              ) : (
                <Receipt className="w-4 h-4" strokeWidth={2} />
              )}
              {isPending ? "Recording…" : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
