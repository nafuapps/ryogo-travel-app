import { RyogoH4, RyogoSmall } from "@/components/typography"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import { CustomerStatusPill } from "@/components/pills/ryogoPills"
import IdCopyPill from "@/components/pills/idCopyPill"
import ChangeCustomerPhotoSheet from "@/components/sheets/changeCustomerPhotoSheet"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { MapPin, User } from "lucide-react"

export default function CustomerInfoComponent({
  id,
  agencyId,
  photoUrl,
  name,
  status,
  city,
  state,
  canChange,
}: {
  id: string
  agencyId: string
  photoUrl: string | null
  name: string
  city: string
  state: string
  status: CustomerStatusEnum
  canChange?: boolean
}) {
  return (
    <SectionColWrapper className="items-center justify-center">
      {photoUrl ? (
        <RyogoDialogImage
          src={getFileUrl(photoUrl)}
          alt={name}
          imageSize="lg"
        />
      ) : (
        <ChangeCustomerPhotoSheet
          customerId={id}
          agencyId={agencyId}
          canChange={canChange}
        >
          <RyogoEnclosedIcon icon={User} size="xl" />
        </ChangeCustomerPhotoSheet>
      )}
      <SectionColWrapper className="items-center">
        <RyogoH4 weight="font-bold">{name}</RyogoH4>
        <SectionRowWrapper small className="items-center">
          <RyogoIcon icon={MapPin} size="sm" color="light" />
          <RyogoSmall color="light">{city + ", " + state}</RyogoSmall>
        </SectionRowWrapper>
        <SectionRowWrapper className="items-center">
          <CustomerStatusPill status={status} size="lg" />
          <IdCopyPill id={id} />
        </SectionRowWrapper>
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
