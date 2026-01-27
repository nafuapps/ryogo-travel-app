import { AgencyStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { agencyRepository } from "../repositories/agency.repo"
import { locationRepository } from "../repositories/location.repo"
import { CreateAgencyType } from "../types/agency.types"
import { vehicleRepository } from "../repositories/vehicle.repo"
import { driverRepository } from "../repositories/driver.repo"
import { userRepository } from "../repositories/user.repo"

export const agencyServices = {
  //Find all agencies

  async findAllAgencies() {
    const agencies = agencyRepository.readAllAgencies()
    return agencies
  },

  //Find all agencies by phone
  async findAgenciesByPhone(phone: string) {
    const agencies = agencyRepository.readAgenciesByPhone(phone)
    return agencies
  },

  //Find all agencies by email
  async findAgenciesByEmail(email: string) {
    const agencies = agencyRepository.readAgenciesByEmail(email)
    return agencies
  },

  //Find agency by id
  async findAgencyById(id: string) {
    const agency = await agencyRepository.readAgencyById(id)
    if (!agency) {
      throw new Error("Agency not found")
    }
    return agency
  },

  //Get agency data (vehicles, drivers, agents)
  async getAgencyData(agencyId: string) {
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

  // ? Onboarding flow
  //Create agency
  async createAgency(data: CreateAgencyType) {
    //Step1: Check if another agency exists with same phone and email
    const existingAgencies = await agencyRepository.readAgencyByPhoneEmail(
      data.businessPhone,
      data.businessEmail,
    )
    if (existingAgencies.length > 1) {
      // !This is a major issue
      throw new Error(
        "Multiple agencies with same phone and email already exists",
      )
    }
    if (existingAgencies.length > 0) {
      throw new Error("An agency with same phone and email already exists")
    }

    //Step2: Get location id from city, state
    const location = await locationRepository.readLocationByCityState(
      data.agencyCity,
      data.agencyState,
    )
    if (!location) {
      throw new Error("Location not found")
    }

    //Step3: Prepare agency data (Trial subscription with 30 day expiry, Status New)
    const createAgencyData = {
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      businessName: data.businessName,
      businessAddress: data.businessAddress,
      locationId: location.id,
      subscriptionExpiresOn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      defaultCommissionRate: data.commissionRate,
    }

    //Step4: create a new agency
    const newAgency = await agencyRepository.createAgency(createAgencyData)
    if (!newAgency || newAgency.length < 1) {
      throw new Error("Failed to create new agency")
    }

    return newAgency[0]
  },

  //Modify agency details
  async modifyAgency(
    agencyId: string,
    businessName?: string,
    businessAddress?: string,
    defaultCommissionRate?: number,
    agencyState?: string,
    agencyCity?: string,
    logoUrl?: string,
  ) {
    //Step1: Get location id from city, state (if provided)
    let locationId: string | undefined = undefined
    if (agencyCity && agencyState) {
      const location = await locationRepository.readLocationByCityState(
        agencyCity,
        agencyState,
      )
      if (!location) {
        throw new Error("Location not found")
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
      logoUrl,
    )
    return updatedAgency[0]
  },

  //Activate an agency
  async activateAgency(id: string) {
    const agency = await agencyRepository.updateAgencyStatus(
      id,
      AgencyStatusEnum.ACTIVE,
    )

    if (!agency || agency.length < 1) {
      throw new Error("Failed to update status for this agency")
    }
    return agency[0]!
  },

  async updateAgencyLogo(agencyId: string, url: string) {
    const updatedAgency = await agencyRepository.updateAgencyLogoUrl(
      agencyId,
      url,
    )
    if (!updatedAgency) {
      throw new Error("Failed to update logo url for this agency")
    }
    return updatedAgency[0]?.id
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

  //Increase subscription of an agency by N days
  async increaseSubscriptionExpiry(id: string, days: number) {
    const expiryTime = new Date(
      new Date().getTime() + days * 24 * 60 * 60 * 1000,
    )
    return await agencyRepository.updateAgencySubscriptionExpiry(id, expiryTime)
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
