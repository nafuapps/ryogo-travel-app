import { UserStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema";
import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repo";
import { agencyServices } from "./agency.services";
import { driverServices } from "./driver.services";
import {
  OnboardingAddAgentAPIRequestType,
  OnboardingAddAgentAPIResponseType,
  OnboardingAddDriverAPIRequestType,
  OnboardingAddDriverAPIResponseType,
  OnboardingCreateAccountAPIRequestType,
  OnboardingCreateAccountAPIResponseType,
} from "../types/user.types";

export async function generatePasswordHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export function generateNewPassword() {
  return Math.random().toString(36).slice(-8); //Generate a random 8 character password
}

export const userServices = {
  // ? Onboarding flow - Read
  //Find owner by phone and email
  async findOwnerByPhoneEmail(phone: string, email: string) {
    const owners = await userRepository.getUserByPhoneRoleEmail(
      phone,
      [UserRolesEnum.OWNER],
      email
    );
    if (owners.length > 1) {
      // !This is a major issue
      throw new Error("Multiple owners found with same phone and email");
    }
    return owners;
  },

  //Find driver by phone and email
  async findDriverByPhoneEmail(phone: string, email: string) {
    const drivers = await userRepository.getUserByPhoneRoleEmail(
      phone,
      [UserRolesEnum.DRIVER],
      email
    );
    if (drivers.length > 1) {
      // !This is a major issue
      throw new Error("Multiple drivers found with same phone and email");
    }
    return drivers;
  },

  //Find driver by phone and email
  async findAgentByPhoneEmail(phone: string, email: string) {
    const agents = await userRepository.getUserByPhoneRoleEmail(
      phone,
      [UserRolesEnum.AGENT],
      email
    );
    if (agents.length > 1) {
      // !This is a major issue
      throw new Error("Multiple drivers found with same phone and email");
    }
    return agents;
  },

  //Activate user
  async activateUser(userId: string) {
    const user = await userRepository.updateUserStatus(
      userId,
      UserStatusEnum.ACTIVE
    );
    if (!user) {
      throw new Error("Failed to activate user");
    }
    if (user.length > 1) {
      // !This is a major issue
      throw new Error("Multiple users found with this userId");
    }
    return user[0]!;
  },

  // ? Login flow - Read
  //Find login users by phone
  async findUsersByPhone(phone: string) {
    const users = await userRepository.getUsersWithPhone(phone);
    if (!users || users.length < 1) {
      throw new Error("No user found with this phone number");
    }
    return users;
  },

  //Find user accounts by phone
  async findUserAccountsByPhone(phone: string) {
    const users = await userRepository.getUserAccountsByPhone(phone);
    if (!users) {
      return [];
    }
    return users;
  },

  // ? Onboarding flow - Create
  //Create Agency and Owner Account
  async addAgencyAndOwnerAccount(
    data: OnboardingCreateAccountAPIRequestType
  ): Promise<OnboardingCreateAccountAPIResponseType> {
    //Step1: Check if user already exists with this phone, email and role
    const existingUsers = await userRepository.getUserByPhoneRoleEmail(
      data.owner.phone,
      [UserRolesEnum.OWNER],
      data.owner.email
    );
    if (existingUsers.length > 0) {
      throw new Error(
        "Owner with same phone, already exists.. try a different phone or email"
      );
    }

    //Step2: Try to Create agency
    const newAgency = await agencyServices.createAgency(data.agency);

    //Step3: Prepare owner data
    const passwordHash = await generatePasswordHash(data.owner.password);
    const ownerData = {
      name: data.owner.name,
      email: data.owner.email,
      phone: data.owner.phone,
      agencyId: newAgency!.id,
      userRole: UserRolesEnum.OWNER,
      status: UserStatusEnum.NEW,
      password: passwordHash,
    };

    //Step4: Create the owner
    const owner = await userRepository.createUser(ownerData);
    if (!owner || owner.length < 1) {
      throw new Error("Failed to create owner for this agency");
    }

    // TODO Step6: Send welcome mail to the owner

    return {
      agencyId: newAgency!.id,
      userId: owner[0]!.id,
      password: data.owner.password,
    };
  },

  //Create Agent (Onboarding flow)
  async addAgentUser({
    agencyId,
    data,
  }: OnboardingAddAgentAPIRequestType): Promise<OnboardingAddAgentAPIResponseType> {
    //Step1: Check if agent or owner (phone) already exists in this agency
    const existingUserInAgency =
      await userRepository.getUserByPhoneRolesAgencyId(
        agencyId,
        [UserRolesEnum.AGENT, UserRolesEnum.OWNER],
        data.phone
      );
    if (existingUserInAgency.length > 0) {
      throw new Error(
        "Agent or Owner with same phone number already exists in this agency"
      );
    }

    //Step2: Check if agent (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.getUserByPhoneRoleEmail(
      data.phone,
      [UserRolesEnum.AGENT],
      data.email
    );
    if (existingUserInSystem.length > 0) {
      throw new Error(
        "Agent with same phone number and email already exists in another agency.. try different phone/email "
      );
    }

    //Step3: Generate a new password
    const newPassword = generateNewPassword();
    console.log(newPassword);
    // TODO: send pwd in email

    const passwordHash = await generatePasswordHash(newPassword);

    //Step4: Create the agent user
    const newUser = await userRepository.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      userRole: UserRolesEnum.AGENT,
      status: UserStatusEnum.NEW,
      agencyId: agencyId,
      password: passwordHash,
    });
    if (!newUser) {
      throw new Error("Failed to create agent for this agency");
    }
    return { id: newUser[0]!.id };
  },

  //Create Driver (Onboarding flow)
  async addDriverUser({
    agencyId,
    data,
  }: OnboardingAddDriverAPIRequestType): Promise<OnboardingAddDriverAPIResponseType> {
    //Step1: Check if driver user (phone) already exists in this agency
    const existingUserInAgency =
      await userRepository.getUserByPhoneRolesAgencyId(
        data.phone,
        [UserRolesEnum.DRIVER],
        agencyId
      );
    if (existingUserInAgency.length > 0) {
      throw new Error(
        "Driver with same phone number already exists in this agency"
      );
    }

    //Step2: Check if driver user (phone, email) already exists in the system
    const existingUserInSystem = await userRepository.getUserByPhoneRoleEmail(
      data.phone,
      [UserRolesEnum.DRIVER],
      data.email
    );
    if (existingUserInSystem.length > 0) {
      throw new Error(
        "Driver with same phone number and email already exists in another agency.. try different phone/email "
      );
    }

    //Step3: generate a new password
    const newPassword = generateNewPassword(); //Generate a random 8 character password
    console.log(newPassword);
    // TODO: send pwd in email

    const passwordHash = await generatePasswordHash(newPassword);

    //Step4: Create the driver user
    const newUser = await userRepository.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      userRole: UserRolesEnum.DRIVER,
      status: UserStatusEnum.NEW,
      agencyId: agencyId,
      password: passwordHash,
    });
    if (newUser.length < 1) {
      throw new Error("Failed to create driver user");
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
    });
    if (!newDriver) {
      throw new Error("Failed to create driver");
    }

    //Return driver Id
    return { id: newDriver.id, userId: newDriver.userId };
  },

  // ?Login flow Create
  //Validate user login with userId and password
  async checkLoginInDB(userId: string, password: string) {
    //Step1: Find user with userID
    const userFound = await userRepository.getUserById(userId);
    // If no user found, cannot login
    if (!userFound || userFound.length < 1) {
      return userFound;
    }
    if (userFound.length > 1) {
      // !This is a major issue - multiple users with same phone and role in an agency
      throw new Error("Multiple users found with this id in this agency");
    }

    //Step2: Check password
    const valid = await bcrypt.compare(password, userFound[0]!.password);
    if (!valid) {
      return null;
    }
    //Step3: Update last login
    await userRepository.updateLastLogin(userFound[0]!.id, new Date());

    //Step4: Return user details
    return userFound;
  },

  //Logout in DB
  async checkLogoutInDB(userId: string) {
    await userRepository.updateLastLogout(userId, new Date());
  },

  // ? Reset password - Update
  async resetPassword(userId: string, email: string) {
    //Step1: Find user with userID
    const emailFound = await userRepository.getUserById(userId);
    // If no user found, cannot reset password
    if (!emailFound || emailFound.length < 1) {
      throw new Error("No user found with this id");
    }
    if (emailFound.length > 1) {
      // !This is a major issue - multiple users with same userId in an agency
      throw new Error("Multiple users found with this id in this agency");
    }

    //Step2: Match email
    const valid = email == emailFound[0]!.email;
    if (!valid) {
      throw new Error("Provided email does not match our records");
    }

    //Step3: Generate a new password
    const newPassword = generateNewPassword();

    // TODO: Step4: send pwd in email

    //Step5: Store new password in DB
    const passwordHash = await generatePasswordHash(newPassword);
    const newUserData = await userRepository.updatePassword(
      userId,
      passwordHash
    );
    if (!newUserData) {
      throw new Error("Could not reset password in DB");
    }

    //Return userId as reset confirmation
    return newUserData[0]!.id;
  },

  //Update user photo url
  async updateUserPhoto(userId: string, url: string) {
    const updatedUser = await userRepository.updatePhotoUrl(userId, url);
    if (!updatedUser) {
      throw new Error("Failed to update photo url for this user");
    }
    return updatedUser[0]?.id;
  },
};
