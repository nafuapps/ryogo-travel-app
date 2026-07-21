import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
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
    <div className="flex flex-row gap-2 lg:gap-3 bg-slate-50 dark:bg-slate-950 p-3 lg:p-4 rounded-lg w-full">
      <RyogoEnclosedIcon
        icon={icon}
        color="brand"
        bgColor="white"
        size="sm"
        circular
      />
      <div className="flex flex-col gap-1 lg:gap-1.5">
        <RyogoCaption color="brand" weight="font-bold">
          {title}
        </RyogoCaption>
        <RyogoCaption color="slate">{subtitle}</RyogoCaption>
      </div>
    </div>
  )
}
