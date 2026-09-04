import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoPill } from "@/components/pills/ryogoPills"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { User } from "lucide-react"
import { SectionColWrapper } from "@/components/page/pageWrappers"

export default function UserCard({
  user,
}: {
  user: NonNullable<FindUserDetailsByIdType>
}) {
  return (
    <div className="flex flex-row gap-2 lg:gap-3 w-full justify-between items-center border border-slate-100 dark:border-slate-800 rounded-lg p-3 lg:p-4">
      {user.photoUrl ? (
        <RyogoImage
          src={getFileUrl(user.photoUrl)}
          alt={"Account Photo"}
          imageSize="xs"
        />
      ) : (
        <RyogoEnclosedIcon icon={User} size="sm" />
      )}
      <SectionColWrapper small wFull>
        <RyogoSmall>{user.name}</RyogoSmall>
        <RyogoCaption color="light">{user.agency.businessName}</RyogoCaption>
      </SectionColWrapper>
      <div className="flex flex-col justify-between gap-2 lg:gap-3 items-end">
        <RyogoPill label={user.userRole.toUpperCase()} bgColor={"slate"} />
      </div>
    </div>
  )
}
