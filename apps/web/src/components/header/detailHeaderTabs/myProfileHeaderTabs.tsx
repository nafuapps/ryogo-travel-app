import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"
import { useTranslations } from "next-intl"

type MyProfileDetailHeaderTab = "Account" | "Settings" | "Agency"

export default function MyProfileDetailHeaderTabs({
  selectedTab,
}: {
  selectedTab: MyProfileDetailHeaderTab
}) {
  const t = useTranslations("Dashboard.AccountDetailsHeaderTabs")
  const links = {
    Account: `/rider/myProfile`,
    Settings: `/rider/myProfile/settings`,
    Agency: `/rider/myProfile/agency`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}
