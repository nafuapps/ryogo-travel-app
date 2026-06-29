import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export function RyogoVideo({
  src,
  title,
  className,
}: {
  src: string
  title?: string
  className?: string
}) {
  return (
    <Suspense
      fallback={<Skeleton className="aspect-video w-full rounded-lg" />}
    >
      <iframe
        src={src}
        loading="lazy"
        title={title}
        allowFullScreen
        className={`rounded overflow-hidden ${className ?? ""}`}
      />
    </Suspense>
  )
}

export function RyogoDialogVideo({
  src,
  children,
  title,
  className,
}: {
  src: string
  children: React.ReactNode
  title?: string
  className?: string
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full sm:w-3/4 sm:max-w-4xl">
        <RyogoVideo src={src} title={title} className={className} />
      </DialogContent>
    </Dialog>
  )
}
