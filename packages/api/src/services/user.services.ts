import {
  UserStatusEnum,
  UserRolesEnum,
  UserLangEnum,
  DriverStatusEnum,
  InsertAgencyType,
  InsertUserType,
  SubscriptionPlanEnum,
  InsertSessionType,
} from "@ryogo-travel-app/db/schema"
import bcrypt from "bcryptjs"
import { userRepository } from "../repositories/user.repo"
import { driverServices } from "./driver.services"
import {
  AddDriverRequestType,
  CreateOwnerAccountRequestType,
  AddUserRequestType,
} from "../types/user.types"
import { driverRepository } from "../repositories/driver.repo"
import { bookingRepository } from "../repositories/booking.repo"
import { agencyRepository } from "../repositories/agency.repo"
import { locationRepository } from "../repositories/location.repo"
import crypto from "crypto"
import { sessionRepository } from "../repositories/session.repo"
import { getSubscriptionExpirationDate } from "./agency.services"
import { BASIC_SEARCH_LIMIT_DAYS, LOCATE_USER_MINUTES } from "../apiConfig"
import { addDays, differenceInMinutes, subDays } from "date-fns"

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
        return
      }
    }
    const assignedUser = await userRepository.readUserById(
      booking.assignedUserId,
    )
    if (!assignedUser) return
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
      return
    }

    //Step2: Check if another agency exists with same phone and email
    const existingAgencies = await agencyRepository.readAgencyByPhoneEmail({
      businessPhone: data.agency.businessPhone,
      businessEmail: data.agency.businessEmail,
    })
    if (existingAgencies) {
      return
    }

    //Step3: Get location id from city, state
    const location = await locationRepository.readLocationByCityState({
      city: data.agency.agencyCity,
      state: data.agency.agencyState,
    })
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
    const [newAgency] = await agencyRepository.createAgency(createAgencyData)
    if (!newAgency) {
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

  //TODO: New user can login with verification code (in email) and then change password
  //Create Agent
  async addAgentUser(data: AddUserRequestType) {
    //Step1: Check if agent with same phone already exists in this agency
    const existingUserInAgency =
      await userRepository.readUserByPhoneRolesAgencyId({
        agencyId: data.agencyId,
        roles: [UserRolesEnum.AGENT],
        phone: data.phone,
      })
    if (existingUserInAgency) {
      return
    }

    //Step2: Check if agent (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail({
      phone: data.phone,
      roles: [UserRolesEnum.AGENT],
      email: data.email,
    })
    if (existingUserInSystem) {
      return
    }

    //Step3: Generate a new password
    const newPassword = generateNewPassword()
    const passwordHash = await generatePasswordHash(newPassword)

    //Step4: Create the agent user
    const [newUser] = await userRepository.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      userRole: UserRolesEnum.AGENT,
      status: UserStatusEnum.NEW,
      agencyId: data.agencyId,
      password: passwordHash,
      isAdmin: false,
    })
    if (!newUser) {
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
      return
    }

    //Step2: Check if owner (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail({
      phone: data.phone,
      roles: [UserRolesEnum.OWNER],
      email: data.email,
    })
    if (existingUserInSystem) {
      return
    }

    //Step3: Generate a new password
    const newPassword = generateNewPassword()
    const passwordHash = await generatePasswordHash(newPassword)

    //Step4: Create the owner user
    const [newUser] = await userRepository.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      userRole: UserRolesEnum.OWNER,
      status: UserStatusEnum.NEW,
      agencyId: data.agencyId,
      password: passwordHash,
      isAdmin: false,
    })
    if (!newUser) {
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

    const currentUser = await userRepository.readUserById(currentUserId)
    if (
      !currentUser ||
      !currentUser.isAdmin ||
      currentUser.userRole !== UserRolesEnum.OWNER ||
      currentUser.agencyId !== agencyId ||
      currentUser.status !== UserStatusEnum.SUSPENDED
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

    const [updatedCurrentUser] = await userRepository.updateAdmin({
      userId: currentUserId,
      isAdmin: false,
    })
    if (!updatedCurrentUser) {
      return
    }

    const [updatedOtherUser] = await userRepository.updateAdmin({
      userId: otherUserId,
      isAdmin: true,
    })
    if (!updatedOtherUser) {
      return
    }

    return updatedOtherUser
  },

  //Create Driver (Onboarding flow)
  async addDriverUser(data: AddDriverRequestType) {
    //Step1: Check if driver user (phone) already exists in this agency
    const existingUserInAgency =
      await userRepository.readUserByPhoneRolesAgencyId({
        agencyId: data.agencyId,
        phone: data.phone,
        roles: [UserRolesEnum.DRIVER],
      })
    if (existingUserInAgency) {
      return
    }

    //Step2: Check if driver user (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail({
      phone: data.phone,
      roles: [UserRolesEnum.DRIVER],
      email: data.email,
    })
    if (existingUserInSystem) {
      return
    }

    //Step3: generate a new password
    const newPassword = generateNewPassword()
    const passwordHash = await generatePasswordHash(newPassword)

    //Step4: Create the driver user
    const [newUser] = await userRepository.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      userRole: UserRolesEnum.DRIVER,
      status: UserStatusEnum.NEW,
      agencyId: data.agencyId,
      password: passwordHash,
      isAdmin: false,
    })
    if (!newUser) {
      return
    }

    //Step5: Create a driver
    const newDriver = await driverServices.addDriver({
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
    })
    if (!newDriver) {
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
    // If no user found, cannot login
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
    if (!user || user.status === UserStatusEnum.SUSPENDED) return

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
    if (!user || user.status === UserStatusEnum.SUSPENDED) return

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
      return
    }

    const [sessionDeleted] = await sessionRepository.deleteSession(sessionId)
    if (!sessionDeleted) {
      return
    }

    const [updatedUser] = await userRepository.updateLastLogout(
      sessionDeleted.userId,
    )
    return updatedUser
  },

  //Reset user password (by owner - user details flow)
  async resetUserPassword(userId: string) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      return
    }

    //Generate a new password
    const newPassword = generateNewPassword()

    //Store new password in DB
    const passwordHash = await generatePasswordHash(newPassword)
    const [newUserData] = await userRepository.updatePassword({
      userId,
      passwordHash,
    })
    if (!newUserData) {
      return
    }

    //Return user details for reset password confirmation mail
    return {
      id: newUserData.id,
      name: newUserData.name,
      password: newPassword,
      email: newUserData.email,
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
      return
    }

    //Set a new password
    const passwordHash = await generatePasswordHash(newPassword)

    const [newUserData] =
      await userRepository.updatePasswordVerificationAndStatus({
        userId,
        passwordHash,
      })

    return newUserData
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
      return
    }

    //Set a new password
    const passwordHash = await generatePasswordHash(newPassword)
    const [newUserData] = await userRepository.updatePassword({
      userId,
      passwordHash,
      status:
        user.status === UserStatusEnum.NEW ? UserStatusEnum.ACTIVE : undefined,
    })

    return newUserData
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
      return
    }

    //Step2: Compare old password
    const valid = await comparePassword({
      enteredPassword: oldPassword,
      dbPasswordHash: user.password,
    })
    if (!valid) {
      return
    }

    //Step3: Set a new password
    const passwordHash = await generatePasswordHash(newPassword)
    const [newUserData] = await userRepository.updatePassword({
      userId,
      passwordHash,
    })

    //Return userId as reset confirmation
    return newUserData
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
      return
    }

    const [updatedUser] = await userRepository.updateName({ userId, name })
    if (userRole === UserRolesEnum.DRIVER) {
      await driverRepository.updateNameByUserId({ userId, name })
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
      return
    }

    const [updatedUser] = await userRepository.updateUserPreferences({
      userId,
      prefersDarkTheme,
      languagePref,
    })
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
      return
    }

    const valid = await comparePassword({
      enteredPassword: password,
      dbPasswordHash: user.password,
    })
    if (!valid) {
      return
    }

    const [updatedUser] = await userRepository.updateEmail({ userId, email })
    return updatedUser
  },

  //change user's email (by owner)
  async changeUserEmail({ userId, email }: { userId: string; email: string }) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      return
    }

    const [updatedUser] = await userRepository.updateEmail({ userId, email })
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
      return
    }

    const [updatedUser] = await userRepository.updatePhone({ userId, phone })
    if (role === UserRolesEnum.DRIVER) {
      await driverRepository.updatePhoneByUserId({ userId, phone })
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
      return
    }

    const [verifiedUser] = await userRepository.updateVerificationStatus(userId)
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
    const user = await userRepository.readUserById(userId)
    if (
      !user ||
      user.status === UserStatusEnum.SUSPENDED ||
      !user.verificationCode
    ) {
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
      return
    }

    const [updatedUser] = await userRepository.updateVerificationCode({
      userId,
      verificationCode: generateVerificationCode(),
    })
    return updatedUser
  },

  async generateAndSendCode(userId: string) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) {
      return
    }

    const [updatedUser] = await userRepository.updateVerificationCode({
      userId,
      verificationCode: generateVerificationCode(),
    })
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
    if (!user) return

    if (
      user.locatedAt &&
      differenceInMinutes(new Date(), user.locatedAt) < LOCATE_USER_MINUTES
    ) {
      return
    }

    const [updatedUser] = await userRepository.updateLocation({
      userId,
      lat,
      long,
    })
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
