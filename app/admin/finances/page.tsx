import { Header } from "@/components/layout/Header";
import { FinancesView } from "./FinancesView";

export default function FinancesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Finances"
        subtitle="Track income, expenses, and net profit"
      />

      <div className="flex-1 p-6 space-y-5">
        <div className="opacity-0 animate-fade-in">
          <h2 className="font-serif text-2xl text-text-primary">
            Cash Flow
          </h2>
          <p className="text-sm font-sans text-text-secondary mt-0.5">
            April 2026 · Money in, money out, profit margin.
          </p>
        </div>

        <div className="opacity-0 animate-fade-in-delay-1">
          <FinancesView />
        </div>
      </div>
    </div>
  );
}
