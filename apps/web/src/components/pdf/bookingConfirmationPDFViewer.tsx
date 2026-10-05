"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { BookingConfirmationDocument } from "./getBookingConfirmationPDF"
import MobilePDFViewer from "./mobilePDFViewer"
import { useIsMobile } from "@/hooks/useMobile"

export default function BookingInvoicePDFViewer({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      <MobilePDFViewer
        document={<BookingConfirmationDocument booking={booking} />}
        name={`${booking.id}-confirmation.pdf`}
      />
    )
  }
  return (
    <PDFViewer className="w-full h-full">
      <BookingConfirmationDocument booking={booking} />
    </PDFViewer>
  )
}
