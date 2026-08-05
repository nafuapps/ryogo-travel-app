import { RyogoP } from "@/components/typography"
import { SectionWrapper } from "@/components/page/pageWrappers"
import Link from "next/link"
import Image from "next/image"
import { RyogoPill } from "@/components/pills/ryogoPills"

export type SupportBlogItemType = {
  imageSrc: string
  title: string
  blogLink: string
  type: string
}

export function SupportBlogItem({
  imageSrc,
  title,
  blogLink,
  type,
}: SupportBlogItemType) {
  return (
    <SectionWrapper id={title}>
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
    </SectionWrapper>
  )
}
