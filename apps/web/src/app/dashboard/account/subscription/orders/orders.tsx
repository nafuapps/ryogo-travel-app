"use client"

import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  PageWrapper,
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { PaginationControls } from "@/components/pagination/paginationControls"
import SubscriptionInvoicePDFViewer from "@/components/pdf/subscriptionInvoicePDFViewer"
import {
  OrderStatusPill,
  PaymentStatusPill,
} from "@/components/pills/ryogoPills"
import { RyogoCaption, RyogoH4, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"
import {
  OrderStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { ChevronDown, Dot, Download, Eye } from "lucide-react"
import moment from "moment"
import { useTranslations } from "next-intl"
import { useState } from "react"

const ORDERS_PER_PAGE = 10

type OrderFilterType = OrderStatusEnum | "all"

export default function OrdersPageComponent({
  allOrders,
  agencyDetails,
}: {
  allOrders: FindAllOrdersByAgencyIdType
  agencyDetails: NonNullable<FindAgencyByIdType>
}) {
  const t = useTranslations("Dashboard.AccountSubscriptionOrders")
  const [selectedOrderStatus, setSelectedOrderStatus] =
    useState<OrderFilterType>("all")

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
        <OrderFilterSelect
          selectedOrderStatus={selectedOrderStatus}
          setSelectedOrderStatus={setSelectedOrderStatus}
        />
      </SectionRowWrapper>
      {currentItems.length === 0 ? (
        <SectionWrapper id="NoOrders" center>
          <RyogoCaption color="light">{t("NoOrders")}</RyogoCaption>
        </SectionWrapper>
      ) : (
        currentItems.map((o) => {
          return <OrderCard order={o} key={o.id} agency={agencyDetails} />
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

function OrderFilterSelect({
  selectedOrderStatus,
  setSelectedOrderStatus,
}: {
  selectedOrderStatus: OrderFilterType
  setSelectedOrderStatus: (value: OrderFilterType) => void
}) {
  const t = useTranslations("Dashboard.AccountSubscriptionOrders")

  return (
    <Select
      value={selectedOrderStatus}
      onValueChange={(value: OrderFilterType) => setSelectedOrderStatus(value)}
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
  )
}

function OrderCard({
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

function PaymentCard({
  payment,
}: {
  payment: FindAllOrdersByAgencyIdType[number]["payments"][number]
}) {
  return (
    <div className="flex bg-slate-100 p-3 lg:p-4 rounded-lg justify-between gap-2 lg:gap-3">
      <SectionColWrapper>
        <RyogoSmall color="brand" weight="font-bold">
          {"Payment #" + payment.id}
        </RyogoSmall>
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
          <RyogoSmall>{payment.bankName.toUpperCase()}</RyogoSmall>
        )}
        {payment.method === PaymentMethodEnum.CARD && payment.cardId && (
          <RyogoCaption color="slate">{payment.cardId}</RyogoCaption>
        )}
        {payment.method === PaymentMethodEnum.UPI && payment.vpa && (
          <RyogoCaption color="slate">{payment.vpa}</RyogoCaption>
        )}
        {payment.method === PaymentMethodEnum.WALLET && payment.wallet && (
          <RyogoCaption color="slate">
            {payment.wallet.toUpperCase()}
          </RyogoCaption>
        )}
        {payment.status === PaymentStatusEnum.FAILED &&
          payment.errorReason &&
          payment.errorSource && (
            <RyogoCaption color="red">
              {payment.errorReason + " (" + payment.errorSource + ")"}
            </RyogoCaption>
          )}
      </SectionColWrapper>
    </div>
  )
}

function ViewInvoiceDialog({
  order,
  agency,
}: {
  order: FindAllOrdersByAgencyIdType[number]
  agency: NonNullable<FindAgencyByIdType>
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <RyogoIcon size="sm" icon={Eye} color="slate" />
        </Button>
      </DialogTrigger>
      <DialogContent className="size-5/6 overflow-scroll">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <SubscriptionInvoicePDFViewer order={order} agency={agency} />
      </DialogContent>
    </Dialog>
  )
}
