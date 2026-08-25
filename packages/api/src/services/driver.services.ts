import {
  DriverStatusEnum,
  InsertDriverLeaveType,
  InsertDriverType,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { driverRepository } from "../repositories/driver.repo"
import { driverLeaveRepository } from "../repositories/driverLeave.repo"
import { bookingRepository } from "../repositories/booking.repo"
import { userRepository } from "../repositories/user.repo"
import { expenseRepository } from "../repositories/expense.repo"
import { tripLogRepository } from "../repositories/tripLog.repo"
import { ModifyDriverRequestType } from "../types/driver.types"
import { addDays } from "date-fns"
import { ModifyDriverLeaveRequestType } from "../types/driverLeave.types"

export const driverServices = {
  async findDashboardDrivers(agencyId: string) {
    const drivers = await driverRepository.readDriversByAgencyId(agencyId)
    return drivers
  },

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
    const endDate = addDays(new Date(), days)

    const driversScheduleData = await driverRepository.readDriversScheduleData(
      agencyId,
      endDate,
    )

    return driversScheduleData
  },

  //Get driver details
  async findDriverDetailsById(driverId: string) {
    const driver = await driverRepository.readDriverById(driverId)
    return driver
  },

  //Get driver's assigned bookings
  async findDriverAssignedBookingsById(driverId: string) {
    const bookings =
      await bookingRepository.readAllAssignedBookingsByDriverId(driverId)

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

  //Get driver's completed bookings
  async findDriverCompletedBookingsById(driverId: string) {
    const bookings =
      await bookingRepository.readCompletedBookingsByDriverId(driverId)

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

  //Get driver by user id
  async findDriverByUserId(userId: string) {
    const driver = await driverRepository.readDriverByUserId(userId)
    return driver
  },

  //Get driver's activity
  async findDriverActivityByUserId(userId: string, driverId: string) {
    //Get trip logs
    const tripLogs = await tripLogRepository.readTripLogsByDriverId(driverId)

    //Get expenses
    const expenses = await expenseRepository.readExpensesByAddedUserId(userId)

    return {
      expenses,
      tripLogs,
    }
  },

  //Get all driver leaves by driverId
  async findAllDriverLeavesByDriverId(driverId: string) {
    const leaves =
      await driverLeaveRepository.readDriverLeavesByDriverId(driverId)
    return leaves
  },

  //Get driver leave by id
  async findDriverLeaveById(leaveId: string) {
    return await driverLeaveRepository.readLeaveById(leaveId)
  },

  //Create driver
  async addDriver(data: InsertDriverType) {
    //Step1: Check if driver (userId) already exists in the system
    const existingDriverUser = await driverRepository.readDriverByUserId(
      data.userId,
    )
    if (existingDriverUser) {
      return
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
    return newDriver[0]
  },

  //Modify driver details
  async modifyDriver(data: ModifyDriverRequestType, licensePhotoUrl?: string) {
    const driver = await driverRepository.updateDriver(
      data.driverId,
      data.canDriveVehicleTypes,
      data.address,
      data.defaultAllowancePerDay,
      data.licenseNumber,
      data.licenseExpiresOn,
      licensePhotoUrl,
    )
    return driver[0]
  },

  //Add driver leave
  async addDriverLeave(data: InsertDriverLeaveType) {
    const driver = await driverRepository.readDriverById(data.driverId)
    if (!driver) {
      return
    }

    const leave = await driverLeaveRepository.createLeave(data)
    if (!leave[0]) return

    return { ...leave[0], driverName: driver.name }
  },

  //Modify driver leave
  async modifyDriverLeave(data: ModifyDriverLeaveRequestType) {
    const leave = await driverLeaveRepository.updateLeave(
      data.leaveId,
      data.startDate,
      data.endDate,
      data.isCompleted,
      data.remarks ?? undefined,
    )
    if (!leave[0]) return
    const driver = await driverRepository.readDriverById(leave[0].driverId)
    if (!driver) return
    return { ...leave[0], driverName: driver?.name }
  },

  //Upload driver license photo
  async updateDriverLicensePhoto(driverId: string, licenseUrl: string) {
    await driverRepository.updateDriverLicenseUrl(driverId, licenseUrl)
  },

  //Activate Driver
  async activateDriver(driverId: string, userId: string) {
    //Cannot activate if the corresponding user is inactive
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.INACTIVE) {
      return
    }
    const driver = await driverRepository.updateStatus(
      driverId,
      DriverStatusEnum.AVAILABLE,
    )
    return driver[0]
  },

  //Inactivate Driver
  async inactivateDriver(driverId: string) {
    const driver = await driverRepository.updateStatus(
      driverId,
      DriverStatusEnum.INACTIVE,
    )
    return driver[0]
  },
}

export type FindDriversByAgencyType = Awaited<
  ReturnType<typeof driverServices.findDriversByAgency>
>

export type FindDashboardDriversType = Awaited<
  ReturnType<typeof driverServices.findDashboardDrivers>
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
