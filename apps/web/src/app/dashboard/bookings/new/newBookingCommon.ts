import { driverServices } from "@ryogo-travel-app/api/services/driver.services";
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services";
import {
  DriverStatusEnum,
  VehicleStatusEnum,
  BookingTypeEnum,
} from "@ryogo-travel-app/db/schema";

export type NewBookingFormDataType = {
  customerPhone: string;
  customerId?: string;
  customerName?: string;
  customerLocationState?: string;
  customerLocationCity?: string;
  tripSourceLocationState: string;
  tripSourceLocationCity: string;
  tripDestinationLocationState: string;
  tripDestinationLocationCity?: string;
  tripType: BookingTypeEnum;
  tripStartDate: Date;
  tripEndDate: Date;
  tripPassengers: number;
  tripNeedsAC: boolean;
  tripRemarks?: string;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  selectedRatePerKm: number;
  selectedAcChargePerDay: number;
  selectedAllowancePerDay: number;
  selectedCommissionRate: number;
  finalAmount?: number;
};

export type NewBookingFindVehiclesType = Awaited<
  ReturnType<typeof vehicleServices.findVehiclesByAgency>
>;

export type NewBookingFindDriversType = Awaited<
  ReturnType<typeof driverServices.findDriversByAgency>
>;

export type NewBookingAgencyLocationType = {
  id: string;
  city: string;
  state: string;
};

export const FullOverlapScore = 10;
export const PartialOverlapScore = 25;
export const TouchingOverlapScore = 75;
export const NoOverlapScore = 100;

export function getOverlapScore(
  otherStart: Date,
  otherEnd: Date,
  newBookingStart: Date,
  newBookingEnd: Date
): number {
  //Full Overlap
  if (otherStart <= newBookingStart && otherEnd >= newBookingEnd) {
    return FullOverlapScore;
  }
  //Partial overlap
  if (
    (otherStart <= newBookingStart && newBookingStart <= otherEnd) ||
    (otherStart <= newBookingEnd && newBookingEnd <= otherEnd)
  ) {
    return PartialOverlapScore;
  }
  //Touching
  if (otherEnd == newBookingStart || otherStart == newBookingEnd) {
    return TouchingOverlapScore;
  }
  //No overlap
  return NoOverlapScore;
}

export const VeryLowCapacityScore = 10;
export const LowCapacityScore = 30;
export const TooMuchOverCapacityScore = 50;
export const OverCapacityScore = 75;
export const PerfectCapacityScore = 100;

export function getCapacityScore(capacity: number, passengers: number): number {
  if (capacity < passengers) {
    //Very low capacity
    if (capacity < passengers * 0.75) {
      return VeryLowCapacityScore;
    }
    //Low capacity
    return LowCapacityScore;
  }
  if (capacity > passengers) {
    //Too much over capacity
    if (capacity > passengers * 1.25) {
      return TooMuchOverCapacityScore;
    }
    //Over capacity
    return OverCapacityScore;
  }
  //Perfect capacity
  return PerfectCapacityScore;
}

export const InactiveScore = 10;
export const RepairScore = 50;
export const OnTripScore = 75;
export const AvailableScore = 100;

export function getVehicleStatusScore(status: VehicleStatusEnum): number {
  if (status == VehicleStatusEnum.INACTIVE) {
    return InactiveScore;
  }
  if (status == VehicleStatusEnum.REPAIR) {
    return RepairScore;
  }
  if (status == VehicleStatusEnum.ON_TRIP) {
    return OnTripScore;
  }
  return AvailableScore;
}

export const ExpiredScore = 10;
export const SoonExpiringScore = 50;
export const NoExpiryScore = 100;
export function getExpiryScore(newBookingEndDate: Date, expiryDate: Date) {
  //Expiry now
  if (expiryDate < new Date()) {
    return ExpiredScore;
  }
  if (expiryDate <= newBookingEndDate) {
    return SoonExpiringScore;
  }
  return NoExpiryScore;
}

export const VeryOldVehicleScore = 10;
export const OldVehicleScore = 50;
export const MediumOldVehicleScore = 75;
export const GoodVehicleScore = 100;
export const BrandNewVehicleScore = 75;
export function getOdometerScore(odoMeter: number): number {
  if (odoMeter > 100000) {
    return VeryOldVehicleScore;
  }
  if (odoMeter > 50000) {
    return OldVehicleScore;
  }
  if (odoMeter > 10000) {
    return MediumOldVehicleScore;
  }
  if (odoMeter < 1000) {
    return BrandNewVehicleScore;
  }
  return GoodVehicleScore;
}

export const LeaveScore = 50;
export function getDriverStatusScore(status: DriverStatusEnum): number {
  if (status == DriverStatusEnum.INACTIVE) {
    return InactiveScore;
  }
  if (status == DriverStatusEnum.LEAVE) {
    return LeaveScore;
  }
  if (status == DriverStatusEnum.ON_TRIP) {
    return OnTripScore;
  }
  return AvailableScore;
}

export const BestTotalScore = 100;
export const GoodTotalScore = 75;
export const MediumTotalScore = 50;
export const BadTotalScore = 10;

export type Step3Type = {
  assignedDriverId: string;
  assignedVehicleId: string;
};

export const tileLeftClassName =
  "flex flex-col gap-2 lg:gap-3 justify-between items-start h-full";
export const tileHeaderClassName = "flex flex-col gap-1 lg:gap-1.5";
export const tileIconClassName = "size-5 lg:size-6 stroke-1 text-slate-500";
export const tileFooterClassName = "flex flex-row flex-wrap gap-2 lg:gap-3";
export const tileRightClassName =
  "flex flex-col items-end justify-between gap-2 lg:gap-3 h-full";
export const tileStatusClassName =
  "flex flex-row gap-1 lg:gap-1.5 items-center justify-center px-2 py-1 lg:px-3 lg:py-1.5 rounded-full border border-slate-200";
export const tileRedIconClassName = "size-5 lg:size-6 text-red-500";
export const tileGreenIconClassName = "size-5 lg:size-6 text-green-500";
