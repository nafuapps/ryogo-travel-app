import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoSmall, RyogoH4 } from "@/components/typography"
import Link from "next/link"

export function DashboardSectionHeader(props: { title: string }) {
  return (
    <RyogoH4 weight="font-bold" color="slate">
      {props.title}
    </RyogoH4>
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
    <SectionRowWrapper center justifyEnd={end} reverse={end}>
      {children}
      <RyogoSmall color="slate">{label}</RyogoSmall>
    </SectionRowWrapper>
  )
}

export function DashboardItemWrapper({
  href,
  children,
}: {
  href: React.ComponentProps<typeof Link>["href"]
  children: React.ReactNode
}) {
  return (
    <Link href={href}>
      <div
        className={`flex flex-row items-center justify-between gap-1 lg:gap-1.5 w-full hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg px-0 py-1.5 lg:px-2`}
      >
        {children}
      </div>
    </Link>
  )
}
