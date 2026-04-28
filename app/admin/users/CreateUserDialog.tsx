"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Role } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser } from "@/lib/actions";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setError(null);
    setSuccess(false);
    setShowPassword(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setTimeout(reset, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!role) {
      setError("Please select a role.");
      return;
    }

    startTransition(async () => {
      const result = await createUser({
        name,
        email,
        password,
        role: role as Role,
      });

      if (result.ok) {
        setSuccess(true);
        setTimeout(() => {
          handleOpenChange(false);
        }, 1200);
      } else {
        setError(result.error);
      }
    });
  };

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 8) return { label: "Too short", color: "text-red-expense" };
    if (password.length < 12) return { label: "Acceptable", color: "text-amber" };
    return { label: "Strong", color: "text-green-profit" };
  })();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-amber-subtle border border-amber/30 flex items-center justify-center shrink-0 mt-0.5">
                <UserPlus
                  className="w-4 h-4 text-amber"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <DialogTitle>Create User Account</DialogTitle>
                <DialogDescription className="mt-1.5">
                  Add a new staff member or photographer to the studio.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogBody className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-red-expense-subtle border border-red-expense/30 text-red-expense">
                <AlertCircle
                  className="w-3.5 h-3.5 shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <p className="text-xs font-sans leading-relaxed">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-green-profit-subtle border border-green-profit/30 text-green-profit">
                <CheckCircle2
                  className="w-3.5 h-3.5 shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <p className="text-xs font-sans leading-relaxed">
                  User created successfully.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="user-name">Full Name</Label>
              <Input
                id="user-name"
                placeholder="e.g., Aisha Rahman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isPending || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">Email Address</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="aisha@shutterdesk.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending || success}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="user-password">Password</Label>
                {passwordStrength && (
                  <span
                    className={`text-[10px] font-sans font-medium ${passwordStrength.color}`}
                  >
                    {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Input
                  id="user-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isPending || success}
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" strokeWidth={1.75} />
                  ) : (
                    <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                  )}
                </button>
              </div>
              <p className="text-[11px] font-sans text-text-muted">
                Password is hashed with bcrypt before storage.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as Role)}
                required
                disabled={isPending || success}
              >
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="Select role…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">
                    <div className="flex flex-col">
                      <span className="font-medium">Admin</span>
                      <span className="text-[10px] text-text-muted">
                        Full studio access
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="OFFICE">
                    <div className="flex flex-col">
                      <span className="font-medium">Office</span>
                      <span className="text-[10px] text-text-muted">
                        Events, invoices, payments
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="PHOTOGRAPHER">
                    <div className="flex flex-col">
                      <span className="font-medium">Photographer</span>
                      <span className="text-[10px] text-text-muted">
                        Their own dashboard only
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
            <Button
              type="submit"
              size="sm"
              disabled={isPending || success}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              ) : success ? (
                <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
              ) : (
                <UserPlus className="w-4 h-4" strokeWidth={2} />
              )}
              {isPending
                ? "Creating…"
                : success
                  ? "Created"
                  : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
