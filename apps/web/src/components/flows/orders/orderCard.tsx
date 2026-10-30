"use client"

import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import SubscriptionInvoicePDFViewerButton from "@/components/pdf/subscriptionInvoicePDFViewer"
import { OrderStatusPill } from "@/components/pills/ryogoPills"
import {
  RyogoCaption,
  RyogoH4,
  RyogoSmall,
  RyogoTiny,
} from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"
import { ChevronDown } from "lucide-react"
import moment from "moment"
import { useTranslations } from "next-intl"
import { useState } from "react"
import PaymentCard from "./paymentCard"

export default function OrderCard({
  order,
}: {
  order: FindAllOrdersByAgencyIdType[number]
}) {
  const t = useTranslations("Dashboard.AccountSubscriptionOrders")
  const [collapsed, setCollapsed] = useState(true)
  return (
    <SectionWrapper key={order.id} id={"Order#" + order.id}>
      <SectionRowWrapper className="items-center justify-between">
        <div
          className={`flex items-center justify-center shrink-0 transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 lg:p-2 ${
            collapsed ? "-rotate-90" : ""
          }`}
          onClick={() => setCollapsed(!collapsed)}
        >
          <RyogoIcon color="black" size="sm" icon={ChevronDown} thick />
        </div>
        <SectionRowWrapper className="w-full justify-between">
          <SectionColWrapper small>
            <RyogoCaption color="light" weight="font-bold">
              {"ORDER #" + order.id}
            </RyogoCaption>
            <RyogoH4 color="brand" weight="font-bold">
              {"₹" + order.amount}
            </RyogoH4>
            <RyogoTiny color="light">
              {moment(order.updatedAt).format("lll")}
            </RyogoTiny>
          </SectionColWrapper>
          <SectionColWrapper small className="items-end">
            <OrderStatusPill status={order.status} />
            <RyogoSmall color="slate" weight="font-bold">
              {order.user.name}
            </RyogoSmall>
            <RyogoCaption color="light">{order.orderType}</RyogoCaption>
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionRowWrapper>
      <SectionColWrapper className={`${collapsed ? "hidden" : ""}`}>
        {order.orderInvoiceUrl && (
          <SubscriptionInvoicePDFViewerButton
            order={order}
            label={t("ViewInvoice")}
          />
        )}
        {order.payments.length > 0 && (
          <>
            <Separator />
            {order.payments.map((p) => {
              return <PaymentCard payment={p} key={p.id} />
            })}
          </>
        )}
      </SectionColWrapper>
    </SectionWrapper>
  )
}
