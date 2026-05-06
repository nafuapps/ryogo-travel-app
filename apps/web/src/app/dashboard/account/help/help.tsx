//Account/Help page

import { getTranslations } from "next-intl/server"
import AccountDetailHeaderTabs from "@/components/header/accountDetailHeaderTabs"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"

//TODO: Account Help page

export default async function AccountHelpPageComponent() {
  const t = await getTranslations("Dashboard.AccountHelp")

  return (
    <PageWrapper id="AccountHelpPage">
      <AccountDetailHeaderTabs selectedTab="Help" />
      <ContentWrapper id="AccountHelpInfo">
        <></>
      </ContentWrapper>
    </PageWrapper>
  )
}
