import { LucideIcon } from "lucide-react"

type RyogoIconColor =
  | "red"
  | "yellow"
  | "green"
  | "brand"
  | "slate"
  | "black"
  | "white"
  | "light"
export type RyogoIconSize = "sm" | "md" | "lg" | "xl"

const getIconColor = (color?: RyogoIconColor) => {
  if (color === "red") {
    return "text-red-700"
  }
  if (color === "yellow") {
    return "text-yellow-700"
  }
  if (color === "green") {
    return "text-green-700"
  }
  if (color === "brand") {
    return "text-sky-700"
  }
  if (color === "slate") {
    return "text-slate-700"
  }
  if (color === "black") {
    return "text-slate-950"
  }
  if (color === "white") {
    return "text-white"
  }
  if (color === "light") {
    return "text-slate-400"
  }
  return "text-slate-700"
}

const getBGColor = (color?: RyogoIconColor) => {
  if (color === "red") {
    return "bg-red-100"
  }
  if (color === "yellow") {
    return "bg-yellow-100"
  }
  if (color === "green") {
    return "bg-green-100"
  }
  if (color === "brand") {
    return "bg-sky-100"
  }
  if (color === "slate") {
    return "bg-slate-100"
  }
  if (color === "black") {
    return "bg-slate-950"
  }
  if (color === "white") {
    return "bg-white"
  }
  return "bg-slate-100"
}

export function RyogoIcon(props: {
  icon: LucideIcon
  size: RyogoIconSize
  color?: RyogoIconColor
  thick?: boolean
  onClick?: () => void
}) {
  const sizeClassName = `${props.size === "xl" ? "size:20 lg:size-24" : props.size === "lg" ? "size:11 lg:size-12" : props.size === "md" ? "size-7 lg:size-8" : "size-5 lg:size-5.5"}`
  return (
    <props.icon
      onClick={props.onClick}
      className={`${props.thick ? "stroke-2" : "stroke-1"} ${sizeClassName} ${getIconColor(props.color)}`}
    />
  )
}

export function RyogoEnclosedIcon(props: {
  icon: LucideIcon
  size: RyogoIconSize
  color?: RyogoIconColor
  thick?: boolean
  onClick?: () => void
  circular?: boolean
  bgColor?: RyogoIconColor
}) {
  return (
    <div
      onClick={props.onClick}
      className={`${getBGColor(props.bgColor)} ${props.circular ? "rounded-full" : "rounded-lg"} ${props.size === "xl" ? "size-28 lg:size-32" : props.size === "lg" ? "size-15 lg:size-16" : props.size === "md" ? "size-11 lg:size-12" : "size-9 lg:size-10"} flex shrink-0 justify-center items-center`}
    >
      <RyogoIcon
        icon={props.icon}
        size={props.size}
        color={props.color}
        thick={props.thick}
      />
    </div>
  )
}
