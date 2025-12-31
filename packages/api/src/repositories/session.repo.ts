import { db } from "@ryogo-travel-app/db"
import { sessions, InsertSessionType } from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"

export const sessionRepository = {
  //Get session by id
  async readSessionById(sessionId: string) {
    return await db.select().from(sessions).where(eq(sessions.id, sessionId))
  },

  //Get session by token
  async readSessionByToken(token: string) {
    return await db.select().from(sessions).where(eq(sessions.token, token))
  },

  //Create session
  async createSession(data: InsertSessionType) {
    return await db.insert(sessions).values(data).returning()
  },

  //Update session expiring time
  async updateSessionExpiringTime(sessionId: string, expiresAt: Date) {
    return await db
      .update(sessions)
      .set({ expiresAt })
      .where(eq(sessions.id, sessionId))
      .returning()
  },

  //Delete session by Id
  async deleteSession(sessionId: string) {
    return await db
      .delete(sessions)
      .where(eq(sessions.id, sessionId))
      .returning()
  },
}
