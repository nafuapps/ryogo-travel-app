import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CaptionGrey } from "../typography"

export type RyogoImageSize = "xs" | "sm" | "lg"

export function RyogoImage({
  src,
  alt,
  imageSize,
}: {
  src: string
  alt: string
  imageSize: RyogoImageSize
}) {
  let className = `relative ${imageSize === "xs" ? "size-7 lg:size-8" : imageSize === "sm" ? "size-10 lg:size-12" : "size-28 lg:size-32"} rounded-lg overflow-hidden`

  let sizes = `(max-width: 1024px) ${imageSize === "xs" ? "28px,32px" : imageSize === "sm" ? "40px,48px" : "112px,128px"}`

  return (
    <div className={className}>
      <Image loading="eager" src={src} alt={alt} fill sizes={sizes} />
    </div>
  )
}

export function RyogoDialogImage({ src, alt }: { src: string; alt: string }) {
  let className =
    "relative flex justify-center items-center size-10 lg:size-12 rounded-lg overflow-hidden border border-slate-200 hover:border-slate-500"

  let sizes = `(max-width: 1024px) 40px,48px`

  return (
    <Dialog>
      <DialogTrigger className={className}>
        <Image
          loading="eager"
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes={sizes}
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
    <div className="flex justify-center items-center overflow-hidden bg-slate-200 rounded-b-lg p-1.5 lg:p-2">
      <Dialog>
        <DialogTrigger className="w-full hover:underline hover:cursor-pointer">
          <CaptionGrey>{alt}</CaptionGrey>
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
