type RyogoTextColor = "white" | "red" | "light" | "slate" | "brand" | "dark"
type RyogoTextWeight = "font-normal" | "font-medium" | "font-bold"

const getTextColor = (color?: RyogoTextColor) => {
  if (color === "white") {
    return "text-white"
  }
  if (color === "red") {
    return "text-red-400"
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

export function RyogoH1({
  children,
  color,
  weight = "font-medium",
}: {
  children: React.ReactNode
  color?: RyogoTextColor
  weight?: RyogoTextWeight
}) {
  return (
    <h1
      className={`text-3xl md:text-4xl lg:text-5xl ${weight} ${getTextColor(color)}`}
    >
      {children}
    </h1>
  )
}

export function RyogoH2({
  children,
  color,
  weight = "font-bold",
}: {
  children: React.ReactNode
  color?: RyogoTextColor
  weight?: RyogoTextWeight
}) {
  return (
    <h2
      className={`text-2xl md:text-3xl lg:text-4xl ${weight} ${getTextColor(color)}`}
    >
      {children}
    </h2>
  )
}

export function RyogoH3({
  children,
  color,
  weight = "font-medium",
}: {
  children: React.ReactNode
  color?: RyogoTextColor
  weight?: RyogoTextWeight
}) {
  return (
    <h3 className={`text-xl lg:text-2xl ${weight} ${getTextColor(color)}`}>
      {children}
    </h3>
  )
}

export function RyogoH4({
  children,
  color,
  weight = "font-medium",
}: {
  children: React.ReactNode
  color?: RyogoTextColor
  weight?: RyogoTextWeight
}) {
  return (
    <h4 className={`text-lg lg:text-xl ${weight} ${getTextColor(color)}`}>
      {children}
    </h4>
  )
}

export function RyogoP({
  children,
  color,
  weight = "font-normal",
}: {
  children: React.ReactNode
  color?: RyogoTextColor
  weight?: RyogoTextWeight
}) {
  return (
    <p className={`text-base lg:text-lg ${weight} ${getTextColor(color)}`}>
      {children}
    </p>
  )
}

export function RyogoSmall({
  children,
  color,
  weight = "font-normal",
}: {
  children: React.ReactNode
  color?: RyogoTextColor
  weight?: RyogoTextWeight
}) {
  return (
    <small className={`text-sm lg:text-base ${weight} ${getTextColor(color)}`}>
      {children}
    </small>
  )
}

export function RyogoCaption({
  children,
  color,
  weight = "font-normal",
}: {
  children: React.ReactNode
  color?: RyogoTextColor
  weight?: RyogoTextWeight
}) {
  return (
    <span className={`text-xs lg:text-sm ${weight} ${getTextColor(color)}`}>
      {children}
    </span>
  )
}
