import { RyogoCaption, RyogoH4, RyogoSmall } from "@/components/typography"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Building } from "lucide-react"
import { AccountInfoContentWrapper, AccountInfoWrapper } from "./accountCommon"
import ChangeAgencyLogoSheet from "@/components/sheets/changeAgencyLogoSheet"

export default function AgencyInfoWrapper({
  id,
  logoUrl,
  isOwner,
  city,
  state,
  agencyName,
}: {
  id: string
  logoUrl: string | null
  isOwner: boolean
  city: string
  state: string
  agencyName: string
}) {
  return (
    <AccountInfoWrapper>
      <SectionColWrapper center small>
        {logoUrl ? (
          <RyogoImage src={getFileUrl(logoUrl)} alt={logoUrl} imageSize="lg" />
        ) : (
          <RyogoEnclosedIcon icon={Building} size="xl" />
        )}
        {isOwner && <ChangeAgencyLogoSheet agencyId={id} />}
      </SectionColWrapper>
      <AccountInfoContentWrapper>
        <RyogoH4 weight="font-bold">{agencyName}</RyogoH4>
        <RyogoSmall color="slate">{city}</RyogoSmall>
        <RyogoCaption color="light">{state}</RyogoCaption>
      </AccountInfoContentWrapper>
    </AccountInfoWrapper>
  )
}
