import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoPill } from "@/components/pills/ryogoPills"
import {
  RyogoH2,
  RyogoH4,
  RyogoSmall,
  RyogoTiny,
} from "@/components/typography"
import { Dot } from "lucide-react"
import Image from "next/image"

export function BlogHeading({ label }: { label: string }) {
  return <RyogoH2 weight="font-bold">{label}</RyogoH2>
}

export function BlogImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto w-full max-w-2xl relative rounded-lg aspect-video overflow-hidden">
      <Image src={src} className="object-cover" alt={alt} fill sizes="672px" />
    </div>
  )
}

export function BlogCategories({ labels }: { labels: string[] }) {
  return (
    <SectionRowWrapper className="items-center">
      {labels.map((label) => (
        <RyogoPill bgColor="light" key={label} label={label} />
      ))}
    </SectionRowWrapper>
  )
}

export function BlogSubTitle({
  date,
  readTime,
}: {
  date: string
  readTime: string
}) {
  return (
    <SectionRowWrapper className="w-full justify-between items-center">
      <RyogoTiny color="light">{date}</RyogoTiny>
      <RyogoTiny color="light">{readTime}</RyogoTiny>
    </SectionRowWrapper>
  )
}

export function BlogSection({
  heading,
  children,
}: {
  heading?: string
  children: React.ReactNode
}) {
  return (
    <SectionColWrapper className="w-full items-start">
      {heading && (
        <RyogoH4 color="slate" weight="font-bold" className="mb-1.5 md:mb-2">
          {heading}
        </RyogoH4>
      )}
      {children}
    </SectionColWrapper>
  )
}

export function BlogParagraph({ label }: { label: string }) {
  return <RyogoSmall color="slate">{label}</RyogoSmall>
}

export function BlogLine({ label }: { label: string }) {
  return (
    <SectionRowWrapper>
      <RyogoIcon icon={Dot} size="sm" color="slate" thick />
      <RyogoSmall color="slate">{label}</RyogoSmall>
    </SectionRowWrapper>
  )
}

export function BlogParagraphBold({ label }: { label: string }) {
  return (
    <RyogoSmall color="slate" weight="font-bold">
      {label}
    </RyogoSmall>
  )
}
