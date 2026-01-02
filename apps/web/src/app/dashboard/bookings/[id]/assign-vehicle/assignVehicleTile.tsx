import { PBold, Small, H2, Caption } from "@/components/typography"
import {
  LucideArmchair,
  LucideAirVent,
  LucideTicketX,
  LucideWrench,
  LucideCheck,
  LucideBadgeIndianRupee,
} from "lucide-react"
import { useTranslations } from "next-intl"
import {
  getOverlapScore,
  NoOverlapScore,
  getCapacityScore,
  getVehicleStatusScore,
  tileLeftClassName,
  tileHeaderLeftClassName,
  tileFooterClassName,
  tileStatusClassName,
  tileRightClassName,
  tileRedIconClassName,
  tileGreenIconClassName,
  getExpiryScore,
  getOdometerScore,
  getRatePerKmScore,
  getRyogoScoreClassName,
  getTileClassName,
  getVehicleTypeIcon,
  getVehicleTotalScore,
} from "../../new/newBookingCommon"
import { IconTextTag } from "../../new/newBookingTileTag"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"

type AssignVehicleTileProps = {
  vehicleData: Awaited<ReturnType<FindVehiclesByAgencyType>>[number]
  booking: NonNullable<FindBookingDetailsByIdType>
  selectedVehicleId: string | null
  setSelectedVehicleId: (vehicleId: string | null) => void
}
export default function AssignVehicleTile({
  vehicleData,
  booking,
  selectedVehicleId,
  setSelectedVehicleId,
}: AssignVehicleTileProps) {
  const t = useTranslations("Dashboard.AssignVehicle.Tile")

  const isCurrentlyAssigned = booking.assignedVehicleId == vehicleData.id

  const bookingStartDate = new Date(booking.startDate)
  const bookingEndDate = new Date(booking.endDate)

  const bookingOverLapScores = vehicleData.assignedBookings
    .filter((b) => b.id != booking.id)
    .map((other) => {
      return getOverlapScore(
        new Date(other.startDate),
        new Date(other.endDate),
        bookingStartDate,
        bookingEndDate
      )
    })
  const repairOverLapScores = vehicleData.vehicleRepairs.map((repair) => {
    return getOverlapScore(
      new Date(repair.startDate),
      new Date(repair.endDate),
      bookingStartDate,
      bookingEndDate
    )
  })

  const isBooked = bookingOverLapScores.some((score) => score != NoOverlapScore)

  const isRepairScheduled = repairOverLapScores.some(
    (score) => score != NoOverlapScore
  )

  const bookingScore =
    bookingOverLapScores.length == 0
      ? 100
      : bookingOverLapScores.reduce((a, b) => a + b, 0) /
        bookingOverLapScores.length

  const repairScore =
    repairOverLapScores.length == 0
      ? 100
      : repairOverLapScores.reduce((a, b) => a + b, 0) /
        repairOverLapScores.length

  const capacityScore = getCapacityScore(
    vehicleData.capacity,
    booking.passengers
  )

  const statusScore = getVehicleStatusScore(vehicleData.status)

  const insuranceScore = getExpiryScore(
    bookingEndDate,
    vehicleData.insuranceExpiresOn
  )
  const pucScore = getExpiryScore(bookingEndDate, vehicleData.pucExpiresOn)
  const odometerScore = getOdometerScore(vehicleData.odometerReading)

  const ratePerKmScore = getRatePerKmScore(vehicleData.defaultRatePerKm)

  const acScore = vehicleData.hasAC == booking.needsAc ? 4 : 1

  const totalScore = getVehicleTotalScore({
    bookingScore,
    repairScore,
    capacityScore,
    statusScore,
    acScore,
    insuranceScore,
    pucScore,
    odometerScore,
    ratePerKmScore,
  })

  return (
    <div
      className={getTileClassName(selectedVehicleId == vehicleData.id)}
      onClick={() =>
        setSelectedVehicleId(
          selectedVehicleId == vehicleData.id ? null : vehicleData.id
        )
      }
    >
      <div className={tileLeftClassName}>
        <div className={tileHeaderLeftClassName}>
          <PBold>{vehicleData.vehicleNumber}</PBold>
          <Small>{vehicleData.brand + " " + vehicleData.model}</Small>
          <IconTextTag
            icon={getVehicleTypeIcon(vehicleData.type)}
            text={vehicleData.color}
          />
        </div>
        <div className={tileFooterClassName}>
          <IconTextTag
            icon={LucideBadgeIndianRupee}
            text={vehicleData.defaultRatePerKm.toString() + t("PerKm")}
          />
          <IconTextTag
            icon={LucideArmchair}
            text={
              vehicleData.capacity + t("Seats", { count: vehicleData.capacity })
            }
          />
          {vehicleData.hasAC && (
            <IconTextTag icon={LucideAirVent} text={t("AC")} />
          )}
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
          ) : isRepairScheduled ? (
            <LucideWrench className={tileRedIconClassName} />
          ) : (
            <LucideCheck className={tileGreenIconClassName} />
          )}
          <Caption>
            {isCurrentlyAssigned
              ? t("CurrentlyAssigned")
              : isBooked
              ? t("Booked")
              : isRepairScheduled
              ? t("RepairScheduled")
              : t("Available")}
          </Caption>
        </div>
      </div>
    </div>
  )
}
