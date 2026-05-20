"use client"

import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  PageWrapper,
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { PaginationControls } from "@/components/pagination/paginationControls"
import {
  OrderStatusPill,
  PaymentStatusPill,
} from "@/components/statusPills/statusPills"
import { RyogoCaption, RyogoH4, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { usePagination } from "@/hooks/usePagination"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"
import {
  OrderStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { ChevronDown, Dot, Download } from "lucide-react"
import moment from "moment"
import { useTranslations } from "next-intl"
import { useState } from "react"

const ORDERS_PER_PAGE = 10

export default function OrdersPageComponent({
  allOrders,
}: {
  allOrders: FindAllOrdersByAgencyIdType
}) {
  const t = useTranslations("Dashboard.AccountSubscriptionOrders")
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<
    OrderStatusEnum | "all"
  >("all")

  const selectedOrders =
    selectedOrderStatus === "all"
      ? allOrders
      : allOrders.filter((o) => {
          return o.status === selectedOrderStatus
        })

  //Pagination of orders
  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(selectedOrders, ORDERS_PER_PAGE)

  return (
    <PageWrapper id="AccountSubscriptionOrdersPage">
      <SectionRowWrapper center>
        <RyogoCaption color="light">{t("History")}</RyogoCaption>
        <Select
          value={selectedOrderStatus}
          onValueChange={(value: OrderStatusEnum | "all") =>
            setSelectedOrderStatus(value)
          }
        >
          <SelectTrigger className="self-end">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t("All")}</SelectItem>
              <SelectItem value={OrderStatusEnum.PAID}>{t("Paid")}</SelectItem>
              <SelectItem value={OrderStatusEnum.ATTEMPTED}>
                {t("Attempted")}
              </SelectItem>
              <SelectItem value={OrderStatusEnum.CREATED}>
                {t("Created")}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </SectionRowWrapper>
      {currentItems.length === 0 ? (
        <SectionWrapper id="NoOrders" center>
          <RyogoCaption color="light">{t("NoOrders")}</RyogoCaption>
        </SectionWrapper>
      ) : (
        currentItems.map((o) => {
          return <OrderCard order={o} key={o.id} />
        })
      )}
      {currentItems.length > 0 && (
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </PageWrapper>
  )
}

function OrderCard({ order }: { order: FindAllOrdersByAgencyIdType[number] }) {
  const t = useTranslations("Dashboard.AccountSubscriptionOrders")
  const [collapsed, setCollapsed] = useState(true)
  return (
    <SectionWrapper key={order.id} id={"Order#" + order.id}>
      <SectionRowWrapper center>
        <div
          className={`flex items-center justify-center shrink-0 transition rounded-lg hover:bg-slate-100 p-1.5 lg:p-2 ${
            collapsed ? "-rotate-90" : ""
          }`}
          onClick={() => setCollapsed(!collapsed)}
        >
          <RyogoIcon color="black" size="sm" icon={ChevronDown} thick />
        </div>
        <SectionRowWrapper wFull>
          <SectionColWrapper small>
            <RyogoSmall color="brand" weight="font-bold">
              {order.id}
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
              <a href={getFileUrl(order.invoiceUrl) + "?download"} download>
                <Button variant="outline">
                  <RyogoIcon size="sm" icon={Download} />
                  {t("DownloadInvoice")}
                </Button>
              </a>
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

function PaymentCard({
  payment,
}: {
  payment: FindAllOrdersByAgencyIdType[number]["payments"][number]
}) {
  return (
    <div className="flex bg-slate-100 p-3 lg:p-4 rounded-lg justify-between gap-2 lg:gap-3">
      <SectionColWrapper>
        <PaymentStatusPill status={payment.status} />
        <RyogoCaption color="slate" weight="font-bold">
          {payment.method.toUpperCase()}
        </RyogoCaption>
      </SectionColWrapper>
      <SectionColWrapper end>
        <RyogoCaption color="slate">
          {moment(payment.updatedAt).format("DD MMM YYYY - hh:mm A")}
        </RyogoCaption>
        {payment.bankName && (
          <RyogoCaption color="slate">{payment.bankName}</RyogoCaption>
        )}
        {payment.method === PaymentMethodEnum.CARD && (
          <RyogoCaption color="slate">{payment.cardId}</RyogoCaption>
        )}
        {payment.method === PaymentMethodEnum.UPI && (
          <RyogoCaption color="slate">{payment.vpa}</RyogoCaption>
        )}
        {payment.method === PaymentMethodEnum.WALLET && (
          <RyogoCaption color="slate">{payment.wallet}</RyogoCaption>
        )}
        {payment.status === PaymentStatusEnum.FAILED && (
          <RyogoCaption color="red">{payment.errorDesc}</RyogoCaption>
        )}
      </SectionColWrapper>
    </div>
  )
}
