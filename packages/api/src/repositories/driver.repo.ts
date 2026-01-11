import { db } from "@ryogo-travel-app/db"
import {
  BookingStatusEnum,
  drivers,
  DriverStatusEnum,
  InsertDriverType,
} from "@ryogo-travel-app/db/schema"
import { eq, and, notInArray, or, gte, lte } from "drizzle-orm"

export const driverRepository = {
  //Get driver by id
  async readDriverById(id: string) {
    return await db.query.drivers.findFirst({
      where: eq(drivers.id, id),
      with: {
        user: {
          columns: {
            photoUrl: true,
          },
        },
      },
    })
  },

  //Get all drivers of an agency
  async readDriversByAgencyId(agencyId: string) {
    return await db.select().from(drivers).where(eq(drivers.agencyId, agencyId))
  },

  //Get all drivers data for a new booking in an agency
  async readAllDriversDataByAgencyId(agencyId: string) {
    return await db.query.drivers.findMany({
      columns: {
        id: true,
        status: true,
        name: true,
        licenseExpiresOn: true,
        phone: true,
        canDriveVehicleTypes: true,
        defaultAllowancePerDay: true,
        address: true,
      },
      where: and(
        eq(drivers.agencyId, agencyId),
        notInArray(drivers.status, [DriverStatusEnum.SUSPENDED])
      ),
      with: {
        assignedBookings: {
          columns: {
            id: true,
            status: true,
            startDate: true,
            endDate: true,
          },
          where: (assignedBookings, { inArray }) =>
            inArray(assignedBookings.status, [
              BookingStatusEnum.CONFIRMED,
              BookingStatusEnum.IN_PROGRESS,
            ]),
        },
        user: {
          columns: {
            photoUrl: true,
          },
        },
        driverLeaves: {
          columns: {
            id: true,
            startDate: true,
            endDate: true,
          },
          where: (driverLeaves, { eq }) => eq(driverLeaves.isCompleted, false),
        },
      },
    })
  },

  //Get all drivers data for a new booking in an agency
  async readOnTripDriversDataByAgencyId(agencyId: string) {
    return await db.query.drivers.findMany({
      where: and(
        eq(drivers.agencyId, agencyId),
        eq(drivers.status, DriverStatusEnum.ON_TRIP)
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
            assignedVehicle: {
              columns: {
                vehicleNumber: true,
                brand: true,
                model: true,
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

  //Get driver by phone in agency
  async readDriverByPhoneInAgency(agencyId: string, phone: string) {
    return await db
      .select()
      .from(drivers)
      .where(and(eq(drivers.phone, phone), eq(drivers.agencyId, agencyId)))
  },

  //Get driver by userId
  async readDriverByUserId(userId: string) {
    return await db.select().from(drivers).where(eq(drivers.userId, userId))
  },

  //Get driver schedule data
  async readDriversScheduleData(
    agencyId: string,
    queryStartDate: Date,
    queryEndDate: Date
  ) {
    return await db.query.drivers.findMany({
      columns: {
        id: true,
        status: true,
        name: true,
        licenseExpiresOn: true,
        phone: true,
        canDriveVehicleTypes: true,
        defaultAllowancePerDay: true,
        address: true,
      },
      where: and(
        eq(drivers.agencyId, agencyId),
        notInArray(drivers.status, [DriverStatusEnum.SUSPENDED])
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
                lte(assignedBookings.startDate, queryEndDate)
              ),
              eq(assignedBookings.status, BookingStatusEnum.IN_PROGRESS)
            ),
        },
        driverLeaves: {
          columns: {
            id: true,
            startDate: true,
            endDate: true,
            driverId: true,
          },
          with: {
            addedByUser: {
              columns: {
                name: true,
              },
            },
            driver: {
              columns: {
                name: true,
              },
            },
          },
          where: (driverLeaves) =>
            and(
              eq(driverLeaves.isCompleted, false),
              gte(driverLeaves.endDate, queryStartDate),
              lte(driverLeaves.startDate, queryEndDate)
            ),
        },
      },
    })
  },

  //Create driver
  async createDriver(data: InsertDriverType) {
    return await db.insert(drivers).values(data).returning()
  },

  //Update driver license URL by Id
  async updateDriverLicenseUrl(driverId: string, licenseUrl?: string) {
    return await db
      .update(drivers)
      .set({ licensePhotoUrl: licenseUrl })
      .where(eq(drivers.id, driverId))
      .returning({ id: drivers.id })
  },
}
