import { getTranslations } from "next-intl/server"
import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"

type CustomerDetailHeaderTab = "Customer" | "Upcoming" | "Completed"

export default async function CustomerDetailHeaderTabs({
  id,
  selectedTab,
}: {
  id: string
  selectedTab: CustomerDetailHeaderTab
}) {
  const t = await getTranslations("Dashboard.CustomerDetailsHeaderTabs")

  const links = {
    Customer: `/dashboard/customers/${id}`,
    Upcoming: `/dashboard/customers/${id}/upcoming`,
    Completed: `/dashboard/customers/${id}/completed`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}
