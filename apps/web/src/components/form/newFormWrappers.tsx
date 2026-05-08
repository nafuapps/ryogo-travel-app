import { SubmitEventHandler } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { Form } from "@/components/ui/form"

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

export function NewStepWrapper({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="flex flex-col gap-4 w-full h-full">
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

export function NewStepGridWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 lg:gap-3">
      {children}
    </div>
  )
}
