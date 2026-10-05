"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { LeadQuoteDocument } from "./getLeadQuotePDF"
import { useIsMobile } from "@/hooks/useMobile"
import MobilePDFViewer from "./mobilePDFViewer"

export default function BookingQuotePDFViewer({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      <MobilePDFViewer
        document={<LeadQuoteDocument booking={booking} />}
        name={`${booking.id}-quote.pdf`}
      />
    )
  }
  return (
    <PDFViewer className="w-full h-full">
      <LeadQuoteDocument booking={booking} />
    </PDFViewer>
  )
}
