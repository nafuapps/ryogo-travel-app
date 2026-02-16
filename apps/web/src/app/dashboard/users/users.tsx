import {
  SmallGrey,
  H5Grey,
  Caption,
  CaptionBold,
  PBold,
} from "@/components/typography"
import {
  FindAllUsersInAgencyType,
  userServices,
} from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { LucideRows3, LucideUser } from "lucide-react"
import {
  sectionClassName,
  sectionHeaderClassName,
  iconClassName,
  gridClassName,
  gridItemClassName,
  pageClassName,
} from "@/components/page/pageCommons"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUserStatusColor } from "../components/users/userCommon"
import Image from "next/image"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import moment from "moment"

export default async function UsersPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Users")

  const allUsers = await userServices.findAllUsersInAgency(agencyId)

  const owners = allUsers.filter((u) => u.userRole === UserRolesEnum.OWNER)
  const agents = allUsers.filter((u) => u.userRole === UserRolesEnum.AGENT)
  const drivers = allUsers.filter((u) => u.userRole === UserRolesEnum.DRIVER)

  return (
    <div id="UsersPage" className={pageClassName}>
      <div id="OwnersSection" className={sectionClassName}>
        <div id="OwnersHeader" className={sectionHeaderClassName}>
          <LucideRows3 className={iconClassName} />
          <SmallGrey>{t("Owners.Title")}</SmallGrey>
          <H5Grey>{owners.length}</H5Grey>
        </div>
        {owners.map((user) => (
          <AllUsersItemComponent key={user.id} user={user} />
        ))}
      </div>
      <div id="AgentsSection" className={sectionClassName}>
        <div id="AgentsHeader" className={sectionHeaderClassName}>
          <LucideRows3 className={iconClassName} />
          <SmallGrey>{t("Agents.Title")}</SmallGrey>
          <H5Grey>{agents.length}</H5Grey>
        </div>
        <Link href={`/dashboard/users/new`} className="min-w-1/2 self-center">
          <Button variant={"default"} className="w-full">
            {t("Agents.AddAgent")}
          </Button>
        </Link>
        {agents.map((user) => (
          <AllUsersItemComponent key={user.id} user={user} />
        ))}
      </div>
      <div id="DriversSection" className={sectionClassName}>
        <div id="DriversHeader" className={sectionHeaderClassName}>
          <LucideRows3 className={iconClassName} />
          <SmallGrey>{t("Drivers.Title")}</SmallGrey>
          <H5Grey>{drivers.length}</H5Grey>
        </div>
        <Link href={`/dashboard/drivers/new`} className="min-w-1/2 self-center">
          <Button variant={"default"} className="w-full">
            {t("Drivers.AddDriver")}
          </Button>
        </Link>
        {drivers.map((user) => (
          <AllUsersItemComponent key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}

async function AllUsersItemComponent({
  user,
}: {
  user: FindAllUsersInAgencyType[number]
}) {
  const t = await getTranslations("Dashboard.Users")

  const bgColor = getUserStatusColor(user.status)

  return (
    <Link href={`/dashboard/users/${user.id}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          {user.photoUrl ? (
            <div className="relative size-10 lg:size-12 rounded-lg overflow-hidden">
              <Image
                src={getFileUrl(user.photoUrl)}
                alt={t("Photo") + " " + user.id}
                fill
                sizes="(max-width: 768px) 40px,48px"
              />
            </div>
          ) : (
            <LucideUser className="size-8 lg:size-10 text-slate-400" />
          )}
        </div>
        <div className={gridItemClassName}>
          <Caption>{user.phone}</Caption>
          <PBold>{user.name}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{user.email}</Caption>
          <PBold>{moment(user.createdAt).format("DD MMM YYYY")}</PBold>
        </div>
        <div className={gridItemClassName}>
          <div
            className={`flex justify-center items-center rounded-full ${bgColor} px-2 py-1.5 lg:px-3 lg:py-2`}
          >
            <CaptionBold>{user.status.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
    </Link>
  )
}
