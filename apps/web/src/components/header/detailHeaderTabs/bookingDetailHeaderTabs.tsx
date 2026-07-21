import { RyogoH2 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"

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
    <div className="flex flex-col md:flex-row justify-between items-center">
      <SectionRowWrapper>
        <RyogoH2 color="brand">{id}</RyogoH2>
        <CopyClipboardButton label={id} />
      </SectionRowWrapper>
      <DetailsHeaderTabWrapper>
        {(Object.keys(links) as BookingDetailHeaderTab[]).map((tab) => (
          <Link href={links[tab]} key={tab}>
            <DetailsHeaderTabItem
              label={t(tab)}
              selected={selectedTab === tab}
            />
          </Link>
        ))}
      </DetailsHeaderTabWrapper>
    </div>
  )
}
