import { db } from "@ryogo-travel-app/db"
import {
  driverLeaves,
  InsertDriverLeaveType,
} from "@ryogo-travel-app/db/schema"
import { and, eq, gte, lte, or } from "drizzle-orm"

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

  async readUpcomingDriverLeavesSchedule(agencyId: string, queryDate: Date) {
    return await db.query.driverLeaves.findMany({
      columns: {
        id: true,
        startDate: true,
        endDate: true,
        addedByUserId: true,
      },
      with: {
        driver: {
          columns: {
            id: true,
            name: true,
          },
          with: {
            user: {
              columns: {
                photoUrl: true,
              },
            },
          },
        },
      },
      where: and(
        eq(driverLeaves.agencyId, agencyId),
        or(
          and(
            lte(driverLeaves.startDate, queryDate),
            gte(driverLeaves.startDate, new Date()),
          ),
          and(
            lte(driverLeaves.endDate, queryDate),
            gte(driverLeaves.endDate, new Date()),
          ),
          and(
            lte(driverLeaves.startDate, new Date()),
            gte(driverLeaves.endDate, queryDate),
          ),
        ),
      ),
    })
  },

  //Ready a leave by id
  async readLeaveById(id: string) {
    return await db.query.driverLeaves.findFirst({
      where: eq(driverLeaves.id, id),
    })
  },

  //Get driver leaves by user id
  async readDriverLeavesByAddedUserId(userId: string) {
    return await db.query.driverLeaves.findMany({
      orderBy: (driverLeaves, { desc }) => [desc(driverLeaves.createdAt)],
      limit: 20,
      where: eq(driverLeaves.addedByUserId, userId),
      with: {
        driver: {
          columns: {
            name: true,
          },
        },
      },
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
