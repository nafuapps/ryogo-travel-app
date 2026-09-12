import { SubmitEventHandler, Suspense } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { PageSkeleton } from "./loadingWrappers"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import {
  RyogoCaption,
  RyogoP,
  RyogoSmall,
  RyogoTiny,
} from "@/components/typography"
import { format } from "date-fns"
import { LucideIcon, SquarePen } from "lucide-react"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"

export function OnboardingPageWrapper({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      className="flex flex-col gap-4 lg:gap-5 w-full h-full overflow-y-scroll no-scrollbar px-6 py-8 md:px-8 md:py-10"
    >
      {children}
    </div>
  )
}

export function MainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-dvh min-h-0 bg-slate-100 dark:bg-slate-950 px-5 lg:px-6 pt-3 lg:pt-4 pb-6 lg:pb-7">
      {children}
    </div>
  )
}

export function PageWrapper({
  id,
  children,
  disableScrollInMobile, //For controlling scrolling with DoubleContentWrapper in Mobile screen
}: {
  id: string
  children: React.ReactNode
  disableScrollInMobile?: boolean
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <div
        id={id}
        className={`w-full flex flex-col gap-3 lg:gap-4 ${disableScrollInMobile ? "lg:overflow-y-scroll" : "h-full overflow-y-scroll mt-3 lg:mt-4"} no-scrollbar`}
      >
        {children}
      </div>
    </Suspense>
  )
}

export function SideWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full lg:w-2/5 2xl:max-w-sm lg:max-w-xs lg:min-w-2xs gap-3 lg:gap-4 lg:overflow-y-scroll no-scrollbar">
      {children}
    </div>
  )
}

export function DoubleContentWrapper({
  children,
  sideOnTop,
}: {
  children: React.ReactNode
  sideOnTop?: boolean
}) {
  return (
    <div
      className={`flex flex-col ${sideOnTop ? "[&>*:first-child]:order-2 [&>*:last-child]:order-1 lg:[&>*:first-child]:order-0 lg:[&>*:last-child]:order-0" : ""} lg:flex-row gap-5 lg:gap-6 mt-3 lg:mt-4 w-full overflow-y-scroll no-scrollbar`}
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
  hFull = true,
  justifyCenter,
}: {
  id: string
  form: UseFormReturn<T, any, T>
  children: React.ReactNode
  onSubmit?: SubmitEventHandler<HTMLFormElement>
  hFull?: boolean
  justifyCenter?: boolean
}) {
  return (
    <Form {...form}>
      <form
        id={id}
        onSubmit={onSubmit}
        className={`flex flex-col gap-3 lg:gap-4 w-full ${hFull ? "h-full" : ""} ${justifyCenter ? "justify-center" : ""}`}
      >
        {children}
      </form>
    </Form>
  )
}

export function FormContentWrapper({
  children,
  asCard = true,
  className,
}: {
  children: React.ReactNode
  asCard?: boolean
  className?: string
}) {
  return (
    <div
      className={`flex flex-col relative gap-3 lg:gap-4 ${asCard ? "bg-white dark:bg-slate-900 rounded-lg shadow p-4 lg:p-5" : ""}  ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

export function GridWrapper({
  id,
  children,
  className,
  bgColor,
  overflowScroll,
}: {
  id: string
  children: React.ReactNode
  className?: string
  bgColor?: string
  overflowScroll?: boolean
}) {
  return (
    <div
      id={id}
      className={`${bgColor ?? "bg-white dark:bg-slate-900"} rounded-lg shadow grid grid-cols-1 lg:grid-cols-2 w-full gap-3 lg:gap-4 p-4 lg:p-5 ${className ?? ""} ${overflowScroll ? "overflow-y-scroll no-scrollbar" : ""}`}
    >
      {children}
    </div>
  )
}

export function SectionWrapper({
  id,
  children,
  center,
  bgColor,
}: {
  id: string
  children: React.ReactNode
  center?: boolean
  bgColor?: string
}) {
  return (
    <div
      id={id}
      className={`${bgColor ?? "bg-white dark:bg-slate-900"} rounded-lg shadow flex flex-col ${center ? "items-center" : ""} w-full gap-4 lg:gap-5 p-4 lg:p-5`}
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
  justifyEnd,
  wFull,
  onClick,
  reverse,
}: {
  children: React.ReactNode
  small?: boolean
  center?: boolean
  end?: boolean
  justifyStart?: boolean
  justifyEnd?: boolean
  wFull?: boolean
  onClick?: () => void
  reverse?: boolean
}) {
  return (
    <div
      className={`flex ${reverse ? "flex-row-reverse" : "flex-row"} ${wFull ? "w-full" : ""} ${small ? "gap-1 lg:gap-1.5" : "gap-2.5 lg:gap-3"} ${justifyStart ? "justify-start" : justifyEnd ? "justify-end" : "justify-between"} ${center ? "items-center" : ""} ${end ? "items-end" : ""}  empty:hidden`}
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
  hFull,
}: {
  children: React.ReactNode
  small?: boolean
  end?: boolean
  center?: boolean
  justifyBetween?: boolean
  overflowScroll?: boolean
  wFull?: boolean
  hFull?: boolean
}) {
  return (
    <div
      className={`flex flex-col ${small ? "gap-1.5 lg:gap-2" : "gap-2.5 lg:gap-3"} ${end ? "items-end" : ""} ${center ? "items-center" : ""} ${justifyBetween ? "justify-between" : ""} ${overflowScroll ? "overflow-y-scroll m-1 scrollbar-none" : ""} ${wFull ? "w-full" : ""} ${hFull ? "h-full" : ""}`}
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

export function HoverGridWrapper({
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
      className={`grid ${highlight ? "bg-slate-900 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-100" : "border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"} ${hasChin ? "rounded-t-lg" : "rounded-lg"} grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4`}
    >
      {children}
    </div>
  )
}
export function PlainGridWrapper({
  children,
  hasChin,
}: {
  children: React.ReactNode
  hasChin?: boolean
}) {
  return (
    <div
      className={`grid border border-slate-100 dark:border-slate-800  ${hasChin ? "rounded-t-lg" : "rounded-lg"} grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4`}
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
  bgTransparent,
}: {
  children: React.ReactNode
  bgTransparent?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-2 lg:gap-3 py-2 lg:py-3 sticky mt-auto bottom-0 ${bgTransparent ? "bg-transparent" : "bg-slate-100 dark:bg-slate-950 border-t"}`}
    >
      {children}
    </div>
  )
}

export function TileGridWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 lg:gap-3">
      {children}
    </div>
  )
}

export function DetailsBorderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="border flex flex-col rounded-md overflow-hidden">
      {children}
    </div>
  )
}

export function DetailsContentWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-3 lg:p-4 gap-4 lg:gap-5 flex flex-col h-full">
      {children}
    </div>
  )
}

export function DetailsHeaderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 lg:gap-4 px-3 lg:px-4 py-2 lg:py-3 bg-slate-200 dark:bg-slate-800">
      {children}
    </div>
  )
}

export function DetailsIDWrapper({ id, label }: { id: string; label: string }) {
  return (
    <>
      <RyogoCaption color="light">{label}</RyogoCaption>
      <SectionRowWrapper center justifyEnd>
        <RyogoSmall color="slate">{id}</RyogoSmall>
        <CopyClipboardButton label={id} />
      </SectionRowWrapper>
    </>
  )
}

export function DetailsLineItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <SectionRowWrapper center>
      <RyogoCaption color="light">{label}</RyogoCaption>
      <RyogoCaption color="slate" className="text-end">
        {value}
      </RyogoCaption>
    </SectionRowWrapper>
  )
}

export function DetailsLineWrapper({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <SectionRowWrapper center>
      <RyogoCaption color="light">{label}</RyogoCaption>
      {children}
    </SectionRowWrapper>
  )
}

export function InfoWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 lg:gap-4 p-3 lg:p-4">
      {children}
    </div>
  )
}

export function InfoContentWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5 lg:gap-2 items-center my-2">
      {children}
    </div>
  )
}

export function DateWrapper({
  date,
  showYear = true,
}: {
  date: Date
  showYear?: boolean
}) {
  return (
    <div className="rounded-md bg-slate-100 dark:bg-slate-800 py-2 lg:py-3 px-5 lg:px-6 flex flex-col items-center justify-center">
      <RyogoCaption color="slate">{format(date, "MMM")}</RyogoCaption>
      <RyogoP color="slate" weight="font-bold">
        {format(date, "dd")}
      </RyogoP>
      {showYear && <RyogoTiny color="light">{format(date, "yyyy")}</RyogoTiny>}
    </div>
  )
}

export function AddInfoWrapper({
  icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <div className="border border-dashed rounded-md flex items-center p-3 lg:p-4 gap-2 lg:gap-3 hover:bg-slate-100 dark:hover:bg-slate-800">
      <RyogoEnclosedIcon icon={icon} size="sm" color="black" />
      <RyogoCaption color="light">{label}</RyogoCaption>
    </div>
  )
}

export function EditInfoWrapper({
  label,
  value,
  canEdit,
  icon,
}: {
  label: string
  value: string
  canEdit: boolean
  icon: LucideIcon
}) {
  return (
    <div
      className={`border flex p-3 lg:p-4 gap-2 lg:gap-3 justify-between items-center rounded-md ${canEdit ? "hover:bg-slate-100 dark:hover:bg-slate-800" : ""}`}
    >
      <RyogoEnclosedIcon icon={icon} size="sm" color="black" />
      <SectionColWrapper wFull small>
        <RyogoCaption color="light">{label}</RyogoCaption>
        <RyogoSmall color="slate">{value}</RyogoSmall>
      </SectionColWrapper>
      {canEdit && <RyogoIcon icon={SquarePen} size="sm" />}
    </div>
  )
}
