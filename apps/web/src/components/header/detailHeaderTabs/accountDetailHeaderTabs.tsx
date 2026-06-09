import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"
import { RyogoH2 } from "@/components/typography"

type AccountDetailHeaderTab = "Account" | "Settings" | "Agency" | "Help"

type AccountDetailHeaderTabsProps = {
  id: string
  selectedTab: AccountDetailHeaderTab
}
export default async function AccountDetailHeaderTabs(
  props: AccountDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.AccountDetailsHeaderTabs")
  const links = {
    Account: `/dashboard/account`,
    Settings: `/dashboard/account/settings`,
    Agency: `/dashboard/account/agency`,
    Help: `/dashboard/account/help`,
  } as const

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <RyogoH2 color="brand">{props.id}</RyogoH2>
      <DetailsHeaderTabWrapper>
        {(Object.keys(links) as AccountDetailHeaderTab[]).map((tab) => (
          <Link href={links[tab]} key={tab}>
            <DetailsHeaderTabItem
              label={t(tab)}
              selected={props.selectedTab === tab}
            />
          </Link>
        ))}
      </DetailsHeaderTabWrapper>{" "}
    </div>
  )
}
