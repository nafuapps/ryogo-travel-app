import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"
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
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}
