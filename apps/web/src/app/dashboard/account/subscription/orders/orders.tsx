"use client"

import { PageWrapper, SectionRowWrapper } from "@/components/page/pageWrappers"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { RyogoP } from "@/components/typography"
import { usePagination } from "@/hooks/usePagination"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"
import { OrderStatusEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useTransition } from "react"
import OrderCard from "@/components/flows/orders/orderCard"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Route } from "next"
import SelectFilter from "@/components/filter/selectFilter"

const ORDERS_PER_PAGE = 5

export default function OrdersPageComponent({
  allOrders,
}: {
  allOrders: FindAllOrdersByAgencyIdType
}) {
  const t = useTranslations("Dashboard.AccountSubscriptionOrders")

  const searchParams = useSearchParams()
  const status = searchParams.get("status")

  //Filter orders by status searchParam in URL
  const filteredOrders = status
    ? allOrders.filter((o) => o.status === status)
    : allOrders

  //Pagination of orders
  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(filteredOrders, ORDERS_PER_PAGE)

  return (
    <PageWrapper id="AccountSubscriptionOrdersPage">
      <SectionRowWrapper className="items-center justify-between">
        <RyogoP color="light">
          {t("History") + " (" + allOrders.length + ")"}
        </RyogoP>
        <OrderFilterSelect />
      </SectionRowWrapper>
      {currentItems.map((o) => {
        return <OrderCard order={o} key={o.id} />
      })}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </PageWrapper>
  )
}

function OrderFilterSelect() {
  const t = useTranslations("Dashboard.AccountSubscriptionOrders")

  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const status = searchParams.get("status")

  const updateStatusFilter = ({ status }: { status: string }) => {
    const params = new URLSearchParams(
      status === "All" ? undefined : `status=${status}`,
    )

    startTransition(() => {
      router.push(`${pathname}?${params}` as Route)
    })
  }

  return (
    <SelectFilter
      label={t("StatusFilter")}
      enumList={Object.values(OrderStatusEnum)}
      value={status ?? "All"}
      onValueChange={(value: string) => updateStatusFilter({ status: value })}
      disabled={isPending}
    />
  )
}
