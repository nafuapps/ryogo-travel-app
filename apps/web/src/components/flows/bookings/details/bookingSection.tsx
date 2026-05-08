import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoSmall } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { LucideIcon } from "lucide-react"

export default function BookingSection({
  icon,
  sectionTitle,
  children,
}: {
  icon: LucideIcon
  sectionTitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3 rounded-lg bg-white p-4 lg:p-5">
      <div className="flex gap-1.5 lg:gap-2 items-center">
        <RyogoIcon icon={icon} size="sm" />
        <RyogoSmall weight="font-bold">{sectionTitle}</RyogoSmall>
      </div>
      <Separator />
      <div className="flex flex-col gap-3 lg:gap-4">{children}</div>
    </div>
  )
}
