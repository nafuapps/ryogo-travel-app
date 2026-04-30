"use server"

import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function cancelBookingAction(
  id: string,
  agencyId: string,
  assignedUserId: string,
  notifyCustomer = false,
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

  const canceledBooking = await bookingServices.cancelBooking(id)
  if (!canceledBooking) return

  if (notifyCustomer) {
    //TODO: Send booking cancellation pdf to customer over whatsapp
  }

  return canceledBooking
}
