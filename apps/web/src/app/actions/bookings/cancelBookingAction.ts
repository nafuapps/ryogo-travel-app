"use server"

import getCancellationMessage from "@/components/whatsapp/getCancellationMessage"
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
    const bookingDetails = await bookingServices.findBookingDetailsById(id)
    if (!bookingDetails) return

    //Send booking cancellation pdf to customer over whatsapp
    const cancelMessage = await getCancellationMessage(
      bookingDetails.customer.phone,
      bookingDetails.customer.name,
      bookingDetails.id,
      bookingDetails.source.city,
      bookingDetails.destination.city,
      bookingDetails.startDate.toLocaleDateString(),
      bookingDetails.assignedUser.phone,
    )
    return cancelMessage
  }

  return canceledBooking
}
