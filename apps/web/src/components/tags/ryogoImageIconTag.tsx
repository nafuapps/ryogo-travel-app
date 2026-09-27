import { LucideIcon, User } from "lucide-react"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoCaption, RyogoTiny } from "@/components/typography"

export default function RyogoImageIconTag({
  label,
  url,
  subtitle,
  icon,
  className,
}: {
  label: string
  url?: string | null
  subtitle?: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <SectionRowWrapper className={`items-center ${className ?? ""}`}>
      {url ? (
        <RyogoImage src={getFileUrl(url)} alt={label} imageSize="xs" />
      ) : (
        <RyogoEnclosedIcon icon={icon ?? User} size="sm" />
      )}
      <SectionColWrapper small>
        <RyogoCaption color="slate">{label}</RyogoCaption>
        {subtitle && <RyogoTiny color="light">{subtitle}</RyogoTiny>}
      </SectionColWrapper>
    </SectionRowWrapper>
  )
}
