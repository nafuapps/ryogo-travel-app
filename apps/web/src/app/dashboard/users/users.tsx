import { RyogoSmall, RyogoCaption, RyogoP } from "@/components/typography"
import {
  FindAllUsersInAgencyType,
  userServices,
} from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { User, Plus, IdCard, UserKey, UserRoundCog } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import moment from "moment"
import { UserStatusPill } from "@/components/pills/ryogoPills"
import {
  GridItemWrapper,
  HoverGridWrapper,
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"

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
          <RyogoIcon icon={UserKey} size="sm" color="light" />
          <RyogoSmall color="light">{t("Owners.Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {owners.length}
          </RyogoSmall>
        </SectionHeaderWrapper>
        {owners.map((user) => (
          <AllUsersItemComponent key={user.id} user={user} />
        ))}
      </SectionWrapper>
      <SectionWrapper id="AgentsSection">
        <SectionHeaderWrapper>
          <RyogoIcon icon={UserRoundCog} size="sm" color="light" />
          <RyogoSmall color="light">{t("Agents.Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {agents.length}
          </RyogoSmall>
          <Link href={`/dashboard/users/new`} className="ml-auto">
            <Button variant={"outline"}>
              <RyogoIcon icon={Plus} size="sm" />
              <RyogoCaption color="slate">{t("Agents.AddAgent")}</RyogoCaption>
            </Button>
          </Link>
        </SectionHeaderWrapper>
        {agents.map((user) => (
          <AllUsersItemComponent key={user.id} user={user} />
        ))}
      </SectionWrapper>
      <SectionWrapper id="DriversSection">
        <SectionHeaderWrapper>
          <RyogoIcon icon={IdCard} size="sm" color="light" />
          <RyogoSmall color="light">{t("Drivers.Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {drivers.length}
          </RyogoSmall>
          <Link href={`/dashboard/drivers/new`} className="ml-auto">
            <Button variant={"outline"}>
              <RyogoIcon icon={Plus} size="sm" />
              <RyogoCaption color="slate">
                {t("Drivers.AddDriver")}
              </RyogoCaption>
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
      <HoverGridWrapper>
        <GridItemWrapper>
          {user.photoUrl ? (
            <RyogoImage
              src={getFileUrl(user.photoUrl)}
              alt={t("Photo") + " " + user.id}
              imageSize="sm"
            />
          ) : (
            <RyogoEnclosedIcon icon={User} size="md" />
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
      </HoverGridWrapper>
    </Link>
  )
}
