import { db } from "@ryogo-travel-app/db";
import {
  users,
  UserStatusEnum,
  UserRolesEnum,
  InsertUserType,
  InsertAgencyType,
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
  //Get all users of an agency
  async getAllUsersByAgencyId(agencyId: string) {
    return await db.select().from(users).where(eq(users.agencyId, agencyId));
  },

  //Get user by id
  async getUserById(id: string) {
    return await db.select().from(users).where(eq(users.id, id)).limit(1);
  },

  //Get user by phone
  async getUserByPhone(phone: string) {
    return await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  },

  //Get users by phone number
  async getUsersByPhoneNumber(phone: string) {
    return await db
      .select()
      .from(users)
      .where(and(eq(users.phone, phone)));
  },

  //Get owner of an agency
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

  //Get agents/owner of an agency
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
  async getAgencyAppUsersByPhoneNumber(phone: string) {
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

  //Create user
  async createUser(data: InsertUserType) {
    return await db.insert(users).values(data);
  },

  //Create Agency and Owner
  async createAgencyAndOwner(data: AgencyOwnerCreationType) {
    //First, check if an owner with same phone number already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.phone, data.owner.phone),
          eq(users.userRole, UserRolesEnum.OWNER)
        )
      )
      .limit(1);

    if (existingUser[0]) {
      throw new Error("Owner with this phone number already exists");
    }
    //If not, create a new agency
    const newAgencyData = await agencyServices.createAgency(data.agency);
    const ownerData = {
      ...data.owner,
      agencyId: newAgencyData[0].id,
      userRole: UserRolesEnum.OWNER,
      status: UserStatusEnum.ACTIVE,
    };
    //Finally, create the owner of this agency
    return await this.createUser(ownerData);
  },

  //Check and create Agent
  async createAgentInAgencyId(data: InsertUserType, agencyId: string) {
    const existingUsers = await this.getOwnerOrAgentsByAgencyId(agencyId);

    //check existing users with same phone number
    const foundSamePhoneUsers = existingUsers.filter((user) => {
      user.phone === data.phone;
    });
    if (foundSamePhoneUsers.length > 0) {
      throw new Error("Agency User with same phone number already exists");
    }
    //generate a new password
    const passwordHash = await generatePasswordHash(data.password);

    //send it in email

    return await this.createUser({
      ...data,
      userRole: UserRolesEnum.AGENT,
      status: UserStatusEnum.NEW,
      agencyId: agencyId,
      password: passwordHash,
    });
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

  // Login user - Validate user credentials and login with phone number
  async checkLoginCredentialsInDB(phone: string, password: string) {
    //Look for user with this phone number
    const userFound = await this.getUserByPhone(phone);

    if (!userFound) {
      throw new Error("No user found with this phone number");
    }

    const valid = await bcrypt.compare(password, userFound[0].password);

    if (!valid) {
      throw new Error("Password does not match");
    }

    return await this.logUserLastLogin(userFound[0].id);
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
};
