import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { UserRolePill } from "@/components/pills/ryogoPills"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import Link from "next/link"

export default function BookingAssignedUserCard({
  user,
  withLink,
}: {
  user: NonNullable<NonNullable<FindBookingDetailsByIdType>["assignedUser"]>
  withLink?: boolean
}) {
  if (withLink) {
    return (
      <Link
        href={`/dashboard/users/${user.id}`}
        className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
      >
        <AssignedUserCard user={user} />
      </Link>
    )
  }
  return <AssignedUserCard user={user} />
}

function AssignedUserCard({
  user,
}: {
  user: NonNullable<NonNullable<FindBookingDetailsByIdType>["assignedUser"]>
}) {
  return (
    <SectionRowWrapper className="p-2 lg:p-3 items-center">
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
        <RyogoP weight="font-bold">{user.name}</RyogoP>
        <RyogoCaption color="slate">{user.phone}</RyogoCaption>
        <UserRolePill role={user.userRole} className="self-start" />
      </SectionColWrapper>
    </SectionRowWrapper>
  )
}
