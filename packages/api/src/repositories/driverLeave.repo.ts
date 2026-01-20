import { db } from "@ryogo-travel-app/db"
import {
  driverLeaves,
  InsertDriverLeaveType,
} from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"

export const driverLeaveRepository = {
  //Read all driver leaves by driver id
  async readDriverLeavesByDriverId(driverId: string) {
    return await db.query.driverLeaves.findMany({
      where: eq(driverLeaves.driverId, driverId),
      with: {
        addedByUser: {
          columns: {
            name: true,
          },
        },
      },
    })
  },
  //Ready a leave by id
  async readLeaveById(id: string) {
    return await db.query.driverLeaves.findFirst({
      where: eq(driverLeaves.id, id),
    })
  },

  //Add a driver leave
  async createLeave(data: InsertDriverLeaveType) {
    return await db.insert(driverLeaves).values(data).returning()
  },

  //Update a driver leave
  async updateLeave(
    id: string,
    startDate?: Date,
    endDate?: Date,
    isCompleted?: boolean,
    remarks?: string,
  ) {
    return await db
      .update(driverLeaves)
      .set({
        isCompleted,
        remarks,
        startDate,
        endDate,
      })
      .where(eq(driverLeaves.id, id))
      .returning()
  },
}
