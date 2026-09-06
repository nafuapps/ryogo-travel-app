"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { BookingConfirmationDocument } from "./getBookingConfirmationPDF"

export default function BookingInvoicePDFViewer({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  return (
    <PDFViewer className="w-full h-full">
      <BookingConfirmationDocument booking={booking} />
    </PDFViewer>
  )
}
