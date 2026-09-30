"use server"

import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum, BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { headers } from "next/headers"
import { BookingResendCodeEmailTemplate } from "@/components/email/bookingResendCodeEmailTemplate"

export async function resendBookingSecretCodeAction(bookingId: string) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    redirect(
      currentUser.userRole === UserRolesEnum.DRIVER
        ? "/rider/home"
        : "/dashboard/home",
      RedirectType.replace,
    )
  }

  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (
    !bookingDetails ||
    bookingDetails.status !== BookingStatusEnum.COMPLETED ||
    bookingDetails.ratingByCustomer ||
    !bookingDetails.customer.email ||
    !bookingDetails.secretCode
  )
    return

  const headerList = await headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const trackingUrl = `${protocol}://${host}/track/booking/${bookingDetails.id}`

  //Send invoice over email to the customer
  const result = await sendEmail({
    receipientEmail: [bookingDetails.customer.email],
    subject: "Booking Secret Code | RyoGo",
    element: BookingResendCodeEmailTemplate({
      name: bookingDetails.customer.name,
      trackUrl: trackingUrl,
      code: bookingDetails.secretCode,
    }),
  })
  if (!result.data) {
    return
  }
  const updatedBooking = await bookingServices.changeSecretCodeSentOn(bookingId)

  return updatedBooking
}
