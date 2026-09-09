import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

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
    <DetailsHeaderTabWrapper>
      {(Object.keys(links) as BookingDetailHeaderTab[]).map((tab) => (
        <Link href={links[tab]} key={tab}>
          <DetailsHeaderTabItem label={t(tab)} selected={selectedTab === tab} />
        </Link>
      ))}
    </DetailsHeaderTabWrapper>
  )
}
