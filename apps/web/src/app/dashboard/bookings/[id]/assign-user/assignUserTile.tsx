import { FindOwnerAndAgentsByAgencyType } from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { PBold, Small, Caption } from "@/components/typography"
import {
  Bolt,
  Check,
  Phone,
  CheckCheck,
  TriangleAlertIcon,
  User,
} from "lucide-react"
import { IconTextTag } from "@/components/tags/IconTextTag"
import {
  AssignTileContentWrapper,
  AssignTileFooterWrapper,
  AssignTileHeaderWrapper,
  AssignTileScoreWrapper,
  AssignTileStatusWrapper,
  AssignTileWrapper,
  RyoGoScoreWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/RyogoIcon"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  getOverlapScore,
  NoOverlapScore,
} from "@/components/bookings/getBookingScore"

type AssignUserTileProps = {
  userData: FindOwnerAndAgentsByAgencyType[number]
  selectedUserId: string | null
  setSelectedUserId: (userId: string | null) => void
  booking: NonNullable<FindBookingDetailsByIdType>
}
export default function AssignUserTile({
  userData,
  booking,
  selectedUserId,
  setSelectedUserId,
}: AssignUserTileProps) {
  const t = useTranslations("Dashboard.AssignUser.Tile")

  const isCurrentlyAssigned = booking.assignedUserId === userData.id

  const bookingStartDate = new Date(booking.startDate)
  const bookingEndDate = new Date(booking.endDate)

  const bookingOverLapScores = userData.bookingsAssigned
    .filter((b) => b.id !== booking.id)
    .map((other) => {
      return getOverlapScore(
        new Date(other.startDate),
        new Date(other.endDate),
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
    <AssignTileWrapper
      selected={selectedUserId === userData.id}
      onClick={() =>
        setSelectedUserId(selectedUserId === userData.id ? null : userData.id)
      }
    >
      <AssignTileContentWrapper>
        <AssignTileHeaderWrapper>
          <PBold>{userData.name}</PBold>
          <Small>{userData.email}</Small>
          <IconTextTag icon={Phone} text={userData.phone} />
        </AssignTileHeaderWrapper>
        <AssignTileFooterWrapper>
          <IconTextTag icon={User} text={userData.userRole.toUpperCase()} />
          <IconTextTag icon={Bolt} text={userData.status.toUpperCase()} />
        </AssignTileFooterWrapper>
      </AssignTileContentWrapper>
      <AssignTileScoreWrapper>
        <RyoGoScoreWrapper totalScore={totalScore} label={t("Score")} />
        <AssignTileStatusWrapper>
          {isCurrentlyAssigned ? (
            <RyogoIcon color="sky" icon={CheckCheck} />
          ) : isBooked ? (
            <RyogoIcon color="yellow" icon={TriangleAlertIcon} />
          ) : (
            <RyogoIcon color="green" icon={Check} />
          )}
          <Caption>
            {isCurrentlyAssigned
              ? t("CurrentlyAssigned")
              : isBooked
                ? t("Booked")
                : t("Available")}
          </Caption>
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
