import { eq, and, gte } from "drizzle-orm"
import { db } from "@ryogo-travel-app/db"
import {
  InsertNotificationType,
  notifications,
} from "@ryogo-travel-app/db/schema"
import { subDays } from "date-fns"

export const notificationRepository = {
  async readFeedNotificationsByAgencyId(agencyId: string, days: number) {
    return db.query.notifications.findMany({
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
      where: and(
        eq(notifications.agencyId, agencyId),
        eq(notifications.isFeed, true),
        gte(notifications.createdAt, subDays(new Date(), days)),
      ),
    })
  },

  async createNotification(notification: InsertNotificationType) {
    return await db.insert(notifications).values(notification).returning()
  },
}
