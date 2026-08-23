import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { useTranslations } from "next-intl"
import { RyogoP, RyogoCaption } from "@/components/typography"
import {
  BadgeIndianRupee,
  TicketX,
  CalendarX,
  Check,
  CheckCheck,
  User,
  Star,
} from "lucide-react"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { DriverStatusEnum, VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  getCustomerRatingScore,
  getExpiryScore,
  getOverlapScore,
  NoOverlapScore,
} from "@/components/flows/bookings/getBookingScore"
import {
  AssignTileWrapper,
  AssignTileContentWrapper,
  AssignTileHeaderWrapper,
  AssignTileFooterWrapper,
  AssignTileScoreWrapper,
  RyoGoScoreWrapper,
  AssignTileStatusWrapper,
} from "@/components/flows/bookings/assign/assignWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getAverageRating } from "@/lib/utils"

export default function AssignDriverTile({
  driverData,
  selected,
  onClick,
  bookingStartDate,
  bookingEndDate,
  bookingPassengers,
  bookingId,
  isCurrentlyAssigned,
}: {
  driverData: FindDriversByAgencyType[number]
  selected: boolean
  onClick: () => void
  bookingStartDate: Date
  bookingEndDate: Date
  bookingPassengers: number
  bookingId?: string
  isCurrentlyAssigned?: boolean
}) {
  const t = useTranslations("Dashboard.AssignDriver.Tile")

  const bookingOverLapScores = driverData.assignedBookings
    .filter((b) => b.id !== bookingId)
    .map((other) => {
      return getOverlapScore(
        other.startDate,
        other.endDate,
        bookingStartDate,
        bookingEndDate,
      )
    })

  const leaveOverLapScores = driverData.driverLeaves.map((leave) => {
    return getOverlapScore(
      leave.startDate,
      leave.endDate,
      bookingStartDate,
      bookingEndDate,
    )
  })

  const isBooked = bookingOverLapScores.some(
    (score) => score !== NoOverlapScore,
  )

  const isOnLeave = leaveOverLapScores.some((score) => score !== NoOverlapScore)

  const bookingScore =
    bookingOverLapScores.length === 0
      ? 100
      : bookingOverLapScores.reduce((a, b) => a + b, 0) /
        bookingOverLapScores.length

  const leaveScore =
    leaveOverLapScores.length === 0
      ? 100
      : leaveOverLapScores.reduce((a, b) => a + b, 0) /
        leaveOverLapScores.length

  const statusScore = getDriverStatusScore(driverData.status)

  const licenseScore = getExpiryScore(
    bookingEndDate,
    driverData.licenseExpiresOn,
  )

  const allowanceScore = getAllowanceScore(driverData.defaultAllowancePerDay)

  const canDriveScore = getCanDriveScore(
    driverData.canDriveVehicleTypes,
    bookingPassengers,
  )

  const customerRatingScore = getCustomerRatingScore(driverData.customerRatings)

  const totalScore = getDriverTotalScore({
    bookingScore,
    leaveScore,
    statusScore,
    licenseScore,
    allowanceScore,
    canDriveScore,
    customerRatingScore,
  })

  return (
    <AssignTileWrapper selected={selected} onClick={onClick}>
      <AssignTileContentWrapper>
        <AssignTileHeaderWrapper>
          {driverData.user.photoUrl ? (
            <RyogoImage
              src={getFileUrl(driverData.user.photoUrl)}
              alt={driverData.name}
              imageSize="sm"
            />
          ) : (
            <RyogoEnclosedIcon icon={User} size="md" />
          )}
          <RyogoP weight="font-bold"> {driverData.name}</RyogoP>
          <RyogoCaption color="slate">{driverData.phone}</RyogoCaption>
          <RyogoCaption color="light">{driverData.address}</RyogoCaption>
          {driverData.customerRatings &&
            driverData.customerRatings.length > 0 && (
              <IconTextTag
                icon={Star}
                text={getAverageRating(driverData.customerRatings)}
              />
            )}
        </AssignTileHeaderWrapper>
        <AssignTileFooterWrapper>
          <IconTextTag
            icon={BadgeIndianRupee}
            text={driverData.defaultAllowancePerDay.toString() + t("PerDay")}
          />
          <GetCanDriveIcons canDrive={driverData.canDriveVehicleTypes} />
        </AssignTileFooterWrapper>
      </AssignTileContentWrapper>
      <AssignTileScoreWrapper>
        <RyoGoScoreWrapper totalScore={totalScore} label={t("Score")} />
        <AssignTileStatusWrapper selected={selected}>
          {isCurrentlyAssigned ? (
            <RyogoIcon icon={CheckCheck} size="sm" color="brand" />
          ) : isBooked ? (
            <RyogoIcon icon={TicketX} size="sm" color="red" />
          ) : isOnLeave ? (
            <RyogoIcon icon={CalendarX} size="sm" color="red" />
          ) : (
            <RyogoIcon icon={Check} size="sm" color="green" />
          )}
          <RyogoCaption color="slate">
            {isCurrentlyAssigned
              ? t("CurrentlyAssigned")
              : isBooked
                ? t("Booked")
                : isOnLeave
                  ? t("Leave")
                  : t("Available")}
          </RyogoCaption>
        </AssignTileStatusWrapper>
      </AssignTileScoreWrapper>
    </AssignTileWrapper>
  )
}

const LowAllowanceScore = 75
const MediumAllowanceScore = 100
const HighAllowanceScore = 50
const VeryHighAllowanceScore = 10
function getAllowanceScore(allowance: number): number {
  if (allowance < 500) {
    return LowAllowanceScore
  }
  if (allowance < 1000) {
    return MediumAllowanceScore
  }
  if (allowance < 2000) {
    return HighAllowanceScore
  }
  return VeryHighAllowanceScore
}

const InactiveScore = 10
const LeaveScore = 50
const OnTripScore = 75
const AvailableScore = 100
function getDriverStatusScore(status: DriverStatusEnum): number {
  if (status === DriverStatusEnum.INACTIVE) {
    return InactiveScore
  }
  if (status === DriverStatusEnum.LEAVE) {
    return LeaveScore
  }
  if (status === DriverStatusEnum.ON_TRIP) {
    return OnTripScore
  }
  return AvailableScore
}

const HighCanDriveScore = 100
const MediumCanDriveScore = 50
const LowCanDriveScore = 10
function getCanDriveScore(
  canDrive: VehicleTypesEnum[],
  passengers: number,
): number {
  if (passengers < 1) {
    if (canDrive.includes(VehicleTypesEnum.TRUCK)) {
      return HighCanDriveScore
    } else {
      return LowCanDriveScore
    }
  }
  if (passengers < 2) {
    if (canDrive.includes(VehicleTypesEnum.BIKE)) {
      return HighCanDriveScore
    } else {
      return LowCanDriveScore
    }
  }
  if (passengers < 7) {
    if (canDrive.includes(VehicleTypesEnum.CAR)) {
      return HighCanDriveScore
    } else {
      return LowCanDriveScore
    }
  }
  if (canDrive.includes(VehicleTypesEnum.BUS)) {
    return HighCanDriveScore
  }
  return MediumCanDriveScore
}

const DriverWeightage_Booking = 0.35
const DriverWeightage_Leave = 0.2
const DriverWeightage_Status = 0.05
const DriverWeightage_License = 0.1
const DriverWeightage_Allowance = 0.1
const DriverWeightage_CanDrive = 0.1
const DriverWeightage_CustomerRating = 0.1
const getDriverTotalScore = (data: {
  bookingScore: number
  leaveScore: number
  statusScore: number
  licenseScore: number
  allowanceScore: number
  canDriveScore: number
  customerRatingScore: number
}) => {
  return (
    data.bookingScore * DriverWeightage_Booking +
    data.leaveScore * DriverWeightage_Leave +
    data.statusScore * DriverWeightage_Status +
    data.licenseScore * DriverWeightage_License +
    data.allowanceScore * DriverWeightage_Allowance +
    data.canDriveScore * DriverWeightage_CanDrive +
    data.customerRatingScore * DriverWeightage_CustomerRating
  )
}
