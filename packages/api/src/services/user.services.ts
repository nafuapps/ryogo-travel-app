import {
  UserStatusEnum,
  UserRolesEnum,
  UserLangEnum,
  DriverStatusEnum,
  InsertAgencyType,
  InsertUserType,
  SubscriptionPlanEnum,
} from "@ryogo-travel-app/db/schema"
import bcrypt from "bcryptjs"
import { userRepository } from "../repositories/user.repo"
import { driverServices } from "./driver.services"
import {
  AddDriverRequestType,
  CreateOwnerAccountRequestType,
  AddAgentRequestType,
  AddOwnerRequestType,
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
import crypto from "crypto"
import { sessionRepository } from "../repositories/session.repo"
import { getSubscriptionExpirationDate } from "./agency.services"

const superPassword = process.env.SUPER_PASSWORD

async function generatePasswordHash(password: string) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

async function comparePassword(enteredPassword: string, dbPassword: string) {
  //Step2: Check password
  if (superPassword && superPassword === enteredPassword) {
    return true
  } else {
    return await bcrypt.compare(enteredPassword, dbPassword)
  }
}

function generateVerificationCode() {
  // Generates a random integer between 100,000 and 999,999 inclusive
  return crypto.randomInt(100000, 1000000).toString()
}

function generateNewPassword() {
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

  //Find login valid users by phone
  async findValidUsersByPhone(phone: string) {
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
  async findUserAssignedBookingsById(userId: string) {
    const bookings =
      await bookingRepository.readAssignedBookingsByUserId(userId)

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

  //Get user's completed bookings
  async findUserCompletedBookingsById(userId: string) {
    const bookings =
      await bookingRepository.readCompletedBookingsByUserId(userId)

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
      }
    })
  },

  //Get assigned user for a booking by driverId
  async findAssignedUserByDriverId(driverId: string) {
    let booking = await bookingRepository.readOngoingBookingByDriverId(driverId)

    if (!booking) {
      booking =
        await bookingRepository.readFirstAssignedBookingByDriverId(driverId)
      if (!booking) {
        return
      }
    }
    const assignedUser = userRepository.readUserById(booking.assignedUserId)
    return assignedUser
  },

  //Get user's activity
  async findUserActivityById(userId: string) {
    //Get added bookings
    const bookings = await bookingRepository.readBookingsByBookedUserId(userId)

    //Get added transactions
    const transactions =
      await transactionRepository.readTransactionsByAddedUserId(userId)

    //Get added expenses
    const expenses = await expenseRepository.readExpensesByAddedUserId(userId)

    //Get added customers
    const customers =
      await customerRepository.readCustomersByAddedUserId(userId)

    //Get added driver leaves
    const driverLeaves =
      await driverLeaveRepository.readDriverLeavesByAddedUserId(userId)

    //Get added vehicle repairs
    const vehicleRepairs =
      await vehicleRepairRepository.readVehicleRepairsByAddedUserId(userId)

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
    if (existingUsers) {
      return
    }

    //Step2: Check if another agency exists with same phone and email
    const existingAgencies = await agencyRepository.readAgencyByPhoneEmail(
      data.agency.businessPhone,
      data.agency.businessEmail,
    )
    if (existingAgencies) {
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

    //Step4: Create agency (Status New)
    const createAgencyData: InsertAgencyType = {
      businessEmail: data.agency.businessEmail,
      businessPhone: data.agency.businessPhone,
      businessName: data.agency.businessName,
      businessAddress: data.agency.businessAddress,
      locationId: location.id,
      subscriptionExpiresOn: getSubscriptionExpirationDate(),
      subscriptionPlan: data.agency.tryPremium
        ? SubscriptionPlanEnum.PREMIUM
        : SubscriptionPlanEnum.BASIC,
      hasTriedSubscription: data.agency.tryPremium,
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
      verificationCode: generateVerificationCode(),
      codeSentAt: new Date(),
      isAdmin: true, //This user is the creator of the agency
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
      code: owner[0].code,
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
    if (existingUserInAgency) {
      return
    }

    //Step2: Check if agent (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail(
      data.phone,
      [UserRolesEnum.AGENT],
      data.email,
    )
    if (existingUserInSystem) {
      return
    }

    //Step3: Generate a new password
    const newPassword = generateNewPassword()
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
      isAdmin: false,
    })
    if (!newUser[0]) {
      return
    }
    return {
      id: newUser[0].id,
      email: newUser[0].email,
      name: newUser[0].name,
      password: newPassword,
    }
  },

  //Add Owner (Premium flow - only admin can add owner)
  async addOwnerUser(
    { agencyId, data }: AddOwnerRequestType,
    currentUserId: string,
  ) {
    //Step0: If currentUser is not admin, return
    const currentUser = await userRepository.readUserById(currentUserId)
    if (
      !currentUser ||
      !currentUser.isAdmin ||
      currentUser.userRole !== UserRolesEnum.OWNER
    ) {
      return
    }
    //Step1: Check if owner with same phone already exists in this agency
    const existingUserInAgency =
      await userRepository.readUserByPhoneRolesAgencyId(
        agencyId,
        [UserRolesEnum.OWNER],
        data.phone,
      )
    if (existingUserInAgency) {
      return
    }

    //Step2: Check if owner (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail(
      data.phone,
      [UserRolesEnum.OWNER],
      data.email,
    )
    if (existingUserInSystem) {
      return
    }

    //Step3: Generate a new password
    const newPassword = generateNewPassword()
    const passwordHash = await generatePasswordHash(newPassword)

    //Step4: Create the owner user
    const newUser = await userRepository.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      userRole: UserRolesEnum.OWNER,
      status: UserStatusEnum.NEW,
      agencyId: agencyId,
      password: passwordHash,
      isAdmin: false,
    })
    if (!newUser[0]) {
      return
    }
    return {
      id: newUser[0].id,
      email: newUser[0].email,
      name: newUser[0].name,
      password: newPassword,
    }
  },

  async transferAdmin(
    currentUserId: string,
    otherUserId: string,
    agencyId: string,
  ) {
    if (currentUserId === otherUserId) return

    const currentUser = await userRepository.readUserById(currentUserId)
    if (
      !currentUser ||
      !currentUser.isAdmin ||
      currentUser.userRole !== UserRolesEnum.OWNER ||
      currentUser.agencyId !== agencyId
    ) {
      return
    }
    const otherUser = await userRepository.readUserById(currentUserId)
    if (
      !otherUser ||
      [UserStatusEnum.NEW, UserStatusEnum.SUSPENDED].includes(
        otherUser.status,
      ) ||
      otherUser.userRole !== UserRolesEnum.OWNER ||
      otherUser.agencyId !== agencyId
    ) {
      return
    }

    const updatedCurrentUser = await userRepository.updateAdmin(
      currentUserId,
      false,
    )
    if (!updatedCurrentUser[0]) {
      return
    }

    const updatedOtherUser = await userRepository.updateAdmin(otherUserId, true)
    if (!updatedOtherUser[0]) {
      return
    }

    return updatedOtherUser[0]
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
    if (existingUserInAgency) {
      return
    }

    //Step2: Check if driver user (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail(
      data.phone,
      [UserRolesEnum.DRIVER],
      data.email,
    )
    if (existingUserInSystem) {
      return
    }

    //Step3: generate a new password
    const newPassword = generateNewPassword()
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
      isAdmin: false,
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
      email: newUser[0].email,
      password: newPassword,
    }
  },

  //Validate user login with userId and password
  async checkUserCredentialsInDB(userId: string, password: string) {
    //Step1: Find user with userID
    const userFound = await userRepository.readUserWithPasswordById(userId)
    // If no user found, cannot login
    if (!userFound) {
      return {
        error: "userNotFound",
      }
    }

    if (userFound.status === UserStatusEnum.SUSPENDED) {
      return {
        error: "userSuspended",
      }
    }

    //Step2: Compare password
    const valid = await comparePassword(password, userFound.password)
    if (!valid) {
      return {
        error: "invalidPassword",
      }
    }

    //Step3: Update last login
    await userRepository.updateLastLogin(userFound.id, new Date())

    //Step4: Return user details
    return { data: userFound }
  },

  //Logout in DB
  async logOutInDB(userId: string, sessionId: string) {
    const sessionDeleted = await sessionRepository.deleteSession(sessionId)
    if (!sessionDeleted) {
      return
    }
    return await userRepository.updateLastLogout(userId, new Date())
  },

  //Reset user password (by owner - user details flow)
  async resetUserPassword(userId: string) {
    const user = await userRepository.readUserById(userId)
    // If no user found, cannot reset password
    if (!user) {
      return
    }

    //Generate a new password
    const newPassword = generateNewPassword()

    //Store new password in DB
    const passwordHash = await generatePasswordHash(newPassword)
    const newUserData = await userRepository.updatePassword(
      userId,
      passwordHash,
    )
    if (!newUserData[0]) {
      return
    }

    //Return user details for reset password confirmation mail
    return {
      id: newUserData[0].id,
      name: newUserData[0].name,
      password: newPassword,
      email: newUserData[0].email,
    }
  },

  //Verify and activate user and set new password
  async setNewPassword(userId: string, newPassword: string) {
    //Set a new password
    const passwordHash = await generatePasswordHash(newPassword)

    const newUserData =
      await userRepository.updatePasswordVerificationAndStatus(
        userId,
        passwordHash,
        UserStatusEnum.ACTIVE,
        true,
      )

    return newUserData[0]
  },

  //Change new password (by user - forgot password flow)
  async changeNewPassword(userId: string, newPassword: string) {
    //Step1: Find user with userID
    const userFound = await userRepository.readUserById(userId)
    // If no user found, cannot change password
    if (!userFound) {
      return
    }

    //Step2: Set a new password
    const passwordHash = await generatePasswordHash(newPassword)
    const newUserData = await userRepository.updatePassword(
      userId,
      passwordHash,
    )

    //Return userId as reset confirmation
    return newUserData[0]
  },

  // Change password (by user - account details flow)
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

    //Step2: Compare old password
    const valid = await comparePassword(oldPassword, userFound.password)
    if (!valid) {
      return
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

    //Step2: Compare password
    const valid = await comparePassword(password, userFound.password)
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
  async inactivateUser(userId: string, role: UserRolesEnum) {
    const user = await userRepository.updateUserStatus(
      userId,
      UserStatusEnum.INACTIVE,
    )
    if (role === UserRolesEnum.DRIVER) {
      await driverRepository.updateStatusByUserId(
        userId,
        DriverStatusEnum.INACTIVE,
      )
    }
    return user[0]
  },

  //Verify user with code
  async verifyUser(userId: string) {
    const verifiedUser = await userRepository.updateVerificationStatus(userId)
    return verifiedUser[0]
  },

  //Regenerate verification code
  async regenerateCode(userId: string) {
    const user = await userRepository.readUserById(userId)
    if (!user) return
    //Already verified - not need to regenerate code
    if (user.isVerified) {
      return
    }
    const updatedUser = await userRepository.updateVerificationCode(
      userId,
      generateVerificationCode(),
    )
    return updatedUser[0]
  },

  async generateAndSendCode(userId: string) {
    const user = await userRepository.readUserById(userId)
    if (!user) return
    const updatedUser = await userRepository.updateVerificationCode(
      userId,
      generateVerificationCode(),
    )
    return updatedUser[0]
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
  ReturnType<typeof userServices.findValidUsersByPhone>
>
