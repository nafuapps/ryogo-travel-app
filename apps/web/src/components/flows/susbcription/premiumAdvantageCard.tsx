import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
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
    <div className="flex flex-col gap-2 lg:gap-3 border-2 border-slate-50 dark:border-slate-800 p-3 lg:p-4 rounded-lg w-full">
      <SectionRowWrapper center justifyStart>
        <RyogoEnclosedIcon
          icon={icon}
          color="brand"
          bgColor="brand"
          size="sm"
          thick
          circular
        />
        <RyogoP color="brand" weight="font-medium">
          {title}
        </RyogoP>
      </SectionRowWrapper>
      <RyogoCaption color="slate">{subtitle}</RyogoCaption>
    </div>
  )
}
