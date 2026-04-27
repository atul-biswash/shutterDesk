import { Aperture } from "lucide-react";
import { SignInForm } from "./SignInForm";

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

      <SignInForm />

      <p className="text-center text-[11px] font-sans text-text-muted">
        By signing in, you agree to ShutterDesk&apos;s terms of service.
      </p>
    </div>
  );
}
