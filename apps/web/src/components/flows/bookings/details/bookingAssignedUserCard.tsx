import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"

export default function BookingAssignedUserCard({
  user,
}: {
  user: NonNullable<NonNullable<FindBookingDetailsByIdType>["assignedUser"]>
}) {
  return (
    <div className="flex gap-2 lg:gap-3 p-2 lg:p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg items-center">
      {user.photoUrl ? (
        <RyogoImage
          src={getFileUrl(user.photoUrl)}
          alt={user.name}
          imageSize="sm"
        />
      ) : (
        <RyogoEnclosedIcon icon={User} size="md" />
      )}
      <SectionColWrapper wFull small>
        <RyogoP weight="font-bold">{user.name}</RyogoP>
        <RyogoCaption color="slate">{user.phone}</RyogoCaption>
      </SectionColWrapper>
    </div>
  )
}
