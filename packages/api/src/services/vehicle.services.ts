import { vehicleRepository } from "../repositories/vehicle.repo"
import { vehicleRepairRepository } from "../repositories/vehicleRepair.repo"
import {
  InsertVehicleRepairType,
  InsertVehicleType,
  VehicleStatusEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import {
  AddVehicleRequestType,
  ChangeVehicleDocumentRequestType,
  ModifyVehicleRequestType,
} from "../types/vehicle.types"
import { bookingRepository } from "../repositories/booking.repo"
import { addDays, subDays } from "date-fns"
import { ModifyVehicleRepairRequestType } from "../types/vehicleRepair.types"
import { BASIC_SEARCH_LIMIT_DAYS } from "../apiConfig"

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
    return await vehicleRepairRepository.readRepairById(repairId)
  },

  //Add vehicle to agency
  async addVehicle(data: AddVehicleRequestType) {
    //Step1: Check if the vehicle already exists in this agency
    const existingVehicleInAgency =
      await vehicleRepository.readVehicleByNumberInAgency({
        agencyId: data.agencyId,
        vehicleNumber: data.vehicleNumber.toUpperCase(),
      })
    if (existingVehicleInAgency) {
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
    return newVehicle
  },

  //Add vehicle repair
  async addVehicleRepair(data: InsertVehicleRepairType) {
    const vehicle = await vehicleRepository.readVehicleById(data.vehicleId)
    if (!vehicle) return

    const [repair] = await vehicleRepairRepository.createRepair(data)
    if (!repair) return

    return { ...repair, vehicleNumber: vehicle.vehicleNumber }
  },

  //Modify vehicle repair
  async modifyVehicleRepair(data: ModifyVehicleRepairRequestType) {
    const [repair] = await vehicleRepairRepository.updateRepairDetails(data)
    if (!repair) return

    const vehicle = await vehicleRepository.readVehicleById(repair.vehicleId)
    if (!vehicle) return

    return { ...repair, vehicleNumber: vehicle.vehicleNumber }
  },

  //Remove vehicle repair
  async removeVehicleRepair(repairId: string) {
    const [deletedRepair] = await vehicleRepairRepository.deleteRepair(repairId)
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
    if (!vehicle || vehicle.status !== VehicleStatusEnum.AVAILABLE) return

    const updatedVehicle = await vehicleRepository.updateStatus({
      vehicleId,
      status: VehicleStatusEnum.REPAIR,
    })
    if (!updatedVehicle) return

    const [repair] =
      await vehicleRepairRepository.updateRepairToStarted(repairId)
    return repair
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
    if (!vehicle || vehicle.status !== VehicleStatusEnum.REPAIR) return

    const updatedVehicle = await vehicleRepository.updateStatus({
      vehicleId,
      status: VehicleStatusEnum.AVAILABLE,
    })
    if (!updatedVehicle) return

    const [repair] = await vehicleRepairRepository.updateRepairToEnded(repairId)
    return repair
  },

  //Change vehicle number
  async changeVehicleNumber({
    vehicleId,
    vehicleNumber,
  }: {
    vehicleId: string
    vehicleNumber: string
  }) {
    const [vehicle] = await vehicleRepository.updateVehicleNumber({
      vehicleId,
      vehicleNumber,
    })
    return vehicle
  },

  //Modify vehicle details
  async modifyVehicle(data: ModifyVehicleRequestType) {
    const [vehicle] = await vehicleRepository.updateVehicleDetails(data)
    return vehicle
  },

  //Update Vehicle doc URL
  async renewVehicleDocURLs({
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
    if (data.type === "rc") {
      const [updatedVehicle] = await vehicleRepository.updateRCDetails({
        vehicleId: data.vehicleId,
        rcExpiresOn: data.expiresOn,
        rcPhotoUrl: photoUrl,
      })
      return updatedVehicle
    }
    if (data.type === "puc") {
      const [updatedVehicle] = await vehicleRepository.updatePUCDetails({
        vehicleId: data.vehicleId,
        pucExpiresOn: data.expiresOn,
        pucPhotoUrl: photoUrl,
      })
      return updatedVehicle
    }
    const [updatedVehicle] = await vehicleRepository.updateInsuranceDetails({
      vehicleId: data.vehicleId,
      insuranceExpiresOn: data.expiresOn,
      insurancePhotoUrl: photoUrl,
    })
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
    return updatedVehicle
  },

  //Activate Vehicle
  async activateVehicle(vehicleId: string) {
    const [vehicle] = await vehicleRepository.updateStatus({
      vehicleId,
      status: VehicleStatusEnum.AVAILABLE,
    })
    return vehicle
  },

  //Inctivate Vehicle
  async inactivateVehicle(vehicleId: string) {
    const [vehicle] = await vehicleRepository.updateStatus({
      vehicleId,
      status: VehicleStatusEnum.INACTIVE,
    })
    return vehicle
  },
}

function getDefaultCapacityByVehicleType(type: VehicleTypesEnum) {
  switch (type) {
    case VehicleTypesEnum.BIKE:
      return 1
    case VehicleTypesEnum.CAR:
      return 4
    case VehicleTypesEnum.BUS:
      return 30
    default:
      return
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
