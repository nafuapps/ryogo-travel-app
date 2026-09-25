import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoSmall, RyogoH4, RyogoCaption } from "@/components/typography"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export async function DashboardSectionHeader({
  title,
  href,
}: {
  title: string
  href?: React.ComponentProps<typeof Link>["href"]
}) {
  return (
    <SectionRowWrapper className="items-center justify-between">
      <RyogoH4 weight="font-bold" color="slate">
        {title}
      </RyogoH4>
      {href && (
        <Link href={href}>
          <RyogoEnclosedIcon
            icon={ChevronRight}
            size="sm"
            color="slate"
            bgColor="slate"
          />
        </Link>
      )}
    </SectionRowWrapper>
  )
}

export function DashboardRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full divide-y divide-slate-50 dark:divide-slate-700 border  rounded-md overflow-hidden">
      {children}
    </div>
  )
}

export function DashboardRowHeader({
  title,
  count,
}: {
  title: string
  count: number
}) {
  return (
    <div className="flex flex-row p-2 lg:p-3 bg-slate-50 dark:bg-slate-700 justify-between items-center">
      <RyogoCaption color="light">{title}</RyogoCaption>
      <RyogoCaption color="light">{count}</RyogoCaption>
    </div>
  )
}

export function DashboardLabelImageChip({
  label,
  children,
  end,
}: {
  label: string
  children: React.ReactNode
  end?: boolean
}) {
  return (
    <SectionRowWrapper
      small
      className={`items-center ${end ? "flex-row-reverse justify-end" : ""}`}
    >
      {children}
      <RyogoSmall color="slate">{label}</RyogoSmall>
    </SectionRowWrapper>
  )
}

export function DashboardChipItemWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`flex flex-row items-center justify-between gap-1 lg:gap-1.5 w-full hover:bg-slate-50 dark:hover:bg-slate-700 p-2 lg:p-3`}
    >
      {children}
    </div>
  )
}

export function DashboardBoxItemWrapper({
  children,
  highlight,
}: {
  children: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-1 lg:gap-1.5 w-full ${highlight ? "border-l-2 border-sky-700 dark:border-sky-300" : ""} hover:bg-slate-50 dark:hover:bg-slate-700 px-2 py-3 lg:px-3 lg:py-4`}
    >
      {children}
    </div>
  )
}
