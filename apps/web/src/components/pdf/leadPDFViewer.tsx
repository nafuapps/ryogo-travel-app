"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { FindLeadBookingByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { LeadQuoteDocument } from "@/components/pdf/getLeadQuotePDF"
export default function LeadPDFViewer({
  booking,
}: {
  booking: NonNullable<FindLeadBookingByIdType>
}) {
  return (
    <PDFViewer className="lg:col-span-2 w-full h-screen">
      <LeadQuoteDocument booking={booking} />
    </PDFViewer>
  )
}
