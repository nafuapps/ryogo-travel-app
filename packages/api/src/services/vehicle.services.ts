import { vehicleRepository } from "../repositories/vehicle.repo"
import { vehicleRepairRepository } from "../repositories/vehicleRepair.repo"
import {
  InsertVehicleRepairType,
  InsertVehicleType,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import {
  AddVehicleRequestType,
  ModifyVehicleRequestType,
} from "../types/vehicle.types"
import { bookingRepository } from "../repositories/booking.repo"
import { addDays } from "date-fns"
import { ModifyVehicleRepairRequestType } from "../types/vehicleRepair.types"

export const vehicleServices = {
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

  //Get onTrip vehicles data
  async findVehiclesOnTrip(agencyId: string) {
    const vehicles =
      await vehicleRepository.readOnTripVehiclesDataByAgencyId(agencyId)
    return vehicles
  },

  //Get vehicles schedule
  async findVehiclesScheduleNextDays(agencyId: string, days: number = 7) {
    const endDate = addDays(new Date(), days)

    const vehiclesScheduleData =
      await vehicleRepository.readVehiclesScheduleData(agencyId, endDate)

    return vehiclesScheduleData
  },

  //Get vehicle details
  async findVehicleDetailsById(vehicleId: string) {
    const vehicle = await vehicleRepository.readVehicleById(vehicleId)
    return vehicle
  },

  //Get vehicle's assigned bookings
  async findVehicleAssignedBookingsById(vehicleId: string) {
    const bookings =
      await bookingRepository.readAllAssignedBookingsByVehicleId(vehicleId)

    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source.city + " - " + booking.destination.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer.name,
        bookingId: booking.id,
        startDate: booking.startDate,
        startTime: booking.startTime,
        endDate: booking.endDate,
        status: booking.tripLogs[0]?.type,
      }
    })
  },

  //Get vehicle's completed bookings
  async findVehicleCompletedBookingsById(vehicleId: string) {
    const bookings =
      await bookingRepository.readCompletedBookingsByVehicleId(vehicleId)

    return bookings.map((booking) => {
      return {
        status: booking.status.toString(),
        updatedAt: booking.completedAt ?? booking.updatedAt,
        type: booking.type.toString(),
        route: booking.source.city + " - " + booking.destination.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer.name,
        bookingId: booking.id,
        createdAt: booking.tripLogs[0]?.createdAt,
      }
    })
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
  async findAllVehicleRepairsByVehicleId(vehicleId: string) {
    const repairs =
      await vehicleRepairRepository.readVehicleRepairsByVehicleId(vehicleId)
    return repairs
  },

  //Get vehicle repair by id
  async findVehicleRepairById(repairId: string) {
    return await vehicleRepairRepository.readRepairById(repairId)
  },

  //Add vehicle to agency
  async addVehicle({ data, agencyId }: AddVehicleRequestType) {
    //Step1: Check if the vehicle already exists in this agency
    const existingVehicleInAgency =
      await vehicleRepository.readVehicleByNumberInAgency(
        data.vehicleNumber.toUpperCase(),
        agencyId,
      )
    if (existingVehicleInAgency) {
      return
    }

    const newVehicleData: InsertVehicleType = {
      agencyId: agencyId,
      vehicleNumber: data.vehicleNumber.toUpperCase(),
      type: data.type,
      brand: data.brand,
      color: data.color,
      model: data.model,
      capacity: data.capacity,
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
    const newVehicle = await vehicleRepository.createVehicle(newVehicleData)
    return newVehicle[0]
  },

  //Add vehicle repair
  async addVehicleRepair(data: InsertVehicleRepairType) {
    const vehicle = await vehicleRepository.readVehicleById(data.vehicleId)
    if (!vehicle) return

    const repair = await vehicleRepairRepository.createRepair(data)
    if (!repair[0]) return

    return { ...repair[0], vehicleNumber: vehicle.vehicleNumber }
  },

  //Modify vehicle repair
  async modifyVehicleRepair(data: ModifyVehicleRepairRequestType) {
    const repair = await vehicleRepairRepository.updateRepair(
      data.repairId,
      data.startDate,
      data.endDate,
      data.isCompleted,
      data.remarks ?? undefined,
      data.cost ?? undefined,
    )
    if (!repair[0]) return

    const vehicle = await vehicleRepository.readVehicleById(repair[0].vehicleId)
    if (!vehicle) return

    return { ...repair[0], vehicleNumber: vehicle.vehicleNumber }
  },

  //Modify vehicle details
  async modifyVehicle(
    vehicleId: string,
    data: ModifyVehicleRequestType,
    rcPhotoUrl?: string,
    pucPhotoUrl?: string,
    insurancePhotoUrl?: string,
  ) {
    const vehicle = await vehicleRepository.updateVehicle(
      vehicleId,
      data.type,
      data.brand,
      data.color,
      data.model,
      data.capacity,
      data.odometerReading,
      data.rcExpiresOn,
      data.pucExpiresOn,
      data.insuranceExpiresOn,
      data.hasAC,
      data.defaultRatePerKm,
      data.defaultAcChargePerDay,
      rcPhotoUrl,
      pucPhotoUrl,
      insurancePhotoUrl,
    )
    return vehicle[0]
  },

  //Update Vehicle doc URL
  async renewVehicleDocURLs(
    vehicleId: string,
    rcUrl?: string,
    pucUrl?: string,
    insuranceURL?: string,
    vehiclePhotoUrl?: string,
  ) {
    await vehicleRepository.updateDocUrls(
      vehicleId,
      rcUrl,
      pucUrl,
      insuranceURL,
      vehiclePhotoUrl,
    )
  },

  //Update Vehicle photo URL
  async renewVehiclePhotoURL(vehicleId: string, url: string) {
    const updatedVehicle = await vehicleRepository.updateVehiclePhotoUrl(
      vehicleId,
      url,
    )
    return updatedVehicle[0]
  },

  //Activate Vehicle
  async activateVehicle(vehicleId: string) {
    const vehicle = await vehicleRepository.updateStatus(
      vehicleId,
      VehicleStatusEnum.AVAILABLE,
    )
    return vehicle[0]
  },

  //Inctivate Vehicle
  async inactivateVehicle(vehicleId: string) {
    const vehicle = await vehicleRepository.updateStatus(
      vehicleId,
      VehicleStatusEnum.INACTIVE,
    )
    return vehicle[0]
  },
}

export type FindVehiclesByAgencyType = Awaited<
  ReturnType<typeof vehicleServices.findVehiclesByAgency>
>

export type FindExistingVehiclesInAgencyType = Awaited<
  ReturnType<typeof vehicleServices.findExistingVehiclesInAgency>
>

export type FindVehiclesOnTripType = Awaited<
  ReturnType<typeof vehicleServices.findVehiclesOnTrip>
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
