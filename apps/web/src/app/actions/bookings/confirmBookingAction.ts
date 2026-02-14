"use server"

import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function confirmBookingAction(
  id: string,
  agencyId: string,
  assignedUserId: string,
  startTime: string,
  pickupAddress: string,
  dropAddress: string,
  updateCustomerAddress?: boolean,
  customerId?: string,
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

  const confirmedBooking = await bookingServices.confirmBooking(
    id,
    startTime,
    pickupAddress,
    dropAddress,
    updateCustomerAddress,
    customerId,
  )
  if (!confirmedBooking) return
  return confirmedBooking
}
