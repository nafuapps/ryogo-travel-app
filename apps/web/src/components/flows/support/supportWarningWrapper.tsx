import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { BadgeInfo } from "lucide-react"

export function SupportWarningWrapper({ text }: { text: string }) {
  return (
    <div className="flex gap-1.5 lg:gap-2 items-center border p-2 lg:p-3 rounded-lg">
      <RyogoIcon icon={BadgeInfo} size="sm" color="yellow" />
      <RyogoCaption color="yellow">{text}</RyogoCaption>
    </div>
  )
}
