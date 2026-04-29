"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { InvoiceDocument } from "@/components/pdf/getInvoicePDF"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
export default function BookingPDFViewer({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  return (
    <PDFViewer className="lg:col-span-2 w-full h-screen">
      <InvoiceDocument booking={booking} />
    </PDFViewer>
  )
}
