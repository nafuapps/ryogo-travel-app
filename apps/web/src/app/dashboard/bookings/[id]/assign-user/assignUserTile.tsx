import { FindOwnerAndAgentsByAgencyType } from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { PBold, Small, H2, Caption } from "@/components/typography"
import {
  LucidePhone,
  LucideTicketX,
  LucideCheck,
  LucideUser,
  LucideBolt,
} from "lucide-react"
import {
  getUserStatusScore,
  getUserTotalScore,
  getUserRoleScore,
  getOverlapScore,
  getRyogoScoreClassName,
  getTileClassName,
  NoOverlapScore,
  tileFooterClassName,
  tileGreenIconClassName,
  tileHeaderLeftClassName,
  tileLeftClassName,
  tileRedIconClassName,
  tileRightClassName,
  tileStatusClassName,
} from "../../new/newBookingCommon"
import { IconTextTag } from "../../new/newBookingTileTag"

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

  const isCurrentlyAssigned = booking.assignedUserId == userData.id

  const bookingStartDate = new Date(booking.startDate)
  const bookingEndDate = new Date(booking.endDate)

  const bookingOverLapScores = userData.bookingsAssigned
    .filter((b) => b.id != booking.id)
    .map((other) => {
      return getOverlapScore(
        new Date(other.startDate),
        new Date(other.endDate),
        bookingStartDate,
        bookingEndDate
      )
    })
  const isBooked = bookingOverLapScores.some((score) => score == NoOverlapScore)

  const bookingScore =
    bookingOverLapScores.length == 0
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
    <div
      className={getTileClassName(selectedUserId == userData.id)}
      onClick={() =>
        setSelectedUserId(selectedUserId == userData.id ? null : userData.id)
      }
    >
      <div className={tileLeftClassName}>
        <div className={tileHeaderLeftClassName}>
          <PBold>{userData.name}</PBold>
          <Small>{userData.email}</Small>
          <IconTextTag icon={LucidePhone} text={userData.phone} />
        </div>
        <div className={tileFooterClassName}>
          <IconTextTag
            icon={LucideUser}
            text={userData.userRole.toUpperCase()}
          />
          <IconTextTag icon={LucideBolt} text={userData.status.toUpperCase()} />
        </div>
      </div>
      <div className={tileRightClassName}>
        <div className={getRyogoScoreClassName(totalScore)}>
          <Caption>{t("Score")}</Caption>
          <H2>{totalScore.toFixed(0)}</H2>
        </div>
        <div className={tileStatusClassName}>
          {isCurrentlyAssigned ? (
            <></>
          ) : isBooked ? (
            <LucideTicketX className={tileRedIconClassName} />
          ) : (
            <LucideCheck className={tileGreenIconClassName} />
          )}
          <Caption>
            {isCurrentlyAssigned
              ? t("CurrentlyAssigned")
              : isBooked
              ? t("Booked")
              : t("Available")}
          </Caption>
        </div>
      </div>
    </div>
  )
}
