export type RyogoTextColorType =
  | "white"
  | "red"
  | "light"
  | "slate"
  | "brand"
  | "dark"
  | "yellow"

type RyogoTextWeightType = "font-normal" | "font-medium" | "font-bold"

const getTextColor = (color?: RyogoTextColorType) => {
  switch (color) {
    case "white":
      return "text-white dark:text-slate-950"
    case "light":
      return "text-slate-500 dark:text-slate-500"
    case "slate":
      return "text-slate-700 dark:text-slate-200"
    case "red":
      return "text-red-700 dark:text-red-300"
    case "yellow":
      return "text-yellow-700 dark:text-yellow-300"
    case "brand":
      return "text-sky-700 dark:text-sky-300"
    case "dark":
    //default is dark
    default:
      return "text-slate-950 dark:text-white"
  }
}

type RyogoTextType = {
  children: React.ReactNode
  color?: RyogoTextColorType
  weight?: RyogoTextWeightType
  className?: string
}

export function RyogoH1(props: RyogoTextType) {
  return (
    <h1
      className={`text-4xl lg:text-5xl ${props.weight ?? ""} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </h1>
  )
}

export function RyogoH2(props: RyogoTextType) {
  return (
    <h2
      className={`text-3xl lg:text-4xl ${props.weight ?? ""} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </h2>
  )
}

export function RyogoH3(props: RyogoTextType) {
  return (
    <h3
      className={`text-2xl lg:text-3xl ${props.weight ?? ""} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </h3>
  )
}

export function RyogoH4(props: RyogoTextType) {
  return (
    <h4
      className={`text-xl lg:text-2xl ${props.weight ?? ""} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </h4>
  )
}

export function RyogoP(props: RyogoTextType) {
  return (
    <p
      className={`text-base lg:text-lg ${props.weight ?? ""} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </p>
  )
}

export function RyogoSmall(props: RyogoTextType) {
  return (
    <small
      className={`text-[13px] lg:text-sm ${props.weight ?? ""} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </small>
  )
}

export function RyogoCaption(props: RyogoTextType) {
  return (
    <span
      className={`text-xs ${props.weight ?? ""} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </span>
  )
}

export function RyogoTiny(props: RyogoTextType) {
  return (
    <span
      className={`text-[10px] ${props.weight ?? ""} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </span>
  )
}
