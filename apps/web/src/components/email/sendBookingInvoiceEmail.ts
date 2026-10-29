import { BookingCompletedInvoiceEmailTemplate } from "@/components/email/bookingCompletedInvoiceEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { headers } from "next/headers"

export default async function sendBookingInvoiceEmail({
  bookingDetails,
  url,
  fileName,
}: {
  bookingDetails: NonNullable<FindBookingDetailsByIdType>
  url: string
  fileName: string
}) {
  if (!bookingDetails.customer.email) return

  const headerList = await headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const trackingUrl = `${protocol}://${host}/track/booking/${bookingDetails.id}`

  //Send invoice over email to the customer
  return await sendEmail({
    receipientEmail: [bookingDetails.customer.email],
    subject: "Booking Completed - Invoice | RyoGo",
    element: BookingCompletedInvoiceEmailTemplate({
      name: bookingDetails.customer.name,
      bookingId: bookingDetails.id,
      downloadUrl: url,
      route: `${bookingDetails.source.city} - ${bookingDetails.destination.city}`,
      trackUrl: trackingUrl,
      code: bookingDetails.secretCode,
    }),
    attachments: [{ filename: fileName, path: url }],
  })
}
