import { InsertTripLogType } from "@ryogo-travel-app/db/schema"
import { tripLogRepository } from "../repositories/tripLog.repo"
import { sql } from "drizzle-orm"
import { AddTripLogRequestType } from "../types/tripLog.types"
import { vehicleRepository } from "../repositories/vehicle.repo"
import { driverRepository } from "../repositories/driver.repo"

export const tripLogServices = {
  //Add a trip log
  async addTripLog(data: AddTripLogRequestType) {
    const latLong =
      data.lat && data.long
        ? `${data.lat.toFixed(4)},${data.long.toFixed(4)}`
        : null
    const geolocation =
      data.lat && data.long
        ? (sql.raw(
            `ST_SetSRID(ST_MakePoint(${data.long}, ${data.lat}), 4326)`,
          ) as unknown as {
            x: number
            y: number
          })
        : undefined

    const startTripLog: InsertTripLogType = {
      bookingId: data.bookingId,
      agencyId: data.agencyId,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      odometerReading: data.odometerReading, // in kilometers
      type: data.type,
      remarks: data.remarks,
      latLong: latLong,
      geolocation: geolocation,
    }
    const tripLog = await tripLogRepository.createTripLog(startTripLog)

    //Update vehicle odometer reading if provided
    if (data.odometerReading) {
      await vehicleRepository.updateOdometerReading(
        data.vehicleId,
        data.odometerReading,
      )
    }
    if (latLong) {
      await vehicleRepository.updateLocation(
        data.vehicleId,
        latLong,
        geolocation,
      )
      await driverRepository.updateLocation(data.driverId, latLong, geolocation)
    }
    return tripLog[0]
  },

  //Update trip log photo url
  async changeTripLogPhotoUrl(tripLogId: string, tripLogPhotoUrl: string) {
    await tripLogRepository.updateTripLogPhotoUrl(tripLogId, tripLogPhotoUrl)
  },
}
