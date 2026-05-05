import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { useTranslations } from "next-intl"
import { PBold, Small, Caption } from "@/components/typography"
import {
  Phone,
  BadgeIndianRupee,
  TicketX,
  CalendarX,
  Check,
  CheckCheck,
  LucideIcon,
} from "lucide-react"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { getCanDriveIcons } from "@/components/icons/vehicleIcon"
import { RyogoIcon } from "@/components/icons/RyogoIcon"
import { DriverStatusEnum, VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  getExpiryScore,
  getOverlapScore,
  NoOverlapScore,
} from "@/components/bookings/getBookingScore"
import {
  AssignTileWrapper,
  AssignTileContentWrapper,
  AssignTileHeaderWrapper,
  AssignTileFooterWrapper,
  AssignTileScoreWrapper,
  RyoGoScoreWrapper,
  AssignTileStatusWrapper,
} from "@/components/bookings/assign/assignWrappers"

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
        new Date(other.startDate),
        new Date(other.endDate),
        bookingStartDate,
        bookingEndDate,
      )
    })

  const leaveOverLapScores = driverData.driverLeaves.map((leave) => {
    return getOverlapScore(
      new Date(leave.startDate),
      new Date(leave.endDate),
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

  const totalScore = getDriverTotalScore({
    bookingScore,
    leaveScore,
    statusScore,
    licenseScore,
    allowanceScore,
    canDriveScore,
  })

  return (
    <AssignTileWrapper selected={selected} onClick={onClick}>
      <AssignTileContentWrapper>
        <AssignTileHeaderWrapper>
          <PBold>{driverData.name}</PBold>
          <Small>{driverData.address}</Small>
          <IconTextTag icon={Phone} text={driverData.phone} />
        </AssignTileHeaderWrapper>
        <AssignTileFooterWrapper>
          <IconTextTag
            icon={BadgeIndianRupee}
            text={driverData.defaultAllowancePerDay.toString() + t("PerDay")}
          />
          <IconsTag icons={getCanDriveIcons(driverData.canDriveVehicleTypes)} />
        </AssignTileFooterWrapper>
      </AssignTileContentWrapper>
      <AssignTileScoreWrapper>
        <RyoGoScoreWrapper totalScore={totalScore} label={t("Score")} />
        <AssignTileStatusWrapper>
          {isCurrentlyAssigned ? (
            <RyogoIcon icon={CheckCheck} color="sky" />
          ) : isBooked ? (
            <RyogoIcon icon={TicketX} color="red" />
          ) : isOnLeave ? (
            <RyogoIcon icon={CalendarX} color="red" />
          ) : (
            <RyogoIcon icon={Check} color="green" />
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
        </AssignTileStatusWrapper>
      </AssignTileScoreWrapper>
    </AssignTileWrapper>
  )
}

export function IconsTag(props: { icons: LucideIcon[] }) {
  return (
    <div className="flex flex-row gap-1 lg:gap-1.5 items-center">
      {props.icons.map((Icon, index) => {
        return <RyogoIcon key={index} icon={Icon} />
      })}
    </div>
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
const DriverWeightage_Status = 0.15
const DriverWeightage_License = 0.1
const DriverWeightage_Allowance = 0.1
const DriverWeightage_CanDrive = 0.1
const getDriverTotalScore = (data: {
  bookingScore: number
  leaveScore: number
  statusScore: number
  licenseScore: number
  allowanceScore: number
  canDriveScore: number
}) => {
  return (
    data.bookingScore * DriverWeightage_Booking +
    data.leaveScore * DriverWeightage_Leave +
    data.statusScore * DriverWeightage_Status +
    data.licenseScore * DriverWeightage_License +
    data.allowanceScore * DriverWeightage_Allowance +
    data.canDriveScore * DriverWeightage_CanDrive
  )
}
