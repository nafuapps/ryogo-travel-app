import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

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
    <DetailsHeaderTabWrapper>
      {(Object.keys(links) as BookingDetailHeaderTab[]).map((tab) => (
        <Link href={links[tab]} key={tab}>
          <DetailsHeaderTabItem label={t(tab)} selected={selectedTab === tab} />
        </Link>
      ))}
    </DetailsHeaderTabWrapper>
  )
}
