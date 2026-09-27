import { FindOwnerAndAgentsByAgencyType } from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import { FindBookingStatusByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { RyogoP, RyogoCaption } from "@/components/typography"
import { Check, CheckCheck, TriangleAlertIcon, User } from "lucide-react"
import {
  AssignTileWrapper,
  AssignTileContentWrapper,
  AssignTileScoreWrapper,
  RyoGoScoreWrapper,
  AssignTileStatusWrapper,
} from "@/components/flows/bookings/assign/assignWrappers"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  getOverlapScore,
  NoOverlapScore,
} from "@/components/flows/bookings/assign/getBookingScore"
import { UserRolePill } from "@/components/pills/ryogoPills"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"

export default function AssignUserTile({
  userData,
  booking,
  selected,
  onClick,
}: {
  userData: FindOwnerAndAgentsByAgencyType[number]
  selected: boolean
  onClick: () => void
  booking: NonNullable<FindBookingStatusByIdType>
}) {
  const t = useTranslations("Dashboard.AssignUser.Tile")

  const isCurrentlyAssigned = booking.assignedUserId === userData.id

  const bookingStartDate = booking.startDate
  const bookingEndDate = booking.endDate

  const bookingOverLapScores = userData.bookingsAssigned
    .filter((b) => b.id !== booking.id)
    .map((other) => {
      return getOverlapScore(
        other.startDate,
        other.endDate,
        bookingStartDate,
        bookingEndDate,
      )
    })
  const isBooked = bookingOverLapScores.some(
    (score) => score === NoOverlapScore,
  )

  const bookingScore =
    bookingOverLapScores.length === 0
      ? 100
      : bookingOverLapScores.reduce((a, b) => a + b, 0) /
        bookingOverLapScores.length

  const statusScore = getUserStatusScore(userData.status)

  const roleScore = getUserRoleScore(userData.userRole)

  const totalScore = getUserTotalScore({
    bookingScore,
    statusScore,
    roleScore,
  })

  return (
    <AssignTileWrapper selected={selected} onClick={onClick}>
      <AssignTileContentWrapper>
        <SectionRowWrapper className="items-center">
          {userData.photoUrl ? (
            <RyogoImage
              src={getFileUrl(userData.photoUrl)}
              alt={userData.name}
              imageSize="md"
            />
          ) : (
            <RyogoEnclosedIcon icon={User} size="lg" />
          )}
          <SectionColWrapper small className="w-full">
            <RyogoP weight="font-bold"> {userData.name}</RyogoP>
            <RyogoCaption color="slate">{userData.phone}</RyogoCaption>
          </SectionColWrapper>
        </SectionRowWrapper>
        <UserRolePill role={userData.userRole} className="self-start" />
      </AssignTileContentWrapper>
      <AssignTileScoreWrapper>
        <RyoGoScoreWrapper totalScore={totalScore} label={t("Score")} />
        <AssignTileStatusWrapper selected={selected}>
          {isCurrentlyAssigned ? (
            <RyogoIcon color="brand" icon={CheckCheck} size="xs" thick />
          ) : isBooked ? (
            <RyogoIcon
              color="yellow"
              icon={TriangleAlertIcon}
              size="xs"
              thick
            />
          ) : (
            <RyogoIcon color="green" icon={Check} size="xs" thick />
          )}
          <RyogoCaption color="slate">
            {isCurrentlyAssigned
              ? t("CurrentlyAssigned")
              : isBooked
                ? t("Booked")
                : t("Available")}
          </RyogoCaption>
        </AssignTileStatusWrapper>
      </AssignTileScoreWrapper>
    </AssignTileWrapper>
  )
}

const InactiveScore = 10
const NewUserScore = 50
const AvailableScore = 100
function getUserStatusScore(status: UserStatusEnum): number {
  if (status === UserStatusEnum.INACTIVE) {
    return InactiveScore
  }
  if (status === UserStatusEnum.NEW) {
    return NewUserScore
  }
  return AvailableScore
}

const OwnerRoleScore = 100
const AgentRoleScore = 50
function getUserRoleScore(role: UserRolesEnum): number {
  if (role === UserRolesEnum.OWNER) {
    return OwnerRoleScore
  }
  return AgentRoleScore
}

const UserWeightage_Booking = 0.6
const UserWeightage_Status = 0.3
const UserWeightage_Role = 0.1
const getUserTotalScore = (data: {
  bookingScore: number
  statusScore: number
  roleScore: number
}) => {
  return (
    data.bookingScore * UserWeightage_Booking +
    data.statusScore * UserWeightage_Status +
    data.roleScore * UserWeightage_Role
  )
}
