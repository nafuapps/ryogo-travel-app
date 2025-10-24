import { db } from "@ryogo-travel-app/db";
import { customers, InsertCustomerType } from "@ryogo-travel-app/db/schema";
import { eq, and } from "drizzle-orm";

export const customerRepository = {
  //Get all customers
  async getAllCustomers() {
    return await db.select().from(customers);
  },

  async getCustomerByPhoneAgencyId(phone: string, agencyId: string) {
    return await db.query.customers.findFirst({
      where: and(eq(customers.phone, phone), eq(customers.agencyId, agencyId)),
      with: {
        location: {
          columns: {
            city: true,
            state: true,
          },
        },
      },
    });
  },

  async createCustomer(data: InsertCustomerType) {
    return await db.insert(customers).values(data).returning();
  },

  async updateCustomerAddress(customerId: string, address: string) {
    return await db
      .update(customers)
      .set({ address: address })
      .where(eq(customers.id, customerId))
      .returning();
  },
};
