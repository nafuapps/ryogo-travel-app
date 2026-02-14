"use server"

import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

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
  if (!assignedUser) {
    return
  }
  return assignedUser
}
