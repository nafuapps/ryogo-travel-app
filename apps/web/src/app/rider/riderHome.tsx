import { Skeleton } from "@/components/ui/skeleton";

export default function RiderHomeComponent() {
  return (
    <div
      id="RiderPage"
      className="w-full flex flex-col gap-2 lg:gap-3 overflow-y-scroll no-scrollbar pt-3"
    >
      <Skeleton className="h-80 w-full bg-white shrink-0" />
      <Skeleton className="h-80 w-full bg-white shrink-0" />
      <Skeleton className="h-80 w-full bg-white shrink-0" />
      <Skeleton className="h-80 w-full bg-white shrink-0" />
    </div>
  );
}
