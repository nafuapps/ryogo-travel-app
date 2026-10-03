import { RyogoSmall, RyogoCaption } from "@/components/typography"
import {
  Armchair,
  AirVent,
  BadgeIndianRupee,
  CheckCheck,
  Wrench,
  Check,
  TicketX,
  Star,
  CircleGauge,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  AssignTileWrapper,
  RyoGoScoreWrapper,
  AssignTileStatusWrapper,
} from "@/components/flows/bookings/assign/assignWrappers"
import GetVehicleEnclosedIcon from "@/components/icons/vehicleIcon"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  getOverlapScore,
  NoOverlapScore,
  getExpiryScore,
  getCustomerRatingScore,
} from "@/components/flows/bookings/assign/getBookingScore"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoTagWithoutBG } from "@/components/tags/ryogoTag"
import { getAverageRating } from "@/lib/utils"

export default function AssignVehicleTile({
  vehicleData,
  selected,
  onClick,
  bookingStartDate,
  bookingEndDate,
  bookingPassengers,
  bookingNeedsAC,
  bookingId,
  bookingSourceId,
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
  bookingSourceId?: string
  isCurrentlyAssigned?: boolean
}) {
  const t = useTranslations("Dashboard.AssignVehicle.Tile")

  const bookingOverLapScores = vehicleData.assignedBookings
    .filter((b) => b.id !== bookingId)
    .map((other) => {
      return getOverlapScore(
        other.startDate,
        other.endDate,
        bookingStartDate,
        bookingEndDate,
      )
    })
  const repairOverLapScores = vehicleData.vehicleRepairs.map((repair) => {
    return getOverlapScore(
      repair.startDate,
      repair.endDate,
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

  const acScore =
    bookingNeedsAC === vehicleData.hasAC ? 100 : vehicleData.hasAC ? 50 : 0

  const customerRatingScore = getCustomerRatingScore(
    vehicleData.customerRatings,
  )

  const locationScore =
    vehicleData.visitingLocationId &&
    vehicleData.visitingLocationId === bookingSourceId
      ? 100
      : 0

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
    customerRatingScore,
    locationScore,
  })

  return (
    <AssignTileWrapper selected={selected} onClick={onClick}>
      <SectionRowWrapper className="items-center">
        {vehicleData.vehiclePhotoUrl ? (
          <RyogoImage
            src={getFileUrl(vehicleData.vehiclePhotoUrl)}
            alt={vehicleData.vehicleNumber}
            imageSize="md"
          />
        ) : (
          <GetVehicleEnclosedIcon vehicleType={vehicleData.type} size="lg" />
        )}
        <SectionColWrapper small className="w-full">
          <RyogoSmall weight="font-bold">
            {vehicleData.vehicleNumber}
          </RyogoSmall>
          <SectionRowWrapper className="items-center">
            <RyogoCaption color="light" weight="font-medium">
              {vehicleData.brand + " " + vehicleData.model}
            </RyogoCaption>
          </SectionRowWrapper>
        </SectionColWrapper>
        <RyoGoScoreWrapper totalScore={totalScore} label={t("Score")} />
      </SectionRowWrapper>
      <SectionRowWrapper className="items-center justify-between">
        <RyogoTagWithoutBG
          label={vehicleData.defaultRatePerKm.toString() + t("PerKm")}
          icon={BadgeIndianRupee}
        />
        <RyogoTagWithoutBG
          icon={Armchair}
          label={vehicleData.capacity.toString()}
        />
        <RyogoTagWithoutBG
          label={vehicleData.odometerReading + t("Km")}
          icon={CircleGauge}
        />
        {vehicleData.hasAC && (
          <RyogoTagWithoutBG icon={AirVent} label={t("AC")} />
        )}
        {vehicleData.customerRatings &&
          vehicleData.customerRatings.length > 0 && (
            <RyogoTagWithoutBG
              label={getAverageRating(vehicleData.customerRatings)}
              icon={Star}
            />
          )}
      </SectionRowWrapper>
      <AssignTileStatusWrapper selected={selected}>
        {isCurrentlyAssigned ? (
          <RyogoIcon color="brand" icon={CheckCheck} size="xs" thick />
        ) : isBooked ? (
          <RyogoIcon color="red" icon={TicketX} size="xs" thick />
        ) : isRepairScheduled ? (
          <RyogoIcon color="yellow" icon={Wrench} size="xs" thick />
        ) : (
          <RyogoIcon color="green" icon={Check} size="xs" thick />
        )}
        <RyogoCaption color="slate">
          {isCurrentlyAssigned
            ? t("CurrentlyAssigned")
            : isBooked
              ? t("Booked")
              : isRepairScheduled
                ? t("RepairScheduled")
                : t("Available")}
        </RyogoCaption>
      </AssignTileStatusWrapper>
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
const VehicleWeightage_Capacity = 0.15
const VehicleWeightage_Status = 0.05
const VehicleWeightage_AC = 0.05
const VehicleWeightage_Insurance = 0.05
const VehicleWeightage_PUC = 0.05
const VehicleWeightage_RC = 0.05
const VehicleWeightage_Odometer = 0.05
const VehicleWeightage_Rate = 0.05
const VehicleWeightage_CustomerRating = 0.05
const VehicleWeigtage_Location = 0.05
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
  customerRatingScore: number
  locationScore: number
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
    data.ratePerKmScore * VehicleWeightage_Rate +
    data.customerRatingScore * VehicleWeightage_CustomerRating +
    data.locationScore * VehicleWeigtage_Location
  )
}
