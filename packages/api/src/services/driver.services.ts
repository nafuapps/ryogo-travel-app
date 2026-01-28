import {
  DriverStatusEnum,
  InsertDriverLeaveType,
  InsertDriverType,
  UserStatusEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { driverRepository } from "../repositories/driver.repo"
import { driverLeaveRepository } from "../repositories/driverLeave.repo"
import { bookingRepository } from "../repositories/booking.repo"
import { userRepository } from "../repositories/user.repo"
import { expenseRepository } from "../repositories/expense.repo"
import { tripLogRepository } from "../repositories/tripLog.repo"

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
  async findDriverAssignedBookingsById(id: string) {
    const bookings = await bookingRepository.readAssignedBookingsByDriverId(id)

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

  //Get driver's completed bookings
  async findDriverCompletedBookingsById(id: string) {
    const bookings = await bookingRepository.readCompletedBookingsByDriverId(id)

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

  //Get driver by user id
  async findDriverByUserId(userId: string) {
    const driver = await driverRepository.readDriverByUserId(userId)
    return driver
  },

  //Get driver's activity
  async findDriverActivityByUserId(userId: string) {
    //Get expenses
    const expenses = await expenseRepository.readExpensesByAddedUserId(userId)

    //Get trip logs
    const driver = await driverRepository.readDriverByUserId(userId)
    if (!driver) {
      throw new Error("Driver with same userId already exists ")
    }
    const tripLogs = await tripLogRepository.readTripLogsByDriverId(driver!.id)

    return {
      expenses,
      tripLogs,
    }
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
  async addDriver(data: InsertDriverType) {
    //Step1: Check if driver (userId) already exists in the system
    const existingDriverUser = await driverRepository.readDriverByUserId(
      data.userId,
    )
    if (existingDriverUser) {
      throw new Error("Driver with same userId already exists ")
    }

    //Step2: Prepare driver data
    const newDriverData: InsertDriverType = {
      agencyId: data.agencyId,
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      address: data.address,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: data.licenseExpiresOn,
      defaultAllowancePerDay: data.defaultAllowancePerDay,
      canDriveVehicleTypes: data.canDriveVehicleTypes,
    }
    const newDriver = await driverRepository.createDriver(newDriverData)
    if (newDriver.length < 1) {
      throw new Error("Failed to create driver")
    }
    return newDriver[0]
  },

  //Modify driver details
  async modifyDriver(
    id: string,
    address?: string,
    canDriveVehicleTypes?: VehicleTypesEnum[],
    defaultAllowancePerDay?: number,
    licenseNumber?: string,
    licenseExpiresOn?: Date,
    licensePhotoUrl?: string,
  ) {
    const driver = await driverRepository.updateDriver(
      id,
      address,
      canDriveVehicleTypes,
      defaultAllowancePerDay,
      licenseNumber,
      licenseExpiresOn,
      licensePhotoUrl,
    )
    return driver
  },

  //Add driver leave
  async addDriverLeave(data: InsertDriverLeaveType) {
    const leave = await driverLeaveRepository.createLeave(data)
    return leave
  },

  //Modify driver leave
  async modifyDriverLeave(id: string, data: Partial<InsertDriverLeaveType>) {
    const leave = await driverLeaveRepository.updateLeave(
      id,
      data.startDate,
      data.endDate,
      data.isCompleted,
      data.remarks ?? undefined,
    )
    return leave
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
  async activateDriver(id: string, userId: string) {
    //Cannot activate if the corresponding user is inactive
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.INACTIVE) {
      throw new Error("Cannot activate driver. User is inactive")
    }
    const driver = await driverRepository.updateStatus(
      id,
      DriverStatusEnum.AVAILABLE,
    )
    return driver[0]
  },

  //Inactivate Driver
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

export type FindDriverActivityByUserIdType = Awaited<
  ReturnType<typeof driverServices.findDriverActivityByUserId>
>

export type FindDriverByUserIdType = Awaited<
  ReturnType<typeof driverServices.findDriverByUserId>
>
