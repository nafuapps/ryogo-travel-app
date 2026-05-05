import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import { FindCustomersInAgencyType } from "../services/customer.services"

export type CreateNewBookingRequestType = {
  agencyId: string
  userId: string
  customerPhone: string
  existingCustomerId?: string
  newCustomerName?: string
  newCustomerLocationState?: string
  newCustomerLocationCity?: string
  tripSourceLocationState: string
  tripSourceLocationCity: string
  tripDestinationLocationState: string
  tripDestinationLocationCity: string
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
  selectedDistance: number
  selectedRatePerKm: number
  selectedAcChargePerDay: number
  selectedAllowancePerDay: number
  selectedCommissionRate: number
}

export type NewBookingFormDataType = {
  customerPhone: string
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
