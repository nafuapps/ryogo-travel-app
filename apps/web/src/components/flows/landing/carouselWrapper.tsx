import { RyogoSmall, RyogoP } from "@/components/typography"
import { RyogoVideo } from "@/components/video/ryogoVideo"
import { CarouselItem } from "@/components/ui/carousel"
import Image from "next/image"
import { RyogoPill } from "@/components/pills/ryogoPills"
import Link from "next/link"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"

export type VideoCarouselItemType = {
  src: string
  title: string
  desc: string
  index: number
}

export function VideoCarouselItem({
  src,
  title,
  desc,
  index,
}: VideoCarouselItemType) {
  return (
    <CarouselItem className="px-2 md:px-2.5 w-full md:w-1/2 lg:w-1/3">
      <SectionColWrapper>
        <RyogoVideo src={src} className="w-full aspect-video rounded-lg" />
        <SectionRowWrapper small className="items-center">
          <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg size-8 lg:size-10 shrink-0">
            <RyogoP color="slate" weight="font-bold">
              {index}
            </RyogoP>
          </div>
          <RyogoP weight="font-bold">{title}</RyogoP>
        </SectionRowWrapper>
        <RyogoSmall color="light">{desc}</RyogoSmall>
      </SectionColWrapper>
    </CarouselItem>
  )
}

export type BlogCarouselItemType = {
  blogId: string
  title: string
  imageSrc: string
  type: string
}

export function BlogCarouselItem({
  imageSrc,
  title,
  type,
  blogId,
}: BlogCarouselItemType) {
  return (
    <CarouselItem className="group px-2 md:px-2.5 w-full md:w-1/2 lg:w-1/3">
      <Link
        href={`/resources/blog/${blogId}`}
        className="flex flex-col gap-2 md:gap-3 hover:opacity-80"
      >
        <div className="border-8 md:border-10 border-slate-100/50 dark:border-slate-700/50 w-full max-w-2xl relative rounded-lg aspect-video overflow-hidden">
          <Image
            src={imageSrc}
            className="object-cover rounded-lg md:transition-transform md:duration-300 md:group-hover:scale-105"
            alt={title}
            fill
            sizes="672px"
          />
        </div>
        <RyogoPill label={type} bgColor={"light"} className="self-start" />
        <RyogoP color="slate" weight="font-medium">
          {title}
        </RyogoP>
      </Link>
    </CarouselItem>
  )
}
