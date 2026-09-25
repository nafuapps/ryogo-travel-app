import { getTranslations } from "next-intl/server"
import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"

type AllBookingsHeaderTab = "Home" | "Leads" | "Completed" | "Cancelled"

export default async function AllBookingsHeaderTabs({
  selectedTab,
}: {
  selectedTab: AllBookingsHeaderTab
}) {
  const t = await getTranslations("Dashboard.AllBookingsHeaderTabs")
  const links = {
    Home: `/dashboard/bookings`,
    Leads: `/dashboard/bookings/leads`,
    Completed: `/dashboard/bookings/completed`,
    Cancelled: `/dashboard/bookings/cancelled`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}
