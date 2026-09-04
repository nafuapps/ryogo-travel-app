import { LucideIcon } from "lucide-react"

type RyogoIconColorType =
  | "red"
  | "yellow"
  | "green"
  | "brand"
  | "slate"
  | "black"
  | "white"
  | "light"

type RyogoIconSizeType = "sm" | "md" | "lg" | "xl"

function getIconColor(color?: RyogoIconColorType) {
  switch (color) {
    case "red":
      return "text-red-700 dark:text-red-300"
    case "yellow":
      return "text-yellow-700 dark:text-yellow-300"
    case "green":
      return "text-green-700 dark:text-green-300"
    case "brand":
      return "text-sky-700 dark:text-sky-300"
    case "black":
      return "text-slate-950 dark:text-white"
    case "white":
      return "text-white dark:text-slate-950"
    case "light":
      return "text-slate-500 dark:text-slate-500"
    case "slate":
    default:
      return "text-slate-700 dark:text-slate-300"
  }
}

function getBGColor(bgColor?: RyogoIconColorType) {
  switch (bgColor) {
    case "red":
      return "bg-red-100 dark:bg-red-800"
    case "yellow":
      return "bg-yellow-100 dark:bg-yellow-800"
    case "green":
      return "bg-green-100 dark:bg-green-800"
    case "brand":
      return "bg-sky-100 dark:bg-sky-800"
    case "black":
      return "bg-slate-950 dark:bg-white"
    case "white":
      return "bg-white dark:bg-slate-950"
    case "slate":
    default:
      return "bg-slate-100 dark:bg-slate-800"
  }
}

function getIconSize(size: RyogoIconSizeType) {
  switch (size) {
    case "xl":
      return "size-20 md:size-24"
    case "lg":
      return "size-11 md:size-12"
    case "md":
      return "size-7 md:size-8"
    case "sm":
      return "size-5 md:size-6"
  }
}

function getBGIconSize(size: RyogoIconSizeType) {
  switch (size) {
    case "xl":
      return "size-32 md:size-36"
    case "lg":
      return "size-18 md:size-20"
    case "md":
      return "size-10 md:size-12"
    case "sm":
      return "size-8 md:size-9"
  }
}

function getBGIconRounded(size: RyogoIconSizeType) {
  switch (size) {
    case "xl":
      return "rounded-xl"
    case "lg":
      return "rounded-lg"
    case "md":
      return "rounded-md"
    case "sm":
      return "rounded-sm"
  }
}

export type RyogoIconType = {
  icon: LucideIcon
  size: RyogoIconSizeType
  color?: RyogoIconColorType
  thick?: boolean
  onClick?: () => void
  className?: string
}

export function RyogoIcon(props: RyogoIconType) {
  const className = `shrink-0 ${props.thick ? "stroke-2" : "stroke-1"} ${getIconSize(props.size)} ${getIconColor(props.color)} ${props.className ?? ""}`
  return <props.icon onClick={props.onClick} className={className} />
}

export type RyogoEnclosedIconType = RyogoIconType & {
  circular?: boolean
  bgColor?: RyogoIconColorType
}

export function RyogoEnclosedIcon(props: RyogoEnclosedIconType) {
  return (
    <div
      onClick={props.onClick}
      className={`${getBGColor(props.bgColor)} ${props.circular ? "rounded-full" : getBGIconRounded(props.size)} ${getBGIconSize(props.size)} flex shrink-0 justify-center items-center`}
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
