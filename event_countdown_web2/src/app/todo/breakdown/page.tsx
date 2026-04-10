import { Suspense } from "react";
import { BreakdownScreen } from "@/src/features/task-breakdown/breakdown-screen";

function BreakdownFallback() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#F8F9FA]">
      <div className="h-[72px] animate-pulse border-b border-[#E8EAED] bg-white" />
      <div className="mx-auto mt-16 h-40 w-full max-w-[800px] animate-pulse rounded-xl bg-[#EEF1F4] px-4" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<BreakdownFallback />}>
      <BreakdownScreen />
    </Suspense>
  );
}
