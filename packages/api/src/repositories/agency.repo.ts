import { db } from "@ryogo-travel-app/db";
import {
  agencies,
  AgencyStatusEnum,
  InsertAgencyType,
} from "@ryogo-travel-app/db/schema";
import { eq, and } from "drizzle-orm";

export const agencyRepository = {
  //Get all agencies
  async getAllAgencies() {
    return await db.select().from(agencies);
  },

  //Get agencies by status
  async getAgenciesByStatus(status: AgencyStatusEnum) {
    return await db.select().from(agencies).where(eq(agencies.status, status));
  },

  //Get agency by id
  async getAgencyById(id: string) {
    return await db.select().from(agencies).where(eq(agencies.id, id));
  },

  //Get agency by phone and email
  async getAgencyByPhoneEmail(businessPhone: string, businessEmail: string) {
    return await db
      .select({ id: agencies.id })
      .from(agencies)
      .where(
        and(
          eq(agencies.businessPhone, businessPhone),
          eq(agencies.businessEmail, businessEmail)
        )
      );
  },

  //Create agency
  async createAgency(data: InsertAgencyType) {
    return await db.insert(agencies).values(data).returning();
  },

  //Update agency status by Id
  async updateAgencyStatus(id: string, status: AgencyStatusEnum) {
    return await db
      .update(agencies)
      .set({ status })
      .where(eq(agencies.id, id))
      .returning();
  },

  //Update agency subscription expiry time by Id
  async updateAgencySubscriptionExpiry(id: string, expiryTime: Date) {
    return await db
      .update(agencies)
      .set({ subscriptionExpiresOn: expiryTime })
      .where(eq(agencies.id, id))
      .returning();
  },

  //Update agency default commission rate by Id
  async updateAgencyCommissionRate(id: string, rate: number) {
    return await db
      .update(agencies)
      .set({ defaultCommissionRate: rate })
      .where(eq(agencies.id, id))
      .returning();
  },

  //Update logo URL by Id
  async updateAgencyLogoUrl(id: string, logoUrl: string) {
    return await db
      .update(agencies)
      .set({ logoUrl: logoUrl })
      .where(eq(agencies.id, id))
      .returning();
  },

  //Delete agency by Id
  async deleteAgency(id: string) {
    return await db.delete(agencies).where(eq(agencies.id, id)).returning();
  },
};
