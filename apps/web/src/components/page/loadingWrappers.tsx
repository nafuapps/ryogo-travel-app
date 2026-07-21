import { Skeleton } from "@/components/ui/skeleton"

export function HeaderSkeleton() {
  return <Skeleton className="h-16 lg:h-20 w-full" />
}

export function PageSkeleton() {
  return <Skeleton className="my-2 h-full w-full" />
}

export function SectionSkeleton({ className }: { className: string }) {
  return <Skeleton className={`${className}`} />
}
