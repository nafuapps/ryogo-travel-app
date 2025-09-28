import { db } from "@ryogo-travel-app/db";
import { drivers, InsertDriverType } from "@ryogo-travel-app/db/schema";
import { eq, and } from "drizzle-orm";

export const driverRepository = {
  //Get driver by id
  async getDriverById(id: string) {
    return await db.select().from(drivers).where(eq(drivers.id, id));
  },

  //Get all drivers of an agency
  async getDriversByAgencyId(agencyId: string) {
    return await db
      .select({ id: drivers.id })
      .from(drivers)
      .where(eq(drivers.agencyId, agencyId));
  },

  //Get driver by phone in agency
  async getDriverByPhoneInAgency(agencyId: string, phone: string) {
    return await db
      .select()
      .from(drivers)
      .where(and(eq(drivers.phone, phone), eq(drivers.agencyId, agencyId)));
  },

  //Get driver by userId
  async getDriverByUserId(userId: string) {
    return await db.select().from(drivers).where(eq(drivers.userId, userId));
  },

  //Create driver
  async createDriver(data: InsertDriverType) {
    return await db.insert(drivers).values(data).returning();
  },

  //Update driver license URL by Id
  async updateDriverLicenseUrl(driverId: string, licenseUrl?: string) {
    return await db
      .update(drivers)
      .set({ licensePhotoUrl: licenseUrl })
      .where(eq(drivers.id, driverId))
      .returning({ id: drivers.id });
  },
};
