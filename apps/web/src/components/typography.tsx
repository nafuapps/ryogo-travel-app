type RyogoTextColor =
  | "white"
  | "red"
  | "light"
  | "slate"
  | "brand"
  | "dark"
  | "yellow"
type RyogoTextWeight = "font-normal" | "font-medium" | "font-bold"

const getTextColor = (color?: RyogoTextColor) => {
  if (color === "white") {
    return "text-white"
  }
  if (color === "red") {
    return "text-red-400"
  }
  if (color === "yellow") {
    return "text-yellow-700"
  }
  if (color === "light") {
    return "text-slate-400"
  }
  if (color === "slate") {
    return "text-slate-700"
  }
  if (color === "brand") {
    return "text-sky-700"
  }
  if (color === "dark") {
    return "text-slate-950"
  }
  //default is dark
  return "text-slate-950"
}

type RyogoTextProps = {
  children: React.ReactNode
  color?: RyogoTextColor
  weight?: RyogoTextWeight
  className?: string
}

export function RyogoH1(props: RyogoTextProps) {
  return (
    <h1
      className={`text-3xl md:text-4xl lg:text-5xl ${props.weight} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </h1>
  )
}

export function RyogoH2(props: RyogoTextProps) {
  return (
    <h2
      className={`text-2xl md:text-3xl lg:text-4xl ${props.weight} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </h2>
  )
}

export function RyogoH3(props: RyogoTextProps) {
  return (
    <h3
      className={`text-xl md:text-2xl lg:text-3xl ${props.weight} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </h3>
  )
}

export function RyogoH4(props: RyogoTextProps) {
  return (
    <h4
      className={`text-lg md:text-xl lg:text-2xl ${props.weight} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </h4>
  )
}

export function RyogoP(props: RyogoTextProps) {
  return (
    <p
      className={`text-base lg:text-lg ${props.weight} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </p>
  )
}

export function RyogoSmall(props: RyogoTextProps) {
  return (
    <small
      className={`text-sm lg:text-base ${props.weight} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </small>
  )
}

export function RyogoCaption(props: RyogoTextProps) {
  return (
    <span
      className={`text-xs lg:text-[0.8125rem] ${props.weight} ${getTextColor(props.color)} ${props.className ?? ""}`}
    >
      {props.children}
    </span>
  )
}
