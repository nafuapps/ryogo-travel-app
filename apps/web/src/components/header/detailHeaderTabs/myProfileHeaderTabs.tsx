import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"
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
    <DetailsHeaderTabWrapper>
      {(Object.keys(links) as MyProfileDetailHeaderTab[]).map((tab) => (
        <Link href={links[tab]} key={tab}>
          <DetailsHeaderTabItem label={t(tab)} selected={selectedTab === tab} />
        </Link>
      ))}
    </DetailsHeaderTabWrapper>
  )
}
