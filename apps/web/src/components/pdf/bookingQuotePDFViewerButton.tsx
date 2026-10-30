"use client"

import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { LeadQuoteDocument } from "./getLeadQuotePDF"
import RyogoPDFViewerButton from "./ryogoPDFViewerButton"

export default function BookingQuotePDFViewerButton({
  booking,
  label,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  label: string
}) {
  return (
    <RyogoPDFViewerButton
      document={<LeadQuoteDocument booking={booking} />}
      fileName={`${booking.id}-quote.pdf`}
      label={label}
    />
  )
}
