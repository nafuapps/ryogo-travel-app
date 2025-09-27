import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <Suspense fallback={<Skeleton className="w-full h-1/3 bg-slate-200" />} />
  );
}
