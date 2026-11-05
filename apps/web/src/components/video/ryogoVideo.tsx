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

const vercelBlobStorageUrl =
  "https://pryxypem4olqwelx.public.blob.vercel-storage.com"

export function RyogoSupportVideo({
  src,
  mobile,
}: {
  src: string
  mobile?: boolean
}) {
  // In future, can set a different mobile src with <source> inside <video>
  return (
    <video
      src={vercelBlobStorageUrl + src} //Vercel blob storage URL
      autoPlay
      muted
      loop
      preload="metadata"
      playsInline
      controls
      className={`rounded-lg overflow-hidden aspect-auto self-center w-full ${mobile ? "max-w-xs" : ""}`}
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
