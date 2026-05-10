import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

type MyProfileDetailHeaderTab = "Details" | "Settings" | "Agency" | "Help"

type MyProfileDetailHeaderTabsProps = {
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
  )
}
