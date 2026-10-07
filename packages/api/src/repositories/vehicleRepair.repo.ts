import { db } from "@ryogo-travel-app/db"
import {
  InsertVehicleRepairType,
  vehicleRepairs,
  VehicleRepairStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { and, eq, gte, lte, or } from "drizzle-orm"
import { ModifyVehicleRepairRequestType } from "../types/vehicleRepair.types"

export const vehicleRepairRepository = {
  //Read all vehicle repairs by vehicle id
  async readVehicleRepairsByVehicleId({
    vehicleId,
    queryStartDate,
  }: {
    vehicleId: string
    queryStartDate: Date
  }) {
    return await db.query.vehicleRepairs.findMany({
      orderBy: (vehicleRepairs, { desc }) => [desc(vehicleRepairs.startDate)],
      where: and(
        eq(vehicleRepairs.vehicleId, vehicleId),
        gte(vehicleRepairs.startDate, queryStartDate),
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

  async readUpcomingVehicleRepairsSchedule({
    agencyId,
    queryEndDate,
  }: {
    agencyId: string
    queryEndDate: Date
  }) {
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
            lte(vehicleRepairs.startDate, queryEndDate),
            gte(vehicleRepairs.startDate, new Date()),
          ),
          and(
            lte(vehicleRepairs.endDate, queryEndDate),
            gte(vehicleRepairs.endDate, new Date()),
          ),
          and(
            lte(vehicleRepairs.startDate, new Date()),
            gte(vehicleRepairs.endDate, queryEndDate),
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

  //Add a vehicle repair
  async createRepair(data: InsertVehicleRepairType) {
    return await db.insert(vehicleRepairs).values(data).returning()
  },

  //Update a vehicle repair
  async updateRepairDetails({
    repairId,
    startDate,
    endDate,
    remarks,
    cost,
  }: ModifyVehicleRepairRequestType) {
    return await db
      .update(vehicleRepairs)
      .set({
        startDate,
        endDate,
        remarks,
        cost,
      })
      .where(eq(vehicleRepairs.id, repairId))
      .returning()
  },

  //Update a vehicle repair to started
  async updateRepairToStarted(repairId: string) {
    return await db
      .update(vehicleRepairs)
      .set({
        status: VehicleRepairStatusEnum.ONGOING,
        actualStartDate: new Date(),
      })
      .where(eq(vehicleRepairs.id, repairId))
      .returning()
  },

  //Update a vehicle repair to ended
  async updateRepairToEnded(repairId: string) {
    return await db
      .update(vehicleRepairs)
      .set({
        status: VehicleRepairStatusEnum.COMPLETED,
        actualEndDate: new Date(),
      })
      .where(eq(vehicleRepairs.id, repairId))
      .returning()
  },

  //Delete a vehicle repair
  async deleteRepair(repairId: string) {
    return await db
      .delete(vehicleRepairs)
      .where(eq(vehicleRepairs.id, repairId))
      .returning()
  },
}
