import { LucideIcon } from "lucide-react"

type RyogoIconColor =
  | "red"
  | "yellow"
  | "green"
  | "brand"
  | "slate"
  | "black"
  | "white"
export type RyogoIconSize = "sm" | "md" | "lg" | "xl"

const getIconColor = (color?: RyogoIconColor) => {
  if (color === "red") {
    return "text-red-600"
  }
  if (color === "yellow") {
    return "text-yellow-600"
  }
  if (color === "green") {
    return "text-green-600"
  }
  if (color === "brand") {
    return "text-sky-600"
  }
  if (color === "slate") {
    return "text-slate-600"
  }
  if (color === "black") {
    return "text-slate-950"
  }
  if (color === "white") {
    return "text-white"
  }
  return "text-slate-600"
}

export function RyogoIcon(props: {
  icon: LucideIcon
  size: RyogoIconSize
  color?: RyogoIconColor
  onClick?: () => void
}) {
  const sizeClassName = `${props.size === "xl" ? "size:20 lg:size-24" : props.size === "lg" ? "size:11 lg:size-12" : props.size === "md" ? "size-7 lg:size-8" : "size-4 lg:size-5"}`
  return (
    <props.icon
      onClick={props.onClick}
      className={`stroke-1 ${sizeClassName} ${getIconColor(props.color)}`}
    />
  )
}
