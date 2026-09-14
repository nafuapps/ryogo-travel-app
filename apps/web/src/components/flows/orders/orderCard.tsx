import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionWrapper,
  SectionRowWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { OrderStatusPill } from "@/components/pills/ryogoPills"
import {
  RyogoSmall,
  RyogoH4,
  RyogoCaption,
  RyogoTiny,
} from "@/components/typography"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { ChevronDown, Dot, Download } from "lucide-react"
import moment from "moment"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import PaymentCard from "./paymentCard"
import ViewInvoiceDialog from "./viewInvoiceDialog"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

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
      <SectionRowWrapper className="items-center justify-between">
        <div
          className={`flex items-center justify-center shrink-0 transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 lg:p-2 ${
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
            <RyogoCaption color="light">{order.orderType}</RyogoCaption>
          </SectionColWrapper>
          <SectionColWrapper small className="items-end">
            <OrderStatusPill status={order.status} />
            <RyogoSmall color="slate">{order.user.name}</RyogoSmall>
            <RyogoTiny color="light">
              {moment(order.updatedAt).format("lll")}
            </RyogoTiny>
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionRowWrapper>
      {!collapsed && (
        <>
          {order.orderInvoiceUrl && (
            <SectionRowWrapper small className="items-center justify-end">
              <a
                href={getFileUrl(order.orderInvoiceUrl) + "?download"}
                download
              >
                <RyogoOutlineButton
                  label={t("DownloadInvoice")}
                  labelColor="light"
                  className="w-full"
                >
                  <RyogoIcon size="sm" icon={Download} color="slate" />
                </RyogoOutlineButton>
              </a>
              <ViewInvoiceDialog order={order} agency={agency} />
            </SectionRowWrapper>
          )}
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
