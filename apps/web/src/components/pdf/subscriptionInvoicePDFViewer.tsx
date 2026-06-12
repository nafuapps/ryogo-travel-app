"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { SubscriptionInvoiceDocument } from "./generateSubscriptionInvoicePDF"
import { FindOrderByRPIdType } from "@ryogo-travel-app/api/services/order.services"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
export default function SubscriptionInvoicePDFViewer({
  order,
  agency,
}: {
  order: NonNullable<FindOrderByRPIdType>
  agency: NonNullable<FindAgencyByIdType>
}) {
  return (
    <PDFViewer className="lg:col-span-2 w-full h-screen">
      <SubscriptionInvoiceDocument order={order} agency={agency} />
    </PDFViewer>
  )
}
