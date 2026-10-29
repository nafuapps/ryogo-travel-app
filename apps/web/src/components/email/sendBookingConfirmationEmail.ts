import { ConfirmBookingEmailTemplate } from "@/components/email/confirmBookingEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { format } from "date-fns"
import { headers } from "next/headers"

export default async function sendBookingConfirmationEmail({
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

  await sendEmail({
    receipientEmail: [bookingDetails.customer.email],
    subject: "Booking Confirmation | RyoGo",
    element: ConfirmBookingEmailTemplate({
      name: bookingDetails.customer.name,
      bookingId: bookingDetails.id,
      downloadUrl: url,
      trackingUrl: trackingUrl,
      route: `${bookingDetails.source.city} - ${bookingDetails.destination.city}`,
      date: format(bookingDetails.startDate, "dd MMM"),
      assignedDriver: bookingDetails.assignedDriver?.name,
      assignedVehicle: bookingDetails.assignedVehicle?.vehicleNumber,
    }),
    attachments: [{ filename: fileName, path: url }],
  })
}
