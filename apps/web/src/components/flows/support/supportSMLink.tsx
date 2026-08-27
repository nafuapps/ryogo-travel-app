import { RyogoGhostButton } from "@/components/buttons/ryogoButtons"

export type SupportSMLinkType = {
  label: string
  href: string
}

export function SupportSMLink(props: SupportSMLinkType) {
  return (
    <a href={props.href} target="_blank">
      <RyogoGhostButton label={props.label} className="w-full justify-start" />
    </a>
  )
}
