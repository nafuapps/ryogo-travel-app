import { db } from "@ryogo-travel-app/db"
import {
  InsertVehicleRepairType,
  vehicleRepairs,
} from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"

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

  //Read a vehicle repair by id
  async readRepairById(id: string) {
    return await db.query.vehicleRepairs.findFirst({
      where: eq(vehicleRepairs.id, id),
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
