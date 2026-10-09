import { notificationRepository } from "../repositories/notification.repo"
import { BASIC_SEARCH_LIMIT_DAYS } from "../apiConfig"
import { InsertNotificationType } from "@ryogo-travel-app/db/schema"
import { subDays } from "date-fns"

export const notificationServices = {
  async findFeedNotificationsByAgencyId(
    agencyId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryStartDate = subDays(new Date(), days)
    const notifications =
      await notificationRepository.readFeedNotificationsByAgencyId({
        agencyId,
        queryStartDate,
      })
    return notifications
  },

  async findNotificationsByUserId(
    userId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryStartDate = subDays(new Date(), days)
    const notifications =
      await notificationRepository.readNotificationsByUserId({
        userId,
        queryStartDate,
      })
    return notifications
  },

  async addNotification(notification: InsertNotificationType) {
    const [newNotification] =
      await notificationRepository.createNotification(notification)
    return newNotification
  },

  async removeNotificationByEntityAndKey({
    agencyId,
    entityId,
    textKey,
  }: {
    agencyId: string
    entityId: string
    textKey: string
  }) {
    await notificationRepository.deleteNotificationByEntityAndKey({
      agencyId,
      entityId,
      textKey,
    })
  },
}

export type FindFeedNotificationsByAgencyIdType = Awaited<
  ReturnType<typeof notificationServices.findFeedNotificationsByAgencyId>
>

export type FindNotificationsByUserIdType = Awaited<
  ReturnType<typeof notificationServices.findNotificationsByUserId>
>
