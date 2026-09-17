import { RyogoSmall, RyogoCaption, RyogoP } from "@/components/typography"
import { FindAllUsersInAgencyType } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  User,
  Plus,
  IdCard,
  UserKey,
  UserCog,
  ChevronRight,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { UserStatusPill } from "@/components/pills/ryogoPills"
import {
  AddInfoWrapper,
  PageWrapper,
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"

export default async function UsersPageComponent({
  allUsers,
  isPremium,
}: {
  allUsers: FindAllUsersInAgencyType
  isPremium: boolean
}) {
  const t = await getTranslations("Dashboard.Users")

  const owners = allUsers.filter((u) => u.userRole === UserRolesEnum.OWNER)
  const agents = allUsers.filter((u) => u.userRole === UserRolesEnum.AGENT)
  const drivers = allUsers.filter((u) => u.userRole === UserRolesEnum.DRIVER)

  return (
    <PageWrapper id="UsersPage">
      <SectionWrapper id="OwnersSection">
        <SectionRowWrapper className="items-center">
          <RyogoIcon icon={UserKey} size="sm" color="light" />
          <RyogoSmall color="light">{t("Owners.Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {owners.length}
          </RyogoSmall>
        </SectionRowWrapper>
        <TileGridWrapper>
          {owners.map((user) => (
            <UserItemComponent key={user.id} user={user} />
          ))}
          {isPremium && (
            <Link href={`/dashboard/users/add-owner`} className="w-full">
              <AddInfoWrapper
                icon={Plus}
                label={t("Owners.AddOwner")}
                className="h-full justify-center"
              />
            </Link>
          )}
        </TileGridWrapper>
      </SectionWrapper>
      <SectionWrapper id="AgentsSection">
        <SectionRowWrapper className="items-center">
          <RyogoIcon icon={UserCog} size="sm" color="light" />
          <RyogoSmall color="light">{t("Agents.Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {agents.length}
          </RyogoSmall>
        </SectionRowWrapper>
        <TileGridWrapper>
          {agents.map((user) => (
            <UserItemComponent key={user.id} user={user} />
          ))}
          <Link href={`/dashboard/users/new`} className="w-full">
            <AddInfoWrapper
              icon={Plus}
              label={t("Agents.AddAgent")}
              className="h-full justify-center"
            />
          </Link>
        </TileGridWrapper>
      </SectionWrapper>
      <SectionWrapper id="DriversSection">
        <SectionRowWrapper className="items-center">
          <RyogoIcon icon={IdCard} size="sm" color="light" />
          <RyogoSmall color="light">{t("Drivers.Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {drivers.length}
          </RyogoSmall>
        </SectionRowWrapper>
        <TileGridWrapper>
          {drivers.map((user) => (
            <UserItemComponent key={user.id} user={user} />
          ))}
          <Link href={`/dashboard/drivers/new`} className="w-full">
            <AddInfoWrapper
              icon={Plus}
              label={t("Drivers.AddDriver")}
              className="h-full justify-center"
            />
          </Link>
        </TileGridWrapper>
      </SectionWrapper>
    </PageWrapper>
  )
}

async function UserItemComponent({
  user,
}: {
  user: FindAllUsersInAgencyType[number]
}) {
  return (
    <Link href={`/dashboard/users/${user.id}`}>
      <SectionRowWrapper className="items-center h-full p-4 lg:p-5 border transition hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
        {user.photoUrl ? (
          <RyogoImage
            src={getFileUrl(user.photoUrl)}
            alt={user.name}
            imageSize="md"
          />
        ) : (
          <RyogoEnclosedIcon icon={User} size="lg" />
        )}
        <SectionColWrapper small className="w-full">
          <RyogoP weight="font-bold"> {user.name}</RyogoP>
          <RyogoCaption color="light" weight="font-bold">
            {user.phone}
          </RyogoCaption>
        </SectionColWrapper>
        <SectionColWrapper className="items-end">
          <RyogoIcon icon={ChevronRight} size="xs" color="light" thick />
          <UserStatusPill status={user.status} />
        </SectionColWrapper>
      </SectionRowWrapper>
    </Link>
  )
}
