import {
  RyogoSmall,
  RyogoH4,
  RyogoCaption,
  RyogoP,
} from "@/components/typography"
import {
  FindAllUsersInAgencyType,
  userServices,
} from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { User, Plus, Rows3 } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
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
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

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
          <RyogoIcon icon={Rows3} size="sm" />
          <RyogoSmall color="slate">{t("Owners.Title")}</RyogoSmall>
          <RyogoH4 color="slate"> {owners.length}</RyogoH4>
        </SectionHeaderWrapper>
        {owners.map((user) => (
          <AllUsersItemComponent key={user.id} user={user} />
        ))}
      </SectionWrapper>
      <SectionWrapper id="AgentsSection">
        <SectionHeaderWrapper>
          <RyogoIcon icon={Rows3} size="sm" />
          <RyogoSmall color="slate">{t("Agents.Title")}</RyogoSmall>
          <RyogoH4 color="slate"> {agents.length}</RyogoH4>
          <Link href={`/dashboard/users/new`} className="ml-auto">
            <Button variant={"outline"}>
              <RyogoIcon icon={Plus} size="sm" />
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
          <RyogoIcon icon={Rows3} size="sm" />
          <RyogoSmall color="slate">{t("Drivers.Title")}</RyogoSmall>
          <RyogoH4 color="slate"> {drivers.length}</RyogoH4>
          <Link href={`/dashboard/drivers/new`} className="ml-auto">
            <Button variant={"outline"}>
              <RyogoIcon icon={Plus} size="sm" />
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
            <RyogoImage
              src={getFileUrl(user.photoUrl)}
              alt={t("Photo") + " " + user.id}
              imageSize="sm"
            />
          ) : (
            <RyogoIcon icon={User} size="md" />
          )}
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{user.phone}</RyogoCaption>
          <RyogoP weight="font-bold"> {user.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{user.email}</RyogoCaption>
          <RyogoP weight="font-bold">
            {moment(user.createdAt).format("DD MMM YYYY")}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <UserStatusPill status={user.status} />
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
