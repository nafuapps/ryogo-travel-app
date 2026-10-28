import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

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

export function RyogoSupportVideo({
  src,
  className,
}: {
  src: string
  title?: string
  className?: string
}) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className={`rounded overflow-hidden aspect-video ${className ?? ""}`}
    />
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
      <DialogContent className="w-full sm:w-3/4 sm:max-w-4xl xl:max-w-5xl p-3 md:p-4">
        <RyogoVideo src={src} title={title} className={className} />
      </DialogContent>
    </Dialog>
  )
}
