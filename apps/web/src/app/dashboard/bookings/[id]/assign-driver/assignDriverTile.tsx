import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { useTranslations } from "next-intl"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { PBold, Small, H2, Caption } from "@/components/typography"
import {
  LucidePhone,
  LucideBadgeIndianRupee,
  LucideTicketX,
  LucideCalendarX,
  LucideCheck,
} from "lucide-react"
import {
  getAllowanceScore,
  getCanDriveIcons,
  getCanDriveScore,
  getDriverStatusScore,
  getDriverTotalScore,
  getExpiryScore,
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
import { IconTextTag, IconsTag } from "../../new/newBookingTileTag"

type AssignDriverTileProps = {
  driverData: FindDriversByAgencyType[number]
  selectedDriverId: string | null
  setSelectedDriverId: (driverId: string | null) => void
  booking: NonNullable<FindBookingDetailsByIdType>
}
export default function AssignDriverTile({
  driverData,
  booking,
  selectedDriverId,
  setSelectedDriverId,
}: AssignDriverTileProps) {
  const t = useTranslations("Dashboard.AssignDriver.Tile")

  const isCurrentlyAssigned = booking.assignedDriverId == driverData.id

  const bookingStartDate = new Date(booking.startDate)
  const bookingEndDate = new Date(booking.endDate)

  const bookingOverLapScores = driverData.assignedBookings
    .filter((b) => b.id != booking.id)
    .map((other) => {
      return getOverlapScore(
        new Date(other.startDate),
        new Date(other.endDate),
        bookingStartDate,
        bookingEndDate
      )
    })

  const leaveOverLapScores = driverData.driverLeaves.map((leave) => {
    return getOverlapScore(
      new Date(leave.startDate),
      new Date(leave.endDate),
      bookingStartDate,
      bookingEndDate
    )
  })

  const isBooked = bookingOverLapScores.some((score) => score != NoOverlapScore)

  const isOnLeave = leaveOverLapScores.some((score) => score != NoOverlapScore)

  const bookingScore =
    bookingOverLapScores.length == 0
      ? 100
      : bookingOverLapScores.reduce((a, b) => a + b, 0) /
        bookingOverLapScores.length

  const leaveScore =
    leaveOverLapScores.length == 0
      ? 100
      : leaveOverLapScores.reduce((a, b) => a + b, 0) /
        leaveOverLapScores.length

  const statusScore = getDriverStatusScore(driverData.status)

  const licenseScore = getExpiryScore(
    bookingEndDate,
    driverData.licenseExpiresOn
  )

  const allowanceScore = getAllowanceScore(driverData.defaultAllowancePerDay)

  const canDriveScore = getCanDriveScore(
    driverData.canDriveVehicleTypes,
    booking.passengers
  )

  const totalScore = getDriverTotalScore({
    bookingScore,
    leaveScore,
    statusScore,
    licenseScore,
    allowanceScore,
    canDriveScore,
  })

  return (
    <div
      className={getTileClassName(selectedDriverId == driverData.id)}
      onClick={() =>
        setSelectedDriverId(
          selectedDriverId == driverData.id ? null : driverData.id
        )
      }
    >
      <div className={tileLeftClassName}>
        <div className={tileHeaderLeftClassName}>
          <PBold>{driverData.name}</PBold>
          <Small>{driverData.address}</Small>
          <IconTextTag icon={LucidePhone} text={driverData.phone} />
        </div>
        <div className={tileFooterClassName}>
          <IconTextTag
            icon={LucideBadgeIndianRupee}
            text={driverData.defaultAllowancePerDay.toString() + t("PerDay")}
          />
          <IconsTag icons={getCanDriveIcons(driverData.canDriveVehicleTypes)} />
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
          ) : isOnLeave ? (
            <LucideCalendarX className={tileRedIconClassName} />
          ) : (
            <LucideCheck className={tileGreenIconClassName} />
          )}
          <Caption>
            {isCurrentlyAssigned
              ? t("CurrentlyAssigned")
              : isBooked
              ? t("Booked")
              : isOnLeave
              ? t("Leave")
              : t("Available")}
          </Caption>
        </div>
      </div>
    </div>
  )
}
