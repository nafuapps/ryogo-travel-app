import { InsertTripLogType } from "@ryogo-travel-app/db/schema"
import { tripLogRepository } from "../repositories/tripLog.repo"
import { vehicleRepository } from "../repositories/vehicle.repo"
import { sql } from "drizzle-orm"
import { AddTripLogRequestType } from "../types/tripLog.types"

export const tripLogServices = {
  //Add a trip log
  async addTripLog(data: AddTripLogRequestType) {
    const startTripLog: InsertTripLogType = {
      bookingId: data.bookingId,
      agencyId: data.agencyId,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      odometerReading: data.odometerReading, // in kilometers
      type: data.type,
      remarks: data.remarks,
      latLong: data.lat && data.long ? `${data.lat},${data.long}` : null,
      location:
        data.lat && data.long
          ? (sql.raw(
              `ST_SetSRID(ST_MakePoint(${data.long}, ${data.lat}), 4326)`,
            ) as unknown as {
              x: number
              y: number
            })
          : undefined,
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
    await tripLogRepository.updateTripLogPhotoUrl(tripLogId, tripLogPhotoUrl)
  },
}
