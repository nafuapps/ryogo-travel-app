import { UserStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema";
import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repo";
import { agencyServices } from "./agency.services";
import { uploadFile } from "@ryogo-travel-app/db/storage";
import { driverServices } from "./driver.services";

export type OnboardingAccountCreationType = {
  agency: {
    businessName: string;
    businessPhone: string;
    businessEmail: string;
    businessAddress: string;
    businessLogo?: FileList | undefined;
    commissionRate?: number;
    agencyState: string;
    agencyCity: string;
  };
  owner: {
    name: string;
    phone: string;
    email: string;
    photo?: FileList | undefined;
    password: string;
  };
};

export type OnboardingAddAgentType = {
  name: string;
  phone: string;
  email: string;
  photo?: FileList | undefined;
};

export type OnboardingAddDriverType = {
  name: string;
  phone: string;
  email: string;
  photo?: FileList | undefined;
  licenseNumber: string;
  licenseExpiresOn: Date;
  licensePhotos: FileList;
  address: string;
  canDriveVehicleTypes: string[];
  defaultAllowancePerDay?: number;
};

export async function generatePasswordHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export function generateNewPassword() {
  return Math.random().toString(36).slice(-8); //Generate a random 8 character password
}

export const userServices = {
  //Get unique owner of an agency
  async getOwnerOfAgency(agencyId: string) {
    const owner = await userRepository.getUserByRolesAgencyId(agencyId, [
      UserRolesEnum.OWNER,
    ]);
    if (!owner) {
      // !This is a major issue - no owner of an agency
      throw new Error("No owner found for this agency");
    }
    if (owner.length > 1) {
      // !This is a major issue - multiple owners of an agency
      throw new Error("Multiple owners found for this agency");
    }
    return owner[0];
  },

  //Get all drivers of an agency
  async getDriversOfAgency(agencyId: string) {
    return await userRepository.getUserByRolesAgencyId(agencyId, [
      UserRolesEnum.DRIVER,
    ]);
  },

  //Get agents & owner of an agency
  async getOwnerOrAgentsOfAgency(agencyId: string) {
    const ownerOrAgents = await userRepository.getUserByRolesAgencyId(
      agencyId,
      [UserRolesEnum.OWNER, UserRolesEnum.AGENT]
    );

    if (ownerOrAgents.length < 1) {
      // !This is a major issue - no owner or agents of an agency
      throw new Error("No owner or agents found for this agency");
    }
    return ownerOrAgents;
  },

  // * Admin use case *
  //Get drivers by phone number
  async getDriversByPhoneNumber(phone: string) {
    return userRepository.getUserByRolesPhone(phone, [UserRolesEnum.DRIVER]);
  },

  //Get driver in an agency by phone number
  async getDriverByPhoneInAgency(agencyId: string, phone: string) {
    const drivers = await userRepository.getUserByPhoneRolesAgencyId(
      phone,
      [UserRolesEnum.DRIVER],
      agencyId
    );
    if (drivers.length < 1) {
      throw new Error("No driver found with this phone number");
    }
    if (drivers.length > 1) {
      // !This is a major issue - multiple drivers with same phone number in an agency
      throw new Error("Multiple drivers found with this phone number");
    }
    return drivers[0];
  },

  //Get unique agent or owner in an agency by phone number
  async getOwnerOrAgentsByPhoneInAgency(agencyId: string, phone: string) {
    const users = await userRepository.getUserByPhoneRolesAgencyId(
      phone,
      [UserRolesEnum.OWNER, UserRolesEnum.AGENT],
      agencyId
    );
    if (users.length < 1) {
      throw new Error("No agent or owner found with this phone number");
    }
    if (users.length > 1) {
      // !This is a major issue - multiple agents or owners with same phone number in an agency
      throw new Error("Multiple agents or owners found with this phone number");
    }
    return users[0];
  },

  //Get owner/agents by phone number (Login flow)
  async getOwnerOrAgentsByPhoneNumber(phone: string) {
    return userRepository.getUserByRolesPhone(phone, [
      UserRolesEnum.AGENT,
      UserRolesEnum.OWNER,
    ]);
  },

  //Get users by phone number (Login flow step1)
  async getUsersByPhoneNumber(phone: string) {
    const users = await userRepository.getUserWithAgencyDataByRolesPhone(
      phone,
      [UserRolesEnum.AGENT, UserRolesEnum.OWNER, UserRolesEnum.DRIVER]
    );
    if (users.length < 1) {
      throw new Error("No user found with this phone number");
    }
    return users;
  },

  //Create Agency and Owner (Onboarding flow)
  async addAgencyAndOwnerAccount(data: OnboardingAccountCreationType) {
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

    //Step2: Create agency
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
    if (owner.length < 1) {
      throw new Error("Failed to create owner for this agency");
    }

    //Step5: Upload owner photo on Storage and update photo url in user
    if (data.owner.photo) {
      userServices.updateUserPhoto(owner[0]!.id, data.owner.photo);
    }

    // TODO Step6: Send welcome mail to the owner

    return { agency: newAgency, owner: owner[0] };
  },

  //Create Agent (Onboarding flow)
  async addAgentUser(data: OnboardingAddAgentType, agencyId: string) {
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
    if (newUser.length < 1) {
      throw new Error("Failed to create agent for this agency");
    }
    return newUser[0];
  },

  //Create Driver (Onboarding flow)
  async addDriverUser(data: OnboardingAddDriverType, agencyId: string) {
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
      licensePhotos: data.licensePhotos,
      canDriveVehicleTypes: data.canDriveVehicleTypes,
    });
    return newDriver;
  },

  //Validate user login with phone number, role and agencyId (Login flow last step)
  async checkLoginInDB(
    phone: string,
    password: string,
    agencyId: string,
    userRole: string
  ) {
    //Step1: Find user with phone, agencyID and userRole
    const userFound = await userRepository.getUserByPhoneRolesAgencyId(
      phone,
      [userRole as UserRolesEnum],
      agencyId
    );
    // If no user found, cannot login
    if (!userFound) {
      throw new Error("No user found with this phone number");
    }
    if (userFound.length > 1) {
      // !This is a major issue - multiple users with same phone and role in an agency
      throw new Error(
        "Multiple users found with this phone and role in this agency"
      );
    }

    //Step2: Check password
    const valid = await bcrypt.compare(password, userFound[0]!.password);
    if (!valid) {
      throw new Error("Password does not match");
    }
    //Step3: Update last login
    await userRepository.updateLastLogin(userFound[0]!.id, new Date());
    //Step4: Return user details
    return userFound[0];
  },

  //Logout in DB
  async checkLogoutInDB(userId: string) {
    await userRepository.updateLastLogout(userId, new Date());
  },

  //Update user photo url
  async updateUserPhoto(userId: string, photo: FileList) {
    const getUser = await userRepository.getUserById(userId);
    if (!getUser) {
      throw new Error("User not found");
    }
    // Upload photo on SB storage
    const filePath = `${getUser}/photo}`;
    const uploadResult = await uploadFile(photo[0]!, filePath);
    const updatedUser = await userRepository.updatePhotoUrl(
      userId,
      uploadResult.fullPath
    );
    if (!updatedUser) {
      throw new Error("Failed to update photo url for this user");
    }
    return updatedUser[0];
  },
};
