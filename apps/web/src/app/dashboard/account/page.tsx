//Account page

import DashboardHeader from "@/components/header/dashboardHeader"
import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import AccountPageComponent from "./account"

export const metadata: Metadata = {
  title: `Account - ${pageTitle}`,
  description: pageDescription,
}

export default async function AccountPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const userDetails = await userServices.findUserDetailsById(currentUser.userId)
  if (!userDetails) {
    notFound()
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account"} />
      <AccountDetailHeaderTabs selectedTab="Account" />
      <AccountPageComponent
        account={userDetails}
        sessionLoginAt={currentUser.createdAt}
      />
    </MainWrapper>
  )
}
