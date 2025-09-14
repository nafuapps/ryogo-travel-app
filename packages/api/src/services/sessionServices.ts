import { db } from "@ryogo-travel-app/db";
import { sessions, InsertSessionType } from "@ryogo-travel-app/db/schema";
import { eq } from "drizzle-orm";

export const sessionServices = {
  //Get session by id
  async getSessionById(sessionId: string) {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);
  },

  //Create session
  async createSession(data: InsertSessionType) {
    return await db.insert(sessions).values(data).returning();
  },

  //Update session
  async updateSessionExpiringTime(sessionId: string, expiresAt: Date) {
    return await db
      .update(sessions)
      .set({ expiresAt })
      .where(eq(sessions.id, sessionId));
  },

  //Delete session
  async deleteSession(sessionId: string) {
    return await db
      .delete(sessions)
      .where(eq(sessions.id, sessionId))
      .returning();
  },
};
