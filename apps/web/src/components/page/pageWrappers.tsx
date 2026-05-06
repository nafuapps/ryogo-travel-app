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

export function ContentWrapper({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
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
    <div className="flex flex-row items-center my-1 lg:my-1.5 gap-2 lg:gap-3">
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
