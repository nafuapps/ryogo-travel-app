import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"
import { useTranslations } from "next-intl"

type AccountDetailHeaderTab = "Account" | "Settings" | "Agency" | "Subscription"

export default function AccountDetailHeaderTabs({
  selectedTab,
}: {
  selectedTab: AccountDetailHeaderTab
}) {
  const t = useTranslations("Dashboard.AccountDetailsHeaderTabs")
  const links = {
    Account: `/dashboard/account`,
    Settings: `/dashboard/account/settings`,
    Agency: `/dashboard/account/agency`,
    Subscription: `/dashboard/account/subscription`,
  } as const

  return (
    <DetailsHeaderTabWrapper>
      {(Object.keys(links) as AccountDetailHeaderTab[]).map((tab) => (
        <Link href={links[tab]} key={tab}>
          <DetailsHeaderTabItem label={t(tab)} selected={selectedTab === tab} />
        </Link>
      ))}
    </DetailsHeaderTabWrapper>
  )
}
