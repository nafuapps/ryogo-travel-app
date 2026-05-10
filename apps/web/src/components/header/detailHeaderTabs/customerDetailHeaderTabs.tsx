import { RyogoH2 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

type CustomerDetailHeaderTab = "Details" | "Upcoming" | "Completed"

type CustomerDetailHeaderTabsProps = {
  selectedTab: CustomerDetailHeaderTab
  id: string
}
export default async function CustomerDetailHeaderTabs(
  props: CustomerDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.CustomerDetailsHeaderTabs")

  const links = {
    Details: `/dashboard/customers/${props.id}`,
    Upcoming: `/dashboard/customers/${props.id}/upcoming`,
    Completed: `/dashboard/customers/${props.id}/completed`,
  } as const

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <RyogoH2 color="brand">{props.id}</RyogoH2>
      <DetailsHeaderTabWrapper>
        {(Object.keys(links) as CustomerDetailHeaderTab[]).map((tab) => (
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
