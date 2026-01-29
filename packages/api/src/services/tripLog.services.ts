import {
  InsertTripLogType,
  TripLogTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { tripLogRepository } from "../repositories/tripLog.repo"
import { vehicleRepository } from "../repositories/vehicle.repo"

export const tripLogServices = {
  //Add a trip log
  async addTripLog(data: {
    driverId: string
    bookingId: string
    vehicleId: string
    agencyId: string
    odometerReading: number
    tripLogType: TripLogTypesEnum
    remarks?: string
    latLong?: string
  }) {
    const startTripLog: InsertTripLogType = {
      bookingId: data.bookingId,
      agencyId: data.agencyId,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      odometerReading: data.odometerReading, // in kilometers
      type: data.tripLogType,
      remarks: data.remarks,
      latLong: data.latLong,
    }
    const tripLog = await tripLogRepository.createTripLog(startTripLog)
    await vehicleRepository.updateOdometerReading(
      data.vehicleId,
      data.odometerReading,
    )
    return tripLog[0]
  },

  //Update trip log photo url
  async changeTripLogPhotoUrl(tripLogId: string, tripLogPhotoUrl: string) {
    return await tripLogRepository.updateTripLogPhotoUrl(
      tripLogId,
      tripLogPhotoUrl,
    )
  },
}
