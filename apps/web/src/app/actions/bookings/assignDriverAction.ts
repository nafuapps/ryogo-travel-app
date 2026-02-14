"use server"

import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

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
  return assignedDriver
}
