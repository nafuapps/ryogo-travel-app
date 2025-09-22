import { db } from "@ryogo-travel-app/db";
import {
  users,
  UserStatusEnum,
  UserRolesEnum,
  InsertUserType,
  InsertAgencyType,
  SelectUserType,
} from "@ryogo-travel-app/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { agencyServices } from "./agencyServices";
import { sessionServices } from "./sessionServices";
import bcrypt from "bcryptjs";

export type AgencyOwnerCreationType = {
  agency: InsertAgencyType;
  owner: InsertUserType;
};

//Generate password hash
export async function generatePasswordHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export const userServices = {
  /*
   * Pure DB functions
   */

  //Get all users of an agency
  async getAllUsersByAgencyId(agencyId: string) {
    return await db.select().from(users).where(eq(users.agencyId, agencyId));
  },

  //Get unique user by id
  async getUserById(id: string) {
    return await db.select().from(users).where(eq(users.id, id)).limit(1);
  },

  //Get unique user by phone, role and agency id
  async getUserByPhoneRoleAgencyId(
    phone: string,
    role: UserRolesEnum,
    agencyId: string
  ) {
    return await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.phone, phone),
          eq(users.userRole, role),
          eq(users.agencyId, agencyId)
        )
      )
      .limit(1);
  },

  //Get all users by phone number (could be multiple)
  async getAllUsersByPhoneNumber(phone: string) {
    return await db
      .select()
      .from(users)
      .where(and(eq(users.phone, phone)));
  },

  //Get unique owner of an agency
  async getOwnerByAgencyId(agencyId: string) {
    return await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.agencyId, agencyId),
          eq(users.userRole, UserRolesEnum.OWNER)
        )
      )
      .limit(1);
  },

  //Get drivers of an agency
  async getDriversByAgencyId(agencyId: string) {
    return await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.agencyId, agencyId),
          eq(users.userRole, UserRolesEnum.DRIVER)
        )
      );
  },

  //Get agents & owner of an agency
  async getOwnerOrAgentsByAgencyId(agencyId: string) {
    return await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.agencyId, agencyId),
          inArray(users.userRole, [UserRolesEnum.AGENT, UserRolesEnum.OWNER])
        )
      );
  },

  //Get drivers by phone number
  async getDriversByPhoneNumber(phone: string) {
    return await db
      .select()
      .from(users)
      .where(
        and(eq(users.phone, phone), eq(users.userRole, UserRolesEnum.DRIVER))
      );
  },

  //Get owner/agents by phone number
  async getOwnerOrAgentsByPhoneNumber(phone: string) {
    return await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.phone, phone),
          inArray(users.userRole, [UserRolesEnum.AGENT, UserRolesEnum.OWNER])
        )
      );
  },

  //Get unique agent or owner in an agency by Phone Number
  async getAgencyUserByPhoneAgencyId(agencyId: string, phone: string) {
    return await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.agencyId, agencyId),
          eq(users.phone, phone),
          inArray(users.userRole, [UserRolesEnum.AGENT, UserRolesEnum.OWNER])
        )
      )
      .limit(1);
  },

  //Create user
  async createUser(data: InsertUserType) {
    return await db.insert(users).values(data);
  },

  // Store user's last login time
  async logUserLastLogin(userId: string) {
    return await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, userId))
      .returning();
  },

  // Store user's last logout time
  async logUserLastLogout(userId: string) {
    await db
      .update(users)
      .set({ lastLogout: new Date() })
      .where(eq(users.id, userId));
  },

  //Reset password
  async resetPassword(userId: string) {
    const newPassword = Math.random().toString(36).slice(-8); //Generate a random 8 character password
    const passwordHash = await generatePasswordHash(newPassword);

    await db
      .update(users)
      .set({ password: passwordHash })
      .where(eq(users.id, userId));

    return newPassword; //Return the new password to be sent to the user
  },

  /*
   * Business use cases
   */

  //Create Agency and Owner (Onboarding flow)
  async createAgencyAndOwner(data: AgencyOwnerCreationType) {
    //First, create a new agency
    const newAgencyData = await agencyServices.createAgency(data.agency);
    const ownerData = {
      ...data.owner,
      agencyId: newAgencyData[0]!.id,
      userRole: UserRolesEnum.OWNER,
      status: UserStatusEnum.NEW,
    };
    //Then, create the owner of this agency
    return await this.createUser(ownerData);
  },

  //Create Agent (Onboarding & Owner Account flow)
  async createAgentInAgencyId(data: InsertUserType, agencyId: string) {
    const existingUsers = await this.getOwnerOrAgentsByAgencyId(agencyId);

    //check existing users with same phone number
    const foundSamePhoneUsers = existingUsers.filter((user) => {
      user.phone === data.phone;
    });
    if (foundSamePhoneUsers.length > 0) {
      throw new Error(
        "Agent with same phone number already exists in this agency"
      );
    }
    //generate a new password
    const passwordHash = await generatePasswordHash(data.password);

    // TODO: send pwd in email

    return await this.createUser({
      ...data,
      userRole: UserRolesEnum.AGENT,
      status: UserStatusEnum.NEW,
      agencyId: agencyId,
      password: passwordHash,
    });
  },

  //Create Driver (Onboarding & Owner Account flow)
  async createDriverInAgencyId(data: InsertUserType, agencyId: string) {
    const existingUsers = await this.getDriversByAgencyId(agencyId);

    //check existing drivers with same phone number
    const foundSamePhoneUsers = existingUsers.filter((user) => {
      user.phone === data.phone;
    });
    if (foundSamePhoneUsers.length > 0) {
      throw new Error(
        "Agent with same phone number already exists in this agency"
      );
    }
    //generate a new password
    const passwordHash = await generatePasswordHash(data.password);

    // TODO: send pwd in email

    return await this.createUser({
      ...data,
      userRole: UserRolesEnum.DRIVER,
      status: UserStatusEnum.NEW,
      agencyId: agencyId,
      password: passwordHash,
    });
  },

  // Validate user credentials and login with phone number (and agencyId)
  async checkLoginCredentialsInDB(
    phone: string,
    password: string,
    agencyId?: string
  ) {
    //Look for agency users with this phone number
    const userFound = await this.getOwnerOrAgentsByPhoneNumber(phone);

    // If no user found, cannot login
    if (!userFound) {
      throw new Error("No user found with this phone number");
    }

    //If multiple users with same phone number, get the unique user by agency
    if (userFound.length > 1) {
      const uniqueUser = await this.getAgencyUserByPhoneAgencyId(
        agencyId!,
        phone
      );
      return this.loginUser(uniqueUser[0]!, password);
    } else {
      return this.loginUser(userFound[0]!, password);
    }
  },

  async loginUser(user: SelectUserType, password: string) {
    // Check if password matches
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Password does not match");
    }

    //Log User Login in DB and return user
    return await this.logUserLastLogin(user.id);
  },
};
