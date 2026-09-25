import { getTranslations } from "next-intl/server"
import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"

type BookingDetailHeaderTab = "Booking" | "Expenses" | "TripLogs"

export default async function MyBookingDetailHeaderTabs({
  id,
  selectedTab,
}: {
  id: string
  selectedTab: BookingDetailHeaderTab
}) {
  const t = await getTranslations("Dashboard.BookingDetailsHeaderTabs")
  const links = {
    Booking: `/rider/myBookings/${id}`,
    Expenses: `/rider/myBookings/${id}/expenses`,
    TripLogs: `/rider/myBookings/${id}/trip-logs`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}
