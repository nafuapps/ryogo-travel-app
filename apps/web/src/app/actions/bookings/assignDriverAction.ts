"use server"

import { getCurrentUser } from "@/lib/auth"
import { BOOKING_ASSIGNMENT_CRITICAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"

export async function assignDriverAction(
  bookingId: string,
  selectedDriverId: string,
  agencyId: string,
  assignedUserId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      assignedUserId !== currentUser.userId) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  const assignedDriver = await bookingServices.assignDriverToBooking(
    bookingId,
    selectedDriverId,
  )
  if (!assignedDriver || !assignedDriver.assignedDriverId) {
    return
  }

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingId,
    isFeed: true,
    textKey: "AssignedDriver",
    textObject: { driverName: assignedDriver.driverName, bookingId: bookingId },
    link: `/dashboard/bookings/${bookingId}`,
  })
  await missionServices.addMission({
    agencyId: agencyId,
    userId: assignedDriver.driverUserId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingId,
    titleKey: "AssignedDriver.Title",
    titleObject: { bookingId: bookingId },
    messageKey: "AssignedDriver.Message",
    dueDate: assignedDriver.startDate,
    isCritical:
      differenceInDays(new Date(assignedDriver.startDate), new Date()) <=
      BOOKING_ASSIGNMENT_CRITICAL_DAYS,
    link: `/rider/myBookings/${bookingId}`,
  })

  return assignedDriver
}
