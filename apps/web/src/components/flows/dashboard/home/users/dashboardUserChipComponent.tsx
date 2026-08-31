import { RyogoIcon, RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { UserStatusPill } from "@/components/pills/ryogoPills"
import { getOnlineStatus } from "@/lib/utils"
import { FindAllUsersInAgencyType } from "@ryogo-travel-app/api/services/user.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { CircleSmall, IdCard } from "lucide-react"
import moment from "moment"
import { Route } from "next"
import { getTranslations } from "next-intl/server"
import {
  DashboardItemWrapper,
  DashboardLabelImageChip,
} from "@/components/flows/dashboard/dashboardCommon"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default async function DashboardUserChipComponent({
  user,
}: {
  user: FindAllUsersInAgencyType[number]
}) {
  const t = await getTranslations("Dashboard.Home.Users")
  const userImageUrl = user.photoUrl
  const onlineStatus = getOnlineStatus(user.lastSeen)

  return (
    <DashboardItemWrapper href={`/dashboard/users/${user.id}` as Route}>
      <DashboardLabelImageChip label={user.name}>
        <Tooltip>
          <TooltipTrigger>
            <RyogoIcon
              icon={CircleSmall}
              thick={onlineStatus !== "Offline"}
              size={"sm"}
              color={
                onlineStatus === "Away"
                  ? "yellow"
                  : onlineStatus === "Online"
                    ? "green"
                    : "light"
              }
            />
          </TooltipTrigger>
          <TooltipContent>
            {user.lastSeen
              ? t("LastSeen", { time: moment(user.lastSeen).fromNow() })
              : t("Offline")}
          </TooltipContent>
        </Tooltip>
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
      <UserStatusPill status={user.status} size="sm" className="self-center" />
    </DashboardItemWrapper>
  )
}
