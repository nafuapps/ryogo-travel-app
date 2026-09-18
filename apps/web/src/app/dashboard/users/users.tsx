import { RyogoCaption, RyogoP } from "@/components/typography"
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
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import UserOnlineStatusComponent from "@/components/flows/account/userOnlineStatusComponent"

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
        <SectionHeaderWrapper
          icon={UserKey}
          label={t("Owners.Title")}
          count={owners.length}
        />
        <TileGridWrapper>
          {owners.map((user) => (
            <UserItemComponent key={user.id} user={user} />
          ))}
          {isPremium && (
            <Link href={`/dashboard/users/add-owner`} className="w-full">
              <AddInfoWrapper
                icon={Plus}
                label={t("Owners.AddOwner")}
                className="h-full"
              />
            </Link>
          )}
        </TileGridWrapper>
      </SectionWrapper>
      <SectionWrapper id="AgentsSection">
        <SectionHeaderWrapper
          icon={UserCog}
          label={t("Agents.Title")}
          count={agents.length}
        />
        <TileGridWrapper>
          {agents.map((user) => (
            <UserItemComponent key={user.id} user={user} />
          ))}
          <Link href={`/dashboard/users/new`} className="w-full">
            <AddInfoWrapper
              icon={Plus}
              label={t("Agents.AddAgent")}
              className="h-full"
            />
          </Link>
        </TileGridWrapper>
      </SectionWrapper>
      <SectionWrapper id="DriversSection">
        <SectionHeaderWrapper
          icon={IdCard}
          label={t("Drivers.Title")}
          count={drivers.length}
        />
        <TileGridWrapper>
          {drivers.map((user) => (
            <UserItemComponent key={user.id} user={user} />
          ))}
          <Link href={`/dashboard/drivers/new`} className="w-full">
            <AddInfoWrapper
              icon={Plus}
              label={t("Drivers.AddDriver")}
              className="h-full"
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
        <SectionColWrapper className="w-full">
          <RyogoP weight="font-bold"> {user.name}</RyogoP>
          <RyogoCaption color="light" weight="font-bold">
            {user.phone}
          </RyogoCaption>
          <SectionRowWrapper small className="items-center">
            <RyogoCaption color="light">{user.userRole}</RyogoCaption>
            <UserOnlineStatusComponent lastSeen={user.lastSeen} onlyIcon />
          </SectionRowWrapper>
        </SectionColWrapper>
        <SectionColWrapper className="items-end">
          <RyogoIcon icon={ChevronRight} size="xs" color="light" thick />
          <UserStatusPill status={user.status} />
        </SectionColWrapper>
      </SectionRowWrapper>
    </Link>
  )
}
