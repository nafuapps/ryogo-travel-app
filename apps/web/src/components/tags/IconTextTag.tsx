import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { LucideIcon } from "lucide-react"
import { SectionRowWrapper } from "@/components/page/pageWrappers"

export function IconTextTag({
  icon,
  text,
}: {
  icon: LucideIcon
  text: string
}) {
  return (
    <SectionRowWrapper justifyStart center small>
      <RyogoIcon icon={icon} size={"sm"} />
      <RyogoCaption color="slate">{text}</RyogoCaption>
    </SectionRowWrapper>
  )
}
