"use client"

import { BookingInvoiceDocument } from "./getBookingInvoicePDF"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import RyogoPDFViewerButton from "./ryogoPDFViewerButton"
import { Eye } from "lucide-react"

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
      icon={Eye}
    />
  )
}
