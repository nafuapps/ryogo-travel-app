import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionWrapper,
  SectionRowWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { OrderStatusPill } from "@/components/pills/ryogoPills"
import { RyogoSmall, RyogoH4, RyogoCaption } from "@/components/typography"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { ChevronDown, Dot, Download } from "lucide-react"
import moment from "moment"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import PaymentCard from "./paymentCard"
import ViewInvoiceDialog from "./viewInvoiceDialog"

export default function OrderCard({
  order,
  agency,
}: {
  order: FindAllOrdersByAgencyIdType[number]
  agency: NonNullable<FindAgencyByIdType>
}) {
  const t = useTranslations("Dashboard.AccountSubscriptionOrders")
  const [collapsed, setCollapsed] = useState(true)
  return (
    <SectionWrapper key={order.id} id={"Order#" + order.id}>
      <SectionRowWrapper center>
        <div
          className={`flex items-center justify-center shrink-0 transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 lg:p-2 ${
            collapsed ? "-rotate-90" : ""
          }`}
          onClick={() => setCollapsed(!collapsed)}
        >
          <RyogoIcon color="black" size="sm" icon={ChevronDown} thick />
        </div>
        <SectionRowWrapper wFull>
          <SectionColWrapper small>
            <RyogoSmall color="brand" weight="font-bold">
              {"Order #" + order.id}
            </RyogoSmall>
            <OrderStatusPill status={order.status} />
          </SectionColWrapper>
          <SectionColWrapper end small>
            <RyogoH4 color="brand" weight="font-bold">
              {"₹" + order.amount}
            </RyogoH4>
            <SectionRowWrapper center small>
              <RyogoCaption color="light">
                {moment(order.updatedAt).format("DD MMM YYYY")}
              </RyogoCaption>
              <RyogoIcon color="light" size="sm" icon={Dot} thick />
              <RyogoCaption color="light">
                {order.orderType.toUpperCase()}
              </RyogoCaption>
            </SectionRowWrapper>
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionRowWrapper>
      {!collapsed && (
        <>
          <SectionRowWrapper center>
            <RyogoCaption color="light" weight="font-bold">
              {order.user.name}
            </RyogoCaption>
            {order.invoiceUrl && (
              <SectionRowWrapper small center>
                <a href={getFileUrl(order.invoiceUrl) + "?download"} download>
                  <Button variant="outline">
                    <RyogoIcon size="sm" icon={Download} color="slate" />
                    <RyogoCaption color="slate">
                      {t("DownloadInvoice")}
                    </RyogoCaption>
                  </Button>
                </a>
                <ViewInvoiceDialog order={order} agency={agency} />
              </SectionRowWrapper>
            )}
          </SectionRowWrapper>
          {order.payments.length > 0 && (
            <>
              <Separator />
              <SectionColWrapper>
                {order.payments.map((p) => {
                  return <PaymentCard payment={p} key={p.id} />
                })}
              </SectionColWrapper>
            </>
          )}
        </>
      )}
    </SectionWrapper>
  )
}
