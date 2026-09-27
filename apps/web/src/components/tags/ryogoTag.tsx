import { LucideIcon } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoTiny } from "@/components/typography"

export default function RyogoTag({
  label,
  icon,
  className,
}: {
  label: string
  icon: LucideIcon
  className?: string
}) {
  return (
    <SectionRowWrapper
      small
      className={`items-center rounded bg-slate-100 dark:bg-slate-700 px-1.5 lg:px-2 py-1 lg:py-1.5 ${className ?? ""}`}
    >
      <RyogoIcon size="xs" icon={icon} color="light" />
      <RyogoTiny color="light">{label}</RyogoTiny>
    </SectionRowWrapper>
  )
}
