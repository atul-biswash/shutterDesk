"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import {
  AlertCircle,
  Loader2,
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      const session = await getSession();
      const role = session?.user?.role;

      if (callbackUrl && role !== "PHOTOGRAPHER") {
        router.push(callbackUrl);
      } else if (role === "PHOTOGRAPHER") {
        router.push("/photographer");
      } else {
        router.push("/admin");
      }
      router.refresh();
    });
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError(null);
  };

  return (
    <Card className="border-border shadow-card-hover">
      <CardContent className="p-8 space-y-6">
        <div className="space-y-1 text-center">
          <h2 className="font-serif text-xl text-text-primary leading-tight">
            Sign in to your account
          </h2>
          <p className="text-xs font-sans text-text-secondary">
            Welcome back. Pick up where you left off.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-red-expense-subtle border border-red-expense/30 text-red-expense">
              <AlertCircle
                className="w-3.5 h-3.5 shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <p className="text-xs font-sans leading-relaxed">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@shutterdesk.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                className="text-[10px] font-sans text-text-muted hover:text-amber transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isPending}
                className="pl-9 pr-9"
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
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
            ) : (
              <LogIn className="w-4 h-4" strokeWidth={2} />
            )}
            {isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-subtle" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-surface px-2 text-text-muted font-sans">
              Demo Accounts
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemo("admin@shutterdesk.com")}
            disabled={isPending}
            className="px-3 py-2 rounded-md border border-border hover:border-amber/40 hover:bg-amber-subtle/30 text-left transition-colors disabled:opacity-50"
          >
            <p className="text-[10px] font-sans uppercase tracking-wider text-amber font-semibold">
              Admin
            </p>
            <p className="text-[10px] font-sans text-text-muted truncate mt-0.5">
              admin@shutterdesk.com
            </p>
          </button>
          <button
            type="button"
            onClick={() => fillDemo("james@shutterdesk.com")}
            disabled={isPending}
            className="px-3 py-2 rounded-md border border-border hover:border-amber/40 hover:bg-amber-subtle/30 text-left transition-colors disabled:opacity-50"
          >
            <p className="text-[10px] font-sans uppercase tracking-wider text-amber font-semibold">
              Photographer
            </p>
            <p className="text-[10px] font-sans text-text-muted truncate mt-0.5">
              james@shutterdesk.com
            </p>
          </button>
        </div>
        <p className="text-[10px] font-sans text-text-muted text-center -mt-2">
          Click a demo account to autofill, then sign in. Password:{" "}
          <span className="font-mono text-text-secondary">password123</span>
        </p>
      </CardContent>
    </Card>
  );
}
