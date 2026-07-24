import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoSmall } from "@/components/typography"
import { UrlObject } from "url"

export default function SupportCategoryCard({
  title,
  icon,
  description,
  link,
}: {
  title: string
  icon: LucideIcon
  description: string
  link: UrlObject | __next_route_internal_types__.RouteImpl<UrlObject>
}) {
  return (
    <Link href={link} className="flex">
      <SectionWrapper id={title}>
        <SectionRowWrapper justifyStart center>
          <RyogoEnclosedIcon icon={icon} size="sm" circular />
          <RyogoSmall>{title}</RyogoSmall>
        </SectionRowWrapper>
        <RyogoSmall color="light">{description}</RyogoSmall>
      </SectionWrapper>
    </Link>
  )
}
