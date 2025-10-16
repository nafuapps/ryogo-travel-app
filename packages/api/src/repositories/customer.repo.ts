import { db } from "@ryogo-travel-app/db";
import { customers } from "@ryogo-travel-app/db/schema";
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
};
