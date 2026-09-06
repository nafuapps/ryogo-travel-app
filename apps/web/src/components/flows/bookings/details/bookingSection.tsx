import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoSmall } from "@/components/typography"
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
    <div
      id={sectionTitle}
      className="flex flex-col gap-4 lg:gap-5 p-4 lg:p-5 w-full mb-4 break-inside-avoid rounded-lg bg-white dark:bg-slate-900 empty:hidden"
    >
      <SectionRowWrapper center justifyStart>
        <RyogoIcon icon={icon} size="sm" />
        <RyogoSmall color="light" weight="font-bold">
          {sectionTitle}
        </RyogoSmall>
      </SectionRowWrapper>
      {children}
    </div>
  )
}
