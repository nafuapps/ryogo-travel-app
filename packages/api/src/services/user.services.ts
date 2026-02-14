import {
  UserStatusEnum,
  UserRolesEnum,
  UserLangEnum,
  DriverStatusEnum,
  InsertAgencyType,
  InsertUserType,
} from "@ryogo-travel-app/db/schema"
import bcrypt from "bcryptjs"
import { userRepository } from "../repositories/user.repo"
import { driverServices } from "./driver.services"
import {
  AddDriverRequestType,
  CreateOwnerAccountRequestType,
  AddAgentRequestType,
} from "../types/user.types"
import { driverRepository } from "../repositories/driver.repo"
import { bookingRepository } from "../repositories/booking.repo"
import { expenseRepository } from "../repositories/expense.repo"
import { customerRepository } from "../repositories/customer.repo"
import { driverLeaveRepository } from "../repositories/driverLeave.repo"
import { transactionRepository } from "../repositories/transaction.repo"
import { vehicleRepairRepository } from "../repositories/vehicleRepair.repo"
import { agencyRepository } from "../repositories/agency.repo"
import { locationRepository } from "../repositories/location.repo"

const TRIAL_DAYS = 30

export async function generatePasswordHash(password: string) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

export function generateNewPassword() {
  return Math.random().toString(36).slice(-8) //Generate a random 8 character password
}

export const userServices = {
  //Find all users by role
  async findAllUsersByRole(roles: UserRolesEnum[]) {
    return await userRepository.readAllUsersByRole(roles)
  },

  //Find all users in an agency
  async findAllUsersInAgency(agencyId: string) {
    return await userRepository.readAllUsersByAgency(agencyId)
  },

  //Find user account details
  async findUserDetailsById(userId: string) {
    const user = await userRepository.readUserById(userId)
    return user
  },

  //Find owner and agents by agencyId
  async findOwnerAndAgentsByAgency(agencyId: string) {
    const users =
      await userRepository.readAllDashboardUsersDataByAgencyId(agencyId)
    return users
  },

  //Find login users by phone
  async findUsersByPhone(phone: string) {
    const users = await userRepository.readUsersWithPhone(phone)
    return users
  },

  //Find user accounts by phone
  async findUserAccountsByPhone(phone: string) {
    const users = await userRepository.readUserAccountsByPhone(phone)
    if (!users) {
      return []
    }
    return users
  },

  //Find user accounts by phone and role
  async findUserAccountsByPhoneRole(phone: string, role: UserRolesEnum) {
    const users = await userRepository.readUserAccountsByPhoneRole(phone, role)
    return users
  },

  //Get user's assigned bookings
  async findUserAssignedBookingsById(id: string) {
    const bookings = await bookingRepository.readAssignedBookingsByUserId(id)

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

  //Get user's completed bookings
  async findUserCompletedBookingsById(id: string) {
    const bookings = await bookingRepository.readCompletedBookingsByUserId(id)

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

  //Get assigned user for a booking by driverId
  async findAssignedUserByDriverId(driverId: string) {
    const ongoingBooking =
      await bookingRepository.readOngoingBookingByDriverId(driverId)

    if (!ongoingBooking) {
      return
    }
    const assignedUser = userRepository.readUserById(
      ongoingBooking.assignedUserId,
    )
    return assignedUser
  },

  //Get user's activity
  async findUserActivityById(id: string) {
    //Get added bookings
    const bookings = await bookingRepository.readBookingsByBookedUserId(id)

    //Get added transactions
    const transactions =
      await transactionRepository.readTransactionsByAddedUserId(id)

    //Get added expenses
    const expenses = await expenseRepository.readExpensesByAddedUserId(id)

    //Get added customers
    const customers = await customerRepository.readCustomersByAddedUserId(id)

    //Get added driver leaves
    const driverLeaves =
      await driverLeaveRepository.readDriverLeavesByAddedUserId(id)

    //Get added vehicle repairs
    const vehicleRepairs =
      await vehicleRepairRepository.readVehicleRepairsByAddedUserId(id)

    return {
      bookings,
      transactions,
      expenses,
      customers,
      driverLeaves,
      vehicleRepairs,
    }
  },

  //Create Agency and Owner Account
  async addAgencyAndOwnerAccount(data: CreateOwnerAccountRequestType) {
    //Step1: Check if user already exists with this phone, email and role
    const existingUsers = await userRepository.readUserByPhoneRoleEmail(
      data.owner.phone,
      [UserRolesEnum.OWNER],
      data.owner.email,
    )
    if (existingUsers.length > 0) {
      return
    }

    //Step2: Check if another agency exists with same phone and email
    const existingAgencies = await agencyRepository.readAgencyByPhoneEmail(
      data.agency.businessPhone,
      data.agency.businessEmail,
    )
    if (existingAgencies.length > 0) {
      return
    }

    //Step3: Get location id from city, state
    const location = await locationRepository.readLocationByCityState(
      data.agency.agencyCity,
      data.agency.agencyState,
    )
    if (!location) {
      return
    }

    //Step4: Create agency (Trial subscription with 30 day expiry, Status New)
    const createAgencyData: InsertAgencyType = {
      businessEmail: data.agency.businessEmail,
      businessPhone: data.agency.businessPhone,
      businessName: data.agency.businessName,
      businessAddress: data.agency.businessAddress,
      locationId: location.id,
      subscriptionExpiresOn: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * TRIAL_DAYS,
      ),
      defaultCommissionRate: data.agency.commissionRate,
    }

    //Step5: Create new agency
    const newAgency = await agencyRepository.createAgency(createAgencyData)
    if (!newAgency[0]) {
      return
    }

    //Step6: Prepare owner data
    const passwordHash = await generatePasswordHash(data.owner.password)
    const ownerData: InsertUserType = {
      name: data.owner.name,
      email: data.owner.email,
      phone: data.owner.phone,
      agencyId: newAgency[0].id,
      userRole: UserRolesEnum.OWNER,
      status: UserStatusEnum.NEW,
      password: passwordHash,
    }

    //Step7: Create the owner user
    const owner = await userRepository.createUser(ownerData)
    if (!owner[0]) {
      return
    }

    return {
      agencyId: newAgency[0].id,
      userId: owner[0].id,
      password: data.owner.password,
      email: owner[0].email,
      name: owner[0].name,
    }
  },

  //Create Agent (Onboarding flow)
  async addAgentUser({ agencyId, data }: AddAgentRequestType) {
    //Step1: Check if agent with same phone already exists in this agency
    const existingUserInAgency =
      await userRepository.readUserByPhoneRolesAgencyId(
        agencyId,
        [UserRolesEnum.AGENT],
        data.phone,
      )
    if (existingUserInAgency.length > 0) {
      return
    }

    //Step2: Check if agent (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail(
      data.phone,
      [UserRolesEnum.AGENT],
      data.email,
    )
    if (existingUserInSystem.length > 0) {
      return
    }

    //Step3: Generate a new password
    const newPassword = generateNewPassword()
    console.log(newPassword)

    const passwordHash = await generatePasswordHash(newPassword)

    //Step4: Create the agent user
    const newUser = await userRepository.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      userRole: UserRolesEnum.AGENT,
      status: UserStatusEnum.NEW,
      agencyId: agencyId,
      password: passwordHash,
    })
    if (!newUser[0]) {
      return
    }
    return {
      id: newUser[0].id,
      password: newPassword,
      email: newUser[0].email,
      name: newUser[0].name,
    }
  },

  //Create Driver (Onboarding flow)
  async addDriverUser({ agencyId, data }: AddDriverRequestType) {
    //Step1: Check if driver user (phone) already exists in this agency
    const existingUserInAgency =
      await userRepository.readUserByPhoneRolesAgencyId(
        data.phone,
        [UserRolesEnum.DRIVER],
        agencyId,
      )
    if (existingUserInAgency.length > 0) {
      return
    }

    //Step2: Check if driver user (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail(
      data.phone,
      [UserRolesEnum.DRIVER],
      data.email,
    )
    if (existingUserInSystem.length > 0) {
      return
    }

    //Step3: generate a new password
    const newPassword = generateNewPassword() //Generate a random 8 character password
    console.log(newPassword)
    const passwordHash = await generatePasswordHash(newPassword)

    //Step4: Create the driver user
    const newUser = await userRepository.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      userRole: UserRolesEnum.DRIVER,
      status: UserStatusEnum.NEW,
      agencyId: agencyId,
      password: passwordHash,
    })
    if (!newUser[0]) {
      return
    }

    //Step5: Create a driver
    const newDriver = await driverServices.addDriver({
      agencyId: agencyId,
      userId: newUser[0].id,
      name: data.name,
      phone: data.phone,
      address: data.address,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: data.licenseExpiresOn,
      canDriveVehicleTypes: data.canDriveVehicleTypes,
      defaultAllowancePerDay: data.defaultAllowancePerDay,
    })
    if (!newDriver) {
      return
    }

    //Return driver Id
    return {
      id: newDriver.id,
      userId: newDriver.userId,
      name: newUser[0].name,
      password: newPassword,
      email: newUser[0].email,
    }
  },

  //Validate user login with userId and password
  async checkLoginInDB(userId: string, password: string) {
    //Step1: Find user with userID
    const userFound = await userRepository.readUserWithPasswordById(userId)
    // If no user found, cannot login
    if (!userFound) {
      return {
        error: "userNotFound",
      }
    }

    //Step2: Check password
    const valid = await bcrypt.compare(password, userFound.password)
    if (!valid) {
      return {
        error: "passwordNotMatching",
      }
    }
    //Step3: Update last login
    await userRepository.updateLastLogin(userFound.id, new Date())

    //Step4: Return user details
    return { data: userFound }
  },

  //Logout in DB
  async checkLogoutInDB(userId: string) {
    return await userRepository.updateLastLogout(userId, new Date())
  },

  //Reset user password (by owner)
  async resetUserPassword(userId: string) {
    //Step1: get email
    const emailFound = await userRepository.readUserById(userId)
    // If no user found, cannot reset password
    if (!emailFound) {
      return
    }

    //Step1: Generate a new password
    const newPassword = generateNewPassword()
    console.log(newPassword)

    //Step3: Store new password in DB
    const passwordHash = await generatePasswordHash(newPassword)
    const newUserData = await userRepository.updatePassword(
      userId,
      passwordHash,
    )
    if (!newUserData[0]) {
      return
    }

    //Return user details for reset password confirmation
    return {
      id: newUserData[0].id,
      name: newUserData[0].name,
      password: newPassword,
      email: newUserData[0].email,
    }
  },

  // Change password (by user)
  async changeMyPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    //Step1: Find user with userID
    const userFound = await userRepository.readUserWithPasswordById(userId)
    // If no user found, cannot change password
    if (!userFound) {
      return
    }

    //Step2: Match old password
    const valid = await bcrypt.compare(oldPassword, userFound.password)
    if (!valid) {
      return null
    }

    //Step3: Set a new password
    const passwordHash = await generatePasswordHash(newPassword)
    const newUserData = await userRepository.updatePassword(
      userId,
      passwordHash,
    )

    //Return userId as reset confirmation
    return newUserData[0]
  },

  //Update user photo url
  async updateUserPhoto(userId: string, url: string) {
    const updatedUser = await userRepository.updatePhotoUrl(userId, url)
    return updatedUser[0]
  },

  //Change user name
  async changeName(userId: string, name: string, role: UserRolesEnum) {
    const updatedUser = await userRepository.updateName(userId, name)
    if (role === UserRolesEnum.DRIVER) {
      await driverRepository.updateNameByUserId(userId, name)
    }
    return updatedUser[0]
  },

  //Change UserPreferences  url
  async changeUserPreferences(
    userId: string,
    prefersDarkTheme?: boolean,
    languagePref?: UserLangEnum,
  ) {
    const updatedUser = await userRepository.updateUserPreferences(
      userId,
      prefersDarkTheme,
      languagePref,
    )
    return updatedUser[0]
  },

  //Change self email
  async changeEmailWithPasswordConfirmation(
    userId: string,
    password: string,
    newEmail: string,
  ) {
    //Step1: Find user with userID
    const userFound = await userRepository.readUserWithPasswordById(userId)
    // If no user found, cannot change email
    if (!userFound) {
      return
    }

    //Step2: Match password
    const valid = await bcrypt.compare(password, userFound.password)
    if (!valid) {
      return
    }
    //Step3: Update email
    const updatedUser = await userRepository.updateEmail(userId, newEmail)
    return updatedUser[0]
  },

  //change user's email (by owner)
  async changeUserEmail(userId: string, newEmail: string) {
    const updatedUser = await userRepository.updateEmail(userId, newEmail)
    return updatedUser[0]
  },

  //change user's phone (by owner)
  async changeUserPhone(
    userId: string,
    newPhone: string,
    role?: UserRolesEnum,
  ) {
    const updatedUser = await userRepository.updatePhone(userId, newPhone)
    if (role === UserRolesEnum.DRIVER) {
      await driverRepository.updatePhoneByUserId(userId, newPhone)
    }
    return updatedUser[0]
  },

  //Activate user
  async activateUser(userId: string, role?: UserRolesEnum) {
    const user = await userRepository.updateUserStatus(
      userId,
      UserStatusEnum.ACTIVE,
    )
    if (role === UserRolesEnum.DRIVER) {
      await driverRepository.updateStatusByUserId(
        userId,
        DriverStatusEnum.AVAILABLE,
      )
    }
    return user[0]
  },

  //Inactivate User
  async inactivateUser(id: string, role: UserRolesEnum) {
    const user = await userRepository.updateUserStatus(
      id,
      UserStatusEnum.INACTIVE,
    )
    if (role === UserRolesEnum.DRIVER) {
      await driverRepository.updateStatusByUserId(id, DriverStatusEnum.INACTIVE)
    }
    return user[0]
  },
}

export type FindAllUsersInAgencyType = Awaited<
  ReturnType<typeof userServices.findAllUsersInAgency>
>

export type FindAllUsersByRoleType = Awaited<
  ReturnType<typeof userServices.findAllUsersByRole>
>

export type FindOwnerAndAgentsByAgencyType = Awaited<
  ReturnType<typeof userServices.findOwnerAndAgentsByAgency>
>

export type FindUserAccountsByPhoneType = Awaited<
  ReturnType<typeof userServices.findUserAccountsByPhone>
>

export type FindUserAccountsByPhoneRoleType = Awaited<
  ReturnType<typeof userServices.findUserAccountsByPhoneRole>
>

export type FindUserDetailsByIdType = Awaited<
  ReturnType<typeof userServices.findUserDetailsById>
>

export type FindUserAssignedBookingsByIdType = Awaited<
  ReturnType<typeof userServices.findUserAssignedBookingsById>
>

export type FindUserCompletedBookingsByIdType = Awaited<
  ReturnType<typeof userServices.findUserCompletedBookingsById>
>

export type FindUserActivityByIdType = Awaited<
  ReturnType<typeof userServices.findUserActivityById>
>

export type FindAssignedUserByDriverIdType = Awaited<
  ReturnType<typeof userServices.findAssignedUserByDriverId>
>

export type FindUsersByPhoneType = Awaited<
  ReturnType<typeof userServices.findUsersByPhone>
>
