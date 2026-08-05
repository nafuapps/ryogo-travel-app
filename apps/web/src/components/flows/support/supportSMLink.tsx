import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"

export type SupportSMLinkType = {
  label: string
  href: string
}

export function SupportSMLink(props: SupportSMLinkType) {
  return (
    <a href={props.href} target="_blank">
      <Button variant="link">
        <RyogoCaption>{props.label}</RyogoCaption>
      </Button>
    </a>
  )
}
