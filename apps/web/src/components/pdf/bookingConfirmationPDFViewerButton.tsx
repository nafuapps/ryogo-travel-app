"use client"

import RyogoPDFViewerButton from "./ryogoPDFViewerButton"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { BookingConfirmationDocument } from "./getBookingConfirmationPDF"
import { Eye } from "lucide-react"

export default function BookingConfirmationPDFViewerButton({
  booking,
  label,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  label: string
}) {
  return (
    <RyogoPDFViewerButton
      document={<BookingConfirmationDocument booking={booking} />}
      fileName={`${booking.id}-confirmation.pdf`}
      label={label}
      icon={Eye}
    />
  )
}
