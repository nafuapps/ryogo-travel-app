import { Form } from "@/components/ui/form"
import { SubmitEventHandler } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"

export default function TripSheetFormWrapper<T extends FieldValues>({
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
        className="flex flex-col gap-3 lg:gap-4 px-4 lg:px-5"
      >
        {children}
      </form>
    </Form>
  )
}
