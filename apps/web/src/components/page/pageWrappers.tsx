import { SubmitEventHandler } from "react"
import { Form } from "@/components/ui/form"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { Caption, H2 } from "../typography"

export function MainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-lvh bg-slate-100 p-4 lg:p-5">
      {children}
    </div>
  )
}

export function PageWrapper({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      className="w-full h-full flex flex-col gap-3 lg:gap-4 overflow-y-scroll no-scrollbar pt-3 lg:pt-4"
    >
      {children}
    </div>
  )
}

export function SectionWrapper({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      className="bg-white rounded-lg flex flex-col gap-2 lg:gap-3 p-3 lg:p-4"
    >
      {children}
    </div>
  )
}

export function SectionHeaderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-row justify-start items-center my-1 lg:my-1.5 gap-2 lg:gap-3">
      {children}
    </div>
  )
}

export function GridWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid border border-slate-100 rounded-lg grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4 hover:bg-slate-100">
      {children}
    </div>
  )
}

export function GridItemWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 lg:gap-1 items-start sm:items-center justify-center">
      {children}
    </div>
  )
}

export function NewStepWrapper({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      className="bg-white rounded-lg flex flex-col gap-2 lg:gap-3 p-3 lg:p-4"
    >
      {children}
    </div>
  )
}

export function NewStepHeaderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-col gap-2 lg:gap-3">{children}</div>
}

export function NewStepTitleWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-row justify-between items-end gap-2 lg:gap-3">
      {children}
    </div>
  )
}

export function NewFormWrapper<T extends FieldValues>({
  id,
  form,
  children,
  onSubmit,
}: {
  id: string
  form: UseFormReturn<T, any, T>
  children: React.ReactNode
  onSubmit: SubmitEventHandler<HTMLFormElement>
}) {
  return (
    <Form {...form}>
      <form
        id={id}
        onSubmit={onSubmit}
        className="flex flex-col gap-4 lg:gap-5 h-full"
      >
        {children}
      </form>
    </Form>
  )
}

export function NewFormContentWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col relative gap-3 lg:gap-4 bg-white rounded-lg shadow p-3 lg:p-4">
      {children}
    </div>
  )
}

export function NewFormActionWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3 pt-3 bg-slate-100 sticky mt-auto shadow border-t-slate-200 bottom-0">
      {children}
    </div>
  )
}

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
