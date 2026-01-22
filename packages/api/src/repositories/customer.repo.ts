import { db } from "@ryogo-travel-app/db"
import {
  customers,
  CustomerStatusEnum,
  InsertCustomerType,
} from "@ryogo-travel-app/db/schema"
import { eq, inArray, and } from "drizzle-orm"

export const customerRepository = {
  async readAllCustomersByAgencyId(agencyId: string) {
    return await db.query.customers.findMany({
      where: and(
        eq(customers.agencyId, agencyId),
        inArray(customers.status, [
          CustomerStatusEnum.ACTIVE,
          CustomerStatusEnum.INACTIVE,
        ]),
      ),
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

  async readCustomerById(id: string) {
    return await db.query.customers.findFirst({
      where: and(
        eq(customers.id, id),
        inArray(customers.status, [
          CustomerStatusEnum.ACTIVE,
          CustomerStatusEnum.INACTIVE,
        ]),
      ),
      with: {
        location: {
          columns: {
            city: true,
            state: true,
          },
        },
        addedByUser: {
          columns: {
            name: true,
          },
        },
      },
    })
  },

  async createCustomer(data: InsertCustomerType) {
    return await db.insert(customers).values(data).returning()
  },

  async updateCustomer(
    customerId: string,
    locationId: string,
    name?: string,
    email?: string,
    address?: string,
    remarks?: string,
  ) {
    return await db
      .update(customers)
      .set({
        locationId,
        name,
        email,
        address,
        remarks,
      })
      .where(eq(customers.id, customerId))
      .returning()
  },

  async updateCustomerAddress(customerId: string, address: string) {
    return await db
      .update(customers)
      .set({ address: address })
      .where(eq(customers.id, customerId))
      .returning()
  },

  //Update customer photo url
  async updatePhotoUrl(customerId: string, photoUrl: string) {
    return await db
      .update(customers)
      .set({ photoUrl: photoUrl })
      .where(eq(customers.id, customerId))
      .returning()
  },

  //Update customer status
  async updateStatus(customerId: string, status: CustomerStatusEnum) {
    return await db
      .update(customers)
      .set({ status: status })
      .where(eq(customers.id, customerId))
      .returning()
  },
}
