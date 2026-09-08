import { UserRolePill } from "@/components/pills/ryogoPills"
import { RyogoH4, RyogoSmall } from "@/components/typography"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import { AccountInfoContentWrapper, AccountInfoWrapper } from "./accountCommon"

export default function UserInfoWrapper({
  id,
  photoUrl,
  agencyId,
  name,
  agencyName,
  userRole,
}: {
  id: string
  photoUrl: string | null
  agencyId: string
  name: string
  agencyName: string
  userRole: UserRolesEnum
}) {
  return (
    <AccountInfoWrapper>
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
      <AccountInfoContentWrapper>
        <RyogoH4 weight="font-bold">{name}</RyogoH4>
        <RyogoSmall color="light">{agencyName}</RyogoSmall>
        <UserRolePill role={userRole} className="self-center lg:self-start" />
      </AccountInfoContentWrapper>
    </AccountInfoWrapper>
  )
}
