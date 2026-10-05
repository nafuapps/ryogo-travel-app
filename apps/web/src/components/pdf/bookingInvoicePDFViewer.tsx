"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { BookingInvoiceDocument } from "./getBookingInvoicePDF"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useIsMobile } from "@/hooks/useMobile"
import MobilePDFViewer from "./mobilePDFViewer"

export default function BookingInvoicePDFViewer({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      <MobilePDFViewer
        document={<BookingInvoiceDocument booking={booking} />}
        name={`${booking.id}-invoice.pdf`}
      />
    )
  }
  return (
    <PDFViewer className="w-full h-full">
      <BookingInvoiceDocument booking={booking} />
    </PDFViewer>
  )
}
