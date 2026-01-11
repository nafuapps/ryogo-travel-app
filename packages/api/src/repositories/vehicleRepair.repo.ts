import { db } from "@ryogo-travel-app/db"
import { vehicleRepairs } from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"

export const vehicleRepairRepository = {
  //Read all vehicle repairs by vehicle id
  async readVehicleRepairsByVehicleId(vehicleId: string) {
    return await db.query.vehicleRepairs.findMany({
      where: eq(vehicleRepairs.vehicleId, vehicleId),
    })
  },

  //Read a vehicle repair by id
  async readRepairById(id: string) {
    return await db.query.vehicleRepairs.findFirst({
      where: eq(vehicleRepairs.id, id),
    })
  },
}
