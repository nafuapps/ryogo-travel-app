import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"

export type NewBookingFormDataType = {
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
  selectedRatePerKm: number
  selectedDistance: number
  selectedAcChargePerDay: number
  selectedAllowancePerDay: number
  selectedCommissionRate: number
}
