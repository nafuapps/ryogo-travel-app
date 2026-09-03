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

type RyogoImageSizeType = "xs" | "sm" | "md" | "lg" | "xl"

function getImageSizeClassName(size: RyogoImageSizeType) {
  switch (size) {
    case "xl":
      return "size-72 lg:size-80 rounded-2xl"
    case "lg":
      return "size-32 lg:size-36 rounded-xl"
    case "md":
      return "size-18 lg:size-20 rounded-lg"
    case "sm":
      return "size-10 lg:size-12 rounded-md"
    case "xs":
      return "size-8 lg:size-9 rounded-sm"
  }
}

function getNextImageSizes(size: RyogoImageSizeType) {
  switch (size) {
    case "xl":
      return "(max-width: 1024px) 288px,320px"
    case "lg":
      return "(max-width: 1024px) 128px,144px"
    case "md":
      return "(max-width: 1024px) 72px,80px"
    case "sm":
      return "(max-width: 1024px) 40px,48px"
    case "xs":
      return "(max-width: 1024px) 32px,36px"
  }
}

export function RyogoImage({
  src,
  alt,
  imageSize,
  className,
}: {
  src: string
  alt: string
  imageSize: RyogoImageSizeType
  className?: string
}) {
  return (
    <div
      className={`relative ${getImageSizeClassName(imageSize)} overflow-hidden shrink-0 ${className ?? ""}`}
    >
      <Image
        loading="eager"
        src={src}
        alt={alt}
        fill
        className="object-cover"
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
  imageSize: RyogoImageSizeType
}) {
  let className = `relative flex justify-center items-center ${getImageSizeClassName(imageSize)} rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 hover:border-slate-600 dark:hover:border-slate-300`
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
    <div className="flex justify-center items-center overflow-hidden bg-slate-300 dark:bg-slate-700 rounded-b-lg p-1.5 lg:p-2">
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
