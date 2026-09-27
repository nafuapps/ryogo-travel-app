import { UserStatusPill } from "@/components/pills/ryogoPills"
import { FindAllUsersInAgencyType } from "@ryogo-travel-app/api/services/user.services"
import { DashboardChipItemWrapper } from "@/components/flows/dashboard/dashboardCommon"
import Link from "next/link"
import UserOnlineStatusComponent from "@/components/flows/account/userOnlineStatusComponent"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { UserKey, UserCog, IdCard } from "lucide-react"

export default function DashboardUserChipComponent({
  user,
}: {
  user: FindAllUsersInAgencyType[number]
}) {
  const userImageUrl = user.photoUrl

  return (
    <Link href={`/dashboard/users/${user.id}`}>
      <DashboardChipItemWrapper>
        <RyogoImageIconTag
          url={userImageUrl}
          label={user.name}
          icon={getUserIcon(user.userRole)}
          className="w-full"
        />
        <UserStatusPill
          status={user.status}
          size="sm"
          className="self-center"
        />
        <UserOnlineStatusComponent lastSeen={user.lastSeen} onlyIcon />
      </DashboardChipItemWrapper>
    </Link>
  )
}

function getUserIcon(userRole: UserRolesEnum) {
  switch (userRole) {
    case UserRolesEnum.OWNER:
      return UserKey
    case UserRolesEnum.AGENT:
      return UserCog
    case UserRolesEnum.DRIVER:
      return IdCard
  }
}
