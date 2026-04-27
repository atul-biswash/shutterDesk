import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function OfficePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Office Portal" subtitle="Office staff workspace" />
      <div className="flex-1 p-6 flex items-center justify-center">
        <Card className="border-border max-w-sm w-full">
          <CardContent className="p-10 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-raised border border-border flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-text-muted" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-serif text-xl text-text-primary">Office Portal</h2>
              <p className="text-sm font-sans text-text-secondary mt-2 leading-relaxed">
                This workspace is under construction. Event scheduling, client management, and invoice tools will live here.
              </p>
            </div>
            <div className="w-full h-px bg-border" />
            <p className="text-xs font-sans text-text-muted">Phase 2 — Coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
