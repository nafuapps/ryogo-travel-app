import { RyogoH4, RyogoSmall } from "@/components/typography"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import {
  InfoContentWrapper,
  InfoWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { UserStatusPill } from "@/components/pills/ryogoPills"

export default function UserInfoComponent({
  id,
  photoUrl,
  agencyId,
  name,
  agencyName,
  status,
}: {
  id: string
  photoUrl: string | null
  agencyId: string
  name: string
  agencyName: string
  status: UserStatusEnum
}) {
  return (
    <InfoWrapper>
      <SectionColWrapper center small>
        {photoUrl ? (
          <RyogoImage
            src={getFileUrl(photoUrl)}
            alt={photoUrl}
            imageSize="lg"
          />
        ) : (
          <RyogoEnclosedIcon icon={User} size="xl" />
        )}
        <ChangeUserPhotoSheet userId={id} agencyId={agencyId} />
      </SectionColWrapper>
      <InfoContentWrapper>
        <RyogoH4 weight="font-bold">{name}</RyogoH4>
        <RyogoSmall color="light">{agencyName}</RyogoSmall>
        <UserStatusPill status={status} className="self-center" />
      </InfoContentWrapper>
    </InfoWrapper>
  )
}
