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
      return "size-72 lg:size-80"
    case "lg":
      return "size-32 lg:size-36"
    case "md":
      return "size-18 lg:size-20"
    case "sm":
      return "size-10 lg:size-12"
    case "xs":
      return "size-7 lg:size-8"
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
      return "(max-width: 1024px) 48px,64px"
    case "xs":
      return "(max-width: 1024px) 28px,32px"
  }
}

export function RyogoImage(props: {
  src: string
  alt: string
  imageSize: RyogoImageSizeType
  className?: string
}) {
  return (
    <div
      className={`relative ${getImageSizeClassName(props.imageSize)} rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 ${props.className ?? ""}`}
    >
      <Image
        loading="eager"
        src={props.src}
        alt={props.alt}
        fill
        sizes={getNextImageSizes(props.imageSize)}
      />
    </div>
  )
}

export function RyogoDialogImage(props: {
  src: string
  alt: string
  imageSize: RyogoImageSizeType
}) {
  let className = `relative flex justify-center items-center ${getImageSizeClassName(props.imageSize)} rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-slate-600 dark:hover:border-slate-300`
  return (
    <Dialog>
      <DialogTrigger className={className}>
        <Image
          loading="eager"
          src={props.src}
          alt={props.alt}
          fill
          className="object-contain"
          sizes={getNextImageSizes(props.imageSize)}
        />
      </DialogTrigger>
      <DialogContent className="size-5/6">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Image
          loading="eager"
          src={props.src}
          alt={props.alt}
          fill
          className="object-contain"
          sizes="5/6"
        />
      </DialogContent>
    </Dialog>
  )
}

export function RyogoChinImage(props: { src: string; alt: string }) {
  return (
    <div className="flex justify-center items-center overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-b-lg p-1.5 lg:p-2">
      <Dialog>
        <DialogTrigger className="w-full hover:underline">
          <RyogoCaption color="slate">{props.alt}</RyogoCaption>
        </DialogTrigger>
        <DialogContent className="size-5/6">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Image
            loading="eager"
            src={props.src}
            alt={props.alt}
            fill
            className="object-contain"
            sizes="5/6"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
