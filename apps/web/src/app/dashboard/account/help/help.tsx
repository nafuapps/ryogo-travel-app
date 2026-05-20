//Account/Help page

import { getTranslations } from "next-intl/server"
import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import { SectionWrapper, PageWrapper } from "@/components/page/pageWrappers"

//TODO: Account Help page

export default async function AccountHelpPageComponent({
  id,
  isOwner,
}: {
  id: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.AccountHelp")

  return (
    <PageWrapper id="AccountHelpPage">
      <AccountDetailHeaderTabs id={id} selectedTab="Help" />
      <SectionWrapper id="AccountHelpInfo">
        <></>
      </SectionWrapper>
    </PageWrapper>
  )
}
