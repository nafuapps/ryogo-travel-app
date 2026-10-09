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
import {
  ModifyDriverRequestType,
  ChangeDriverLicenseRequestType,
} from "../types/driver.types"
import { addDays, subDays } from "date-fns"
import { ModifyDriverLeaveRequestType } from "../types/driverLeave.types"
import { BASIC_SEARCH_LIMIT_DAYS } from "../apiConfig"

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
      addedByUserId: data.addedByUserId,
      name: data.name,
      phone: data.phone,
      address: data.address,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: data.licenseExpiresOn,
      defaultAllowancePerDay: data.defaultAllowancePerDay,
      canDriveVehicleTypes: data.canDriveVehicleTypes,
    }
    const [newDriver] = await driverRepository.createDriver(newDriverData)
    return newDriver
  },

  //Modify driver details
  async modifyDriver(data: ModifyDriverRequestType) {
    const [driver] = await driverRepository.updateDriverDetails(data)
    return driver
  },

  //Change driver license details
  async changeDriverLicense(
    data: ChangeDriverLicenseRequestType,
    licensePhotoUrl?: string,
  ) {
    const [driver] = await driverRepository.updateDriverLicenseDetails({
      ...data,
      licensePhotoUrl,
    })
    return driver
  },

  //Add driver leave
  async addDriverLeave(data: InsertDriverLeaveType) {
    const driver = await driverRepository.readDriverById(data.driverId)
    if (!driver) {
      return
    }

    const [leave] = await driverLeaveRepository.createLeave(data)
    if (!leave) return

    return { ...leave, driverName: driver.name }
  },

  //Modify driver leave
  async modifyDriverLeave(data: ModifyDriverLeaveRequestType) {
    const [leave] = await driverLeaveRepository.updateLeave(data)
    if (!leave) return
    const driver = await driverRepository.readDriverById(leave.driverId)
    if (!driver) return
    return { ...leave, driverName: driver?.name }
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
    if (!driver || driver.status !== DriverStatusEnum.AVAILABLE) return

    const updatedDriver = await driverRepository.updateStatus({
      driverId,
      status: DriverStatusEnum.LEAVE,
    })
    if (!updatedDriver) return

    const [leave] = await driverLeaveRepository.updateLeaveToStarted(leaveId)
    if (!leave) return
    return { ...leave, driverUserId: driver.userId, driverName: driver.name }
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
    if (!driver || driver.status !== DriverStatusEnum.LEAVE) return

    const updatedDriver = await driverRepository.updateStatus({
      driverId,
      status: DriverStatusEnum.AVAILABLE,
    })
    if (!updatedDriver) return

    const [leave] = await driverLeaveRepository.updateLeaveToEnded(leaveId)
    if (!leave) return
    return { ...leave, driverName: driver.name }
  },

  //Upload driver license photo
  async updateDriverLicensePhoto({
    driverId,
    licensePhotoUrl,
  }: {
    driverId: string
    licensePhotoUrl: string
  }) {
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
    //Cannot activate if the corresponding user is inactive
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.INACTIVE) {
      return
    }
    const [driver] = await driverRepository.updateStatus({
      driverId,
      status: DriverStatusEnum.AVAILABLE,
    })
    return driver
  },

  //Inactivate Driver
  async inactivateDriver(driverId: string) {
    const [driver] = await driverRepository.updateStatus({
      driverId,
      status: DriverStatusEnum.INACTIVE,
    })
    return driver
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
