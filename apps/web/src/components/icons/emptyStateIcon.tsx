import { LucideIcon } from "lucide-react"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { RyogoIcon } from "./ryogoIcon"

export default function EmptyStateIcon({
  icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <SectionColWrapper className="self-center my-auto items-center">
      <RyogoIcon icon={icon} size="xl" color="light" />
      <RyogoCaption color="light">{label}</RyogoCaption>
    </SectionColWrapper>
  )
}
