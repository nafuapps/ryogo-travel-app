import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { RyogoImage } from "@/components/images/ryogoImage"

export default function UserCard({
  user,
}: {
  user: NonNullable<FindUserDetailsByIdType>
}) {
  return (
    <div className="flex flex-row gap-2 lg:gap-3 w-full justify-between border border-slate-100 rounded-lg p-3 lg:p-4">
      <div className="flex items-center gap-2 lg:gap-3">
        {user.photoUrl && (
          <RyogoImage
            src={getFileUrl(user.photoUrl)}
            alt={"Account Photo"}
            imageSize="xs"
          />
        )}
        <RyogoSmall>{user.name}</RyogoSmall>
      </div>
      <div className="flex flex-col justify-between gap-2 lg:gap-3 items-end">
        <div className="flex rounded-full bg-slate-200 px-2 py-1 lg:px-2.5 lg:py-1.5">
          <RyogoCaption color="slate">
            {user.userRole.toUpperCase()}
          </RyogoCaption>
        </div>
      </div>
    </div>
  )
}
