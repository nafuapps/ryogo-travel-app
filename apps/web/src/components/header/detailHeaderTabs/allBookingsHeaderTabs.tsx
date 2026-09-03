import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

type AllBookingsHeaderTab = "Bookings" | "Leads" | "Completed" | "Cancelled"

export default async function AllBookingsHeaderTabs({
  selectedTab,
}: {
  selectedTab: AllBookingsHeaderTab
}) {
  const t = await getTranslations("Dashboard.AllBookingsHeaderTabs")
  const links = {
    Bookings: `/dashboard/bookings`,
    Leads: `/dashboard/bookings/leads`,
    Completed: `/dashboard/bookings/completed`,
    Cancelled: `/dashboard/bookings/cancelled`,
  } as const

  return (
    <DetailsHeaderTabWrapper>
      {(Object.keys(links) as AllBookingsHeaderTab[]).map((tab) => (
        <Link href={links[tab]} key={tab}>
          <DetailsHeaderTabItem label={t(tab)} selected={selectedTab === tab} />
        </Link>
      ))}
    </DetailsHeaderTabWrapper>
  )
}
