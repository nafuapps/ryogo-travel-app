import { db } from "@ryogo-travel-app/db"
import { InsertTripLogType, tripLogs } from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"

export const tripLogRepository = {
  //Get tripLogs by booking id
  async readTripLogsByBookingId(bookingId: string) {
    return await db.query.tripLogs.findMany({
      orderBy: (tripLogs, { desc }) => [desc(tripLogs.createdAt)],
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

  //create trip log
  async createTripLog(data: InsertTripLogType) {
    return await db.insert(tripLogs).values(data).returning()
  },

  //Update trip log photo url
  async updateTripLogPhotoUrl(tripLogId: string, tripLogPhotoUrl: string) {
    return await db
      .update(tripLogs)
      .set({ tripLogPhotoUrl })
      .where(eq(tripLogs.id, tripLogId))
  },
}
