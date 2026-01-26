import {
  UserStatusEnum,
  UserRolesEnum,
  UserLangEnum,
  DriverStatusEnum,
} from "@ryogo-travel-app/db/schema"
import bcrypt from "bcryptjs"
import { userRepository } from "../repositories/user.repo"
import { agencyServices } from "./agency.services"
import { driverServices } from "./driver.services"
import {
  AddDriverRequestType,
  CreateOwnerAccountRequestType,
  AddAgentRequestType,
} from "../types/user.types"
import { driverRepository } from "../repositories/driver.repo"
import { LOGIN_USER_ERROR, LOGIN_PASSWORD_ERROR } from "@/lib/utils"

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

  //Activate user
  async activateUser(userId: string, role?: UserRolesEnum) {
    const user = await userRepository.updateUserStatus(
      userId,
      UserStatusEnum.ACTIVE,
    )
    if (role == UserRolesEnum.DRIVER) {
      await driverRepository.updateStatusByUserId(
        userId,
        DriverStatusEnum.AVAILABLE,
      )
    }
    if (!user) {
      throw new Error("Failed to activate user")
    }
    return user[0]!
  },

  // ? Login flow - Read
  //Find login users by phone
  async findUsersByPhone(phone: string) {
    const users = await userRepository.readUsersWithPhone(phone)
    if (!users || users.length < 1) {
      throw new Error("No user found with this phone number")
    }
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

  // ? Onboarding flow - Create
  //Create Agency and Owner Account
  async addAgencyAndOwnerAccount(data: CreateOwnerAccountRequestType) {
    //Step1: Check if user already exists with this phone, email and role
    const existingUsers = await userRepository.readUserByPhoneRoleEmail(
      data.owner.phone,
      [UserRolesEnum.OWNER],
      data.owner.email,
    )
    if (existingUsers.length > 0) {
      throw new Error(
        "Owner with same phone, already exists.. try a different phone or email",
      )
    }

    //Step2: Try to Create agency
    const newAgency = await agencyServices.createAgency(data.agency)

    //Step3: Prepare owner data
    const passwordHash = await generatePasswordHash(data.owner.password)
    const ownerData = {
      name: data.owner.name,
      email: data.owner.email,
      phone: data.owner.phone,
      agencyId: newAgency!.id,
      userRole: UserRolesEnum.OWNER,
      status: UserStatusEnum.NEW,
      password: passwordHash,
    }

    //Step4: Create the owner
    const owner = await userRepository.createUser(ownerData)
    if (!owner || owner.length < 1) {
      throw new Error("Failed to create owner for this agency")
    }

    // TODO Step6: Send welcome mail to the owner

    return {
      agencyId: newAgency!.id,
      userId: owner[0]!.id,
      password: data.owner.password,
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
      throw new Error(
        "Agent with same phone number already exists in this agency",
      )
    }

    //Step2: Check if agent (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail(
      data.phone,
      [UserRolesEnum.AGENT],
      data.email,
    )
    if (existingUserInSystem.length > 0) {
      throw new Error(
        "Agent with same phone number and email already exists in another agency.. try different phone/email ",
      )
    }

    //Step3: Generate a new password
    const newPassword = generateNewPassword()
    console.log(newPassword)
    // TODO: send pwd in email

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
    if (!newUser || newUser.length < 1) {
      throw new Error("Failed to create agent for this agency")
    }
    return { id: newUser[0]!.id }
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
      throw new Error(
        "Driver with same phone number already exists in this agency",
      )
    }

    //Step2: Check if driver user (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.readUserByPhoneRoleEmail(
      data.phone,
      [UserRolesEnum.DRIVER],
      data.email,
    )
    if (existingUserInSystem.length > 0) {
      throw new Error(
        "Driver with same phone number and email already exists in another agency.. try different phone/email ",
      )
    }

    //Step3: generate a new password
    const newPassword = generateNewPassword() //Generate a random 8 character password
    console.log(newPassword)
    // TODO: send pwd in email

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
    if (newUser.length < 1) {
      throw new Error("Failed to create driver user")
    }

    //Step5: Create a driver
    const newDriver = await driverServices.addDriver({
      agencyId: agencyId,
      userId: newUser[0]!.id,
      name: data.name,
      phone: data.phone,
      address: data.address,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: data.licenseExpiresOn,
      canDriveVehicleTypes: data.canDriveVehicleTypes,
      defaultAllowancePerDay: data.defaultAllowancePerDay,
    })
    if (!newDriver) {
      throw new Error("Failed to create driver")
    }

    //Return driver Id
    return { id: newDriver.id, userId: newDriver.userId }
  },

  // ?Login flow Create
  //Validate user login with userId and password
  async checkLoginInDB(userId: string, password: string) {
    //Step1: Find user with userID
    const userFound = await userRepository.readUserById(userId)
    // If no user found, cannot login
    if (!userFound) {
      return {
        error: LOGIN_USER_ERROR,
      }
    }

    //Step2: Check password
    const valid = await bcrypt.compare(password, userFound.password)
    if (!valid) {
      return {
        error: LOGIN_PASSWORD_ERROR,
      }
    }
    //Step3: Update last login
    await userRepository.updateLastLogin(userFound.id, new Date())

    //Step4: Return user details
    return { data: userFound }
  },

  //Logout in DB
  async checkLogoutInDB(userId: string) {
    await userRepository.updateLastLogout(userId, new Date())
  },

  //Reset user password
  async resetUserPassword(userId: string) {
    //Step1: get email
    const emailFound = await userRepository.readUserById(userId)
    // If no user found, cannot reset password
    if (!emailFound) {
      throw new Error("No user found with this id")
    }

    //Step1: Generate a new password
    const newPassword = generateNewPassword()
    console.log(newPassword)

    // TODO: Step2: send pwd in email

    //Step3: Store new password in DB
    const passwordHash = await generatePasswordHash(newPassword)
    const newUserData = await userRepository.updatePassword(
      userId,
      passwordHash,
    )
    if (!newUserData) {
      throw new Error("Could not reset password in DB")
    }

    //Return userId as reset confirmation
    return newUserData[0]
  },

  // ? Change password (by user)
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    //Step1: Find user with userID
    const userFound = await userRepository.readUserById(userId)
    // If no user found, cannot change password
    if (!userFound) {
      throw new Error("No user found with this id")
    }

    //Step2: Match old password
    const valid = await bcrypt.compare(oldPassword, userFound.password)
    if (!valid) {
      return null
    }

    //Step3: Set a new password
    const passwordHash = await generatePasswordHash(newPassword)
    const newUserData = await userRepository.updateUserStatusAndPassword(
      userId,
      passwordHash,
    )
    if (!newUserData) {
      throw new Error("Could not change password in DB")
    }

    //Return userId as reset confirmation
    return { id: newUserData[0]!.id }
  },

  //Update user photo url
  async updateUserPhoto(userId: string, url: string) {
    const updatedUser = await userRepository.updatePhotoUrl(userId, url)
    if (!updatedUser) {
      throw new Error("Failed to update photo url for this user")
    }
    return updatedUser[0]?.id
  },

  //Change user name
  async changeName(userId: string, name: string, role?: UserRolesEnum) {
    const updatedUser = await userRepository.updateName(userId, name)
    if (role == UserRolesEnum.DRIVER) {
      await driverRepository.updateNameByUserId(userId, name)
    }
    if (!updatedUser) {
      throw new Error("Failed to update name for this user")
    }
    return updatedUser[0]?.id
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
    if (!updatedUser) {
      throw new Error("Failed to update preferences for this user")
    }
    return updatedUser[0]?.id
  },

  //Change self email
  async changeEmail(userId: string, password: string, newEmail: string) {
    //Step1: Find user with userID
    const userFound = await userRepository.readUserById(userId)
    // If no user found, cannot change email
    if (!userFound) {
      throw new Error("No user found with this id")
    }

    //Step2: Match password
    const valid = await bcrypt.compare(password, userFound.password)
    if (!valid) {
      return null
    }
    //Step3: Update email
    const updatedUser = await userRepository.updateEmail(userId, newEmail)
    if (!updatedUser) {
      throw new Error("Failed to update email for this user")
    }
    return updatedUser[0]?.id
  },

  //change user's email (by owner)
  async changeUserEmail(userId: string, newEmail: string) {
    const updatedUser = await userRepository.updateEmail(userId, newEmail)
    if (!updatedUser) {
      throw new Error("Failed to update email for this user")
    }
    return updatedUser[0]?.id
  },

  //change user's phone (by owner)
  async changeUserPhone(
    userId: string,
    newPhone: string,
    role?: UserRolesEnum,
  ) {
    const updatedUser = await userRepository.updatePhone(userId, newPhone)
    if (role == UserRolesEnum.DRIVER) {
      await driverRepository.updatePhoneByUserId(userId, newPhone)
    }
    if (!updatedUser) {
      throw new Error("Failed to update phone for this user")
    }
    return updatedUser[0]?.id
  },

  //Inactivate User
  async inactivateUser(id: string, role?: UserRolesEnum) {
    const user = await userRepository.updateUserStatus(
      id,
      UserStatusEnum.INACTIVE,
    )
    if (role == UserRolesEnum.DRIVER) {
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

export type CheckLoginInDBType = Awaited<
  ReturnType<typeof userServices.checkLoginInDB>
>
