import { db } from "@ryogo-travel-app/db";
import { InsertVehicleType, vehicles } from "@ryogo-travel-app/db/schema";
import { eq, and } from "drizzle-orm";

export const vehicleRepository = {
  //Get vehicle by id
  async getVehicleById(id: string) {
    return await db.select().from(vehicles).where(eq(vehicles.id, id));
  },

  //Get all vehicles of an agency
  async getVehiclesByAgencyId(agencyId: string) {
    return await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.agencyId, agencyId));
  },

  //Get vehicle by number in an agency
  async getVehicleByNumberInAgency(agencyId: string, vehicleNumber: string) {
    return await db
      .select({ id: vehicles.id })
      .from(vehicles)
      .where(
        and(
          eq(vehicles.vehicleNumber, vehicleNumber),
          eq(vehicles.agencyId, agencyId)
        )
      );
  },

  //Create vehicle
  async createVehicle(vehicle: InsertVehicleType) {
    return await db.insert(vehicles).values(vehicle).returning();
  },

  //Update vehicle Docs Urls
  async updateDocUrls(
    vehicleId: string,
    rcPhotoUrl?: string,
    pucPhotoUrl?: string,
    insurancePhotoUrl?: string,
    vehiclePhotoUrl?: string
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
      .returning({ id: vehicles.id });
  },

  //Update vehicle PUC Url
  async updatePUCUrl(vehicleId: string, pucPhotoUrl: string) {
    return await db
      .update(vehicles)
      .set({
        pucPhotoUrl: pucPhotoUrl,
      })
      .where(eq(vehicles.id, vehicleId))
      .returning({ id: vehicles.id });
  },

  //Update vehicle RC Url
  async updateRCUrl(vehicleId: string, rcPhotoUrl: string) {
    return await db
      .update(vehicles)
      .set({
        rcPhotoUrl: rcPhotoUrl,
      })
      .where(eq(vehicles.id, vehicleId))
      .returning({ id: vehicles.id });
  },
  //Update vehicle photo Url
  async updateVehiclePhotoUrl(vehicleId: string, vehiclePhotoUrl: string) {
    return await db
      .update(vehicles)
      .set({
        vehiclePhotoUrl: vehiclePhotoUrl,
      })
      .where(eq(vehicles.id, vehicleId))
      .returning({ id: vehicles.id });
  },
  //Update vehicle Insurance Url
  async updateInsuranceUrl(vehicleId: string, insurancePhotoUrl: string) {
    return await db
      .update(vehicles)
      .set({
        insurancePhotoUrl: insurancePhotoUrl,
      })
      .where(eq(vehicles.id, vehicleId))
      .returning({ id: vehicles.id });
  },
};
