import {
  CustomerStatusEnum,
  InsertCustomerType,
} from "@ryogo-travel-app/db/schema"
import { bookingRepository } from "../repositories/booking.repo"
import { customerRepository } from "../repositories/customer.repo"
import { locationRepository } from "../repositories/location.repo"
import {
  ModifyCustomerRequestType,
  NewCustomerRequestType,
} from "../types/customer.types"
import { addDays, subDays } from "date-fns"
import { BASIC_SEARCH_LIMIT_DAYS } from "../apiConfig"

export const customerServices = {
  async findCustomersInAgency(agencyId: string) {
    const customers =
      await customerRepository.readAllCustomersByAgencyId(agencyId)
    return customers
  },

  async findCustomerDetailsById(customerId: string) {
    const customer = await customerRepository.readCustomerById(customerId)
    return customer
  },

  //Get customer's upcoming bookings
  async findCustomerUpcomingBookingsById(
    customerId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryEndDate = addDays(new Date(), days)
    const bookings = await bookingRepository.readUpcomingBookingsByCustomerId({
      customerId,
      queryEndDate,
    })

    return bookings
  },

  //Get customer's completed bookings
  async findCustomerCompletedBookingsById(
    customerId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryStartDate = subDays(new Date(), days)
    const bookings = await bookingRepository.readCompletedBookingsByCustomerId({
      customerId,
      queryStartDate,
    })

    return bookings
  },

  async addNewCustomer(data: NewCustomerRequestType) {
    //Check if a customer with same phone already exists in this agency
    const existingCustomer =
      await customerRepository.readCustomerByPhoneInAgency({
        phone: data.phone,
        agencyId: data.agencyId,
      })
    if (existingCustomer.length > 0) {
      return
    }

    const location = await locationRepository.readLocationByCityState({
      city: data.city,
      state: data.state,
    })
    if (!location) {
      return
    }
    const newCustomerData: InsertCustomerType = {
      name: data.name,
      phone: data.phone,
      locationId: location.id,
      agencyId: data.agencyId,
      addedByUserId: data.addedByUserId,
      address: data.address,
      email: data.email,
      remarks: data.remarks,
      status: CustomerStatusEnum.ACTIVE,
    }
    const [newCustomer] =
      await customerRepository.createCustomer(newCustomerData)
    return newCustomer
  },

  async modifyCustomer(data: ModifyCustomerRequestType) {
    //Find location
    const location = await locationRepository.readLocationByCityState({
      city: data.city,
      state: data.state,
    })
    if (!location) {
      return
    }
    const [customer] = await customerRepository.updateCustomer({
      ...data,
      locationId: location.id,
    })
    return customer
  },
  //Update customer photo url
  async updateCustomerPhoto(customerId: string, photoUrl: string) {
    const [updatedCustomer] = await customerRepository.updatePhotoUrl({
      customerId,
      photoUrl,
    })
    return updatedCustomer
  },

  //Activate Customer
  async activateCustomer(customerId: string) {
    const [updatedCustomer] = await customerRepository.updateStatus({
      customerId,
      status: CustomerStatusEnum.ACTIVE,
    })
    return updatedCustomer
  },

  //Inctivate Customer
  async inactivateCustomer(customerId: string) {
    const [updatedCustomer] = await customerRepository.updateStatus({
      customerId,
      status: CustomerStatusEnum.INACTIVE,
    })
    return updatedCustomer
  },
}

export type FindCustomersInAgencyType = Awaited<
  ReturnType<typeof customerServices.findCustomersInAgency>
>

export type FindCustomerDetailsByIdType = Awaited<
  ReturnType<typeof customerServices.findCustomerDetailsById>
>

export type FindCustomerUpcomingBookingsByIdType = Awaited<
  ReturnType<typeof customerServices.findCustomerUpcomingBookingsById>
>

export type FindCustomerCompletedBookingsByIdType = Awaited<
  ReturnType<typeof customerServices.findCustomerCompletedBookingsById>
>
