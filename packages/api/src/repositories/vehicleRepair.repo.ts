import { db } from "@ryogo-travel-app/db"
import {
  InsertVehicleRepairType,
  vehicleRepairs,
} from "@ryogo-travel-app/db/schema"
import { and, eq, gte, lte, or } from "drizzle-orm"

export const vehicleRepairRepository = {
  //Read all vehicle repairs by vehicle id
  async readVehicleRepairsByVehicleId(vehicleId: string) {
    return await db.query.vehicleRepairs.findMany({
      where: eq(vehicleRepairs.vehicleId, vehicleId),
      with: {
        addedByUser: {
          columns: {
            name: true,
          },
        },
      },
    })
  },

  async readUpcomingVehicleRepairsSchedule(agencyId: string, queryDate: Date) {
    return await db.query.vehicleRepairs.findMany({
      columns: {
        id: true,
        startDate: true,
        endDate: true,
        addedByUserId: true,
      },
      with: {
        vehicle: {
          columns: {
            id: true,
            vehicleNumber: true,
            vehiclePhotoUrl: true,
          },
        },
      },
      where: and(
        eq(vehicleRepairs.agencyId, agencyId),
        or(
          and(
            lte(vehicleRepairs.startDate, queryDate),
            gte(vehicleRepairs.startDate, new Date()),
          ),
          and(
            lte(vehicleRepairs.endDate, queryDate),
            gte(vehicleRepairs.endDate, new Date()),
          ),
          and(
            lte(vehicleRepairs.startDate, new Date()),
            gte(vehicleRepairs.endDate, queryDate),
          ),
        ),
      ),
    })
  },

  //Read a vehicle repair by id
  async readRepairById(id: string) {
    return await db.query.vehicleRepairs.findFirst({
      where: eq(vehicleRepairs.id, id),
    })
  },

  //Get vehicle repairs by user id
  async readVehicleRepairsByAddedUserId(userId: string) {
    return await db.query.vehicleRepairs.findMany({
      orderBy: (vehicleRepairs, { desc }) => [desc(vehicleRepairs.createdAt)],
      limit: 20,
      where: eq(vehicleRepairs.addedByUserId, userId),
      with: {
        vehicle: {
          columns: {
            vehicleNumber: true,
          },
        },
      },
    })
  },

  //Add a vehicle repair
  async createRepair(data: InsertVehicleRepairType) {
    return await db.insert(vehicleRepairs).values(data).returning()
  },

  //Update a vehicle repair
  async updateRepair(
    id: string,
    startDate?: Date,
    endDate?: Date,
    isCompleted?: boolean,
    remarks?: string,
    cost?: number,
  ) {
    return await db
      .update(vehicleRepairs)
      .set({
        startDate,
        endDate,
        isCompleted,
        remarks,
        cost,
      })
      .where(eq(vehicleRepairs.id, id))
      .returning()
  },
}
