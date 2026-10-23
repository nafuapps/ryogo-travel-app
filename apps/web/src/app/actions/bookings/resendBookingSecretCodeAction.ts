"use server"

import { BookingResendCodeEmailTemplate } from "@/components/email/bookingResendCodeEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { readPermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { headers } from "next/headers"

export async function resendBookingSecretCodeAction(bookingId: string) {
  await readPermissions.redirectIfAuthenticated()

  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (
    !bookingDetails ||
    bookingDetails.status !== BookingStatusEnum.COMPLETED ||
    bookingDetails.ratingByCustomer ||
    !bookingDetails.customer.email
  ) {
    return
  }

  let secretCode = bookingDetails.secretCode
  if (!secretCode) {
    const bookingWithCode = await bookingServices.addSecretCode(bookingId)
    if (!bookingWithCode || !bookingWithCode.secretCode) {
      return
    }
    secretCode = bookingWithCode.secretCode
  }

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
      code: secretCode,
    }),
  })
  if (!result.data) {
    return
  }
  const updatedBooking = await bookingServices.changeSecretCodeSentOn(bookingId)

  return updatedBooking
}
