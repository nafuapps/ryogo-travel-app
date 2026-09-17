import { RyogoH4, RyogoSmall } from "@/components/typography"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { UserStatusPill } from "@/components/pills/ryogoPills"

export default function AccountInfoComponent({
  photoUrl,
  name,
  agencyName,
  status,
}: {
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
        <RyogoEnclosedIcon icon={User} size="xl" />
      )}
      <SectionColWrapper small className="items-center">
        <RyogoH4 weight="font-bold">{name}</RyogoH4>
        <RyogoSmall color="light">{agencyName}</RyogoSmall>
        <UserStatusPill status={status} className="self-center" />
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
