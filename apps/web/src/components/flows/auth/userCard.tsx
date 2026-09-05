import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { RyogoImage } from "@/components/images/ryogoImage"
import { UserRolePill } from "@/components/pills/ryogoPills"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronRight, IdCard, User, UserKey } from "lucide-react"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export default function UserCard({
  user,
  isLink,
}: {
  user: {
    name: string
    photoUrl: string | null
    userRole: UserRolesEnum
    agency: {
      businessName: string
    }
  }
  isLink?: boolean
}) {
  return (
    <div
      className={`flex gap-2 lg:gap-3 w-full justify-between items-center border border-slate-100 dark:border-slate-800 rounded-lg p-3 lg:p-4 ${isLink ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800" : ""}`}
    >
      {user.photoUrl ? (
        <RyogoImage
          src={getFileUrl(user.photoUrl)}
          alt={user.name}
          imageSize="sm"
        />
      ) : (
        <RyogoEnclosedIcon
          icon={
            user.userRole === UserRolesEnum.OWNER
              ? UserKey
              : user.userRole === UserRolesEnum.DRIVER
                ? IdCard
                : User
          }
          size="md"
        />
      )}
      <SectionColWrapper small wFull>
        <RyogoSmall weight="font-bold">{user.name}</RyogoSmall>
        <RyogoCaption color="light">{user.agency.businessName}</RyogoCaption>
      </SectionColWrapper>
      <SectionColWrapper end small>
        <UserRolePill role={user.userRole} />
        {isLink && <RyogoIcon icon={ChevronRight} size="sm" />}
      </SectionColWrapper>
    </div>
  )
}
