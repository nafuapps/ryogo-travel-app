import { RyogoH4, RyogoSmall } from "@/components/typography"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Building, MapPin } from "lucide-react"
import { AgencyStatusPill } from "@/components/pills/ryogoPills"
import { AgencyStatusEnum } from "@ryogo-travel-app/db/schema"

export default function AgencyInfoComponent({
  logoUrl,
  city,
  state,
  agencyName,
  status,
}: {
  logoUrl: string | null
  city: string
  state: string
  agencyName: string
  status: AgencyStatusEnum
}) {
  return (
    <SectionColWrapper className="items-center justify-center">
      {logoUrl ? (
        <RyogoDialogImage
          src={getFileUrl(logoUrl)}
          alt={logoUrl}
          imageSize="lg"
        />
      ) : (
        <RyogoEnclosedIcon icon={Building} size="xl" />
      )}
      <SectionColWrapper small className="items-center">
        <RyogoH4 weight="font-bold">{agencyName}</RyogoH4>
        <SectionRowWrapper small className="items-center">
          <RyogoIcon icon={MapPin} size="sm" color="light" />
          <RyogoSmall color="light">{city + ", " + state}</RyogoSmall>
        </SectionRowWrapper>
        <AgencyStatusPill status={status} className="mt-auto self-center" />
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
