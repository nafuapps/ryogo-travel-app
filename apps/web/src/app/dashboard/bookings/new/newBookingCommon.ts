import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import {
  DriverStatusEnum,
  VehicleStatusEnum,
  BookingTypeEnum,
  VehicleTypesEnum,
  UserStatusEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import {
  LucideArrowRightFromLine,
  LucideArrowRightLeft,
  LucideBus,
  LucideCar,
  LucideMotorbike,
  LucideProps,
  LucideTractor,
  LucideTruck,
  LucideWaypoints,
} from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

export type NewBookingFormDataType = {
  customerPhone?: string
  existingCustomer: FindCustomersInAgencyType[number] | undefined
  newCustomerName?: string
  newCustomerLocationState?: string
  newCustomerLocationCity?: string
  tripSourceLocationState: string
  tripSourceLocationCity: string
  tripDestinationLocationState: string
  tripDestinationLocationCity?: string
  routeId?: string
  sourceId?: string
  destinationId?: string
  tripType: BookingTypeEnum
  tripStartDate: Date
  tripEndDate: Date
  tripPassengers: number
  tripNeedsAC: boolean
  tripRemarks?: string
  assignedVehicleId?: string
  assignedDriverId?: string
  selectedRatePerKm?: number
  selectedDistance?: number
  selectedAcChargePerDay?: number
  selectedAllowancePerDay?: number
  selectedCommissionRate?: number
}

export type NewBookingAgencyLocationType = {
  id: string
  city: string
  state: string
}

export const FullOverlapScore = 10
export const PartialOverlapScore = 25
export const TouchingOverlapScore = 75
export const NoOverlapScore = 100
export function getOverlapScore(
  otherStart: Date,
  otherEnd: Date,
  newBookingStart: Date,
  newBookingEnd: Date
): number {
  //Full Overlap
  if (otherStart <= newBookingStart && otherEnd >= newBookingEnd) {
    return FullOverlapScore
  }
  //Partial overlap
  if (
    (otherStart <= newBookingStart && newBookingStart <= otherEnd) ||
    (otherStart <= newBookingEnd && newBookingEnd <= otherEnd)
  ) {
    return PartialOverlapScore
  }
  //Touching
  if (otherEnd == newBookingStart || otherStart == newBookingEnd) {
    return TouchingOverlapScore
  }
  //No overlap
  return NoOverlapScore
}

export const VeryLowCapacityScore = 10
export const LowCapacityScore = 30
export const TooMuchOverCapacityScore = 50
export const OverCapacityScore = 75
export const PerfectCapacityScore = 100
export function getCapacityScore(capacity: number, passengers: number): number {
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

export const InactiveScore = 10
export const RepairScore = 50
export const OnTripScore = 75
export const AvailableScore = 100
export function getVehicleStatusScore(status: VehicleStatusEnum): number {
  if (status == VehicleStatusEnum.INACTIVE) {
    return InactiveScore
  }
  if (status == VehicleStatusEnum.REPAIR) {
    return RepairScore
  }
  if (status == VehicleStatusEnum.ON_TRIP) {
    return OnTripScore
  }
  return AvailableScore
}

export const NoExpiryDateScore = 10
export const ExpiredScore = 10
export const SoonExpiringScore = 50
export const OKExpiryScore = 100
export function getExpiryScore(
  newBookingEndDate: Date,
  expiryDate: Date | null
) {
  if (!expiryDate) {
    return NoExpiryDateScore
  }
  //Expired already or null
  if (expiryDate < new Date()) {
    return ExpiredScore
  }
  if (expiryDate <= newBookingEndDate) {
    //Expiring soon
    return SoonExpiringScore
  }
  //OK
  return OKExpiryScore
}

export const VeryOldVehicleScore = 10
export const OldVehicleScore = 50
export const MediumOldVehicleScore = 75
export const GoodVehicleScore = 100
export const BrandNewVehicleScore = 75 //Brand new vehicle is not the best
export function getOdometerScore(odoMeter: number): number {
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

export const LowRateScore = 10
export const MediumRateScore = 50
export const HighRateScore = 100
export const VeryHighRateScore = 75 //Too high rate is not the best
export function getRatePerKmScore(rate: number): number {
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

export const LowAllowanceScore = 75
export const MediumAllowanceScore = 100
export const HighAllowanceScore = 50
export const VeryHighAllowanceScore = 10
export function getAllowanceScore(allowance: number): number {
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

export const LeaveScore = 50
export function getDriverStatusScore(status: DriverStatusEnum): number {
  if (status == DriverStatusEnum.INACTIVE) {
    return InactiveScore
  }
  if (status == DriverStatusEnum.LEAVE) {
    return LeaveScore
  }
  if (status == DriverStatusEnum.ON_TRIP) {
    return OnTripScore
  }
  return AvailableScore
}

export const HighCanDriveScore = 100
export const MediumCanDriveScore = 50
export const LowCanDriveScore = 10
export function getCanDriveScore(
  canDrive: VehicleTypesEnum[],
  passengers: number
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

export const NewUserScore = 50
export function getUserStatusScore(status: UserStatusEnum): number {
  if (status == UserStatusEnum.INACTIVE) {
    return InactiveScore
  }
  if (status == UserStatusEnum.NEW) {
    return NewUserScore
  }
  return AvailableScore
}

export const OwnerRoleScore = 100
export const AgentRoleScore = 50
export function getUserRoleScore(role: UserRolesEnum): number {
  if (role == UserRolesEnum.OWNER) {
    return OwnerRoleScore
  }
  return AgentRoleScore
}

// Vehicle Score weightage: 25% booking, 15% repair, 25% capacity, 10% status, 5% ac, 5% insurance expiry, 5% puc expiry, 5% odometer, 5% rate/km
export const VehicleWeightage_Booking = 0.25
export const VehicleWeightage_Repair = 0.15
export const VehicleWeightage_Capacity = 0.25
export const VehicleWeightage_Status = 0.1
export const VehicleWeightage_AC = 0.05
export const VehicleWeightage_Insurance = 0.05
export const VehicleWeightage_PUC = 0.05
export const VehicleWeightage_Odometer = 0.05
export const VehicleWeightage_Rate = 0.05

type GetVehicleTotalScoreType = {
  bookingScore: number
  repairScore: number
  capacityScore: number
  statusScore: number
  acScore: number
  insuranceScore: number
  pucScore: number
  odometerScore: number
  ratePerKmScore: number
}
export const getVehicleTotalScore = (data: GetVehicleTotalScoreType) => {
  return (
    data.bookingScore * VehicleWeightage_Booking +
    data.repairScore * VehicleWeightage_Repair +
    data.capacityScore * VehicleWeightage_Capacity +
    data.statusScore * VehicleWeightage_Status +
    data.acScore * VehicleWeightage_AC +
    data.insuranceScore * VehicleWeightage_Insurance +
    data.pucScore * VehicleWeightage_PUC +
    data.odometerScore * VehicleWeightage_Odometer +
    data.ratePerKmScore * VehicleWeightage_Rate
  )
}

// Driver Score weightage: 35% booking, 20% leave, 15% status, 10% license expiry, 10% allowance, 10% can drive
export const DriverWeightage_Booking = 0.35
export const DriverWeightage_Leave = 0.2
export const DriverWeightage_Status = 0.15
export const DriverWeightage_License = 0.1
export const DriverWeightage_Allowance = 0.1
export const DriverWeightage_CanDrive = 0.1

type GetDriverTotalScoreType = {
  bookingScore: number
  leaveScore: number
  statusScore: number
  licenseScore: number
  allowanceScore: number
  canDriveScore: number
}
export const getDriverTotalScore = (data: GetDriverTotalScoreType) => {
  return (
    data.bookingScore * DriverWeightage_Booking +
    data.leaveScore * DriverWeightage_Leave +
    data.statusScore * DriverWeightage_Status +
    data.licenseScore * DriverWeightage_License +
    data.allowanceScore * DriverWeightage_Allowance +
    data.canDriveScore * DriverWeightage_CanDrive
  )
}

// User Score weightage: 60% booking, 30% status, 10% role
export const UserWeightage_Booking = 0.6
export const UserWeightage_Status = 0.3
export const UserWeightage_Role = 0.1

type GetUserTotalScoreType = {
  bookingScore: number
  statusScore: number
  roleScore: number
}
export const getUserTotalScore = (data: GetUserTotalScoreType) => {
  return (
    data.bookingScore * UserWeightage_Booking +
    data.statusScore * UserWeightage_Status +
    data.roleScore * UserWeightage_Role
  )
}

export const BestTotalScore = 100
export const GoodTotalScore = 80
export const MediumTotalScore = 60
export const BadTotalScore = 30

export type Step3Type = {
  assignedDriverId?: string | undefined
  assignedVehicleId?: string | undefined
}

export const NewBookingTotalSteps = 5

export const getVehicleTypeIcon = (vehicleType: VehicleTypesEnum) => {
  if (vehicleType == VehicleTypesEnum.TRUCK) {
    return LucideTruck
  }
  if (vehicleType == VehicleTypesEnum.BUS) {
    return LucideBus
  }
  if (vehicleType == VehicleTypesEnum.CAR) {
    return LucideCar
  }
  if (vehicleType == VehicleTypesEnum.BIKE) {
    return LucideMotorbike
  }
  return LucideTractor
}

export const getTripDuration = (startDate: Date, endDate: Date) => {
  return Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) + 1
}

export const MultiPerDayDistance = 50
export const getFinalPrice = (data: NewBookingFormDataType) => {
  const days = getTripDuration(data.tripStartDate, data.tripEndDate)
  const commissionRate = data.selectedCommissionRate!

  let totalDistance = data.selectedDistance!
  let totalAllowanceDays = 1

  if (data.tripType == BookingTypeEnum.Round) {
    //For round trip, double the vehicle rental
    totalDistance *= 2
    if (days > 1) {
      //For round trip, double the driver allowance if not returning same day
      totalAllowanceDays *= 2
    } else {
      totalAllowanceDays = 1.5
    }
  } else if (data.tripType == BookingTypeEnum.MultiDay) {
    //For multi day trip, include intermediate tour days @ X(50) km
    totalDistance = totalDistance * 2 + (days - 2) * MultiPerDayDistance
    //For multi day trip, driver allowance is for each day
    totalAllowanceDays *= days
  }

  const totalAcPrice = data.tripNeedsAC
    ? Math.round(data.selectedAcChargePerDay! * totalAllowanceDays)
    : 0

  const totalVehiclePrice = Math.round(totalDistance * data.selectedRatePerKm!)
  const totalDriverAllowance = Math.round(
    totalAllowanceDays * data.selectedAllowancePerDay!
  )

  const netPrice = totalVehiclePrice + totalDriverAllowance + totalAcPrice

  const totalCommission = Math.round((netPrice * commissionRate) / 100)

  const totalAmount = netPrice + totalCommission

  return {
    totalVehiclePrice,
    totalDistance,
    totalDriverAllowance,
    totalAcPrice,
    totalCommission,
    totalAmount,
    totalAllowanceDays,
    days,
  }
}

export const getCanDriveIcons = (canDrive: VehicleTypesEnum[]) => {
  const icons: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >[] = []

  if (canDrive.includes(VehicleTypesEnum.BIKE)) {
    icons.push(LucideMotorbike)
  }
  if (canDrive.includes(VehicleTypesEnum.CAR)) {
    icons.push(LucideCar)
  }
  if (canDrive.includes(VehicleTypesEnum.BUS)) {
    icons.push(LucideBus)
  }
  if (canDrive.includes(VehicleTypesEnum.TRUCK)) {
    icons.push(LucideTruck)
  }
  return icons
}

export const getTripTypeIcon = (tripType: BookingTypeEnum) => {
  if (tripType == BookingTypeEnum.OneWay) {
    return LucideArrowRightFromLine
  }
  if (tripType == BookingTypeEnum.Round) {
    return LucideArrowRightLeft
  }
  return LucideWaypoints
}

export const getRyogoScoreClassName = (totalScore: number): string => {
  return `flex flex-col rounded-lg items-center justify-center text-center gap-1 lg:gap-1.5 p-3 lg:p-4 ${
    totalScore < BadTotalScore
      ? "bg-red-300"
      : totalScore < MediumTotalScore
      ? "bg-orange-300"
      : totalScore < GoodTotalScore
      ? "bg-yellow-300"
      : totalScore < BestTotalScore
      ? "bg-green-300"
      : "bg-cyan-300"
  }`
}

export const getTileClassName = (selected: boolean) => {
  return `flex flex-row justify-between items-start gap-2 lg:gap-3 rounded-lg p-3 lg:p-4 border ${
    selected
      ? "border-slate-400 bg-slate-200"
      : "border-slate-100 hover:bg-slate-100"
  }`
}

export const getTripTypeClassName = (selected: boolean) => {
  return `flex border rounded-lg flex-col justify-center items-start p-2 lg:p-3 gap-1.5 lg:gap-2 w-full ${
    selected ? "bg-slate-200 border-slate-400" : "border-slate-200"
  }`
}

export const newBookingSectionClassName = "flex flex-col gap-5 lg:gap-6"
export const newBookingHeaderClassName = "flex flex-col gap-2 lg:gap-3"
export const newBookingHeaderLineClassName =
  "flex flex-row justify-between items-end gap-2 lg:gap-3"
export const newBookingFormClassName = "flex flex-col gap-4 lg:gap-5"

export const newBookingFinalItemClassName =
  "flex flex-row justify-between items-center gap-2 lg:gap-3 p-2 lg:p-3 border border-slate-200 rounded-lg"
export const newBookingLineItemClassName =
  "flex flex-row justify-between items-start gap-2 lg:gap-3"
export const newBookingLineSubtitleClassName =
  "flex flex-col items-end gap-0.5 lg:gap-1"

export const newBookingTripInfoTagClassName =
  "flex items-center justify-center px-2 py-1.5 lg:px-3 lg:py-2 border border-slate-200 rounded-lg"

export const tileLeftClassName =
  "flex flex-col gap-3 lg:gap-4 justify-between items-start h-full overflow-hidden"
export const tileHeaderLeftClassName =
  "flex flex-col gap-1 lg:gap-1.5 items-start"
export const tileHeaderRightClassName =
  "flex flex-col gap-1 lg:gap-1.5 items-end text-end"
export const tileIconClassName = "size-5 lg:size-6 stroke-1 text-slate-500"
export const bigTileIconClassName = "size-6 lg:size-7 stroke-1 text-slate-700"
export const tileFooterClassName = "flex flex-row flex-wrap gap-3 lg:gap-4"
export const tileRightClassName =
  "flex flex-col items-end justify-between gap-3 lg:gap-4 h-full"
export const tileStatusClassName =
  "flex flex-row gap-1 lg:gap-1.5 items-center justify-center text-center px-2 py-1 lg:px-3 lg:py-1.5 rounded-full border border-slate-200"
export const tileRedIconClassName = "size-5 lg:size-6 text-red-500"
export const tileGreenIconClassName = "size-5 lg:size-6 text-green-500"
export const tileHeaderMidClassName =
  "flex flex-col gap-1 lg:gap-1.5 items-center"
