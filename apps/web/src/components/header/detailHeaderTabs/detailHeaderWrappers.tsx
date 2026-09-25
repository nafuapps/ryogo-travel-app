import { RyogoSmall } from "@/components/typography"
import { Route } from "next"
import Link from "next/link"

export function DetailsHeaderTabWrapper<T extends string>({
  links,
  selectedTab,
  getLabel,
}: {
  links: Record<T, string>
  selectedTab: T
  getLabel: (tab: T) => string
}) {
  const tabs = Object.keys(links) as T[]

  return (
    <div className="flex items-center w-full rounded-lg transition border bg-white dark:bg-slate-800 flex-row gap-1.5 lg:gap-2 p-1.5 lg:p-2 self-center my-2 lg:my-3">
      {tabs.map((tab) => (
        <DetailsHeaderTabItem
          key={tab}
          label={getLabel(tab)}
          selected={selectedTab === tab}
          href={links[tab]}
        />
      ))}
    </div>
  )
}

function DetailsHeaderTabItem({
  label,
  selected,
  href,
}: {
  label: string
  selected: boolean
  href: string
}) {
  return (
    <Link href={href as Route} className="w-full">
      <div
        className={`flex w-full items-center rounded transition justify-center px-2 py-1.5 lg:px-2.5 lg:py-2 ${
          selected
            ? "bg-slate-900 dark:bg-slate-50 shadow"
            : "hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-xs"
        }`}
      >
        <RyogoSmall color={selected ? "white" : "slate"}>{label}</RyogoSmall>
      </div>
    </Link>
  )
}
