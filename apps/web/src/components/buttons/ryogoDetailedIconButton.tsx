import { ChevronRight, LucideIcon } from "lucide-react"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"

export default function RyogoDetailedIconButton({
  label,
  icon,
  onClick,
  subtitle,
  className,
}: {
  label: string
  icon: LucideIcon
  onClick?: () => void
  subtitle?: string
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2 lg:p-3 gap-2 lg:gap-3 flex hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition w-full ${className ?? ""}`}
    >
      <RyogoEnclosedIcon icon={icon} size="sm" color="black" />
      <div className="flex flex-col justify-center items-start text-start gap-0.75 lg:gap-1 w-full">
        <RyogoCaption weight="font-bold">{label}</RyogoCaption>
        {subtitle && <RyogoCaption color="light">{subtitle}</RyogoCaption>}
      </div>
      <RyogoIcon icon={ChevronRight} size="sm" color="light" />
    </button>
  )
}
