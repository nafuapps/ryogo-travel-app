import {
  DriverStatusEnum,
  InsertDriverType,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { driverRepository } from "../repositories/driver.repo"
import { driverLeaveRepository } from "../repositories/driverLeave.repo"
import { CreateDriverType } from "../types/driver.types"
import {
  NewDriverRequestType,
  NewDriverResponseType,
} from "../types/driver.types"
import { userServices } from "./user.services"
import { bookingRepository } from "../repositories/booking.repo"

export const driverServices = {
  //Get all drivers in an agency
  async findDriversByAgency(agencyId: string) {
    const drivers =
      await driverRepository.readAllDriversDataByAgencyId(agencyId)
    return drivers
  },

  //Get onTrip drivers data
  async findDriversOnTrip(agencyId: string) {
    const drivers =
      await driverRepository.readOnTripDriversDataByAgencyId(agencyId)
    return drivers
  },

  //Get drivers schedule
  async findDriversScheduleNextDays(agencyId: string, days: number = 7) {
    //Day today
    const startDate = new Date()
    //Day N days later
    const endDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
    const driversScheduleData = await driverRepository.readDriversScheduleData(
      agencyId,
      startDate,
      endDate,
    )

    return driversScheduleData
  },

  //Get driver details
  async findDriverDetailsById(id: string) {
    const driver = await driverRepository.readDriverById(id)
    if (!driver) {
      throw new Error("Driver not found")
    }
    return driver
  },

  //Get driver's assigned bookings
  async findDriverAssignedBookingsById(id: string, days: number = 1) {
    //Day today
    const startDate = new Date()
    //Day N days later
    const endDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
    const bookings = await bookingRepository.readAssignedBookingsByDriverId(
      id,
      startDate,
      endDate,
    )

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
      }
    })
  },

  //Get driver's completed bookings
  async findDriverCompletedBookingsById(id: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000,
    )
    //Day today
    const endDate = new Date()
    const bookings = await bookingRepository.readCompletedBookingsByDriverId(
      id,
      startDate,
      endDate,
    )

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

  //Get all driver leaves by driverId
  async findAllDriverLeavesByDriverId(id: string) {
    const leaves = await driverLeaveRepository.readDriverLeavesByDriverId(id)
    return leaves
  },

  //Get driver leave by id
  async findDriverLeaveById(id: string) {
    return await driverLeaveRepository.readLeaveById(id)
  },

  //Create driver
  async addDriver(data: CreateDriverType) {
    //Step1: Check if driver (userId) already exists in the system
    const existingDriverUser = await driverRepository.readDriverByUserId(
      data.userId,
    )
    if (existingDriverUser.length > 0) {
      throw new Error("Driver with same userId already exists ")
    }

    //Step2: Prepare vehicle types
    const input = data.canDriveVehicleTypes.map((x) => {
      return x.toLowerCase()
    })
    const canDrive = Object.values(VehicleTypesEnum).filter((x) =>
      input.includes(x.toString().toLowerCase() as string),
    )

    //Step3: Prepare driver data
    const newDriverData: InsertDriverType = {
      agencyId: data.agencyId,
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      address: data.address,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: new Date(data.licenseExpiresOn),
      defaultAllowancePerDay: data.defaultAllowancePerDay,
      canDriveVehicleTypes: canDrive,
    }
    const newDriver = await driverRepository.createDriver(newDriverData)
    if (newDriver.length < 1) {
      throw new Error("Failed to create driver")
    }
    return newDriver[0]
  },

  //Add a new driver to an agency
  async addNewDriver({
    agencyId,
    data,
  }: NewDriverRequestType): Promise<NewDriverResponseType> {
    const newDriver = userServices.addDriverUser({ agencyId, data })
    return newDriver
  },

  //Upload driver license photo
  async updateDriverLicensePhoto(driverId: string, licenseUrl?: string) {
    const updatedDriver = await driverRepository.updateDriverLicenseUrl(
      driverId,
      licenseUrl,
    )
    if (!updatedDriver || updatedDriver.length < 1) {
      throw new Error("Failed to update license url for this driver")
    }
    return updatedDriver[0]
  },

  //Activate Driver
  async activateDriver(id: string) {
    const driver = await driverRepository.updateStatus(
      id,
      DriverStatusEnum.AVAILABLE,
    )
    return driver[0]
  },

  //Inctivate Driver
  async inactivateDriver(id: string) {
    const driver = await driverRepository.updateStatus(
      id,
      DriverStatusEnum.INACTIVE,
    )
    return driver[0]
  },
}

export type FindDriversByAgencyType = Awaited<
  ReturnType<typeof driverServices.findDriversByAgency>
>

export type FindDriversOnTripType = Awaited<
  ReturnType<typeof driverServices.findDriversOnTrip>
>

export type FindDriversScheduleNextDaysType = Awaited<
  ReturnType<typeof driverServices.findDriversScheduleNextDays>
>

export type FindDriverDetailsByIdType = Awaited<
  ReturnType<typeof driverServices.findDriverDetailsById>
>

export type FindAllDriverLeavesByDriverIdType = Awaited<
  ReturnType<typeof driverServices.findAllDriverLeavesByDriverId>
>

export type FindDriverLeaveByIdType = Awaited<
  ReturnType<typeof driverServices.findDriverLeaveById>
>

export type FindDriverAssignedBookingsByIdType = Awaited<
  ReturnType<typeof driverServices.findDriverAssignedBookingsById>
>
export type FindDriverCompletedBookingsByIdType = Awaited<
  ReturnType<typeof driverServices.findDriverCompletedBookingsById>
>
