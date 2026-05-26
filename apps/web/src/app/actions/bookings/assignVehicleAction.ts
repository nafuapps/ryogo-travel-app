"use server"

import { getCurrentUser } from "@/lib/auth"
import { BOOKING_ASSIGNMENT_CRITICAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import {
  BookingStatusEnum,
  EntityTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"

export async function assignVehicleAction(
  bookingId: string,
  selectedVehicleId: string,
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

  const assignedVehicle = await bookingServices.assignVehicleToBooking(
    bookingId,
    selectedVehicleId,
  )
  if (!assignedVehicle || !assignedVehicle.assignedVehicleId) {
    return
  }

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingId,
    isFeed: true,
    textKey: "AssignedVehicle",
    textObject: {
      vehicleNumber: assignedVehicle.vehicleNumber,
      bookingId: bookingId,
    },
    link: `/dashboard/bookings/${bookingId}`,
  })

  if (
    assignedVehicle.status === BookingStatusEnum.CONFIRMED &&
    assignedVehicle.driverUserId &&
    assignedVehicle.startDate &&
    differenceInDays(assignedVehicle.startDate, new Date()) <=
      BOOKING_ASSIGNMENT_CRITICAL_DAYS
  ) {
    await missionServices.addMission({
      agencyId: agencyId,
      userId: assignedVehicle.driverUserId,
      entityType: EntityTypeEnum.BOOKING,
      entityId: bookingId,
      titleKey: "AssignedVehicle.Title",
      titleObject: {
        bookingId: bookingId,
        vehicleNumber: assignedVehicle.vehicleNumber,
      },
      messageKey: "AssignedVehicle.Message",
      isCritical: true,
      dueDate: assignedVehicle.startDate,
      link: `/rider/myBookings/${bookingId}`,
    })
  }

  return assignedVehicle
}
