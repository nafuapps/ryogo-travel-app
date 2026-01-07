import { useTranslations } from "next-intl"
import { UseFormSetValue, useWatch } from "react-hook-form"
import {
  NewBookingFormDataType,
  getOverlapScore,
  getDriverStatusScore,
  Step3Type,
  NoOverlapScore,
  tileFooterClassName,
  tileGreenIconClassName,
  tileHeaderLeftClassName,
  tileLeftClassName,
  tileRedIconClassName,
  tileRightClassName,
  tileStatusClassName,
  getExpiryScore,
  getAllowanceScore,
  getCanDriveScore,
  getRyogoScoreClassName,
  getTileClassName,
  getDriverTotalScore,
  getCanDriveIcons,
} from "./newBookingCommon"
import { PBold, H2, Caption, Small } from "@/components/typography"
import { IconsTag, IconTextTag } from "./newBookingTileTag"
import {
  LucideTicketX,
  LucideCalendarX,
  LucideCheck,
  LucideBadgeIndianRupee,
  LucidePhone,
} from "lucide-react"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"

type NewBookingDriverTileProps = {
  driverData: FindDriversByAgencyType[number]
  newBookingFormData: NewBookingFormDataType
  setValue: UseFormSetValue<Step3Type>
}
export default function NewBookingDriverTile({
  driverData,
  newBookingFormData,
  setValue,
}: NewBookingDriverTileProps) {
  const assignedDriverIdWatch = useWatch({
    name: "assignedDriverId",
  })
  const t = useTranslations("Dashboard.NewBooking.Form.Step3.Driver")

  const bookingOverLapScores = driverData.assignedBookings.map((other) => {
    return getOverlapScore(
      new Date(other.startDate),
      new Date(other.endDate),
      newBookingFormData.tripStartDate,
      newBookingFormData.tripEndDate
    )
  })

  const leaveOverLapScores = driverData.driverLeaves.map((leave) => {
    return getOverlapScore(
      new Date(leave.startDate),
      new Date(leave.endDate),
      newBookingFormData.tripStartDate,
      newBookingFormData.tripEndDate
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
    newBookingFormData.tripEndDate,
    driverData.licenseExpiresOn
  )

  const allowanceScore = getAllowanceScore(driverData.defaultAllowancePerDay)

  const canDriveScore = getCanDriveScore(
    driverData.canDriveVehicleTypes,
    newBookingFormData.tripPassengers
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
      className={getTileClassName(assignedDriverIdWatch == driverData.id)}
      onClick={() =>
        setValue(
          "assignedDriverId",
          assignedDriverIdWatch == driverData.id ? undefined : driverData.id
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
          {isBooked ? (
            <LucideTicketX className={tileRedIconClassName} />
          ) : isOnLeave ? (
            <LucideCalendarX className={tileRedIconClassName} />
          ) : (
            <LucideCheck className={tileGreenIconClassName} />
          )}
          <Caption>
            {isBooked ? t("Booked") : isOnLeave ? t("Leave") : t("Available")}
          </Caption>
        </div>
      </div>
    </div>
  )
}
