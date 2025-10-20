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
  selectedRatePerKm: number;
  selectedDistance: number;
  selectedAcChargePerDay?: number;
  selectedAllowancePerDay: number;
  selectedCommissionRate: number;
  finalAmount: number;
};

export type CreateNewBookingAPIResponseType = SelectBookingType | undefined;
