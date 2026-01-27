//Account/Help page

import { getTranslations } from "next-intl/server"
import AccountDetailHeaderTabs from "../accountDetailHeaderTabs"
import { pageClassName } from "@/components/page/pageCommons"

//TODO: Account Help page

export default async function AccountHelpPageComponent() {
  const t = await getTranslations("Dashboard.AccountHelp")

  return (
    <div id="AccountHelpPage" className={pageClassName}>
      <AccountDetailHeaderTabs selectedTab="Help" />
      <div
        id="AccountHelpInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      ></div>
    </div>
  )
}
