import { LucideIcon } from "lucide-react"

export type RyogoIconColor =
  | "red"
  | "yellow"
  | "green"
  | "brand"
  | "slate"
  | "black"
  | "white"
  | "light"
export type RyogoIconSize = "sm" | "md" | "lg" | "xl"

function getIconColor(color?: RyogoIconColor) {
  if (color === "red") {
    return "text-red-700 dark:text-red-300"
  }
  if (color === "yellow") {
    return "text-yellow-700 dark:text-yellow-300"
  }
  if (color === "green") {
    return "text-green-700 dark:text-green-300"
  }
  if (color === "brand") {
    return "text-sky-700 dark:text-sky-300"
  }
  if (color === "slate") {
    return "text-slate-700 dark:text-slate-300"
  }
  if (color === "black") {
    return "text-slate-950 dark:text-white"
  }
  if (color === "white") {
    return "text-white dark:text-slate-950"
  }
  if (color === "light") {
    return "text-slate-400 dark:text-slate-500"
  }
  return "text-slate-700 dark:text-slate-300"
}

function getBGColor(color?: RyogoIconColor) {
  if (color === "red") {
    return "bg-red-100 dark:bg-red-800"
  }
  if (color === "yellow") {
    return "bg-yellow-100 dark:bg-yellow-800"
  }
  if (color === "green") {
    return "bg-green-100 dark:bg-green-800"
  }
  if (color === "brand") {
    return "bg-sky-100 dark:bg-sky-800"
  }
  if (color === "slate") {
    return "bg-slate-100 dark:bg-slate-800"
  }
  if (color === "black") {
    return "bg-slate-950 dark:bg-white"
  }
  if (color === "white") {
    return "bg-white dark:bg-slate-900"
  }
  return "bg-slate-100 dark:bg-slate-800"
}

function getIconSize(size: RyogoIconSize) {
  switch (size) {
    case "xl":
      return "size-20 lg:size-24"
    case "lg":
      return "size-11 lg:size-12"
    case "md":
      return "size-7 lg:size-8"
    case "sm":
      return "size-5 lg:size-5.5"
  }
}

export function RyogoIcon(props: {
  icon: LucideIcon
  size: RyogoIconSize
  color?: RyogoIconColor
  thick?: boolean
  onClick?: () => void
  className?: string
}) {
  return (
    <props.icon
      onClick={props.onClick}
      className={`shrink-0 ${props.thick ? "stroke-2" : "stroke-1"} ${getIconSize(props.size)} ${getIconColor(props.color)} ${props.className ?? ""}`}
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
  className?: string
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
        className={props.className}
      />
    </div>
  )
}
