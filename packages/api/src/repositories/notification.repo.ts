import { eq, and, gte } from "drizzle-orm"
import { db } from "@ryogo-travel-app/db"
import {
  InsertNotificationType,
  notifications,
} from "@ryogo-travel-app/db/schema"

export const notificationRepository = {
  async readFeedNotificationsByAgencyId(
    agencyId: string,
    queryStartDate: Date,
  ) {
    return await db.query.notifications.findMany({
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
      where: and(
        eq(notifications.agencyId, agencyId),
        eq(notifications.isFeed, true),
        gte(notifications.createdAt, queryStartDate),
      ),
    })
  },

  async readNotificationsByUserId(userId: string, queryStartDate: Date) {
    return await db.query.notifications.findMany({
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
      where: and(
        eq(notifications.userId, userId),
        gte(notifications.createdAt, queryStartDate),
      ),
    })
  },

  async createNotification(notification: InsertNotificationType) {
    return await db.insert(notifications).values(notification).returning()
  },

  async deleteNotificationByEntityAndKey(
    agencyId: string,
    entityId: string,
    textKey: string,
  ) {
    return await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.agencyId, agencyId),
          eq(notifications.entityId, entityId),
          eq(notifications.textKey, textKey),
        ),
      )
  },
}
