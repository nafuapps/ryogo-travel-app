import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoSmall } from "@/components/typography"

export function AccountLineItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <SectionRowWrapper center>
      <RyogoCaption color="light">{label}</RyogoCaption>
      <RyogoCaption color="slate">{value}</RyogoCaption>
    </SectionRowWrapper>
  )
}

export function AccountLineWrapper({
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

export function AccountIDWrapper({ id, label }: { id: string; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 lg:gap-4 px-3 lg:px-4 py-2 lg:py-3 bg-slate-200 dark:bg-slate-800">
      <RyogoCaption color="light">{label}</RyogoCaption>
      <SectionRowWrapper center justifyEnd>
        <RyogoSmall color="slate">{id}</RyogoSmall>
        <CopyClipboardButton label={id} />
      </SectionRowWrapper>
    </div>
  )
}

export function AccountDetailsBorderWrapper({
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
export function AccountDetailsContentWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-3 lg:p-4 gap-4 lg:gap-5 flex flex-col">{children}</div>
  )
}
export function AccountInfoWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center lg:flex-row lg:items-start gap-3 lg:gap-4 p-3 lg:p-4">
      {children}
    </div>
  )
}

export function AccountInfoContentWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3 items-center lg:items-start">
      {children}
    </div>
  )
}
