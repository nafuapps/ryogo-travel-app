import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { LucideIcon } from "lucide-react"

export default function PremiumAdvantageCard({
  icon,
  title,
  subtitle,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
}) {
  return (
    <div className="flex flex-row gap-2 lg:gap-3 border-2 border-slate-50 dark:border-slate-800 p-3 lg:p-4 rounded-lg w-full">
      <RyogoEnclosedIcon
        icon={icon}
        color="brand"
        bgColor="brand"
        size="sm"
        thick
        circular
      />
      <div className="flex flex-col gap-1 lg:gap-1.5">
        <RyogoSmall color="brand" weight="font-bold">
          {title}
        </RyogoSmall>
        <RyogoCaption color="slate">{subtitle}</RyogoCaption>
      </div>
    </div>
  )
}
