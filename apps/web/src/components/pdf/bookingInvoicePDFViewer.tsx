"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { BookingInvoiceDocument } from "@/components/pdf/getBookingInvoicePDF"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
export default function BookingInvoicePDFViewer({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  return (
    <PDFViewer className="lg:col-span-2 w-full h-screen">
      <BookingInvoiceDocument booking={booking} />
    </PDFViewer>
  )
}
