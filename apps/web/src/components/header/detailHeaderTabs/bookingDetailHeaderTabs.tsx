import { getTranslations } from "next-intl/server"
import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"

type BookingDetailHeaderTab =
  | "Booking"
  | "Transactions"
  | "Expenses"
  | "TripLogs"

export default async function BookingDetailHeaderTabs({
  id,
  selectedTab,
}: {
  id: string
  selectedTab: BookingDetailHeaderTab
}) {
  const t = await getTranslations("Dashboard.BookingDetailsHeaderTabs")
  const links = {
    Booking: `/dashboard/bookings/${id}`,
    Transactions: `/dashboard/bookings/${id}/transactions`,
    Expenses: `/dashboard/bookings/${id}/expenses`,
    TripLogs: `/dashboard/bookings/${id}/trip-logs`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}
