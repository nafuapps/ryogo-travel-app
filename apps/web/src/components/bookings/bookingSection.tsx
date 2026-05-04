import { SmallBold } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { LucideIcon } from "lucide-react"

export default function BookingSection({
  icon: Icon,
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
        <Icon className="size-4 lg:size-5 text-slate-700" />
        <SmallBold>{sectionTitle}</SmallBold>
      </div>
      <Separator />
      <div className="flex flex-col gap-3 lg:gap-4">{children}</div>
    </div>
  )
}
