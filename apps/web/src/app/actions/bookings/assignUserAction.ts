"use server"

import { getCurrentUser } from "@/lib/auth"
import { BOOKING_ASSIGNMENT_CRITICAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"

export async function assignUserAction(
  bookingId: string,
  selectedUserId: string,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }
  const assignedUser = await bookingServices.assignUserToBooking(
    bookingId,
    selectedUserId,
  )
  if (!assignedUser || !assignedUser.assignedUserId) {
    return
  }

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingId,
    isFeed: true,
    textKey: "AssignedUser",
    textObject: {
      userName: assignedUser.assignedUserName,
      bookingId: bookingId,
    },
    link: `/dashboard/bookings/${bookingId}`,
  })
  await missionServices.addMission({
    agencyId: agencyId,
    userId: assignedUser.assignedUserId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingId,
    titleKey: "AssignedUser.Title",
    titleObject: { bookingId: bookingId },
    messageKey: "AssignedUser.Message",
    dueDate: assignedUser.startDate,
    isCritical:
      differenceInDays(new Date(assignedUser.startDate), new Date()) <=
      BOOKING_ASSIGNMENT_CRITICAL_DAYS,
    link: `/dashboard/bookings/${bookingId}`,
  })

  return assignedUser
}
