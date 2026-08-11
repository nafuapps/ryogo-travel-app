import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

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
    <DetailsHeaderTabWrapper>
      {(Object.keys(links) as CustomerDetailHeaderTab[]).map((tab) => (
        <Link href={links[tab]} key={tab}>
          <DetailsHeaderTabItem label={t(tab)} selected={selectedTab === tab} />
        </Link>
      ))}
    </DetailsHeaderTabWrapper>
  )
}
