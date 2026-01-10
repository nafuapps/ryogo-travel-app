import { db } from "@ryogo-travel-app/db"
import { customers, InsertCustomerType } from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"

export const customerRepository = {
  async readAllCustomersByAgencyId(agencyId: string) {
    return await db.query.customers.findMany({
      columns: {
        id: true,
        name: true,
        phone: true,
        photoUrl: true,
        remarks: true,
      },
      where: eq(customers.agencyId, agencyId),
      with: {
        location: {
          columns: {
            city: true,
            state: true,
          },
        },
      },
    })
  },

  async createCustomer(data: InsertCustomerType) {
    return await db.insert(customers).values(data).returning()
  },

  async updateCustomerAddress(customerId: string, address: string) {
    return await db
      .update(customers)
      .set({ address: address })
      .where(eq(customers.id, customerId))
      .returning()
  },
}
