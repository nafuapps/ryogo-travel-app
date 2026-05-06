import { SubmitEventHandler } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { Form } from "@/components/ui/form"

export function AuthMainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-12 md:gap-16 h-full items-center justify-start bg-slate-50 w-full md:w-1/2 p-6 md:p-8 lg:p-10">
      {children}
    </div>
  )
}

export function AuthSideWrapper({ children }: { children: React.ReactNode }) {
  return <div className="md:flex md:w-1/2 relative hidden">{children}</div>
}

export function AuthSectionWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full h-full items-center justify-between">
      {children}
    </div>
  )
}

export function AuthPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center w-full rounded-lg shadow bg-white p-6 md:p-8 gap-2 lg:gap-3">
      {children}
    </div>
  )
}

export function AuthFooterWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 md:gap-3">{children}</div>
  )
}

export function AuthActionWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 w-full">{children}</div>
}

export function AuthAccountsWrapper({
  length,
  children,
}: {
  length: number
  children: React.ReactNode
}) {
  return (
    <div
      className={`grid grid-cols-1 ${length > 3 ? "lg:grid-cols-2" : ""} gap-3 lg:gap-4 overflow-y-scroll no-scrollbar`}
    >
      {children}
    </div>
  )
}

export function AuthFormWrapper<T extends FieldValues>({
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
        className="flex flex-col gap-3 md:gap-4"
      >
        {children}{" "}
      </form>
    </Form>
  )
}
