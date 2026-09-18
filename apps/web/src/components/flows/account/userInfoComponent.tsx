import { RyogoH4 } from "@/components/typography"
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
import UserOnlineStatusComponent from "./userOnlineStatusComponent"
import IdCopyPill from "@/components/pills/idCopyPill"

export default function UserInfoComponent({
  id,
  photoUrl,
  name,
  status,
  lastSeen,
}: {
  id: string
  photoUrl: string | null
  name: string
  status: UserStatusEnum
  lastSeen: Date | null
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
      <SectionColWrapper className="items-center">
        <UserOnlineStatusComponent lastSeen={lastSeen} />
        <RyogoH4 weight="font-bold">{name}</RyogoH4>
        <SectionRowWrapper className="items-center">
          <UserStatusPill status={status} size="lg" />
          <IdCopyPill id={id} />
        </SectionRowWrapper>
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
