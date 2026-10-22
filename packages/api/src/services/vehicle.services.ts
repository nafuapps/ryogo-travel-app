import {
  AgencyStatusEnum,
  InsertVehicleRepairType,
  InsertVehicleType,
  SubscriptionPlanEnum,
  VehicleRepairStatusEnum,
  VehicleStatusEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { addDays, subDays } from "date-fns"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_VEHICLE_LIMIT,
  BASIC_SEARCH_LIMIT_DAYS,
} from "../apiConfig"
import { agencyRepository } from "../repositories/agency.repo"
import { bookingRepository } from "../repositories/booking.repo"
import { vehicleRepository } from "../repositories/vehicle.repo"
import { vehicleRepairRepository } from "../repositories/vehicleRepair.repo"
import {
  AddVehicleRequestType,
  ChangeVehicleDocumentRequestType,
  ModifyVehicleRequestType,
} from "../types/vehicle.types"
import { ModifyVehicleRepairRequestType } from "../types/vehicleRepair.types"

export const vehicleServices = {
  async findDashboardVehicles(agencyId: string) {
    const vehicles = await vehicleRepository.readVehiclesByAgencyId(agencyId)
    return vehicles
  },

  //Get all vehicles of an agency
  async findVehiclesByAgency(agencyId: string) {
    const vehicles =
      await vehicleRepository.readAllVehiclesDataByAgencyId(agencyId)
    return vehicles
  },

  //Find existing vehicles in agency
  async findExistingVehiclesInAgency(agency: string) {
    const vehicles = await vehicleRepository.readAllVehiclesInAgency(agency)
    return vehicles
  },

  //Get vehicles schedule
  async findVehiclesScheduleNextDays(agencyId: string, days: number = 7) {
    const queryEndDate = addDays(new Date(), days)

    const vehiclesScheduleData =
      await vehicleRepository.readVehiclesScheduleData({
        agencyId,
        queryEndDate,
      })

    return vehiclesScheduleData
  },

  //Get vehicle details
  async findVehicleDetailsById(vehicleId: string) {
    const vehicle = await vehicleRepository.readVehicleById(vehicleId)
    return vehicle
  },

  //Get vehicle's assigned bookings
  async findVehicleAssignedBookingsById(
    vehicleId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryEndDate = addDays(new Date(), days)
    const bookings = await bookingRepository.readAllAssignedBookingsByVehicleId(
      {
        vehicleId,
        queryEndDate,
      },
    )

    return bookings
  },

  //Get vehicle's completed bookings
  async findVehicleCompletedBookingsById(
    vehicleId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryStartDate = subDays(new Date(), days)
    const bookings = await bookingRepository.readCompletedBookingsByVehicleId({
      vehicleId,
      queryStartDate,
    })

    return bookings
  },

  //Get assigned vehicle for a booking by driverId
  async findAssignedVehicleByDriverId(driverId: string) {
    let booking = await bookingRepository.readOngoingBookingByDriverId(driverId)

    if (!booking || booking.assignedVehicleId === null) {
      booking =
        await bookingRepository.readFirstAssignedBookingByDriverId(driverId)
      if (!booking || booking.assignedVehicleId === null) {
        console.error(`No assigned vehicle found for the driver: ${driverId}`)
        return
      }
    }
    const assignedVehicle = vehicleRepository.readVehicleById(
      booking.assignedVehicleId,
    )
    return assignedVehicle
  },

  //Get all vehicle repairs by vehicleId
  async findAllVehicleRepairsByVehicleId(
    vehicleId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryStartDate = subDays(new Date(), days)
    const repairs = await vehicleRepairRepository.readVehicleRepairsByVehicleId(
      {
        vehicleId,
        queryStartDate,
      },
    )
    return repairs
  },

  //Get vehicle repair by id
  async findVehicleRepairById(repairId: string) {
    const repair = await vehicleRepairRepository.readRepairById(repairId)
    return repair
  },

  //Add vehicle to agency
  async addVehicle(data: AddVehicleRequestType) {
    const agency = await agencyRepository.readAgencyById(data.agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency not found or suspended: ${data.agencyId}`)
      return
    }

    //SUBSCRIPTION CHECK: Check if basic plan has reached vehicles limit
    if (
      !APP_TRIAL_MODE &&
      (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
        agency.subscriptionExpiresOn < new Date())
    ) {
      const vehicles = await vehicleRepository.readVehiclesByAgencyId(
        data.agencyId,
      )
      if (vehicles.length >= BASIC_PLAN_VEHICLE_LIMIT) {
        console.error(`Basic plan vehicle limit reached: ${data.agencyId}`)
        return
      }
    }

    //Step1: Check if the vehicle already exists in this agency
    const existingVehicleInAgency =
      await vehicleRepository.readVehicleByNumberInAgency({
        agencyId: data.agencyId,
        vehicleNumber: data.vehicleNumber.toUpperCase(),
      })
    if (existingVehicleInAgency) {
      console.error(
        `Existing vehicle number in the agency: ${data.agencyId} ${data.vehicleNumber}`,
      )
      return
    }

    const newVehicleData: InsertVehicleType = {
      agencyId: data.agencyId,
      addedByUserId: data.addedByUserId,
      vehicleNumber: data.vehicleNumber.toUpperCase(),
      type: data.type,
      brand: data.brand,
      color: data.color,
      model: data.model,
      capacity: data.capacity ?? getDefaultCapacityByVehicleType(data.type),
      odometerReading: data.odometerReading,
      insuranceExpiresOn: data.insuranceExpiresOn,
      pucExpiresOn: data.pucExpiresOn,
      rcExpiresOn: data.rcExpiresOn,
      hasAC: data.hasAC,
      defaultRatePerKm: data.defaultRatePerKm,
      defaultAcChargePerDay: data.defaultAcChargePerDay,
      status: VehicleStatusEnum.AVAILABLE,
    }
    //Step3: Create vehicle in DB
    const [newVehicle] = await vehicleRepository.createVehicle(newVehicleData)
    if (!newVehicle) {
      console.error(`Vehicle could not be added: ${data}`)
      return
    }
    return newVehicle
  },

  //Add vehicle repair
  async addVehicleRepair(data: InsertVehicleRepairType) {
    const vehicle = await vehicleRepository.readVehicleById(data.vehicleId)
    if (!vehicle || vehicle.status === VehicleStatusEnum.SUSPENDED) {
      console.error(`Vehicle not found or suspended: ${data.vehicleId}`)
      return
    }

    const [repair] = await vehicleRepairRepository.createRepair(data)
    if (!repair) {
      console.error(`Vehicle repair could not be created: ${data}`)
      return
    }

    return { ...repair, vehicleNumber: vehicle.vehicleNumber }
  },

  //Modify vehicle repair
  async modifyVehicleRepair(data: ModifyVehicleRepairRequestType) {
    const vehicle = await vehicleRepository.readVehicleById(data.vehicleId)
    if (!vehicle || vehicle.status === VehicleStatusEnum.SUSPENDED) {
      console.error(`Vehicle not found or suspended: ${data.vehicleId}`)
      return
    }

    const [repair] = await vehicleRepairRepository.updateRepairDetails(data)
    if (!repair) {
      console.error(`Vehicle repair could not be updated: ${data}`)
      return
    }

    return { ...repair, vehicleNumber: vehicle.vehicleNumber }
  },

  //Remove vehicle repair
  async removeVehicleRepair(repairId: string) {
    const [deletedRepair] = await vehicleRepairRepository.deleteRepair(repairId)
    if (!deletedRepair) {
      console.error(`Vehicle repair could not be removed: ${repairId}`)
      return
    }
    return deletedRepair
  },

  //Start vehicle repair
  async startVehicleRepair({
    repairId,
    vehicleId,
  }: {
    repairId: string
    vehicleId: string
  }) {
    const vehicle = await vehicleRepository.readVehicleById(vehicleId)
    if (!vehicle || vehicle.status !== VehicleStatusEnum.AVAILABLE) {
      console.error(
        `Vehicle not found or not available to start repair: ${vehicleId}`,
      )
      return
    }

    const repair = await vehicleRepairRepository.readRepairById(repairId)
    if (!repair || repair.status !== VehicleRepairStatusEnum.PENDING) {
      console.error(`Vehicle repair not found or not pending: ${repairId}`)
      return
    }

    const startedRepair = await vehicleRepairRepository.updateRepairToStarted({
      repairId,
      vehicleId,
    })
    if (!startedRepair) {
      console.error(
        `Vehicle repair could not be started: ${vehicleId} ${repairId}`,
      )
      return
    }
    return startedRepair
  },

  //End vehicle repair
  async endVehicleRepair({
    repairId,
    vehicleId,
  }: {
    repairId: string
    vehicleId: string
  }) {
    const vehicle = await vehicleRepository.readVehicleById(vehicleId)
    if (!vehicle || vehicle.status !== VehicleStatusEnum.REPAIR) {
      console.error(`Vehicle not found or not in repair to end: ${vehicleId}`)
      return
    }

    const repair = await vehicleRepairRepository.readRepairById(repairId)
    if (!repair || repair.status !== VehicleRepairStatusEnum.ONGOING) {
      console.error(`Vehicle repair not found or not ongoing: ${repairId}`)
      return
    }

    const endedRepair = await vehicleRepairRepository.updateRepairToEnded({
      repairId,
      vehicleId,
    })
    if (!endedRepair) {
      console.error(
        `Vehicle repair could not be ended: ${vehicleId} ${repairId}`,
      )
      return
    }
    return endedRepair
  },

  //Change vehicle number
  async changeVehicleNumber({
    vehicleId,
    vehicleNumber,
  }: {
    vehicleId: string
    vehicleNumber: string
  }) {
    const vehicle = await vehicleRepository.readVehicleById(vehicleId)
    if (!vehicle || vehicle.status === VehicleStatusEnum.SUSPENDED) {
      console.error(`Vehicle not found or suspended: ${vehicleId}`)
      return
    }

    const existingVehicle = await vehicleRepository.readVehicleByNumberInAgency(
      {
        agencyId: vehicle.agencyId,
        vehicleNumber: vehicleNumber.toUpperCase(),
      },
    )
    if (existingVehicle) {
      console.error(
        `Existing vehicle number in the agency: ${vehicle.agencyId} ${vehicleNumber}`,
      )
      return
    }

    const [updatedVehicle] = await vehicleRepository.updateVehicleNumber({
      vehicleId,
      vehicleNumber,
    })
    if (!updatedVehicle) {
      console.error(
        `Vehicle number could not be updated: ${vehicleId} ${vehicleNumber}`,
      )
      return
    }
    return updatedVehicle
  },

  //Modify vehicle details
  async modifyVehicle(data: ModifyVehicleRequestType) {
    const vehicle = await vehicleRepository.readVehicleById(data.vehicleId)
    if (!vehicle || vehicle.status === VehicleStatusEnum.SUSPENDED) {
      console.error(`Vehicle not found or suspended: ${data.vehicleId}`)
      return
    }

    const [updatedVehicle] = await vehicleRepository.updateVehicleDetails(data)
    if (!updatedVehicle) {
      console.error(`Vehicle details could not be modified: ${data}`)
      return
    }
    return updatedVehicle
  },

  //Update Vehicle doc URL
  async changeVehicleDocURLs({
    vehicleId,
    rcPhotoUrl,
    pucPhotoUrl,
    insurancePhotoUrl,
    vehiclePhotoUrl,
  }: {
    vehicleId: string
    rcPhotoUrl?: string
    pucPhotoUrl?: string
    insurancePhotoUrl?: string
    vehiclePhotoUrl?: string
  }) {
    const vehicle = await vehicleRepository.readVehicleById(vehicleId)
    if (!vehicle || vehicle.status === VehicleStatusEnum.SUSPENDED) return

    await vehicleRepository.updateDocUrls({
      vehicleId,
      rcPhotoUrl,
      pucPhotoUrl,
      insurancePhotoUrl,
      vehiclePhotoUrl,
    })
  },

  async changeVehicleDocument(
    data: ChangeVehicleDocumentRequestType,
    photoUrl?: string,
  ) {
    const vehicle = await vehicleRepository.readVehicleById(data.vehicleId)
    if (!vehicle || vehicle.status === VehicleStatusEnum.SUSPENDED) return

    let updatedVehicle
    if (data.type === "rc") {
      const [v] = await vehicleRepository.updateRCDetails({
        vehicleId: data.vehicleId,
        rcExpiresOn: data.expiresOn,
        rcPhotoUrl: photoUrl,
      })
      updatedVehicle = v
    } else if (data.type === "puc") {
      const [v] = await vehicleRepository.updatePUCDetails({
        vehicleId: data.vehicleId,
        pucExpiresOn: data.expiresOn,
        pucPhotoUrl: photoUrl,
      })
      updatedVehicle = v
    } else {
      const [v] = await vehicleRepository.updateInsuranceDetails({
        vehicleId: data.vehicleId,
        insuranceExpiresOn: data.expiresOn,
        insurancePhotoUrl: photoUrl,
      })
      updatedVehicle = v
    }
    if (!updatedVehicle) {
      console.error(`Vehicle document could not be updated: ${data}`)
      return
    }
    return updatedVehicle
  },

  //Update Vehicle photo URL
  async renewVehiclePhotoURL({
    vehicleId,
    vehiclePhotoUrl,
  }: {
    vehicleId: string
    vehiclePhotoUrl: string
  }) {
    const [updatedVehicle] = await vehicleRepository.updateVehiclePhotoUrl({
      vehicleId,
      vehiclePhotoUrl,
    })
    if (!updatedVehicle) {
      console.error(
        `Vehicle photo url could not be activated: ${vehicleId} ${vehiclePhotoUrl}`,
      )
      return
    }
    return updatedVehicle
  },

  //Activate Vehicle
  async activateVehicle(vehicleId: string) {
    const vehicle = await vehicleRepository.readVehicleById(vehicleId)
    if (
      !vehicle ||
      vehicle.status === VehicleStatusEnum.SUSPENDED ||
      vehicle.status === VehicleStatusEnum.AVAILABLE
    )
      return

    const [updatedVehicle] = await vehicleRepository.updateStatus({
      vehicleId,
      status: VehicleStatusEnum.AVAILABLE,
    })
    if (!updatedVehicle) {
      console.error(`Vehicle could not be activated: ${vehicleId}`)
      return
    }
    return updatedVehicle
  },

  //Inctivate Vehicle
  async inactivateVehicle(vehicleId: string) {
    const vehicle = await vehicleRepository.readVehicleById(vehicleId)
    if (
      !vehicle ||
      vehicle.status === VehicleStatusEnum.SUSPENDED ||
      vehicle.status === VehicleStatusEnum.INACTIVE
    )
      return

    const [updatedVehicle] = await vehicleRepository.updateStatus({
      vehicleId,
      status: VehicleStatusEnum.INACTIVE,
    })
    if (!updatedVehicle) {
      console.error(`Vehicle could not be inactivated: ${vehicleId}`)
      return
    }
    return updatedVehicle
  },
}

function getDefaultCapacityByVehicleType(type: VehicleTypesEnum) {
  switch (type) {
    case VehicleTypesEnum.BIKE:
      return 1
    case VehicleTypesEnum.BUS:
      return 30
    case VehicleTypesEnum.CAR:
    default:
      return 4
  }
}

export type FindDashboardVehiclesType = Awaited<
  ReturnType<typeof vehicleServices.findDashboardVehicles>
>

export type FindVehiclesByAgencyType = Awaited<
  ReturnType<typeof vehicleServices.findVehiclesByAgency>
>

export type FindExistingVehiclesInAgencyType = Awaited<
  ReturnType<typeof vehicleServices.findExistingVehiclesInAgency>
>

export type FindVehiclesScheduleNextDaysType = Awaited<
  ReturnType<typeof vehicleServices.findVehiclesScheduleNextDays>
>

export type FindVehicleDetailsByIdType = Awaited<
  ReturnType<typeof vehicleServices.findVehicleDetailsById>
>

export type FindAllVehicleRepairsByVehicleIdType = Awaited<
  ReturnType<typeof vehicleServices.findAllVehicleRepairsByVehicleId>
>

export type FindVehicleRepairByIdType = Awaited<
  ReturnType<typeof vehicleServices.findVehicleRepairById>
>

export type FindVehicleAssignedBookingsByIdType = Awaited<
  ReturnType<typeof vehicleServices.findVehicleAssignedBookingsById>
>

export type FindVehicleCompletedBookingsByIdType = Awaited<
  ReturnType<typeof vehicleServices.findVehicleCompletedBookingsById>
>

export type FindAssignedVehicleByDriverIdType = Awaited<
  ReturnType<typeof vehicleServices.findAssignedVehicleByDriverId>
>
