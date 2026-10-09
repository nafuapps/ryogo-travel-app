import { db } from "@ryogo-travel-app/db"
import {
  driverLeaves,
  DriverLeaveStatusEnum,
  drivers,
  DriverStatusEnum,
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

  //Update a driver leave to Ongoing and driver status to Leave
  async updateLeaveToStarted({
    leaveId,
    driverId,
  }: {
    leaveId: string
    driverId: string
  }) {
    return await db.transaction(async (tx) => {
      await tx
        .update(drivers)
        .set({
          status: DriverStatusEnum.LEAVE,
        })
        .where(eq(drivers.id, driverId))
      await tx
        .update(driverLeaves)
        .set({
          status: DriverLeaveStatusEnum.ONGOING,
          actualStartDate: new Date(),
        })
        .where(eq(driverLeaves.id, leaveId))
      return await tx.query.driverLeaves.findFirst({
        where: eq(driverLeaves.id, leaveId),
        with: {
          driver: {
            columns: {
              name: true,
              userId: true,
            },
          },
        },
      })
    })
  },

  //Update a driver leave to Completed and driver status to Available
  async updateLeaveToEnded({
    leaveId,
    driverId,
  }: {
    leaveId: string
    driverId: string
  }) {
    return await db.transaction(async (tx) => {
      await tx
        .update(drivers)
        .set({
          status: DriverStatusEnum.AVAILABLE,
        })
        .where(eq(drivers.id, driverId))
      await tx
        .update(driverLeaves)
        .set({
          status: DriverLeaveStatusEnum.COMPLETED,
          actualEndDate: new Date(),
        })
        .where(eq(driverLeaves.id, leaveId))
      return await tx.query.driverLeaves.findFirst({
        where: eq(driverLeaves.id, leaveId),
        with: {
          driver: {
            columns: {
              name: true,
            },
          },
        },
      })
    })
  },

  //Delete a driver leave
  async deleteLeave(id: string) {
    return await db
      .delete(driverLeaves)
      .where(eq(driverLeaves.id, id))
      .returning()
  },
}
