import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

type AccountDetailHeaderTab = "Details" | "Settings" | "Agency" | "Help"

type AccountDetailHeaderTabsProps = {
  selectedTab: AccountDetailHeaderTab
}
export default async function AccountDetailHeaderTabs(
  props: AccountDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.AccountDetailsHeaderTabs")
  const links = {
    Details: `/dashboard/account`,
    Settings: `/dashboard/account/settings`,
    Agency: `/dashboard/account/agency`,
    Help: `/dashboard/account/help`,
  } as const

  return (
    <DetailsHeaderTabWrapper>
      {(Object.keys(links) as AccountDetailHeaderTab[]).map((tab) => (
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
