import { LucideIcon } from "lucide-react"

export type RyogoIconColor = "red" | "yellow" | "green" | "sky" | "slate"
export type RyogoIconSize = "sm" | "md" | "lg" | "xl"

export function RyogoIcon(props: {
  icon: LucideIcon
  color?: RyogoIconColor
  size?: RyogoIconSize
}) {
  const sizeClassName = `${props.size === "xl" ? "size:28 lg:size-32" : props.size === "lg" ? "size:12 lg:size-16" : props.size === "md" ? "size-8 lg:size-10" : "size-4 lg:size-5"}`
  const colorClassName = `text-${props.color ?? "slate"}-500`
  return <props.icon className={`${sizeClassName} ${colorClassName}`} />
}
