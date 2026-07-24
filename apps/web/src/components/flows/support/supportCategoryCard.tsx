import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionWrapper } from "@/components/page/pageWrappers"
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
  link: UrlObject
}) {
  return (
    <Link href={link}>
      <SectionWrapper id={title}>
        <RyogoEnclosedIcon icon={icon} size="sm" circular />
        <RyogoSmall>{title}</RyogoSmall>
        <RyogoSmall color="light">{description}</RyogoSmall>
      </SectionWrapper>
    </Link>
  )
}
