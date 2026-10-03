"use server"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { RateBookingByCustomerType } from "@ryogo-travel-app/api/types/booking.types"

export async function rateBookingByCustomerAction(
  data: RateBookingByCustomerType,
) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    redirect(
      currentUser.userRole === UserRolesEnum.DRIVER
        ? "/rider/home"
        : "/dashboard/home",
      RedirectType.replace,
    )
  }

  const updatedBooking =
    await bookingServices.changeBookingRatingByCustomer(data)
  if (!updatedBooking) {
    return
  }
  return updatedBooking
}
