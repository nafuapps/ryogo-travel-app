import DashboardHeader from "@/components/header/dashboardHeader"
import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import AgencyDetailsPageComponent from "./agencyDetails"

export const metadata: Metadata = {
  title: `Agency - ${pageTitle}`,
  description: pageDescription,
}

export default async function AgencyDetailsPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    notFound()
  }

  const isOwner = currentUser.userRole === UserRolesEnum.OWNER
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/agency"} />
      <AccountDetailHeaderTabs selectedTab="Agency" />
      <AgencyDetailsPageComponent agency={agency} isOwner={isOwner} />
    </MainWrapper>
  )
}
