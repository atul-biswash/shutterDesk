import { Suspense } from "react";
import { Aperture, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SignInForm } from "./SignInForm";

export const dynamic = "force-dynamic";

function SignInFormSkeleton() {
  return (
    <Card className="border-border shadow-card-hover">
      <CardContent className="p-8 flex items-center justify-center min-h-[420px]">
        <Loader2 className="w-5 h-5 text-amber animate-spin" strokeWidth={1.75} />
      </CardContent>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber/10 border border-amber/30 shadow-amber-sm">
          <Aperture className="w-6 h-6 text-amber" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-text-primary leading-none">
            ShutterDesk
          </h1>
          <p className="text-[10px] text-text-muted font-sans uppercase tracking-[0.3em] mt-2">
            Studio Manager
          </p>
        </div>
      </div>

      <Suspense fallback={<SignInFormSkeleton />}>
        <SignInForm />
      </Suspense>

      <p className="text-center text-[11px] font-sans text-text-muted">
        By signing in, you agree to ShutterDesk&apos;s terms of service.
      </p>
    </div>
  );
}
