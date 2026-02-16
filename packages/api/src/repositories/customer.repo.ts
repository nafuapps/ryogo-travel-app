import { db } from "@ryogo-travel-app/db"
import {
  customers,
  CustomerStatusEnum,
  InsertCustomerType,
} from "@ryogo-travel-app/db/schema"
import { eq, inArray, and, not } from "drizzle-orm"

export const customerRepository = {
  async readAllCustomersByAgencyId(agencyId: string) {
    return await db.query.customers.findMany({
      where: and(
        eq(customers.agencyId, agencyId),
        not(eq(customers.status, CustomerStatusEnum.SUSPENDED)),
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
  async readCustomersSearchData(agencyId: string) {
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
  async readCustomerByPhoneInAgency(phone: string, agencyId: string) {
    return await db.query.customers.findMany({
      where: and(eq(customers.phone, phone), eq(customers.agencyId, agencyId)),
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

  //Get customers by user id
  async readCustomersByAddedUserId(userId: string) {
    return db.query.customers.findMany({
      orderBy: (customers, { desc }) => [desc(customers.createdAt)],
      limit: 20,
      where: eq(customers.addedByUserId, userId),
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
      .returning({
        id: customers.id,
        locationId: customers.locationId,
        name: customers.name,
        email: customers.email,
        address: customers.address,
        remarks: customers.remarks,
      })
  },

  async updateCustomerAddress(customerId: string, address: string) {
    return await db
      .update(customers)
      .set({ address: address })
      .where(eq(customers.id, customerId))
      .returning({
        id: customers.id,
        address: customers.address,
      })
  },

  //Update customer photo url
  async updatePhotoUrl(customerId: string, photoUrl: string) {
    return await db
      .update(customers)
      .set({ photoUrl: photoUrl })
      .where(eq(customers.id, customerId))
      .returning({
        id: customers.id,
        photoUrl: customers.photoUrl,
      })
  },

  //Update customer status
  async updateStatus(customerId: string, status: CustomerStatusEnum) {
    return await db
      .update(customers)
      .set({ status: status })
      .where(eq(customers.id, customerId))
      .returning({
        id: customers.id,
        status: customers.status,
      })
  },
}
