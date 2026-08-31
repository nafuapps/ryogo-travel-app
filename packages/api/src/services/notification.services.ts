import { notificationRepository } from "../repositories/notification.repo"
import {
  NOTIFICATION_FEED_LIMIT,
  NOTIFICATION_FEED_WINDOW_DAYS,
} from "../apiConfig"
import { InsertNotificationType } from "@ryogo-travel-app/db/schema"

export const notificationServices = {
  async findFeedNotificationsByAgencyId(agencyId: string) {
    return await notificationRepository.readFeedNotificationsByAgencyId(
      agencyId,
      NOTIFICATION_FEED_LIMIT,
      NOTIFICATION_FEED_WINDOW_DAYS,
    )
  },

  //Show 5 most recent feed notifications
  async findDashboardActivity(agencyId: string) {
    return await notificationRepository.readFeedNotificationsByAgencyId(
      agencyId,
      5,
    )
  },

  async addNotification(notification: InsertNotificationType) {
    const newNotification =
      await notificationRepository.createNotification(notification)
    return newNotification[0]
  },
}

export type FindFeedNotificationsByAgencyIdType = Awaited<
  ReturnType<typeof notificationServices.findFeedNotificationsByAgencyId>
>
