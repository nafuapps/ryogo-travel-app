import { SubmitEventHandler } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { Form } from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import RyoGoLogo from "@/components/logo"

export function AuthMainWrapper({
  children,
  src,
}: {
  children: React.ReactNode
  src?: string
}) {
  return (
    <div className="relative flex flex-col gap-10 md:gap-12 min-h-full overflow-scroll no-scrollbar items-center bg-slate-50 dark:bg-slate-950 w-full md:w-1/2 p-6 md:p-8 lg:p-10">
      {src ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
            style={{ backgroundImage: `url(${src})` }}
          />
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 md:hidden" />
        </>
      ) : null}
      <div className="z-10 flex w-full h-full flex-col items-center gap-10 md:gap-12">
        <Link href="/">
          <RyoGoLogo />
        </Link>
        {children}
      </div>
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
    <div className="flex flex-col justify-center w-full rounded-lg shadow bg-white dark:bg-slate-900 p-6 md:p-8 gap-3 lg:gap-4">
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
      className={`grid grid-cols-1 ${length > 3 ? "lg:grid-cols-2" : ""} gap-2 lg:gap-3 overflow-y-scroll no-scrollbar`}
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
        className="flex flex-col gap-4 md:gap-5"
      >
        {children}
      </form>
    </Form>
  )
}

export function AuthImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      loading="eager"
      src={src}
      alt={alt}
      className="object-cover"
      fill
      sizes="(min-width: 768px) 50vw"
    />
  )
}
