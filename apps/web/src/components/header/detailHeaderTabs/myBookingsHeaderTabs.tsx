import { getTranslations } from "next-intl/server"
import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"

type MyBookingsHeaderTab = "Upcoming" | "Completed"

export default async function MyBookingsHeaderTabs({
  selectedTab,
}: {
  selectedTab: MyBookingsHeaderTab
}) {
  const t = await getTranslations("Rider.MyBookingsHeaderTabs")
  const links = {
    Upcoming: `/rider/myBookings`,
    Completed: `/rider/myBookings/completed`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}
