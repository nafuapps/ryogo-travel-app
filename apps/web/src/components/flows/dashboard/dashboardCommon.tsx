import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoSmall, RyogoH4, RyogoCaption } from "@/components/typography"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export async function DashboardSectionHeader(props: {
  title: string
  href?: React.ComponentProps<typeof Link>["href"]
}) {
  return (
    <SectionRowWrapper center>
      <RyogoH4 weight="font-bold" color="light">
        {props.title}
      </RyogoH4>
      {props.href && (
        <Link href={props.href}>
          <RyogoEnclosedIcon icon={ChevronRight} size="sm" color="slate" />
        </Link>
      )}
    </SectionRowWrapper>
  )
}

export function DashboardRowHeader(props: { title: string; count: number }) {
  return (
    <SectionRowWrapper>
      <RyogoCaption color="light">{props.title}</RyogoCaption>
      <RyogoCaption color="light">{props.count}</RyogoCaption>
    </SectionRowWrapper>
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
