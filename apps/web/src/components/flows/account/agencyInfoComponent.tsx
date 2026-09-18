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
import IdCopyPill from "@/components/pills/idCopyPill"
import ChangeAgencyLogoSheet from "@/components/sheets/changeAgencyLogoSheet"

export default function AgencyInfoComponent({
  id,
  logoUrl,
  city,
  state,
  agencyName,
  status,
  canChange,
}: {
  id: string
  logoUrl: string | null
  city: string
  state: string
  agencyName: string
  status: AgencyStatusEnum
  canChange?: boolean
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
        <ChangeAgencyLogoSheet agencyId={id} canChange={canChange}>
          <RyogoEnclosedIcon icon={Building} size="xl" />
        </ChangeAgencyLogoSheet>
      )}
      <SectionColWrapper className="items-center">
        <RyogoH4 weight="font-bold">{agencyName}</RyogoH4>
        <SectionRowWrapper className="items-center">
          <RyogoIcon icon={MapPin} size="sm" color="light" />
          <RyogoSmall color="light">{city + ", " + state}</RyogoSmall>
        </SectionRowWrapper>
        <SectionRowWrapper className="items-center">
          <AgencyStatusPill status={status} size="lg" />
          <IdCopyPill id={id} />
        </SectionRowWrapper>
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
