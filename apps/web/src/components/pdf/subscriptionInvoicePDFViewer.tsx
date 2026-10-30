"use client"

import RyogoPDFViewerButton from "@/components/pdf/ryogoPDFViewerButton"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"
import { SubscriptionInvoiceDocument } from "./generateSubscriptionInvoicePDF"

export default function SubscriptionInvoicePDFViewerButton({
  order,
  label,
}: {
  order: FindAllOrdersByAgencyIdType[number]
  label: string
}) {
  return (
    <RyogoPDFViewerButton
      document={<SubscriptionInvoiceDocument order={order} />}
      fileName={`${order.id}-ryogo-invoice`}
      label={label}
    />
  )
}
