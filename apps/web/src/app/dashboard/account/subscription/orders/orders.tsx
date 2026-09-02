"use client"

import {
  PageWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { RyogoCaption } from "@/components/typography"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePagination } from "@/hooks/usePagination"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"
import { OrderStatusEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useState } from "react"
import OrderCard from "@/components/flows/orders/orderCard"

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
