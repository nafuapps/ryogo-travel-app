import { Small } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

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
    <div className="flex rounded bg-slate-300 flex-row gap-1 lg:gap-1.5 p-1 lg:p-1.5 self-center my-2 lg:my-3">
      {(Object.keys(links) as AccountDetailHeaderTab[]).map((tab) => (
        <Link href={links[tab]} key={tab}>
          <div
            className={`flex items-center rounded justify-center px-2 py-1 lg:px-3 lg:py-1.5 ${
              props.selectedTab === tab ? "bg-white shadow" : ""
            }`}
          >
            <Small>{t(tab)}</Small>
          </div>
        </Link>
      ))}
    </div>
  )
}
