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
    return await notificationRepository.readFeedNotificationsByAgencyId(
      agencyId,
      queryStartDate,
    )
  },

  //Show 5 most recent feed notifications
  // async findDashboardActivity(agencyId: string, days:) {
  //   return await notificationRepository.readFeedNotificationsByAgencyId(
  //     agencyId,
  //     queryStartDate
  //   )
  // },

  async addNotification(notification: InsertNotificationType) {
    const newNotification =
      await notificationRepository.createNotification(notification)
    return newNotification[0]
  },
}

export type FindFeedNotificationsByAgencyIdType = Awaited<
  ReturnType<typeof notificationServices.findFeedNotificationsByAgencyId>
>
