import { RyogoH4 } from "@/components/typography"
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

export default function DriverInfoWrapper({
  userId,
  photoUrl,
  agencyId,
  name,
  canChangePhoto,
}: {
  userId: string
  photoUrl: string | null
  agencyId: string
  name: string
  canChangePhoto: boolean
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
        {canChangePhoto && (
          <ChangeUserPhotoSheet userId={userId} agencyId={agencyId} />
        )}
      </SectionColWrapper>
      <InfoContentWrapper>
        <RyogoH4 weight="font-bold">{name}</RyogoH4>
      </InfoContentWrapper>
    </InfoWrapper>
  )
}
