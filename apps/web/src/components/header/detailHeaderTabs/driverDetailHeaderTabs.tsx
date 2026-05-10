import { RyogoH2 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

type DriverDetailHeaderTab = "Details" | "Assigned" | "Completed" | "Leaves"

type DriverDetailHeaderTabsProps = {
  selectedTab: DriverDetailHeaderTab
  id: string
}
export default async function DriverDetailHeaderTabs(
  props: DriverDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.DriverDetailsHeaderTabs")

  const links = {
    Details: `/dashboard/drivers/${props.id}`,
    Assigned: `/dashboard/drivers/${props.id}/assigned`,
    Completed: `/dashboard/drivers/${props.id}/completed`,
    Leaves: `/dashboard/drivers/${props.id}/leaves`,
  } as const

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <RyogoH2 color="brand">{props.id}</RyogoH2>
      <DetailsHeaderTabWrapper>
        {(Object.keys(links) as DriverDetailHeaderTab[]).map((tab) => (
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
