import { PBold, Small, Caption } from "@/components/typography"
import {
  Armchair,
  AirVent,
  BadgeIndianRupee,
  CheckCheck,
  Wrench,
  Check,
  TicketX,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  AssignTileWrapper,
  AssignTileContentWrapper,
  AssignTileHeaderWrapper,
  AssignTileFooterWrapper,
  AssignTileScoreWrapper,
  RyoGoScoreWrapper,
  AssignTileStatusWrapper,
} from "@/components/bookings/assign/assignWrappers"
import getVehicleIcon from "@/components/icons/vehicleIcon"
import { RyogoIcon } from "@/components/icons/RyogoIcon"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  getOverlapScore,
  NoOverlapScore,
  getExpiryScore,
} from "@/components/bookings/getBookingScore"

export default function AssignVehicleTile({
  vehicleData,
  selected,
  onClick,
  bookingStartDate,
  bookingEndDate,
  bookingPassengers,
  bookingNeedsAC,
  bookingId,
  isCurrentlyAssigned,
}: {
  vehicleData: FindVehiclesByAgencyType[number]
  selected: boolean
  onClick: () => void
  bookingStartDate: Date
  bookingEndDate: Date
  bookingPassengers: number
  bookingNeedsAC: boolean
  bookingId?: string
  isCurrentlyAssigned?: boolean
}) {
  const t = useTranslations("Dashboard.AssignVehicle.Tile")

  const bookingOverLapScores = vehicleData.assignedBookings
    .filter((b) => b.id !== bookingId)
    .map((other) => {
      return getOverlapScore(
        new Date(other.startDate),
        new Date(other.endDate),
        bookingStartDate,
        bookingEndDate,
      )
    })
  const repairOverLapScores = vehicleData.vehicleRepairs.map((repair) => {
    return getOverlapScore(
      new Date(repair.startDate),
      new Date(repair.endDate),
      bookingStartDate,
      bookingEndDate,
    )
  })

  const isBooked = bookingOverLapScores.some(
    (score) => score !== NoOverlapScore,
  )

  const isRepairScheduled = repairOverLapScores.some(
    (score) => score !== NoOverlapScore,
  )

  const bookingScore =
    bookingOverLapScores.length === 0
      ? 100
      : bookingOverLapScores.reduce((a, b) => a + b, 0) /
        bookingOverLapScores.length

  const repairScore =
    repairOverLapScores.length === 0
      ? 100
      : repairOverLapScores.reduce((a, b) => a + b, 0) /
        repairOverLapScores.length

  const capacityScore = getCapacityScore(
    vehicleData.capacity,
    bookingPassengers,
  )

  const statusScore = getVehicleStatusScore(vehicleData.status)

  const insuranceScore = getExpiryScore(
    bookingEndDate,
    vehicleData.insuranceExpiresOn,
  )
  const pucScore = getExpiryScore(bookingEndDate, vehicleData.pucExpiresOn)
  const rcScore = getExpiryScore(bookingEndDate, vehicleData.rcExpiresOn)
  const odometerScore = getOdometerScore(vehicleData.odometerReading)

  const ratePerKmScore = getRatePerKmScore(vehicleData.defaultRatePerKm)

  const acScore = vehicleData.hasAC === bookingNeedsAC ? 4 : 1

  const totalScore = getVehicleTotalScore({
    bookingScore,
    repairScore,
    capacityScore,
    statusScore,
    acScore,
    insuranceScore,
    pucScore,
    rcScore,
    odometerScore,
    ratePerKmScore,
  })

  return (
    <AssignTileWrapper selected={selected} onClick={onClick}>
      <AssignTileContentWrapper>
        <AssignTileHeaderWrapper>
          <PBold>{vehicleData.vehicleNumber}</PBold>
          <Small>{vehicleData.brand + " " + vehicleData.model}</Small>
          <div className="flex flex-row gap-1 lg:gap-1.5 items-center">
            {getVehicleIcon(vehicleData.type)}
            <Caption>{vehicleData.color}</Caption>
          </div>
        </AssignTileHeaderWrapper>
        <AssignTileFooterWrapper>
          <IconTextTag
            icon={BadgeIndianRupee}
            text={vehicleData.defaultRatePerKm.toString() + t("PerKm")}
          />
          <IconTextTag
            icon={Armchair}
            text={
              vehicleData.capacity + t("Seats", { count: vehicleData.capacity })
            }
          />
          {vehicleData.hasAC && <IconTextTag icon={AirVent} text={t("AC")} />}
        </AssignTileFooterWrapper>
      </AssignTileContentWrapper>
      <AssignTileScoreWrapper>
        <RyoGoScoreWrapper totalScore={totalScore} label={t("Score")} />
        <AssignTileStatusWrapper>
          {isCurrentlyAssigned ? (
            <RyogoIcon color="sky" icon={CheckCheck} />
          ) : isBooked ? (
            <RyogoIcon color="red" icon={TicketX} />
          ) : isRepairScheduled ? (
            <RyogoIcon color="red" icon={Wrench} />
          ) : (
            <RyogoIcon color="green" icon={Check} />
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
        </AssignTileStatusWrapper>
      </AssignTileScoreWrapper>
    </AssignTileWrapper>
  )
}

const VeryOldVehicleScore = 10
const OldVehicleScore = 50
const MediumOldVehicleScore = 75
const GoodVehicleScore = 100
const BrandNewVehicleScore = 75 //Brand new vehicle is not the best
function getOdometerScore(odoMeter: number): number {
  if (odoMeter > 100000) {
    return VeryOldVehicleScore
  }
  if (odoMeter > 50000) {
    return OldVehicleScore
  }
  if (odoMeter > 10000) {
    return MediumOldVehicleScore
  }
  if (odoMeter < 1000) {
    return BrandNewVehicleScore
  }
  return GoodVehicleScore
}

const LowRateScore = 10
const MediumRateScore = 50
const HighRateScore = 100
const VeryHighRateScore = 75 //Expensive is also not good
function getRatePerKmScore(rate: number): number {
  if (rate < 10) {
    return LowRateScore
  }
  if (rate < 20) {
    return MediumRateScore
  }
  if (rate < 40) {
    return HighRateScore
  }
  return VeryHighRateScore
}

const InactiveScore = 10
const RepairScore = 50
const OnTripScore = 75
const AvailableScore = 100
function getVehicleStatusScore(status: VehicleStatusEnum): number {
  if (status === VehicleStatusEnum.INACTIVE) {
    return InactiveScore
  }
  if (status === VehicleStatusEnum.REPAIR) {
    return RepairScore
  }
  if (status === VehicleStatusEnum.ON_TRIP) {
    return OnTripScore
  }
  return AvailableScore
}

const VeryLowCapacityScore = 10
const LowCapacityScore = 30
const TooMuchOverCapacityScore = 50
const OverCapacityScore = 75
const PerfectCapacityScore = 100
function getCapacityScore(capacity: number, passengers: number): number {
  if (capacity < passengers) {
    //Very low capacity
    if (capacity < passengers * 0.75) {
      return VeryLowCapacityScore
    }
    //Low capacity
    return LowCapacityScore
  }
  if (capacity > passengers) {
    //Too much over capacity
    if (capacity > passengers * 1.25) {
      return TooMuchOverCapacityScore
    }
    //Over capacity
    return OverCapacityScore
  }
  //Perfect capacity
  return PerfectCapacityScore
}

const VehicleWeightage_Booking = 0.25
const VehicleWeightage_Repair = 0.15
const VehicleWeightage_Capacity = 0.2
const VehicleWeightage_Status = 0.1
const VehicleWeightage_AC = 0.05
const VehicleWeightage_Insurance = 0.05
const VehicleWeightage_PUC = 0.05
const VehicleWeightage_RC = 0.05
const VehicleWeightage_Odometer = 0.05
const VehicleWeightage_Rate = 0.05
const getVehicleTotalScore = (data: {
  bookingScore: number
  repairScore: number
  capacityScore: number
  statusScore: number
  acScore: number
  insuranceScore: number
  pucScore: number
  rcScore: number
  odometerScore: number
  ratePerKmScore: number
}) => {
  return (
    data.bookingScore * VehicleWeightage_Booking +
    data.repairScore * VehicleWeightage_Repair +
    data.capacityScore * VehicleWeightage_Capacity +
    data.statusScore * VehicleWeightage_Status +
    data.acScore * VehicleWeightage_AC +
    data.insuranceScore * VehicleWeightage_Insurance +
    data.pucScore * VehicleWeightage_PUC +
    data.rcScore * VehicleWeightage_RC +
    data.odometerScore * VehicleWeightage_Odometer +
    data.ratePerKmScore * VehicleWeightage_Rate
  )
}
