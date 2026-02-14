"use server"

import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

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
  return assignedVehicle
}
