import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"

export type NewBookingRequestDataType = {
  source: {
    city: string
    state: string
  }
  destination: {
    city: string
    state: string
  }
  routeId?: string
  sourceId?: string
  destinationId?: string
  type: BookingTypeEnum
  startDate: Date
  endDate: Date
  passengers: number
  needsAc: boolean
  remarks?: string
  assignedVehicleId?: string
  assignedDriverId?: string
  citydistance: number
  selectedRatePerKm: number
  selectedAcChargePerDay: number
  selectedAllowancePerDay: number
  selectedCommissionRate: number
}

export type RateBookingByCustomerType = {
  bookingId: string
  driverId: string
  vehicleId: string
  code: string
  bookingRatingByCustomer: number
  driverRatingByCustomer?: number
  vehicleRatingByCustomer?: number
}
