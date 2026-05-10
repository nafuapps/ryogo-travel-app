import { RyogoH2 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

type BookingDetailHeaderTab =
  | "Details"
  | "Transactions"
  | "TripLogs"
  | "Expenses"

type BookingDetailHeaderTabsProps = {
  selectedTab: BookingDetailHeaderTab
  id: string
}
export default async function BookingDetailHeaderTabs(
  props: BookingDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.BookingDetailsHeaderTabs")
  const links = {
    Details: `/dashboard/bookings/${props.id}`,
    Transactions: `/dashboard/bookings/${props.id}/transactions`,
    TripLogs: `/dashboard/bookings/${props.id}/trip-logs`,
    Expenses: `/dashboard/bookings/${props.id}/expenses`,
  } as const

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <RyogoH2 color="brand">{props.id}</RyogoH2>
      <DetailsHeaderTabWrapper>
        {(Object.keys(links) as BookingDetailHeaderTab[]).map((tab) => (
          <Link href={links[tab]} key={tab}>
            <DetailsHeaderTabItem
              label={t(tab)}
              selected={props.selectedTab === tab}
            />
          </Link>
        ))}
      </DetailsHeaderTabWrapper>
    </div>
  )
}
