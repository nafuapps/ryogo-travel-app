import {
  BookingTypeEnum,
  SelectBookingType,
} from "@ryogo-travel-app/db/schema";

export type CreateNewBookingAPIRequestType = {
  agencyId: string;
  userId: string;
  customerPhone: string;
  existingCustomerId?: string;
  newCustomerName?: string;
  newCustomerLocationState?: string;
  newCustomerLocationCity?: string;
  tripSourceLocationState: string;
  tripSourceLocationCity: string;
  tripDestinationLocationState: string;
  tripDestinationLocationCity: string;
  routeId?: string;
  sourceId?: string;
  destinationId?: string;
  tripType: BookingTypeEnum;
  tripStartDate: string;
  tripEndDate: string;
  tripPassengers: number;
  tripNeedsAC: boolean;
  tripRemarks?: string;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  selectedDistance: number;
  totalDistance: number;
  selectedRatePerKm: number;
  totalVehicleRate: number;
  selectedAcChargePerDay: number;
  totalAcCharge: number;
  selectedAllowancePerDay: number;
  totalDriverAllowance: number;
  selectedCommissionRate: number;
  totalCommission: number;
  finalAmount: number;
};

export type CreateNewBookingAPIResponseType = SelectBookingType | undefined;
