"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { SubscriptionInvoiceDocument } from "./generateSubscriptionInvoicePDF"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"

export default function SubscriptionInvoicePDFViewer({
  order,
}: {
  order: FindAllOrdersByAgencyIdType[number]
}) {
  return (
    <PDFViewer className="lg:col-span-2 w-full h-screen">
      <SubscriptionInvoiceDocument order={order} />
    </PDFViewer>
  )
}
