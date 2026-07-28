import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RyogoCaption } from "@/components/typography"

export type RyogoImageSize = "xs" | "sm" | "md" | "lg" | "xl"

function getImageSizeClassName(size: RyogoImageSize) {
  switch (size) {
    case "xl":
      return "size-44 lg:size-48"
    case "lg":
      return "size-28 lg:size-32"
    case "md":
      return "size-18 lg:size-20"
    case "sm":
      return "size-10 lg:size-12"
    case "xs":
      return "size-7 lg:size-8"
  }
}

function getNextImageSizes(size: RyogoImageSize) {
  switch (size) {
    case "xl":
      return "(max-width: 1024px) 176px,192px"
    case "lg":
      return "(max-width: 1024px) 112px,128px"
    case "md":
      return "(max-width: 1024px) 72px,80px"
    case "sm":
      return "(max-width: 1024px) 48px,64px"
    case "xs":
      return "(max-width: 1024px) 28px,32px"
  }
}

export function RyogoImage({
  src,
  alt,
  imageSize,
}: {
  src: string
  alt: string
  imageSize: RyogoImageSize
}) {
  let className = `relative ${getImageSizeClassName(imageSize)} rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700`

  return (
    <div className={className}>
      <Image
        loading="eager"
        src={src}
        alt={alt}
        fill
        sizes={getNextImageSizes(imageSize)}
      />
    </div>
  )
}

export function RyogoDialogImage({
  src,
  alt,
  imageSize,
}: {
  src: string
  alt: string
  imageSize: RyogoImageSize
}) {
  let className = `relative flex justify-center items-center ${getImageSizeClassName(imageSize)} rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-slate-600 dark:hover:border-slate-300`
  return (
    <Dialog>
      <DialogTrigger className={className}>
        <Image
          loading="eager"
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes={getNextImageSizes(imageSize)}
        />
      </DialogTrigger>
      <DialogContent className="size-5/6">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Image
          loading="eager"
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="5/6"
        />
      </DialogContent>
    </Dialog>
  )
}

export function RyogoChinImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex justify-center items-center overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-b-lg p-1.5 lg:p-2">
      <Dialog>
        <DialogTrigger className="w-full hover:underline">
          <RyogoCaption color="slate">{alt}</RyogoCaption>
        </DialogTrigger>
        <DialogContent className="size-5/6">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Image
            loading="eager"
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="5/6"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
