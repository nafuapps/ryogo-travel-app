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
    const bookings = await bookingRepository.readUpcomingBookingsByCustomerId(
      customerId,
      queryEndDate,
    )

    return bookings
  },

  //Get customer's completed bookings
  async findCustomerCompletedBookingsById(
    customerId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryStartDate = subDays(new Date(), days)
    const bookings = await bookingRepository.readCompletedBookingsByCustomerId(
      customerId,
      queryStartDate,
    )

    return bookings
  },

  async addNewCustomer(data: NewCustomerRequestType) {
    //Check if a customer with same phone already exists in this agency
    const existingCustomer =
      await customerRepository.readCustomerByPhoneInAgency(
        data.phone,
        data.agencyId,
      )
    if (existingCustomer.length > 0) {
      return
    }

    const location = await locationRepository.readLocationByCityState(
      data.city,
      data.state,
    )
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
    const newCustomer = await customerRepository.createCustomer(newCustomerData)
    if (!newCustomer[0]) return
    return newCustomer[0]
  },

  async modifyCustomer(data: ModifyCustomerRequestType) {
    //Find location
    const location = await locationRepository.readLocationByCityState(
      data.city,
      data.state,
    )
    if (!location) {
      return
    }
    const customer = await customerRepository.updateCustomer(
      data.customerId,
      location.id,
      data.name,
      data.email,
      data.address,
      data.remarks,
    )
    return customer[0]
  },
  //Update customer photo url
  async updateCustomerPhoto(customerId: string, url: string) {
    const updatedCustomer = await customerRepository.updatePhotoUrl(
      customerId,
      url,
    )
    return updatedCustomer[0]
  },

  //Activate Customer
  async activateCustomer(customerId: string) {
    const customer = await customerRepository.updateStatus(
      customerId,
      CustomerStatusEnum.ACTIVE,
    )
    return customer[0]
  },

  //Inctivate Customer
  async inactivateCustomer(customerId: string) {
    const customer = await customerRepository.updateStatus(
      customerId,
      CustomerStatusEnum.INACTIVE,
    )
    return customer[0]
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
