import { db } from "@ryogo-travel-app/db";
import {
  agencies,
  AgencyStatusEnum,
  InsertAgencyType,
} from "@ryogo-travel-app/db/schema";
import { eq } from "drizzle-orm";

export const agencyServices = {
  //Get all agencies (can be used by admin)
  async getAllAgencies() {
    return await db.select().from(agencies);
  },

  //Get active agencies (can be used by admin)
  async getActiveAgencies() {
    return await db
      .select()
      .from(agencies)
      .where(eq(agencies.status, AgencyStatusEnum.ACTIVE));
  },

  //Get agency by id
  async getAgencyById(id: string) {
    return await db.select().from(agencies).where(eq(agencies.id, id)).limit(1);
  },

  //Create agency
  async createAgency(data: InsertAgencyType) {
    return await db.insert(agencies).values(data).returning();
  },

  //Change agency Status by Id
  async ChangeAgencyStatusById(id: string, status: AgencyStatusEnum) {
    return await db
      .update(agencies)
      .set({ status })
      .where(eq(agencies.id, id))
      .returning();
  },

  //Delete agency by Id
  async deleteAgencyById(id: string) {
    return await db.delete(agencies).where(eq(agencies.id, id)).returning();
  },
};
