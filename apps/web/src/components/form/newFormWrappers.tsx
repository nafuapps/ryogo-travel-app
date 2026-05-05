import { Form } from "lucide-react"
import { SubmitEventHandler } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"

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
