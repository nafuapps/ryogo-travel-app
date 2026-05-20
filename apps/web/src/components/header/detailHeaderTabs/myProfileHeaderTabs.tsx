import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"
import { RyogoH2 } from "@/components/typography"

type MyProfileDetailHeaderTab = "Details" | "Settings" | "Agency" | "Help"

type MyProfileDetailHeaderTabsProps = {
  id: string
  selectedTab: MyProfileDetailHeaderTab
}
export default async function MyProfileDetailHeaderTabs(
  props: MyProfileDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.AccountDetailsHeaderTabs")
  const links = {
    Details: `/rider/myProfile`,
    Settings: `/rider/myProfile/settings`,
    Agency: `/rider/myProfile/agency`,
    Help: `/rider/myProfile/help`,
  } as const

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <RyogoH2 color="brand">{props.id}</RyogoH2>
      <DetailsHeaderTabWrapper>
        {(Object.keys(links) as MyProfileDetailHeaderTab[]).map((tab) => (
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
