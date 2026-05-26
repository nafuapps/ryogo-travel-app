import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"

export type AddTripLogRequestType = {
  driverId: string
  bookingId: string
  vehicleId: string
  agencyId: string
  type: TripLogTypesEnum
  odometerReading: number
  remarks?: string
  lat?: number | null
  long?: number | null
  tripLogPhoto?: FileList
}
