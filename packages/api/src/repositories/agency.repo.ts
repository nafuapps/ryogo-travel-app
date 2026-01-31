import { db } from "@ryogo-travel-app/db"
import {
  agencies,
  AgencyStatusEnum,
  InsertAgencyType,
} from "@ryogo-travel-app/db/schema"
import { eq, and } from "drizzle-orm"

export const agencyRepository = {
  //get all agencies
  async readAllAgencies() {
    return db.query.agencies.findMany({})
  },

  //get agencies by phone
  async readAgenciesByPhone(phone: string) {
    return db.query.agencies.findMany({
      where: eq(agencies.businessPhone, phone),
    })
  },

  //get agencies by email
  async readAgenciesByEmail(email: string) {
    return db.query.agencies.findMany({
      where: eq(agencies.businessEmail, email),
    })
  },

  //Get agency by id
  async readAgencyById(id: string) {
    return await db.query.agencies.findFirst({
      where: eq(agencies.id, id),
      with: {
        location: {
          columns: { id: true, city: true, state: true },
        },
      },
    })
  },

  //Get agency by phone and email
  async readAgencyByPhoneEmail(businessPhone: string, businessEmail: string) {
    return await db
      .select({ id: agencies.id })
      .from(agencies)
      .where(
        and(
          eq(agencies.businessPhone, businessPhone),
          eq(agencies.businessEmail, businessEmail),
        ),
      )
  },

  //Create agency
  async createAgency(data: InsertAgencyType) {
    return await db.insert(agencies).values(data).returning()
  },

  //Update agency details by Id
  async updateAgencyDetails(
    id: string,
    businessName?: string,
    businessAddress?: string,
    defaultCommissionRate?: number,
    locationId?: string,
  ) {
    return await db
      .update(agencies)
      .set({
        businessName,
        businessAddress,
        defaultCommissionRate,
        locationId,
      })
      .where(eq(agencies.id, id))
      .returning({
        id: agencies.id,
        businessName: agencies.businessName,
        businessAddress: agencies.businessAddress,
        defaultCommissionRate: agencies.defaultCommissionRate,
        locationId: agencies.locationId,
      })
  },

  //Update agency status by Id
  async updateAgencyStatus(id: string, status: AgencyStatusEnum) {
    return await db
      .update(agencies)
      .set({ status })
      .where(eq(agencies.id, id))
      .returning({
        id: agencies.id,
        status: agencies.status,
      })
  },

  //Update agency subscription expiry time by Id
  async updateAgencySubscriptionExpiry(id: string, expiryTime: Date) {
    return await db
      .update(agencies)
      .set({ subscriptionExpiresOn: expiryTime })
      .where(eq(agencies.id, id))
      .returning({
        id: agencies.id,
        expiryTime: agencies.subscriptionExpiresOn,
      })
  },

  //Update agency phone by Id
  async updateAgencyPhone(id: string, businessPhone: string) {
    return await db
      .update(agencies)
      .set({ businessPhone: businessPhone })
      .where(eq(agencies.id, id))
      .returning({
        id: agencies.id,
        businessPhone: agencies.businessPhone,
      })
  },

  //Update agency email by Id
  async updateAgencyEmail(id: string, businessEmail: string) {
    return await db
      .update(agencies)
      .set({ businessEmail: businessEmail })
      .where(eq(agencies.id, id))
      .returning({
        id: agencies.id,
        businessEmail: agencies.businessEmail,
      })
  },

  //Update logo URL by Id
  async updateAgencyLogoUrl(id: string, logoUrl: string) {
    return await db
      .update(agencies)
      .set({ logoUrl: logoUrl })
      .where(eq(agencies.id, id))
  },

  //Delete agency by Id
  async deleteAgency(id: string) {
    return await db
      .delete(agencies)
      .where(eq(agencies.id, id))
      .returning({ id: agencies.id })
  },
}
