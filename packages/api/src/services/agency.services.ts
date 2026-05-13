import {
  AgencyStatusEnum,
  OrderTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { agencyRepository } from "../repositories/agency.repo"
import { locationRepository } from "../repositories/location.repo"
import { vehicleRepository } from "../repositories/vehicle.repo"
import { driverRepository } from "../repositories/driver.repo"
import { userRepository } from "../repositories/user.repo"
import { bookingRepository } from "../repositories/booking.repo"
import { customerRepository } from "../repositories/customer.repo"
import {
  ANNUAL_SUBSCRIPTION_DAYS,
  BOOKINGS_SEARCH_DAYS,
  MONTHLY_SUBSCRIPTION_DAYS,
  QUARTERLY_SUBSCRIPTION_DAYS,
} from "../apiConfig"

export const agencyServices = {
  //Find all agencies
  async findAllAgencies() {
    const agencies = await agencyRepository.readAllAgencies()
    return agencies
  },

  //Find all agencies by phone
  async findAgenciesByPhone(phone: string) {
    const agencies = await agencyRepository.readAgenciesByPhone(phone)
    return agencies
  },

  //Find all agencies by email
  async findAgenciesByEmail(email: string) {
    const agencies = await agencyRepository.readAgenciesByEmail(email)
    return agencies
  },

  //Find agency by id
  async findAgencyById(id: string) {
    const agency = await agencyRepository.readAgencyById(id)
    return agency
  },

  //Get agency data (vehicles, drivers, agents)
  async findAgencyData(agencyId: string) {
    const vehicles = await vehicleRepository.readVehiclesByAgencyId(agencyId)
    const drivers = await driverRepository.readDriversByAgencyId(agencyId)
    const agents = await userRepository.readUserByRolesAgencyId(agencyId, [
      UserRolesEnum.AGENT,
    ])

    return {
      vehicles: vehicles.map((vehicle) => {
        return { id: vehicle.id }
      }),
      drivers: drivers.map((driver) => {
        return { id: driver.id }
      }),
      agents: agents.map((agent) => {
        return { id: agent.id }
      }),
    }
  },

  async findAgencySearchData(agencyId: string) {
    const vehicles = await vehicleRepository.readVehiclesSearchData(agencyId)
    const drivers = await driverRepository.readDriversSearchData(agencyId)
    const bookings = await bookingRepository.readBookingsSearchData(
      agencyId,
      new Date(
        new Date().getTime() - BOOKINGS_SEARCH_DAYS * 24 * 60 * 60 * 1000,
      ),
    )
    const customers = await customerRepository.readCustomersSearchData(agencyId)

    return {
      vehicles,
      drivers,
      customers,
      bookings,
    }
  },

  //Modify agency details
  async modifyAgency(
    agencyId: string,
    businessName?: string,
    businessAddress?: string,
    defaultCommissionRate?: number,
    agencyState?: string,
    agencyCity?: string,
  ) {
    //Step1: Get location id from city, state (if provided)
    let locationId: string | undefined = undefined
    if (agencyCity && agencyState) {
      const location = await locationRepository.readLocationByCityState(
        agencyCity,
        agencyState,
      )
      if (!location) {
        return
      }
      locationId = location.id
    }

    //Step2: Update agency details
    const updatedAgency = await agencyRepository.updateAgencyDetails(
      agencyId,
      businessName,
      businessAddress,
      defaultCommissionRate,
      locationId,
    )
    return updatedAgency[0]
  },

  //Activate an agency
  async activateAgency(id: string) {
    await agencyRepository.updateAgencyStatus(id, AgencyStatusEnum.ACTIVE)
  },

  async updateAgencyLogo(agencyId: string, url: string) {
    await agencyRepository.updateAgencyLogoUrl(agencyId, url)
  },

  //Change agency phone
  async changeAgencyPhone(agencyId: string, newPhone: string) {
    const updatedAgency = await agencyRepository.updateAgencyPhone(
      agencyId,
      newPhone,
    )
    return updatedAgency[0]
  },

  //Change agency email
  async changeAgencyEmail(agencyId: string, newEmail: string) {
    const updatedAgency = await agencyRepository.updateAgencyEmail(
      agencyId,
      newEmail,
    )
    return updatedAgency[0]
  },

  //Subscribe an agency based on order type
  async subscribeAgency(agencyId: string, orderType: OrderTypeEnum) {
    let days = MONTHLY_SUBSCRIPTION_DAYS
    if (orderType === OrderTypeEnum.QUARTERLY) {
      days = QUARTERLY_SUBSCRIPTION_DAYS
    }
    if (orderType === OrderTypeEnum.ANNUAL) {
      days = ANNUAL_SUBSCRIPTION_DAYS
    }
    const expiryTime = new Date(
      new Date().getTime() + days * 24 * 60 * 60 * 1000,
    )
    return await agencyRepository.updateAgencySubscription(agencyId, expiryTime)
  },
}

export type FindAllAgenciesType = Awaited<
  ReturnType<typeof agencyServices.findAllAgencies>
>

export type FindAgencyByIdType = Awaited<
  ReturnType<typeof agencyServices.findAgencyById>
>

export type FindAgenciesByPhoneType = Awaited<
  ReturnType<typeof agencyServices.findAgenciesByPhone>
>

export type FindAgenciesByEmailType = Awaited<
  ReturnType<typeof agencyServices.findAgenciesByEmail>
>

export type FindAgencyDataType = Awaited<
  ReturnType<typeof agencyServices.findAgencyData>
>

export type FindAgencySearchDataType = Awaited<
  ReturnType<typeof agencyServices.findAgencySearchData>
>
