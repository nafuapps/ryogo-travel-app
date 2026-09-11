import { RyogoH4, RyogoSmall } from "@/components/typography"
import {
  InfoContentWrapper,
  InfoWrapper,
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Building, MapPin } from "lucide-react"
import ChangeAgencyLogoSheet from "@/components/sheets/changeAgencyLogoSheet"
import { AgencyStatusPill } from "@/components/pills/ryogoPills"
import { AgencyStatusEnum } from "@ryogo-travel-app/db/schema"

export default function AgencyInfoComponent({
  id,
  logoUrl,
  isOwner,
  city,
  state,
  agencyName,
  status,
}: {
  id: string
  logoUrl: string | null
  isOwner: boolean
  city: string
  state: string
  agencyName: string
  status: AgencyStatusEnum
}) {
  return (
    <InfoWrapper>
      <SectionColWrapper center small>
        {logoUrl ? (
          <RyogoImage src={getFileUrl(logoUrl)} alt={logoUrl} imageSize="lg" />
        ) : (
          <RyogoEnclosedIcon icon={Building} size="xl" />
        )}
        {isOwner && <ChangeAgencyLogoSheet agencyId={id} />}
      </SectionColWrapper>
      <InfoContentWrapper>
        <RyogoH4 weight="font-bold">{agencyName}</RyogoH4>
        <SectionRowWrapper center small>
          <RyogoIcon icon={MapPin} size="sm" color="light" />
          <RyogoSmall color="light">{city + ", " + state}</RyogoSmall>
        </SectionRowWrapper>
        <AgencyStatusPill status={status} className="mt-auto self-center" />
      </InfoContentWrapper>
    </InfoWrapper>
  )
}
