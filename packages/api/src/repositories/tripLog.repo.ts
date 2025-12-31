import { db } from "@ryogo-travel-app/db"
import { tripLogs } from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"

export const tripLogRepository = {
  //Get tripLogs by booking id
  async readTripLogsByBookingId(bookingId: string) {
    return db.query.tripLogs.findMany({
      where: eq(tripLogs.bookingId, bookingId),
      with: {
        driver: {
          columns: {
            name: true,
          },
        },
        vehicle: {
          columns: {
            vehicleNumber: true,
          },
        },
      },
    })
  },
}
