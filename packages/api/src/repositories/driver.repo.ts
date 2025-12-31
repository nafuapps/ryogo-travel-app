import { db } from "@ryogo-travel-app/db"
import {
  BookingStatusEnum,
  drivers,
  DriverStatusEnum,
  InsertDriverType,
} from "@ryogo-travel-app/db/schema"
import { eq, and, notInArray } from "drizzle-orm"

export const driverRepository = {
  //Get driver by id
  async readDriverById(id: string) {
    return await db.select().from(drivers).where(eq(drivers.id, id))
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
