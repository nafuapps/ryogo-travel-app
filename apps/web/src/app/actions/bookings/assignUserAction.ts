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
  const assignedUserBooking = await bookingServices.assignUserToBooking(
    bookingId,
    selectedUserId,
  )
  if (!assignedUserBooking || !assignedUserBooking.assignedUserId) {
    return
  }

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingId,
    isFeed: true,
    textKey: "AssignedUser",
    textObject: {
      userName: assignedUserBooking.assignedUserName,
      bookingId: bookingId,
    },
    link: `/dashboard/bookings/${bookingId}`,
  })

  if (assignedUserBooking.assignedUserId !== currentUser.userId) {
    await missionServices.addMission({
      agencyId: agencyId,
      userId: assignedUserBooking.assignedUserId,
      entityType: EntityTypeEnum.BOOKING,
      entityId: bookingId,
      titleKey: "AssignedUser.Title",
      titleObject: { bookingId: bookingId },
      messageKey: "AssignedUser.Message",
      dueDate: assignedUserBooking.startDate,
      isCritical:
        differenceInDays(new Date(assignedUserBooking.startDate), new Date()) <=
        BOOKING_ASSIGNMENT_CRITICAL_DAYS,
      link: `/dashboard/bookings/${bookingId}`,
    })
  }

  return assignedUserBooking
}
