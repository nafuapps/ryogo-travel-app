import { SmallGrey, H5Grey, Caption, PBold } from "@/components/typography"
import {
  FindAllUsersInAgencyType,
  userServices,
} from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { LucideRows3, LucideUser, Plus } from "lucide-react"
import { iconClassName } from "@/components/page/pageCommons"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import moment from "moment"
import { UserStatusPill } from "@/components/statusPills/statusPills"
import {
  GridItemWrapper,
  GridWrapper,
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"

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
    <PageWrapper id="UsersPage">
      <SectionWrapper id="OwnersSection">
        <SectionHeaderWrapper>
          <LucideRows3 className={iconClassName} />
          <SmallGrey>{t("Owners.Title")}</SmallGrey>
          <H5Grey>{owners.length}</H5Grey>
        </SectionHeaderWrapper>
        {owners.map((user) => (
          <AllUsersItemComponent key={user.id} user={user} />
        ))}
      </SectionWrapper>
      <SectionWrapper id="AgentsSection">
        <SectionHeaderWrapper>
          <LucideRows3 className={iconClassName} />
          <SmallGrey>{t("Agents.Title")}</SmallGrey>
          <H5Grey>{agents.length}</H5Grey>
          <Link href={`/dashboard/users/new`} className="ml-auto">
            <Button variant={"outline"}>
              <Plus className="size-4 md:size-5 text-slate-700" />
              {t("Agents.AddAgent")}
            </Button>
          </Link>
        </SectionHeaderWrapper>
        {agents.map((user) => (
          <AllUsersItemComponent key={user.id} user={user} />
        ))}
      </SectionWrapper>
      <SectionWrapper id="DriversSection">
        <SectionHeaderWrapper>
          <LucideRows3 className={iconClassName} />
          <SmallGrey>{t("Drivers.Title")}</SmallGrey>
          <H5Grey>{drivers.length}</H5Grey>
          <Link href={`/dashboard/drivers/new`} className="ml-auto">
            <Button variant={"outline"}>
              <Plus className="size-4 md:size-5 text-slate-700" />
              {t("Drivers.AddDriver")}
            </Button>
          </Link>
        </SectionHeaderWrapper>
        {drivers.map((user) => (
          <AllUsersItemComponent key={user.id} user={user} />
        ))}
      </SectionWrapper>
    </PageWrapper>
  )
}

async function AllUsersItemComponent({
  user,
}: {
  user: FindAllUsersInAgencyType[number]
}) {
  const t = await getTranslations("Dashboard.Users")

  return (
    <Link href={`/dashboard/users/${user.id}`}>
      <GridWrapper>
        <GridItemWrapper>
          {user.photoUrl ? (
            <div className="relative size-10 lg:size-12 rounded-lg overflow-hidden">
              <Image
                loading="eager"
                src={getFileUrl(user.photoUrl)}
                alt={t("Photo") + " " + user.id}
                fill
                sizes="(max-width: 1024px) 40px,48px"
              />
            </div>
          ) : (
            <LucideUser className="size-8 lg:size-10 text-slate-400" />
          )}
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{user.phone}</Caption>
          <PBold>{user.name}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{user.email}</Caption>
          <PBold>{moment(user.createdAt).format("DD MMM YYYY")}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <UserStatusPill status={user.status} />
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
