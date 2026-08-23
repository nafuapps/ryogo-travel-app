import { RyogoCaption, RyogoH2 } from "@/components/typography"

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
      className={`flex flex-row justify-between gap-2 lg:gap-3 rounded-lg p-3 lg:p-4 border ${
        selected
          ? "border-sky-700 dark:border-sky-200 bg-sky-50 dark:bg-sky-950"
          : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
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
  selected,
}: {
  children: React.ReactNode
  selected: boolean
}) {
  return (
    <div
      className={`flex flex-row gap-1 lg:gap-1.5 items-center justify-center text-center px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg border ${selected ? "border-slate-700 dark:border-slate-300" : "border-slate-300 dark:border-slate-700"}`}
    >
      {children}
    </div>
  )
}

const BestTotalScore = 100
const GoodTotalScore = 80
const MediumTotalScore = 60
const BadTotalScore = 30

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
          ? "bg-red-300 dark:bg-red-700"
          : totalScore < MediumTotalScore
            ? "bg-orange-300 dark:bg-orange-700"
            : totalScore < GoodTotalScore
              ? "bg-yellow-300 dark:bg-yellow-700"
              : totalScore < BestTotalScore
                ? "bg-green-300 dark:bg-green-700"
                : "bg-sky-300 dark:bg-sky-700"
      }`}
    >
      <RyogoCaption color="slate">{label}</RyogoCaption>
      <RyogoH2 weight="font-bold">{totalScore.toFixed(0)}</RyogoH2>
    </div>
  )
}
