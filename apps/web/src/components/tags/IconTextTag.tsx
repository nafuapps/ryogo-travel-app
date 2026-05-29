import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { LucideIcon } from "lucide-react"
import { SectionRowWrapper } from "@/components/page/pageWrappers"

export function IconTextTag(props: { icon: LucideIcon; text: string }) {
  return (
    <SectionRowWrapper justifyStart center small>
      <RyogoIcon icon={props.icon} size={"sm"} />
      <RyogoCaption color="slate">{props.text}</RyogoCaption>
    </SectionRowWrapper>
  )
}
