import { customerRepository } from "../repositories/customer.repo"
import { locationRepository } from "../repositories/location.repo"

export const customerServices = {
  async findCustomersInAgency(agencyId: string) {
    const customers = await customerRepository.readAllCustomersByAgencyId(
      agencyId
    )
    return customers.map((c) => {
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        photoUrl: c.photoUrl,
        remarks: c.remarks,
        location: c.location.city + ", " + c.location.state,
      }
    })
  },

  async addNewCustomer(
    name: string,
    phone: string,
    locationCity: string,
    locationState: string,
    agencyId: string,
    userId: string
  ) {
    const location = await locationRepository.readLocationByCityState(
      locationCity,
      locationState
    )
    if (!location) {
      throw Error("Location not found")
    }
    const newCustomerData = {
      name: name,
      phone: phone,
      locationId: location.id,
      agencyId: agencyId,
      addedByUserId: userId,
    }
    const newCustomer = await customerRepository.createCustomer(newCustomerData)
    if (!newCustomer || newCustomer.length < 1) {
      throw Error("Failed to add new customer")
    }
    if (newCustomer.length > 1) {
      // !This is a major issue
      throw Error("Multiple customers found")
    }
    return {
      id: newCustomer[0]!.id,
    }
  },
}

export type FindCustomersInAgencyType = Awaited<
  ReturnType<typeof customerServices.findCustomersInAgency>
>
