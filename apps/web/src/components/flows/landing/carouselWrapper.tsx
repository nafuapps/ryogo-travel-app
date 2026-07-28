import { RyogoCaption, RyogoP } from "@/components/typography"
import { RyogoVideo } from "@/components/video/ryogoVideo"
import { CarouselItem } from "@/components/ui/carousel"
import Image from "next/image"
import { RyogoPill } from "@/components/pills/ryogoPills"
import Link from "next/link"

export function VideoCarouselItem({
  src,
  title,
  desc,
  index,
}: {
  src: string
  title: string
  desc: string
  index: number
}) {
  return (
    <CarouselItem className="flex flex-col p-3 md:p-4 rounded-xl border gap-2 md:gap-3 basis-full md:basis-1/2 lg:basis-1/3">
      <RyogoVideo src={src} className="w-full aspect-video rounded-lg" />
      <div className="flex gap-1.5 md:gap-2 items-center">
        <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-lg size-8 lg:size-10 shrink-0">
          <RyogoP color="slate" weight="font-bold">
            {index}
          </RyogoP>
        </div>
        <RyogoP weight="font-bold">{title}</RyogoP>
      </div>
      <RyogoCaption color="light">{desc}</RyogoCaption>
    </CarouselItem>
  )
}

export function BlogCarouselItem({
  imageSrc,
  title,
  type,
  blogLink,
}: {
  imageSrc: string
  title: string
  type: string
  blogLink: string
}) {
  return (
    <CarouselItem className="group basis-full md:basis-1/2 lg:basis-1/3 px-0.5 md:px-1">
      <Link
        href={`/resources/blog/${blogLink}`}
        className="flex flex-col gap-1.5 md:gap-2"
      >
        <div className="w-full max-w-2xl relative rounded-xl aspect-video overflow-hidden">
          <Image
            src={imageSrc}
            className="object-cover md:transition-transform md:duration-300 md:group-hover:scale-105"
            alt={title}
            fill
            sizes="672px"
          />
        </div>
        <RyogoPill label={type} bgColor={"light"} />
        <RyogoP weight="font-bold">{title}</RyogoP>
      </Link>
    </CarouselItem>
  )
}
