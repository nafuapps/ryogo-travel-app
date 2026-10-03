import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoTiny, RyogoH3 } from "@/components/typography"

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
    <SectionColWrapper
      className={`w-full overflow-hidden rounded-lg p-4 lg:p-5 border ${
        selected
          ? "border-sky-700 dark:border-sky-300 bg-sky-100 dark:bg-sky-950"
          : "border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
      }`}
      onClick={onClick}
    >
      {children}
    </SectionColWrapper>
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
    <SectionRowWrapper
      small
      className={`w-full items-center justify-center px-2 py-1.5 lg:px-3 lg:py-2 rounded-md border ${selected ? "border-slate-700 dark:border-slate-300" : "border-slate-300 dark:border-slate-700"}`}
    >
      {children}
    </SectionRowWrapper>
  )
}

const BestTotalScore = 98
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
    <SectionColWrapper
      small
      className={`rounded-md items-center justify-center text-center p-3 lg:p-4 shrink-0 opacity-80 ${
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
      <RyogoTiny color="slate">{label}</RyogoTiny>
      <RyogoH3 weight="font-bold">{totalScore.toFixed(0)}</RyogoH3>
    </SectionColWrapper>
  )
}
