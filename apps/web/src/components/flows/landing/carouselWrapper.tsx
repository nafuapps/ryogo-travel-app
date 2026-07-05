import { RyogoCaption, RyogoP, RyogoSmall } from "@/components/typography"
import { RyogoVideo } from "@/components/video/ryogoVideo"
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { RyogoPill } from "@/components/pills/ryogoPills"
import Link from "next/link"

export function CarouselWrapper({
  children,
  count,
}: {
  children: React.ReactNode
  count?: string
}) {
  return (
    <Carousel className="w-full" opts={{}}>
      <div className="flex gap-2 lg:gap-3 items-center justify-center w-full mb-3">
        <CarouselPrevious className="static translate-y-0 translate-x-0" />
        {count && <RyogoCaption color="slate">{count}</RyogoCaption>}
        <CarouselNext className="static translate-y-0 translate-x-0" />
      </div>
      <CarouselContent className="m-0.5 gap-3 lg:gap-4">
        {children}
      </CarouselContent>
    </Carousel>
  )
}

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
        <div className="flex items-center justify-center border rounded-full size-8 lg:size-10 shrink-0">
          <RyogoP color="light" weight="font-bold">
            {index}
          </RyogoP>
        </div>
        <RyogoP weight="font-bold">{title}</RyogoP>
      </div>
      <RyogoSmall color="light">{desc}</RyogoSmall>
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
    <CarouselItem className="group basis-full md:basis-1/2 lg:basis-1/3">
      <Link
        href={`/resources/blog/${blogLink}`}
        className="flex flex-col gap-1.5 md:gap-2"
      >
        <div className="w-full max-w-2xl relative rounded-xl aspect-video overflow-hidden">
          <Image
            src={imageSrc}
            className="object-cover md:transition-transform md:duration-300 group-hover:scale-105"
            alt={title}
            fill
            sizes=""
          />
        </div>
        <RyogoPill label={type} bgColor={"slate"} selfStart />
        <RyogoP weight="font-bold">{title}</RyogoP>
      </Link>
    </CarouselItem>
  )
}
