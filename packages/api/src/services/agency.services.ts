import {
  AgencyStatusEnum,
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { addDays, differenceInDays, subDays } from "date-fns"
import {
  BASIC_SEARCH_LIMIT_DAYS,
  EXPIRATION_ALERT_WINDOW_DAYS,
  PREMIUM_TRIAL_DAYS,
} from "../apiConfig"
import { agencyRepository } from "../repositories/agency.repo"
import { bookingRepository } from "../repositories/booking.repo"
import { customerRepository } from "../repositories/customer.repo"
import { driverRepository } from "../repositories/driver.repo"
import { locationRepository } from "../repositories/location.repo"
import { userRepository } from "../repositories/user.repo"
import { vehicleRepository } from "../repositories/vehicle.repo"
import { ModifyAgencyRequestType } from "../types/agency.types"

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
  async findAgencyById(agencyId: string) {
    const agency = await agencyRepository.readAgencyById(agencyId)
    if (!agency) {
      console.error(`Agency not found: ${agencyId}`)
      return
    }
    return agency
  },

  //Get agency data (vehicles, drivers, agents)
  async findAgencyData(agencyId: string) {
    const agency = await agencyRepository.readAgencyById(agencyId)
    if (!agency) {
      console.error(`Agency not found: ${agencyId}`)
      return
    }
    const vehicles = await vehicleRepository.readVehiclesByAgencyId(agencyId)
    const drivers = await driverRepository.readDriversByAgencyId(agencyId)
    const agents = await userRepository.readUserByRolesAgencyId({
      agencyId,
      userRoles: [UserRolesEnum.AGENT],
    })

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
      agencyName: agency.businessName,
    }
  },

  async findAgencySearchData(
    agencyId: string,
    searchDays: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const vehicles = await vehicleRepository.readVehiclesByAgencyId(agencyId)
    const drivers = await driverRepository.readDriversByAgencyId(agencyId)
    const bookings = await bookingRepository.readBookingsSearchData(
      agencyId,
      subDays(new Date(), searchDays),
    )
    const customers = await customerRepository.readCustomersSearchData(agencyId)

    return {
      vehicles,
      drivers,
      customers,
      bookings,
    }
  },

  /*
  1. Vehicle -  RC, PUC, Insurance
  2. Driver - License
  */
  async findAgencyExpiryAlerts({ agencyId }: { agencyId: string }) {
    const vehicles = await vehicleRepository.readVehiclesByAgencyId(agencyId)
    const rcExpiring = vehicles.filter(
      (vehicle) =>
        vehicle.rcExpiresOn &&
        differenceInDays(vehicle.rcExpiresOn, new Date()) <=
          EXPIRATION_ALERT_WINDOW_DAYS,
    )
    const pucExpiring = vehicles.filter(
      (vehicle) =>
        vehicle.pucExpiresOn &&
        differenceInDays(vehicle.pucExpiresOn, new Date()) <=
          EXPIRATION_ALERT_WINDOW_DAYS,
    )
    const insuranceExpiring = vehicles.filter(
      (vehicle) =>
        vehicle.insuranceExpiresOn &&
        differenceInDays(vehicle.insuranceExpiresOn, new Date()) <=
          EXPIRATION_ALERT_WINDOW_DAYS,
    )

    const drivers = await driverRepository.readDriversByAgencyId(agencyId)
    const licenseExpiring = drivers.filter((driver) => {
      driver.licenseExpiresOn &&
        differenceInDays(driver.licenseExpiresOn, new Date()) <=
          EXPIRATION_ALERT_WINDOW_DAYS
    })

    return {
      rcExpiring,
      pucExpiring,
      insuranceExpiring,
      licenseExpiring,
    }
  },

  //Modify agency details
  async modifyAgency(data: ModifyAgencyRequestType) {
    //Step1: Get location id from city, state (if provided)
    let locationId
    if (data.agencyCity && data.agencyState) {
      const location = await locationRepository.readLocationByCityState({
        city: data.agencyCity,
        state: data.agencyState,
      })
      locationId = location?.id
    }

    //Step2: Update agency details
    const [updatedAgency] = await agencyRepository.updateAgencyDetails({
      ...data,
      locationId: locationId,
    })
    if (!updatedAgency) {
      console.error(`Could not update agency details: ${data}`)
      return
    }
    return updatedAgency
  },

  //Activate an agency
  async activateAgency(agencyId: string, updateSubscriptionExpiry?: boolean) {
    const agency = await agencyRepository.readAgencyById(agencyId)
    if (
      !agency ||
      agency.status === AgencyStatusEnum.SUSPENDED ||
      agency.status === AgencyStatusEnum.ACTIVE
    ) {
      console.error(
        `Agency doesn't exist, suspended or already active: ${agencyId}`,
      )
      return
    }

    const [updatedAgency] = await agencyRepository.updateAgencyStatus({
      id: agencyId,
      status: AgencyStatusEnum.ACTIVE,
      subscriptionExpiresOn: updateSubscriptionExpiry
        ? getSubscriptionExpirationDate()
        : undefined,
    })
    if (!updatedAgency) {
      console.error(`Could not update agency status to active: ${agencyId}`)
      return
    }
    return updatedAgency
  },

  //Inactivate an agency
  async inactivateAgency(agencyId: string) {
    const agency = await agencyRepository.readAgencyById(agencyId)
    if (
      !agency ||
      agency.status === AgencyStatusEnum.SUSPENDED ||
      agency.status === AgencyStatusEnum.INACTIVE
    ) {
      console.error(
        `Agency doesn't exist, suspended or already inactive: ${agencyId}`,
      )
      return
    }

    const [updatedAgency] = await agencyRepository.updateAgencyStatus({
      id: agencyId,
      status: AgencyStatusEnum.INACTIVE,
    })
    if (!updatedAgency) {
      console.error(`Could not update agency to inactive: ${agencyId}`)
      return
    }
    return updatedAgency
  },

  async updateAgencyLogo({
    agencyId,
    logoUrl,
  }: {
    agencyId: string
    logoUrl: string
  }) {
    const [updatedAgency] = await agencyRepository.updateAgencyLogoUrl({
      agencyId,
      logoUrl,
    })
    if (!updatedAgency) {
      console.error(`Could not update agency logo: ${agencyId} ${logoUrl}`)
      return
    }
    return updatedAgency
  },

  async updateAgencyQRCode({
    agencyId,
    qrCodeUrl,
  }: {
    agencyId: string
    qrCodeUrl: string
  }) {
    const [updatedAgency] = await agencyRepository.updateAgencyQRCodeUrl({
      agencyId,
      qrCodeUrl,
    })
    if (!updatedAgency) {
      console.error(`Could not update agency QR code: ${agencyId} ${qrCodeUrl}`)
      return
    }
    return updatedAgency
  },

  //Change agency phone
  async changeAgencyPhone({
    agencyId,
    businessPhone,
  }: {
    agencyId: string
    businessPhone: string
  }) {
    const agency = await agencyRepository.readAgencyById(agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency doesn't exist or suspended: ${agencyId}`)
      return
    }
    const existingAgencyWithPhoneEmail =
      await agencyRepository.readAgencyByPhoneEmail({
        businessPhone,
        businessEmail: agency.businessEmail,
      })
    if (existingAgencyWithPhoneEmail) {
      console.error(
        `Agency already exists with same phone and email: ${businessPhone} ${agency.businessEmail}`,
      )
      return
    }

    const [updatedAgency] = await agencyRepository.updateAgencyPhone({
      agencyId,
      businessPhone,
    })
    if (!updatedAgency) {
      console.error(
        `Could not update agency phone: ${agencyId} ${businessPhone}`,
      )
      return
    }
    return updatedAgency
  },

  //Change agency email
  async changeAgencyEmail({
    agencyId,
    businessEmail,
  }: {
    agencyId: string
    businessEmail: string
  }) {
    const agency = await agencyRepository.readAgencyById(agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency doesn't exist or suspended: ${agencyId}`)
      return
    }
    const existingAgencyWithPhoneEmail =
      await agencyRepository.readAgencyByPhoneEmail({
        businessPhone: agency.businessPhone,
        businessEmail,
      })
    if (existingAgencyWithPhoneEmail) {
      console.error(
        `Agency already exists with same phone and email: ${agency.businessPhone} ${businessEmail}`,
      )
      return
    }

    const [updatedAgency] = await agencyRepository.updateAgencyEmail({
      agencyId,
      businessEmail,
    })
    if (!updatedAgency) {
      console.error(
        `Could not update agency email: ${agencyId} ${businessEmail}`,
      )
    }
    return updatedAgency
  },

  async downgradeAgencyToBasic(agencyId: string) {
    const agency = await agencyRepository.readAgencyById(agencyId)
    if (
      !agency ||
      agency.status === AgencyStatusEnum.SUSPENDED ||
      agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
    ) {
      console.error(
        `Agency doesn't exist, suspended or is already Basic: ${agencyId}`,
      )
      return
    }

    const [updatedAgency] = await agencyRepository.updateAgencySubscriptionPlan(
      {
        id: agencyId,
        subscriptionPlan: SubscriptionPlanEnum.BASIC,
        subscriptionExpiresOn: getSubscriptionExpirationDate(),
      },
    )
    if (!updatedAgency) {
      console.error(
        `Could not update agency subscription plan downgrade to Basic: ${agencyId}`,
      )
      return
    }
    return updatedAgency
  },

  async tryPremium(agencyId: string) {
    const agency = await agencyRepository.readAgencyById(agencyId)
    if (
      !agency ||
      agency.status === AgencyStatusEnum.SUSPENDED ||
      agency.hasTriedSubscription
    ) {
      console.error(
        `Agency doesn't exist, suspended, or has already tried Premium: ${agencyId}`,
      )
      return
    }

    const [updatedAgency] = await agencyRepository.updateAgencySubscriptionPlan(
      {
        id: agencyId,
        subscriptionPlan: SubscriptionPlanEnum.PREMIUM,
        subscriptionExpiresOn: getSubscriptionExpirationDate(),
      },
    )
    if (!updatedAgency) {
      console.error(
        `Could not update agency trial subscription plan: ${agencyId}`,
      )
      return
    }
    return updatedAgency
  },
}

export function getSubscriptionExpirationDate() {
  return addDays(new Date(), PREMIUM_TRIAL_DAYS)
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

export type FindAgencyExpiryAlertsType = Awaited<
  ReturnType<typeof agencyServices.findAgencyExpiryAlerts>
>
