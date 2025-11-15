// src/app/page.tsx
import CashFlowDashboard from "@/components/cashflow-wealth-dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <CashFlowDashboard />
    </main>
  );
}
