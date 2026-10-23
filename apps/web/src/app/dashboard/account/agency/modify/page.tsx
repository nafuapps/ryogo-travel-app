//Account/agency/modify page (only accessible by owner)

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { notFound, redirect, RedirectType } from "next/navigation"
import ModifyAgencyPageForm from "./modifyAgency"

export const metadata: Metadata = {
  title: `Modify Agency - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyAgencyPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    notFound()
  }

  //Only owner can modify agency details
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard/account/agency", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/agency/modify"} />
      <ModifyAgencyPageForm agency={agency} userId={currentUser.userId} />
    </MainWrapper>
  )
}
