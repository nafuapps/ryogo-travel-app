"use server"

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum, BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export async function findBookingAction(bookingId: string) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    redirect(
      currentUser.userRole === UserRolesEnum.DRIVER
        ? "/rider/home"
        : "/dashboard/home",
      RedirectType.replace,
    )
  }
  const bookingDetails = await bookingServices.findBookingStatusById(bookingId)
  if (!bookingDetails || bookingDetails.status === BookingStatusEnum.LEAD) {
    return
  }

  return bookingDetails
}
