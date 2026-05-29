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

  const assignedVehicleBooking = await bookingServices.assignVehicleToBooking(
    bookingId,
    selectedVehicleId,
  )
  if (!assignedVehicleBooking || !assignedVehicleBooking.assignedVehicleId) {
    return
  }

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.BOOKING,
    entityId: bookingId,
    isFeed: true,
    textKey: "AssignedVehicle",
    textObject: {
      vehicleNumber: assignedVehicleBooking.vehicleNumber,
      bookingId: bookingId,
    },
    link: `/dashboard/bookings/${bookingId}`,
  })

  if (
    assignedVehicleBooking.status === BookingStatusEnum.CONFIRMED &&
    assignedVehicleBooking.driverUserId &&
    assignedVehicleBooking.startDate &&
    differenceInDays(assignedVehicleBooking.startDate, new Date()) <=
      BOOKING_ASSIGNMENT_CRITICAL_DAYS
  ) {
    await missionServices.addMission({
      agencyId: agencyId,
      userId: assignedVehicleBooking.driverUserId,
      entityType: EntityTypeEnum.BOOKING,
      entityId: bookingId,
      titleKey: "AssignedVehicle.Title",
      titleObject: {
        bookingId: bookingId,
        vehicleNumber: assignedVehicleBooking.vehicleNumber,
      },
      messageKey: "AssignedVehicle.Message",
      isCritical: true,
      dueDate: assignedVehicleBooking.startDate,
      link: `/rider/myBookings/${bookingId}`,
    })
  }

  return assignedVehicleBooking
}
