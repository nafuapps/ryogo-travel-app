import { db } from "@ryogo-travel-app/db";
import {
  users,
  UserRolesEnum,
  InsertUserType,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export const userRepository = {
  //Get unique user by id
  async getUserById(id: string) {
    return await db.select().from(users).where(eq(users.id, id));
  },

  //Get unique user by phone, roles and agency id
  async getUserByPhoneRolesAgencyId(
    phone: string,
    roles: UserRolesEnum[],
    agencyId: string
  ) {
    return await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.phone, phone),
          inArray(users.userRole, roles),
          eq(users.agencyId, agencyId)
        )
      );
  },

  //Get unique user by phone, role and email
  async getUserByPhoneRoleEmail(
    phone: string,
    roles: UserRolesEnum[],
    email: string
  ) {
    return await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.phone, phone),
          inArray(users.userRole, roles),
          eq(users.email, email)
        )
      );
  },

  //Get user by roles in an agency
  async getUserByRolesAgencyId(agencyId: string, userRoles: UserRolesEnum[]) {
    return await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(eq(users.agencyId, agencyId), inArray(users.userRole, userRoles))
      );
  },

  //Get user by roles and phone number
  async getUserByRolesPhone(phone: string, userRoles: UserRolesEnum[]) {
    return await db
      .select()
      .from(users)
      .where(and(eq(users.phone, phone), inArray(users.userRole, userRoles)));
  },

  //Get users with agency data by roles and phone number
  async getUserAccountsByPhone(phone: string) {
    return await db.query.users.findMany({
      columns: {
        id: true,
        phone: true,
        name: true,
        userRole: true,
        agencyId: true,
      },
      where: eq(users.phone, phone),
      with: {
        agency: { columns: { businessName: true } },
      },
    });
  },

  //Get users with agency data by roles and phone number
  async getUsersWithPhone(phone: string) {
    return await db.query.users.findMany({
      columns: {
        id: true,
      },
      where: eq(users.phone, phone),
    });
  },

  //Create user
  async createUser(data: InsertUserType) {
    return await db.insert(users).values(data).returning();
  },

  // Update user's last login time
  async updateLastLogin(userId: string, lastLogin: Date) {
    return await db
      .update(users)
      .set({ lastLogin: lastLogin })
      .where(eq(users.id, userId))
      .returning();
  },

  // Update user's last logout time
  async updateLastLogout(userId: string, lastLogout: Date) {
    return await db
      .update(users)
      .set({ lastLogout: lastLogout })
      .where(eq(users.id, userId))
      .returning();
  },

  //Update password
  async updatePassword(userId: string, password: string) {
    return await db
      .update(users)
      .set({ password: password })
      .where(eq(users.id, userId))
      .returning({ id: users.id });
  },

  //Update password
  async updatePhotoUrl(userId: string, photoUrl: string) {
    return await db
      .update(users)
      .set({ photoUrl: photoUrl })
      .where(eq(users.id, userId))
      .returning();
  },

  //Update user status
  async updateUserStatus(userId: string, status: UserStatusEnum) {
    return await db
      .update(users)
      .set({ status: status })
      .where(eq(users.id, userId))
      .returning();
  },

  //Delete user
  async deleteUser(userId: string) {
    return await db.delete(users).where(eq(users.id, userId)).returning();
  },
};
