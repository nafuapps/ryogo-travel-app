import { RyogoH4, RyogoSmall } from "@/components/typography"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Phone, User } from "lucide-react"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import { DriverStatusPill } from "@/components/pills/ryogoPills"
import IdCopyPill from "@/components/pills/idCopyPill"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"

export default function DriverInfoComponent({
  id,
  photoUrl,
  name,
  status,
  userId,
  phone,
  agencyId,
  canChange,
}: {
  id: string
  photoUrl: string | null
  name: string
  status: DriverStatusEnum
  userId: string
  phone: string
  agencyId: string
  canChange?: boolean
}) {
  return (
    <SectionColWrapper className="items-center justify-center">
      {photoUrl ? (
        <RyogoDialogImage
          src={getFileUrl(photoUrl)}
          alt={photoUrl}
          imageSize="lg"
        />
      ) : (
        <ChangeUserPhotoSheet
          userId={userId}
          agencyId={agencyId}
          canChange={canChange}
        >
          <RyogoEnclosedIcon icon={User} size="xl" />
        </ChangeUserPhotoSheet>
      )}
      <SectionColWrapper className="items-center">
        <RyogoH4 weight="font-bold">{name}</RyogoH4>
        <SectionRowWrapper small className="items-center">
          <RyogoIcon icon={Phone} size="xs" color="light" thick />
          <RyogoSmall color="light">{phone}</RyogoSmall>
        </SectionRowWrapper>
        <SectionRowWrapper className="items-center">
          <DriverStatusPill status={status} size="lg" />
          <IdCopyPill id={id} />
        </SectionRowWrapper>
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
