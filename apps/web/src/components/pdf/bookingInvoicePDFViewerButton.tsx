"use client"

import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { BookingInvoiceDocument } from "./getBookingInvoicePDF"
import RyogoPDFViewerButton from "./ryogoPDFViewerButton"

export default function BookingInvoicePDFViewerButton({
  booking,
  label,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  label: string
}) {
  return (
    <RyogoPDFViewerButton
      document={<BookingInvoiceDocument booking={booking} />}
      fileName={`${booking.id}-invoice.pdf`}
      label={label}
    />
  )
}
