import { vehicleRepository } from "../repositories/vehicle.repo"
import { vehicleRepairRepository } from "../repositories/vehicleRepair.repo"
import {
  InsertVehicleRepairType,
  InsertVehicleType,
  VehicleStatusEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { AddVehicleRequestType } from "../types/vehicle.types"
import { bookingRepository } from "../repositories/booking.repo"

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
    //Day today
    const startDate = new Date()
    //Day N days later
    const endDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
    const vehiclesScheduleData =
      await vehicleRepository.readVehiclesScheduleData(
        agencyId,
        startDate,
        endDate,
      )

    return vehiclesScheduleData
  },

  //Get vehicle details
  async findVehicleDetailsById(id: string) {
    const vehicle = await vehicleRepository.readVehicleById(id)
    return vehicle
  },

  //Get vehicle's assigned bookings
  async findVehicleAssignedBookingsById(id: string) {
    const bookings = await bookingRepository.readAssignedBookingsByVehicleId(id)

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
        status: booking.tripLogs[0]?.type.toString(),
      }
    })
  },

  //Get vehicle's completed bookings
  async findVehicleCompletedBookingsById(id: string) {
    const bookings =
      await bookingRepository.readCompletedBookingsByVehicleId(id)

    return bookings.map((booking) => {
      return {
        status: booking.status.toString(),
        updatedAt: booking.updatedAt,
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
    const ongoingBooking =
      await bookingRepository.readOngoingBookingByDriverId(driverId)

    if (!ongoingBooking || ongoingBooking.assignedVehicleId === null) {
      return
    }
    const assignedVehicle = vehicleRepository.readVehicleById(
      ongoingBooking.assignedVehicleId,
    )
    return assignedVehicle
  },

  //Get all vehicle repairs by vehicleId
  async findAllVehicleRepairsByVehicleId(id: string) {
    const repairs =
      await vehicleRepairRepository.readVehicleRepairsByVehicleId(id)
    return repairs
  },

  //Get vehicle repair by id
  async findVehicleRepairById(id: string) {
    return await vehicleRepairRepository.readRepairById(id)
  },

  //Add vehicle to agency
  async addVehicle({ data, agencyId }: AddVehicleRequestType) {
    //Step1: Check if the vehicle already exists in this agency
    const existingVehicleInAgency =
      await vehicleRepository.readVehicleByNumberInAgency(
        data.vehicleNumber,
        agencyId,
      )
    if (existingVehicleInAgency.length > 0) {
      return
    }

    const newVehicleData: InsertVehicleType = {
      agencyId: agencyId,
      vehicleNumber: data.vehicleNumber,
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
    const repair = await vehicleRepairRepository.createRepair(data)
    return repair[0]
  },

  //Modify vehicle repair
  async modifyVehicleRepair(
    id: string,
    data: Partial<InsertVehicleRepairType>,
  ) {
    const repair = await vehicleRepairRepository.updateRepair(
      id,
      data.startDate,
      data.endDate,
      data.isCompleted,
      data.remarks ?? undefined,
      data.cost ?? undefined,
    )
    return repair[0]
  },

  //Modify vehicle details
  async modifyVehicle(
    id: string,
    type?: VehicleTypesEnum,
    brand?: string,
    color?: string,
    model?: string,
    capacity?: number,
    odometerReading?: number,
    rcExpiresOn?: Date,
    insuranceExpiresOn?: Date,
    pucExpiresOn?: Date,
    defaultRatePerKm?: number,
    hasAC?: boolean,
    defaultAcChargePerDay?: number,
    rcPhotoUrl?: string,
    pucPhotoUrl?: string,
    insurancePhotoUrl?: string,
  ) {
    const vehicle = await vehicleRepository.updateVehicle(
      id,
      type,
      brand,
      color,
      model,
      capacity,
      odometerReading,
      rcExpiresOn,
      insuranceExpiresOn,
      pucExpiresOn,
      defaultRatePerKm,
      hasAC,
      defaultAcChargePerDay,
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
  async activateVehicle(id: string) {
    const vehicle = await vehicleRepository.updateStatus(
      id,
      VehicleStatusEnum.AVAILABLE,
    )
    return vehicle[0]
  },

  //Inctivate Vehicle
  async inactivateVehicle(id: string) {
    const vehicle = await vehicleRepository.updateStatus(
      id,
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
