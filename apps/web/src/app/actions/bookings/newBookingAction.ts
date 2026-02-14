"use server"

import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { CreateNewBookingRequestType } from "@ryogo-travel-app/api/types/booking.types"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function newBookingAction(data: CreateNewBookingRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }
  const booking = await bookingServices.addNewBooking(data)
  if (!booking) return
  return booking
}
