import { db } from "@ryogo-travel-app/db"
import {
  BookingStatusEnum,
  InsertVehicleType,
  tripLogs,
  TripLogTypesEnum,
  VehicleBrandEnum,
  VehicleColorEnum,
  vehicles,
  VehicleStatusEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { eq, and, notInArray, inArray, or, lte, not, gte } from "drizzle-orm"

export const vehicleRepository = {
  //Get vehicle by id
  async readVehicleById(id: string) {
    return await db.query.vehicles.findFirst({
      where: eq(vehicles.id, id),
    })
  },

  //Get vehicles search data
  async readVehiclesByAgencyId(agencyId: string) {
    return await db.query.vehicles.findMany({
      where: and(
        eq(vehicles.agencyId, agencyId),
        not(eq(vehicles.status, VehicleStatusEnum.SUSPENDED)),
      ),
    })
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
        customerRatings: true,
        createdAt: true,
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
            actualStartDate: true,
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

  //Get vehicle by number in an agency
  async readVehicleByNumberInAgency(agencyId: string, vehicleNumber: string) {
    return await db.query.vehicles.findFirst({
      columns: {
        id: true,
        vehicleNumber: true,
      },
      where: and(
        eq(vehicles.vehicleNumber, vehicleNumber),
        eq(vehicles.agencyId, agencyId),
      ),
    })
  },

  //Get all vehicles in an agency
  async readAllVehiclesInAgency(agencyId: string) {
    return await db.query.vehicles.findMany({
      columns: {
        id: true,
        vehicleNumber: true,
        status: true,
      },
      where: and(eq(vehicles.agencyId, agencyId)),
    })
  },

  //Get vehicle schedule data
  async readVehiclesScheduleData(agencyId: string, queryEndDate: Date) {
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
            actualStartDate: true,
            endDate: true,
            startTime: true,
            pickupAddress: true,
            type: true,
            updatedAt: true,
          },
          with: {
            assignedUser: {
              columns: {
                id: true,
                name: true,
              },
            },
            assignedDriver: {
              columns: {
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
            assignedVehicle: {
              columns: {
                vehicleNumber: true,
                vehiclePhotoUrl: true,
                type: true,
              },
            },
            customer: {
              columns: {
                name: true,
                photoUrl: true,
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
              where: not(eq(tripLogs.type, TripLogTypesEnum.OTHER)),
              limit: 1,
            },
          },
          where: (assignedBookings) =>
            or(
              and(
                eq(assignedBookings.status, BookingStatusEnum.CONFIRMED),
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
              or(
                and(
                  lte(vehicleRepairs.startDate, queryEndDate),
                  gte(vehicleRepairs.startDate, new Date()),
                ),
                and(
                  lte(vehicleRepairs.endDate, queryEndDate),
                  gte(vehicleRepairs.endDate, new Date()),
                ),
              ),
            ),
        },
      },
    })
  },

  //Create vehicle
  async createVehicle(vehicle: InsertVehicleType) {
    return await db.insert(vehicles).values(vehicle).returning()
  },

  //Update vehicle number
  async updateVehicleNumber(id: string, vehicleNumber: string) {
    return await db
      .update(vehicles)
      .set({
        vehicleNumber,
      })
      .where(eq(vehicles.id, id))
      .returning({
        id: vehicles.id,
        vehicleNumber: vehicles.vehicleNumber,
      })
  },

  //Update vehicle details
  async updateVehicleDetails(
    id: string,
    type?: VehicleTypesEnum,
    brand?: VehicleBrandEnum,
    color?: VehicleColorEnum,
    model?: string,
    capacity?: number,
    odometerReading?: number,
    hasAC?: boolean,
    defaultRatePerKm?: number,
    defaultAcChargePerDay?: number,
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
        hasAC,
        defaultRatePerKm,
        defaultAcChargePerDay,
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
        rcPhotoUrl,
        pucPhotoUrl,
        insurancePhotoUrl,
        vehiclePhotoUrl,
      })
      .where(eq(vehicles.id, vehicleId))
  },

  async updateRCDetails(
    vehicleId: string,
    rcExpiresOn?: Date,
    rcPhotoUrl?: string,
  ) {
    return await db
      .update(vehicles)
      .set({
        rcExpiresOn,
        rcPhotoUrl,
      })
      .where(eq(vehicles.id, vehicleId))
      .returning({
        id: vehicles.id,
        vehicleNumber: vehicles.vehicleNumber,
        rcExpiresOn: vehicles.rcExpiresOn,
        rcPhotoUrl: vehicles.rcPhotoUrl,
      })
  },

  async updatePUCDetails(
    vehicleId: string,
    pucExpiresOn?: Date,
    pucPhotoUrl?: string,
  ) {
    return await db
      .update(vehicles)
      .set({
        pucExpiresOn,
        pucPhotoUrl,
      })
      .where(eq(vehicles.id, vehicleId))
      .returning({
        id: vehicles.id,
        vehicleNumber: vehicles.vehicleNumber,
        pucExpiresOn: vehicles.pucExpiresOn,
        pucPhotoUrl: vehicles.pucPhotoUrl,
      })
  },

  async updateInsuranceDetails(
    vehicleId: string,
    insuranceExpiresOn?: Date,
    insurancePhotoUrl?: string,
  ) {
    return await db
      .update(vehicles)
      .set({
        insuranceExpiresOn,
        insurancePhotoUrl,
      })
      .where(eq(vehicles.id, vehicleId))
      .returning({
        id: vehicles.id,
        vehicleNumber: vehicles.vehicleNumber,
        insuranceExpiresOn: vehicles.insuranceExpiresOn,
        insurancePhotoUrl: vehicles.insurancePhotoUrl,
      })
  },

  //Update vehicle photo Url
  async updateVehiclePhotoUrl(vehicleId: string, vehiclePhotoUrl: string) {
    return await db
      .update(vehicles)
      .set({
        vehiclePhotoUrl,
      })
      .where(eq(vehicles.id, vehicleId))
      .returning({
        id: vehicles.id,
        vehiclePhotoUrl: vehicles.vehiclePhotoUrl,
        vehicleNumber: vehicles.vehicleNumber,
      })
  },

  //Update vehicle status
  async updateStatus(vehicleId: string, status: VehicleStatusEnum) {
    return await db
      .update(vehicles)
      .set({ status })
      .where(eq(vehicles.id, vehicleId))
      .returning({
        id: vehicles.id,
        status: vehicles.status,
        vehicleNumber: vehicles.vehicleNumber,
      })
  },

  //Update vehicle odometerReading
  async updateOdometerReading(vehicleId: string, odometerReading: number) {
    return await db
      .update(vehicles)
      .set({ odometerReading })
      .where(eq(vehicles.id, vehicleId))
      .returning({ id: vehicles.id, odometerReading: vehicles.odometerReading })
  },

  //Update vehicle location
  async updateLocation(
    vehicleId: string,
    latLong: string,
    geolocation:
      | {
          x: number
          y: number
        }
      | undefined,
  ) {
    return await db
      .update(vehicles)
      .set({
        locatedAt: new Date(),
        latLong: latLong,
        geolocation: geolocation,
      })
      .where(eq(vehicles.id, vehicleId))
      .returning({
        id: vehicles.id,
        geolocation: vehicles.geolocation,
        latLong: vehicles.latLong,
        locatedAt: vehicles.locatedAt,
      })
  },
}
