import {
  AgencyStatusEnum,
  DriverLeaveStatusEnum,
  SubscriptionPlanEnum,
  UserRolesEnum,
  VehicleRepairStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { agencyRepository } from "../repositories/agency.repo"
import { locationRepository } from "../repositories/location.repo"
import { vehicleRepository } from "../repositories/vehicle.repo"
import { driverRepository } from "../repositories/driver.repo"
import { userRepository } from "../repositories/user.repo"
import { bookingRepository } from "../repositories/booking.repo"
import { customerRepository } from "../repositories/customer.repo"
import {
  BASIC_SEARCH_LIMIT_DAYS,
  EXPIRATION_ALERT_WINDOW_DAYS,
  PREMIUM_TRIAL_DAYS,
} from "../apiConfig"
import { ModifyAgencyRequestType } from "../types/agency.types"
import { addDays, differenceInDays, subDays } from "date-fns"
import { vehicleRepairRepository } from "../repositories/vehicleRepair.repo"
import { driverLeaveRepository } from "../repositories/driverLeave.repo"

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
    return agency
  },

  //Get agency data (vehicles, drivers, agents)
  async findAgencyData(agencyId: string) {
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
  3. Driver leave
  4. Vehicle repair
  */
  async findAgencyExpiryAlerts({
    agencyId,
    userId,
  }: {
    agencyId: string
    userId: string
  }) {
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

    const vehicleRepairs =
      await vehicleRepairRepository.readVehicleRepairsByAddedUserId(userId)
    const vehicleRepairAlerts = vehicleRepairs.filter(
      (vehicleRepair) =>
        vehicleRepair.status !== VehicleRepairStatusEnum.COMPLETED &&
        differenceInDays(vehicleRepair.endDate, new Date()) <= 0,
    )

    const drivers = await driverRepository.readDriversByAgencyId(agencyId)
    const licenseExpiring = drivers.filter((driver) => {
      driver.licenseExpiresOn &&
        differenceInDays(driver.licenseExpiresOn, new Date()) <=
          EXPIRATION_ALERT_WINDOW_DAYS
    })

    const driverLeaves =
      await driverLeaveRepository.readDriverLeavesByAddedUserId(userId)
    const driverLeaveAlerts = driverLeaves.filter(
      (driverLeave) =>
        driverLeave.status !== DriverLeaveStatusEnum.COMPLETED &&
        differenceInDays(driverLeave.endDate, new Date()) <= 0,
    )

    return {
      rcExpiring,
      pucExpiring,
      insuranceExpiring,
      vehicleRepairAlerts,
      licenseExpiring,
      driverLeaveAlerts,
    }
  },

  //Modify agency details
  async modifyAgency(data: ModifyAgencyRequestType) {
    //Step1: Get location id from city, state (if provided)
    let locationId: string | undefined = undefined
    if (data.agencyCity && data.agencyState) {
      const location = await locationRepository.readLocationByCityState({
        city: data.agencyCity,
        state: data.agencyState,
      })
      if (!location) {
        return
      }
      locationId = location.id
    }

    //Step2: Update agency details
    const [updatedAgency] = await agencyRepository.updateAgencyDetails({
      id: data.agencyId,
      businessName: data.businessName,
      businessAddress: data.businessAddress,
      defaultCommissionRate: data.defaultCommissionRate,
      locationId: locationId,
    })
    return updatedAgency
  },

  //Activate an agency
  async activateAgency(agencyId: string, updateSubscriptionExpiry?: boolean) {
    const [updatedAgency] = await agencyRepository.updateAgencyStatus({
      id: agencyId,
      status: AgencyStatusEnum.ACTIVE,
      subscriptionExpiresOn: updateSubscriptionExpiry
        ? getSubscriptionExpirationDate()
        : undefined,
    })
    return updatedAgency
  },

  //Inactivate an agency
  async inactivateAgency(agencyId: string) {
    const [updatedAgency] = await agencyRepository.updateAgencyStatus({
      id: agencyId,
      status: AgencyStatusEnum.INACTIVE,
    })
    return updatedAgency
  },

  async updateAgencyLogo({
    agencyId,
    logoUrl,
  }: {
    agencyId: string
    logoUrl: string
  }) {
    const [agency] = await agencyRepository.updateAgencyLogoUrl({
      agencyId,
      logoUrl,
    })
    return agency
  },

  async updateAgencyQRCode({
    agencyId,
    qrCodeUrl,
  }: {
    agencyId: string
    qrCodeUrl: string
  }) {
    const [agency] = await agencyRepository.updateAgencyQRCodeUrl({
      agencyId,
      qrCodeUrl,
    })
    return agency
  },

  //Change agency phone
  async changeAgencyPhone({
    agencyId,
    businessPhone,
  }: {
    agencyId: string
    businessPhone: string
  }) {
    const [updatedAgency] = await agencyRepository.updateAgencyPhone({
      agencyId,
      businessPhone,
    })
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
    const [updatedAgency] = await agencyRepository.updateAgencyEmail({
      agencyId,
      businessEmail,
    })
    return updatedAgency
  },

  async downgradeAgencyToBasic(agencyId: string) {
    const [updatedAgency] = await agencyRepository.updateAgencySubscriptionPlan(
      {
        id: agencyId,
        subscriptionPlan: SubscriptionPlanEnum.BASIC,
        subscriptionExpiresOn: getSubscriptionExpirationDate(),
      },
    )
    return updatedAgency
  },

  async tryPremium(agencyId: string) {
    const [updatedAgency] = await agencyRepository.updateAgencySubscriptionPlan(
      {
        id: agencyId,
        subscriptionPlan: SubscriptionPlanEnum.PREMIUM,
        subscriptionExpiresOn: getSubscriptionExpirationDate(),
      },
    )
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
