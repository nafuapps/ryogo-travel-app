"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { LeadQuoteDocument } from "./getLeadQuotePDF"

export default function BookingQuotePDFViewer({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  return (
    <PDFViewer className="w-full h-full">
      <LeadQuoteDocument booking={booking} />
    </PDFViewer>
  )
}
