import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { UserStatusPill } from "@/components/pills/ryogoPills"
import { FindAllUsersInAgencyType } from "@ryogo-travel-app/api/services/user.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { IdCard } from "lucide-react"
import {
  DashboardChipItemWrapper,
  DashboardLabelImageChip,
} from "@/components/flows/dashboard/dashboardCommon"
import Link from "next/link"
import UserOnlineStatusComponent from "@/components/flows/account/userOnlineStatusComponent"

export default function DashboardUserChipComponent({
  user,
}: {
  user: FindAllUsersInAgencyType[number]
}) {
  const userImageUrl = user.photoUrl

  return (
    <Link href={`/dashboard/users/${user.id}`}>
      <DashboardChipItemWrapper>
        <DashboardLabelImageChip label={user.name}>
          <UserOnlineStatusComponent lastSeen={user.lastSeen} small />
          {userImageUrl ? (
            <RyogoImage
              src={getFileUrl(userImageUrl)}
              alt={user.name}
              imageSize="xs"
            />
          ) : (
            <RyogoEnclosedIcon icon={IdCard} size="sm" />
          )}
        </DashboardLabelImageChip>
        <UserStatusPill
          status={user.status}
          size="sm"
          className="self-center"
        />
      </DashboardChipItemWrapper>
    </Link>
  )
}
