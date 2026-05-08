import { RyogoIcon, RyogoIconSize } from "@/components/icons/ryogoIcon"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { LucideIcon } from "lucide-react"

export function IconTextTag(props: {
  icon: LucideIcon
  text: string
  size?: RyogoIconSize
}) {
  return (
    <div
      className={`flex flex-row ${props.size === "lg" ? "gap-2 lg:gap-3" : "gap-1 lg:gap-1.5"} items-center`}
    >
      <RyogoIcon icon={props.icon} size={props.size ?? "sm"} />
      {props.size === "lg" ? (
        <RyogoCaption color="slate">{props.text}</RyogoCaption>
      ) : (
        <RyogoSmall>{props.text}</RyogoSmall>
      )}
    </div>
  )
}
