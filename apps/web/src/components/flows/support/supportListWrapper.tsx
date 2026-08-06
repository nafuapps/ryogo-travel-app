import { RyogoSmall } from "@/components/typography"

export function SupportListWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap gap-5 lg:gap-6 rounded-lg border p-3 lg:p-4 justify-center">
      {children}
    </div>
  )
}

export function SupportListItem({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-1.5 lg:gap-2 items-center">
      {children}
      <RyogoSmall color="slate">{label}</RyogoSmall>
    </div>
  )
}
