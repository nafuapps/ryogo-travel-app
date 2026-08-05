import Link from "next/link"
import { Dot, LucideIcon } from "lucide-react"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoSmall } from "@/components/typography"

export default function SupportCategoryCard({
  title,
  icon,
  description,
  link,
  highlight,
}: {
  title: string
  icon: LucideIcon
  description: string
  link: React.ComponentProps<typeof Link>["href"]
  highlight?: boolean
}) {
  return (
    <Link href={link} className="flex">
      <SectionWrapper id={title}>
        <SectionRowWrapper justifyStart center>
          <RyogoEnclosedIcon icon={icon} size="sm" />
          <RyogoSmall color="slate" weight="font-medium">
            {title}
          </RyogoSmall>
          {highlight && (
            <RyogoIcon
              icon={Dot}
              size="md"
              color="yellow"
              thick
              className={"animate-pulse"}
            />
          )}
        </SectionRowWrapper>
        <RyogoCaption color="light">{description}</RyogoCaption>
      </SectionWrapper>
    </Link>
  )
}
