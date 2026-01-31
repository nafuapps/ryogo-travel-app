import { db } from "@ryogo-travel-app/db"
import {
  BookingStatusEnum,
  InsertVehicleType,
  vehicles,
  VehicleStatusEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { eq, and, notInArray, inArray, or, gte, lte } from "drizzle-orm"

export const vehicleRepository = {
  //Get vehicle by id
  async readVehicleById(id: string) {
    return await db.query.vehicles.findFirst({
      where: eq(vehicles.id, id),
    })
  },

  //Get all vehicles of an agency
  async readVehiclesByAgencyId(agencyId: string) {
    return await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.agencyId, agencyId))
  },

  //Get all vehicles data for a new booking in an agency
  async readAllVehiclesDataByAgencyId(agencyId: string) {
    return await db.query.vehicles.findMany({
      columns: {
        id: true,
        status: true,
        brand: true,
        model: true,
        color: true,
        vehicleNumber: true,
        type: true,
        capacity: true,
        insuranceExpiresOn: true,
        odometerReading: true,
        pucExpiresOn: true,
        rcExpiresOn: true,
        defaultAcChargePerDay: true,
        defaultRatePerKm: true,
        hasAC: true,
        vehiclePhotoUrl: true,
      },
      where: and(
        eq(vehicles.agencyId, agencyId),
        notInArray(vehicles.status, [VehicleStatusEnum.SUSPENDED]),
      ),
      with: {
        assignedBookings: {
          columns: {
            id: true,
            status: true,
            startDate: true,
            endDate: true,
          },
          where: (assignedBookings) =>
            inArray(assignedBookings.status, [
              BookingStatusEnum.CONFIRMED,
              BookingStatusEnum.IN_PROGRESS,
            ]),
        },
        vehicleRepairs: {
          columns: {
            id: true,
            startDate: true,
            endDate: true,
          },
          where: (vehicleRepairs) => eq(vehicleRepairs.isCompleted, false),
        },
      },
    })
  },

  //Get all vehicles data for a new booking in an agency
  async readOnTripVehiclesDataByAgencyId(agencyId: string) {
    return await db.query.vehicles.findMany({
      where: and(
        eq(vehicles.agencyId, agencyId),
        eq(vehicles.status, VehicleStatusEnum.ON_TRIP),
      ),
      with: {
        assignedBookings: {
          columns: {
            id: true,
            startDate: true,
            endDate: true,
          },
          where: (assignedBookings, { eq }) =>
            eq(assignedBookings.status, BookingStatusEnum.IN_PROGRESS),
          with: {
            assignedDriver: {
              columns: {
                name: true,
              },
            },
            source: {
              columns: {
                city: true,
              },
            },
            destination: {
              columns: {
                city: true,
              },
            },
            tripLogs: {
              orderBy: (tripLogs, { desc }) => [desc(tripLogs.createdAt)],
              columns: {
                type: true,
              },
              limit: 1,
            },
          },
        },
      },
    })
  },

  //Get vehicle by number in an agency
  async readVehicleByNumberInAgency(agencyId: string, vehicleNumber: string) {
    return await db
      .select({ id: vehicles.id, vehicleNumber: vehicles.vehicleNumber })
      .from(vehicles)
      .where(
        and(
          eq(vehicles.vehicleNumber, vehicleNumber),
          eq(vehicles.agencyId, agencyId),
        ),
      )
  },

  //Get vehicle by number in an agency
  async readAllVehiclesInAgency(agencyId: string) {
    return await db
      .select({ id: vehicles.id, vehicleNumber: vehicles.vehicleNumber })
      .from(vehicles)
      .where(eq(vehicles.agencyId, agencyId))
  },

  //Get vehicle schedule data
  async readVehiclesScheduleData(
    agencyId: string,
    queryStartDate: Date,
    queryEndDate: Date,
  ) {
    return await db.query.vehicles.findMany({
      columns: {
        id: true,
        brand: true,
        color: true,
        model: true,
        vehicleNumber: true,
        vehiclePhotoUrl: true,
        type: true,
      },
      where: and(
        eq(vehicles.agencyId, agencyId),
        notInArray(vehicles.status, [VehicleStatusEnum.SUSPENDED]),
      ),
      with: {
        assignedBookings: {
          columns: {
            id: true,
            status: true,
            startDate: true,
            endDate: true,
            type: true,
            updatedAt: true,
          },
          with: {
            assignedDriver: {
              columns: {
                name: true,
              },
            },
            assignedVehicle: {
              columns: {
                vehicleNumber: true,
              },
            },
            customer: {
              columns: {
                name: true,
              },
            },
            source: {
              columns: {
                city: true,
              },
            },
            destination: {
              columns: {
                city: true,
              },
            },
          },
          where: (assignedBookings) =>
            or(
              and(
                eq(assignedBookings.status, BookingStatusEnum.CONFIRMED),
                gte(assignedBookings.endDate, queryStartDate),
                lte(assignedBookings.startDate, queryEndDate),
              ),
              eq(assignedBookings.status, BookingStatusEnum.IN_PROGRESS),
            ),
        },
        vehicleRepairs: {
          columns: {
            id: true,
            startDate: true,
            endDate: true,
            vehicleId: true,
          },
          with: {
            addedByUser: {
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
          where: (vehicleRepairs) =>
            and(
              eq(vehicleRepairs.isCompleted, false),
              gte(vehicleRepairs.endDate, queryStartDate),
              lte(vehicleRepairs.startDate, queryEndDate),
            ),
        },
      },
    })
  },

  //Create vehicle
  async createVehicle(vehicle: InsertVehicleType) {
    return await db.insert(vehicles).values(vehicle).returning()
  },

  //Update vehicle details
  async updateVehicle(
    id: string,
    type?: VehicleTypesEnum,
    brand?: string,
    color?: string,
    model?: string,
    capacity?: number,
    odometerReading?: number,
    rcExpiresOn?: Date,
    insuranceExpiresOn?: Date,
    pucExpiresOn?: Date,
    defaultRatePerKm?: number,
    hasAC?: boolean,
    defaultAcChargePerDay?: number,
    rcPhotoUrl?: string,
    pucPhotoUrl?: string,
    insurancePhotoUrl?: string,
  ) {
    return await db
      .update(vehicles)
      .set({
        type,
        brand,
        color,
        model,
        capacity,
        odometerReading,
        rcExpiresOn,
        insuranceExpiresOn,
        pucExpiresOn,
        defaultRatePerKm,
        hasAC,
        defaultAcChargePerDay,
        rcPhotoUrl,
        pucPhotoUrl,
        insurancePhotoUrl,
      })
      .where(eq(vehicles.id, id))
      .returning()
  },

  //Update vehicle Docs Urls
  async updateDocUrls(
    vehicleId: string,
    rcPhotoUrl?: string,
    pucPhotoUrl?: string,
    insurancePhotoUrl?: string,
    vehiclePhotoUrl?: string,
  ) {
    return await db
      .update(vehicles)
      .set({
        rcPhotoUrl: rcPhotoUrl,
        pucPhotoUrl: pucPhotoUrl,
        insurancePhotoUrl: insurancePhotoUrl,
        vehiclePhotoUrl: vehiclePhotoUrl,
      })
      .where(eq(vehicles.id, vehicleId))
  },

  //Update vehicle photo Url
  async updateVehiclePhotoUrl(vehicleId: string, vehiclePhotoUrl: string) {
    return await db
      .update(vehicles)
      .set({
        vehiclePhotoUrl,
      })
      .where(eq(vehicles.id, vehicleId))
      .returning({ id: vehicles.id, vehiclePhotoUrl: vehicles.vehiclePhotoUrl })
  },

  //Update vehicle status
  async updateStatus(vehicleId: string, status: VehicleStatusEnum) {
    return await db
      .update(vehicles)
      .set({ status })
      .where(eq(vehicles.id, vehicleId))
      .returning({ id: vehicles.id, status: vehicles.status })
  },

  //Update vehicle odometerReading
  async updateOdometerReading(vehicleId: string, odometerReading: number) {
    return await db
      .update(vehicles)
      .set({ odometerReading })
      .where(eq(vehicles.id, vehicleId))
      .returning({ id: vehicles.id, odometerReading: vehicles.odometerReading })
  },
}
