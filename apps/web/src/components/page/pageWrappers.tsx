import { SubmitEventHandler } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-lvh bg-slate-100 px-5 lg:px-6 pt-4 lg:pt-5 pb-6 lg:pb-7">
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

export function FormWrapper<T extends FieldValues>({
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
      <ScrollArea>
        <form
          id={id}
          onSubmit={onSubmit}
          className="flex flex-col gap-4 lg:gap-5 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          {children}
        </form>
      </ScrollArea>
    </Form>
  )
}

export function SectionWrapper({
  id,
  children,
  center,
}: {
  id: string
  children: React.ReactNode
  center?: boolean
}) {
  return (
    <div
      id={id}
      className={`bg-white rounded-lg shadow flex flex-col ${center ? "items-center" : ""} w-full gap-3 lg:gap-4 p-4 lg:p-5`}
    >
      {children}
    </div>
  )
}

export function SectionRowWrapper({
  children,
  small,
  center,
  end,
  justifyStart,
  wFull,
  onClick,
}: {
  children: React.ReactNode
  small?: boolean
  center?: boolean
  end?: boolean
  justifyStart?: boolean
  wFull?: boolean
  onClick?: () => void
}) {
  return (
    <div
      className={`flex flex-row ${wFull ? "w-full" : ""} ${small ? "gap-1 lg:gap-1.5" : "gap-2 lg:gap-3"} ${justifyStart ? "justify-start" : "justify-between"} ${center ? "items-center" : ""} ${end ? "items-end" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function SectionColWrapper({
  children,
  small,
  end,
  center,
  justifyBetween,
  overflowScroll,
  wFull,
}: {
  children: React.ReactNode
  small?: boolean
  end?: boolean
  center?: boolean
  justifyBetween?: boolean
  overflowScroll?: boolean
  wFull?: boolean
}) {
  return (
    <div
      className={`flex flex-col ${small ? "gap-1 lg:gap-1.5" : "gap-2 lg:gap-3"} ${end ? "items-end" : ""} ${center ? "items-center" : ""} ${justifyBetween ? "justify-between" : ""} ${overflowScroll ? "overflow-y-scroll m-1" : ""} ${wFull ? "w-full" : ""}`}
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
    <div className="flex flex-row items-center my-0.5 lg:my-1 gap-2 lg:gap-3">
      {children}
    </div>
  )
}

export function GridWrapper({
  children,
  hasChin,
  highlight,
}: {
  children: React.ReactNode
  hasChin?: boolean
  highlight?: boolean
}) {
  return (
    <div
      className={`grid ${highlight ? "bg-slate-900 hover:bg-slate-800" : "border border-slate-100 hover:bg-slate-100"} ${hasChin ? "rounded-t-lg" : "rounded-lg"} grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4`}
    >
      {children}
    </div>
  )
}

export function GridItemWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 lg:gap-1 items-start justify-start sm:items-center sm:justify-center">
      {children}
    </div>
  )
}

export function StickyActionWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3 py-3 bg-slate-100 sticky mt-auto shadow border-t-slate-200 bottom-0">
      {children}
    </div>
  )
}
