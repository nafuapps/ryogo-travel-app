import { SubmitEventHandler } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      className={`bg-white rounded-lg shadow flex flex-col ${center ? "items-center" : ""} w-full gap-2 lg:gap-3 p-3 lg:p-4`}
    >
      {children}
    </div>
  )
}

export function SectionRowWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row gap-3 lg:gap-4 justify-between">
      {children}
    </div>
  )
}

export function SectionColWrapper({
  children,
  small,
  end,
  center,
}: {
  children: React.ReactNode
  small?: boolean
  end?: boolean
  center?: boolean
}) {
  return (
    <div
      className={`flex flex-col ${small ? "gap-1 lg:gap-1.5" : "gap-2 lg:gap-3"} ${end ? "items-end" : ""} ${center ? "items-center" : ""}`}
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
    <div className="flex flex-row items-center my-1 lg:my-1.5 gap-2 lg:gap-3">
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
    <div className="flex flex-col gap-0.5 lg:gap-1 items-start sm:items-center justify-center">
      {children}
    </div>
  )
}

export function StickyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3 py-3 bg-slate-100 sticky mt-auto shadow border-t-slate-200 bottom-0">
      {children}
    </div>
  )
}
