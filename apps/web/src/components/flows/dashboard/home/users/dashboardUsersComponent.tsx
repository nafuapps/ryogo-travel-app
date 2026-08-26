import { getTranslations } from "next-intl/server"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import { RyogoCaption } from "@/components/typography"
import Link from "next/link"
import { DashboardLabelImageChip } from "@/components/flows/dashboard/dashboardCommon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { CircleSmall, IdCard } from "lucide-react"
import {
  FindAllUsersInAgencyType,
  userServices,
} from "@ryogo-travel-app/api/services/user.services"
import { UserStatusPill } from "@/components/pills/ryogoPills"
import { differenceInMinutes } from "date-fns"
import {
  DASHBOARD_USER_AWAY_MINUTES,
  DASHBOARD_USER_ONLINE_MINUTES,
} from "@/lib/uiConfig"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import moment from "moment"
import { getOnlineStatus } from "@/lib/utils"

export default async function DashboardUsersComponent({
  agencyId,
  userId,
}: {
  agencyId: string
  userId: string
}) {
  const t = await getTranslations("Dashboard.Home.Users")

  let users = await userServices.findAllUsersInAgency(agencyId)

  const owners = users.filter((u) => u.userRole === UserRolesEnum.OWNER)
  const agents = users.filter((u) => u.userRole === UserRolesEnum.AGENT)
  const drivers = users.filter((u) => u.userRole === UserRolesEnum.DRIVER)

  return (
    <SectionWrapper id="DashboardUsers">
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Owners")}</RyogoCaption>
        <RyogoCaption color="light">{owners.length}</RyogoCaption>
      </SectionRowWrapper>
      {owners.map((user, index) => (
        <DashboardUserChipComponent key={index} user={user} />
      ))}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Agents")}</RyogoCaption>
        <RyogoCaption color="light">{agents.length}</RyogoCaption>
      </SectionRowWrapper>
      {agents.map((user, index) => (
        <DashboardUserChipComponent key={index} user={user} />
      ))}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Drivers")}</RyogoCaption>
        <RyogoCaption color="light">{drivers.length}</RyogoCaption>
      </SectionRowWrapper>
      {drivers.map((user, index) => (
        <DashboardUserChipComponent key={index} user={user} />
      ))}
    </SectionWrapper>
  )
}

async function DashboardUserChipComponent({
  user,
}: {
  user: FindAllUsersInAgencyType[number]
}) {
  const t = await getTranslations("Dashboard.Home.Users")
  const userImageUrl = user.photoUrl
  const onlineStatus = getOnlineStatus(user.lastSeen)

  return (
    <Link href={`/dashboard/users/${user.id}`} className="flex">
      <div
        className={`flex flex-row justify-between gap-1 lg:gap-1.5 w-full border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 lg:p-2`}
      >
        <DashboardLabelImageChip label={user.name}>
          <Tooltip disableHoverableContent>
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
        <UserStatusPill
          status={user.status}
          size="sm"
          className="self-center"
        />
      </div>
    </Link>
  )
}
