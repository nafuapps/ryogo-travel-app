import { Caption, H2 } from "@/components/typography"

export function AssignTileWrapper({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className={`flex flex-row justify-between items-start gap-2 lg:gap-3 rounded-lg p-3 lg:p-4 border ${
        selected
          ? "border-sky-700 bg-sky-100"
          : "border-slate-100 hover:bg-slate-50"
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function AssignTileContentWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 lg:gap-4 justify-between h-full overflow-hidden">
      {children}
    </div>
  )
}

export function AssignTileHeaderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-col gap-1 lg:gap-1.5">{children}</div>
}

export function AssignTileFooterWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-row flex-wrap gap-3 lg:gap-4">{children}</div>
  )
}

export function AssignTileScoreWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-end justify-between gap-3 lg:gap-4 h-full">
      {children}
    </div>
  )
}

export function AssignTileStatusWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-row gap-1 lg:gap-1.5 items-center justify-center text-center px-2 py-1 lg:px-3 lg:py-1.5 rounded-full border border-slate-300">
      {children}
    </div>
  )
}

export const BestTotalScore = 100
export const GoodTotalScore = 80
export const MediumTotalScore = 60
export const BadTotalScore = 30

export function RyoGoScoreWrapper({
  totalScore,
  label,
}: {
  totalScore: number
  label: string
}) {
  return (
    <div
      className={`flex flex-col rounded-lg items-center justify-center text-center gap-1 lg:gap-1.5 p-3 lg:p-4 ${
        totalScore < BadTotalScore
          ? "bg-red-300"
          : totalScore < MediumTotalScore
            ? "bg-orange-300"
            : totalScore < GoodTotalScore
              ? "bg-yellow-300"
              : totalScore < BestTotalScore
                ? "bg-green-300"
                : "bg-sky-300"
      }`}
    >
      <Caption>{label}</Caption>
      <H2>{totalScore.toFixed(0)}</H2>
    </div>
  )
}
