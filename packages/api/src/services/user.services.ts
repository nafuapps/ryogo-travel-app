import {
  AgencyStatusEnum,
  DriverStatusEnum,
  InsertAgencyType,
  InsertDriverType,
  InsertSessionType,
  InsertUserType,
  SubscriptionPlanEnum,
  UserLangEnum,
  UserRolesEnum,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { addDays, differenceInMinutes, subDays } from "date-fns"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_AGENT_LIMIT,
  BASIC_PLAN_DRIVER_LIMIT,
  BASIC_SEARCH_LIMIT_DAYS,
  LOCATE_USER_MINUTES,
} from "../apiConfig"
import { agencyRepository } from "../repositories/agency.repo"
import { bookingRepository } from "../repositories/booking.repo"
import { driverRepository } from "../repositories/driver.repo"
import { locationRepository } from "../repositories/location.repo"
import { sessionRepository } from "../repositories/session.repo"
import { userRepository } from "../repositories/user.repo"
import {
  AddDriverRequestType,
  AddUserRequestType,
  CreateOwnerAccountRequestType,
} from "../types/user.types"
import { getSubscriptionExpirationDate } from "./agency.services"
import { driverServices } from "./driver.services"

const SUPER_PASSWORD = process.env.SUPER_PASSWORD
const SUPER_CODE = process.env.SUPER_CODE

async function generatePasswordHash(password: string) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

async function comparePassword({
  enteredPassword,
  dbPasswordHash,
}: {
  enteredPassword: string
  dbPasswordHash: string
}) {
  //Step2: Check password
  if (SUPER_PASSWORD && SUPER_PASSWORD === enteredPassword) {
    return true
  } else {
    return await bcrypt.compare(enteredPassword, dbPasswordHash)
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
    const users = await userRepository.readAllUsersByRole(roles)
    return users
  },

  //Find all users in an agency
  async findAllUsersInAgency(agencyId: string) {
    const users = await userRepository.readAllUsersByAgency(agencyId)
    return users
  },

  //Find user account details
  async findUserDetailsById(userId: string) {
    const user = await userRepository.readUserById(userId)
    return user
  },

  //Find user account details
  async findUserDetailsWithDriverById(userId: string) {
    const user = await userRepository.readUserWithDriverById(userId)
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
  async findUserAccountsByPhoneRole({
    phone,
    role,
  }: {
    phone: string
    role: UserRolesEnum
  }) {
    const users = await userRepository.readUserAccountsByPhoneRole({
      phone,
      role,
    })
    return users
  },

  //Get user's assigned bookings
  async findUserAssignedBookingsById(
    userId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryEndDate = addDays(new Date(), days)
    const bookings = await bookingRepository.readAssignedBookingsByUserId({
      userId,
      queryEndDate,
    })

    return bookings
  },

  //Get user's completed bookings
  async findUserCompletedBookingsById(
    userId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryStartDate = subDays(new Date(), days)
    const bookings = await bookingRepository.readCompletedBookingsByUserId({
      userId,
      queryStartDate,
    })

    return bookings
  },

  //Get assigned user for a booking by driverId
  async findAssignedUserByDriverId(driverId: string) {
    let booking = await bookingRepository.readOngoingBookingByDriverId(driverId)

    if (!booking) {
      booking =
        await bookingRepository.readFirstAssignedBookingByDriverId(driverId)
      if (!booking) {
        console.error(`No assigned booking found for the driver: ${driverId}`)
        return
      }
    }
    const assignedUser = await userRepository.readUserById(
      booking.assignedUserId,
    )
    if (!assignedUser) {
      console.error(`No assigned user found for the booking: ${booking.id}`)
      return
    }
    return {
      id: assignedUser.id,
      name: assignedUser.name,
      phone: assignedUser.phone,
      photoUrl: assignedUser.photoUrl,
    }
  },

  //Get user session by token
  async findUserSessionByToken(token: string) {
    const session = await sessionRepository.readSessionByToken(token)
    return session
  },

  //Create Agency and Owner Account
  async addAgencyAndOwnerAccount(data: CreateOwnerAccountRequestType) {
    //Step1: Check if user already exists with this phone, email and role
    const existingUsers = await userRepository.readUserByPhoneRoleEmail({
      phone: data.owner.phone,
      roles: [UserRolesEnum.OWNER],
      email: data.owner.email,
    })
    if (existingUsers) {
      console.error(
        `Existing owner user with phone and email: ${data.owner.phone} ${data.owner.email}`,
      )
      return
    }

    //Step2: Check if another agency exists with same phone and email
    const existingAgencies = await agencyRepository.readAgencyByPhoneEmail({
      businessPhone: data.agency.businessPhone,
      businessEmail: data.agency.businessEmail,
    })
    if (existingAgencies) {
      console.error(
        `Existing agency with phone and email: ${data.agency.businessPhone} ${data.agency.businessEmail}`,
      )
      return
    }

    //Step3: Get location id from city, state
    const location = await locationRepository.readLocationByCityState({
      city: data.agency.agencyCity,
      state: data.agency.agencyState,
    })
    if (!location) {
      console.error(
        `No location found for creating account: ${data.agency.agencyCity},${data.agency.agencyState}`,
      )
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
    const [newAgency] = await agencyRepository.createAgency(createAgencyData)
    if (!newAgency) {
      console.error(`Agency could not be created: ${createAgencyData}`)
      return
    }

    //Step6: Prepare owner data
    const passwordHash = await generatePasswordHash(data.owner.password)
    const ownerData: InsertUserType = {
      name: data.owner.name,
      email: data.owner.email,
      phone: data.owner.phone,
      agencyId: newAgency.id,
      userRole: UserRolesEnum.OWNER,
      status: UserStatusEnum.NEW,
      password: passwordHash,
      verificationCode: generateVerificationCode(),
      codeSentAt: new Date(),
      isAdmin: true, //This user is the creator of the agency
    }

    //Step7: Create the owner user
    const [owner] = await userRepository.createUser(ownerData)
    if (!owner) {
      console.error(`Owner acccount could not be created: ${ownerData}`)
      return
    }

    return {
      agencyId: newAgency.id,
      userId: owner.id,
      password: data.owner.password,
      email: owner.email,
      name: owner.name,
      verificationCode: owner.verificationCode,
    }
  },

  //Create Agent
  async addAgentUser(data: AddUserRequestType) {
    const agency = await agencyRepository.readAgencyById(data.agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency not found or suspended: ${data.agencyId}`)
      return
    }

    //SUBSCRIPTION CHECK: Check if basic plan has reached agent limit
    if (
      !APP_TRIAL_MODE &&
      (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
        agency.subscriptionExpiresOn < new Date())
    ) {
      const agents = await userRepository.readUserByRolesAgencyId({
        agencyId: data.agencyId,
        userRoles: [UserRolesEnum.AGENT],
      })
      if (agents.length >= BASIC_PLAN_AGENT_LIMIT) {
        console.error(
          `Basic plan limit reached for adding agents: ${data.agencyId}`,
        )
        return
      }
    }

    //Step1: Check if agent with same phone already exists in this agency
    const existingUserInAgency =
      await userRepository.readUserByPhoneRolesAgencyId({
        agencyId: data.agencyId,
        roles: [UserRolesEnum.AGENT],
        phone: data.phone,
      })
    if (existingUserInAgency) {
      console.error(
        `Existing agent with phone in agency: ${data.agencyId} ${data.phone}`,
      )
      return
    }

    //Step2: Check if agent (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail({
      phone: data.phone,
      roles: [UserRolesEnum.AGENT],
      email: data.email,
    })
    if (existingUserInSystem) {
      console.error(
        `Existing agent with phone and email in the system: ${data.phone} ${data.email}`,
      )
      return
    }

    //Step3: Generate a new password
    const newPassword = generateNewPassword()
    const passwordHash = await generatePasswordHash(newPassword)

    //Step4: Create the agent user
    const newUserData: InsertUserType = {
      agencyId: data.agencyId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      userRole: UserRolesEnum.AGENT,
      status: UserStatusEnum.NEW,
      password: passwordHash,
      isAdmin: false,
    }
    const [newUser] = await userRepository.createUser(newUserData)
    if (!newUser) {
      console.error(`Agent could not be created: ${newUserData}`)
      return
    }

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      password: newPassword,
    }
  },

  //Add Owner (Premium flow - only admin can add owner)
  async addOwnerUser({
    data,
    currentUserId,
  }: {
    data: AddUserRequestType
    currentUserId: string
  }) {
    //Step0: If currentUser is not admin, return
    const currentUser = await userRepository.readUserById(currentUserId)
    if (
      !currentUser ||
      !currentUser.isAdmin ||
      currentUser.userRole !== UserRolesEnum.OWNER
    ) {
      console.error(
        `Current User not found or is not admin or owner: ${currentUserId}`,
      )
      return
    }

    const agency = await agencyRepository.readAgencyById(data.agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency not found or suspended: ${data.agencyId}`)
      return
    }

    //SUBSCRIPTION CHECK: Only premium agency can add additional owners
    if (
      !APP_TRIAL_MODE &&
      (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
        agency.subscriptionExpiresOn < new Date())
    ) {
      console.error(`Basic plan cannot add owners: ${data.agencyId}`)
      return
    }

    //Step1: Check if owner with same phone already exists in this agency
    const existingUserInAgency =
      await userRepository.readUserByPhoneRolesAgencyId({
        agencyId: data.agencyId,
        roles: [UserRolesEnum.OWNER],
        phone: data.phone,
      })
    if (existingUserInAgency) {
      console.error(
        `Existing owner with same phone in agency: ${data.agencyId} ${data.phone}`,
      )
      return
    }

    //Step2: Check if owner (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail({
      phone: data.phone,
      roles: [UserRolesEnum.OWNER],
      email: data.email,
    })
    if (existingUserInSystem) {
      console.error(
        `Existing owner with same phone and email in the system: ${data.phone} ${data.email}`,
      )
      return
    }

    //Step3: Generate a new password
    const newPassword = generateNewPassword()
    const passwordHash = await generatePasswordHash(newPassword)

    //Step4: Create the owner user
    const newUserData: InsertUserType = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      userRole: UserRolesEnum.OWNER,
      status: UserStatusEnum.NEW,
      agencyId: data.agencyId,
      password: passwordHash,
      isAdmin: false,
    }
    const [newUser] = await userRepository.createUser(newUserData)
    if (!newUser) {
      console.error(`Owner could not be created: ${newUserData}`)
      return
    }
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      password: newPassword,
    }
  },

  async transferAdmin({
    currentUserId,
    otherUserId,
    agencyId,
  }: {
    currentUserId: string
    otherUserId: string
    agencyId: string
  }) {
    if (currentUserId === otherUserId) return

    const agency = await agencyRepository.readAgencyById(agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency not found or suspended: ${agencyId}`)
      return
    }

    //SUBSCRIPTION CHECK: Only premium agency can transfer admin
    if (
      !APP_TRIAL_MODE &&
      (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
        agency.subscriptionExpiresOn < new Date())
    ) {
      console.error(`Basic plan cannot transfer admin: ${agencyId}`)
      return
    }

    const currentUser = await userRepository.readUserById(currentUserId)
    if (
      !currentUser ||
      !currentUser.isAdmin ||
      currentUser.userRole !== UserRolesEnum.OWNER ||
      currentUser.agencyId !== agencyId ||
      currentUser.status !== UserStatusEnum.SUSPENDED
    ) {
      console.error(
        `Current user not found, is suspended or is not admin or owner: ${agencyId} ${currentUserId}`,
      )
      return
    }

    const otherUser = await userRepository.readUserById(otherUserId)
    if (
      !otherUser ||
      [UserStatusEnum.NEW, UserStatusEnum.SUSPENDED].includes(
        otherUser.status,
      ) ||
      otherUser.isAdmin ||
      otherUser.userRole !== UserRolesEnum.OWNER ||
      otherUser.agencyId !== agencyId
    ) {
      console.error(
        `Other user not found, is suspended, is not owner or is already an admin: ${agencyId} ${otherUserId}`,
      )
      return
    }

    const [updatedCurrentUser] = await userRepository.updateAdmin({
      userId: currentUserId,
      isAdmin: false,
    })
    if (!updatedCurrentUser) {
      console.error(`Could not update current User: ${currentUserId}`)
      return
    }

    const [updatedOtherUser] = await userRepository.updateAdmin({
      userId: otherUserId,
      isAdmin: true,
    })
    if (!updatedOtherUser) {
      console.error(`Could not update other User: ${otherUserId}`)
      return
    }

    return updatedOtherUser
  },

  //Create Driver (Onboarding flow)
  async addDriverUser(data: AddDriverRequestType) {
    const agency = await agencyRepository.readAgencyById(data.agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency not found or suspended: ${data.agencyId}`)
      return
    }

    //SUBSCRIPTION CHECK: Check if basic plan has reached drivers limit
    if (
      !APP_TRIAL_MODE &&
      (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
        agency.subscriptionExpiresOn < new Date())
    ) {
      const drivers = await userRepository.readUserByRolesAgencyId({
        agencyId: data.agencyId,
        userRoles: [UserRolesEnum.DRIVER],
      })
      if (drivers.length >= BASIC_PLAN_DRIVER_LIMIT) {
        console.error(
          `Basic plan limited reached for drivers: ${data.agencyId}`,
        )
        return
      }
    }

    //Step1: Check if driver user (phone) already exists in this agency
    const existingUserInAgency =
      await userRepository.readUserByPhoneRolesAgencyId({
        agencyId: data.agencyId,
        phone: data.phone,
        roles: [UserRolesEnum.DRIVER],
      })
    if (existingUserInAgency) {
      console.error(
        `Existing driver user with phone in the agency: ${data.agencyId} ${data.email}`,
      )
      return
    }

    //Step2: Check if driver user (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail({
      phone: data.phone,
      roles: [UserRolesEnum.DRIVER],
      email: data.email,
    })
    if (existingUserInSystem) {
      console.error(
        `Existing driver user with phone and email in the system: ${data.phone} ${data.email}`,
      )
      return
    }

    //Step3: generate a new password
    const newPassword = generateNewPassword()
    const passwordHash = await generatePasswordHash(newPassword)

    //Step4: Create the driver user
    const newUserData: InsertUserType = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      userRole: UserRolesEnum.DRIVER,
      status: UserStatusEnum.NEW,
      agencyId: data.agencyId,
      password: passwordHash,
      isAdmin: false,
    }
    const [newUser] = await userRepository.createUser(newUserData)
    if (!newUser) {
      console.error(`Driver user could not be created: ${newUserData}`)
      return
    }

    //Step5: Create a driver
    const newDriverData: InsertDriverType = {
      agencyId: data.agencyId,
      addedByUserId: data.addedByUserId,
      userId: newUser.id,
      name: data.name,
      phone: data.phone,
      address: data.address,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: data.licenseExpiresOn,
      canDriveVehicleTypes: data.canDriveVehicleTypes,
      defaultAllowancePerDay: data.defaultAllowancePerDay,
    }
    const newDriver = await driverServices.addDriver(newDriverData)
    if (!newDriver) {
      console.error(`Driver could not be created: ${newDriverData}`)
      return
    }

    //Return driver Id
    return {
      id: newDriver.id,
      userId: newDriver.userId,
      name: newUser.name,
      email: newUser.email,
      password: newPassword,
    }
  },

  //Validate user login with userId and password
  async checkUserCredentialsInDB({
    userId,
    password,
  }: {
    userId: string
    password: string
  }) {
    //Step1: Find user with userID
    const user = await userRepository.readUserWithPasswordById(userId)

    if (!user) {
      return {
        error: "userNotFound",
      }
    }

    if (user.status === UserStatusEnum.SUSPENDED) {
      return {
        error: "userSuspended",
      }
    }

    //SUBSCRIPTION CHECK: Additional owners cannot login in Basic plan
    if (
      user.userRole === UserRolesEnum.OWNER &&
      !user.isAdmin &&
      user.agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
    ) {
      return {
        error: "basicPlanOwnerLimit",
      }
    }

    //Step2: Compare password
    const valid = await comparePassword({
      enteredPassword: password,
      dbPasswordHash: user.password,
    })
    if (!valid) {
      return {
        error: "invalidPassword",
      }
    }

    //Step3: Update last login and seen
    await userRepository.updateLastLoginAndSeen(user.id)

    //Step4: Return user details
    return { data: user }
  },

  //Create user session
  async addUserSession(data: InsertSessionType) {
    const user = await userRepository.readUserById(data.userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${data.userId}`)
      return
    }

    const [newSession] = await sessionRepository.createSession(data)
    return newSession
  },

  //Update user session expiry
  async changeUserSessionExpiry({
    sessionId,
    userId,
    expiresAt,
  }: {
    sessionId: string
    userId: string
    expiresAt: Date
  }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    await sessionRepository.updateSessionExpiringTime({ sessionId, expiresAt })
  },

  //Update user last seen
  async changeUserLastSeen(userId: string) {
    const [user] = await userRepository.updateLastSeen(userId)
    return user
  },

  //Logout in DB
  async logOutInDB({ sessionId }: { sessionId: string }) {
    const session = await sessionRepository.readSessionById(sessionId)
    if (!session || session.expiresAt < new Date()) {
      console.error(`Session not found or already expired: ${sessionId}`)
      return
    }

    const [sessionDeleted] = await sessionRepository.deleteSession(sessionId)
    if (!sessionDeleted) {
      console.error(`Session could not be deleted: ${sessionId}`)
      return
    }

    const [updatedUser] = await userRepository.updateLastLogout(
      sessionDeleted.userId,
    )
    if (!updatedUser) {
      console.error(
        `User logout could not be updated: ${sessionDeleted.userId}`,
      )
      return
    }
    return updatedUser
  },

  //Reset user password (by owner - user details flow)
  async resetUserPassword(userId: string) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    //Generate a new password
    const newPassword = generateNewPassword()

    //Store new password in DB
    const passwordHash = await generatePasswordHash(newPassword)
    const [updatedUser] = await userRepository.updatePassword({
      userId,
      passwordHash,
    })
    if (!updatedUser) {
      console.error(`User password could not be updated: ${userId}`)
      return
    }

    //Return user details for reset password confirmation mail
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      password: newPassword,
      email: updatedUser.email,
    }
  },

  //Verify and activate user and set new password
  async verifyUserAndSetNewPassword({
    userId,
    newPassword,
  }: {
    userId: string
    newPassword: string
  }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status !== UserStatusEnum.NEW || user.isVerified) {
      console.error(
        `User not found, is not new or is already verified: ${userId}`,
      )
      return
    }

    //Set a new password
    const passwordHash = await generatePasswordHash(newPassword)

    const [updatedUser] =
      await userRepository.updatePasswordAndVerificationStatus({
        userId,
        passwordHash,
      })
    if (!updatedUser) {
      console.error(
        `User password could not be updated: ${userId} ${newPassword}`,
      )
      return
    }
    return updatedUser
  },

  //Change new password (by user - forgot password flow)
  async resetMyPassword({
    userId,
    newPassword,
  }: {
    userId: string
    newPassword: string
  }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    //Set a new password
    const passwordHash = await generatePasswordHash(newPassword)
    const [updatedUser] = await userRepository.updatePassword({
      userId,
      passwordHash,
      status:
        user.status === UserStatusEnum.NEW
          ? UserStatusEnum.ACTIVE
          : user.status,
    })
    if (!updatedUser) {
      console.error(
        `User password could not be updated: ${userId} ${newPassword}`,
      )
      return
    }
    return updatedUser
  },

  // Change password (by user - account details flow)
  async changeMyPassword({
    userId,
    oldPassword,
    newPassword,
  }: {
    userId: string
    oldPassword: string
    newPassword: string
  }) {
    //Step1: Find user with userID
    const user = await userRepository.readUserWithPasswordById(userId)
    // If no user found, cannot change password
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    //Step2: Compare old password
    const valid = await comparePassword({
      enteredPassword: oldPassword,
      dbPasswordHash: user.password,
    })
    if (!valid) {
      console.error(`Password does not match: ${userId}`)
      return
    }

    //Step3: Set a new password
    const passwordHash = await generatePasswordHash(newPassword)
    const [updatedUser] = await userRepository.updatePassword({
      userId,
      passwordHash,
    })
    if (!updatedUser) {
      console.error(
        `User password could not be updated: ${userId} ${newPassword}`,
      )
      return
    }
    //Return userId as reset confirmation
    return updatedUser
  },

  //Update user photo url
  async updateUserPhoto({
    userId,
    photoUrl,
  }: {
    userId: string
    photoUrl: string
  }) {
    const [updatedUser] = await userRepository.updatePhotoUrl({
      userId,
      photoUrl,
    })
    if (!updatedUser) {
      console.error(
        `User photo url could not be updated: ${userId} ${photoUrl}`,
      )
      return
    }
    return updatedUser
  },

  //Change user name
  async changeName({
    userId,
    name,
    userRole,
  }: {
    userId: string
    name: string
    userRole: UserRolesEnum
  }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    const [updatedUser] = await userRepository.updateName({ userId, name })
    if (userRole === UserRolesEnum.DRIVER) {
      await driverRepository.updateNameByUserId({ userId, name })
    }
    if (!updatedUser) {
      console.error(`User name could not be updated: ${userId} ${name}`)
      return
    }
    return updatedUser
  },

  //Change UserPreferences  url
  async changeUserPreferences({
    userId,
    prefersDarkTheme,
    languagePref,
  }: {
    userId: string
    prefersDarkTheme?: boolean
    languagePref?: UserLangEnum
  }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    const [updatedUser] = await userRepository.updateUserPreferences({
      userId,
      prefersDarkTheme,
      languagePref,
    })
    if (!updatedUser) {
      console.error(
        `User preferences could not be updated: ${userId} ${prefersDarkTheme} ${languagePref}`,
      )
      return
    }
    return updatedUser
  },

  //Change self email
  async changeEmailWithPasswordConfirmation({
    userId,
    password,
    email,
  }: {
    userId: string
    password: string
    email: string
  }) {
    const user = await userRepository.readUserWithPasswordById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    //Check if other user with same email, role and phone exists
    const existingUser = await userRepository.readUserByPhoneRoleEmail({
      email,
      roles: [user.userRole],
      phone: user.phone,
    })

    if (existingUser) {
      console.error(
        `Existing user with phone and email in the system: ${userId} ${email} ${user.phone}`,
      )
      return
    }

    const valid = await comparePassword({
      enteredPassword: password,
      dbPasswordHash: user.password,
    })
    if (!valid) {
      console.error(`Password does not match: ${userId}`)
      return
    }

    const [updatedUser] = await userRepository.updateEmail({ userId, email })
    if (!updatedUser) {
      console.error(`User email could not be updated: ${userId} ${email}`)
      return
    }
    return updatedUser
  },

  //change user's email (by owner)
  async changeUserEmail({ userId, email }: { userId: string; email: string }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    //Check if other user with same email, role and phone exists
    const existingUser = await userRepository.readUserByPhoneRoleEmail({
      email,
      roles: [user.userRole],
      phone: user.phone,
    })

    if (existingUser) {
      console.error(
        `Existing user with phone and email in the system: ${userId} ${email} ${user.phone}`,
      )
      return
    }

    const [updatedUser] = await userRepository.updateEmail({ userId, email })
    if (!updatedUser) {
      console.error(`User email could not be updated: ${userId} ${email}`)
      return
    }
    return updatedUser
  },

  //change user's phone (by owner)
  async changeUserPhone({
    userId,
    phone,
    role,
  }: {
    userId: string
    phone: string
    role: UserRolesEnum
  }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    //Check if other user with same email, role and phone exists
    const existingUser = await userRepository.readUserByPhoneRoleEmail({
      email: user.email,
      roles: [user.userRole],
      phone: phone,
    })
    if (existingUser) {
      console.error(
        `Existing user with phone and email in the system: ${userId} ${user.email} ${phone}`,
      )
      return
    }

    //Check if other user with same phone, role in the same agency exists
    const existingUserInAgency =
      await userRepository.readUserByPhoneRolesAgencyId({
        phone,
        roles: [user.userRole],
        agencyId: user.agencyId,
      })
    if (existingUserInAgency) {
      console.error(
        `Existing user with phone in the agency: ${userId} ${user.phone}`,
      )
      return
    }

    const [updatedUser] = await userRepository.updatePhone({ userId, phone })
    if (role === UserRolesEnum.DRIVER) {
      await driverRepository.updatePhoneByUserId({ userId, phone })
    }
    if (!updatedUser) {
      console.error(`User phone could not be updated: ${userId} ${phone}`)
      return
    }
    return updatedUser
  },

  //Activate user
  async activateUser({
    userId,
    role,
  }: {
    userId: string
    role?: UserRolesEnum
  }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    const [updatedUser] = await userRepository.updateUserStatus({
      userId,
      status: UserStatusEnum.ACTIVE,
    })
    if (role === UserRolesEnum.DRIVER) {
      await driverRepository.updateStatusByUserId({
        userId,
        status: DriverStatusEnum.AVAILABLE,
      })
    }
    if (!updatedUser) {
      console.error(`User could not be activated: ${userId} ${role}`)
      return
    }
    return updatedUser
  },

  //Inactivate User
  async inactivateUser({
    userId,
    role,
  }: {
    userId: string
    role: UserRolesEnum
  }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    const [updatedUser] = await userRepository.updateUserStatus({
      userId,
      status: UserStatusEnum.INACTIVE,
    })
    if (role === UserRolesEnum.DRIVER) {
      await driverRepository.updateStatusByUserId({
        userId,
        status: DriverStatusEnum.INACTIVE,
      })
    }
    if (!updatedUser) {
      console.error(`User could not be inactivated: ${userId} ${role}`)
      return
    }
    return updatedUser
  },

  //Verify owner (VerifyAccount Onboarding flow)
  async verifyOwner(userId: string) {
    const user = await userRepository.readUserById(userId)
    if (
      !user ||
      user.status === UserStatusEnum.SUSPENDED ||
      user.isVerified ||
      user.userRole !== UserRolesEnum.OWNER ||
      !user.isAdmin
    ) {
      console.error(
        `User not found, is suspended, is not owner or admin, or is already verified : ${userId}`,
      )
      return
    }

    const [verifiedUser] = await userRepository.updateVerificationStatus(userId)
    if (!verifiedUser) {
      console.error(`Owner could not be verified: ${userId}`)
      return
    }
    return verifiedUser
  },

  //Check verification code
  async checkVerificationCode({
    userId,
    code,
  }: {
    userId: string
    code: string
  }) {
    const user = await userRepository.readUserWithPasswordById(userId)
    if (
      !user ||
      user.status === UserStatusEnum.SUSPENDED ||
      !user.verificationCode
    ) {
      console.error(
        `User not found or suspended, or does not have a verification code: ${userId}`,
      )
      return
    }

    if (SUPER_CODE && code === SUPER_CODE) return true
    return user.verificationCode === code
  },

  //Regenerate verification code (Verify Account Onboarding flow)
  async regenerateCode(userId: string) {
    const user = await userRepository.readUserById(userId)
    if (
      !user ||
      user.status === UserStatusEnum.SUSPENDED ||
      user.isVerified ||
      user.userRole !== UserRolesEnum.OWNER ||
      !user.isAdmin
    ) {
      console.error(
        `User not found, is suspended, is not owner or admin, or is already verified : ${userId}`,
      )
      return
    }

    const verificationCode = generateVerificationCode()
    const [updatedUser] = await userRepository.updateVerificationCode({
      userId,
      verificationCode,
    })
    if (!updatedUser) {
      console.error(
        `User verification code could not be updated: ${userId} ${verificationCode}`,
      )
      return
    }
    return updatedUser
  },

  async generateAndSendCode(userId: string) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    const verificationCode = generateVerificationCode()
    const [updatedUser] = await userRepository.updateVerificationCode({
      userId,
      verificationCode,
    })
    if (!updatedUser) {
      console.error(
        `User verification code could not be updated: ${userId} ${verificationCode}`,
      )
      return
    }
    return updatedUser
  },

  async locateUser({
    userId,
    lat,
    long,
  }: {
    userId: string
    lat: number
    long: number
  }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      console.error(`User not found or suspended: ${userId}`)
      return
    }

    if (
      user.locatedAt &&
      differenceInMinutes(new Date(), user.locatedAt) < LOCATE_USER_MINUTES
    ) {
      console.warn(`Located quite recently: ${userId} ${user.locatedAt}`)
      return
    }

    const [updatedUser] = await userRepository.updateLocation({
      userId,
      lat,
      long,
    })
    if (!updatedUser) {
      console.error(
        `User location could not be updated: ${userId} ${lat} ${long}`,
      )
      return
    }
    return updatedUser
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

export type FindUserDetailsWithDriverByIdType = Awaited<
  ReturnType<typeof userServices.findUserDetailsWithDriverById>
>

export type FindUserAssignedBookingsByIdType = Awaited<
  ReturnType<typeof userServices.findUserAssignedBookingsById>
>

export type FindUserCompletedBookingsByIdType = Awaited<
  ReturnType<typeof userServices.findUserCompletedBookingsById>
>

export type FindAssignedUserByDriverIdType = Awaited<
  ReturnType<typeof userServices.findAssignedUserByDriverId>
>

export type FindUsersByPhoneType = Awaited<
  ReturnType<typeof userServices.findValidUsersByPhone>
>
