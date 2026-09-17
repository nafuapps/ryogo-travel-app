import { RyogoSmall } from "@/components/typography"

export function DetailsHeaderTabWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex rounded-lg transition bg-slate-200 dark:bg-slate-900 flex-row gap-1.5 lg:gap-2 p-1.5 lg:p-2 self-center my-2 lg:my-3">
      {children}
    </div>
  )
}

export function DetailsHeaderTabItem({
  label,
  selected,
}: {
  label: string
  selected: boolean
}) {
  return (
    <div
      className={`flex items-center rounded transition justify-center px-2 py-1.5 lg:px-2.5 lg:py-2 ${
        selected
          ? "bg-white dark:bg-slate-700 shadow"
          : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-xs"
      }`}
    >
      <RyogoSmall color={selected ? "dark" : "slate"}>{label}</RyogoSmall>
    </div>
  )
}
