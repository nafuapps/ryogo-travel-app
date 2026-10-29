import { LeadBookingEmailTemplate } from "@/components/email/leadBookingEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { format } from "date-fns"

export default async function sendBookingQuoteEmail({
  bookingDetails,
  url,
  fileName,
}: {
  bookingDetails: NonNullable<FindBookingDetailsByIdType>
  url: string
  fileName: string
}) {
  if (!bookingDetails.customer.email) return

  await sendEmail({
    receipientEmail: [bookingDetails.customer.email],
    subject: "Booking Quotation | RyoGo",
    element: LeadBookingEmailTemplate({
      name: bookingDetails.customer.name,
      bookingId: bookingDetails.id,
      downloadUrl: url,
      route: `${bookingDetails.source.city} - ${bookingDetails.destination.city}`,
      date: format(bookingDetails.startDate, "dd MMM"),
    }),
    attachments: [{ filename: fileName, path: url }],
  })
}
