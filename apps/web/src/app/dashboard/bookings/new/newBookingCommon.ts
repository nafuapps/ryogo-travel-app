import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"

export const NewBookingTotalSteps = 5

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
