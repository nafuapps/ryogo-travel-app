import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { UserRolePill } from "@/components/pills/ryogoPills"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { ChevronRight, IdCard, User, UserKey } from "lucide-react"

export default function AuthAccountCard({
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
      className={`flex gap-2 lg:gap-3 w-full justify-between items-center border rounded-lg p-3 lg:p-4 ${isLink ? "hover:bg-slate-100 dark:hover:bg-slate-700" : ""}`}
    >
      {user.photoUrl ? (
        <RyogoImage
          src={getFileUrl(user.photoUrl)}
          alt={user.name}
          imageSize="md"
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
          size="lg"
        />
      )}
      <SectionColWrapper small className="grow">
        <RyogoSmall weight="font-bold">{user.name}</RyogoSmall>
        <RyogoCaption color="light">{user.agency.businessName}</RyogoCaption>
        <SectionRowWrapper className="items-center justify-between">
          <UserRolePill role={user.userRole} />
          {isLink && <RyogoIcon icon={ChevronRight} size="xs" color="light" />}
        </SectionRowWrapper>
      </SectionColWrapper>
    </div>
  )
}
