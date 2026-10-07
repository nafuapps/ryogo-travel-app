import { db } from "@ryogo-travel-app/db"
import {
  driverLeaves,
  DriverLeaveStatusEnum,
  InsertDriverLeaveType,
} from "@ryogo-travel-app/db/schema"
import { and, eq, gte, lte, or } from "drizzle-orm"
import { ModifyDriverLeaveRequestType } from "../types/driverLeave.types"

export const driverLeaveRepository = {
  //Read all driver leaves by driver id
  async readDriverLeavesByDriverId({
    driverId,
    queryStartDate,
  }: {
    driverId: string
    queryStartDate: Date
  }) {
    return await db.query.driverLeaves.findMany({
      orderBy: (driverLeaves, { desc }) => [desc(driverLeaves.startDate)],
      where: and(
        eq(driverLeaves.driverId, driverId),
        gte(driverLeaves.startDate, queryStartDate),
      ),
      with: {
        addedByUser: {
          columns: {
            name: true,
            photoUrl: true,
            userRole: true,
          },
        },
      },
    })
  },

  async readUpcomingDriverLeavesSchedule({
    agencyId,
    queryEndDate,
  }: {
    agencyId: string
    queryEndDate: Date
  }) {
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
            gte(driverLeaves.startDate, new Date()),
            lte(driverLeaves.startDate, queryEndDate),
          ),
          and(
            gte(driverLeaves.endDate, new Date()),
            lte(driverLeaves.endDate, queryEndDate),
          ),
          and(
            lte(driverLeaves.startDate, new Date()),
            gte(driverLeaves.endDate, queryEndDate),
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

  //Add a driver leave
  async createLeave(data: InsertDriverLeaveType) {
    return await db.insert(driverLeaves).values(data).returning()
  },

  //Update a driver leave
  async updateLeave({
    leaveId,
    startDate,
    endDate,
    remarks,
  }: ModifyDriverLeaveRequestType) {
    return await db
      .update(driverLeaves)
      .set({
        startDate,
        endDate,
        remarks,
      })
      .where(eq(driverLeaves.id, leaveId))
      .returning()
  },

  //Update a driver leave to started
  async updateLeaveToStarted(id: string) {
    return await db
      .update(driverLeaves)
      .set({
        status: DriverLeaveStatusEnum.ONGOING,
        actualStartDate: new Date(),
      })
      .where(eq(driverLeaves.id, id))
      .returning()
  },

  //Update a driver leave to ended
  async updateLeaveToEnded(id: string) {
    return await db
      .update(driverLeaves)
      .set({
        status: DriverLeaveStatusEnum.COMPLETED,
        actualEndDate: new Date(),
      })
      .where(eq(driverLeaves.id, id))
      .returning()
  },

  //Delete a driver leave
  async deleteLeave(id: string) {
    return await db
      .delete(driverLeaves)
      .where(eq(driverLeaves.id, id))
      .returning()
  },
}
