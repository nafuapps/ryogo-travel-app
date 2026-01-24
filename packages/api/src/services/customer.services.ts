import {
  CustomerStatusEnum,
  InsertCustomerType,
} from "@ryogo-travel-app/db/schema"
import { bookingRepository } from "../repositories/booking.repo"
import { customerRepository } from "../repositories/customer.repo"
import { locationRepository } from "../repositories/location.repo"

export const customerServices = {
  async findCustomersInAgency(agencyId: string) {
    const customers =
      await customerRepository.readAllCustomersByAgencyId(agencyId)
    return customers
  },

  async findCustomerDetailsById(customerId: string) {
    const customer = await customerRepository.readCustomerById(customerId)
    if (!customer) {
      throw new Error("Customer not found")
    }
    return customer
  },

  //Get customer's upcoming bookings
  async findCustomerUpcomingBookingsById(id: string) {
    const bookings =
      await bookingRepository.readUpcomingBookingsByCustomerId(id)

    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source?.city + " - " + booking.destination?.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        bookingId: booking.id,
        startDate: booking.startDate,
        startTime: booking.startTime,
        endDate: booking.endDate,
        status: booking.tripLogs[0]?.type.toString(),
      }
    })
  },

  //Get customer's completed bookings
  async findCustomerCompletedBookingsById(id: string) {
    const bookings =
      await bookingRepository.readCompletedBookingsByCustomerId(id)

    return bookings.map((booking) => {
      return {
        status: booking.status.toString(),
        updatedAt: booking.updatedAt,
        type: booking.type.toString(),
        route: booking.source?.city + " - " + booking.destination?.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        bookingId: booking.id,
        createdAt: booking.tripLogs[0]?.createdAt,
      }
    })
  },

  async addNewCustomer(
    name: string,
    phone: string,
    locationCity: string,
    locationState: string,
    agencyId: string,
    userId: string,
    email?: string,
    address?: string,
    remarks?: string,
  ) {
    const location = await locationRepository.readLocationByCityState(
      locationCity,
      locationState,
    )
    if (!location) {
      throw Error("Location not found")
    }
    const newCustomerData: InsertCustomerType = {
      name: name,
      phone: phone,
      locationId: location.id,
      agencyId: agencyId,
      addedByUserId: userId,
      address: address,
      email: email,
      remarks: remarks,
      status: CustomerStatusEnum.ACTIVE,
    }
    const newCustomer = await customerRepository.createCustomer(newCustomerData)
    if (!newCustomer || newCustomer.length < 1) {
      throw Error("Failed to add new customer")
    }
    return {
      id: newCustomer[0]?.id,
    }
  },

  async modifyCustomer(
    id: string,
    state: string,
    city: string,
    name?: string,
    email?: string,
    address?: string,
    remarks?: string,
  ) {
    //Find location
    const location = await locationRepository.readLocationByCityState(
      city,
      state,
    )
    if (!location) {
      throw "Cannot find this location"
    }
    const customer = await customerRepository.updateCustomer(
      id,
      location.id,
      name,
      email,
      address,
      remarks,
    )
    return customer
  },
  //Update customer photo url
  async updateCustomerPhoto(userId: string, url: string) {
    const updatedCustomer = await customerRepository.updatePhotoUrl(userId, url)
    if (!updatedCustomer) {
      throw new Error("Failed to update photo url for this user")
    }
    return updatedCustomer[0]?.id
  },

  //Activate Customer
  async activateCustomer(id: string) {
    const customer = await customerRepository.updateStatus(
      id,
      CustomerStatusEnum.ACTIVE,
    )
    return customer[0]
  },

  //Inctivate Customer
  async inactivateCustomer(id: string) {
    const customer = await customerRepository.updateStatus(
      id,
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
