import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionRowWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoP, RyogoCaption } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Building2 } from "lucide-react"

export default function BookingAgencyCard({
  agency,
}: {
  agency: NonNullable<FindBookingDetailsByIdType>["agency"]
}) {
  return (
    <SectionRowWrapper className="rounded-lg p-2 lg:p-3 items-center">
      {agency.logoUrl ? (
        <RyogoImage
          src={getFileUrl(agency.logoUrl)}
          alt={agency.businessName}
          imageSize="md"
        />
      ) : (
        <RyogoEnclosedIcon icon={Building2} size="lg" />
      )}
      <SectionColWrapper small className="w-full">
        <RyogoP weight="font-bold">{agency.businessName}</RyogoP>
        <RyogoCaption color="slate">{agency.businessPhone}</RyogoCaption>
        <RyogoCaption color="light">{agency.businessAddress}</RyogoCaption>
      </SectionColWrapper>
    </SectionRowWrapper>
  )
}
