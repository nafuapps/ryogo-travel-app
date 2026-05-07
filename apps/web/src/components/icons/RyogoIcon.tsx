import { LucideIcon } from "lucide-react"

export type RyogoIconColor =
  | "red"
  | "yellow"
  | "green"
  | "sky"
  | "slate"
  | "white"
  | "black"
export type RyogoIconSize = "sm" | "md" | "lg" | "xl" | "2xl"

export function RyogoIcon(props: {
  icon: LucideIcon
  size: RyogoIconSize
  color?: RyogoIconColor
  onClick?: () => void
}) {
  const sizeClassName = `${props.size === "2xl" ? "size:28 lg:size-32" : props.size === "xl" ? "size:20 lg:size-24" : props.size === "lg" ? "size:12 lg:size-16" : props.size === "md" ? "size-8 lg:size-10" : "size-4 lg:size-5"}`
  const colorClassName = `text-${props.color === "black" ? "slate-950" : props.color === "white" ? "white" : `${props.color}-500`}`
  return (
    <props.icon
      onClick={props.onClick}
      className={`${sizeClassName} ${colorClassName}`}
    />
  )
}
