import { CaptionGrey, Small } from "@/components/typography"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import Image from "next/image"

export const UserCard = ({
  user,
}: {
  user: NonNullable<FindUserDetailsByIdType>
}) => {
  return (
    <div className="flex flex-row gap-2 lg:gap-3 w-full justify-between bg-sky-50 rounded-lg p-3 lg:p-4">
      <div className="flex flex-col justify-between gap-1 lg:gap-2 items-start">
        <div className="flex items-center gap-2 lg:gap-3">
          {user.photoUrl && (
            <div className="relative size-7 lg:size-8 rounded-full overflow-hidden">
              <Image
                loading="eager"
                src={getFileUrl(user.photoUrl)}
                alt={"Account Photo"}
                fill
                sizes="(max-width: 1024px) 28px,32px"
              />
            </div>
          )}
          <Small>{user.name}</Small>
        </div>
        <CaptionGrey>{user.phone}</CaptionGrey>
      </div>
      <div className="flex flex-col justify-between gap-2 lg:gap-3 items-end">
        <div className="flex rounded-full bg-slate-200 px-2 py-1 lg:px-2.5 lg:py-1.5">
          <CaptionGrey>{user.userRole.toUpperCase()}</CaptionGrey>
        </div>
      </div>
    </div>
  )
}
