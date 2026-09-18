import { RyogoH4, RyogoSmall } from "@/components/typography"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { UserStatusPill } from "@/components/pills/ryogoPills"
import IdCopyPill from "@/components/pills/idCopyPill"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"

export default function AccountInfoComponent({
  id,
  agencyId,
  photoUrl,
  name,
  agencyName,
  status,
}: {
  id: string
  agencyId: string
  photoUrl: string | null
  name: string
  agencyName: string
  status: UserStatusEnum
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
        <ChangeUserPhotoSheet userId={id} agencyId={agencyId} canChange>
          <RyogoEnclosedIcon icon={User} size="xl" />
        </ChangeUserPhotoSheet>
      )}
      <SectionColWrapper className="items-center">
        <RyogoH4 weight="font-bold">{name}</RyogoH4>
        <RyogoSmall color="light">{agencyName}</RyogoSmall>
        <SectionRowWrapper className="items-center">
          <UserStatusPill status={status} size="lg" />
          <IdCopyPill id={id} />
        </SectionRowWrapper>
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
