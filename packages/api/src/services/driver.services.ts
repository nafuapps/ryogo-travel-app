import {
  DriverLeaveStatusEnum,
  DriverStatusEnum,
  InsertDriverLeaveType,
  InsertDriverType,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { addDays, subDays } from "date-fns"
import { BASIC_SEARCH_LIMIT_DAYS } from "../apiConfig"
import { bookingRepository } from "../repositories/booking.repo"
import { driverRepository } from "../repositories/driver.repo"
import { driverLeaveRepository } from "../repositories/driverLeave.repo"
import { userRepository } from "../repositories/user.repo"
import {
  ChangeDriverLicenseRequestType,
  ModifyDriverRequestType,
} from "../types/driver.types"
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

  //Get drivers schedule
  async findDriversScheduleNextDays(agencyId: string, days: number = 7) {
    const queryEndDate = addDays(new Date(), days)

    const driversScheduleData = await driverRepository.readDriversScheduleData({
      agencyId,
      queryEndDate,
    })

    return driversScheduleData
  },

  //Get driver details
  async findDriverDetailsById(driverId: string) {
    const driver = await driverRepository.readDriverById(driverId)
    return driver
  },

  //Get driver's assigned bookings
  async findDriverAssignedBookingsById(
    driverId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryEndDate = addDays(new Date(), days)
    const bookings = await bookingRepository.readAllAssignedBookingsByDriverId({
      driverId,
      queryEndDate,
    })

    return bookings
  },

  //Get driver's completed bookings
  async findDriverCompletedBookingsById(
    driverId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryStartDate = subDays(new Date(), days)
    const bookings = await bookingRepository.readCompletedBookingsByDriverId({
      driverId,
      queryStartDate,
    })

    return bookings
  },

  //Get driver by user id
  async findDriverByUserId(userId: string) {
    const driver = await driverRepository.readDriverByUserId(userId)
    return driver
  },

  //Get all driver leaves by driverId
  async findAllDriverLeavesByDriverId(
    driverId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryStartDate = subDays(new Date(), days)
    const leaves = await driverLeaveRepository.readDriverLeavesByDriverId({
      driverId,
      queryStartDate,
    })
    return leaves
  },

  //Get driver leave by id
  async findDriverLeaveById(leaveId: string) {
    const leave = await driverLeaveRepository.readLeaveById(leaveId)
    return leave
  },

  //Create driver
  async addDriver(data: InsertDriverType) {
    const existingDriverUser = await driverRepository.readDriverByUserId(
      data.userId,
    )
    if (existingDriverUser) {
      console.error(`Driver with user Id already exists: ${data.userId}`)
      return
    }

    const [newDriver] = await driverRepository.createDriver(data)
    return newDriver
  },

  //Modify driver details
  async modifyDriver(data: ModifyDriverRequestType) {
    const driver = await driverRepository.readDriverById(data.id)
    if (!driver || driver.status === DriverStatusEnum.SUSPENDED) {
      console.error(`Driver not found or suspended: ${data.id}`)
      return
    }

    const [updatedDriver] = await driverRepository.updateDriverDetails(data)
    return updatedDriver
  },

  //Change driver license details
  async changeDriverLicense(data: ChangeDriverLicenseRequestType) {
    const driver = await driverRepository.readDriverById(data.id)
    if (!driver || driver.status === DriverStatusEnum.SUSPENDED) {
      console.error(`Driver not found or suspended: ${data.id}`)
      return
    }

    const [updatedDriver] =
      await driverRepository.updateDriverLicenseDetails(data)
    return updatedDriver
  },

  //Add driver leave
  async addDriverLeave(data: InsertDriverLeaveType) {
    const driver = await driverRepository.readDriverById(data.driverId)
    if (!driver || driver.status === DriverStatusEnum.SUSPENDED) {
      console.error(`Driver not found or suspended: ${data.driverId}`)
      return
    }

    const [leave] = await driverLeaveRepository.createLeave(data)
    if (!leave) {
      console.error(`Could not create driver leave: ${data}`)
      return
    }

    return { ...leave, driverName: driver.name }
  },

  //Modify driver leave
  async modifyDriverLeave(data: ModifyDriverLeaveRequestType) {
    const driver = await driverRepository.readDriverById(data.driverId)
    if (!driver || driver.status === DriverStatusEnum.SUSPENDED) {
      console.error(`Driver not found or suspended: ${data.driverId}`)
      return
    }

    const [leave] = await driverLeaveRepository.updateLeave(data)
    if (!leave) {
      console.error(`Could not update driver leave: ${data}`)
      return
    }

    return { ...leave, driverName: driver.name }
  },

  //Remove driver leave
  async removeDriverLeave(leaveId: string) {
    const [deletedLeave] = await driverLeaveRepository.deleteLeave(leaveId)
    return deletedLeave
  },

  //Start driver leave
  async startDriverLeave({
    leaveId,
    driverId,
  }: {
    leaveId: string
    driverId: string
  }) {
    const driver = await driverRepository.readDriverById(driverId)
    if (!driver || driver.status !== DriverStatusEnum.AVAILABLE) {
      console.error(
        `Driver not found or not available to start leave: ${driverId}`,
      )
      return
    }

    const leave = await driverLeaveRepository.readLeaveById(leaveId)
    if (!leave || leave.status !== DriverLeaveStatusEnum.PENDING) {
      console.error(`Driver leave not found or not pending: ${leaveId}`)
      return
    }

    const startedLeave = await driverLeaveRepository.updateLeaveToStarted({
      leaveId,
      driverId,
    })
    return startedLeave
  },

  //End driver leave
  async endDriverLeave({
    leaveId,
    driverId,
  }: {
    leaveId: string
    driverId: string
  }) {
    const driver = await driverRepository.readDriverById(driverId)
    if (!driver || driver.status !== DriverStatusEnum.LEAVE) {
      console.error(`Driver not found or not on leave to end: ${driverId}`)
      return
    }

    const leave = await driverLeaveRepository.readLeaveById(leaveId)
    if (!leave || leave.status !== DriverLeaveStatusEnum.ONGOING) {
      console.error(`Driver leave not found or not ongoing: ${leaveId}`)
      return
    }

    const endedLeave = await driverLeaveRepository.updateLeaveToEnded({
      leaveId,
      driverId,
    })
    return endedLeave
  },

  //Upload driver license photo
  async updateDriverLicensePhoto({
    driverId,
    licensePhotoUrl,
  }: {
    driverId: string
    licensePhotoUrl: string
  }) {
    const driver = await driverRepository.readDriverById(driverId)
    if (!driver || driver.status === DriverStatusEnum.SUSPENDED) {
      console.error(`Driver not found or suspended: ${driverId}`)
      return
    }

    await driverRepository.updateDriverLicenseUrl({ driverId, licensePhotoUrl })
  },

  //Activate Driver
  async activateDriver({
    driverId,
    userId,
  }: {
    driverId: string
    userId: string
  }) {
    //Cannot activate if the corresponding user is inactive or suspended
    const user = await userRepository.readUserById(userId)
    if (
      !user ||
      user.status === UserStatusEnum.INACTIVE ||
      user.status === UserStatusEnum.SUSPENDED
    ) {
      console.error(
        `Driver user not found or inactive or suspended: ${driverId} ${userId}`,
      )
      return
    }

    const driver = await driverRepository.readDriverById(driverId)
    if (
      !driver ||
      driver.status === DriverStatusEnum.SUSPENDED ||
      driver.status === DriverStatusEnum.AVAILABLE
    ) {
      console.error(
        `Driver not found or suspended or already available: ${driverId}`,
      )
      return
    }

    const [updatedDriver] = await driverRepository.updateStatus({
      driverId,
      status: DriverStatusEnum.AVAILABLE,
    })
    return updatedDriver
  },

  //Inactivate Driver
  async inactivateDriver({
    driverId,
    userId,
  }: {
    driverId: string
    userId: string
  }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`Driver user not found or suspended: ${driverId} ${userId}`)
      return
    }
    const driver = await driverRepository.readDriverById(driverId)
    if (
      !driver ||
      driver.status === DriverStatusEnum.SUSPENDED ||
      driver.status === DriverStatusEnum.INACTIVE
    ) {
      console.error(
        `Driver not found or suspended or already inactive: ${driverId}`,
      )
      return
    }

    const [updatedDriver] = await driverRepository.updateStatus({
      driverId,
      status: DriverStatusEnum.INACTIVE,
    })
    return updatedDriver
  },
}

export type FindDriversByAgencyType = Awaited<
  ReturnType<typeof driverServices.findDriversByAgency>
>

export type FindDashboardDriversType = Awaited<
  ReturnType<typeof driverServices.findDashboardDrivers>
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

export type FindDriverByUserIdType = Awaited<
  ReturnType<typeof driverServices.findDriverByUserId>
>
