import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
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
    <SectionWrapper id={sectionTitle}>
      <div className="flex gap-1.5 lg:gap-2 items-center">
        <RyogoIcon icon={icon} size="sm" />
        <RyogoCaption color="slate">{sectionTitle}</RyogoCaption>
      </div>
      <div className="flex flex-col gap-3 lg:gap-4">{children}</div>
    </SectionWrapper>
  )
}
